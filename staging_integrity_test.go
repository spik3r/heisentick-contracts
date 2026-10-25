package contracts

import (
	"bytes"
	"encoding/hex"
	"encoding/json"
	"errors"
	"os"
	"strings"
	"testing"
)

type stagedByteFixture struct {
	Name       string               `json:"name"`
	BodyHex    string               `json:"bodyHex"`
	ByteLength int64                `json:"byteLength"`
	SHA256     string               `json:"sha256"`
	MaxBytes   int64                `json:"maxBytes"`
	WantError  StagedBytesErrorCode `json:"wantError"`
}

func TestVerifyStagedBytesSharedFixtures(t *testing.T) {
	raw, err := os.ReadFile("test/fixtures/staging-byte-integrity.json")
	if err != nil {
		t.Fatal(err)
	}
	var corpus struct {
		FormatVersion int                 `json:"formatVersion"`
		Cases         []stagedByteFixture `json:"cases"`
	}
	if err := json.Unmarshal(raw, &corpus); err != nil {
		t.Fatal(err)
	}
	if corpus.FormatVersion != 1 || len(corpus.Cases) == 0 {
		t.Fatal("unsupported or empty staging-byte fixture corpus")
	}
	seen := make(map[string]bool)
	codes := make(map[StagedBytesErrorCode]bool)
	for _, fixture := range corpus.Cases {
		if fixture.Name == "" || seen[fixture.Name] {
			t.Fatalf("empty or duplicate fixture name %q", fixture.Name)
		}
		seen[fixture.Name] = true
		codes[fixture.WantError] = true
		t.Run(fixture.Name, func(t *testing.T) {
			data, err := hex.DecodeString(fixture.BodyHex)
			if err != nil {
				t.Fatal(err)
			}
			before := bytes.Clone(data)
			err = VerifyStagedBytes(data, fixture.ByteLength, fixture.SHA256, fixture.MaxBytes)
			if !bytes.Equal(data, before) {
				t.Fatal("verification modified input bytes")
			}
			if fixture.WantError == "" {
				if err != nil {
					t.Fatalf("expected acceptance, got %v", err)
				}
				return
			}
			var integrityErr *StagedBytesError
			if !errors.As(err, &integrityErr) || integrityErr.Code != fixture.WantError {
				t.Fatalf("got %v, want %s", err, fixture.WantError)
			}
			if err.Error() != "staged bytes: "+string(fixture.WantError) {
				t.Fatalf("unexpected diagnostic %q", err.Error())
			}
		})
	}
	for _, code := range []StagedBytesErrorCode{"", StagedBytesInvalidLimit, StagedBytesInvalidByteLength,
		StagedBytesInvalidSHA256, StagedBytesLimitExceeded, StagedBytesByteLengthMismatch, StagedBytesSHA256Mismatch} {
		if !codes[code] {
			t.Errorf("fixture corpus has no case for %q", code)
		}
	}
}

func TestVerifyStagedBytesNilAndEmpty(t *testing.T) {
	const emptySHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
	for _, data := range [][]byte{nil, {}} {
		if err := VerifyStagedBytes(data, 0, emptySHA256, 0); err != nil {
			t.Fatal(err)
		}
	}
}

func TestVerifyStagedBytesRejectsEveryNonLowerHexByte(t *testing.T) {
	for character := 0; character <= 255; character++ {
		if (character >= '0' && character <= '9') || (character >= 'a' && character <= 'f') {
			continue
		}
		digest := strings.Repeat("0", 63) + string([]byte{byte(character)})
		var integrityErr *StagedBytesError
		err := VerifyStagedBytes(nil, 0, digest, 0)
		if !errors.As(err, &integrityErr) || integrityErr.Code != StagedBytesInvalidSHA256 {
			t.Errorf("digest byte %d: got %v", character, err)
		}
	}
}
