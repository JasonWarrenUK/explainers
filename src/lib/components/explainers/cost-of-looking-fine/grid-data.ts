export interface CellSpec {
	shape: string;
	count: number;
	filled: boolean;
	accent: boolean;
}

const SHAPES = ['circle', 'square', 'triangle'];

export function cellSpec(r: number, c: number, level: number): CellSpec {
	const shape = SHAPES[r];
	const count = level >= 2 ? c + 1 : 1;
	const filled = level >= 3 ? (r + c) % 2 === 0 : true;
	const accent = level >= 4 ? count >= 2 && !filled : false;
	return { shape, count, filled, accent };
}

export const MISSING_BY_LEVEL: (null | { r: number; c: number })[] = [
	null,
	{ r: 2, c: 1 },
	{ r: 0, c: 2 },
	{ r: 1, c: 0 },
	{ r: 0, c: 1 }
];

export function optionsFor(level: number): { ans: CellSpec; opts: CellSpec[] } {
	const M = MISSING_BY_LEVEL[level]!;
	const ans = cellSpec(M.r, M.c, level);
	const alts: CellSpec[] = [
		{ ...ans, shape: 'triangle' },
		{ ...ans, count: level >= 2 ? (ans.count === 2 ? 3 : 2) : 1, shape: level >= 2 ? ans.shape : 'circle' },
		{ ...ans, filled: !ans.filled },
		{ ...ans, accent: !ans.accent, filled: level >= 4 ? ans.filled : !ans.filled }
	];
	const seen = new Set<string>();
	const all = [ans, ...alts].filter((o) => {
		const k = JSON.stringify(o);
		if (seen.has(k)) return false;
		seen.add(k);
		return true;
	});
	const order = [2, 0, 3, 1, 4].filter((i) => i < all.length);
	return { ans, opts: order.map((i) => all[i]) };
}
