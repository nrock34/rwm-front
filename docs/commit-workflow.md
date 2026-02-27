# Commit Workflow

## Setup (run once per local clone)

```sh
npm run setup:git
```

This configures:
- `core.hooksPath=.githooks`
- `commit.template=.gitmessage.txt`

## Required commit format

```text
type(scope): short imperative summary
```

Examples:
- `feat(programs): add server-side pagination cursor handling`
- `fix(auth): throw redirect for missing refresh token`
- `docs(audit): add prod-dev migration checklist`

## Allowed types

- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `perf`
- `test`
- `build`
- `ci`
- `chore`
- `revert`

## Rules enforced by hook

- Scope is required: `type(scope): ...`
- Summary must start lowercase
- Summary max length: `72` chars
- No trailing period in summary
- Merge/revert/fixup/squash commits are allowed
