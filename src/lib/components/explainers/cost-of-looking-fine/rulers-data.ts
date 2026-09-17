export interface Index {
	key: string;
	v: number;
	inferred?: boolean;
}

export const COMPOSITE = 162;

export const INDICES: Index[] = [
	{ key: 'Verbal reasoning (inferred)', v: 196, inferred: true },
	{ key: 'Abstract reasoning (inferred)', v: 188, inferred: true },
	{ key: 'Working memory', v: 124 },
	{ key: 'Processing speed', v: 118 }
];
