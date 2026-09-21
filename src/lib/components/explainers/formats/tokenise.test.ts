import { describe, expect, it } from 'vitest';
import { createTokeniser } from './tokenise';
import { allSpecimens } from '../norway-is-not-a-boolean/gates';
import { RULES } from '../norway-is-not-a-boolean/rules';

const tokenise = createTokeniser(RULES);

describe('createTokeniser', () => {
	it('separates a JSON key from its string value', () => {
		expect(tokenise('  "found_in": "NO",', 'json')).toEqual([
			{ text: '  ', kind: null },
			{ text: '"found_in"', kind: 'key' },
			{ text: ':', kind: 'pun' },
			{ text: ' ', kind: null },
			{ text: '"NO"', kind: 'str' },
			{ text: ',', kind: 'pun' }
		]);
	});

	it('merges unmatched text between tokens into one plain run', () => {
		expect(tokenise('region: NO', 'yaml')).toEqual([
			{ text: 'region', kind: 'key' },
			{ text: ': NO', kind: null }
		]);
		expect(tokenise('region: no', 'yaml').at(-1)).toEqual({ text: 'no', kind: 'lit' });
	});

	it('marks XML tags, attributes and attribute values', () => {
		const kinds = tokenise('<object accession="007">', 'xml').map((t) => t.kind);
		expect(kinds).toEqual(['tag', null, 'att', 'pun', 'str', 'tag']);
	});

	it('returns the line untouched for an unknown family', () => {
		expect(tokenise('anything at all', 'plain')).toEqual([{ text: 'anything at all', kind: null }]);
	});

	it('never loses or invents characters on any specimen line', () => {
		for (const specimen of allSpecimens()) {
			for (const [text] of specimen.lines) {
				expect(tokenise(text, specimen.family).map((t) => t.text).join('')).toBe(text);
			}
		}
	});
});
