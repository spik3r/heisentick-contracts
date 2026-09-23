package contracts

import (
	"bytes"
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"sort"
	"strings"
	"sync"

	"github.com/santhosh-tekuri/jsonschema/v6"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

//go:embed schemas/*.schema.json
var schemaFS embed.FS

// Document names are the `schema` field value each document carries. The
// table maps them to the schema file (and JSON pointer, for the queue
// messages that share one file).
var documents = map[string]map[int]struct{ file, pointer string }{
	"heisentick/bar-binary-layout":          {1: {"bar-binary-layout.v1.schema.json", ""}},
	"heisentick/candle-snapshot-manifest":   {1: {"candle-snapshot-manifest.v1.schema.json", ""}},
	"heisentick/validation-run-manifest":    {1: {"validation-run-manifest.v1.schema.json", ""}, 2: {"validation-run-manifest.v2.schema.json", ""}},
	"heisentick/validation-run-request":     {1: {"validation-run-request.v1.schema.json", ""}},
	"heisentick/validation-run-result":      {1: {"validation-run-result.v1.schema.json", ""}, 2: {"validation-run-result.v2.schema.json", ""}},
	"heisentick/validation-request-message": {1: {"validation-queue-messages.v1.schema.json", "/$defs/validationRequestMessage"}},
	"heisentick/validation-result-message":  {1: {"validation-queue-messages.v1.schema.json", "/$defs/validationResultMessage"}},
}

// DocumentNames lists every schema name this release validates.
func DocumentNames() []string {
	names := make([]string, 0, len(documents))
	for name := range documents {
		names = append(names, name)
	}
	sort.Strings(names)
	return names
}

// ContractError is returned when a document does not satisfy its schema, or
// declares a schema this package does not know.
type ContractError struct {
	Schema string
	Issues []string
}

func (e *ContractError) Error() string {
	if len(e.Issues) == 0 {
		return fmt.Sprintf("contract %s rejected", e.Schema)
	}
	more := ""
	if len(e.Issues) > 1 {
		more = fmt.Sprintf(" (+%d more)", len(e.Issues)-1)
	}
	return fmt.Sprintf("contract %s rejected: %s%s", e.Schema, e.Issues[0], more)
}

var englishPrinter = message.NewPrinter(language.English)

var (
	compileOnce sync.Once
	compiled    map[string]map[int]*jsonschema.Schema
	compileErr  error
)

func compileAll() {
	compiler := jsonschema.NewCompiler()
	compiler.DefaultDraft(jsonschema.Draft2020)
	entries, err := fs.ReadDir(schemaFS, "schemas")
	if err != nil {
		compileErr = err
		return
	}
	for _, entry := range entries {
		raw, err := schemaFS.ReadFile("schemas/" + entry.Name())
		if err != nil {
			compileErr = err
			return
		}
		doc, err := jsonschema.UnmarshalJSON(bytes.NewReader(raw))
		if err != nil {
			compileErr = fmt.Errorf("%s: %w", entry.Name(), err)
			return
		}
		// Register under the bare file name, which is what every $ref and $id uses.
		if err := compiler.AddResource(entry.Name(), doc); err != nil {
			compileErr = fmt.Errorf("%s: %w", entry.Name(), err)
			return
		}
	}
	compiled = make(map[string]map[int]*jsonschema.Schema, len(documents))
	for name, versions := range documents {
		compiled[name] = make(map[int]*jsonschema.Schema, len(versions))
		for version, loc := range versions {
			ref := loc.file
			if loc.pointer != "" {
				ref += "#" + loc.pointer
			}
			schema, err := compiler.Compile(ref)
			if err != nil {
				compileErr = fmt.Errorf("compile %s: %w", ref, err)
				return
			}
			compiled[name][version] = schema
		}
	}
}

func schemaFor(name string, version int) (*jsonschema.Schema, error) {
	compileOnce.Do(compileAll)
	if compileErr != nil {
		return nil, compileErr
	}
	versions, ok := compiled[name]
	if !ok {
		return nil, &ContractError{Schema: name, Issues: []string{"unknown document schema"}}
	}
	schema, ok := versions[version]
	if !ok {
		return nil, &ContractError{Schema: name, Issues: []string{fmt.Sprintf("unknown document version %d", version)}}
	}
	return schema, nil
}

// Validate checks raw JSON against the named document schema and, on
// success, returns the decoded value (numbers as json.Number, so nothing is
// rounded before the caller decides).
func Validate(name string, raw []byte) (any, error) {
	var head struct {
		Version int `json:"version"`
	}
	if err := json.Unmarshal(raw, &head); err != nil {
		return nil, &ContractError{Schema: name, Issues: []string{"invalid JSON: " + err.Error()}}
	}
	schema, err := schemaFor(name, head.Version)
	if err != nil {
		return nil, err
	}
	value, err := jsonschema.UnmarshalJSON(bytes.NewReader(raw))
	if err != nil {
		return nil, &ContractError{Schema: name, Issues: []string{"invalid JSON: " + err.Error()}}
	}
	if err := schema.Validate(value); err != nil {
		return nil, &ContractError{Schema: name, Issues: flatten(err)}
	}
	if issues := crossFieldIssues(name, value); len(issues) > 0 {
		return nil, &ContractError{Schema: name, Issues: issues}
	}
	return value, nil
}

// crossFieldIssues holds the rules that span fields; mirrored in
// ts/src/index.ts. The schema states the shapes, this states the
// implications.
func crossFieldIssues(name string, value any) []string {
	doc, _ := value.(map[string]any)
	if doc == nil {
		return nil
	}
	var issues []string
	if name == "heisentick/validation-run-manifest" {
		if version, _ := doc["version"].(json.Number); version.String() == "2" {
			engine, _ := doc["engine"].(map[string]any)
			artifact, _ := engine["stratReleaseArtifact"].(map[string]any)
			expected, _ := engine["expectedLinkedModule"].(map[string]any)
			if artifact["release"] != expected["release"] {
				issues = append(issues, "engine.expectedLinkedModule.release: must equal engine.stratReleaseArtifact.release")
			}
		}
	}
	if name == "heisentick/validation-run-result" {
		execution, _ := doc["execution"].(map[string]any)
		if execution != nil && execution["status"] == "succeeded" {
			artifacts, _ := doc["artifacts"].(map[string]any)
			if artifacts == nil || artifacts["report"] == nil {
				issues = append(issues, "artifacts.report: required when execution.status is succeeded")
			}
			if doc["headline"] == nil {
				issues = append(issues, "headline: must not be null when execution.status is succeeded")
			}
			if version, _ := doc["version"].(json.Number); version.String() == "2" {
				engine, _ := doc["engine"].(map[string]any)
				linked, _ := engine["linkedEngine"].(map[string]any)
				if linked == nil || linked["status"] != "measured" {
					issues = append(issues, "engine.linkedEngine.status: must be measured when execution.status is succeeded")
				}
			}
		}
	}
	return issues
}

// ValidateAny dispatches on the document's own `schema` field.
func ValidateAny(raw []byte) (name string, value any, err error) {
	var head struct {
		Schema *string `json:"schema"`
	}
	if err := json.Unmarshal(raw, &head); err != nil {
		return "", nil, &ContractError{Schema: "", Issues: []string{"invalid JSON: " + err.Error()}}
	}
	if head.Schema == nil {
		return "", nil, &ContractError{Schema: "", Issues: []string{"missing schema field"}}
	}
	value, err = Validate(*head.Schema, raw)
	return *head.Schema, value, err
}

// Decode validates raw JSON and unmarshals it into out (normally one of the
// generated gen.* structs). Validation happens first, so a struct never
// carries a value the schema rejects.
func Decode(name string, raw []byte, out any) error {
	if _, err := Validate(name, raw); err != nil {
		return err
	}
	return json.Unmarshal(raw, out)
}

func flatten(err error) []string {
	ve, ok := err.(*jsonschema.ValidationError)
	if !ok {
		return []string{err.Error()}
	}
	var out []string
	var walk func(e *jsonschema.ValidationError)
	walk = func(e *jsonschema.ValidationError) {
		if len(e.Causes) == 0 {
			loc := "$"
			if len(e.InstanceLocation) > 0 {
				loc = strings.Join(e.InstanceLocation, ".")
			}
			out = append(out, loc+": "+e.ErrorKind.LocalizedString(englishPrinter))
			return
		}
		for _, c := range e.Causes {
			walk(c)
		}
	}
	walk(ve)
	return out
}
