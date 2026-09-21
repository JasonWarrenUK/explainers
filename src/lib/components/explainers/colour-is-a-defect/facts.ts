// Derived facts panel: rarity, clarity, fluorescence and cross-cause convergence notes.
// Ported from docs/imports/diamond-colour-simulator.html; copy is verbatim, types added.

import type { DeriveResult, SimParams } from './model';

export interface Rarity {
	tier: number;
	why: string;
	label: string;
}

const FLOOR: Record<string, number> = {
	colourless: 2,
	yellow: 3,
	'yellow-green': 3,
	brown: 1,
	orange: 4,
	blue: 4,
	green: 4,
	'blue-green': 4,
	pink: 3,
	red: 5,
	violet: 5,
	purple: 5,
	white: 4,
	black: 2,
	grey: 3,
	olive: 2
};
const WHY: Record<string, string> = {
	colourless: 'colourless Type Ia is the trade standard',
	yellow: 'Cape yellow is the bulk of what comes out of the ground',
	'yellow-green': 'H3 yellow-green needs radiation and later heating in the same stone',
	brown: 'brown is the commonest colour of all',
	orange: 'pure orange is close to unheard of without a brown or yellow modifier',
	blue: 'Type IIb is about 0.1% of natural diamond',
	green: 'natural body-colour green is rare enough that most greens on the market are treated',
	'blue-green': 'natural blue-green needs radiation on a stone that is already blue or nitrogen-free',
	pink: "Argyle supplied 90% of the world's pinks and closed in 2020",
	red: 'fewer than thirty confirmed natural reds',
	violet: 'violets were an Argyle speciality measured in stones per year',
	purple: 'purple needs deformation and hydrogen in the same crystal',
	white: 'opalescent whites come from a few Indian sources',
	black: 'natural black is uncommon and not prized per carat',
	grey: 'grey is under-collected; the supply is larger than the market for it',
	olive: 'olive is common in some Australian and Brazilian production'
};
const LABELS = ['', 'common', 'uncommon', 'rare', 'very rare', 'vanishingly rare'];

export function rarity(res: DeriveResult, p: SimParams): Rarity {
	const A = res.amps;
	const sig = Object.entries(A).filter(([k, v]) => (v ?? 0) > 0.12 && k !== 'graphite');
	const f = res.desc.family;
	const d = res.desc;
	const floor: Record<string, number> = { ...FLOOR, colourless: p.nitrogen < 5 ? 2 : 1, yellow: (A.c ?? 0) > 0.3 ? 3 : 1, 'yellow-green': (A.ni ?? 0) > 0.3 ? 3 : 2 };
	const why: Record<string, string> = {
		...WHY,
		colourless: p.nitrogen < 5 ? 'Type IIa is about 2% of natural diamond' : 'colourless Type Ia is the trade standard',
		yellow: (A.c ?? 0) > 0.3 ? 'Type Ib survives in under 0.1% of naturals' : 'Cape yellow is the bulk of what comes out of the ground',
		'yellow-green': (A.ni ?? 0) > 0.3 ? 'nickel colour is a synthetic signature; natural examples are scarce' : 'H3 yellow-green needs radiation and later heating in the same stone'
	};
	let tier = floor[f] || 2;
	let reason = why[f] || '';
	// saturation and size move within the floor's band
	const strong = /Vivid/.test(d.grade) || (/Deep/.test(d.grade) && f !== 'brown');
	const weak = /Faint|Very Light|D to F|G to H|I to J|K to M/.test(d.grade);
	if (strong && f !== 'brown' && f !== 'black') {
		tier = Math.min(5, tier + 1);
		reason += '; at this saturation it is a fraction of an already small population';
	}
	if (weak && tier > 1 && f !== 'colourless') {
		tier = Math.max(1, tier - 1);
		reason += '; faint versions are far commoner than the saturated ones the name evokes';
	}
	if (p.carats >= 5 && tier >= 3) {
		tier = Math.min(5, tier + 1);
		reason += '; at ' + p.carats.toFixed(1) + ' ct the size alone thins the field';
	}
	if (res.zone) {
		tier = Math.min(5, tier + 1);
		reason += '; two growth sectors with different chemistry in one crystal is a further filter';
	}
	if (res.chameleon) {
		tier = 5;
		reason = 'chameleons are rare enough to have names';
	}
	if (sig.length >= 3) {
		tier = Math.min(5, tier + 1);
		reason += '; three independent causes converging in one crystal compounds the odds';
	}
	return { tier, why: reason, label: LABELS[tier] };
}

export function clarity(p: SimParams, res: DeriveResult): string {
	const notes: string[] = [];
	if (p.strain > 65) notes.push('heavy graining; clarity capped near SI');
	else if (p.strain > 30) notes.push('visible graining; clarity capped near VS');
	if (p.inclusions > 50) notes.push('opaque clouds; I range if not opaque');
	else if (p.inclusions > 10) notes.push('dark inclusions lower clarity');
	if (p.clouds > 30) notes.push('milky; labs grade the transparency and set clarity aside');
	if (res.stains > 0.2) notes.push('green surface stains; cutters often keep one as a natural');
	return notes.length ? notes.join('. ') + '.' : 'nothing here lowers clarity; Flawless is available';
}

export function fluorescence(res: DeriveResult): string {
	const A = res.amps;
	const out: string[] = [];
	if ((A.n3 ?? 0) > 0.15) out.push('blue under long-wave UV (N3)');
	if ((A.h3 ?? 0) > 0.15) out.push('green (H3), strong enough to feed the daylight colour');
	if ((A.boron ?? 0) > 0.1) out.push("none under UV; red phosphorescence after short-wave, the Hope's party trick");
	if ((A.c ?? 0) > 0.3) out.push('weak orange');
	if ((A.nv ?? 0) > 0.2) out.push('orange to red (NV)');
	return out.length ? out.join('; ') : 'inert';
}

export function convergence(p: SimParams, res: DeriveResult): string[] {
	const notes: string[] = [];
	if (res.zone && res.zone.kind === 'boron')
		notes.push(
			'boron and nitrogen have separated into growth sectors: the nitrogen zone is ' +
				res.desc.name +
				', the boron zone ' +
				res.zone.desc.name +
				'. The stone is two-toned, and a lab would type it as mixed'
		);
	if (res.zone && res.zone.kind === 'ib')
		notes.push(
			'a late growth sector kept its nitrogen single: ' +
				res.zone.desc.name +
				' beside ' +
				res.desc.name +
				'. Face-up the eye blends them to ' +
				res.faceUp.desc.name
		);
	if (res.compensated)
		notes.push(
			res.bEff > 0
				? 'single nitrogen has cancelled part of the boron; the blue is weaker than the boron alone would give'
				: 'the boron is fully compensated by single nitrogen: no blue at all, the stone is not even semiconducting'
		);
	if (p.strain > 20 && p.dose > 15 && p.heating < 30 && p.radSource !== 'alpha')
		notes.push('deformation and radiation together: brown or pink under green gives olive or a muddied pink');
	if ((res.amps.n3 ?? 0) > 0.2 && (res.amps.gr1 ?? 0) > 0.2) notes.push('Cape yellow under GR1 green mixes to greenish yellow');
	if ((res.amps.pink ?? 0) > 0.2 && (res.amps.hyd ?? 0) > 0.2) notes.push('pink with hydrogen slides toward purple, the Argyle purplish-pink recipe');
	if ((res.amps.pink ?? 0) > 0.2 && (res.amps.brown ?? 0) > 0.2) notes.push('pink and brown from the same deformation event; most Argyle pinks carry this brown modifier');
	if (res.chamS > 0.05 && !res.chameleon)
		notes.push('partway to a chameleon: the olive component is at ' + Math.round(res.chamS * 100) + '% and grows smoothly with hydrogen, nickel and the 480 nm band');
	if (res.chameleon) notes.push('chameleon: hydrogen, nickel and the 480 nm band together. Warm the stone to watch the olive drop away');
	if (res.hpht)
		notes.push(
			'HPHT anneal removed the brown' +
				((res.amps.h3 ?? 0) > 0.1
					? ' and left yellow-green H3 in its place, as it does in Type Ia'
					: (res.amps.nv ?? 0) > 0.1
						? ' and created orange NV centres from the single nitrogen'
						: '; with no nitrogen there was nothing for the vacancies to find, so the stone went colourless')
		);
	if (p.dose > 15 && p.heating > 30 && p.radSource !== 'alpha') {
		if (p.nitrogen < 5) notes.push('heating a nitrogen-free stone after radiation fades the green and makes nothing new; the vacancies have nothing to combine with');
		else notes.push('heating after radiation: vacancies migrated to nitrogen and made ' + ((res.amps.h3 ?? 0) > (res.amps.nv ?? 0) ? 'H3 (yellow-green)' : 'NV (orange)'));
	}
	if (p.radSource === 'alpha' && p.dose > 10) notes.push('alpha radiation only stains the skin; the body colour is set by everything else');
	if (p.carats >= 3 && res.desc.C > 3 && res.desc.C < 25)
		notes.push('at ' + p.carats.toFixed(1) + ' ct the light path deepens a tint that would grade near-colourless in a small stone');
	return notes;
}
