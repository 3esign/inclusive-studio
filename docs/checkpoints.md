# Checkpoints and official course material

The checkpoint tool preserves bytes and detects changes. It does not decide what the teacher approved, authenticate a teacher, publish the site, or change GitHub permissions. `published` is a display state, not approval. A held class and its record remain a separate fact.

`tools/course-checkpoint.mjs` has no dependencies. The first capture is always `existing-state`; it does not retroactively approve a course. Keep the store **outside the website and outside its ancestors**. Do not put private approval evidence, raw conversations, or student data in the public repository.

## Commands

Run from this project, replacing the example absolute paths:

```text
node tools/course-checkpoint.mjs capture --root <SITE> --store <PRIVATE_STORE>
node tools/course-checkpoint.mjs verify --root <SITE> --store <PRIVATE_STORE> --id <SNAPSHOT_SHA256>
node tools/course-checkpoint.mjs compare --root <SITE> --store <PRIVATE_STORE> --id <SNAPSHOT_SHA256>
node tools/course-checkpoint.mjs restore --root <SITE> --store <PRIVATE_STORE> --id <SNAPSHOT_SHA256> --to <NEW_SEPARATE_DIRECTORY>
node tools/course-checkpoint.mjs check --root <SITE> --base <EXACT_40_CHARACTER_GIT_COMMIT>
node --test tests/course-checkpoint.test.mjs
```

`capture` returns the manifest's SHA-256. The root must be its own Git working tree. Its manifest records the original Git HEAD, tracked dirty status, each file's hash/size/identity and whether it was tracked. Relevant untracked files are included. Content-addressed blobs are reused; existing objects are never overwritten. A capture that detects concurrent changes fails without committing a manifest; unused blobs can remain. Capture performs two bounded reads, with metadata and inventory checks, and needs a cooperative quiet editing window. It is not an operating-system atomic filesystem snapshot.

Scope: root HTML/Markdown/JSON/JS/CSS/SVG/text files and `.gitignore`, plus files under `assets`, `data`, `tools`, `tests`, `docs`, `skills`, `.github`. Bounds: 4,096 files, 64 MiB per file, 256 MiB in total. `.git`, nested `!Projekti`, dependencies, named checkpoint stores, environment files and known secret/key/vault paths are excluded. This is a bounded project copy, not a scanner that can identify every possible secret in ordinary content. Explicit project junctions resolve to their real root; links inside included content and store/restore paths are refused.

`verify` hashes every blob. `compare` reports added/changed/deleted files and checks previously published weeks against the saved revision prefix. Changed material requires a new revision, revision dates cannot move backwards, and `updated` must match the last revision date. Old history cannot be rewritten or deleted; a published week cannot disappear or be silently demoted. The existing material validator and full project tests are still needed for structure, links and behaviour.

`check` provides the same revision guard against an exact Git commit, without a private store; use it in a test/release command before publishing. It is not automatically installed as a Git hook or enforced on GitHub by this change. The publisher must bind validation to the exact reviewed tree and fail if that tree changes before shipping. UI changes need their own visual review.

Release tooling can call the exported `check({ root, base, againstRoot, official, expectedSha256 })`: Git history comes from `root`, but all current material and optional official-path checks read `againstRoot`. That target must be a separate existing tree; it does not need `.git`. Verify the restored snapshot first, run checks against that exact copy, and recheck its hashes afterwards. This API does not itself authenticate the restored snapshot. The CLI remains unchanged and checks its supplied root.

## Official material is explicit

The optional separate manifest has this shape:

```json
{
  "format": "course-official/v1",
  "snapshotId": "<full snapshot SHA-256>",
  "approval": {
    "kind": "teacher-approved",
    "source": "<locator of the teacher's actual decision>",
    "at": "<decision timestamp>"
  },
  "paths": [
    { "path": "data/material/w01.json", "sha256": "<approved file SHA-256>" },
    { "path": "assets/exercises.js", "sha256": "<approved dependency SHA-256>" }
  ]
}
```

Pass `--official <MANIFEST> --official-sha <INDEPENDENTLY_REVIEWED_MANIFEST_SHA256>` to `check` or `compare` to refuse changes to those exact paths. The supplied SHA pins the selected manifest, not a person's identity. `snapshotId` is a provenance reference; the optional guard itself does not retrieve that snapshot or prove a complete dependency closure. Verify the full snapshot separately and review the listed paths. A lesson references shared exercise/lab modules, images and downloadable files: saving only `wNN.json` cannot preserve the whole lesson. Preserve a complete snapshot for every official release, including its cover and renderer. Drafts and ideas can remain navigable with honest labels; their presence does not approve them.

No real approval manifest is created by this tool. Approval must refer to an actual teacher decision about exact content. A new revision is a proposed amendment until that separate decision is made.

## Returning safely

Restore verifies the complete snapshot before creating the destination, writes only into a new separate directory, and verifies the written bytes. A successful copy carries `CHECKPOINT-RESTORE.json` (reserved restore metadata, excluded from future captures); a failure after directory creation can leave a partial copy without that success receipt. The live source, index and Git history are untouched. Existing/overlapping destinations, traversal, Windows trailing-dot/space aliases, reserved devices, alternate data streams, device namespaces, symlinks and corrupt objects are refused. Absolute store/restore paths are checked component by component; their existing ancestors are resolved canonically before overlap checks. Verification/restoration also work if the original project is missing, provided `--root` still resolves to the original canonical location; they do not recreate that original location.

Review the restored copy and use the normal tested publication path if it should become the live course. Returning to earlier material is a new recorded release, not deletion of later work or a force-reset of the shared repository. Keep both the previous official release and the current work checkpoint. Do not call a restored local copy a completed live rollback.

The guard cannot prevent a process with the same filesystem/Git credentials from bypassing it or replacing the guard itself. Stronger enforcement belongs at the canonical publisher and, where configured, remote branch/CI permissions. No such permissions are changed here.
