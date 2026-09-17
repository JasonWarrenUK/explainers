export type Rng = () => number;

export function rngA(seed: number): Rng {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function pickA<T>(r: Rng, xs: T[]): T {
	return xs[Math.floor(r() * xs.length)];
}

const FORMS = [
	'a shallow bowl',
	'a long-handled ladle',
	'a hafted blade',
	'a pierced disc',
	'a lidded jar',
	'a curved pin',
	'a socketed hook',
	'a flat weight'
];
const CONTEXTS = [
	'beneath a house floor',
	'in a pit outside the wall',
	'in a burial with two others',
	'in a burned storeroom',
	'in a river channel',
	'under a collapsed threshold'
];
const SHOPS: Record<'A' | 'B', { materials: string[]; spiral: boolean }> = {
	A: { materials: ['bronze', 'worked bone'], spiral: true },
	B: { materials: ['fired clay', 'polished stone'], spiral: false }
};

export interface Find {
	id: string;
	shop: 'A' | 'B';
	form: string;
	material: string;
	spiral: boolean;
	context: string;
	worn: boolean;
}

export function makeFind(r: Rng, id: string, used: Set<string>): Find {
	const shop: 'A' | 'B' = r() < 0.5 ? 'A' : 'B';
	const w = SHOPS[shop];
	let form = pickA(r, FORMS);
	let g = 0;
	while (used.has(form) && g++ < 30) form = pickA(r, FORMS);
	used.add(form);
	return {
		id,
		shop,
		form,
		material: pickA(r, w.materials),
		spiral: w.spiral,
		context: pickA(r, CONTEXTS),
		worn: r() < 0.5
	};
}

export const FIND_SPACE = FORMS.length * CONTEXTS.length * 2 * 4;

export type Lens = 'rank' | 'ritual' | 'production' | 'neutral';

export function describeFind(f: Find, lens: Lens): string {
	const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
	const spiral = f.spiral ? 'carrying the spiral mark' : 'with no spiral mark';
	const wear = f.worn ? 'heavily worn' : 'showing almost no wear';
	if (lens === 'rank')
		return `${cap(f.form)} in ${f.material}, ${spiral}. ${cap(wear)}${f.worn ? ', consistent with long use by successive holders of a position' : ', as one would expect of an object kept for display rather than work'}. Recovered ${f.context}.`;
	if (lens === 'ritual')
		return `${cap(f.form)} in ${f.material}, ${spiral}. The mark is applied with care and appears reserved rather than casual. ${cap(wear)}${f.worn ? ', suggesting repeated handling in ceremony' : ', as though kept apart from daily use'}. Deposited ${f.context}.`;
	if (lens === 'production')
		return `${cap(f.form)} in ${f.material}, ${spiral}. The cut of the mark matches the others that carry it, in depth and spacing. ${cap(wear)}${f.worn ? ', so the piece saw use after leaving the workshop' : ', so the piece was buried close to new'}. Recovered ${f.context}.`;
	return `${cap(f.form)} in ${f.material}, ${spiral}. ${cap(wear)}. Recovered ${f.context}.`;
}

export const USED = new Set<string>();
export const SET_A: Find[] = (() => {
	const r = rngA(90210);
	return [1, 2, 3, 4].map((i) => makeFind(r, `1${i}`, USED));
})();
export const SET_B: Find[] = (() => {
	const r = rngA(4417);
	return [5, 6, 7].map((i) => makeFind(r, `1${i}`, USED));
})();

const WILD_ON = ['k', 't', 'p', 'm', 'n', 's', 'l', 'r', 'v', 'th', 'kh', 'z', 'b', 'd', 'g', 'f', 'h', 'j', 'w', 'y'];
const WILD_V = ['a', 'e', 'i', 'o', 'u'];
const WILD_C = ['', '', 'n', 's', 'r', 'l', 'k', 't', 'm'];
const TAME_ON = ['k', 't', 'm', 'n', 's', 'l', 'r'];
const FRONT = ['e', 'i'];
const BACK = ['a', 'o', 'u'];

export function wildName(r: Rng): string {
	let out = '';
	const n = 2 + Math.floor(r() * 3);
	for (let i = 0; i < n; i++) out += pickA(r, WILD_ON) + pickA(r, WILD_V) + pickA(r, WILD_C);
	return out.charAt(0).toUpperCase() + out.slice(1);
}

export function tameName(r: Rng): string {
	const v = r() < 0.5 ? FRONT : BACK;
	const n = 2 + Math.floor(r() * 2);
	let out = '';
	let prev = '';
	for (let i = 0; i < n; i++) {
		let c = pickA(r, TAME_ON);
		while (c === prev) c = pickA(r, TAME_ON);
		prev = c;
		out += c + pickA(r, v);
	}
	return out.charAt(0).toUpperCase() + out.slice(1);
}

const CONS = ['k', 't', 'p', 'm', 'n', 's', 'l', 'r', 'v', 'z', 'd', 'g', 'th', 'sh'];
const HARSH = ['k', 't', 'p', 'g', 'd'];

export interface Prohibition {
	id: 'harmony' | 'norepeat' | 'openend' | 'oneharsh';
	label: string;
}

export const PROHIBITIONS: Prohibition[] = [
	{ id: 'harmony', label: 'The vowels in a word must all be at the front of the mouth, or all at the back' },
	{ id: 'norepeat', label: 'No consonant may be followed by itself' },
	{ id: 'openend', label: 'Every word must end in a vowel' },
	{ id: 'oneharsh', label: 'At most one hard stop — k, t, p, g or d — per word' }
];

export type OnRules = Record<Prohibition['id'], boolean>;

export function buildName(r: Rng, on: OnRules): string {
	const v = on.harmony ? (r() < 0.5 ? FRONT : BACK) : WILD_V;
	const n = 2 + Math.floor(r() * 2);
	let out = '';
	let prev = '';
	let harsh = 0;
	for (let i = 0; i < n; i++) {
		let c = pickA(r, CONS);
		let g = 0;
		while (g++ < 40) {
			if (!(on.norepeat && c === prev) && !(on.oneharsh && HARSH.includes(c) && harsh >= 1)) break;
			c = pickA(r, CONS);
		}
		if (HARSH.includes(c)) harsh++;
		prev = c;
		out += c + pickA(r, v);
	}
	if (!on.openend && r() < 0.45) out += pickA(r, ['n', 's', 'r', 'l']);
	return out.charAt(0).toUpperCase() + out.slice(1);
}

export function spaceSize(on: OnRules): number {
	const c = on.oneharsh ? CONS.length - 2.5 : CONS.length;
	const v = on.harmony ? 2.5 : 5;
	const syll = c * v;
	const tail = on.openend ? 1 : 1 + 4 * 0.45;
	return Math.round(
		(Math.pow(syll, 2) * (on.norepeat ? 0.93 : 1) + Math.pow(syll, 3) * (on.norepeat ? 0.86 : 1)) * tail
	);
}

export interface FollowUpOption {
	key: string;
	label: string;
}

export const FOLLOW_UP: Record<'rank' | 'ritual' | 'production', FollowUpOption[]> = {
	rank: [
		{ key: 'a', label: 'It belonged to somebody of lower standing.' },
		{ key: 'b', label: 'It was a private object rather than an official one.' },
		{ key: 'c', label: 'It belonged to an outsider.' }
	],
	ritual: [
		{ key: 'a', label: 'It was for everyday use, outside ceremony.' },
		{ key: 'b', label: 'It was deliberately stripped of its marking.' },
		{ key: 'c', label: 'It belonged to a lesser rite.' }
	],
	production: [
		{ key: 'a', label: 'It came out of a different workshop.' },
		{ key: 'b', label: 'It was left unfinished.' },
		{ key: 'c', label: 'It was a repair, made outside the usual process.' }
	]
};

/* ---- the history generator: what happened, what was written, what survived ---- */

export const ALL_RULES: OnRules = { harmony: true, norepeat: true, openend: true, oneharsh: true };
const EPITHETS = ['the Elder', 'the Younger', 'the Quiet', 'the Lame', 'the Bold', 'the Third', 'the Grey', 'the Late'];

interface Polity {
	id: number;
	name: string;
	ruler: string;
	strength: number;
	alive: boolean;
}

export type EventKind = 'succession' | 'war' | 'famine' | 'treaty' | 'revolt' | 'tribute' | 'collapse' | 'founding';

export interface SimEvent {
	year: number;
	text: string;
	kind: EventKind;
}

export type RecordFate = 'unwritten' | 'lost' | 'conflated' | 'misdated' | 'intact' | 'absorbed';

export interface SimRecord {
	year: number;
	fate: RecordFate;
	of: number;
	text?: string;
}

export interface SimResult {
	events: SimEvent[];
	records: SimRecord[];
}

export function simulate(seed: number): SimResult {
	const r = rngA(seed);
	const polities: Polity[] = Array.from({ length: 4 }, (_, i) => ({
		id: i,
		name: buildName(r, ALL_RULES),
		ruler: buildName(r, ALL_RULES) + ' ' + pickA(r, EPITHETS),
		strength: 3 + Math.floor(r() * 3),
		alive: true
	}));

	const events: SimEvent[] = [];
	const say = (year: number, text: string, kind: EventKind) => events.push({ year, text, kind });

	for (let year = 4; year <= 96; year += 2 + Math.floor(r() * 4)) {
		const living = polities.filter((x) => x.alive);
		if (living.length < 2) break;
		const roll = r();
		const a = pickA(r, living);

		if (roll < 0.24) {
			const heir = buildName(r, ALL_RULES) + ' ' + pickA(r, EPITHETS);
			say(year, `${a.ruler} of ${a.name} dies. ${heir} succeeds.`, 'succession');
			a.ruler = heir;
		} else if (roll < 0.52) {
			const rest = living.filter((x) => x.id !== a.id);
			const b = pickA(r, rest);
			if (!b) continue;
			const win = a.strength + r() * 2 >= b.strength + r() * 2 ? a : b;
			const lose = win === a ? b : a;
			win.strength -= 1;
			lose.strength -= 2;
			say(year, `${a.name} and ${b.name} go to war. ${win.name} prevails.`, 'war');
		} else if (roll < 0.66) {
			a.strength -= 2;
			say(year, `Failed harvests across ${a.name}. Its levies cannot be raised.`, 'famine');
		} else if (roll < 0.78) {
			const rest = living.filter((x) => x.id !== a.id);
			const b = pickA(r, rest);
			if (!b) continue;
			say(year, `${a.name} and ${b.name} swear terms against their neighbours.`, 'treaty');
		} else if (roll < 0.9) {
			a.strength -= 1;
			say(year, `The outer districts of ${a.name} refuse ${a.ruler}.`, 'revolt');
		} else {
			a.strength += 1;
			say(year, `${a.ruler} of ${a.name} takes tribute from the coast.`, 'tribute');
		}

		for (const q of polities) {
			if (q.alive && q.strength <= 0) {
				q.alive = false;
				say(year + 1, `${q.name} ceases to hold together. Its record ends here.`, 'collapse');
				const dead = polities.filter((x) => !x.alive).length;
				if (dead <= 2 && r() < 0.7) {
					const born: Polity = {
						id: polities.length,
						name: buildName(r, ALL_RULES),
						ruler: buildName(r, ALL_RULES) + ' ' + pickA(r, EPITHETS),
						strength: 3,
						alive: true
					};
					polities.push(born);
					say(year + 2, `${born.name} is founded in the country ${q.name} held.`, 'founding');
				}
			}
		}
	}

	const records: SimRecord[] = [];
	for (let i = 0; i < events.length; i++) {
		const e = events[i];
		const roll = r();
		if (e.kind === 'collapse' || roll < 0.16) {
			records.push({ year: e.year, fate: 'unwritten', of: i });
			continue;
		}
		if (roll < 0.3) {
			records.push({ year: e.year, fate: 'lost', of: i, text: e.text });
			continue;
		}
		if (roll < 0.42 && i > 0) {
			const prev = events[i - 1];
			const prevRec = records.find((x) => x.of === i - 1);
			if (prevRec && prevRec.fate !== 'unwritten') prevRec.fate = 'absorbed';
			records.push({
				year: e.year,
				fate: 'conflated',
				of: i,
				text: `${prev.text.replace(/\.$/, '')}, and in the same season, ${e.text}`
			});
			continue;
		}
		if (roll < 0.56) {
			records.push({ year: e.year + 2 + Math.floor(r() * 9), fate: 'misdated', of: i, text: e.text });
			continue;
		}
		records.push({ year: e.year, fate: 'intact', of: i, text: e.text });
	}
	return { events, records };
}

export const FATE_LABEL: Record<RecordFate, string> = {
	intact: 'written down correctly',
	misdated: 'written under the wrong year',
	conflated: 'two events written up as one',
	absorbed: 'folded into the entry below',
	lost: 'written down, then lost',
	unwritten: 'never written down at all'
};
