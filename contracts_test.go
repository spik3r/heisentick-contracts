package contracts

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/spik3r/heisentick-contracts/gen"
)

// Fixture directory → document schema name. Mirrors test/contracts.test.ts so
// both languages judge the same files.
var fixtureDocs = map[string]string{
	"bar-binary-layout.v1":            "heisentick/bar-binary-layout",
	"candle-snapshot-manifest.v1":     "heisentick/candle-snapshot-manifest",
	"validation-run-manifest.v1":      "heisentick/validation-run-manifest",
	"validation-run-request.v1":       "heisentick/validation-run-request",
	"validation-run-result.v1":        "heisentick/validation-run-result",
	"validation-run-result-failed.v1": "heisentick/validation-run-result",
	"validation-request-message.v1":   "heisentick/validation-request-message",
	"validation-result-message.v1":    "heisentick/validation-result-message",
}

func readFixtures(t *testing.T, dir, kind string) map[string][]byte {
	t.Helper()
	entries, err := os.ReadDir(filepath.Join("fixtures", dir, kind))
	if err != nil {
		t.Fatalf("read %s/%s: %v", dir, kind, err)
	}
	out := map[string][]byte{}
	for _, e := range entries {
		raw, err := os.ReadFile(filepath.Join("fixtures", dir, kind, e.Name()))
		if err != nil {
			t.Fatal(err)
		}
		out[e.Name()] = raw
	}
	return out
}

func TestFixturesValidateLikeTypeScript(t *testing.T) {
	for dir, name := range fixtureDocs {
		for file, raw := range readFixtures(t, dir, "valid") {
			if _, err := Validate(name, raw); err != nil {
				t.Errorf("%s/valid/%s: %v", dir, file, err)
			}
			gotName, _, err := ValidateAny(raw)
			if err != nil || gotName != name {
				t.Errorf("%s/valid/%s: ValidateAny → %q, %v", dir, file, gotName, err)
			}
		}
		for file, raw := range readFixtures(t, dir, "invalid") {
			_, err := Validate(name, raw)
			if err == nil {
				t.Errorf("%s/invalid/%s: expected rejection", dir, file)
				continue
			}
			if _, ok := err.(*ContractError); !ok {
				t.Errorf("%s/invalid/%s: expected ContractError, got %T", dir, file, err)
			}
		}
	}
}

func TestUnknownSchemaIsAnError(t *testing.T) {
	if _, err := Validate("heisentick/nope", []byte(`{}`)); err == nil || !strings.Contains(err.Error(), "unknown document schema") {
		t.Fatalf("expected unknown schema error, got %v", err)
	}
	if _, _, err := ValidateAny([]byte(`{"version":1}`)); err == nil || !strings.Contains(err.Error(), "missing schema field") {
		t.Fatalf("expected missing schema error, got %v", err)
	}
}

func TestDecodeIntoGeneratedStruct(t *testing.T) {
	raw, err := os.ReadFile("fixtures/candle-snapshot-manifest.v1/valid/example.json")
	if err != nil {
		t.Fatal(err)
	}
	var m gen.CandleSnapshotManifestV1
	if err := Decode("heisentick/candle-snapshot-manifest", raw, &m); err != nil {
		t.Fatal(err)
	}
	if m.Symbol != "XAUUSD" || m.Count != 2 || string(m.Timeframe) != "1m" {
		t.Fatalf("unexpected decode: %+v", m)
	}
	bad := strings.Replace(string(raw), `"timeframe": "1m"`, `"timeframe": "2h"`, 1)
	if err := Decode("heisentick/candle-snapshot-manifest", []byte(bad), &m); err == nil {
		t.Fatal("Decode must validate before unmarshalling")
	}
}

func TestCanonicalCasesMatchTypeScript(t *testing.T) {
	raw, err := os.ReadFile("fixtures/canonical/cases.json")
	if err != nil {
		t.Fatal(err)
	}
	var cases []struct {
		Name      string          `json:"name"`
		Input     json.RawMessage `json:"input"`
		Canonical string          `json:"canonical"`
		SHA256    string          `json:"sha256"`
	}
	if err := json.Unmarshal(raw, &cases); err != nil {
		t.Fatal(err)
	}
	if len(cases) == 0 {
		t.Fatal("no canonical cases")
	}
	for _, c := range cases {
		got, err := CanonicalJSONBytes(c.Input)
		if err != nil {
			t.Errorf("%s: %v", c.Name, err)
			continue
		}
		if got != c.Canonical {
			t.Errorf("%s:\n got %s\nwant %s", c.Name, got, c.Canonical)
		}
		if c.SHA256 == "" {
			t.Errorf("%s: fixture not sealed (run scripts/seal-fixtures.mjs)", c.Name)
		} else if SHA256Hex(got) != c.SHA256 {
			t.Errorf("%s: sha256 mismatch", c.Name)
		}
	}
}

func TestGeneratedCanonicalCasesMatchTypeScript(t *testing.T) {
	raw, err := os.ReadFile("fixtures/canonical/generated-cases.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixture struct {
		Algorithm        string
		BoundedCaseCount int
		Cases            []struct {
			Name      string
			Seed      string
			Input     json.RawMessage
			Canonical string
			SHA256    string
		}
	}
	if err := json.Unmarshal(raw, &fixture); err != nil {
		t.Fatal(err)
	}
	if fixture.Algorithm != "lcg32-v1" {
		t.Fatalf("unexpected generated fixture algorithm %q", fixture.Algorithm)
	}
	if len(fixture.Cases) == 0 {
		t.Fatal("generated fixture has no canonical cases")
	}
	if len(fixture.Cases) != fixture.BoundedCaseCount {
		t.Fatalf("generated case count %d, want %d", len(fixture.Cases), fixture.BoundedCaseCount)
	}
	for _, c := range fixture.Cases {
		got, err := CanonicalJSONBytes(c.Input)
		if err != nil {
			t.Errorf("%s seed=%s: %v", c.Name, c.Seed, err)
			continue
		}
		if got != c.Canonical {
			t.Errorf("%s seed=%s:\n got %s\nwant %s", c.Name, c.Seed, got, c.Canonical)
		}
		if SHA256Hex(got) != c.SHA256 {
			t.Errorf("%s seed=%s: sha256 mismatch", c.Name, c.Seed)
		}
	}
}

func TestCanonicalRejectsNonFinite(t *testing.T) {
	if _, err := CanonicalJSON(map[string]any{"a": []any{1.0, mathInf()}}); err == nil || !strings.Contains(err.Error(), "$.a[1]") {
		t.Fatalf("expected non-finite error with path, got %v", err)
	}
	got, _ := CanonicalJSON(map[string]any{"b": negZero()})
	if got != `{"b":0}` {
		t.Fatalf("-0 must canonicalise to 0, got %s", got)
	}
}

func TestGeneratedFingerprintsMatchTypeScript(t *testing.T) {
	raw, err := os.ReadFile("fixtures/canonical/generated-cases.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixture struct {
		Fingerprints []struct {
			Name            string
			Seed            string
			Manifest        json.RawMessage
			IdentityVariant map[string]any
			MaterialVariant struct {
				Costs map[string]any
			}
			Fingerprint         string
			MaterialFingerprint string
		}
	}
	if err := json.Unmarshal(raw, &fixture); err != nil {
		t.Fatal(err)
	}
	if len(fixture.Fingerprints) == 0 {
		t.Fatal("generated fixture has no fingerprint cases")
	}
	for _, c := range fixture.Fingerprints {
		manifest := decodeJSONMap(t, c.Manifest)
		got, err := InputFingerprint(manifest)
		if err != nil {
			t.Errorf("%s seed=%s: %v", c.Name, c.Seed, err)
			continue
		}
		if got != c.Fingerprint {
			t.Errorf("%s seed=%s: fingerprint %s, want %s", c.Name, c.Seed, got, c.Fingerprint)
		}
		identity := cloneJSONMap(t, manifest)
		for key, value := range c.IdentityVariant {
			identity[key] = value
		}
		again, err := InputFingerprint(identity)
		if err != nil || again != got {
			t.Errorf("%s seed=%s: identity changed fingerprint to %s (%v)", c.Name, c.Seed, again, err)
		}
		material := cloneJSONMap(t, manifest)
		costs, ok := material["costs"].(map[string]any)
		if !ok {
			t.Fatalf("%s seed=%s: manifest costs is %T", c.Name, c.Seed, material["costs"])
		}
		for key, value := range c.MaterialVariant.Costs {
			costs[key] = value
		}
		changed, err := InputFingerprint(material)
		if err != nil || changed != c.MaterialFingerprint {
			t.Errorf("%s seed=%s: material fingerprint %s, want %s (%v)", c.Name, c.Seed, changed, c.MaterialFingerprint, err)
		}
		if changed == got {
			t.Errorf("%s seed=%s: material change kept fingerprint %s", c.Name, c.Seed, changed)
		}
	}
}

func TestInputFingerprintMatchesTypeScript(t *testing.T) {
	raw, err := os.ReadFile("fixtures/validation-run-manifest.v1/valid/example.json")
	if err != nil {
		t.Fatal(err)
	}
	want, err := os.ReadFile("fixtures/validation-run-manifest.v1/fingerprint.txt")
	if err != nil {
		t.Fatal(err)
	}
	value, err := Validate("heisentick/validation-run-manifest", raw)
	if err != nil {
		t.Fatal(err)
	}
	manifest := value.(map[string]any)
	got, err := InputFingerprint(manifest)
	if err != nil {
		t.Fatal(err)
	}
	if got != strings.TrimSpace(string(want)) {
		t.Fatalf("fingerprint %s, TypeScript wrote %s", got, strings.TrimSpace(string(want)))
	}
	manifest["runId"] = "9f3c1d2e-4a5b-4c6d-8e9f-0a1b2c3d4e5f"
	manifest["submittedAt"] = json.Number("1")
	again, _ := InputFingerprint(manifest)
	if again != got {
		t.Fatal("identity fields must not change the fingerprint")
	}
	costs := manifest["costs"].(map[string]any)
	costs["slippage"] = json.Number("0.07")
	changed, _ := InputFingerprint(manifest)
	if changed == got {
		t.Fatal("an input change must change the fingerprint")
	}
}

func decodeJSONMap(t *testing.T, raw json.RawMessage) map[string]any {
	t.Helper()
	dec := json.NewDecoder(strings.NewReader(string(raw)))
	dec.UseNumber()
	var value map[string]any
	if err := dec.Decode(&value); err != nil {
		t.Fatal(err)
	}
	return value
}

func cloneJSONMap(t *testing.T, value map[string]any) map[string]any {
	t.Helper()
	raw, err := json.Marshal(value)
	if err != nil {
		t.Fatal(err)
	}
	return decodeJSONMap(t, raw)
}
