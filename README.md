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

### Engine provenance in validation v2

Version 2 separates submission intent from measured execution identity:

- Manifest `engine.stratReleaseArtifact` names the published standalone asset,
  release and sha256 selected by the submitter.
- Manifest `engine.expectedLinkedModule` pins the module path, release and Go
  module sum that the Report executor is expected to measure independently.
- Result `engine.linkedEngine` carries the strat module path, release and Go
  module sum read from the Report executable's build metadata, plus the sha256
  of that Report executable.
- Result `engine.assembleExecutor.sha256` is measured by Assemble over its own
  executable. Result `engine.validationRelease` is also read from Assemble's
  build metadata.

A successful v2 result requires a measured linked engine. A failed run may use
an explicit unavailable status only when Report did not produce identity. The
producer must carry the Report-derived object unchanged through later stages;
Assemble cannot fill it from manifest values. Consumers compare the measured
linked release with the requested release before admitting evidence and retain
all three artifact identities. Version 1 remains accepted for historical data
with the weaker provenance described below.

### Engine provenance in validation v1

The two v1 `engine.stratBuildDigest` fields identify different artifacts:

- A run manifest pins the sha256 of the published standalone
  `heisentick-strat` release artifact selected by the submitter.
- A run result records the digest reported by its publisher. The deployed
  Lambda producer reports the Assemble executable; the local worker reports
  the standalone executable it ran.

These digests need not match. Their equality would not prove which statically
linked engine the Report Lambda ran. Consumers should compare
`engine.stratRelease` for the existing v1 release-mismatch check and retain both
digests as provenance.

Proving the linked engine requires a new result contract version with separate
identities for the published release artifact, the Report executor that links
the engine, and the Assemble executor that publishes the result. The producer
must derive the Report engine release from build metadata and carry the Report
executor digest to Assemble; it must not copy either identity from the submitted
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
