# _lib.sh: shared helpers for explain and every explain.d/ command.
# Sourced, never executed directly (no shebang, no executable bit).

# die <message>: print a styled error to stderr and exit 1.
die() {
	if command -v gum >/dev/null 2>&1; then
		gum style --foreground "${EXPLAIN_DANGER:-9}" "✗ $1" >&2
	else
		echo "explain: $1" >&2
	fi
	exit 1
}

# need_tty: true when both stdin and stdout are a real terminal. gum's
# interactive pickers (choose, filter, input, confirm, table without -p)
# fail without a TTY but still exit 0, so callers must check this explicitly
# rather than trust the exit code of the gum call itself.
need_tty() {
	[[ -t 0 && -t 1 ]]
}

# print_table <columns> : render tab-separated rows from stdin as a bordered,
# themed table that fits the terminal width. <columns> is comma-separated.
# Replaces `gum table -p`, which in gum 0.17.0 has three defects in print
# mode: -w/--widths is ignored, the header style lands on the first data row
# instead of the header (its StyleFunc tests row == 0 but lipgloss numbers
# the header row -1), and over-wide tables are never wrapped, so the
# terminal soft-wraps every row into a mess.
print_table() {
	bun run "${EXPLAIN_D:?EXPLAIN_D not set}/_table.ts" --columns "$1"
}

# heading <text>: styled section heading, falls back to plain text without
# a TTY or without gum.
heading() {
	if command -v gum >/dev/null 2>&1; then
		gum style --bold --foreground "${EXPLAIN_ACCENT:-212}" "$1"
	else
		echo "$1"
	fi
}

# run_data <query> [args...]: call _data.ts relative to this file's own
# directory, so it works no matter what directory explain was invoked from.
run_data() {
	bun run "${EXPLAIN_D:?EXPLAIN_D not set}/_data.ts" "$@"
}

# tsv_fields <row>: splits a tab-separated row into the TSV_FIELD array,
# preserving empty fields. Do not use `IFS=$'\t' read -r ...` for this:
# zsh's `read` collapses consecutive tabs, silently dropping empty fields
# and shifting every later field left by one.
tsv_fields() {
	TSV_FIELD=("${(@ps:\t:)1}")
}

# require_gum: fail with an actionable message if gum isn't on PATH.
require_gum() {
	if ! command -v gum >/dev/null 2>&1; then
		echo "explain: gum is not installed. Run: brew install gum" >&2
		exit 1
	fi
}
