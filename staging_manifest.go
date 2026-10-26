package contracts

import (
	"encoding/json"
	"fmt"
	"time"
)

// StagingPayload binds the exact object key and uploaded bytes. The caller
// separately binds its job/request/route and validates actual row metadata.
type StagingPayload struct {
	Key        string `json:"key"`
	ByteLength int64  `json:"byteLength"`
	SHA256     string `json:"sha256"`
}

type stagingManifest struct {
	Requested struct {
		From string `json:"from"`
		To   string `json:"to"`
	} `json:"requested"`
	Schema     string          `json:"schema"`
	JobID      string          `json:"jobId"`
	Symbol     string          `json:"symbol"`
	Timeframe  string          `json:"timeframe"`
	DatasetID  string          `json:"datasetId"`
	Files      []string        `json:"files"`
	Payload    *StagingPayload `json:"payload"`
	Count      int64           `json:"count"`
	From       *string         `json:"from"`
	To         *string         `json:"to"`
	Complete   bool            `json:"complete"`
	Error      json.RawMessage `json:"error"`
	ResumeFrom *string         `json:"resumeFrom"`
}

func stagingManifestIssues(value any) []string {
	raw, err := json.Marshal(value)
	if err != nil {
		return []string{"invalid staging manifest"}
	}
	var d stagingManifest
	if json.Unmarshal(raw, &d) != nil {
		return []string{"invalid staging manifest"}
	}
	hasError := string(d.Error) != "null" && len(d.Error) > 0 && string(d.Error) != `""`
	resume := d.ResumeFrom != nil && *d.ResumeFrom != ""
	if len(d.Files) == 0 {
		if d.Payload != nil || d.Count != 0 || d.From != nil || d.To != nil || d.Complete || !hasError || resume {
			return []string{"terminal staging manifest must revoke payload metadata"}
		}
		return nil
	}
	key := fmt.Sprintf("staging/%s/%s/%s.json", d.JobID, d.Symbol, d.Timeframe)
	if d.Schema == "heisentick/cot-job-manifest" {
		key = fmt.Sprintf("staging/%s/cot/%s.json", d.JobID, d.DatasetID)
	}
	if d.Files[0] != key || d.Payload == nil || d.Payload.Key != key {
		return []string{"payload key must equal the exact job route key"}
	}
	if (d.Count == 0 && (d.From != nil || d.To != nil)) || (d.Count > 0 && (d.From == nil || d.To == nil || *d.From > *d.To)) {
		return []string{"count and actual bounds disagree"}
	}
	if d.Complete && (hasError || resume) {
		return []string{"complete staging manifest cannot carry error or resume state"}
	}
	if !d.Complete && (d.Schema == "heisentick/cot-job-manifest" || !resume) {
		return []string{"incomplete staging payload requires candle resume state"}
	}
	if !d.Complete && resume {
		r, re := stagingTime(*d.ResumeFrom)
		f, fe := stagingTime(d.Requested.From)
		t, te := stagingTime(d.Requested.To)
		if re != nil || fe != nil || te != nil || r.Before(f) || r.After(t) {
			return []string{"resume point must remain within requested bounds"}
		}
	}
	return nil
}

func stagingTime(value string) (time.Time, error) {
	layout := "2006-01-02T15:04:05.000Z"
	if len(value) == 10 {
		layout = "2006-01-02"
	}
	parsed, err := time.Parse(layout, value)
	if err != nil || parsed.Format(layout) != value {
		return time.Time{}, fmt.Errorf("noncanonical staging time")
	}
	return parsed, nil
}

// VerifyStagingManifestBytes validates a v2 manifest and its exact supplied
// payload bytes using the merged A0 verifier. Reading must already be bounded.
// expectedKey comes from the caller's request, never from the manifest itself.
func VerifyStagingManifestBytes(manifestJSON, data []byte, schema, expectedKey string, maxBytes int64) error {
	if schema != "heisentick/download-job-manifest" && schema != "heisentick/cot-job-manifest" {
		return fmt.Errorf("unknown staging schema")
	}
	if _, err := Validate(schema, manifestJSON); err != nil {
		return err
	}
	var manifest stagingManifest
	if err := json.Unmarshal(manifestJSON, &manifest); err != nil {
		return err
	}
	if manifest.Payload == nil || len(manifest.Files) != 1 || manifest.Payload.Key != expectedKey {
		return fmt.Errorf("staging manifest names a different payload key")
	}
	return VerifyStagedBytes(data, manifest.Payload.ByteLength, manifest.Payload.SHA256, maxBytes)
}
