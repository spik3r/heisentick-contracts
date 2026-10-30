# Canonical JSON and the input fingerprint

Two implementations, `ts/src/canonical.ts` and `canonical.go`, must produce
byte-identical output. `fixtures/canonical/cases.json` holds the cases both
are tested against; add a case there before changing either implementation.

## Rules

1. Objects: keys sorted by UTF-16 code unit order (what `Array.prototype.sort`
   does with default comparison in JavaScript). No whitespace anywhere.
2. Arrays: elements in order. Decoded JavaScript arrays must have an own
   element at every index: sparse holes and explicit `undefined` elements
   are errors with the offending index path, not omitted values. An inherited
   numeric property does not fill a hole. Use an explicit `null` when that is
   the intended JSON value. Raw JSON cannot express holes; ordinary dense
   arrays and the Go representation keep their existing canonical bytes.
3. Strings: `JSON.stringify` escaping. `"` → `\"`, `\` → `\\`, U+0008 `\b`,
   U+000C `\f`, U+000A `\n`, U+000D `\r`, U+0009 `\t`, other code points
   below U+0020 as `\u00xx` with lower-case hex. Nothing else is escaped:
   `/`, `<`, `>`, `&`, U+2028 and U+2029 are written as they are.
4. Numbers: ECMAScript `Number.prototype.toString`. Shortest digits that
   round-trip; plain decimal when 1e-6 ≤ |x| < 1e21; otherwise `d.ddde+x` or
   `d.ddde-x` with no zero padding in the exponent. `-0` becomes `0`. NaN and
   ±Infinity are errors; a metric that is not finite is encoded as `null`
   with a reason field beside it, never hashed as a number.
5. `true`, `false`, `null` literally. In TypeScript an `undefined` value is an
   error rather than being dropped, so a document with a missing field cannot
   hash the same as one where the field is present.
6. `canonicalJson` and `CanonicalJSON` take an already decoded JSON value.
   Integers beyond 2^53 lose precision on both
   sides identically because both parse to a 64-bit float first.

## Raw JSON text

Use TypeScript `canonicalJsonText` or Go `CanonicalJSONBytes` when the input is
raw JSON text. Each parses exactly one JSON value, allows surrounding
whitespace, and rejects a second value or any other trailing non-whitespace
content. This prevents either implementation from canonicalizing only a valid
prefix of a larger input. The shared raw-text cases live in
`fixtures/canonical/cases.json` and are checked by both language test suites.

## Fingerprint

`inputFingerprint(manifest)` = SHA-256 (hex, lower case) of the canonical
JSON of the validation-run-manifest with these fields removed:

`runId`, `requestKey`, `requestedBy`, `submittedAt`, `inputFingerprint`.

Equal fingerprints mean identical inputs. A deliberate re-run of the same
inputs gets a new `runId` and the same fingerprint; a retry of the same HTTP
submission reuses the `requestKey` and therefore the same `runId`.

`fixtures/validation-run-manifest.v1/fingerprint.txt` is written by the
TypeScript implementation (`scripts/seal-fixtures.mjs`) and asserted by
`go test`.
