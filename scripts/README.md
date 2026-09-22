# `explain`

A `gum`-driven CLI for this repo. Run `./scripts/explain` for a menu, or `./scripts/explain <command>` directly. `./scripts/explain --help` lists everything without opening the TUI.

## Adding a command

1. Pick (or create) a group directory under `scripts/explain.d/`. A group needs a `_group` file:

   ```
   Title: Browse
   Description: List, inspect and open explainers, tags and collections
   ```

2. Add an executable file to that directory, with a header comment:

   ```zsh
   #!/usr/bin/env zsh
   # Description: One line, shown in the menu and in --help
   set -euo pipefail

   source "${EXPLAIN_D}/_lib.sh"
   ```

3. `chmod +x` it.

That's it — `explain` discovers commands by scanning `explain.d/`, so there is nothing else to register. Drop a file at `explain.d/` root with no group and it still works: it's auto-filed under **Inbox**.

Command names must be unique across every group; `explain` refuses to start otherwise.

## Shared helpers

- `_lib.sh` — `die`, `need_tty`, `heading`, `run_data`, `require_gum`. Source it, don't duplicate it.
- `_data.ts` — the only file that imports `explainers.ts` / `registry.ts` / `collections.ts` directly. Call it via `run_data <query> [args]`; never read those files yourself.
- `_theme.sh` — maps a `.claude/themes/<family>-tui.json` file (made with `/theme-factory "tui"`) onto gum's env vars. No colour values live here or in any command; if the theme is missing, the CLI just runs unstyled.

## Data access contract (`_data.ts`)

```
bun run _data.ts <query> [args...]
```

Queries: `explainers`, `tags`, `collections`, `explainer <id>`, `tag <slug>`, `collection <id>`, `doctor`, `roadmap`.

Output is tab-separated rows on stdout, no header. Errors go to stderr with exit 1 and nothing on stdout.
