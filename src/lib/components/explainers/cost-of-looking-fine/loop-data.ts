import { C } from './palette';

export interface LoopStep {
	t: string;
	r: (lap: number) => string;
	who: string;
}

export const LOOP: LoopStep[] = [
	{
		t: 'A standard is set',
		r: (lap) =>
			lap === 0
				? 'It is set very high, because the person can see exactly what excellent looks like.'
				: 'Higher than last time, because last time has to be made up for.',
		who: C.reason
	},
	{
		t: 'Starting doesn’t happen',
		r: (lap) =>
			lap === 0
				? 'The task is important and dull. Toy 7 showed what the attention system does with that.'
				: 'The task is important, dull, and now also carries the memory of every previous time. Opening it means feeling all of that first.',
		who: C.drag
	},
	{
		t: 'Time goes missing',
		r: () => 'Deadlines are known in the abstract and not felt in the body. It is suddenly the night before.',
		who: C.drag
	},
	{
		t: 'A rescue, or a miss',
		r: (lap) =>
			lap < 2
				? 'Hyperfocus salvages something creditable at 3am, or nothing arrives. Either way it fell short of the standard from step one.'
				: 'The 3am rescue is getting rarer. Hyperfocus needs something to grip, and dread is not it. More often now, nothing arrives.',
		who: C.reason
	},
	{
		t: 'Shame',
		r: (lap) =>
			lap === 0
				? '“If I’m this capable, this shouldn’t be hard.” Landing on a nervous system already primed to feel criticism as pain.'
				: 'Not a new feeling now; a familiar one, arriving on schedule, and a little larger each time because it has evidence.',
		who: C.drag
	},
	{
		t: 'The standard goes up',
		r: () => 'Next time will make up for it. The standard rises to cover the shame, which makes step two more likely.',
		who: C.reason
	}
];
