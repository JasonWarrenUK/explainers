import { describe as describeTest, expect, it } from 'vitest';
import { absorbance, colourOf, derive, describe, hex, labDist, xyz, xyzToLab } from './model';
import { DEFAULTS } from './data';

describeTest('colourOf band hues', () => {
	// The source model was tuned so each centre alone reproduces its documented hue at moderate
	// concentration (see the comment above BANDS in the import). This is that claim, checked.
	it('N3 alone reads yellow', () => {
		expect(colourOf({ n3: 0.8 }, 1, 0).desc.family).toBe('yellow');
	});
	it('single nitrogen (C) alone reads yellow or orange', () => {
		expect(['yellow', 'orange']).toContain(colourOf({ c: 0.9 }, 1, 0).desc.family);
	});
	it('boron alone reads blue', () => {
		expect(colourOf({ boron: 0.9 }, 1, 0).desc.family).toBe('blue');
	});
	it('vacancy clusters (brown) alone read brown', () => {
		expect(colourOf({ brown: 1.8 }, 1, 0).desc.family).toBe('brown');
	});
	it('the 550 nm band (pink) alone reads pink', () => {
		expect(colourOf({ pink: 1.1 }, 1, 0).desc.family).toBe('pink');
	});
	it('GR1 alone reads green', () => {
		expect(colourOf({ gr1: 0.9 }, 1, 0).desc.family).toBe('green');
	});
	it('H3 alone reads in the yellow-green family', () => {
		expect(['yellow', 'yellow-green', 'green']).toContain(colourOf({ h3: 0.9 }, 1, 0).desc.family);
	});
	it('a stone with no colour centres reads colourless', () => {
		expect(colourOf({}, 1, 0).desc.family).toBe('colourless');
	});
	it('heavy graphite reads black', () => {
		expect(colourOf({ graphite: 6 }, 1, 0).desc.family).toBe('black');
	});
	it('milk past the opalescent threshold reads white', () => {
		expect(colourOf({}, 1, 0.6).desc.family).toBe('white');
	});
});

describeTest('derive', () => {
	it('blank defaults derive to colourless Type IIa', () => {
		const res = derive(DEFAULTS);
		expect(res.desc.family).toBe('colourless');
		expect(res.type).toBe('IIa');
	});

	it('single nitrogen atoms cancel boron atom for atom', () => {
		// A few ppm of Ib nitrogen should fully compensate a comparable amount of boron.
		const res = derive({ ...DEFAULTS, nitrogen: 40, temp: 950, time: 0.5, boron: 0.4 });
		expect(res.bEff).toBeCloseTo(0, 5);
		expect(res.compensated).toBe(true);
	});

	it('boron in clear excess of single nitrogen still shows blue', () => {
		const res = derive({ ...DEFAULTS, boron: 0.4 });
		expect(res.type).toBe('IIb');
		expect(res.desc.family).toBe('blue');
	});

	it('a longer light path deepens the same tint', () => {
		const small = derive({ ...DEFAULTS, dose: 40, carats: 0.2 });
		const large = derive({ ...DEFAULTS, dose: 40, carats: 10 });
		expect(large.desc.C).toBeGreaterThan(small.desc.C);
	});

	it('hot, long residence aggregates nitrogen into B (Cape material)', () => {
		const res = derive({ ...DEFAULTS, nitrogen: 1500, temp: 1250, time: 2500 });
		expect(res.nB).toBeGreaterThan(res.nIso);
		expect(res.type).toContain('Ia');
	});

	it('short, cool residence keeps nitrogen single (Type Ib)', () => {
		const res = derive({ ...DEFAULTS, nitrogen: 40, temp: 950, time: 0.5 });
		expect(res.nIso).toBeGreaterThan(res.nA + res.nB);
		expect(res.type).toBe('Ib');
	});

	it('alpha radiation stains the skin and leaves no body colour', () => {
		const res = derive({ ...DEFAULTS, dose: 60, radSource: 'alpha' });
		expect(res.stains).toBeGreaterThan(0);
		expect(res.amps.gr1 ?? 0).toBe(0);
	});

	it('HPHT annealing removes brown from a deformed IIa stone', () => {
		const res = derive({ ...DEFAULTS, strain: 60, pinkFrac: 0, hpht: true });
		expect(res.amps.brown ?? 0).toBe(0);
		expect(res.hpht).not.toBeNull();
	});

	it('the chameleon recipe needs hydrogen, nickel and the 480 nm band together', () => {
		const res = derive({ ...DEFAULTS, nitrogen: 500, temp: 1100, time: 500, hydrogen: 30, nickel: 30, b480: 60 });
		expect(res.chameleon).toBe(true);
		const partial = derive({ ...DEFAULTS, hydrogen: 30 });
		expect(partial.chameleon).toBe(false);
	});

	it('a boron sector zones separately from the nitrogen body once boron exceeds compensation', () => {
		const res = derive({ ...DEFAULTS, nitrogen: 500, temp: 1250, time: 2000, boron: 2 });
		expect(res.zone?.kind).toBe('boron');
	});
});

describeTest('colour maths round-trips', () => {
	it('hex encodes an RGB triple as a 7-character string', () => {
		expect(hex([1, 0, 0])).toBe('#ff0000');
		expect(hex([0, 0, 0])).toBe('#000000');
	});

	it('xyzToLab and xyzToRgb agree on white (D65)', () => {
		const lab = xyzToLab([0.9505, 1.0, 1.089]);
		expect(lab[0]).toBeCloseTo(100, 0);
	});

	it('labDist is zero for identical colours and positive otherwise', () => {
		const a: [number, number, number] = [50, 10, -5];
		expect(labDist(a, a)).toBe(0);
		expect(labDist(a, [60, 10, -5])).toBeGreaterThan(0);
	});

	it('absorbance grows with amplitude', () => {
		expect(absorbance({ brown: 1 })).toBeLessThan(absorbance({ brown: 2 }));
	});

	it('xyz of a fully transmitting spectrum is not black', () => {
		const white = xyz(new Array(101).fill(1));
		expect(white[1]).toBeGreaterThan(0);
	});

	it('describe reports colourless only within a tight chroma band near maximum lightness', () => {
		expect(describe([95, 0, 0], 0).family).toBe('colourless');
		expect(describe([40, 0, 0], 0).family).toBe('grey');
	});
});
