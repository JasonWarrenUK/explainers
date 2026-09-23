import type { NoteKind, SpecimenNote } from '../formats/tokenise';
import { card, docket, minorFormat } from './reference';
import type { Gate, GateId, Specimen } from './types';

/* ============================================================
   NOTES
   Plain notes are always shown. Technical ones stay folded away
   until the reader asks for them.
   ============================================================ */

const note = (kind: NoteKind) => (text: string): SpecimenNote => ({ kind, text });
const technicalNote = (kind: NoteKind) => (text: string): SpecimenNote => ({ kind, text, technical: true });

const gain = note('gain');
const cost = note('cost');
const flat = note('flat');
const technical = { gain: technicalNote('gain'), cost: technicalNote('cost'), flat: technicalNote('flat') };

/* ============================================================
   THE RECORD: one object, carried through every decision
   ============================================================ */

export const RECORD: [field: string, value: string][] = [
	['Object', 'Disc brooch'],
	['Accession', '007'],
	['Found in', 'NO'],
	['Weight', '12.50 g'],
	['Made of', 'copper alloy, glass'],
	['Registry no.', '9007199254740993'],
	['Catalogued', '2 November 1998, 09:00'],
	['Note', 'Bent, and mended in antiquity.\nSee also the pin, accession 041.']
];

/** Where the problem was first noticed: a server's deploy file. */
export const DEPLOY_FILE: Specimen = {
	label: 'A deploy file, as typed',
	family: 'yaml',
	lines: [
		['service: atlas'],
		['region: NO', cost('Read back as the word no. The service starts, and its region is false.')],
		['version: 1.20', cost('Read back as the number 1.2. The final zero was part of the version.')]
	]
};

/* ============================================================
   SPECIMENS
   ============================================================ */

const JSON_FILE: Specimen = {
	label: 'What you have just invented is called JSON',
	family: 'json',
	comments: false,
	spec: 'RFC 8259 / ECMA-404',
	lines: [
		['{'],
		[
			'  "object": "Disc brooch",',
			gain('Every fact is fenced off by punctuation, so a computer never has to guess where one ends. This is why the style won.')
		],
		['  "accession": "007",'],
		[
			'  "found_in": "NO",',
			technical.gain('Quoted means string, in every parser, always. The Norway problem cannot reach this line.')
		],
		[
			'  "weight_g": "12.50",',
			technical.flat('The trailing zero survives only because it is quoted. Unquote it and you have the number 12.5.')
		],
		['  "made_of": ["copper alloy", "glass"],'],
		[
			'  "registry_no": 9007199254740993,',
			technical.cost('Two to the fifty-third, plus one. Any parser backed by a double hands you 9007199254740992. The file is fine; the number is gone.')
		],
		[
			'  "catalogued": "1998-11-02T09:00:00Z",',
			technical.cost('No date type. Every consumer reparses this string and one of them gets the time zone wrong.')
		],
		[
			'  "note": "Bent, and mended in antiquity.\\nSee also the pin, accession 041."',
			cost("The curator's two lines have become one. The break between them is now written \\n, a code standing in for a thing the file can no longer contain."),
			technical.cost('Escaped newlines. At twenty lines this is unreadable and the diff is one enormous line.')
		],
		[
			'}',
			cost('There is nowhere in this file to write down why any of it is the way it is. No remarks are allowed.'),
			technical.cost('No trailing comma, so adding a field touches two lines and git blames the wrong one.')
		]
	]
};

const YAML_FILE: Specimen = {
	label: 'What you have just invented is called YAML',
	family: 'yaml',
	comments: true,
	spec: 'YAML 1.2.2 (and 1.1, still)',
	lines: [
		[
			'# Kaupang, 1998 season',
			gain('Remarks are allowed, and they are worth more than they look. The reason a value is what it is can sit beside the value.'),
			technical.gain('Comments, plus --- to carry many documents in one file, plus anchors and aliases for reuse with no templating layer.')
		],
		['object: Disc brooch'],
		['accession: 007'],
		['found_in: NO'],
		['weight_g: 12.50'],
		[
			'made_of:',
			technical.flat("This could also be written [copper alloy, glass], which is JSON's syntax, and 1.2 was revised specifically to swallow JSON. Close enough that migration is cheap; not actually a superset. Duplicate keys are legal JSON and an error in YAML, and PyYAML rejects tabs that JSON permits.")
		],
		['  - copper alloy'],
		['  - glass'],
		[
			'registry_no: 9007199254740993',
			technical.cost('YAML integers are arbitrary precision on paper. In a JavaScript runtime you get a double and lose the last digit anyway.')
		],
		[
			'catalogued: 1998-11-02T09:00:00Z',
			technical.cost('A timestamp under 1.1 and a plain string under the 1.2 core schema. Which you get depends on the library, not on the file.')
		],
		['note: |'],
		['  Bent, and mended in antiquity.'],
		[
			'  See also the pin, accession 041.',
			gain("The upright bar on the line above means: what follows is exactly as typed. The curator's two lines survive as two lines, with no codes standing in for anything."),
			technical.gain('Block scalar. Newlines, indentation and quotes survive exactly as typed. Nothing else on this page does this, and it is why nearly every CI system in existence is YAML.')
		]
	]
};

const XML_FILE: Specimen = {
	label: 'What you have just invented is called XML',
	family: 'xml',
	comments: true,
	spec: 'XML 1.0 5th ed.',
	lines: [
		[
			'<!-- Kaupang, 1998 season -->',
			technical.flat('XPath queries this document in one line and XSLT transforms it declaratively. Both are standards and both are older than most of this list. The JSON equivalents are still worse.')
		],
		[
			'<object accession="007" found_in="NO">',
			cost('Notice that two facts became attributes tucked inside the opening name, and the rest below became things in their own right. Nothing in the format tells you which is correct, so two museums will make opposite choices and never be able to swap files.')
		],
		['  <name>Disc brooch</name>'],
		['  <weight_g>12.50</weight_g>'],
		['  <made_of>'],
		['    <material>copper alloy</material>'],
		['    <material>glass</material>'],
		[
			'  </made_of>',
			cost('A list of two costs four extra lines. Every closing name is repeated. That weight is the standing complaint, and it is a fair one.'),
			technical.cost('This is the verbosity, and it is real: bytes on every wire, characters in every diff.')
		],
		['  <registry_no>9007199254740993</registry_no>'],
		[
			'  <catalogued>1998-11-02T09:00:00Z</catalogued>',
			technical.flat('A string until a schema says xs:dateTime. Add an XSD and the parser enforces types, ranges, enumerations and cardinality, which is more than any other format here offers.')
		],
		[
			'  <note>Bent, and mended in antiquity. See also the <ref acc="041">pin</ref>.</note>',
			gain('Look at that carefully. The mention of the pin is marked up inside the sentence, in its proper place in the prose. Nothing else on this page can hold prose with structure inside it, which is why every word processor and every e-book is XML underneath.')
		],
		[
			'</object>',
			technical.cost('Entity expansion and external entity resolution are still enabled in enough parsers that billion laughs and XXE remain live in 2026.')
		]
	]
};

const GUESSED_FILE: Specimen = {
	label: 'The same file, as the machine read it back',
	family: 'yaml',
	comments: true,
	spec: 'YAML 1.1',
	lines: [
		['object: Disc brooch'],
		['accession: 007', cost('Read back as the number 7. A catalogue search for 007 now finds nothing.')],
		[
			'found_in: NO',
			cost('Read back as the word no. Norway has left the catalogue.'),
			technical.cost('Under YAML 1.1 this is the boolean false. Norway has been losing this argument since 2001, and several widely deployed parsers still implement 1.1.')
		],
		[
			'weight_g: 12.50',
			cost("Read back as 12.5. The final zero was the curator's claim about how precisely the thing was weighed."),
			technical.cost('The float 12.5. The trailing zero is gone and nothing warns you. A comparison against the printed catalogue now fails in a way that looks like a logic bug.')
		]
	]
};

const QUOTED_FILE: Specimen = {
	label: 'Quoting everything, which is what TOML insists on',
	family: 'toml',
	comments: true,
	spec: 'TOML 1.1.0 (Dec 2025)',
	lines: [
		['# Kaupang, 1998 season'],
		['object = "Disc brooch"'],
		[
			'accession = "007"',
			gain('In quotes, so it stays three characters. Nothing can turn it into the number seven, because a quoted thing has nowhere else to go.')
		],
		[
			'found_in = "NO"',
			gain('Norway survives, by design this time and with no luck involved.'),
			technical.gain('Quoted means string. There is no path from this line to a boolean, and there never will be.')
		],
		[
			'weight_g = "12.50"',
			flat('Quoted, so the final zero survives. It is now a piece of text and no longer a measurement. You have kept the appearance and given up the arithmetic.')
		],
		['made_of = ["copper alloy", "glass"]'],
		['note = """'],
		['Bent, and mended in antiquity.'],
		[
			'See also the pin, accession 041.',
			gain('Three quotation marks open a passage that runs over several lines with nothing escaped.'),
			technical.gain('Multi-line basic string. No escaping, no continuation characters.')
		],
		['"""']
	]
};

const DECLARED_FILE: Specimen = {
	label: 'Declaring the kind separately, which is what a schema does',
	family: 'xml',
	comments: true,
	spec: 'XML 1.0 with XSD',
	lines: [
		['<object accession="007">'],
		[
			'  <found_in type="country-code">NO</found_in>',
			gain('The kind of thing is stated next to the thing. A checker can now refuse a file where this is not a real country code, before your program ever sees it.')
		],
		[
			'  <weight_g type="decimal" places="2">12.50</weight_g>',
			gain('Two decimal places, declared. The trailing zero is now a claim about how precisely the object was weighed, and it is protected as such.')
		],
		[
			'</object>',
			cost('You have gained a second document to write, agree and maintain: the rules themselves. Most teams who say they do this are copying rules somebody else wrote and hoping.')
		]
	]
};

const BARE_NUMBER_FILE: Specimen = {
	label: 'Sixteen digits, written as a number',
	family: 'json',
	comments: false,
	spec: 'RFC 8259 / ECMA-404',
	lines: [
		['{'],
		['  "accession": "007",'],
		[
			'  "registry_no": 9007199254740993',
			cost('Read this with the most common kind of JSON reader and the final 3 comes back as a 2.'),
			technical.cost('Two to the fifty-third, plus one. Any parser backed by a double hands you 9007199254740992. The file is fine; the number is gone.')
		],
		['}']
	]
};

const TEXT_NUMBER_FILE: Specimen = {
	label: 'Sixteen digits, written as text',
	family: 'json',
	comments: false,
	spec: 'RFC 8259 / ECMA-404',
	lines: [
		['{'],
		['  "accession": "007",'],
		[
			'  "registry_no": "9007199254740993"',
			gain('Sixteen characters in quotation marks. They are copied from place to place and nothing ever rounds them.')
		],
		['}']
	]
};

const SIZED_NUMBER_FILE: Specimen = {
	label: 'Sixteen digits, in a format that promised room for them',
	family: 'toml',
	comments: true,
	spec: 'TOML 1.1.0 (Dec 2025)',
	lines: [
		['accession = "007"'],
		[
			'registry_no = 9007199254740993',
			gain('Written bare, and safe, because the format has said in advance how much room a whole number gets.'),
			technical.gain('Integers are specified as 64-bit signed, so this survives. The specification made a decision instead of leaving it to the host language.')
		]
	]
};

const TEXT_DATE_FILE: Specimen = {
	label: 'The date, as text in an agreed pattern',
	family: 'json',
	comments: false,
	spec: 'RFC 8259 / ECMA-404',
	lines: [
		['{'],
		['  "accession": "007",'],
		[
			'  "catalogued": "1998-11-02T09:00:00Z"',
			flat('Year first, then month, then day, so sorting the text sorts the dates. The letter Z at the end is the time zone, and it is the part that gets dropped.'),
			technical.cost('No date type. Every consumer reparses this string and one of them gets the time zone wrong.')
		],
		['}']
	]
};

const NATIVE_DATE_FILE: Specimen = {
	label: 'The date, as a date',
	family: 'toml',
	comments: true,
	spec: 'TOML 1.1.0 (Dec 2025)',
	lines: [
		['accession = "007"'],
		[
			'catalogued = 1998-11-02T09:00:00Z',
			gain('No quotation marks. The file itself says this is a moment in time, with its time zone attached.'),
			technical.gain('A first-class offset date-time. TOML also separates local date-time, local date and local time, which is the distinction everybody else reimplements badly in application code.')
		]
	]
};

const LABELLED_DATE_FILE: Specimen = {
	label: 'The date, as text with a label beside it',
	family: 'turtle',
	comments: true,
	spec: 'RDF 1.1 / Turtle, W3C',
	lines: [
		['@prefix kaup: <https://example.org/kaupang/> .'],
		['@prefix crm:  <http://www.cidoc-crm.org/> .'],
		['@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .'],
		[''],
		[
			'kaup:007 crm:catalogued "1998-11-02T09:00:00Z"^^xsd:dateTime .',
			gain('The two carets join the value to its label. Everything in quotation marks is text; the label says which kind of text.'),
			technical.gain('The type hangs off the value, so the field needs no declaration. Any XSD datatype works and a new one needs no new version of the format.')
		]
	]
};

const NO_REMARKS_FILE: Specimen = {
	label: 'A file with nowhere to say why',
	family: 'json',
	comments: false,
	spec: 'RFC 8259 / ECMA-404',
	lines: [
		[
			'{',
			cost('There is nowhere in this file to write down why any of it is the way it is. No remarks are allowed.'),
			technical.cost('Nowhere to write down why any of this is set the way it is. The reasons live in a commit message nobody reads.')
		],
		['  "accession": "007",'],
		['  "weight_g": "12.50"'],
		['}']
	]
};

const JSONC_FILE: Specimen = {
	label: 'The same file with remarks added, which is called JSONC',
	family: 'json',
	comments: true,
	spec: 'none',
	lines: [
		['{'],
		[
			'  // Weight as recorded in 1998 and not re-checked since.',
			gain('The reason sits next to the value. This is the whole feature and it is worth more than it looks.')
		],
		['  "weight_g": "12.50",'],
		['  "accession": "007",'],
		[
			'  "found_in": "NO", // Norway, not the word no',
			technical.flat('Most JSONC parsers accept a trailing comma as well. No specification says they must, because there is no specification.')
		],
		[
			'}',
			cost('The file is still named as though it were ordinary JSON, and the next program to open it stops at the first remark.'),
			technical.cost('The file is still called .json and JSON.parse throws on it. Every tool downstream assumed strict JSON and was not wrong to.')
		]
	]
};

const JSON5_FILE: Specimen = {
	label: 'JSON5: the full ES5 object literal, specified properly',
	family: 'json',
	comments: true,
	spec: 'JSON5 1.0.0',
	lines: [
		['{'],
		[
			'  // Weight as recorded in 1998 and not re-checked since.',
			technical.gain('Comments, and a real specification behind them, which is what separates this from JSONC.')
		],
		[
			"  weight_g: '12.50',",
			technical.gain('Unquoted keys and single quotes. Small things, and they are most of what makes hand-edited JSON tiresome.')
		],
		["  accession: '007',"],
		["  found_in: 'NO',"],
		[
			'  case_mask: 0xFF,',
			technical.gain('Hex literals, leading-plus, .5, +Infinity and NaN all parse. The number tower matches the one your language already has.')
		],
		['  loan_limit_days: +Infinity,'],
		[
			'  registry_no: 9007199254740993,',
			technical.cost('Still a double in JavaScript. Nothing about the syntax fixes what the runtime does to the value.')
		],
		["  made_of: ['copper alloy', 'glass'],"],
		[
			'}',
			technical.cost('Parser coverage outside JavaScript is thin, so you have added a build step to a format whose selling point was needing none.')
		]
	]
};

const REMARK_FILE: Specimen = {
	label: 'A format that had remarks from the start',
	family: 'toml',
	comments: true,
	spec: 'TOML 1.1.0 (Dec 2025)',
	lines: [
		[
			'# Weights are as recorded in 1998 and have not been re-checked.',
			gain('This sentence is the entire argument for this kind of file. It is the reason behind the data, and in a year it will be the only surviving memory of why.')
		],
		['object = "Disc brooch"'],
		['accession = "007"'],
		['weight_g = "12.50"']
	]
};

const PERSON_FILE: Specimen = {
	label: 'A file meant for human hands',
	family: 'toml',
	comments: true,
	spec: 'TOML 1.1.0 (Dec 2025)',
	lines: [
		['# Weights are as recorded in 1998 and have not been re-checked.'],
		['object = "Disc brooch"'],
		['accession = "007"'],
		['found_in = "NO"'],
		['weight_g = "12.50"'],
		['registry_no = 9007199254740993'],
		['catalogued = 1998-11-02T09:00:00Z'],
		[''],
		[
			'[conservation]',
			flat("Square brackets start a named group. It reads well at this size and becomes hard work three groups deep, which is TOML's real limit."),
			technical.cost('Here is where it stops being obvious. Three levels down you are writing [[cases.viking.loans]] and repeating the prefix on every table while the reader rebuilds the tree in their head.')
		],
		['treated = "1998-11-02"'],
		[
			'by = "M. Halvorsen"',
			technical.cost('There is no null anywhere in TOML. Cleared and never-set are the same state, and a merge between a deleted line and a changed line produces no conflict at all.')
		],
		[''],
		[
			'[[loans]]',
			technical.cost('Double brackets mean array-of-tables. Nothing about the syntax tells you that, which is the one promise TOML makes about itself that it does not keep.')
		],
		['to = "Uppsala"'],
		[''],
		['[[loans]]'],
		['to = "Roskilde"']
	]
};

const ENV_FILE: Specimen = {
	label: 'The simplest possible file, and what it costs',
	family: 'env',
	comments: true,
	spec: 'none whatsoever',
	lines: [
		[
			'OBJECT=Disc brooch',
			technical.gain('Zero dependency. Every shell, container runtime and CI system already reads this, the values land in the process environment where twelve-factor wants them, and somebody with no documentation edits it correctly on the first try.')
		],
		[
			'ACCESSION=007',
			gain('Safe, by accident. Nothing in this file has a kind at all, so nothing can be turned into the wrong one.')
		],
		[
			'FOUND_IN=NO',
			technical.gain('Every value is a string because there is no other option, so Norway survives here for exactly the reason nothing structured can be expressed.')
		],
		[
			'REGISTRY_NO=9007199254740993',
			technical.flat('Survives the file and dies in your code. The parsing decision still gets made, in a place with no schema and no tests around it.')
		],
		[
			'MADE_OF=copper alloy,glass',
			cost('No lists. You have invented a separator and now you must remember it, document it and hope no material ever contains a comma.')
		],
		[
			'NOTE="Bent, and mended in antiquity. See also the pin."',
			technical.cost('Quoting, escaping and $VAR interpolation all differ between dotenv, python-dotenv and docker compose. There is no specification to appeal to, so the file means whatever your loader does.')
		],
		[
			'CONSERVATION_BY=M. Halvorsen',
			cost('No groups either. The grouping now lives in the underscore in the name, which nothing checks and nothing enforces.'),
			technical.cost('Nesting by naming convention. The tree lives in the prefix and nothing enforces it. Two keys can disagree about the shape with nothing to notice.')
		]
	]
};

const LUMP_NOTE_FILE: Specimen = {
	label: 'The note, as one lump of text',
	family: 'yaml',
	comments: true,
	spec: 'YAML 1.2.2 (and 1.1, still)',
	lines: [
		['accession: "007"'],
		['note: |'],
		['  Bent, and mended in antiquity.'],
		[
			'  See also the pin, accession 041.',
			flat('A person reads this and knows where to look next. To the machine, 041 is three characters in a long run of characters.')
		]
	]
};

const MARKED_NOTE_FILE: Specimen = {
	label: 'The note, with the link marked where it falls',
	family: 'xml',
	comments: true,
	spec: 'XML 1.0 5th ed.',
	lines: [
		['<object accession="007">'],
		['  <note>'],
		['    Bent, and mended in antiquity.'],
		[
			'    See also the <ref acc="041">pin</ref>.',
			gain('The sentence is still a sentence, in the order the curator wrote it. The mention of the pin is a link a machine can follow.'),
			technical.gain('Text with markup inside it, in order. This is the thing nothing else on this page can represent without inventing a convention, and it is why DOCX, EPUB, SVG and HTML are all XML-shaped.')
		],
		['  </note>'],
		['</object>']
	]
};

const SPLIT_NOTE_FILE: Specimen = {
	label: 'The note, with the link pulled out',
	family: 'json',
	comments: false,
	spec: 'RFC 8259 / ECMA-404',
	lines: [
		['{'],
		['  "accession": "007",'],
		['  "note": "Bent, and mended in antiquity. See also the pin.",'],
		[
			'  "related_to": ["041"]',
			flat('The machine can follow this. It no longer knows which sentence the link belonged to, or that it belonged to a sentence at all.')
		],
		['}']
	]
};

const FOLDER_LISTING: Specimen = {
	label: 'Four hundred thousand of these',
	family: 'plain',
	lines: [
		['objects/007.json'],
		['objects/041.json'],
		[
			'objects/042.json',
			flat('Each file stands alone. Asking which objects came from Norway means opening every one of them.')
		],
		['...']
	]
};

const CSV_FILE: Specimen = {
	label: 'Four hundred thousand objects, one line each',
	family: 'csv',
	comments: false,
	spec: 'RFC 4180, widely ignored',
	lines: [
		[
			'accession,object,found_in,weight_g,registry_no',
			gain('This opens in any spreadsheet, any database, anything at all. Nothing else on this page is that portable, and portability is most of what an archive needs.'),
			technical.gain('This loads into any database, spreadsheet or dataframe with one command, and it streams while it does it.')
		],
		[
			'007,Disc brooch,NO,12.50,9007199254740993',
			cost('Open this in a spreadsheet and watch it decide what your columns mean. 007 becomes 7. This is not hypothetical: human gene names were formally changed in 2020 because spreadsheets kept turning them into dates.'),
			technical.flat('No types at all, so nothing in the format converts NO to anything. Every field is a string until your code decides otherwise, which is at least honest about where the decision lives.')
		],
		['041,Pin,NO,3.10,9007199254740994'],
		[
			'042,Bead,SE,0.80,9007199254740995',
			flat("Notice what is missing. The curator's note cannot be here, because it has two lines in it and this format is built on the idea that one line is one object."),
			technical.cost('A quoted field may contain newlines, so one-record-per-line is false and every hand-rolled parser that splits on \\n is broken. A list inside a field has to become a string with a delimiter you invented and now have to document.')
		]
	]
};

const NDJSON_FILE: Specimen = {
	label: 'One object per line, so the file can be added to for ever',
	family: 'json',
	comments: false,
	spec: 'convention',
	lines: [
		[
			'{"accession":"007","object":"Disc brooch","found_in":"NO"}',
			gain('Adding an object means adding a line. Nothing has to be opened, re-written and closed. A power cut costs you one object and leaves the catalogue standing.'),
			technical.gain('Append a record by appending a line. tail -f works, a stream has no closing bracket to wait for, and a truncated write costs one record rather than the file.')
		],
		['{"accession":"041","object":"Pin","found_in":"NO"}'],
		[
			'{"accession":"042","object":"Bead","found_in":"SE"}',
			cost("This is no longer one document. Anything expecting a single properly closed file will refuse it, and the rule that makes it work lives in your team's memory and in no standard."),
			technical.cost('This is not a JSON document, so nothing expecting one will read it. You swapped a container the format guarantees for a convention your team has to remember.')
		]
	]
};

const CHANGE_LOG_FILE: Specimen = {
	label: 'Nothing altered, one line added',
	family: 'json',
	comments: false,
	spec: 'convention',
	lines: [
		['{"accession":"007","weight_g":"12.50","at":"1998-11-02"}'],
		[
			'{"accession":"007","weight_g":"12.48","at":"2026-10-14"}',
			gain('The old weight is still there, with its date. The catalogue can now answer a question about what it used to say.'),
			cost('The current weight is written nowhere. It is whatever the last line about the weight says.')
		]
	]
};

const UPDATE_STATEMENT: Specimen = {
	label: 'The whole of the change',
	family: 'plain',
	lines: [
		[
			"UPDATE objects SET weight_g = '12.48' WHERE accession = '007';",
			gain('One fact changes and nothing around it is rewritten. If the power goes halfway, the file holds either the old weight or the new one, and never half of each.')
		]
	]
};

const TURTLE_FILE: Specimen = {
	label: 'Written so a stranger can join it to theirs',
	family: 'turtle',
	comments: true,
	spec: 'RDF 1.1 / Turtle, W3C',
	lines: [
		[
			'@prefix kaup: <https://example.org/kaupang/> .',
			gain('Every name here is a web address in short form. That means the museum in Uppsala can make statements about your brooch without either of you agreeing anything in advance.'),
			technical.gain("Every name here is a URI wearing a short form. crm:found_in is globally unique, so a stranger's file can make statements about kaup:007 without either of you agreeing a schema first. That is the entire argument and nothing else on this page offers it.")
		],
		[
			'@prefix crm:  <http://www.cidoc-crm.org/> .',
			flat('That second one is real. CIDOC-CRM is a shared vocabulary for cultural objects, agreed between museums. It exists precisely because everybody kept inventing their own column names.')
		],
		[''],
		[
			'kaup:007 a crm:ManMadeObject ;',
			technical.cost('Anything you do not give a URI becomes a blank node, which has no stable identifier and may come back renamed after a round trip. Modelling around blank nodes is most of the practical work.')
		],
		['    crm:name       "Disc brooch" ;'],
		[
			'    crm:found_in   "NO" ;',
			technical.cost('Absence means nothing. No triple says this brooch has no owner, so an empty result cannot distinguish unknown from untrue, and every closed-world check your application needs gets written by hand.')
		],
		[
			'    crm:made_of    "copper alloy", "glass" ;',
			technical.cost('No list type. A repeated predicate is the idiom and order is not preserved. If order matters you need rdf:List, a linked list of blank nodes, which is unpleasant enough that people encode arrays as JSON strings instead.')
		],
		[
			'    crm:related_to kaup:041 .',
			gain('That last line is a link that means something. In every other file on this page, 041 was a number your program had to know how to follow. Here it is a named thing, and the name works outside the file.'),
			technical.gain('A foreign key is a number your application interprets; this is a predicate with a definition anybody can dereference, pointing at a subject whose identity survives leaving the file.')
		],
		[''],
		[
			'kaup:041 crm:name "Pin" .',
			cost('And here is the bill. Everything must be given a web address before it can be talked about, the query language is a separate thing to learn, and the benefit only arrives if somebody else does all of this too. You pay first, alone.'),
			technical.gain('A second subject, and the file has no container to close. Merging two documents is set union, which is why the same trick works across the whole web and why schema.org and Wikidata are possible.')
		]
	]
};

const JSON_LD_FILE: Specimen = {
	label: 'An ordinary file, with one line saying where its names come from',
	family: 'json',
	comments: false,
	spec: 'JSON-LD 1.1, W3C',
	lines: [
		['{'],
		[
			'  "@context": "https://example.org/kaupang/context.json",',
			gain('The one extra line. A program that does not care ignores it and reads the rest as ordinary JSON.')
		],
		['  "@id": "kaup:007",'],
		['  "name": "Disc brooch",'],
		[
			'  "found_in": "NO"',
			flat("Still in quotation marks, still Norway. The context says that your found_in and Uppsala's findspot are the same idea.")
		],
		['}']
	]
};

/* ============================================================
   THE DECISIONS
   Answers are written per branch, so nothing tells the reader
   about a problem they avoided.
   ============================================================ */

export const GATES: Gate[] = [
	{
		id: 'marker',
		heading: 'One object, and everything that can go wrong with it.',
		lead: [],
		text: 'You have to write this down in a file a machine can read back later. The first thing to settle is the dullest and it decides everything after it: how does the file show where one fact stops and the next begins?',
		options: [
			{ key: 'punctuation', label: 'Fence every fact with punctuation, so the boundaries are visible characters.' },
			{ key: 'position', label: 'Give every fact its own line, and use how far it is indented to show what belongs to what.' },
			{ key: 'tags', label: 'Write a name at the start of every fact and the same name again at the end.' }
		],
		answers: {
			punctuation: {
				verdict: 'The strictest of the three, and the one everything else now speaks.',
				paragraphs: [
					'Nothing depends on where anything sits on the page. You could put the whole record on one line and a machine would read it identically, which is precisely why this style became the one computers use to talk to each other.',
					'It has one flat refusal, and it is worse than it sounds: there is no way to write a remark. Not one. Every explanation of why a value is what it is has to live somewhere else, and somewhere else is usually nowhere.'
				],
				specimen: JSON_FILE,
				finePrint: [
					{ summary: 'The full case for and against JSON', docket: docket('JSON') },
					{ summary: 'One input where two JSON readers disagree', cards: [card('{"a": 1, "a": 2}')] }
				]
			},
			position: {
				verdict: 'The kindest to read, and the one that punishes a stray space.',
				paragraphs: [
					'This is the most comfortable of the three for a person, and it is not close. Remarks are allowed, long passages of prose survive intact and the shape of the file matches the shape of the thing.',
					'The bill arrives elsewhere. Because meaning is carried by how far a line is indented, an accidental space changes what the file says, and it changes it silently. There is no error, just a different answer.'
				],
				specimen: YAML_FILE,
				finePrint: [{ summary: 'The full case for and against YAML', docket: docket('YAML') }]
			},
			tags: {
				verdict: 'The heaviest, and the only one that can hold a sentence with structure inside it.',
				paragraphs: [
					'Naming both ends looks like pure waste until you need to mark something up in the middle of a paragraph. Every other approach on this page has to give up and treat prose as one lump; this one does not.',
					'You pay for that on every single line, for ever, in characters nobody reads.'
				],
				specimen: XML_FILE,
				finePrint: [{ summary: 'The full case for and against XML', docket: docket('XML') }]
			}
		}
	},
	{
		id: 'typing',
		heading: 'The two letters that are not a country.',
		lead: [
			'You have somewhere to put the facts now. What you have not settled is what any of them are. The letters NO are sitting in your file, and something has to decide, when the file is read back, whether they are a country or an answer.'
		],
		leadByMarker: {
			position: 'This matters more for what you chose than for the alternatives, and it is worth saying plainly before you find out the hard way. The style you picked is the one where values are written bare, without fences around them, so working out what they are is done by looking at them.',
			tags: 'What you chose has an unusual position here. Naming both ends tells a machine where a value stops, and tells it nothing whatever about what the value is. Everything in an XML file is text until something separate says otherwise.',
			punctuation: 'What you chose already helps, and not as much as it looks. Fencing a value in quotation marks does mark it as words. But nothing forces you to use the quotes, and a number written without them is a number.'
		},
		text: 'Your file now contains the two letters NO, standing for Norway. When a machine reads that back, how does it know those two letters are the name of a country and not the word no?',
		options: [
			{ key: 'guess', label: 'It works it out from what the value looks like.' },
			{ key: 'quoted', label: 'Anything in quotation marks is words, always. I will quote everything.' },
			{ key: 'declared', label: 'A separate set of rules says what kind of thing each field holds.' }
		],
		answers: {
			guess: {
				verdict: 'Then Norway is gone.',
				paragraphs: [
					'In the most widely used format that does this, the bare letters NO are one of the ways of writing the word no. So are Y, N, yes, on and off. Your country becomes a false, silently, with no error anywhere.',
					"The same rule eats the rest of the record. The accession number 007 becomes the number 7, and a catalogue search for 007 finds nothing. The weight 12.50 becomes 12.5, and the final zero was not decoration: it was the curator's claim about how precisely the thing had been weighed. That claim is now unrecoverable."
				],
				specimen: GUESSED_FILE,
				finePrint: [
					{
						summary: "The same failures in a server's deploy file, where they were first noticed",
						cards: [card('region: NO'), card('version: 1.20'), card('threshold: 1e2'), card('restart: 22:22')]
					}
				]
			},
			quoted: {
				verdict: 'Correct, and it costs you something you may not have noticed.',
				paragraphs: [
					'Quotation marks are the one habit that makes these formats behave. A quoted value has nowhere else to go, so Norway stays Norway, 007 stays three characters and 12.50 keeps its zero.',
					'But look at what quoting the weight did. It is now a piece of text. Nothing can add it up, sort by it or check it is a plausible weight for a brooch, because you protected its appearance by giving up its meaning. There are formats that let you keep both, and they are the ones that treat kinds as a matter in their own right.'
				],
				specimen: QUOTED_FILE
			},
			declared: {
				verdict: 'The most work, and the only one that can catch a mistake before it spreads.',
				paragraphs: [
					'A separate set of rules is a strange thing to write. It is a document about a document. But it is the only arrangement here where a machine can refuse a bad file at the door rather than crashing three weeks later in something unrelated.',
					'It also lets you say things no amount of punctuation can: that the weight has two decimal places, that it must be positive and that every object must have exactly one.'
				],
				specimen: DECLARED_FILE,
				finePrint: [
					{
						summary: 'When the rules and the data become one language',
						minorFormats: [minorFormat('HCL / Jsonnet / CUE / Dhall')]
					}
				]
			}
		}
	},
	{
		id: 'numbers',
		heading: 'Sixteen digits.',
		lead: [
			'Some numbers are quantities and some are names. The weight is a quantity: it can be averaged, compared and added to other weights. The registry number is a name that happens to be spelled in digits.'
		],
		text: 'The national registry gave this brooch the number 9007199254740993. It is sixteen digits long and nobody will ever add it to anything. It has to come back out of the file exactly as it went in. How do you write it down?',
		options: [
			{ key: 'bare', label: 'As a number, because it is one.' },
			{ key: 'text', label: 'In quotation marks, as text that happens to be made of digits.' },
			{ key: 'sized', label: 'In a format that states how large a number it promises to keep.' }
		],
		answers: {
			bare: {
				verdict: 'Then the last digit is wrong.',
				paragraphs: [
					'Most programs keep a number in a fixed amount of space, and that space is exact only as far as 9007199254740992. Yours is one past the edge. It goes in ending in 3 and comes back ending in 2, which is the registry number of a different object.',
					'The file is fine. Open it in a text editor and the right digits are there. The damage happens at the moment of reading, inside whichever program does the reading, and a different program may well get it right. Neither of them reports an error.'
				],
				specimen: BARE_NUMBER_FILE,
				finePrint: [{ summary: 'What the reader hands back, and why', cards: [card('9007199254740993')] }]
			},
			text: {
				verdict: 'Correct, for a number nobody will do sums with.',
				paragraphs: [
					'In quotation marks the sixteen digits are sixteen characters, and characters get copied, never rounded. This is the standard advice and it is right: an identifier is a name, and names belong in quotes. Accession 007 made the same point from the other end.',
					'The cost is that the file no longer says what the thing is. Sorted as text, 10 comes before 9. Nothing stops somebody typing a letter O into it. You have made the value safe by telling the machine less about it.'
				],
				specimen: TEXT_NUMBER_FILE,
				finePrint: [
					{
						summary: 'The formats that do this to every value',
						paragraphs: [
							'In .env and CSV everything is text, so the registry number survives the file and dies in your code. The parsing decision still gets made, in a place with no schema and no tests around it.'
						]
					}
				]
			},
			sized: {
				verdict: 'The rarest answer, and the only one where the file keeps its own promise.',
				paragraphs: [
					'A few formats say in their rules how big a whole number may be. TOML promises sixty-four bits, which is room for nineteen digits, so your sixteen go in and come out unchanged in every program that follows the rules. The people who wrote the format made the decision once, and no reader gets to make it again.',
					"Most formats decline to say. JSON's rules allow a number of any length and leave each reading program to cope as best it can, which is how a correct file produces a wrong number."
				],
				specimen: SIZED_NUMBER_FILE,
				finePrint: [
					{
						summary: 'Where the promise gets broken anyway',
						paragraphs: [
							'YAML integers are arbitrary precision on paper. In a JavaScript runtime you get a double and lose the last digit anyway.',
							'JSON5 has the same trouble: still a double in JavaScript. Nothing about the syntax fixes what the runtime does to the value.'
						]
					}
				]
			}
		}
	},
	{
		id: 'dates',
		heading: 'Nine in the morning.',
		lead: [
			'A date looks like the easy one. It is a handful of digits with some punctuation between them, and anybody can read it.'
		],
		text: 'The brooch was catalogued at nine in the morning on 2 November 1998. One day somebody will sort the whole catalogue by that moment. What goes in the file?',
		options: [
			{ key: 'pattern', label: 'The date as text, in a pattern everybody agrees to follow.' },
			{ key: 'native', label: 'The date as a date, in a format that knows what one is.' },
			{ key: 'labelled', label: 'The date as text, with a label beside it saying that it is a date.' }
		],
		answers: {
			pattern: {
				verdict: 'What nearly everybody does, and it hands the work to every reader.',
				paragraphs: [
					'The pattern is called ISO 8601 and it is a good one: year first, so that sorting the text sorts the dates. Written that way your catalogue sorts correctly without any program knowing what a date is.',
					'But the file holds text, so each program that wants a date has to make one out of the text for itself. Each does it slightly differently, and the usual casualty is the time zone: one reader takes nine in the morning as London time and another as its own, and two copies of the catalogue disagree by an hour.'
				],
				specimen: TEXT_DATE_FILE
			},
			native: {
				verdict: 'Then check which format, because only one of them means it.',
				paragraphs: [
					'TOML knows what a date is, and it knows there are four kinds: a moment with a time zone, a moment without one, a day on its own and a time of day on its own. Most formats leave that distinction to each program, and each program gets it slightly wrong in its own way. Here the file says which one it holds.',
					'YAML also recognises dates, some of the time. The older version of its rules turns anything date-shaped into a date without being asked; the newer version leaves it as text. Which you get depends on the program reading the file, so the same line is a date on one machine and a sentence on another.'
				],
				specimen: NATIVE_DATE_FILE,
				finePrint: [
					{
						summary: 'What YAML does with the same line',
						paragraphs: [
							'catalogued: 1998-11-02T09:00:00Z is a timestamp under YAML 1.1 and a plain string under the 1.2 core schema. Which you get depends on the library, not on the file.'
						]
					}
				]
			},
			labelled: {
				verdict: 'The most general answer, and the wordiest.',
				paragraphs: [
					'The value stays as text and a label travels with it saying what kind of text it is. Turtle writes the label after the value; XML puts it in the opening name. A checker can then refuse a brooch catalogued on the thirty-first of February before anything else sees it.',
					'The label can be anything anybody has defined, so a new kind of value never needs a new version of the format. You pay for that in length, on every value, for ever.'
				],
				specimen: LABELLED_DATE_FILE,
				finePrint: [
					{
						summary: 'The same idea in XML',
						paragraphs: [
							'<catalogued>1998-11-02T09:00:00Z</catalogued> is a string until a schema says xs:dateTime. Add an XSD and the parser enforces types, ranges, enumerations and cardinality, which is more than any other format here offers.'
						]
					}
				]
			}
		}
	},
	{
		id: 'reasons',
		heading: 'Why is it 12.50?',
		lead: [
			'Every file so far has held facts about the brooch. Some of what a museum knows is about the record: who weighed the thing, when they did it and whether anybody has checked since.'
		],
		text: 'The weight was recorded in 1998 and has never been re-checked. Whoever opens this file in ten years needs to know that, and the record has no field for it. Where does it go?',
		options: [
			{ key: 'nowhere', label: 'Nowhere in the file. The file holds the data and the explanation lives in the handbook.' },
			{ key: 'added', label: 'In the file, as a remark the machine is told to skip, added on to the format you already have.' },
			{ key: 'native', label: 'In the file, in a format that had remarks from the start.' }
		],
		answers: {
			nowhere: {
				verdict: 'Tidy, and the explanation will be the first thing lost.',
				paragraphs: [
					"This is JSON's position and it was taken on purpose. A file that holds only data can be read by anything, and a remark is one more thing for two programs to disagree about.",
					'The handbook is a separate document with a separate life. It gets reorganised, the person who wrote it leaves and the link to it breaks. In ten years the file will still say 12.50, and nothing anywhere will say that nobody has checked it since 1998.'
				],
				specimen: NO_REMARKS_FILE
			},
			added: {
				verdict: 'It works, and the file is now written in a dialect.',
				paragraphs: [
					'Two dialects of JSON allow remarks. JSONC adds them and little else; the settings files of several code editors have run on it for years. JSON5 goes further and lets you drop most of the quotation marks as well.',
					'Neither is JSON. The file is still named as though it were, and the next program along was written for the strict version and stops at your first remark. It is entitled to.'
				],
				specimen: JSONC_FILE,
				finePrint: [
					{ summary: 'The other dialect: JSON5', specimen: JSON5_FILE },
					{ summary: 'The full case for and against JSONC and JSON5', docket: docket('JSONC / JSON5') },
					{
						summary: 'The remark that earns its keep in a deploy file',
						paragraphs: [
							'"port": 8080, // 80 needs root. Six words, and they save the next person an afternoon of wondering why the obvious port was not used.'
						]
					}
				]
			},
			native: {
				verdict: 'Then the remark is part of the file and travels with it.',
				paragraphs: [
					'YAML, TOML and XML were all built with somewhere to write a remark, so no program downstream is surprised by one. The sentence about the weight sits on the line above the weight, and whoever changes the figure sees the warning as they do it.',
					'A remark is still invisible to the machine. Nothing checks that it is true, and a remark that has gone out of date does more harm than a missing one, because people believe it.'
				],
				specimen: REMARK_FILE
			}
		}
	},
	{
		id: 'who',
		heading: 'Two in the morning.',
		lead: [
			'Every argument about these formats is really two arguments having a fight in one room, and the reason they never resolve is that the people are describing different jobs.',
			'A file a person types by hand at speed and a file a machine sends to another machine want opposite things. Space costs nothing in one and matters in the other. An explanation of why is the most valuable line in one file and pure waste in the other.'
		],
		text: 'Somebody has to open this file at two in the morning when the catalogue will not load. Who is it?',
		options: [
			{ key: 'person', label: 'A person, in a text editor, under pressure.' },
			{ key: 'machine', label: 'Nobody. A program writes it and a program reads it.' },
			{ key: 'nearest', label: 'Whoever happens to be nearest, with no training and no manual.' }
		],
		answers: {
			person: {
				verdict: 'Then remarks stop being a nicety.',
				paragraphs: [
					'A file a person maintains needs three things that a file for machines does not: somewhere to write down why, a shape that survives being edited by hand at speed and kinds that cannot surprise you.',
					'One format was built for exactly this and nothing else, and it is the one Rust and Python both settled on for their project files. Its weakness is depth: three groups down it becomes hard work, and people do abandon it over that.'
				],
				specimen: PERSON_FILE,
				finePrint: [
					{ summary: 'The full case for and against TOML', docket: docket('TOML') },
					{ summary: 'What TOML cannot say at all', cards: [card('expires = null')] }
				]
			},
			machine: {
				verdict: 'Then most of the argument evaporates, and a different one starts.',
				paragraphs: [
					'If no human ever opens it, remarks are dead weight, readability is worth nothing and you should be asking about size, speed and what happens when one end is updated before the other.',
					'That is a real question with real answers, and the honest ones are not text files at all. They are formats where the meaning of the bytes lives in a separate agreed document, so the file itself is unreadable and very small. You give up being able to look at it, which sounds trivial until two in the morning arrives after all.'
				],
				finePrint: [
					{
						summary: 'The formats built for this, and what they cost',
						minorFormats: [minorFormat("Protobuf / Avro / Cap'n Proto"), minorFormat('CBOR / MessagePack')]
					}
				]
			},
			nearest: {
				verdict: 'Then the file has to be impossible to get wrong, and only one kind is.',
				paragraphs: [
					'The simplest file there is has a name, an equals sign and a value on each line. Every system already reads it, and a person who has never seen one before edits it correctly on the first try. For a dozen settings nothing else comes close.',
					'It buys that by having no rules. There are no kinds, no lists and no groups, so the moment your dozen settings need any of those you are inventing them yourself, in the names, where nothing checks them.'
				],
				specimen: ENV_FILE,
				finePrint: [
					{ summary: 'The case for and against the floor', minorFormats: [minorFormat('.env'), minorFormat('INI')] },
					{ summary: 'One line, and three loaders that read it differently', cards: [card('NOTES="a b" # c')] }
				]
			}
		}
	},
	{
		id: 'shape',
		heading: 'A sentence with something inside it.',
		lead: [
			'Every fact so far has been a value: a word, a number, a date, a list. The note is different. It is prose, written by a person for a person. One phrase in it points at another object in the collection.'
		],
		text: "The curator's note says: see also the pin, accession 041. That mention sits in the middle of a sentence, and it is also a link to another object. What is the note?",
		options: [
			{ key: 'lump', label: 'One lump of text. People will read it and machines will leave it alone.' },
			{ key: 'markup', label: 'Text with the link marked up inside the sentence, where it falls.' },
			{ key: 'split', label: 'Two things: the prose in one field and the link pulled out into another.' }
		],
		answers: {
			lump: {
				verdict: 'What almost every record does, and the link is now only a rumour.',
				paragraphs: [
					'The note goes in as text and comes out as text, and a visitor reading the catalogue sees exactly what the curator wrote. For most notes that is all anybody wants.',
					'The machine sees a run of letters. It cannot list the objects this brooch refers to, and when the pin is renumbered nothing will update the sentence. The connection exists for readers and for nobody else.'
				],
				specimen: LUMP_NOTE_FILE
			},
			markup: {
				verdict: 'The only way to keep both, and one family of formats can do it.',
				paragraphs: [
					"Marking something up in the middle of a paragraph needs a name at the start of the marked part and the same name again at the end, which is XML's whole manner. The sentence stays a sentence with its words in order, and the mention of the pin becomes a link a machine can follow.",
					'Every word processor file, every e-book and every web page is built this way for that reason. If what you are storing is a document, this is the answer. The weight of all those closing names is the fare.'
				],
				specimen: MARKED_NOTE_FILE,
				finePrint: [
					{ summary: 'The choice XML never makes for you', cards: [card('<a b="1"/>  vs  <a><b>1</b></a>')] },
					{
						summary: 'What else the door lets in',
						paragraphs: [
							'Entity expansion and external entity resolution are still enabled in enough parsers that billion laughs and XXE remain live in 2026. Both are worth writing tests for.'
						]
					},
					{ summary: "XML's shape in a syntax people will type", minorFormats: [minorFormat('KDL / EDN / S-expressions')] }
				]
			},
			split: {
				verdict: 'A fair trade, and the sentence no longer knows where its link was.',
				paragraphs: [
					'The prose goes in one field and the reference in another: related_to, 041. The machine can now follow the link, count the links and fix them when the pin is renumbered.',
					'What has gone is the position. The record says the brooch is related to the pin; the curator said see also the pin, at a particular point in a particular thought. With one link nobody will mind. A catalogue essay with forty of them falls apart.'
				],
				specimen: SPLIT_NOTE_FILE
			}
		}
	},
	{
		id: 'many',
		heading: 'Four hundred thousand of them.',
		lead: [
			'Everything so far has assumed one object. Quantity is not a bigger version of the same problem; past a certain size it is a different problem, and the format that was right for one is usually wrong.'
		],
		text: 'So far there is one brooch. The museum has four hundred thousand objects and adds a few every week.',
		options: [
			{ key: 'one', label: 'Keep them as they are: one file for each object.' },
			{ key: 'csv', label: 'One line for each object, with commas between the columns.' },
			{ key: 'ndjson', label: 'One line for each object, each line fenced the way the single record was.' }
		],
		answers: {
			one: {
				verdict: 'Reasonable, and it holds until somebody asks a question about all of them at once.',
				paragraphs: [
					'Four hundred thousand small files is fine to store and miserable to ask questions of. Every question means opening every file.',
					'It does keep one good property. Each file stands alone, so a damaged one costs you one object. Two people can work on two objects without ever touching the same file.'
				],
				specimen: FOLDER_LISTING
			},
			csv: {
				verdict: 'The oldest answer, and the one that goes anywhere.',
				paragraphs: [
					'One line per object, commas between the columns. It goes into any spreadsheet or database in the world, which no other format on this page can claim.',
					'It also has no kinds whatsoever, which is how the accession number 007 became 7 and how, in 2020, geneticists gave up and renamed human genes because the spreadsheets would not stop turning them into dates.'
				],
				specimen: CSV_FILE,
				finePrint: [
					{ summary: 'What the spreadsheet did to the gene', cards: [card('SEPT2')] },
					{ summary: 'When the questions are about columns', minorFormats: [minorFormat('Parquet / Arrow')] }
				]
			},
			ndjson: {
				verdict: 'Then the file can be added to for ever, and something has to be given up.',
				paragraphs: [
					'Put one object on each line and the file can be added to for ever, read a line at a time and survive being cut off mid-write. That is the whole trick, and it is why almost every system that records events uses it.',
					'What you give up is the single, properly closed document. The file as a whole is no longer valid JSON; only each line is.'
				],
				specimen: NDJSON_FILE
			}
		}
	},
	{
		id: 'change',
		heading: '12.48.',
		lead: [
			'Everything so far has treated the file as something written once. Museums do not work like that. Objects get weighed again, dated again and moved to another case.'
		],
		text: 'Next month a conservator weighs the brooch again and the figure becomes 12.48 g. One fact has changed, in one record out of four hundred thousand. What happens to the file?',
		options: [
			{ key: 'rewrite', label: 'It is written out again, whole, with the new figure in it.' },
			{ key: 'append', label: 'A new line goes on the end saying what changed, and the old line stays where it was.' },
			{ key: 'inplace', label: 'The one fact is changed in place, by something built to do that safely.' }
		],
		answers: {
			rewrite: {
				verdict: 'What every text format does, whether you chose it or not.',
				paragraphs: [
					'A text file has no way to alter its own middle. To change one figure a program reads the whole thing, changes the figure in memory and writes the whole thing back out. With one brooch in one file that is instant and nobody thinks about it.',
					'With four hundred thousand in one file it is a long write, and for as long as it lasts the only copy of the catalogue is half finished. A power cut in that window leaves a file that stops in the middle of an object.'
				],
				finePrint: [
					{
						summary: 'What the change looks like to whoever reviews it',
						paragraphs: [
							'JSON has no trailing comma, so adding a field touches two lines and git blames the wrong one. A long note with escaped newlines is one enormous line, and any change to it shows up as the whole line replaced.'
						]
					}
				]
			},
			append: {
				verdict: 'You have started keeping history, which is a bigger decision than it looked.',
				paragraphs: [
					'Nothing is ever altered, so nothing can be half altered. A power cut costs you the line being written and leaves every earlier line intact. The old weight is still there with its date, and a question about what the catalogue said in 1999 has an answer.',
					'The current weight is no longer written anywhere. It is whatever the last line about the weight says, so reading one brooch means reading its whole past, and the file only ever grows.'
				],
				specimen: CHANGE_LOG_FILE
			},
			inplace: {
				verdict: 'Then it has stopped being a text file.',
				paragraphs: [
					'A small database in a single file does the one thing every format on this page refuses: it lets you change one fact without rewriting everything around it, safely, even if the power goes off halfway. The national libraries treat it as an archival format for exactly this reason.',
					'You give up reading it. Nobody can open it in a text editor, compare two versions by eye or review a change before it is accepted. And because it looks like an ordinary file, it gets copied to places no database would have been allowed.'
				],
				specimen: UPDATE_STATEMENT,
				finePrint: [{ summary: 'The case for and against SQLite', minorFormats: [minorFormat('SQLite')] }]
			}
		}
	},
	{
		id: 'reach',
		heading: 'Somebody you will never meet.',
		lead: [
			'There is one more thing a format can decide, and it is the one people notice last. So far, everything has assumed that whoever reads this file has spoken to whoever wrote it, or can.'
		],
		text: 'A museum in Uppsala has objects from the same excavation, catalogued for thirty years in their own system. They would like to join their records to yours.',
		options: [
			{ key: 'us', label: 'Send them a copy and let them work out how it maps onto theirs.' },
			{ key: 'shared', label: 'Keep the file ordinary, and take its field names from a list both museums already use.' },
			{ key: 'anyone', label: 'Write the file so the joining does not need a conversation at all.' }
		],
		answers: {
			us: {
				verdict: 'Which is what almost everybody does, and it is a defensible answer.',
				paragraphs: [
					'Somebody at one end writes a translation between the two systems. It takes a fortnight and it works. It then has to be maintained by a person who understands both catalogues, for ever.',
					'That cost is real but it is bounded, and it is paid by someone who is already there. The other two answers are not obviously better; they are differently expensive.'
				]
			},
			shared: {
				verdict: 'The version of this idea that actually caught on.',
				paragraphs: [
					"JSON-LD is ordinary JSON with one extra line saying where the field names come from. Programs that do not care ignore the line and read the file as before. Programs that do care can look the names up and learn that your found_in and Uppsala's findspot are the same idea.",
					'The structured information behind search results is written this way. It gets you most of the merging for very little of the cost, and it stops short of the part where every object needs a web address of its own.'
				],
				specimen: JSON_LD_FILE
			},
			anyone: {
				verdict: 'Then names have to survive leaving the file.',
				paragraphs: [
					'The move is to stop writing records and start writing statements. Every fact becomes three parts: a thing, a property and a value. The thing and the property are both named with web addresses, where before they were words you chose.',
					'Two files written by strangers can then be merged by simply putting them together, with no translation between them. This is how Wikidata is possible at all.'
				],
				specimen: TURTLE_FILE,
				finePrint: [
					{ summary: 'The full case for and against RDF', docket: docket('RDF / Turtle / JSON-LD') },
					{ summary: 'The thing you forgot to name', cards: [card('_:b1 svc:port 8080 .')] }
				]
			}
		}
	}
];

export const GATE_ORDER: GateId[] = GATES.map((gate) => gate.id);

/** Every specimen on the page, for tests. */
export function allSpecimens(): Specimen[] {
	const specimens: Specimen[] = [DEPLOY_FILE];
	for (const gate of GATES) {
		for (const answer of Object.values(gate.answers)) {
			if (answer.specimen) specimens.push(answer.specimen);
			for (const item of answer.finePrint ?? []) {
				if (item.specimen) specimens.push(item.specimen);
			}
		}
	}
	return specimens;
}
