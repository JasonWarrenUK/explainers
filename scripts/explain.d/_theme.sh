# _theme.sh: bridges a .claude/themes/<family>-tui.json theme file to gum's
# own environment variables. Holds no colour values of its own; colour is
# decided by /theme-factory and nowhere else (CLAUDE.md §7.5). Changing a
# colour means re-running /theme-factory, never editing this file.
#
# Sourced, never executed directly (no shebang, no executable bit).

EXPLAIN_THEME_ROOT="${EXPLAIN_REPO_ROOT}/.claude/themes"
EXPLAIN_EMIT="${HOME}/.claude/library/scripts/theme/emit.ts"

load_theme() {
	local tui_file
	tui_file=$(find "$EXPLAIN_THEME_ROOT" -maxdepth 1 -name '*-tui.json' -print -quit 2>/dev/null)

	if [[ -z "$tui_file" || ! -f "$EXPLAIN_EMIT" ]]; then
		export EXPLAIN_THEME_LOADED=0
		return 1
	fi

	local json
	json=$(bun run "$EXPLAIN_EMIT" "$tui_file" 2>/dev/null) || {
		export EXPLAIN_THEME_LOADED=0
		return 1
	}

	# Pull each style's foreground/background out of the emitted JSON with
	# bun -e rather than a JSON-parsing shell tool, matching how the rest of
	# the CLI already talks to bun. Prints "KEY=value" lines, one per var.
	local exports
	exports=$(printf '%s' "$json" | bun -e '
		const theme = JSON.parse(await Bun.stdin.text());
		const s = theme.styles ?? {};
		const line = (name, value) => { if (value) console.log(`${name}=${value}`); };
		line("EXPLAIN_TITLE", s.title?.fg);
		line("EXPLAIN_BODY", s.body?.fg);
		line("EXPLAIN_MUTED", s.muted?.fg);
		line("EXPLAIN_ACCENT", s.accent?.fg);
		line("EXPLAIN_SELECTED_FG", s.selected?.fg);
		line("EXPLAIN_SELECTED_BG", s.selected?.bg);
		line("EXPLAIN_BORDER", s.border?.fg);
		line("EXPLAIN_OK", s.ok?.fg);
		line("EXPLAIN_WARN", s.warn?.fg);
		line("EXPLAIN_DANGER", s.danger?.fg);
		line("EXPLAIN_INFO", s.info?.fg);
		if (theme.border_style) console.log(`EXPLAIN_BORDER_STYLE=${theme.border_style}`);
	' 2>/dev/null)

	[[ -z "$exports" ]] && { export EXPLAIN_THEME_LOADED=0; return 1; }

	while IFS='=' read -r key value; do
		[[ -n "$key" ]] && export "$key=$value"
	done <<<"$exports"

	# Map onto gum's own variables so every command gets themed for free
	# without passing --foreground flags around.
	export GUM_CHOOSE_CURSOR_FOREGROUND="${EXPLAIN_ACCENT:-}"
	export GUM_CHOOSE_SELECTED_FOREGROUND="${EXPLAIN_SELECTED_FG:-}"
	export GUM_CHOOSE_HEADER_FOREGROUND="${EXPLAIN_TITLE:-}"
	export GUM_FILTER_INDICATOR_FOREGROUND="${EXPLAIN_ACCENT:-}"
	export GUM_TABLE_HEADER_FOREGROUND="${EXPLAIN_TITLE:-}"
	export GUM_TABLE_BORDER_FOREGROUND="${EXPLAIN_BORDER:-}"
	export GUM_TABLE_SELECTED_FOREGROUND="${EXPLAIN_SELECTED_FG:-}"
	# Deliberately NOT exporting the bare BORDER / BORDER_FOREGROUND vars:
	# gum style reads those globally for every call in the process (its
	# --border default is "none"), so setting them here would put an
	# unwanted border on every heading() call, not just gum table, which
	# has its own namespaced GUM_TABLE_BORDER_FOREGROUND set above.

	export EXPLAIN_THEME_LOADED=1
	return 0
}
