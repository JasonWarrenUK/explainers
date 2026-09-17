import type { Collection } from './types';

export const collections: Collection[] = [
	{
		id: 'what-nobody-meant',
		title: 'What Nobody Meant',
		description: 'Six things I find it very hard to shut up about.',
		explainerIds: [
			'inherited-property',
			'the-other-face',
			'the-break',
			'the-apparatus',
			'what-exists',
			'the-older-layer'
		]
	}
];

export function getCollection(id: string): Collection | undefined {
	return collections.find((c) => c.id === id);
}
