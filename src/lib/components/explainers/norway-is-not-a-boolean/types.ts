import type { SpecimenLine } from '../formats/tokenise';

export type GateId =
	| 'marker'
	| 'typing'
	| 'numbers'
	| 'dates'
	| 'reasons'
	| 'who'
	| 'shape'
	| 'many'
	| 'change'
	| 'reach';

export type Picks = Record<GateId, string | null>;

export interface Specimen {
	label: string;
	family: string;
	lines: SpecimenLine[];
	/** Shown in the readout when present: whether remarks are allowed, and which standard governs. */
	comments?: boolean;
	spec?: string;
}

export interface Docket {
	name: string;
	meta: string;
	claim: string;
	forText: string;
	againstText: string;
	pays: string;
}

export interface MinorFormat {
	name: string;
	good: string;
	bad: string;
}

export interface ParseCard {
	fmt: string;
	inp: string;
	out: string;
	why: string;
}

/** Technical detail, folded away under an answer until the reader opens it. */
export interface FinePrint {
	summary: string;
	paragraphs?: string[];
	docket?: Docket;
	minorFormats?: MinorFormat[];
	cards?: ParseCard[];
	specimen?: Specimen;
}

export interface Answer {
	verdict: string;
	paragraphs: string[];
	specimen?: Specimen;
	finePrint?: FinePrint[];
}

export interface Gate {
	id: GateId;
	heading: string;
	lead: string[];
	/** An extra lead paragraph that depends on the first answer. */
	leadByMarker?: Record<string, string>;
	text: string;
	options: { key: string; label: string }[];
	answers: Record<string, Answer>;
}
