// Spectral colour model for diamond defect centres.
// Absorbance = sum(amplitude_i * band_i(lambda)) * pathLength; transmittance -> CIE XYZ -> sRGB / Lab.
// Ported from docs/imports/diamond-colour-simulator.html with types added; behaviour and constants unchanged.

export type BandKey =
	| 'n3'
	| 'c'
	| 'b480'
	| 'boron'
	| 'brown'
	| 'pink'
	| 'gr1'
	| 'h3'
	| 'nv'
	| 'hyd'
	| 'ni'
	| 'graphite'
	| 'cham';

export type Amplitudes = Partial<Record<BandKey, number>>;

export interface BandInfo {
	label: string;
	detail: string;
	colour: string;
}

export interface ColourDescription {
	L: number;
	C: number;
	h: number;
	family: string;
	name: string;
	grade: string;
}

export interface ColourResult {
	T: number[];
	rgb: [number, number, number];
	lab: [number, number, number];
	hex: string;
	desc: ColourDescription;
}

export interface RadSource {
	value: 'body' | 'alpha';
}

export interface SimParams {
	nitrogen: number;
	temp: number;
	time: number;
	ibSector: number;
	boron: number;
	hydrogen: number;
	nickel: number;
	b480: number;
	strain: number;
	pinkFrac: number;
	dose: number;
	radSource: 'body' | 'alpha';
	heating: number;
	hpht: boolean;
	inclusions: number;
	clouds: number;
	carats: number;
	warm: boolean;
}

export interface ZoneResult extends ColourResult {
	frac: number;
	kind: 'boron' | 'ib';
	label: string;
}

export interface DeriveResult {
	amps: Amplitudes;
	mainAmps: Amplitudes;
	lab: [number, number, number];
	rgb: [number, number, number];
	hex: string;
	desc: ColourDescription;
	T: number[];
	zone: ZoneResult | null;
	faceUp: ColourResult;
	type: string;
	nIso: number;
	nA: number;
	nB: number;
	a: number;
	b: number;
	bEff: number;
	stains: number;
	chameleon: boolean;
	chamS: number;
	hpht: { brownRemoved: number; gr1Removed: number } | null;
	milky: number;
	path: number;
	fluorRgb: [number, number, number];
	flStrength: number;
	compensated: boolean;
}

function g(l: number, mu: number, s1: number, s2: number): number {
	const s = l < mu ? s1 : s2;
	const t = (l - mu) / s;
	return Math.exp(-0.5 * t * t);
}
// Wyman, Sloan & Shirley (2013) multi-lobe fit to the CIE 1931 observer
function cmf(l: number): [number, number, number] {
	return [
		1.056 * g(l, 599.8, 37.9, 31.0) + 0.362 * g(l, 442.0, 16.0, 26.7) - 0.065 * g(l, 501.1, 20.4, 26.2),
		0.821 * g(l, 568.8, 46.9, 40.5) + 0.286 * g(l, 530.9, 16.3, 31.1),
		1.217 * g(l, 437.0, 11.8, 36.0) + 0.681 * g(l, 459.0, 26.0, 13.8)
	];
}
export const LAMBDAS: number[] = [];
for (let l = 380; l <= 780; l += 4) LAMBDAS.push(l);
const CMF = LAMBDAS.map(cmf);
const WE: [number, number, number] = [0, 0, 0];
CMF.forEach((c) => {
	WE[0] += c[0];
	WE[1] += c[1];
	WE[2] += c[2];
});
const D65: [number, number, number] = [0.9505, 1.0, 1.089];
const gauss = (l: number, mu: number, w: number) => {
	const t = (l - mu) / w;
	return Math.exp(-0.5 * t * t);
};
const sig = (x: number) => 1 / (1 + Math.exp(-x));
const ss = (x: number) => {
	x = Math.max(0, Math.min(1, x));
	return x * x * (3 - 2 * x);
};

// Band shapes. Amplitudes are illustrative, chosen to reproduce the known hue of each centre at moderate concentration.
export const BANDS: Record<BandKey, (l: number) => number> = {
	n3: (l) => 0.9 * gauss(l, 415, 9) + 0.55 * sig((478 - l) / 14),
	c: (l) => sig((525 - l) / 22),
	b480: (l) => gauss(l, 480, 40) + 0.7 * sig((432 - l) / 18),
	boron: (l) => 0.9 * sig((l - 540) / 55) + 0.1,
	brown: (l) => 0.6 * sig((560 - l) / 70) + 0.42,
	pink: (l) => gauss(l, 550, 42) + 1.0 * sig((488 - l) / 22),
	gr1: (l) => 0.35 * gauss(l, 741, 7) + gauss(l, 625, 65) + 0.9 * sig((478 - l) / 20),
	h3: (l) => 0.5 * gauss(l, 503, 7) + 1.0 * gauss(l, 468, 30) + 0.5 * sig((445 - l) / 15),
	nv: (l) => gauss(l, 588, 26) + 0.4 * gauss(l, 637, 8) + 0.8 * sig((555 - l) / 22),
	hyd: (l) => 0.8 * gauss(l, 578, 48) + 0.18,
	ni: (l) => 0.8 * gauss(l, 658, 30) + 0.6 * gauss(l, 420, 60) + 0.1,
	graphite: () => 1,
	cham: (l) => gauss(l, 640, 65)
};
// Zero-phonon lines and band centres, for the spectrum markers
export const LINES: Record<BandKey, number[]> = {
	n3: [415],
	c: [],
	b480: [480],
	boron: [],
	brown: [],
	pink: [550],
	gr1: [741],
	h3: [503],
	nv: [595, 637],
	hyd: [],
	ni: [658],
	graphite: [],
	cham: []
};
export const INFO: Record<BandKey, BandInfo> = {
	n3: { label: 'N3 centre', detail: 'three nitrogens round a vacancy; 415 nm line and the Cape absorption edge', colour: 'yellow' },
	c: { label: 'C centre', detail: 'single substitutional nitrogen; absorption edge from about 560 nm into the blue', colour: 'yellow to orange' },
	b480: { label: '480 nm band', detail: 'broad band of unsettled origin; seen in orange and chameleon stones', colour: 'orange' },
	boron: { label: 'boron acceptor', detail: 'uncompensated boron; absorbs from the red into the infrared', colour: 'blue' },
	brown: { label: 'vacancy clusters', detail: 'plastic deformation product; featureless absorption rising into the blue', colour: 'brown' },
	pink: { label: '550 nm band', detail: 'deformation-related band; its exact defect is still argued over', colour: 'pink to red' },
	gr1: { label: 'GR1 centre', detail: 'neutral vacancy from radiation; 741 nm line with a broad red-orange band', colour: 'green' },
	h3: {
		label: 'H3 centre',
		detail: 'nitrogen pair with vacancy, made by heating radiation damage in Type IaA material; 503 nm',
		colour: 'yellow-green'
	},
	nv: { label: 'NV and 595 nm centres', detail: 'nitrogen-vacancy from heating radiation damage in isolated-nitrogen material', colour: 'pinkish orange' },
	hyd: { label: 'hydrogen-related centres', detail: 'broad absorption across the green and blue; the Argyle violet mechanism', colour: 'violet to grey' },
	ni: { label: 'nickel-related centres', detail: '658 nm and violet absorption; common in HPHT synthetics, rare in nature', colour: 'green-yellow' },
	graphite: { label: 'opaque inclusions', detail: 'graphite or sulphide clouds; flat absorption', colour: 'grey to black' },
	cham: {
		label: 'chameleon absorption',
		detail: 'red absorption present only while the stone is cool; mechanism unsettled, modelled empirically',
		colour: 'olive green when cool'
	}
};

export function transmittance(amps: Amplitudes, path: number, fluor: number): number[] {
	return LAMBDAS.map((l) => {
		let A = 0;
		for (const k in amps) {
			const v = amps[k as BandKey];
			if (v && v > 0) A += v * BANDS[k as BandKey](l);
		}
		let T = Math.exp(-A * path);
		if (fluor) T = Math.min(1, T + fluor * 0.12 * gauss(l, 522, 22));
		return T;
	});
}
// Integrated absorbance across the visible, per unit path
export function absorbance(amps: Amplitudes): number {
	let s = 0;
	LAMBDAS.forEach((l) => {
		for (const k in amps) {
			const v = amps[k as BandKey];
			if (v && v > 0) s += v * BANDS[k as BandKey](l);
		}
	});
	return s / LAMBDAS.length;
}
export function xyz(T: number[]): [number, number, number] {
	const X: [number, number, number] = [0, 0, 0];
	T.forEach((t, i) => {
		X[0] += t * CMF[i][0];
		X[1] += t * CMF[i][1];
		X[2] += t * CMF[i][2];
	});
	return [(X[0] / WE[0]) * D65[0], (X[1] / WE[1]) * D65[1], (X[2] / WE[2]) * D65[2]];
}
export function xyzToRgb([X, Y, Z]: [number, number, number]): [number, number, number] {
	const r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z,
		g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z,
		b = 0.0557 * X - 0.204 * Y + 1.057 * Z;
	const enc = (v: number) => {
		v = Math.max(0, Math.min(1, v));
		return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
	};
	return [enc(r), enc(g), enc(b)];
}
export function xyzToLab([X, Y, Z]: [number, number, number]): [number, number, number] {
	const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
	const fx = f(X / D65[0]),
		fy = f(Y / D65[1]),
		fz = f(Z / D65[2]);
	return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
export const hex = (rgb: [number, number, number]): string =>
	'#' +
	rgb
		.map((v) =>
			Math.round(v * 255)
				.toString(16)
				.padStart(2, '0')
		)
		.join('');
export const labDist = (a: [number, number, number], b: [number, number, number]): number =>
	Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// ---- Naming ----
interface Anchor {
	h: number;
	n: string;
	r: string;
	adj: string;
}
const ANCHORS: Anchor[] = [
	{ h: 25, n: 'red', r: 'red', adj: 'reddish' },
	{ h: 55, n: 'orange', r: 'orange', adj: 'orangey' },
	{ h: 95, n: 'yellow', r: 'yellow', adj: 'yellowish' },
	{ h: 130, n: 'yellow-green', r: 'yellow-green', adj: 'yellow-greenish' },
	{ h: 160, n: 'green', r: 'green', adj: 'greenish' },
	{ h: 200, n: 'blue-green', r: 'blue-green', adj: 'bluish green' },
	{ h: 265, n: 'blue', r: 'blue', adj: 'bluish' },
	{ h: 300, n: 'violet', r: 'violet', adj: 'violetish' },
	{ h: 335, n: 'purple', r: 'purple', adj: 'purplish' }
];
const ADJ: Record<string, string> = {
	red: 'reddish',
	orange: 'orangey',
	yellow: 'yellowish',
	'yellow-green': 'yellow-greenish',
	green: 'greenish',
	'blue-green': 'bluish green',
	blue: 'bluish',
	violet: 'violetish',
	purple: 'purplish',
	pink: 'pinkish',
	brown: 'brownish',
	olive: 'greenish',
	grey: 'greyish'
};
const dh = (a: number, b: number) => {
	const d = Math.abs(a - b) % 360;
	return d > 180 ? 360 - d : d;
};
// Override table, applied in order after hue naming. Each row: which primaries it applies to, a test on (L, C, h, mod), the new primary, and how to set the modifier.
interface Override {
	on: string[] | null;
	when: (L: number, C: number, h: number, mod: string | null) => boolean;
	to?: string | null;
	mod?: (L: number, C: number, h: number, mod: string | null, prev: string) => string | null;
}
const OVERRIDES: Override[] = [
	{ on: ['red'], when: (L, C) => L > 52 || C < 38, to: 'pink' },
	{
		on: ['orange', 'yellow'],
		when: (L, C, h) => C < 28 && L < 82 && (h < 82 || (C < 28 && h < 100)),
		to: 'brown',
		mod: (_L, C, h, m) => (h > 70 && C > 12 ? 'yellowish' : m === 'reddish' ? 'reddish' : null)
	},
	{ on: ['green', 'yellow-green'], when: (L, C) => C < 20 && L < 75, to: 'olive', mod: () => null },
	{ on: ['pink'], when: (L, C, _h, m) => m === 'orangey' && C < 30 && L < 60, to: 'brown', mod: () => 'pinkish' },
	{ on: ['yellow', 'orange'], when: (L, C, h) => h < 100 && L < 82 && C < 40, to: null, mod: () => 'brownish' },
	{ on: ['pink'], when: (L, C) => L < 72 && C < 30, to: null, mod: () => 'brownish' },
	{ on: null, when: (L, C) => C < 9 && L < 80, to: 'grey', mod: (_L, C, _h, _m, p) => (C > 4.5 ? ADJ[p] || null : null) }
];
export function describe(lab: [number, number, number], milky: number): ColourDescription {
	const [L, a, b] = lab;
	const C = Math.hypot(a, b);
	let h = (Math.atan2(b, a) * 180) / Math.PI;
	if (h < 0) h += 360;
	const out: ColourDescription = { L, C, h, family: '', name: '', grade: '' };
	if (milky > 0.55) {
		out.family = 'white';
		out.name = 'white (opalescent)';
		out.grade = 'Fancy White';
		return out;
	}
	if (L < 9) {
		out.family = 'black';
		out.name = 'black';
		out.grade = 'Fancy Black';
		return out;
	}
	if (C < 2.5) {
		if (L > 86) {
			out.family = 'colourless';
			out.name = 'colourless';
			out.grade = 'D to F';
			return out;
		}
		out.family = 'grey';
		out.name = L < 28 ? 'near-black grey' : 'grey';
		out.grade = L < 28 ? 'Fancy Dark Grey' : 'Fancy Grey';
		return out;
	}
	const ranked = ANCHORS.map((x) => ({ ...x, d: dh(h, x.h) })).sort((p, q) => p.d - q.d);
	let primary = ranked[0].n,
		mod: string | null = null;
	if (ranked[1].d < 42 && ranked[0].d / ranked[1].d > 0.55 && !(ranked[0].r.includes(ranked[1].r) || ranked[1].r.includes(ranked[0].r)))
		mod = ranked[1].adj;
	for (const o of OVERRIDES) {
		if (o.on && !o.on.includes(primary)) continue;
		if (!o.when(L, C, h, mod)) continue;
		const prev = primary;
		if (o.mod) mod = o.mod(L, C, h, mod, prev);
		if (o.to !== undefined && o.to !== null) primary = o.to;
	}
	if (mod && (mod.startsWith(primary) || primary.startsWith(mod.replace(/ish$|y$/, '')))) mod = null;
	out.family = primary;
	out.name = (mod ? mod + ' ' : '') + primary;
	out.grade = grade(primary, mod, L, C, h, out.name);
	return out;
}
const LADDER = ['Faint', 'Very Light', 'Light', 'Fancy Light', 'Fancy', 'Fancy Intense', 'Fancy Vivid'];
function grade(primary: string, mod: string | null, L: number, C: number, h: number, name: string): string {
	const dz = ((primary === 'yellow' && C < 18 && (!mod || h < 115)) || (primary === 'brown' && C < 8 && !mod)) && L > 55;
	if (dz) {
		const letter = C < 1.5 ? 'D to F' : C < 3 ? 'G to H' : C < 4.5 ? 'I to J' : C < 6.5 ? 'K to M' : C < 10 ? 'N to R' : 'S to Z';
		return letter + (C >= 3 ? ' (' + (C < 6.5 ? 'faint' : C < 10 ? 'very light' : 'light') + ' ' + primary + ')' : '');
	}
	if (primary === 'grey') return (L < 45 ? 'Fancy Dark' : L > 80 ? 'Faint' : 'Fancy') + ' ' + name;
	let i = C < 6 ? 0 : C < 11 ? 1 : C < 17 ? 2 : C < 25 ? 3 : C < 38 ? 4 : C < 52 ? 5 : 6;
	// tone: very light stones read one step weaker; dark stones go Deep or Dark
	if (L > 90 && i > 0) i -= 1;
	if (L < 45) return (C >= 26 ? 'Fancy Deep ' : 'Fancy Dark ') + name;
	if (L < 60 && i >= 4) return 'Fancy Deep ' + name;
	return LADDER[i] + ' ' + name;
}

export function colourOf(amps: Amplitudes, path: number, milky: number): ColourResult {
	const T0 = transmittance(amps, path, Math.min(1, amps.h3 || 0));
	let rgb0 = xyzToRgb(xyz(T0));
	let lab0 = xyzToLab(xyz(T0));
	if (milky > 0) {
		const Tm = T0.map((v) => v * (1 - milky) + milky * 0.96);
		rgb0 = rgb0.map((v) => v * (1 - milky) + milky * 0.96) as [number, number, number];
		lab0 = xyzToLab(xyz(Tm));
	}
	return { T: T0, rgb: rgb0, lab: lab0, hex: hex(rgb0), desc: describe(lab0, milky) };
}

// Turn slider inputs into defect amplitudes, plus derived facts.
export function derive(p: SimParams): DeriveResult {
	const N = p.nitrogen,
		T = p.temp,
		t = p.time;
	const k1 = (N / 500 + 0.05) * Math.pow(10, (T - 1100) / 140);
	const a = 1 - Math.exp(-k1 * t);
	const k2 = (N / 500 + 0.05) * 0.0012 * Math.pow(10, (T - 1200) / 110);
	const b = 1 - Math.exp(-k2 * t);
	const nIso = N * (1 - a),
		nA = N * a * (1 - b),
		nB = N * a * b;
	const bEff = Math.max(0, p.boron - nIso); // one donor cancels one acceptor
	const amps: Amplitudes = {};
	amps.c = 0.03 * nIso;
	amps.n3 = 0.0025 * nB;
	amps.boron = 2.0 * bEff;
	amps.hyd = (1.2 * p.hydrogen) / 100;
	amps.ni = (1.0 * p.nickel) / 100;
	amps.b480 = (1.4 * p.b480) / 100;
	const S = p.strain / 100,
		P = p.pinkFrac / 100;
	let brown = 2.2 * S * (1 - P);
	const pink = 2.4 * S * P;
	let gr1Total = (2.0 * p.dose) / 100;
	let stains = 0;
	if (p.radSource === 'alpha') {
		stains = gr1Total;
		gr1Total = 0;
	}
	const f = p.heating / 100;
	const aPresent = Math.min(1, nA / 60),
		isoPresent = Math.min(1, nIso / 15);
	let gr1 = gr1Total * (1 - f);
	let h3 = gr1Total * f * aPresent * 0.9;
	let nv = gr1Total * f * isoPresent * 1.2;
	let hpht: { brownRemoved: number; gr1Removed: number } | null = null;
	if (p.hpht) {
		hpht = { brownRemoved: brown, gr1Removed: gr1 };
		h3 += brown * 0.45 * aPresent;
		nv += brown * 0.2 * isoPresent;
		brown = 0;
		gr1 = 0;
	}
	amps.brown = brown;
	amps.pink = pink;
	amps.gr1 = gr1;
	amps.h3 = h3;
	amps.nv = nv;
	amps.graphite = (6.0 * p.inclusions) / 100;
	// chameleon: a smooth product of three ramps, no thresholds
	const chamS = ss(p.hydrogen / 30) * ss(p.nickel / 30) * ss(p.b480 / 50);
	amps.cham = p.warm ? 0 : 1.0 * chamS;
	amps.hyd *= 1 - 0.6 * chamS;
	const chameleon = chamS > 0.35;
	const milky = p.clouds / 100;
	const path = Math.cbrt(p.carats);
	// zoning: boron sector, or a late Ib growth sector
	let zone: ZoneResult | null = null,
		mainAmps: Amplitudes = amps;
	if (N > 5 && bEff > 0.05) {
		mainAmps = { ...amps };
		delete mainAmps.boron;
		const bAmps: Amplitudes = {};
		for (const k in amps) if (!['n3', 'c', 'h3', 'nv'].includes(k)) bAmps[k as BandKey] = amps[k as BandKey];
		zone = { ...colourOf(bAmps, path, milky), frac: 0.5, kind: 'boron', label: 'boron sector' };
	} else if (N > 5 && a > 0.25 && p.ibSector > 0) {
		const zAmps: Amplitudes = { ...amps, c: 0.03 * N, n3: 0, h3: 0, nv: gr1Total * f * 1.2 + (p.hpht ? 0.2 * brown : 0) };
		zone = { ...colourOf(zAmps, path, milky), frac: p.ibSector / 100, kind: 'ib', label: 'single-nitrogen sector' };
	}
	const main = colourOf(mainAmps, path, milky);
	let faceUp: ColourResult = main;
	if (zone) {
		const z = zone;
		const Tb = main.T.map((v, i) => v * (1 - z.frac) + z.T[i] * z.frac);
		const Xb = xyz(Tb);
		const rgbB = xyzToRgb(Xb),
			labB = xyzToLab(Xb);
		faceUp = { T: Tb, rgb: rgbB, lab: labB, hex: hex(rgbB), desc: describe(labB, milky) };
	}
	let type: string;
	const hasN = N > 5;
	if (!hasN) type = bEff > 0.05 ? 'IIb' : 'IIa';
	else {
		const parts: string[] = [];
		if (nIso > N * 0.15 || (zone && zone.kind === 'ib')) parts.push('Ib');
		if (nA > N * 0.15 || nB > N * 0.15) parts.push('Ia' + (nA > nB * 2 ? 'A' : nB > nA * 2 ? 'B' : 'AB'));
		type = parts.join(' / ') || 'Ia';
		if (zone) type += ', zoned';
		if (zone && zone.kind === 'boron') type = type.replace(', zoned', ' / IIb, zoned');
	}
	// fluorescence colour under long-wave UV
	const fl: [number, number, number] = [0, 0, 0];
	const add = (k: BandKey, c: [number, number, number]) => {
		const v = Math.min(1, amps[k] || 0);
		fl[0] += c[0] * v;
		fl[1] += c[1] * v;
		fl[2] += c[2] * v;
	};
	add('n3', [0.25, 0.45, 1.0]);
	add('h3', [0.35, 1.0, 0.45]);
	add('nv', [1.0, 0.35, 0.2]);
	add('c', [0.5, 0.3, 0.05]);
	const flMax = Math.max(...fl, 0.001);
	const flStrength = Math.min(1, flMax);
	const fluorRgb = fl.map((v) => (v / flMax) * flStrength) as [number, number, number];
	return {
		amps,
		mainAmps,
		lab: main.lab,
		rgb: main.rgb,
		hex: main.hex,
		desc: main.desc,
		T: main.T,
		zone,
		faceUp,
		type,
		nIso,
		nA,
		nB,
		a,
		b,
		bEff,
		stains,
		chameleon,
		chamS,
		hpht,
		milky,
		path,
		fluorRgb,
		flStrength,
		compensated: p.boron > 0 && bEff < p.boron
	};
}

// Bruton's wavelength-to-RGB approximation, with the visible ends faded
export const WAVE_RGB: [number, number, number][] = LAMBDAS.map((l) => {
	let r = 0,
		g = 0,
		b = 0;
	if (l < 440) {
		r = -(l - 440) / 60;
		b = 1;
	} else if (l < 490) {
		g = (l - 440) / 50;
		b = 1;
	} else if (l < 510) {
		g = 1;
		b = -(l - 510) / 20;
	} else if (l < 580) {
		r = (l - 510) / 70;
		g = 1;
	} else if (l < 645) {
		r = 1;
		g = -(l - 645) / 65;
	} else {
		r = 1;
	}
	const f = l < 420 ? 0.3 + (0.7 * (l - 380)) / 40 : l > 700 ? 0.3 + (0.7 * (780 - l)) / 80 : 1;
	return [r * f, g * f, b * f];
});
