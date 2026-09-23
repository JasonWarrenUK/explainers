import { describe, expect, it } from 'vitest';
import { GATES, GATE_ORDER, allSpecimens } from './gates';
import { CARDS, DOCKETS, OTHERS } from './reference';
import { RULES } from './rules';
import type { FinePrint } from './types';

const everyFinePrint: FinePrint[] = GATES.flatMap((gate) =>
	Object.values(gate.answers).flatMap((answer) => answer.finePrint ?? [])
);

describe('norway-is-not-a-boolean gates', () => {
	it('has ten decisions with unique ids', () => {
		expect(GATE_ORDER).toHaveLength(10);
		expect(new Set(GATE_ORDER).size).toBe(10);
	});

	it('has a written answer for every option of every gate', () => {
		for (const gate of GATES) {
			expect(Object.keys(gate.answers).sort()).toEqual(gate.options.map((o) => o.key).sort());
			for (const [key, answer] of Object.entries(gate.answers)) {
				expect(answer.verdict, `${gate.id}.${key}`).toBeTruthy();
				expect(answer.paragraphs.length, `${gate.id}.${key}`).toBeGreaterThan(0);
			}
		}
	});

	it('gives the typing gate a lead for every first answer', () => {
		const typing = GATES.find((gate) => gate.id === 'typing');
		const markerKeys = GATES[0].options.map((o) => o.key).sort();
		expect(Object.keys(typing?.leadByMarker ?? {}).sort()).toEqual(markerKeys);
	});

	it('only uses specimen families that have rules, or plain text', () => {
		for (const specimen of allSpecimens()) {
			if (specimen.family === 'plain') continue;
			expect(RULES[specimen.family], `no rules for ${specimen.family}`).toBeDefined();
		}
	});

	// the reference material is only reachable through an answer, so none of it may be left out
	it('places every docket, minor format and parse card under some answer', () => {
		const placedDockets = everyFinePrint.flatMap((item) => (item.docket ? [item.docket.name] : []));
		const placedMinor = everyFinePrint.flatMap((item) => (item.minorFormats ?? []).map((m) => m.name));
		const placedCards = everyFinePrint.flatMap((item) => (item.cards ?? []).map((c) => c.inp));

		expect(placedDockets.sort()).toEqual(DOCKETS.map((d) => d.name).sort());
		expect(placedMinor.sort()).toEqual(OTHERS.map((o) => o.name).sort());
		expect(placedCards.sort()).toEqual(CARDS.map((c) => c.inp).sort());
	});

	it('uses unique fine print summaries within an answer, since they key the list', () => {
		for (const gate of GATES) {
			for (const answer of Object.values(gate.answers)) {
				const summaries = (answer.finePrint ?? []).map((item) => item.summary);
				expect(new Set(summaries).size).toBe(summaries.length);
			}
		}
	});
});
