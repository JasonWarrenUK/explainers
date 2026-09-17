import { error } from '@sveltejs/kit';
import { getExplainer, getStaticParent } from '$lib/data/explainers';
import { explainerComponents } from '$lib/components/explainers/registry';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const meta = getExplainer(params.id);
	if (!meta) error(404, `No explainer "${params.id}"`);

	const loadComponent = explainerComponents[params.id];
	if (!loadComponent) error(404, `No component registered for "${params.id}"`);

	const mod = await loadComponent();
	return { meta, component: mod.default, parent: getStaticParent(meta) };
};
