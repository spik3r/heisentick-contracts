# Agent Instructions — heisentick-contracts

Global rules come from the user's `~/.config/agents/AGENTS.md`. This file
holds what is specific to this repo. `claude.md` and `codex.md` point here.

## What this is

The versioned JSON Schema contracts for every shape that crosses a
repository boundary in heisentick: queue messages, run manifests and
results, candle snapshot manifests, the `.bin` layout. `schemas/` is the
source of truth; `ts/` (`@heisentick/contracts`, zod) and the Go module root
(`github.com/spik3r/heisentick-contracts`) are generated or derived from it.
Consumers pin a release tag. Plan:
`spik3r/heisentick` → `backlog/plans/2026-09-18-one-engine-migration.md`.

## Layout

- `schemas/*.schema.json` — draft 2020-12. `common.v1` holds shared
  primitives; every document schema `$ref`s it by bare file name.
- `scripts/generate.mjs` — writes `ts/src/gen/` (json-schema-to-zod) and
  `gen/types.go` (go-jsonschema). `--check` fails CI on drift.
- `scripts/write-fixtures.mjs` — writes `fixtures/<doc>/{valid,invalid}/`;
  every invalid fixture is one named mutation of the valid one.
- `scripts/seal-fixtures.mjs` — fills canonical-case hashes and the manifest
  fingerprint from the TypeScript implementation; Go asserts them.
- `ts/src/index.ts` — `parseDocument`, `parseAnyDocument`, `DOCUMENT_SCHEMAS`,
  canonical JSON and fingerprint. `contracts.go` — `Validate`, `ValidateAny`,
  `Decode`, canonical JSON and fingerprint, schemas embedded.
- `test/contracts.test.ts` and `contracts_test.go` — both run every fixture;
  the TypeScript test also checks zod against Ajv on the raw schemas.

## Rules

- Never hand-edit `ts/src/gen/` or `gen/`. Change the schema, run
  `pnpm run generate`, then `pnpm run write-fixtures` if shapes changed, then
  `pnpm run build && node scripts/seal-fixtures.mjs`.
- Every document has `schema` (its `heisentick/<name>` id) and `version`
  (integer). Additive change → new optional field, same version, minor
  release. Anything else → new `<name>.v2.schema.json`, major release; keep
  v1 until every consumer has moved.
- `additionalProperties: false` on every object. Unknown fields are rejected
  at queue and artifact boundaries; HTTP response consumers may ignore them
  but the schema does not say so.
- Timestamps are integer epoch milliseconds UTC. Non-finite metrics are
  `null` with a reason. Enums are words, not symbols (the Go generator cannot
  name `>=`).
- Generated Go structs are not validation. `Decode` validates against the
  embedded schema first.
- Cross-language behaviour (canonical JSON, fingerprint) changes only with a
  new case in `fixtures/canonical/cases.json` and both implementations
  updated in the same PR.
- No `anyOf`/`if` at a document's root. zod 4 intersections drop the strict
  object's rejection of unknown fields, so a root-level conditional would
  silently weaken the contract. Rules that span fields live in
  `crossFieldIssues` in both packages, with invalid fixtures that only the
  packages (not Ajv) reject, listed in `CROSS_FIELD_FIXTURES` in the test.

`dist/` is committed. Consumers install the TypeScript package straight
from a tag (`github:spik3r/heisentick-contracts#vX.Y.Z`), which runs no
build, so `pnpm run build` output ships in the tag. CI fails when `dist/`
is stale.

## Validate before finishing

```sh
pnpm run check   # generate:check, tsc, node:test, build, go test
```
