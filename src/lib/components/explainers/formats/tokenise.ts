export type TokenKind = 'key' | 'str' | 'num' | 'lit' | 'com' | 'tag' | 'att' | 'pun';
export type TokenRule = [RegExp, TokenKind];

export interface Token {
	text: string;
	kind: TokenKind | null;
}

export type NoteKind = 'gain' | 'cost' | 'flat';
export type SpecimenLine = [text: string] | [text: string, kind: NoteKind, note: string];

export type Tokeniser = (line: string, family: string) => Token[];

/**
 * One combined pattern per family, one capture group per rule. Inner groups
 * in the rules must be non-capturing so group indices stay aligned with them.
 */
export function createTokeniser(rules: Record<string, TokenRule[]>): Tokeniser {
	const combined = new Map<string, RegExp>();
	for (const [family, specs] of Object.entries(rules)) {
		combined.set(family, new RegExp(specs.map(([re]) => `(${re.source})`).join('|'), 'g'));
	}

	return (line, family) => {
		const specs = rules[family];
		const pattern = combined.get(family);
		if (!specs || !pattern) return [{ text: line, kind: null }];

		const tokens: Token[] = [];
		pattern.lastIndex = 0;
		let last = 0;
		let match: RegExpExecArray | null;
		while ((match = pattern.exec(line)) !== null) {
			if (match[0] === '') {
				pattern.lastIndex++;
				continue;
			}
			if (match.index > last) tokens.push({ text: line.slice(last, match.index), kind: null });
			const ruleIndex = match.findIndex((group, i) => i > 0 && group !== undefined) - 1;
			tokens.push({ text: match[0], kind: specs[ruleIndex]?.[1] ?? 'pun' });
			last = match.index + match[0].length;
		}
		if (last < line.length) tokens.push({ text: line.slice(last), kind: null });
		return tokens;
	};
}
