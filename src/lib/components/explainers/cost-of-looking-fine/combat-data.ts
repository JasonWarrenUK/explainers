export interface Round {
	rule: string;
	best: 'A' | 'B';
	A: string;
	B: string;
}

export const ROUND_RULES: (Round | null)[] = [
	null,
	{
		rule: 'Damage. Hew is a melee attack for 4. Bolt is a ranged attack for 2. The enemy has 3 health.',
		best: 'A',
		A: 'Hew deals 4. The enemy has 3. Dead.',
		B: 'Bolt deals 2. The enemy is left on 1.'
	},
	{
		rule: 'Retaliate. The enemy has Retaliate 2: anything that hits it from an adjacent space takes 2 damage back. You have 2 health.',
		best: 'B',
		A: 'Hew kills the enemy, and the retaliate lands on you for 2. You have 2. You are dead too.',
		B: 'Bolt is ranged, so there is nothing to retaliate against. Enemy on 1, you on 2.'
	},
	{
		rule: "Shield. Last turn's card gave you Shield 2 until the end of this round: every hit on you is reduced by 2.",
		best: 'A',
		A: 'Hew kills the enemy. Retaliate 2 hits your Shield 2 and does nothing. Enemy dead, you on 2.',
		B: 'Bolt leaves the enemy on 1. You were never at risk from retaliate anyway. Nothing gained.'
	},
	{
		rule: 'Initiative. The enemy acts at 35, and its action this round is: move 2 away, then attack 3 at range. Hew acts at 60. Bolt acts at 20.',
		best: 'B',
		A: 'Hew acts at 60. At 35 the enemy has already stepped out of reach and shot you for 3, which your shield cuts to 1. Hew hits nothing. Enemy on 3, you on 1.',
		B: 'Bolt acts at 20, before the enemy moves: 2 damage, enemy on 1. Then it steps away and shoots; shield cuts it to 1. Enemy on 1, you on 1.'
	},
	{
		rule: "Movement. Hew's card reads Move 2, then Attack 4: you close the distance before you swing.",
		best: 'A',
		A: 'At 35 the enemy steps away and shoots you down to 1. At 60 Hew moves 2, catches it, and hits for 4. Enemy dead. Retaliate 2 is stopped by your shield. You on 1, enemy dead.',
		B: 'Bolt still leaves the enemy on 1, and you on 1. Alive, but so is it.'
	},
	{
		rule: 'Errata. Retaliate damage is not reduced by Shield.',
		best: 'B',
		A: 'Hew catches the enemy and kills it. Retaliate 2 now goes straight through your shield. You were on 1. Enemy dead, you dead.',
		B: 'Bolt from range, nothing to retaliate against. Enemy on 1, you on 1, and next turn is yours.'
	}
];
