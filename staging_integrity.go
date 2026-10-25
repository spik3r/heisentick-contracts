package contracts

import (
	"crypto/sha256"
	"encoding/hex"
)

// StagedBytesErrorCode identifies why exact-byte verification failed. It does
// not expose payload contents, a supplied digest, or other caller metadata.
type StagedBytesErrorCode string

const (
	StagedBytesInvalidLimit       StagedBytesErrorCode = "invalid-limit"
	StagedBytesInvalidByteLength  StagedBytesErrorCode = "invalid-byte-length"
	StagedBytesInvalidSHA256      StagedBytesErrorCode = "invalid-sha256"
	StagedBytesLimitExceeded      StagedBytesErrorCode = "limit-exceeded"
	StagedBytesByteLengthMismatch StagedBytesErrorCode = "byte-length-mismatch"
	StagedBytesSHA256Mismatch     StagedBytesErrorCode = "sha256-mismatch"
)

// StagedBytesError is returned by VerifyStagedBytes. Callers can use errors.As
// and Code rather than inspecting a formatted diagnostic.
type StagedBytesError struct {
	Code StagedBytesErrorCode
}

func (e *StagedBytesError) Error() string {
	return "staged bytes: " + string(e.Code)
}

// Counts stay exactly representable when a future JSON boundary uses them.
const maxStagedByteCount int64 = 1<<53 - 1

// VerifyStagedBytes checks the supplied bytes without parsing or canonicalizing
// them. byteLength and maxBytes must be integers in [0, 2^53-1]; a zero limit
// allows only an empty payload. sha256Hex must be exactly 64 lowercase hex
// characters. A nil byte slice and an empty byte slice represent the same bytes.
//
// Validation order is deterministic: limit, declared length, digest syntax,
// limit exceedance (declared or actual), length mismatch, then digest mismatch.
// Both length checks happen before hashing. The input bytes are never modified.
//
// This is an in-memory primitive, not a bounded transport reader. Callers must
// enforce their limit while reading, before allocating the complete payload.
// Success proves only agreement with the supplied length and digest, not the
// trustworthiness of that metadata, JSON validity, request/route identity,
// market-data correctness, or permission to restore the bytes. No manifest
// schema or producer/consumer adoption is implied by this helper.
func VerifyStagedBytes(data []byte, byteLength int64, sha256Hex string, maxBytes int64) error {
	if maxBytes < 0 || maxBytes > maxStagedByteCount {
		return &StagedBytesError{Code: StagedBytesInvalidLimit}
	}
	if byteLength < 0 || byteLength > maxStagedByteCount {
		return &StagedBytesError{Code: StagedBytesInvalidByteLength}
	}
	if len(sha256Hex) != 64 {
		return &StagedBytesError{Code: StagedBytesInvalidSHA256}
	}
	for _, c := range sha256Hex {
		if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
			return &StagedBytesError{Code: StagedBytesInvalidSHA256}
		}
	}
	actualLength := int64(len(data))
	if byteLength > maxBytes || actualLength > maxBytes {
		return &StagedBytesError{Code: StagedBytesLimitExceeded}
	}
	if actualLength != byteLength {
		return &StagedBytesError{Code: StagedBytesByteLengthMismatch}
	}
	digest := sha256.Sum256(data)
	if hex.EncodeToString(digest[:]) != sha256Hex {
		return &StagedBytesError{Code: StagedBytesSHA256Mismatch}
	}
	return nil
}
