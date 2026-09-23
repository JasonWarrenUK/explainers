// Static tables: defaults, controls, presets, catalogue, famous stones, elemental causes.
// Ported from docs/imports/diamond-colour-simulator.html; copy is verbatim, types added.

import type { BandKey, SimParams } from './model';

export const DEFAULTS: SimParams = {
	nitrogen: 0,
	temp: 1150,
	time: 1000,
	ibSector: 0,
	boron: 0,
	hydrogen: 0,
	nickel: 0,
	b480: 0,
	strain: 0,
	pinkFrac: 50,
	dose: 0,
	radSource: 'body',
	heating: 0,
	hpht: false,
	inclusions: 0,
	clouds: 0,
	carats: 1,
	warm: false
};

export type ControlKey = Exclude<keyof SimParams, 'radSource' | 'hpht' | 'warm'>;

export interface RangeControl {
	k: ControlKey;
	label: string;
	unit: string;
	min: number;
	max: number;
	step: number;
	note: string;
	log?: boolean;
	play?: boolean;
	lo?: string;
	hi?: string;
	inert?: (p: SimParams) => string | null;
}
export interface ChoiceControl {
	k: 'radSource';
	label: string;
	type: 'choice';
	options: [string, string][];
	note: string;
}
export interface ToggleControl {
	k: 'hpht';
	label: string;
	type: 'toggle';
	note: string;
	inert?: (p: SimParams) => string | null;
}
export type Control = RangeControl | ChoiceControl | ToggleControl;
export interface ControlGroup {
	group: string;
	items: Control[];
}

export const CONTROLS: ControlGroup[] = [
	{
		group: 'What Went Into the Lattice',
		items: [
			{
				k: 'nitrogen',
				label: 'Nitrogen',
				unit: 'ppm',
				min: 0,
				max: 3000,
				step: 5,
				note: 'The commonest impurity. Colour depends on how it is arranged, which the mantle decides below.'
			},
			{
				k: 'boron',
				label: 'Boron',
				unit: 'ppm',
				min: 0,
				max: 3,
				step: 0.02,
				note: 'Each single nitrogen atom cancels one boron atom, so blue needs boron in excess of single nitrogen. A few ppm of Ib nitrogen kills any natural boron content.'
			},
			{
				k: 'hydrogen',
				label: 'Hydrogen',
				unit: '',
				min: 0,
				max: 100,
				step: 1,
				note: 'Relative scale. Violet, grey and the chameleon effect all involve it.'
			},
			{
				k: 'nickel',
				label: 'Nickel',
				unit: '',
				min: 0,
				max: 100,
				step: 1,
				note: 'Relative scale. Green-yellow; routine in HPHT synthetics, rare in nature.'
			},
			{
				k: 'b480',
				label: '480 nm band',
				unit: '',
				min: 0,
				max: 100,
				step: 1,
				note: 'A broad absorption nobody has pinned to a defect; orange and chameleon stones carry it.'
			}
		]
	},
	{
		group: 'How Long the Mantle Cooked It',
		items: [
			{
				k: 'temp',
				label: 'Temperature',
				unit: '°C',
				min: 900,
				max: 1400,
				step: 5,
				note: 'Hotter and longer moves single nitrogen into pairs (A), then into fours (B); the N3 centres that make Cape yellow appear alongside B.'
			},
			{
				k: 'time',
				label: 'Residence',
				unit: 'Myr',
				min: 0.1,
				max: 3000,
				step: 0.1,
				log: true,
				play: true,
				note: 'Most gem diamonds sat for one to three billion years. Type Ib survives only short or cool residence. Press play to watch the nitrogen aggregate.'
			},
			{
				k: 'ibSector',
				label: 'Late Ib growth sector',
				unit: '%',
				min: 0,
				max: 100,
				step: 1,
				note: 'Share of the crystal that grew late and kept its nitrogen single. Real Ia/Ib stones are zoned by sector, so this renders as a second tone.'
			}
		]
	},
	{
		group: 'Strain',
		items: [
			{
				k: 'strain',
				label: 'Plastic deformation',
				unit: '',
				min: 0,
				max: 100,
				step: 1,
				note: 'Shear in the mantle drags glide planes through the crystal. Also lowers clarity: graining.'
			},
			{
				k: 'pinkFrac',
				label: 'Product',
				unit: '',
				min: 0,
				max: 100,
				step: 1,
				lo: 'brown (vacancy clusters)',
				hi: 'pink (550 nm band)',
				note: 'Why some deformed stones go pink and others brown is still contested. Slide it and see.'
			}
		]
	},
	{
		group: 'Radiation',
		items: [
			{
				k: 'dose',
				label: 'Dose',
				unit: '',
				min: 0,
				max: 100,
				step: 1,
				note: 'From uranium or thorium in the host rock, over millions of years. Creates GR1 vacancies: green.'
			},
			{
				k: 'radSource',
				label: 'Source',
				type: 'choice',
				options: [
					['body', 'beta and gamma (whole stone)'],
					['alpha', 'alpha (skin only)']
				],
				note: 'Alpha particles stop within about 20 microns. They leave green spots on the surface and never reach the body colour.'
			},
			{
				k: 'heating',
				label: 'Heated after damage',
				unit: '',
				min: 0,
				max: 100,
				step: 1,
				note: 'Vacancies migrate. With nitrogen pairs present they become H3 (yellow-green); with single nitrogen, NV (orange). Without nitrogen the green simply fades.',
				inert: (p) => (p.dose === 0 ? 'Nothing to heat: there is no radiation damage yet.' : null)
			}
		]
	},
	{
		group: 'Inclusions',
		items: [
			{
				k: 'inclusions',
				label: 'Opaque inclusions',
				unit: '',
				min: 0,
				max: 100,
				step: 1,
				note: 'Graphite and sulphide clouds. Grey through to black.'
			},
			{
				k: 'clouds',
				label: 'Sub-microscopic clouds',
				unit: '',
				min: 0,
				max: 100,
				step: 1,
				note: 'These scatter light. Milky, opalescent white.'
			}
		]
	},
	{
		group: 'The Stone Itself',
		items: [
			{
				k: 'carats',
				label: 'Size',
				unit: 'ct',
				min: 0.2,
				max: 10,
				step: 0.1,
				note: 'Longer light path, more absorption. A faint tint at half a carat can grade a full step deeper at five.'
			},
			{
				k: 'hpht',
				label: 'HPHT annealed (lab treatment)',
				type: 'toggle',
				note: 'Removes brown. Type IIa goes colourless; Type Ia goes yellow-green as vacancies find nitrogen pairs.',
				inert: (p) => (!p.hpht && p.strain * (100 - p.pinkFrac) < 100 && p.dose === 0 ? 'Nothing to anneal: no brown and no radiation damage.' : null)
			}
		]
	}
];

export type PresetParams = Partial<SimParams>;
export const PRESETS: [string, PresetParams][] = [
	['Blank (Type IIa Colourless)', {}],
	['Cape Yellow, Type Ia', { nitrogen: 1500, temp: 1250, time: 2500 }],
	['Canary Yellow, Type Ib', { nitrogen: 40, temp: 950, time: 0.5 }],
	['Orange (Ib With 480 nm Band)', { nitrogen: 40, temp: 950, time: 0.5, b480: 70 }],
	['Brown, the Commonest Colour', { strain: 60, pinkFrac: 0 }],
	['Golconda Pink, Type IIa', { strain: 35, pinkFrac: 100 }],
	['Argyle Pink, Type Ia', { nitrogen: 500, temp: 1100, time: 1000, strain: 60, pinkFrac: 70 }],
	['Red', { strain: 100, pinkFrac: 100 }],
	['Hope-Style Blue, Type IIb', { boron: 0.4 }],
	['Boron Cancelled by Nitrogen', { nitrogen: 40, temp: 950, time: 0.5, boron: 0.4 }],
	['Natural Green (GR1 Body Colour)', { dose: 40 }],
	['Green Skin on Colourless Rough', { dose: 60, radSource: 'alpha' }],
	['Yellow-Green H3 (Irradiated Then Heated Ia)', { nitrogen: 600, temp: 1100, time: 300, dose: 40, heating: 80 }],
	['Orange NV (Irradiated Then Heated Ib)', { nitrogen: 40, temp: 950, time: 0.5, dose: 40, heating: 80 }],
	['Argyle Violet (Hydrogen)', { nitrogen: 300, temp: 1100, time: 500, hydrogen: 80 }],
	['Chameleon', { nitrogen: 500, temp: 1100, time: 500, hydrogen: 30, nickel: 30, b480: 60 }],
	['Olive (Brown With Radiation)', { strain: 40, pinkFrac: 0, dose: 30 }],
	['Purplish Pink (Pink With Hydrogen)', { nitrogen: 300, temp: 1100, time: 500, strain: 40, pinkFrac: 90, hydrogen: 35 }],
	['Black (Graphite Inclusions)', { inclusions: 90 }],
	['White, Opalescent', { nitrogen: 800, temp: 1200, time: 1000, hydrogen: 20, clouds: 80 }],
	['Brown, HPHT Treated (IIa)', { strain: 60, pinkFrac: 0, hpht: true }],
	['Brown, HPHT Treated (Ia)', { nitrogen: 600, temp: 1100, time: 300, strain: 60, pinkFrac: 0, hpht: true }],
	['Zoned Ia/Ib', { nitrogen: 800, temp: 1200, time: 1500, ibSector: 40 }]
];
export const CUSTOM_LABEL = 'Custom';

export interface CatalogueEntry {
	name: string;
	cause: string;
	type: string;
	examples: string;
	preset: number | null;
	params?: PresetParams;
}
export const CATALOGUE: CatalogueEntry[] = [
	{
		name: 'Colourless',
		cause:
			'No colour centres worth the name. Type IIa (no nitrogen) or Type Ia with nitrogen locked in A and B pairs, which absorb only in the infrared.',
		type: 'IIa, IaAB',
		examples: 'Cullinan, Koh-i-Noor (IIa); the bulk of the gem trade (Ia)',
		preset: 0
	},
	{
		name: 'Cape Yellow',
		cause:
			'N3 centres: three nitrogens round a vacancy, formed alongside B aggregates after long, hot residence. 415 nm line plus an absorption edge into the blue.',
		type: 'IaB',
		examples: 'Tiffany Yellow, Allnatt, most yellow diamonds',
		preset: 1
	},
	{
		name: 'Canary Yellow',
		cause: 'Single substitutional nitrogen (C centres). Needs short or cool residence to survive. Absorption edge at about 560 nm.',
		type: 'Ib',
		examples: 'Under 0.1% of naturals; nearly all HPHT-grown yellows',
		preset: 2
	},
	{
		name: 'Orange',
		cause: 'Single nitrogen plus the 480 nm band. Pure orange with no brown or yellow modifier is among the rarest colours.',
		type: 'Ib',
		examples: 'The Orange (14.82 ct), Pumpkin Diamond',
		preset: 3
	},
	{
		name: 'Brown',
		cause: 'Plastic deformation leaves vacancy clusters along glide planes. The absorption is featureless and rises into the blue: low chroma, so brown.',
		type: 'any, mostly Ia',
		examples: 'Golden Jubilee, Incomparable, Argyle champagne and cognac',
		preset: 4
	},
	{
		name: 'Pink',
		cause:
			'Deformation again, this time producing the 550 nm band. Which defect carries that band is still argued. Golconda pinks are IIa; Argyle pinks are Ia and usually brownish.',
		type: 'IIa or Ia',
		examples: 'Pink Star, Graff Pink, Daria-i-Noor, Argyle Pink Jubilee',
		preset: 6
	},
	{
		name: 'Red',
		cause: 'Pink at saturation. Same 550 nm band, more of it. Fewer than thirty confirmed stones.',
		type: 'IIa or Ia',
		examples: 'Moussaieff Red, Hancock Red',
		preset: 7
	},
	{
		name: 'Purple and Violet',
		cause: 'Hydrogen-related absorption across the yellow. Argyle violets; purples usually carry some pink from deformation as well.',
		type: 'Ia',
		examples: 'Royal Purple Heart, Argyle violets',
		preset: 14
	},
	{
		name: 'Blue',
		cause:
			'Boron acceptors absorbing from the red into the infrared. Any single nitrogen cancels boron atom for atom, so blue needs nitrogen-free material. The only diamonds that conduct electricity.',
		type: 'IIb',
		examples: 'Hope, Wittelsbach-Graff, Oppenheimer Blue, Cullinan Blue',
		preset: 8
	},
	{
		name: 'Grey',
		cause: 'Three routes: hydrogen (Argyle greys), low boron (greyish IIb) or fine inclusion clouds. The model reaches grey whenever chroma drops below about 9.',
		type: 'Ia, IIb',
		examples: 'Sultan of Morocco (greyish blue)',
		preset: 14
	},
	{
		name: 'Green, Body Colour',
		cause:
			'GR1 centres: neutral vacancies from beta and gamma radiation in the host rock, over geological time. 741 nm line, broad band across the red and orange.',
		type: 'any',
		examples: 'Dresden Green, Aurora Green, Ocean Dream (bluish green)',
		preset: 10
	},
	{
		name: 'Green, Skin Only',
		cause:
			'Alpha particles from adjacent uranium minerals stop within tens of microns. Green stains on the rough; body colour unaffected. Cutters keep patches as proof of natural origin.',
		type: 'any',
		examples: 'Most green-skinned rough',
		preset: 11
	},
	{
		name: 'Yellow-Green',
		cause: 'H3 centres: radiation vacancies that migrated to nitrogen pairs during later heating. Green fluorescence adds to the daylight colour.',
		type: 'IaA',
		examples: 'Chartreuse-coloured naturals; most treated greens',
		preset: 12
	},
	{
		name: 'Chameleon',
		cause:
			'Hydrogen, nickel and the 480 nm band together. Olive at rest; heat it or leave it in the dark and it turns yellow, then drifts back. The thermally unstable component is modelled empirically.',
		type: 'IaA',
		examples: 'Chopard Chameleon (31.31 ct)',
		preset: 15
	},
	{
		name: 'Olive and Khaki',
		cause: 'Brown and green together: deformation plus radiation, or brown Cape material with H3.',
		type: 'Ia',
		examples: 'Common in Australian and Brazilian production',
		preset: 16
	},
	{
		name: 'Black',
		cause: 'Opaque graphite or sulphide inclusions dense enough to block light, or radiation so heavy the green reads black.',
		type: 'any',
		examples: 'Black Orlov, Korloff Noir, Spirit of de Grisogono',
		preset: 18
	},
	{
		name: 'White',
		cause: 'Hydrogen-rich Type IaB with sub-microscopic inclusions that scatter light instead of absorbing it. Opalescent, milky.',
		type: 'IaB',
		examples: 'Panna, India production',
		preset: 19
	},
	{
		name: 'Green-Yellow, Nickel',
		cause: 'Nickel-related centres at 658 nm and in the violet. The signature of HPHT synthesis with nickel catalyst; a handful of naturals show it.',
		type: 'Ib or Ia',
		examples: 'Nickel-catalysed HPHT synthetics',
		preset: null,
		params: { nickel: 80 }
	}
];

export interface DossierEntry {
	name: string;
	carats: number;
	type: string;
	lab: string;
	params: PresetParams;
	note?: string;
}
// Famous stones. Carat weights and lab colour descriptions are published figures; the recipe is the simulator's, and the two grades sit side by side on purpose.
export const DOSSIER: DossierEntry[] = [
	{
		name: 'Hope',
		carats: 45.52,
		type: 'IIb',
		lab: 'Fancy Deep greyish blue (GIA)',
		params: { boron: 1.1, hydrogen: 8 },
		note: 'Boron content is measured but I do not trust the figure I half-remember, so the slider is set to reproduce the grade.'
	},
	{ name: 'Cullinan I', carats: 530.2, type: 'IIa', lab: 'D colour', params: {}, note: 'The largest clear cut diamond. Nitrogen-free, unstrained.' },
	{ name: 'Koh-i-Noor', carats: 105.6, type: 'IIa', lab: 'colourless', params: {}, note: 'Recut in 1852 from a much larger Mughal stone.' },
	{
		name: 'Dresden Green',
		carats: 41,
		type: 'IIa',
		lab: 'natural green',
		params: { dose: 38 },
		note: 'The reference natural green; its body colour comes from GR1 throughout the stone, which rules out alpha skin.'
	},
	{
		name: 'Pink Star',
		carats: 59.6,
		type: 'IIa',
		lab: 'Fancy Vivid pink (GIA)',
		params: { strain: 75, pinkFrac: 100, carats: 10 },
		note: 'Size slider capped at 10 ct; the real stone is six times that, which is part of why it is so saturated.'
	},
	{ name: 'Graff Pink', carats: 24.78, type: 'IIa', lab: 'Fancy Intense pink (GIA)', params: { strain: 55, pinkFrac: 100, carats: 10 } },
	{
		name: 'Moussaieff Red',
		carats: 5.11,
		type: 'IIa',
		lab: 'Fancy purplish red (GIA)',
		params: { strain: 100, pinkFrac: 100, hydrogen: 12, carats: 5.1 }
	},
	{
		name: 'Hancock Red',
		carats: 0.95,
		type: 'IIa',
		lab: 'Fancy purplish red (GIA)',
		params: { strain: 100, pinkFrac: 100, hydrogen: 12, carats: 0.95 },
		note: 'Under a carat, which shows how far the 550 nm band can go per unit path.'
	},
	{ name: 'Tiffany Yellow', carats: 128.54, type: 'Ia', lab: 'Fancy yellow', params: { nitrogen: 1400, temp: 1250, time: 2500, carats: 10 } },
	{
		name: 'Golden Jubilee',
		carats: 545.67,
		type: 'Ia',
		lab: 'Fancy yellow-brown',
		params: { nitrogen: 1200, temp: 1250, time: 2500, strain: 55, pinkFrac: 0, carats: 10 }
	},
	{ name: 'Wittelsbach-Graff', carats: 31.06, type: 'IIb', lab: 'Fancy Deep blue (GIA)', params: { boron: 1.4, carats: 10 } },
	{ name: 'Oppenheimer Blue', carats: 14.62, type: 'IIb', lab: 'Fancy Vivid blue (GIA)', params: { boron: 1.6, carats: 10 } },
	{
		name: 'Chopard Chameleon',
		carats: 31.31,
		type: 'IaA',
		lab: 'chameleon',
		params: { nitrogen: 500, temp: 1100, time: 500, hydrogen: 30, nickel: 30, b480: 60, carats: 10 }
	},
	{ name: 'Black Orlov', carats: 67.5, type: 'Ia', lab: 'black', params: { inclusions: 95, carats: 10 } },
	{
		name: 'The Orange',
		carats: 14.82,
		type: 'Ib',
		lab: 'Fancy Vivid orange (GIA)',
		params: { nitrogen: 40, temp: 950, time: 0.5, b480: 75, carats: 10 }
	},
	{ name: 'Aurora Green', carats: 5.03, type: 'IIa', lab: 'Fancy Vivid green (GIA)', params: { dose: 85, carats: 5 } },
	{
		name: 'Ocean Dream',
		carats: 5.51,
		type: 'IIa',
		lab: 'Fancy Deep blue-green (GIA)',
		params: { dose: 70, boron: 0.5, carats: 5.5 },
		note: 'Natural radiation on a stone that also carries boron; one of the few blue-greens that is not treated.'
	},
	{
		name: 'Royal Purple Heart',
		carats: 7.34,
		type: 'Ia',
		lab: 'Fancy Vivid purple (GIA)',
		params: { nitrogen: 300, temp: 1100, time: 500, strain: 60, pinkFrac: 95, hydrogen: 55, carats: 7.3 }
	}
];

export interface Element {
	k: BandKey;
	name: string;
	amp: number;
}
// Elemental causes for the combination table.
export const ELEMENTS: Element[] = [
	{ k: 'n3', name: 'N3 (Cape yellow)', amp: 0.8 },
	{ k: 'c', name: 'single nitrogen (Ib yellow)', amp: 0.9 },
	{ k: 'boron', name: 'boron (blue)', amp: 0.9 },
	{ k: 'hyd', name: 'hydrogen (violet)', amp: 0.9 },
	{ k: 'ni', name: 'nickel (green-yellow)', amp: 0.7 },
	{ k: 'brown', name: 'vacancy clusters (brown)', amp: 1.8 },
	{ k: 'pink', name: '550 nm band (pink)', amp: 1.1 },
	{ k: 'gr1', name: 'GR1 (green)', amp: 0.9 },
	{ k: 'h3', name: 'H3 (yellow-green)', amp: 0.9 }
];
export const DOCUMENTED = new Set(
	[
		'n3',
		'c',
		'boron',
		'hyd',
		'ni',
		'brown',
		'pink',
		'gr1',
		'h3',
		'brown+n3',
		'c+n3',
		'gr1+n3',
		'h3+n3',
		'hyd+n3',
		'n3+ni',
		'brown+pink',
		'brown+gr1',
		'brown+h3',
		'brown+hyd',
		'hyd+pink',
		'gr1+h3',
		'brown+c',
		'boron+brown',
		'n3+pink',
		'c+ni',
		'brown+n3+pink',
		'brown+h3+n3',
		'brown+hyd+pink',
		'gr1+h3+n3',
		'brown+gr1+n3',
		'hyd+n3+pink',
		'brown+hyd+n3'
	].map((s) => s.split('+').sort().join('+'))
);
export const DOCUMENTED_EXTRA = new Set([
	'b480',
	'b480+c',
	'b480+cham+hyd+ni',
	'b480+cham+hyd+n3+ni',
	'b480+cham+n3+ni',
	'b480+cham+ni',
	'graphite',
	'graphite+n3',
	'graphite+brown',
	'c+nv',
	'brown+c+nv',
	'gr1+graphite'
]);
export const TREATED = new Set(['c+nv', 'brown+c+nv', 'gr1+nv', 'c+gr1+nv', 'h3+n3', 'brown+h3+n3', 'h3']);
export const STATUS_LABEL: Record<string, string> = {
	documented: 'documented',
	possible: 'possible, no example known',
	cancels: 'cancels out',
	substitutes: 'substitutes',
	zoned: 'zoned, not blended'
};
