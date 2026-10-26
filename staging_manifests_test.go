package contracts

import (
	"encoding/hex"
	"encoding/json"
	"os"
	"testing"
)

func TestStagingManifestFixtures(t *testing.T) {
	raw, err := os.ReadFile("test/fixtures/staging-manifests.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixture struct {
		Cases []struct {
			Name     string          `json:"name"`
			BodyHex  string          `json:"bodyHex"`
			Manifest json.RawMessage `json:"manifest"`
		} `json:"cases"`
		States []struct {
			Name     string          `json:"name"`
			Manifest json.RawMessage `json:"manifest"`
		} `json:"states"`
		Invalid []struct {
			Name     string          `json:"name"`
			Manifest json.RawMessage `json:"manifest"`
		} `json:"invalidManifests"`
	}
	if err := json.Unmarshal(raw, &fixture); err != nil {
		t.Fatal(err)
	}
	for _, c := range fixture.Cases {
		t.Run(c.Name, func(t *testing.T) {
			var m stagingManifest
			if err := json.Unmarshal(c.Manifest, &m); err != nil {
				t.Fatal(err)
			}
			bytes, err := hex.DecodeString(c.BodyHex)
			if err != nil {
				t.Fatal(err)
			}
			if err := VerifyStagingManifestBytes(c.Manifest, bytes, m.Schema, m.Payload.Key, int64(len(bytes))); err != nil {
				t.Fatal(err)
			}
			for _, data := range [][]byte{bytes[1:], append([]byte("x"), bytes[1:]...)} {
				if err := VerifyStagingManifestBytes(c.Manifest, data, m.Schema, m.Payload.Key, int64(len(bytes))); err == nil {
					t.Fatal("changed bytes accepted")
				}
			}
			if err := VerifyStagingManifestBytes(c.Manifest, bytes, m.Schema, "staging/other/payload.json", int64(len(bytes))); err == nil {
				t.Fatal("wrong caller key accepted")
			}
			if err := VerifyStagingManifestBytes(c.Manifest, bytes, m.Schema, m.Payload.Key, int64(len(bytes)-1)); err == nil {
				t.Fatal("oversized payload accepted")
			}
		})
	}
	for _, c := range fixture.States {
		t.Run(c.Name, func(t *testing.T) {
			if _, _, err := ValidateAny(c.Manifest); err != nil {
				t.Fatal(err)
			}
		})
	}
	for _, c := range fixture.Invalid {
		t.Run(c.Name, func(t *testing.T) {
			if _, _, err := ValidateAny(c.Manifest); err == nil {
				t.Fatal("invalid manifest accepted")
			}
		})
	}
}
