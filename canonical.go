// Package contracts validates heisentick boundary documents against the
// embedded JSON Schemas and provides the canonical JSON / fingerprint rules
// shared with the TypeScript package. The generated structs live in gen/;
// they describe shape, this package decides validity.
package contracts

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strconv"
	"strings"
	"unicode/utf8"
)

// ManifestIdentityFields are removed from a validation-run-manifest before
// fingerprinting; they identify the submission, not the inputs.
var ManifestIdentityFields = []string{"runId", "requestKey", "requestedBy", "submittedAt", "inputFingerprint"}

// CanonicalJSON renders a decoded JSON value by the rules in
// docs/canonical-json.md: sorted keys, no whitespace, ECMAScript number
// formatting, JSON.stringify string escaping. The input is whatever
// json.Unmarshal produces into an `any` (map[string]any, []any, float64,
// string, bool, nil); json.Number is accepted and parsed as float64 so the
// result matches a JavaScript reader of the same text.
func CanonicalJSON(value any) (string, error) {
	var b strings.Builder
	if err := writeCanonical(&b, value, "$"); err != nil {
		return "", err
	}
	return b.String(), nil
}

// CanonicalJSONBytes canonicalises raw JSON text.
func CanonicalJSONBytes(raw []byte) (string, error) {
	dec := json.NewDecoder(bytes.NewReader(raw))
	dec.UseNumber()
	var value any
	if err := dec.Decode(&value); err != nil {
		return "", fmt.Errorf("canonical json: %w", err)
	}
	return CanonicalJSON(value)
}

// SHA256Hex of a UTF-8 string.
func SHA256Hex(text string) string {
	sum := sha256.Sum256([]byte(text))
	return hex.EncodeToString(sum[:])
}

// InputFingerprint of a decoded validation-run-manifest.
func InputFingerprint(manifest map[string]any) (string, error) {
	inputs := make(map[string]any, len(manifest))
	for k, v := range manifest {
		inputs[k] = v
	}
	for _, k := range ManifestIdentityFields {
		delete(inputs, k)
	}
	canonical, err := CanonicalJSON(inputs)
	if err != nil {
		return "", err
	}
	return SHA256Hex(canonical), nil
}

func writeCanonical(b *strings.Builder, value any, path string) error {
	switch v := value.(type) {
	case nil:
		b.WriteString("null")
	case bool:
		if v {
			b.WriteString("true")
		} else {
			b.WriteString("false")
		}
	case float64:
		s, err := canonicalNumber(v)
		if err != nil {
			return fmt.Errorf("%s at %s", err, path)
		}
		b.WriteString(s)
	case json.Number:
		f, err := v.Float64()
		if err != nil {
			return fmt.Errorf("number %q at %s: %w", v, path, err)
		}
		s, err := canonicalNumber(f)
		if err != nil {
			return fmt.Errorf("%s at %s", err, path)
		}
		b.WriteString(s)
	case int:
		b.WriteString(strconv.Itoa(v))
	case int64:
		b.WriteString(strconv.FormatInt(v, 10))
	case string:
		writeCanonicalString(b, v)
	case []any:
		b.WriteByte('[')
		for i, item := range v {
			if i > 0 {
				b.WriteByte(',')
			}
			if err := writeCanonical(b, item, fmt.Sprintf("%s[%d]", path, i)); err != nil {
				return err
			}
		}
		b.WriteByte(']')
	case map[string]any:
		keys := make([]string, 0, len(v))
		for k := range v {
			keys = append(keys, k)
		}
		sort.Slice(keys, func(i, j int) bool { return lessUTF16(keys[i], keys[j]) })
		b.WriteByte('{')
		for i, k := range keys {
			if i > 0 {
				b.WriteByte(',')
			}
			writeCanonicalString(b, k)
			b.WriteByte(':')
			if err := writeCanonical(b, v[k], path+"."+k); err != nil {
				return err
			}
		}
		b.WriteByte('}')
	default:
		return fmt.Errorf("unsupported type %T at %s", value, path)
	}
	return nil
}

// JavaScript sorts keys by UTF-16 code unit; Go strings compare by byte,
// which differs for characters outside the BMP against U+E000..U+FFFF.
func lessUTF16(a, b string) bool {
	ua, ub := utf16Units(a), utf16Units(b)
	for i := 0; i < len(ua) && i < len(ub); i++ {
		if ua[i] != ub[i] {
			return ua[i] < ub[i]
		}
	}
	return len(ua) < len(ub)
}

func utf16Units(s string) []uint16 {
	out := make([]uint16, 0, len(s))
	for _, r := range s {
		if r >= 0x10000 {
			r -= 0x10000
			out = append(out, uint16(0xD800+(r>>10)), uint16(0xDC00+(r&0x3FF)))
		} else {
			out = append(out, uint16(r))
		}
	}
	return out
}

// canonicalNumber reproduces ECMAScript Number.prototype.toString for a
// finite float64: shortest round-trip digits; plain decimal when
// 1e-6 <= |x| < 1e21, otherwise d.ddde±x with no exponent padding.
func canonicalNumber(f float64) (string, error) {
	if math.IsNaN(f) || math.IsInf(f, 0) {
		return "", fmt.Errorf("non-finite number")
	}
	if f == 0 {
		return "0", nil
	}
	abs := math.Abs(f)
	if abs >= 1e-6 && abs < 1e21 {
		return strconv.FormatFloat(f, 'f', -1, 64), nil
	}
	s := strconv.FormatFloat(f, 'e', -1, 64) // e.g. 1e+21, 5e-324, 1.7976931348623157e+308
	mant, exp, _ := strings.Cut(s, "e")
	sign := exp[0]
	digits := strings.TrimLeft(exp[1:], "0")
	if digits == "" {
		digits = "0"
	}
	return mant + "e" + string(sign) + digits, nil
}

// writeCanonicalString escapes exactly as JSON.stringify does: quote,
// backslash, and control characters below 0x20 (short forms for \b \f \n
// \r \t, \u00xx lower-case otherwise). Everything else, including '/',
// '<', '&' and U+2028/2029, is written as is.
func writeCanonicalString(b *strings.Builder, s string) {
	b.WriteByte('"')
	for i := 0; i < len(s); {
		r, size := utf8.DecodeRuneInString(s[i:])
		switch {
		case r == '"':
			b.WriteString(`\"`)
		case r == '\\':
			b.WriteString(`\\`)
		case r == '\b':
			b.WriteString(`\b`)
		case r == '\f':
			b.WriteString(`\f`)
		case r == '\n':
			b.WriteString(`\n`)
		case r == '\r':
			b.WriteString(`\r`)
		case r == '\t':
			b.WriteString(`\t`)
		case r < 0x20:
			fmt.Fprintf(b, `\u%04x`, r)
		case r == utf8.RuneError && size == 1:
			// Invalid UTF-8 has no JavaScript equivalent; write the replacement
			// character rather than producing invalid output.
			b.WriteString("�")
		default:
			b.WriteString(s[i : i+size])
		}
		i += size
	}
	b.WriteByte('"')
}
