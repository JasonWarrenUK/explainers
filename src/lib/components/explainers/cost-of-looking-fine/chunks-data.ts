export interface ChunkLevel {
	at: number;
	label: string;
	chunks: [string, string][];
}

export interface Domain {
	name: string;
	string: string;
	levels: ChunkLevel[];
}

export const DOMAINS: Record<'web' | 'chess', Domain> = {
	web: {
		name: 'A web request',
		string: 'GET /users HTTP/1.1',
		levels: [
			{
				at: 0,
				label: 'None. Nineteen marks on a screen.',
				chunks: [
					['G', 'a letter'],
					['E', 'a letter'],
					['T', 'a letter'],
					[' ', 'a gap'],
					['/', 'a slash'],
					['u', 'a letter'],
					['s', 'a letter'],
					['e', 'a letter'],
					['r', 'a letter'],
					['s', 'a letter'],
					[' ', 'a gap'],
					['H', 'a letter'],
					['T', 'a letter'],
					['T', 'a letter'],
					['P', 'a letter'],
					['/', 'a slash'],
					['1', 'a digit'],
					['.', 'a dot'],
					['1', 'a digit']
				]
			},
			{
				at: 13,
				label: 'Enough to read: the letters clump into words.',
				chunks: [
					['GET', 'a word, in capitals'],
					[' ', 'a gap'],
					['/', 'a slash'],
					['users', 'a word'],
					[' ', 'a gap'],
					['HTTP', 'a word, in capitals; probably an abbreviation'],
					['/', 'a slash'],
					['1', 'a number'],
					['.', 'a dot'],
					['1', 'a number']
				]
			},
			{
				at: 26,
				label: 'Enough to recognise a version number.',
				chunks: [
					['GET', 'a word, in capitals'],
					[' ', 'a gap'],
					['/', 'a slash'],
					['users', 'a word'],
					[' ', 'a gap'],
					['HTTP', 'an abbreviation'],
					['/', 'a slash'],
					['1.1', 'a version number: one point one']
				]
			},
			{
				at: 39,
				label: 'Enough to know a slash before a word is a path.',
				chunks: [
					['GET', 'a word, in capitals'],
					[' ', 'a gap'],
					['/users', 'a path: a place on a server, like a folder'],
					[' ', 'a gap'],
					['HTTP', 'an abbreviation'],
					['/', 'a slash'],
					['1.1', 'a version number']
				]
			},
			{
				at: 52,
				label: 'Enough to know HTTP is the protocol the web speaks.',
				chunks: [
					['GET', 'a word, in capitals'],
					[' ', 'a gap'],
					['/users', 'a path on a server'],
					[' ', 'a gap'],
					['HTTP/1.1', 'the protocol and its version: the language this line is written in']
				]
			},
			{
				at: 65,
				label: 'Enough to know the three-part shape of a request line.',
				chunks: [
					['GET', 'a verb: fetch something without changing it'],
					['/users', 'what to fetch: the users resource'],
					['HTTP/1.1', 'which dialect the two machines are speaking']
				]
			},
			{
				at: 78,
				label: 'Enough to read verb and path as one instruction.',
				chunks: [
					['GET /users', 'fetch the list of users'],
					['HTTP/1.1', 'speaking HTTP, version 1.1']
				]
			},
			{
				at: 91,
				label: 'Fluent. The whole line is one familiar thing.',
				chunks: [
					[
						'GET /users HTTP/1.1',
						'a request line: the first line of every web request, asking a server for its users list. Seen ten thousand times.'
					]
				]
			}
		]
	},
	chess: {
		name: 'A chess opening',
		string: 'e4 e5 Nf3 Nc6 Bb5',
		levels: [
			{
				at: 0,
				label: 'None. Seventeen marks on a screen.',
				chunks: [
					['e', 'a letter'],
					['4', 'a digit'],
					[' ', 'a gap'],
					['e', 'a letter'],
					['5', 'a digit'],
					[' ', 'a gap'],
					['N', 'a capital'],
					['f', 'a letter'],
					['3', 'a digit'],
					[' ', 'a gap'],
					['N', 'a capital'],
					['c', 'a letter'],
					['6', 'a digit'],
					[' ', 'a gap'],
					['B', 'a capital'],
					['b', 'a letter'],
					['5', 'a digit']
				]
			},
			{
				at: 13,
				label: 'Enough to see letter-digit pairs.',
				chunks: [
					['e4', 'a letter and a digit'],
					[' ', 'a gap'],
					['e5', 'a letter and a digit'],
					[' ', 'a gap'],
					['Nf3', 'a capital, a letter, a digit'],
					[' ', 'a gap'],
					['Nc6', 'a capital, a letter, a digit'],
					[' ', 'a gap'],
					['Bb5', 'a capital, a letter, a digit']
				]
			},
			{
				at: 26,
				label: 'Enough to know these name squares on a board.',
				chunks: [
					['e4', 'a square: file e, rank 4'],
					['e5', 'a square: file e, rank 5'],
					['Nf3', 'N for knight, going to f3'],
					['Nc6', 'a knight going to c6'],
					['Bb5', 'B for bishop, going to b5']
				]
			},
			{
				at: 39,
				label: 'Enough to know moves alternate: white, black, white.',
				chunks: [
					['e4 e5', 'white pushes a pawn to the centre; black answers in kind'],
					['Nf3 Nc6', 'white brings a knight out; black brings one out'],
					['Bb5', 'white brings a bishop out']
				]
			},
			{
				at: 52,
				label: 'Enough to see what each pair of moves is for.',
				chunks: [
					['e4 e5', 'both sides claim the centre'],
					['Nf3 Nc6', "white's knight attacks the e5 pawn; black's knight defends it"],
					['Bb5', 'the bishop attacks the defender']
				]
			},
			{
				at: 65,
				label: 'Enough to recognise the open game.',
				chunks: [
					['e4 e5 Nf3 Nc6', 'the open game: the four most common first moves in chess'],
					['Bb5', 'the bishop pins the knight that guards e5']
				]
			},
			{
				at: 78,
				label: 'Enough to know the plan behind it.',
				chunks: [
					[
						'e4 e5 Nf3 Nc6 Bb5',
						"white piles pressure on e5 by attacking its defender; black will answer a6 and the fight is about whether the bishop stays"
					]
				]
			},
			{
				at: 91,
				label: 'Fluent. One name.',
				chunks: [
					[
						'e4 e5 Nf3 Nc6 Bb5',
						'the Ruy Lopez, the oldest opening in the book, played a million times. A club player sees the name, not the moves.'
					]
				]
			}
		]
	}
};

export const DIGITS = '4 7 2 9 1 8 3 6 5';
export const PHRASE = 'THE CAT SAT';

/** Longest common subsequence: tolerant of one dropped or transposed character. */
export function lcs(a: string, b: string): number {
	const m = a.length;
	const n = b.length;
	const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
	for (let i = 1; i <= m; i++)
		for (let j = 1; j <= n; j++)
			dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
	return dp[m][n];
}
