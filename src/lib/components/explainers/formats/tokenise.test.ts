import { describe, expect, it } from 'vitest';
import { createTokeniser } from './tokenise';
import { RULES as countryRules, FILES } from '../the-country-that-means-no-data';
import { RULES as norwayRules, FORMATS } from '../norway-is-not-a-boolean-data';

const country = createTokeniser(countryRules);
const norway = createTokeniser(norwayRules);

describe('createTokeniser', () => {
	it('separates a JSON key from its string value', () => {
		expect(country('  "found_in": "NO",', 'json')).toEqual([
			{ text: '  ', kind: null },
			{ text: '"found_in"', kind: 'key' },
			{ text: ':', kind: 'pun' },
			{ text: ' ', kind: null },
			{ text: '"NO"', kind: 'str' },
			{ text: ',', kind: 'pun' }
		]);
	});

	it('merges unmatched text between tokens into one plain run', () => {
		expect(norway('region: NO', 'yaml')).toEqual([
			{ text: 'region', kind: 'key' },
			{ text: ': NO', kind: null }
		]);
		expect(norway('region: no', 'yaml').at(-1)).toEqual({ text: 'no', kind: 'lit' });
	});

	it('marks XML tags, attributes and attribute values', () => {
		const kinds = country('<object accession="007">', 'xml').map((t) => t.kind);
		expect(kinds).toEqual(['tag', null, 'att', 'pun', 'str', 'tag']);
	});

	it('returns the line untouched for an unknown family', () => {
		expect(country('anything at all', 'nonsense')).toEqual([{ text: 'anything at all', kind: null }]);
	});

	it('never loses or invents characters on any specimen line', () => {
		for (const file of Object.values(FILES)) {
			for (const [text] of file.lines) {
				expect(country(text, file.family).map((t) => t.text).join('')).toBe(text);
			}
		}
		for (const format of FORMATS) {
			for (const [text] of format.lines) {
				expect(norway(text, format.family).map((t) => t.text).join('')).toBe(text);
			}
		}
	});
});
