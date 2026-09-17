import type { ExplainerMeta } from './types';

export const explainers: ExplainerMeta[] = [
	{
		id: 'inherited-property',
		title: 'Inherited Property',
		blurb:
			"The people whose language became English, Greek and Hindi left no writing, no buildings and no graves anybody can identify. So how does anyone know they kept bees?",
		tags: ['linguistics', 'history']
	},
	{
		id: 'the-other-face',
		title: 'The Other Face',
		blurb:
			'The Franks claimed they came from Troy. Why would a people only two generations old need ancestors from a famous war fifteen centuries earlier?',
		tags: ['history', 'mythology']
	},
	{
		id: 'the-break',
		title: 'The Break',
		blurb:
			"Around 1200 BC a connected world came apart in about fifty years. What happens to a civilisation's memory of itself when everybody who could read is gone?",
		tags: ['history']
	},
	{
		id: 'the-apparatus',
		title: 'The Apparatus',
		blurb:
			'A machine can invent ten thousand names, every one of them different from all the others. Why do they all feel like the same name?',
		tags: ['software-design', 'data', 'narrative']
	},
	{
		id: 'what-exists',
		title: 'What Exists',
		blurb:
			'Every form you have ever filled in had boxes that somebody chose in advance. Whose name does not fit, and who decided that it would not?',
		tags: ['software-design', 'data']
	},
	{
		id: 'the-older-layer',
		title: 'The Older Layer',
		blurb:
			'Sacred texts were copied by hand for centuries, and each generation quietly adjusted what it disagreed with. So why is the older version still sitting in there?',
		tags: ['history', 'mythology']
	},
	{
		id: 'the-cost-of-looking-fine',
		title: 'The Cost of Looking Fine',
		blurb:
			'A composite score of 162 sounds like uniform brilliance. It is an average, and averages hide exactly the split that matters.',
		tags: ['cognition', 'adhd']
	},
	{
		id: '4-englishes',
		title: 'One Sentence, Four Englishes',
		blurb:
			'One sentence, traced back through four written stages of English and three reconstructed proto-languages, eight thousand years in one line.',
		tags: ['linguistics', 'history']
	},
	{
		id: 'what-everyone-said',
		title: 'What Everyone Said',
		blurb:
			'How you find out what a group thinks, when the only thing you can collect is what individuals say, one at a time.',
		tags: ['data', 'ethics', 'software-design']
	}
];

export function getExplainer(id: string): ExplainerMeta | undefined {
	return explainers.find((e) => e.id === id);
}

export function getExplainersByTag(tag: string): ExplainerMeta[] {
	return explainers.filter((e) => e.tags.includes(tag));
}

export function getAllTags(): string[] {
	const tags = new Set<string>();
	for (const e of explainers) {
		for (const t of e.tags) tags.add(t);
	}
	return [...tags].sort();
}
