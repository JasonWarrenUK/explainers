import { describe, expect, it } from 'vitest';
import { DECISIONS, INSERTS, MY_PICKS, TAIL, TALLY, type Picks } from './last-verified-data';

describe('last-verified data', () => {
	it('has a consequence and a tally line for every option', () => {
		for (const decision of DECISIONS) {
			for (const option of decision.options) {
				expect(decision.consequences[option.key], `${decision.n}${option.key}`).toBeDefined();
				expect(TALLY[`${decision.n}${option.key}`], `tally ${decision.n}${option.key}`).toBeDefined();
			}
		}
		expect(Object.keys(TALLY)).toHaveLength(15);
	});

	it('fills the {tail} placeholder for every first answer', () => {
		const after = DECISIONS[0].after ?? '';
		expect(after).toContain('{tail}');
		for (const key of DECISIONS[0].options.map((o) => o.key)) expect(TAIL[key]).toBeTruthy();
	});

	it('gives the author one pick per decision', () => {
		expect(MY_PICKS).toHaveLength(DECISIONS.length);
	});

	it('fires an insert only for its own combination of answers', () => {
		const batchThenDiff: Picks = ['c', 'b', null, null, null];
		const fired = INSERTS.filter((i) => i.at === 2 && i.when(batchThenDiff)).map((i) => i.id);
		expect(fired).toEqual(['I1']);

		const nothingYet: Picks = [null, null, null, null, null];
		expect(INSERTS.filter((i) => i.when(nothingYet))).toEqual([]);
	});

	it('attaches every insert to a real decision', () => {
		for (const insert of INSERTS) {
			expect(DECISIONS.some((d) => d.n === insert.at), insert.id).toBe(true);
		}
	});
});
