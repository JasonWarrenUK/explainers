// Reverse solver: given a target hex colour, search the parameter space for the recipe whose
// face-up colour is closest to it in CIELAB.
// Ported from docs/imports/diamond-colour-simulator.html; copy is verbatim, types added.

import type { ColourResult, SimParams } from './model';
import { derive, labDist, xyzToLab } from './model';
import { CONTROLS, DEFAULTS, PRESETS } from './data';

export const SOLVE_KEYS: (keyof SimParams)[] = [
	'nitrogen',
	'temp',
	'time',
	'boron',
	'hydrogen',
	'nickel',
	'b480',
	'strain',
	'pinkFrac',
	'dose',
	'heating',
	'inclusions'
];

function hexToLab(h: string): [number, number, number] {
	const v = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
	const X = 0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2],
		Y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2],
		Z = 0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2];
	return xyzToLab([X, Y, Z]);
}

export interface SolveResult {
	params: SimParams;
	dE: number;
	reached: ColourResult;
}

function setNumeric(p: SimParams, k: keyof SimParams, v: number): void {
	(p[k] as number) = v;
}

/** Coordinate-descent search for the recipe whose face-up colour is nearest to targetHex. */
export function solve(targetHex: string, currentCarats: number): SolveResult {
	const target = hexToLab(targetHex);
	const lim: Partial<Record<keyof SimParams, { min: number; max: number; log?: boolean }>> = {};
	CONTROLS.forEach((g) =>
		g.items.forEach((c) => {
			if ('min' in c) lim[c.k] = c;
		})
	);
	const rnd = (k: keyof SimParams) => {
		const c = lim[k]!;
		return c.log ? Math.exp(Math.log(c.min) + Math.random() * (Math.log(c.max) - Math.log(c.min))) : c.min + Math.random() * (c.max - c.min);
	};
	const cost = (p: SimParams) => labDist(derive(p).faceUp.lab, target);
	let best: SimParams | null = null,
		bestC = Infinity;
	const base: SimParams = { ...DEFAULTS, carats: currentCarats };
	const starts: SimParams[] = [
		base,
		...PRESETS.map(([, q]) => ({ ...base, ...q })),
		...Array.from({ length: 24 }, () => {
			const p: SimParams = { ...base };
			SOLVE_KEYS.forEach((k) => {
				if (Math.random() < 0.35) setNumeric(p, k, rnd(k));
			});
			return p;
		})
	];
	starts.forEach((p) => {
		const c = cost(p);
		if (c < bestC) {
			bestC = c;
			best = p;
		}
	});
	// coordinate descent with shrinking steps
	let cur: SimParams = { ...(best ?? base) },
		curC = bestC;
	for (let round = 0; round < 6; round++) {
		const scale = Math.pow(0.5, round);
		SOLVE_KEYS.forEach((k) => {
			const c = lim[k]!;
			const span = c.log ? null : (c.max - c.min) * 0.25 * scale;
			[-1, 1].forEach((dir) => {
				const p: SimParams = { ...cur };
				const nextVal = c.log ? Math.exp(Math.log(cur[k] as number) + dir * scale * 2) : (cur[k] as number) + dir * (span as number);
				setNumeric(p, k, Math.max(c.min, Math.min(c.max, nextVal)));
				const cc = cost(p);
				if (cc < curC) {
					curC = cc;
					cur = p;
				}
			});
		});
	}
	return { params: cur, dE: curC, reached: derive(cur).faceUp };
}
