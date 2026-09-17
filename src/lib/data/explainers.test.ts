import { describe, expect, it } from 'vitest';
import { explainers, getAllTags, getExplainer, getExplainersByTag } from './explainers';
import { collections, getCollection } from './collections';

describe('getExplainer', () => {
	it('finds an explainer by id', () => {
		expect(getExplainer('the-apparatus')?.title).toBe('The Apparatus');
	});

	it('returns undefined for an unknown id', () => {
		expect(getExplainer('does-not-exist')).toBeUndefined();
	});
});

describe('getExplainersByTag', () => {
	it('returns every explainer carrying a given tag', () => {
		const history = getExplainersByTag('history');
		const ids = history.map((e) => e.id).sort();
		expect(ids).toEqual(
			['4-englishes', 'inherited-property', 'the-break', 'the-older-layer', 'the-other-face'].sort()
		);
	});

	it('returns an empty array for a tag nothing carries', () => {
		expect(getExplainersByTag('nonexistent-tag')).toEqual([]);
	});
});

describe('getAllTags', () => {
	it('collects every distinct tag across all explainers, sorted', () => {
		const tags = getAllTags();
		expect(tags).toEqual([...tags].sort());
		expect(new Set(tags).size).toBe(tags.length);
		expect(tags).toContain('linguistics');
		expect(tags).toContain('software-design');
	});
});

describe('collections', () => {
	it('resolves a collection by id', () => {
		expect(getCollection('what-nobody-meant')?.title).toBe('What Nobody Meant');
	});

	it('every explainerId in every collection resolves to a real explainer', () => {
		for (const collection of collections) {
			for (const id of collection.explainerIds) {
				expect(getExplainer(id), `${collection.id} references missing explainer ${id}`).toBeDefined();
			}
		}
	});
});

describe('explainers', () => {
	it('has no duplicate ids', () => {
		const ids = explainers.map((e) => e.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every explainer has at least one tag', () => {
		for (const e of explainers) {
			expect(e.tags.length, `${e.id} has no tags`).toBeGreaterThan(0);
		}
	});
});
