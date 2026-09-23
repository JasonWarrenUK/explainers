// Facet geometry for the round-brilliant stone render: table, star, kite and upper-girdle facets.
// Ported from docs/imports/diamond-colour-simulator.html; copy is verbatim, types added.

export type FacetKind = 'star' | 'kite' | 'ug' | 'ug2';
export interface Facet {
	pts: [number, number][];
	kind: FacetKind;
	i: number;
}

function computeFacets(): Facet[] {
	const P = (r: number, a: number): [number, number] => [r * Math.cos(a), r * Math.sin(a)];
	const out: Facet[] = [];
	const n = 8,
		st = (Math.PI * 2) / n;
	for (let i = 0; i < n; i++) {
		const a0 = i * st,
			a1 = (i + 1) * st,
			am = a0 + st / 2;
		out.push({ pts: [P(0.55, a0), P(0.55, a1), P(0.74, am)], kind: 'star', i });
		out.push({ pts: [P(0.55, a0), P(0.74, a0 - st / 2), P(1, a0), P(0.74, am)], kind: 'kite', i });
		out.push({ pts: [P(0.74, am), P(1, a0), P(1, am)], kind: 'ug', i });
		out.push({ pts: [P(0.74, am), P(1, am), P(1, a1)], kind: 'ug2', i });
	}
	return out;
}
export const FACETS: Facet[] = computeFacets();

export const TABLE_POINTS: [number, number][] = Array.from({ length: 8 }, (_, i) => [
	0.55 * Math.cos((i * Math.PI) / 4),
	0.55 * Math.sin((i * Math.PI) / 4)
]);

export function tablePane(i: number): [number, number][] {
	const a = (i * Math.PI) / 4 + Math.PI / 8;
	return [
		[0, 0],
		[0.55 * Math.cos(a - Math.PI / 8), 0.55 * Math.sin(a - Math.PI / 8)],
		[0.55 * Math.cos(a + Math.PI / 8), 0.55 * Math.sin(a + Math.PI / 8)]
	];
}

const PATTERN = [0.55, -0.25, 0.15, -0.45, 0.3, -0.1, 0.5, -0.35];
export function facetShade(f: Facet, glare: number): number {
	const k = PATTERN[(f.i + (f.kind === 'star' ? 3 : f.kind === 'kite' ? 0 : f.kind === 'ug' ? 5 : 6)) % 8];
	return k > 0 ? k * glare : k * 0.9;
}

export function shade(rgb: [number, number, number], k: number): [number, number, number] {
	const [r, g, b] = rgb;
	if (k >= 0) {
		const t = k * 0.7;
		return [r + (1 - r) * t, g + (1 - g) * t, b + (1 - b) * t];
	}
	return [r * (1 + k * 0.8), g * (1 + k * 0.8), b * (1 + k * 0.8)];
}

export function pointsAttr(pts: [number, number][]): string {
	return pts.map(([x, y]) => (x * 100).toFixed(1) + ',' + (y * 100).toFixed(1)).join(' ');
}
