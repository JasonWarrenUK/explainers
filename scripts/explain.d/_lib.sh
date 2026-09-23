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

# need_tty: true when both stdin and stdout are a real terminal, i.e. the
# OUTPUT is going to a human rather than a pipe. Use it to choose between
# an interactive menu and a plain listing.
need_tty() {
	[[ -t 0 && -t 1 ]]
}

# can_prompt: true when a human can answer a gum picker (choose, filter,
# input, confirm). Checks stdin and stderr, NOT stdout: pickers are almost
# always called inside `id=$(pick_id ...)`, where stdout is the capture pipe
# but the picker itself draws on stderr and reads /dev/tty. Checking -t 1
# there always fails, which is exactly the bug that made `open` and `show`
# refuse to prompt when launched from the menu. gum's pickers exit 0 even
# without a TTY, so callers must check this explicitly rather than trust
# the exit code of the gum call itself.
can_prompt() {
	[[ -t 0 && -t 2 ]]
}

# pick_target [arg]: resolve the explainers|tags|collections target for a
# browse command. An explicit argument always wins. With no argument, the
# default is "explainers" from the shell (so `explain list` stays a one-shot),
# but when the command was launched from the menu (EXPLAIN_MENU=1, set by
# run_menu) there is no way to have typed an argument, so ask instead.
pick_target() {
	local given="${1:-}"
	if [[ -n "$given" ]]; then
		echo "$given"
	elif [[ "${EXPLAIN_MENU:-0}" == "1" ]] && can_prompt; then
		gum choose --header "Which kind?" explainers tags collections
	else
		echo explainers
	fi
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

# require_gum: fail with an actionable message if gum isn't on PATH. Exits
# 127 (command not found) rather than 1, so a caller such as CI can tell a
# missing binary apart from a command's own findings, which use 1.
require_gum() {
	if ! command -v gum >/dev/null 2>&1; then
		echo "explain: gum is not installed. Run: brew install gum" >&2
		exit 127
	fi
}
