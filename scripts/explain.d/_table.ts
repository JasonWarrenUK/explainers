#!/usr/bin/env bun
// _table.ts: render tab-separated rows from stdin as a bordered table that
// fits the terminal. Called through print_table in _lib.sh; never directly.
//
// Invocation: bun run _table.ts --columns "a,b,c" < rows.tsv
//
// Why this exists rather than `gum table -p` (gum 0.17.0):
//   - -w/--widths is ignored in print mode, so nothing constrains width
//   - the header style lands on the first data row, not the header
//   - an over-wide table is printed as-is and the terminal soft-wraps it
//
// Fitting: when the natural width exceeds the terminal, the widest column
// is narrowed (word-wrapped) until the table fits or that column reaches a
// floor, then the next widest, and so on. Piped output has no terminal
// width, so it renders at natural width and is never wrapped.
//
// Colour comes only from the EXPLAIN_* variables that _theme.sh exports
// (hex strings), so this file holds no colour values of its own.

export {}; // top-level await needs module scope

const args = process.argv.slice(2);
const columnsIndex = args.indexOf('--columns');
if (columnsIndex === -1 || !args[columnsIndex + 1]) {
	console.error('_table.ts: --columns "a,b,c" is required');
	process.exit(1);
}
const headers = args[columnsIndex + 1].split(',');

const input = await Bun.stdin.text();
const rows: string[][] = input
	.split('\n')
	.filter((line) => line.length > 0)
	.map((line) => {
		const cells = line.split('\t');
		while (cells.length < headers.length) cells.push('');
		return cells.slice(0, headers.length);
	});

const width = (s: string): number => Bun.stringWidth(s);

// ---- styling --------------------------------------------------------------

const colourEnabled = process.stdout.isTTY || process.env.CLICOLOR_FORCE === '1';

function truecolour(hex: string | undefined): string {
	if (!colourEnabled || !hex) return '';
	const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
	if (!match) return '';
	const [r, g, b] = match.slice(1).map((h) => parseInt(h, 16));
	return `\x1b[38;2;${r};${g};${b}m`;
}

const RESET = colourEnabled ? '\x1b[0m' : '';
const BOLD = colourEnabled ? '\x1b[1m' : '';
const headerStyle = BOLD + truecolour(process.env.EXPLAIN_TITLE);
const borderStyle = truecolour(process.env.EXPLAIN_BORDER);

const paint = (style: string, text: string): string => (style ? style + text + RESET : text);

interface BorderSet {
	tl: string;
	tr: string;
	bl: string;
	br: string;
	h: string;
	v: string;
	tj: string;
	bj: string;
	lj: string;
	rj: string;
	x: string;
}

const borders: Record<string, BorderSet> = {
	rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│', tj: '┬', bj: '┴', lj: '├', rj: '┤', x: '┼' },
	normal: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│', tj: '┬', bj: '┴', lj: '├', rj: '┤', x: '┼' },
	thick: { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃', tj: '┳', bj: '┻', lj: '┣', rj: '┫', x: '╋' },
	double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║', tj: '╦', bj: '╩', lj: '╠', rj: '╣', x: '╬' },
	none: { tl: ' ', tr: ' ', bl: ' ', br: ' ', h: ' ', v: ' ', tj: ' ', bj: ' ', lj: ' ', rj: ' ', x: ' ' }
};
const border = borders[process.env.EXPLAIN_BORDER_STYLE ?? 'rounded'] ?? borders.rounded;

// ---- widths -----------------------------------------------------------------

const MIN_COLUMN_WIDTH = 12;
const PADDING = 1; // one space each side of a cell
const chrome = (n: number): number => n * (2 * PADDING + 1) + 1; // borders + padding

const widths = headers.map((h, i) =>
	Math.max(width(h), ...rows.map((r) => width(r[i])))
);

const terminalWidth = process.stdout.isTTY ? process.stdout.columns : undefined;
if (terminalWidth) {
	const total = (): number => widths.reduce((a, b) => a + b, 0) + chrome(widths.length);
	while (total() > terminalWidth) {
		const candidates = widths
			.map((w, i) => ({ w, i }))
			.filter(({ w }) => w > MIN_COLUMN_WIDTH)
			.sort((a, b) => b.w - a.w);
		if (candidates.length === 0) break;
		const over = total() - terminalWidth;
		const widest = candidates[0];
		widths[widest.i] = Math.max(MIN_COLUMN_WIDTH, widest.w - over);
	}
}

// ---- wrapping ---------------------------------------------------------------

function wrap(text: string, max: number): string[] {
	if (width(text) <= max) return [text];
	const lines: string[] = [];
	let current = '';
	for (const word of text.split(' ')) {
		let piece = word;
		// A single word longer than the column is split hard.
		while (width(piece) > max) {
			if (current) {
				lines.push(current);
				current = '';
			}
			lines.push(piece.slice(0, max));
			piece = piece.slice(max);
		}
		const candidate = current ? `${current} ${piece}` : piece;
		if (width(candidate) > max) {
			lines.push(current);
			current = piece;
		} else {
			current = candidate;
		}
	}
	if (current) lines.push(current);
	return lines;
}

const pad = (text: string, w: number): string => text + ' '.repeat(Math.max(0, w - width(text)));

// ---- render -----------------------------------------------------------------

const rule = (left: string, junction: string, right: string): string =>
	paint(
		borderStyle,
		left + widths.map((w) => border.h.repeat(w + 2 * PADDING)).join(junction) + right
	);

function renderRow(cells: string[], style: string): string[] {
	const wrapped = cells.map((cell, i) => wrap(cell, widths[i]));
	const height = Math.max(...wrapped.map((lines) => lines.length));
	const out: string[] = [];
	for (let line = 0; line < height; line++) {
		const body = widths.map((w, i) => {
			const text = pad(wrapped[i][line] ?? '', w);
			return ' '.repeat(PADDING) + paint(style, text) + ' '.repeat(PADDING);
		});
		const v = paint(borderStyle, border.v);
		out.push(v + body.join(v) + v);
	}
	return out;
}

const lines: string[] = [];
lines.push(rule(border.tl, border.tj, border.tr));
lines.push(...renderRow(headers, headerStyle));
lines.push(rule(border.lj, border.x, border.rj));
for (const row of rows) lines.push(...renderRow(row, ''));
lines.push(rule(border.bl, border.bj, border.br));
console.log(lines.join('\n'));
