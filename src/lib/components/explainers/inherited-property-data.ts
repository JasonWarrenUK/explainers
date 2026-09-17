export interface WordRow {
	lang: string;
	parts: [string, string, string];
}

export const ROMANCE: { caption: string; parent: { lang: string; form: string }; rows: WordRow[] } = {
	caption: 'The word for ‘hand’, in five languages',
	parent: { lang: 'Latin', form: 'manus' },
	rows: [
		{ lang: 'Portuguese', parts: ['m', 'ã', 'o'] },
		{ lang: 'Spanish', parts: ['m', 'an', 'o'] },
		{ lang: 'French', parts: ['m', 'ain', ''] },
		{ lang: 'Italian', parts: ['m', 'an', 'o'] },
		{ lang: 'Romanian', parts: ['m', 'ân', 'ă'] }
	]
};

export const HORSE: [string, string][] = [
	['French', 'cheval'],
	['Spanish', 'caballo'],
	['Italian', 'cavallo'],
	['Portuguese', 'cavalo'],
	['Romanian', 'cal']
];

export const SPEAK: [string, string][] = [
	['French', 'parler'],
	['Italian', 'parlare'],
	['Catalan', 'parlar'],
	['Occitan', 'parlar']
];
