export const RULEBOOK: string[] = [
	'An attack deals its printed damage to its target.',
	'Shield X: when a figure with Shield takes damage from an attack, reduce that damage by X, to a minimum of 0.',
	"Pierce X: this attack ignores up to X points of the target's Shield.",
	'Poison: a poisoned figure takes 1 extra damage from every attack that damages it. Poison is removed when the figure is healed.',
	'Retaliate X: after a figure with Retaliate is attacked by an adjacent attacker, it performs a Retaliate action, dealing X damage to that attacker.',
	'A figure reduced to 0 health is defeated and removed from the map immediately.',
	'Effects on a figure end when the figure is removed from the map.',
	'Actions are resolved one at a time, in full, in the order they are triggered.'
];

export interface RuleQuestion {
	kicker: string;
	band: string;
	sub: string;
	q: string;
	options: string[];
	answer: string;
	hi: number[];
	why: string;
}

export const RULE_QUESTIONS: RuleQuestion[] = [
	{
		kicker: 'Locate',
		band: 'reading at about 100',
		sub: 'Plain',
		q: 'A monster with Shield 2 is hit by an Attack 5. How much damage does it take?',
		options: ['5', '3', '2', '0'],
		answer: '3',
		hi: [1, 2],
		why: 'Rule 1 says the attack deals its damage; rule 2 says shield takes some off: 5 minus 2. Two adjacent rules, one number. This is where the ladder starts, and most readers manage it.'
	},
	{
		kicker: 'Locate',
		band: 'reading at about 110',
		sub: 'Buried',
		q: 'A monster is poisoned. What removes the poison?',
		options: [
			'It wears off at the end of the round',
			'It is removed when the monster is defeated',
			'It is removed when the monster is healed',
			'Nothing; poison is permanent'
		],
		answer: 'It is removed when the monster is healed',
		hi: [4],
		why: 'Still one rule, but the answer is the second sentence of a rule whose first sentence is about something else, and a plausible distractor (rule 7, effects end on removal) is sitting nearby. Locating a stated fact gets harder when the text puts it somewhere you were not looking.'
	},
	{
		kicker: 'Combine',
		band: 'reading at about 120',
		sub: 'Two rules',
		q: 'A poisoned monster with Shield 1 is hit by Attack 3. How much damage does it take?',
		options: ['1', '2', '3', '4'],
		answer: '3',
		hi: [1, 2, 4],
		why: 'Shield takes 3 down to 2. The attack damaged the figure, so poison adds 1 back. Two rules from different parts of the page, applied in sequence, and neither is hard on its own.'
	},
	{
		kicker: 'Combine',
		band: 'reading at about 130',
		sub: 'Three rules',
		q: 'A poisoned monster with Shield 3 is hit by Attack 3, Pierce 2. How much damage does it take?',
		options: ['0', '1', '2', '3'],
		answer: '3',
		hi: [1, 2, 3, 4],
		why: 'Pierce 2 knocks the shield down to 1; the attack of 3 becomes 2; poison adds 1 because the attack damaged the figure. Three rules, and an order of application the book never states. Drop any one and you get a confident wrong number.'
	},
	{
		kicker: 'Model',
		band: 'reading at about 140',
		sub: 'What a word is doing',
		q: 'A poisoned monster with Shield 3 is hit by Attack 2. How much damage does it take?',
		options: ['0', '1', '2', '3'],
		answer: '0',
		hi: [1, 2, 4],
		why: 'Shield 3 reduces 2 to 0. Does poison add 1? Rule 4 says poison adds damage to an attack that damages the figure, and this one did not. The answer turns on noticing what the word “damages” is doing in the sentence: it is a condition, not a description. Nobody wrote a rule for this case. The rule that exists was written so the case would fall out of it.'
	},
	{
		kicker: 'Model',
		band: 'reading at 150 and above',
		sub: 'What the book is built to do',
		q: 'Your attack kills an adjacent monster that has Retaliate 2. Your opponent says the retaliate still hits you. The rules do not say either way. Who is right?',
		options: [
			'Retaliate hits you: the rule says “after it is attacked”, and it was',
			'No retaliate: a defeated figure has been removed and has nothing to act with',
			'Roll a die',
			'Both readings are equally supported'
		],
		answer: 'No retaliate: a defeated figure has been removed and has nothing to act with',
		hi: [5, 6, 7, 8],
		why: 'There is no sentence to find. Retaliate is written as an action the monster performs (rule 5). Defeat is immediate removal (rule 6), removal ends its effects (rule 7), and actions resolve one at a time in full (rule 8): the attack finishes, the monster is gone, and there is no figure left to perform anything. The book was written so that this case falls out of its structure rather than needing its own line. A reader at this level is not searching the text; they are running it.'
	}
];
