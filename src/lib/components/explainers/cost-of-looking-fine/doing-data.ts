export interface PlanStep {
	text: string;
	extra: Record<number, string>;
}

export const PLAN: PlanStep[] = [
	{
		text: 'Open the expenses portal',
		extra: { 1: 'It times out after ten minutes, so have the receipt ready before you open it.' }
	},
	{
		text: 'Find the receipt',
		extra: {
			3: 'It is a PDF attachment in an email from 14 weeks ago; the portal only takes JPG, so screenshot it.'
		}
	},
	{ text: 'Enter the amount: £41.00', extra: {} },
	{
		text: 'Choose the cost code',
		extra: { 2: 'The list is alphabetical by department, not by project. Finance bounces the wrong one.' }
	},
	{
		text: 'Press submit',
		extra: {
			4: 'Fourteen weeks crosses a quarter boundary: select the previous period first or it silently fails.'
		}
	}
];

export const PLAN_STEPS: string[] = PLAN.map((p) => p.text);

export const ALONE: number[] = [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0];
export const WITH_HELP: number[] = [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1];

export const DERAILS: string[] = [
	'Opened email to find the receipt. Read four other emails. Closed email.',
	'Decided the cost-code list should really be searchable. Spent twenty minutes on that thought.',
	'Made tea.',
	'It is somehow 4pm.',
	'Noticed the portal’s date picker is broken in Firefox. Confirmed this. Did not enter the date.',
	'Started, then remembered the other thing that is also overdue.',
	'Re-read the plan. It is a good plan.',
	'Tomorrow. Definitely tomorrow.'
];
