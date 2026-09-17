export interface Stage {
	name: string;
	age: string;
	structure: number;
	interest: number;
}

export const STAGES: Stage[] = [
	{ name: 'Primary school', age: '5 to 11', structure: 85, interest: 55 },
	{ name: 'Early secondary', age: '12 to 14', structure: 55, interest: 35 },
	{ name: 'GCSEs', age: '15 to 16', structure: 50, interest: 30 },
	{ name: 'A-levels', age: '16 to 18', structure: 30, interest: 25 },
	{ name: 'No degree, ordinary jobs', age: '19 to 25', structure: 35, interest: 20 },
	{ name: 'A master’s degree', age: '26', structure: 75, interest: 90 },
	{ name: 'Back into normal life', age: '27 onwards', structure: 30, interest: 30 }
];

export function attentionFrom(interest: number): number {
	return 100 / (1 + Math.exp(-1.6 * (interest / 10 - 6.2)));
}

export function outputFrom(structure: number, interest: number): number {
	return Math.round(Math.min(100, Math.max(attentionFrom(interest), structure * 0.85)));
}

export function verdictFor(o: number): string {
	return o >= 85 ? 'Distinction' : o >= 65 ? 'Doing well' : o >= 45 ? 'Floundering' : 'Falling apart';
}

export const NOTES: string[] = [
	'The timetable is handed over complete, and the material is at least mildly new. The room is doing the executive work, so the executive drag is invisible. Praise arrives. “Gifted.”',
	'The first real drop, and it comes early. Secondary school starts expecting the pupil to carry the structure themselves, the homework, the planning, the remembering, at exactly the moment the content slows down. The reasoning has not changed at all. The room has.',
	'Still floundering. Reports say “could do so much more”, which is true and useless: it names the knowing, not the doing.',
	'Almost no structure, subjects chosen years ago that have stopped being interesting. This is where dropping out happens. From outside it reads as a bright person throwing it away.',
	'Years without a qualification, in jobs that supply neither scaffolding nor fascination. The line stays low. Everyone, including the person, now has a story in which the early promise was a fluke.',
	'Then a room that fits: a subject chosen for love, dense deadlines, a cohort, a supervisor. Attention floods in from the right of Toy 7 and structure covers the rest. A distinction at 26, with no undergraduate degree underneath it. The same ability meeting the right room for the first time since primary school.',
	'The course ends and normal life resumes: no timetable, no cohort, nothing on fire. The line falls straight back. Nothing was lost between the distinction and the collapse. The room changed again.'
];
