export interface FaceProportions {
	rx?: number;
	eyeY?: number;
	eyeGap?: number;
	mouthY?: number;
	curve?: number;
	noseLen?: number;
}

export interface FaceItem {
	f: FaceProportions;
	off: boolean;
	cue: string;
	words: string[];
}

export interface ClaimItem {
	text: string;
	holds: boolean;
	note: string;
	words: string[];
}

export interface Stage11 {
	id: 'fold' | 'faces' | 'ideas';
	label: string;
	name: string;
}

export const FACES: FaceItem[] = [
	{
		f: { rx: 34, eyeY: 60, eyeGap: 12, mouthY: 92, curve: 8 },
		off: false,
		cue: "Nothing was moved. This one is drawn to the usual proportions: eyes halfway down, about an eye's width apart, mouth a third of the way from nose to chin.",
		words: []
	},
	{
		f: { rx: 36, eyeY: 42, eyeGap: 12, mouthY: 92, curve: 6 },
		off: true,
		cue: 'The eyes. They sit about a third of the way down the head; on a real one they sit halfway. Nothing else moved.',
		words: ['eye', 'eyes', 'high', 'forehead', 'up', 'top', 'half']
	},
	{
		f: { rx: 34, eyeY: 60, eyeGap: 24, mouthY: 92, curve: 8, noseLen: 14 },
		off: true,
		cue: 'The spacing. The eyes are two eye-widths apart and nearly at the edges of the face; on a real one there is about one eye’s width between them. Nothing else moved.',
		words: ['apart', 'wide', 'far', 'spacing', 'space', 'edge', 'edges', 'gap', 'spread', 'side', 'sides']
	},
	{
		f: { rx: 40, eyeY: 61, eyeGap: 13, mouthY: 91, curve: 3, noseLen: 15 },
		off: false,
		cue: 'Nothing was moved. A rounder head and a flatter mouth, but the features are where they belong.',
		words: []
	},
	{
		f: { rx: 32, eyeY: 59, eyeGap: 11, mouthY: 102, curve: 7, noseLen: 14 },
		off: true,
		cue: 'The mouth. It is sitting on the chin, with a long gap under the nose; on a real face it is about a third of the way from nose to chin. Nothing else moved.',
		words: ['mouth', 'chin', 'low', 'down', 'nose', 'gap', 'bottom', 'smile']
	}
];

export const CLAIMS: ClaimItem[] = [
	{
		text: 'The oldest buildings in the city are all beautifully made, so builders in those days were better than builders today.',
		holds: false,
		note: 'Survivorship. The city has been pulling down its ugly and badly made buildings for centuries; the ones still standing are the ones worth keeping. The sample was selected by the very quality the argument claims to have discovered.',
		words: [
			'surviv',
			'demolish',
			'pulled down',
			'knocked down',
			'left',
			'remain',
			'select',
			'sample',
			'still standing',
			'kept',
			'worst',
			'bad ones',
			'gone'
		]
	},
	{
		text: 'Every swan anyone in this village has ever seen is white, so the next swan we see will probably be white.',
		holds: true,
		note: 'It holds. This is ordinary induction, and the word doing the work is “probably”. It would not hold with “certainly”: one black swan breaks certainty and barely dents probability.',
		words: ['probab', 'induct', 'certain', 'likely', 'black swan', 'evidence', 'past', 'pattern']
	},
	{
		text: 'Pub closures have sped up since the smoking ban came in, so the ban is what is closing the pubs.',
		holds: false,
		note: 'One cause chosen from many. Supermarket alcohol, rents, a recession and the price of a pint all changed over the same years. A trend that followed the ban is not a trend the ban caused, and the argument never tries to rule the others out.',
		words: [
			'cause',
			'correlat',
			'other',
			'reason',
			'reasons',
			'factor',
			'factors',
			'supermarket',
			'rent',
			'recession',
			'price',
			'coincid',
			'same time',
			'also',
			'post hoc',
			'after'
		]
	},
	{
		text: 'A test for a disease that affects one person in ten thousand is 99% accurate. You test positive. It is still more likely than not that you do not have the disease.',
		holds: true,
		note: 'It holds, and most people’s first instinct says otherwise. In a million people, a hundred have the disease and the test catches ninety-nine of them. But of the 999,900 who do not, one per cent, about ten thousand, test positive anyway. A positive result is a hundred times more likely to be a false alarm than a true one.',
		words: [
			'rare',
			'false positive',
			'false positives',
			'base rate',
			'prevalence',
			'ten thousand',
			'10,000',
			'1%',
			'one percent',
			'most positives',
			'healthy people',
			'many more'
		]
	},
	{
		text: 'Nobody has ever proved that the house is not haunted, so it is reasonable to believe it is.',
		holds: false,
		note: 'The absence of a disproof is treated as support. By the same move, any claim nobody has bothered to disprove becomes reasonable, which is to say the argument proves everything and therefore nothing.',
		words: ['burden', 'prove', 'proof', 'disprove', 'absence', 'evidence', 'anything', 'everything', 'any claim', 'negative']
	}
];

export const PROCESS_WORDS: string[] = [
	'four',
	'layer',
	'layers',
	'centre',
	'center',
	'middle',
	'corner',
	'fold',
	'folded',
	'thick',
	'quarter',
	'meet',
	'same spot',
	'through'
];

export const STAGES11: Stage11[] = [
	{ id: 'fold', label: '1. Abstract', name: 'A folded sheet' },
	{ id: 'faces', label: '2. Concrete', name: 'Five faces' },
	{ id: 'ideas', label: '3. Ideas', name: 'Five claims' }
];

export function words(t: string): number {
	return t.trim().split(/\s+/).filter(Boolean).length;
}

export function mentions(t: string, list: string[]): number {
	return list.filter((w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(t)).length;
}

export function secs(ms: number): string {
	return (ms / 1000).toFixed(1);
}
