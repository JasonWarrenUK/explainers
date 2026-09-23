// Every non-empty combination of the nine elemental causes, plus provenance for the current
// simulator state and the parameter guess that reproduces a chosen combination.
// Ported from docs/imports/diamond-colour-simulator.html; copy is verbatim, types added.

import type { Amplitudes, BandKey, ColourDescription, DeriveResult, SimParams } from './model';
import { absorbance, describe, hex, transmittance, xyz, xyzToLab, xyzToRgb } from './model';
import { DEFAULTS, DOCUMENTED, DOCUMENTED_EXTRA, ELEMENTS, TREATED } from './data';

export type ComboStatus = 'documented' | 'possible' | 'cancels' | 'substitutes' | 'zoned';

export interface ComboZone {
	hex: string;
	desc: ColourDescription;
}
export interface Combo {
	keys: BandKey[];
	names: string[];
	hex: string;
	desc: Pick<ColourDescription, 'name' | 'L' | 'C' | 'h'>;
	zones: ComboZone[] | null;
	status: ComboStatus;
	why: string;
	order: number;
}

const REF_ABS = ELEMENTS.reduce((s, e) => s + absorbance({ [e.k]: e.amp }), 0) / ELEMENTS.length;

function col(am: Amplitudes): ComboZone {
	const X_ = xyz(transmittance(am, 1, am.h3 ? 0.8 : 0));
	return { hex: hex(xyzToRgb(X_)), desc: describe(xyzToLab(X_), 0) };
}
function norm(am: Amplitudes, order: number): Amplitudes {
	if (order < 2) return am;
	const s = Math.min(1, (1.7 * REF_ABS) / absorbance(am));
	const o: Amplitudes = {};
	for (const k in am) o[k as BandKey] = (am[k as BandKey] ?? 0) * s;
	return o;
}

/** Every non-empty combination of the nine elemental causes: 511 rows. Expensive; call once and cache. */
export function combos(): Combo[] {
	const out: Combo[] = [];
	const n = ELEMENTS.length;
	for (let m = 1; m < 1 << n; m++) {
		const set = ELEMENTS.filter((_, i) => m & (1 << i));
		const keys = set.map((e) => e.k).sort();
		let amps: Amplitudes = {};
		set.forEach((e) => (amps[e.k] = e.amp));
		const key = keys.join('+');
		let status: ComboStatus = DOCUMENTED.has(key) ? 'documented' : 'possible';
		let why = '';
		let zones: ComboZone[] | null = null;
		if (keys.includes('c') && keys.includes('boron')) {
			status = 'cancels';
			why =
				'Single nitrogen donates an electron, boron accepts one, and a boron atom that has taken an electron no longer absorbs light. At these amounts nitrogen is in excess, so the boron goes dark and the blue never appears. The swatch is rendered without it.';
			delete amps.boron;
		} else if (keys.includes('h3') && keys.includes('c') && !keys.includes('n3')) {
			status = 'substitutes';
			why =
				'H3 is a vacancy trapped by a nitrogen pair. Single-nitrogen material has no pairs, so the vacancy is trapped by a lone nitrogen and becomes NV, which is orange. The swatch is rendered with NV in place of H3.';
			amps.nv = amps.h3;
			delete amps.h3;
		}
		amps = norm(amps, keys.length);
		if (keys.includes('boron') && (keys.includes('n3') || keys.includes('h3'))) {
			status = 'zoned';
			const nAmps: Amplitudes = { ...amps };
			delete nAmps.boron;
			const bAmps: Amplitudes = {};
			for (const k in amps) if (!['n3', 'h3', 'c'].includes(k)) bAmps[k as BandKey] = amps[k as BandKey];
			zones = [col(nAmps), col(bAmps)];
			why =
				'Boron survives only where nitrogen is absent, and N3 and H3 need nitrogen. A crystal carrying both grows them in separate sectors, so a cut stone shows a ' +
				zones[0].desc.name +
				' zone beside a ' +
				zones[1].desc.name +
				' one. The swatch shows both; a lab would call it mixed type.';
		}
		const c = col(amps);
		out.push({
			keys,
			names: set.map((e) => e.name),
			hex: c.hex,
			desc: zones ? { name: zones[0].desc.name + ' and ' + zones[1].desc.name + ', zoned', L: c.desc.L, C: c.desc.C, h: c.desc.h } : c.desc,
			zones,
			status,
			why,
			order: keys.length
		});
	}
	return out;
}

export interface Provenance {
	label: string;
	detail: string;
}
/** Provenance of whatever the simulator currently shows. */
export function provenance(res: DeriveResult, p: SimParams): Provenance {
	const sig = Object.entries(res.amps)
		.filter(([, v]) => (v ?? 0) > 0.12)
		.map(([k]) => k)
		.sort();
	const key = sig.join('+');
	if (res.zone && res.zone.kind === 'boron') {
		const mainKey = sig.filter((k) => k !== 'boron').join('+');
		const bKey = sig.filter((k) => !['n3', 'c', 'h3', 'nv'].includes(k)).join('+');
		const both = (DOCUMENTED.has(mainKey) || DOCUMENTED_EXTRA.has(mainKey) || mainKey === '') && (DOCUMENTED.has(bKey) || DOCUMENTED_EXTRA.has(bKey));
		return {
			label: 'zoned, not blended',
			detail: both
				? 'each zone is a documented colour on its own; the pairing in one crystal is mixed type'
				: 'two-toned mixed type; at least one zone is itself an undocumented pairing'
		};
	}
	if (res.zone && res.zone.kind === 'ib')
		return { label: 'documented', detail: 'Ia/Ib zoning by growth sector is on record; the two tones are graded together face-up' };
	if (p.boron > 0 && res.bEff <= 0.05 && p.nitrogen > 5)
		return {
			label: 'cancels out',
			detail: 'boron is fully compensated by single nitrogen; ' + (key === '' ? 'colourless' : 'the remaining colour') + ' is what a lab would see, and the boron only shows in the infrared'
		};
	if (key === '')
		return {
			label: 'documented',
			detail: p.nitrogen < 5 ? 'Type IIa colourless is about 2% of natural diamond' : 'colourless Type Ia is the trade standard'
		};
	if (res.milky > 0.55) return { label: 'documented', detail: 'opalescent white is a known, if scarce, natural colour' };
	if (res.chameleon)
		return {
			label: 'documented',
			detail: 'hydrogen, nickel and the 480 nm band together is the chameleon recipe; the Chopard Chameleon is the famous one'
		};
	if (res.hpht || (p.dose > 15 && p.heating > 30)) {
		if (DOCUMENTED.has(key) || DOCUMENTED_EXTRA.has(key) || TREATED.has(key))
			return {
				label: 'documented, mostly by treatment',
				detail: 'this recipe occurs in nature but most stones showing it were irradiated or annealed in a lab; labs test for it'
			};
	}
	if (DOCUMENTED.has(key) || DOCUMENTED_EXTRA.has(key)) return { label: 'documented', detail: 'natural stones with this combination of causes are on record' };
	if (sig.length === 1) return { label: 'documented', detail: 'a single cause; every one of them is known in nature' };
	if (sig.includes('ni'))
		return {
			label: 'possible, no example known',
			detail: 'nickel centres are a signature of synthesis; natural stones carrying them alongside other causes are barely reported'
		};
	return {
		label: 'possible, no example known',
		detail: 'nothing forbids this pairing and I know of no natural stone that shows it. My assessment, so it may simply be unreported'
	};
}

export interface ComboParamsResult {
	p: Partial<SimParams>;
	notes: string[];
}
/** A parameter guess that reproduces the given combination's keys through the full kinetics. */
export function comboParams(keys: BandKey[]): ComboParamsResult {
	const p: Partial<SimParams> = { ...DEFAULTS };
	const notes: string[] = [];
	const has = (k: BandKey) => keys.includes(k);
	if (has('c') && has('n3')) {
		p.nitrogen = 1200;
		p.temp = 1200;
		p.time = 1500;
		p.ibSector = 40;
		notes.push(
			'N3 and single nitrogen need opposite residence histories, so the single nitrogen is loaded as a late growth sector and the stone renders two-toned.'
		);
	} else if (has('c')) {
		p.nitrogen = 40;
		p.temp = 950;
		p.time = 0.5;
	} else if (has('n3')) {
		p.nitrogen = 1500;
		p.temp = 1250;
		p.time = 2500;
	}
	if (has('h3') && !has('n3') && !has('c')) {
		p.nitrogen = 600;
		p.temp = 1100;
		p.time = 300;
		notes.push('H3 needs nitrogen pairs, so 600 ppm of aggregated nitrogen was added; on its own that is colourless.');
	}
	if (has('boron')) {
		p.boron = 0.6;
		if (has('c')) notes.push('Boron loaded at 0.6 ppm; single nitrogen cancels it atom for atom, so there will be no blue until boron exceeds the single nitrogen.');
	}
	if (has('hyd')) p.hydrogen = 70;
	if (has('ni')) p.nickel = 70;
	if (has('brown') && has('pink')) {
		p.strain = 70;
		p.pinkFrac = 50;
	} else if (has('brown')) {
		p.strain = 60;
		p.pinkFrac = 0;
	} else if (has('pink')) {
		p.strain = 55;
		p.pinkFrac = 100;
	}
	if (has('gr1') && has('h3')) {
		p.dose = 60;
		p.heating = 50;
	} else if (has('gr1')) {
		p.dose = 45;
	} else if (has('h3')) {
		p.dose = 45;
		p.heating = 85;
	}
	return { p, notes };
}
