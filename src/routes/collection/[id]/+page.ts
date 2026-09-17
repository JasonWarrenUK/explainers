import { error } from '@sveltejs/kit';
import { getCollection } from '$lib/data/collections';
import { getExplainer } from '$lib/data/explainers';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const collection = getCollection(params.id);
	if (!collection) error(404, `No collection "${params.id}"`);

	const items = collection.explainerIds
		.map((id) => getExplainer(id))
		.filter((e) => e !== undefined);

	return { collection, items };
};
