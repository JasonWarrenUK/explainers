import { describe, expect, it } from 'vitest';
import { ANSWERS, FILES, GATES, GATE_ORDER, RULES } from './the-country-that-means-no-data';

describe('the-country-that-means-no data', () => {
	it('has an answer for every option of every gate', () => {
		for (const id of GATE_ORDER) {
			for (const option of GATES[id].options) {
				expect(ANSWERS[id][option.key], `${id}.${option.key} has no answer`).toBeDefined();
			}
		}
	});

	it('only points answers at specimens that exist', () => {
		for (const id of GATE_ORDER) {
			for (const [key, answer] of Object.entries(ANSWERS[id])) {
				if (answer.file) expect(FILES[answer.file], `${id}.${key} → ${answer.file}`).toBeDefined();
			}
		}
	});

	it('has highlighting rules for every specimen family', () => {
		for (const file of Object.values(FILES)) {
			expect(RULES[file.family], `no rules for ${file.family}`).toBeDefined();
		}
	});
});
