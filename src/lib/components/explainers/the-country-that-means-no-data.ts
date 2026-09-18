import type { SpecimenLine, TokenRule } from './formats/tokenise';

export type GateId = 'marker' | 'typing' | 'who' | 'many' | 'reach';

export interface Specimen {
	family: string;
	label: string;
	lines: SpecimenLine[];
}

export interface Gate {
	text: string;
	options: { key: string; label: string }[];
}

export interface Answer {
	verdict: string;
	paragraphs: string[];
	file: string | null;
}

/** The order the decisions are met in; changing one clears every later one. */
export const GATE_ORDER: GateId[] = ['marker', 'typing', 'who', 'many', 'reach'];

/** One object, carried through every movement. */

export const RECORD: [string, string][] = [
	["Object",     "Disc brooch"],
	["Accession",  "007"],
	["Found in",   "NO"],
	["Year found", "1998"],
	["Weight",     "12.50 g"],
	["Made of",    "copper alloy, glass"],
	["Note",       "Bent, and mended in antiquity.\nSee also the pin, accession 041."]
];

export const FILES: Record<string, Specimen> = {
	punctuation: { family:"json", label:"What you have just invented is called JSON", lines:[
		["{"],
		['  "object": "Disc brooch",', "gain", "Every fact is fenced off by punctuation, so a computer never has to guess where one ends. This is why the style won."],
		['  "accession": "007",'],
		['  "found_in": "NO",'],
		['  "year_found": 1998,'],
		['  "weight_g": 12.50,'],
		['  "made_of": ["copper alloy", "glass"],'],
		['  "note": "Bent, and mended in antiquity.\\nSee also the pin, accession 041."', "cost", "The curator's two lines have become one. The break between them is now written \\n, a code standing in for a thing the file can no longer contain."],
		["}", "cost", "There is nowhere in this file to write down why any of it is the way it is. No remarks are allowed."]
	]},
	position: { family:"yaml", label:"What you have just invented is called YAML", lines:[
		["# Kaupang, 1998 season", "gain", "Remarks are allowed, and they are worth more than they look. The reason a value is what it is can sit beside the value."],
		["object: Disc brooch"],
		["accession: 007"],
		["found_in: NO"],
		["year_found: 1998"],
		["weight_g: 12.50"],
		["made_of:"],
		["  - copper alloy"],
		["  - glass"],
		["note: |"],
		["  Bent, and mended in antiquity."],
		["  See also the pin, accession 041.", "gain", "The upright bar on the line above means: what follows is exactly as typed. The curator's two lines survive as two lines, with no codes standing in for anything."]
	]},
	tags: { family:"xml", label:"What you have just invented is called XML", lines:[
		["<!-- Kaupang, 1998 season -->"],
		['<object accession="007" found_in="NO">', "cost", "Notice that two facts became attributes tucked inside the opening name, and the rest below became things in their own right. Nothing in the format tells you which is correct, so two museums will make opposite choices and never be able to swap files."],
		["  <name>Disc brooch</name>"],
		["  <year_found>1998</year_found>"],
		["  <weight_g>12.50</weight_g>"],
		["  <made_of>"],
		["    <material>copper alloy</material>"],
		["    <material>glass</material>"],
		["  </made_of>", "cost", "A list of two costs four extra lines. Every closing name is repeated. That weight is the standing complaint, and it is a fair one."],
		["  <note>Bent, and mended in antiquity. See also the <ref acc=\"041\">pin</ref>.</note>", "gain", "Look at that carefully. The mention of the pin is marked up inside the sentence, in its proper place in the prose. Nothing else on this page can hold prose with structure inside it, which is why every word processor and every e-book is XML underneath."],
		["</object>"]
	]},
	quoted: { family:"toml", label:"Quoting everything, which is what TOML insists on", lines:[
		["# Kaupang, 1998 season"],
		['object = "Disc brooch"'],
		['accession = "007"', "gain", "In quotes, so it stays three characters. Nothing can turn it into the number seven, because a quoted thing has nowhere else to go."],
		['found_in = "NO"', "gain", "Norway survives, by design rather than by luck."],
		["year_found = 1998"],
		['weight_g = "12.50"', "flat", "Quoted, so the final zero survives, and now it is a piece of text rather than a measurement. You have kept the appearance and given up the arithmetic."],
		['made_of = ["copper alloy", "glass"]'],
		['note = """'],
		["Bent, and mended in antiquity."],
		["See also the pin, accession 041.", "gain", "Three quotation marks open a passage that runs over several lines with nothing escaped. TOML also understands dates and times as dates and times, which almost nothing else here does."],
		['"""']
	]},
	declared: { family:"xml", label:"Declaring the kind separately, which is what a schema does", lines:[
		['<object accession="007">'],
		['  <found_in type="country-code">NO</found_in>', "gain", "The kind of thing is stated next to the thing. A checker can now refuse a file where this is not a real country code, before your program ever sees it."],
		['  <weight_g type="decimal" places="2">12.50</weight_g>', "gain", "Two decimal places, declared. The trailing zero is now a claim about how precisely the object was weighed, and it is protected as such."],
		["</object>", "cost", "You have gained a second document to write, agree and maintain: the rules themselves. Most teams who say they do this are copying rules somebody else wrote and hoping."]
	]},
	person: { family:"toml", label:"A file meant for human hands", lines:[
		["# Weights are as recorded in 1998 and have not been re-checked.", "gain", "This sentence is the entire argument for this kind of file. It is not data, it is the reason, and in a year it will be the only surviving memory of why."],
		['object = "Disc brooch"'],
		['accession = "007"'],
		[""],
		["[conservation]"],
		['treated = "1998-11-02"'],
		['by = "M. Halvorsen"', "flat", "Square brackets start a named group. It reads well at this size and becomes hard work three groups deep, which is TOML's real limit."]
	]},
	env: { family:"env", label:"The simplest possible file, and what it costs", lines:[
		["OBJECT=Disc brooch"],
		["ACCESSION=007", "gain", "Safe, by accident. Nothing in this file has a kind at all, so nothing can be turned into the wrong one."],
		["FOUND_IN=NO"],
		["MADE_OF=copper alloy,glass", "cost", "No lists. You have invented a separator and now you must remember it, document it, and hope no material ever contains a comma."],
		["CONSERVATION_BY=M. Halvorsen", "cost", "No groups either. The grouping now lives in the underscore in the name, which nothing checks and nothing enforces."]
	]},
	many: { family:"csv", label:"Four hundred thousand objects, one line each", lines:[
		["accession,object,found_in,year_found,weight_g", "gain", "This opens in any spreadsheet, any database, anything at all. Nothing else on this page is that portable, and portability is most of what an archive needs."],
		["007,Disc brooch,NO,1998,12.50", "cost", "Open this in a spreadsheet and watch it decide what your columns mean. 007 becomes 7. This is not hypothetical: human gene names were formally changed in 2020 because spreadsheets kept turning them into dates."],
		["041,Pin,NO,1998,3.10"],
		["042,Bead,SE,1999,0.80", "flat", "Notice what is missing. The curator's note cannot be here, because it has two lines in it and this format is built on the idea that one line is one object."]
	]},
	stream: { family:"json", label:"One object per line, so the file can be added to forever", lines:[
		['{"accession":"007","object":"Disc brooch","found_in":"NO"}', "gain", "Adding an object means adding a line. Nothing has to be opened, re-written and closed, and a power cut costs you one object rather than the catalogue."],
		['{"accession":"041","object":"Pin","found_in":"NO"}'],
		['{"accession":"042","object":"Bead","found_in":"SE"}', "cost", "This is no longer one document. Anything expecting a single, properly closed file will refuse it, and the rule that makes it work lives in your team's memory rather than in any standard."]
	]},
	stranger: { family:"turtle", label:"Written so a stranger can join it to theirs", lines:[
		["@prefix kaup: <https://example.org/kaupang/> .", "gain", "Every name here is a web address in short form. That means the museum in Uppsala can make statements about your brooch without either of you agreeing anything in advance."],
		["@prefix crm:  <http://www.cidoc-crm.org/> .", "flat", "That second one is real. CIDOC-CRM is a shared vocabulary for cultural objects, agreed between museums, and it exists precisely because everybody kept inventing their own column names."],
		[""],
		["kaup:007 a crm:ManMadeObject ;"],
		['    crm:name       "Disc brooch" ;'],
		['    crm:found_in   "NO" ;'],
		["    crm:related_to kaup:041 .", "gain", "That last line is a link that means something. In every other file on this page, 041 was a number your program had to know how to follow. Here it is a thing, named, and the name works outside the file."],
		[""],
		['kaup:041 crm:name "Pin" .', "cost", "And here is the bill. Everything must be given a web address before it can be talked about, the query language is a separate thing to learn, and the benefit only arrives if somebody else does all of this too. You pay first, alone."]
	]}
};

export const GATES: Record<GateId, Gate> = {
	marker: {
		text:"You have to write this down in a file a machine can read back later. The first thing to settle is the dullest and it decides everything after it: how does the file show where one fact stops and the next begins?",
		options:[
			{key:"punctuation", label:"Fence every fact with punctuation, so the boundaries are visible characters."},
			{key:"position",    label:"Give every fact its own line, and use how far it is indented to show what belongs to what."},
			{key:"tags",        label:"Write a name at the start of every fact and the same name again at the end."}
		]
	},
	typing: {
		text:"Your file now contains the two letters NO, standing for Norway. When a machine reads that back, how does it know those two letters are the name of a country and not the word no?",
		options:[
			{key:"guess",    label:"It works it out from what the value looks like."},
			{key:"quoted",   label:"Anything in quotation marks is words, always, and I will quote everything."},
			{key:"declared", label:"A separate set of rules says what kind of thing each field holds."}
		]
	},
	who: {
		text:"Somebody has to open this file at two in the morning when the catalogue will not load. Who is it?",
		options:[
			{key:"person",  label:"A person, in a text editor, under pressure."},
			{key:"machine", label:"Nobody. A program writes it and a program reads it."}
		]
	},
	many: {
		text:"So far there is one brooch. The museum has four hundred thousand objects and adds a few every week.",
		options:[
			{key:"one",     label:"Keep them as they are: one file for each object."},
			{key:"million", label:"Put them all together, in something built for the quantity."}
		]
	},
	reach: {
		text:"A museum in Uppsala has objects from the same excavation, catalogued for thirty years in their own system. They would like to join their records to yours.",
		options:[
			{key:"us",     label:"Send them a copy and let them work out how it maps onto theirs."},
			{key:"anyone", label:"Write the file so the joining does not need a conversation at all."}
		]
	}
};

export const ANSWERS: Record<GateId, Record<string, Answer>> = {
	marker:{
		punctuation:{verdict:"The strictest of the three, and the one everything else now speaks.",
			paragraphs:["Nothing depends on where anything sits on the page. You could put the whole record on one line and a machine would read it identically, which is precisely why this style became the one computers use to talk to each other.",
				 "It has one flat refusal, and it is worse than it sounds: there is no way to write a remark. Not one. Every explanation of why a value is what it is has to live somewhere else, and somewhere else is usually nowhere."],
			file:"punctuation"},
		position:{verdict:"The kindest to read, and the one that punishes a stray space.",
			paragraphs:["This is the most comfortable of the three for a person, and it is not close. Remarks are allowed, long passages of prose survive intact, and the shape of the file matches the shape of the thing.",
				 "The bill arrives elsewhere. Because meaning is carried by how far a line is indented, an accidental space changes what the file says, and it changes it silently. There is no error, just a different answer."],
			file:"position"},
		tags:{verdict:"The heaviest, and the only one that can hold a sentence with structure inside it.",
			paragraphs:["Naming both ends looks like pure waste until you need to mark something up in the middle of a paragraph. Every other approach on this page has to give up and treat prose as one lump; this one does not.",
				 "You pay for that on every single line, forever, in characters nobody reads."],
			file:"tags"}
	},
	typing:{
		guess:{verdict:"Then Norway is gone.",
			paragraphs:["In the most widely used format that does this, the bare letters NO are one of the ways of writing the word no. So are Y, N, yes, on and off. Your country becomes a false, silently, with no error anywhere.",
				 "The same rule eats the rest of the record. The accession number 007 becomes the number 7, and a catalogue search for 007 finds nothing. The weight 12.50 becomes 12.5, and the final zero was not decoration: it was the curator's claim about how precisely the thing had been weighed. That claim is now unrecoverable."],
			file:"position"},
		quoted:{verdict:"Correct, and it costs you something you may not have noticed.",
			paragraphs:["Quotation marks are the one habit that makes these formats behave. A quoted value has nowhere else to go, so Norway stays Norway, 007 stays three characters, and 12.50 keeps its zero.",
				 "But look at what quoting the weight did. It is now a piece of text. Nothing can add it up, sort by it or check it is a plausible weight for a brooch, because you protected its appearance by giving up its meaning. There are formats that let you keep both, and they are the ones that treat kinds as a first-class matter rather than a side effect of punctuation."],
			file:"quoted"},
		declared:{verdict:"The most work, and the only one that can catch a mistake before it spreads.",
			paragraphs:["A separate set of rules is a strange thing to write. It is a document about a document. But it is the only arrangement here where a machine can refuse a bad file at the door rather than crashing three weeks later in something unrelated.",
				 "It also lets you say things no amount of punctuation can. Not merely that the weight is a number, but that it has two decimal places, that it must be positive, and that every object must have exactly one."],
			file:"declared"}
	},
	who:{
		person:{verdict:"Then remarks stop being a nicety.",
			paragraphs:["A file a person maintains needs three things that a file for machines does not: somewhere to write down why, a shape that survives being edited by hand at speed, and kinds that cannot surprise you.",
				 "One format was built for exactly this and nothing else, and it is the one Rust and Python both settled on for their project files. Its weakness is depth: three groups down it becomes hard work, and people do abandon it over that."],
			file:"person"},
		machine:{verdict:"Then most of the argument evaporates, and a different one starts.",
			paragraphs:["If no human ever opens it, remarks are dead weight, readability is worth nothing, and you should be asking about size, speed and what happens when one end is updated before the other.",
				 "That is a real question with real answers, and the honest ones are not text files at all. They are formats where the meaning of the bytes lives in a separate agreed document, so the file itself is unreadable and very small. You give up being able to look at it, which sounds trivial until two in the morning arrives after all."],
			file:"env"}
	},
	many:{
		one:{verdict:"Reasonable, and it holds until somebody asks a question about all of them at once.",
			paragraphs:["Four hundred thousand small files is fine to store and miserable to ask questions of. Every question means opening every file.",
				 "It is also worth knowing that the answer to the question in the previous paragraph might not be a file at all. A small database in a single file does the one thing every format on this page refuses: it lets you change one fact without rewriting everything around it, safely, even if the power goes off halfway. The national libraries treat it as an archival format for exactly this reason."],
			file:"stream"},
		million:{verdict:"Then the shape changes, and something has to be given up.",
			paragraphs:["Put one object on each line and the file can be added to forever, read a line at a time, and survive being cut off mid-write. That is the whole trick, and it is why almost every system that records events uses it.",
				 "The oldest version of this idea is the plainest: one line per object, commas between the columns. It goes into any spreadsheet or database in the world. It also has no kinds whatsoever, which is how the accession number 007 became 7 and how, in 2020, geneticists gave up and renamed human genes because the spreadsheets would not stop turning them into dates."],
			file:"many"}
	},
	reach:{
		us:{verdict:"Which is what almost everybody does, and it is a defensible answer.",
			paragraphs:["Somebody at one end writes a translation between the two systems. It takes a fortnight, it works, and it has to be maintained by a person who understands both catalogues, forever.",
				 "That cost is real but it is bounded, and it is paid by someone who is already there. The alternative below is not obviously better; it is differently expensive."],
			file:null},
		anyone:{verdict:"Then names have to survive leaving the file.",
			paragraphs:["The move is to stop writing records and start writing statements. Every fact becomes three parts: a thing, a property and a value, and the thing and the property are both named with web addresses rather than words you chose.",
				 "Two files written by strangers can then be merged by simply putting them together, with no translation between them. This is how the structured information behind search results works, and it is how Wikidata is possible at all."],
			file:"stranger"}
	}
};

export const RULES: Record<string, TokenRule[]> = {
	json:[
		[/"(?:[^"\\]|\\.)*"(?=\s*:)/,"key"],
		[/"(?:[^"\\]|\\.)*"/,"str"],
		[/\b(?:true|false|null)\b/,"lit"],
		[/[+-]?\d+(?:\.\d+)?/,"num"],
		[/[{}\[\],:]/,"pun"]
	],
	yaml:[
		[/#[^\n]*/,"com"],
		[/^\s*-?\s*[\w.\-]+(?=\s*:)/,"key"],
		[/"(?:[^"\\]|\\.)*"/,"str"],
		[/\b(?:true|false|null|yes|no|on|off)\b/,"lit"],
		[/(?<=[:\s])[+-]?\d+(?:\.\d+)?\b/,"num"],
		[/[|>\-]/,"pun"]
	],
	toml:[
		[/#[^\n]*/,"com"],
		[/^\s*\[\[?[^\]]+\]\]?/,"lit"],
		[/^\s*[\w.\-]+(?=\s*=)/,"key"],
		[/"""|"(?:[^"\\]|\\.)*"/,"str"],
		[/(?<=[=\s\[,])[+-]?\d+(?:\.\d+)?\b/,"num"],
		[/[=\[\],]/,"pun"]
	],
	xml:[
		[/<!--[\s\S]*?-->/,"com"],
		[/"(?:[^"\\]|\\.)*"/,"str"],
		[/<\/?[A-Za-z][\w.\-]*|\/?>/,"tag"],
		[/[A-Za-z_][\w.\-]*(?==)/,"att"],
		[/=/,"pun"]
	],
	env:[
		[/#[^\n]*/,"com"],
		[/^[A-Za-z_][A-Za-z0-9_]*(?==)/,"key"],
		[/=/,"pun"]
	],
	csv:[
		[/^[a-z_,]+$/,"key"],
		[/,/,"pun"]
	],
	turtle:[
		[/#[^\n]*/,"com"],
		[/@[a-z]+/,"lit"],
		[/<[^>\s]*>/,"lit"],
		[/"(?:[^"\\]|\\.)*"/,"str"],
		[/\ba\b(?=\s)/,"lit"],
		[/[A-Za-z][\w.\-]*:[\w.\-]*/,"key"],
		[/[;,.]/,"pun"]
	]
};
