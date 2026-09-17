export interface ExplainerMeta {
	id: string;
	title: string;
	blurb: string;
	tags: string[];
}

export interface Collection {
	id: string;
	title: string;
	description: string;
	explainerIds: string[];
}
