# heisentick-contracts

Versioned JSON Schema contracts for the shapes that cross repository
boundaries in heisentick, with generated zod/TypeScript (`@heisentick/contracts`)
and Go (`github.com/spik3r/heisentick-contracts`) packages and shared fixtures
both must pass. Part of the one-engine migration
([central one-engine plan](https://github.com/spik3r/heisentick-backlog/blob/main/plans/2026-09-18-one-engine-migration.md)).

## Planning

Plans, task ownership, dependencies and completion criteria live in the
[central Heisentick backlog](https://github.com/spik3r/heisentick-backlog). Link implementation PRs to the
corresponding task there. This repository keeps its code, tests and runbooks.

## Documents (v0.1)

| `schema` | File | Written by | Read by |
|---|---|---|---|
| `heisentick/bar-binary-layout` | `bar-binary-layout.v1` | API, strat CLI | anyone mapping a `<tf>.bin` |
| `heisentick/candle-snapshot-manifest` | `candle-snapshot-manifest.v1` | API on commit | API when resolving a run |
| `heisentick/validation-run-request` | `validation-run-request.v1` | Lab UI, operator scripts | API |
| `heisentick/validation-run-manifest` | `validation-run-manifest.v1` | API at submission | every Lambda; workers read nothing else |
| `heisentick/validation-request-message` | `validation-queue-messages.v1` | API | Pipe → Step Functions |
| `heisentick/validation-result-message` | `validation-queue-messages.v1` | Assemble Lambda | API results consumer |
| `heisentick/validation-run-result` | `validation-run-result.v1` | Assemble Lambda | API, Lab UI |

The `.bin` layout is fixed by the schema's constants: little-endian, 16-byte
header (magic `0x31425442`, version 1, count, colCount), then `colCount`
contiguous Float64 columns in the order `t,o,h,l,c,v`, column `i` at byte
`16 + i*count*8`, missing volume `0`, file sha256 carried by the snapshot
manifest.

## Use

TypeScript:

```ts
import { parseDocument, parseAnyDocument, inputFingerprint } from '@heisentick/contracts';

const message = parseDocument('heisentick/validation-result-message', JSON.parse(body)); // throws ContractError
const { schema, document } = parseAnyDocument(JSON.parse(body));                          // dispatch on the document's own schema field
const fp = inputFingerprint(manifest);
```

Go:

```go
import contracts "github.com/spik3r/heisentick-contracts"
import "github.com/spik3r/heisentick-contracts/gen"

var m gen.ValidationRunManifestV1
if err := contracts.Decode("heisentick/validation-run-manifest", raw, &m); err != nil { /* *contracts.ContractError */ }
fp, err := contracts.InputFingerprint(decoded) // decoded from contracts.Validate
```

Pin a tag. The TypeScript package is consumed from the GitHub release
tarball or a git tag in `package.json`; the Go module by tag in `go.mod`.

## Develop

```sh
pnpm install
pnpm run generate          # schemas → ts/src/gen, gen/types.go
pnpm run write-fixtures    # schemas' example + invalid fixtures
pnpm run build && node scripts/seal-fixtures.mjs
pnpm run check             # generate:check, tsc, node:test, build, go test
```

Compatibility rules, canonical JSON and the fingerprint are in `agents.md`
and `docs/canonical-json.md`.
