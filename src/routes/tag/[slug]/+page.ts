import { error } from '@sveltejs/kit';
import { getExplainersByTag } from '$lib/data/explainers';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const items = getExplainersByTag(params.slug);
	if (items.length === 0) error(404, `No explainers tagged "${params.slug}"`);
	return { tag: params.slug, items };
};
