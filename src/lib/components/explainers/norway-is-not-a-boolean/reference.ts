import type { Docket, MinorFormat, ParseCard } from './types';

/*
 * The reference material, kept as written: the full case for and against
 * each format, the formats that never get invited and the inputs where
 * conforming parsers disagree. The journey in gates.ts folds these away
 * under the answers they belong to.
 */

export const DOCKETS: Docket[] = [
	{
		name:"JSON", meta:"2001 · RFC 8259 · everywhere",
		claim:"One data model, one page of grammar and a parser in every language that agrees with all the others.",
		forText:"That last property is rarer than it sounds and it is the entire argument. JSON is the only format here where you can hand a file to a stranger's stack and be confident it comes back as the same tree. It maps onto primitives every language already has, it is trivial to generate. The surrounding tooling is a genuine ecosystem rather than two libraries and a prayer: JSON Schema, jq, JSON Pointer, JSON Patch, Merge Patch. Nothing else on this list has all of that.",
		againstText:"No comments, so the reasoning behind a setting lives somewhere the file cannot reach. No date type, so every consumer reinvents ISO 8601. Numbers become IEEE-754 doubles the moment JavaScript touches them, which quietly destroys integers above two to the fifty-third. Duplicate keys are undefined by RFC 8259: some parsers keep the last, some the first and some throw. A validator reading one while an executor reads the other is a live attack class rather than a curiosity. No trailing commas, so every append is a two-line diff.",
		pays:"Whoever edits it by hand. JSON is a wire format that got promoted to a configuration format because it was already in the building."
	},
	{
		name:"JSONC / JSON5", meta:"no spec / JSON5 1.0.0 · VS Code, tsconfig",
		claim:"Comments are a real requirement and both of these are honest about it.",
		forText:"The thing missing from JSON for configuration is the ability to say why. JSONC adds // and /* */ and, in most implementations, trailing commas; VS Code settings and tsconfig.json have run on it for years without incident. JSON5 goes further with unquoted keys, single quotes, hex, +Infinity, NaN and trailing decimals. Unlike JSONC it has an actual written specification you can point a parser author at.",
		againstText:"JSONC has no specification at all. What it means is whatever the reference parser does this week, and the file extension is still .json, so anything downstream that assumed strict JSON breaks on your comments and is entitled to. JSON5's specification is real but its parser coverage outside JavaScript is thin, which means a build step, which means the format's main selling point is gone.",
		pays:"The next tool in the chain, written against the strict grammar by somebody who had no reason to expect otherwise."
	},
	{
		name:"YAML", meta:"2001 · 1.2.2 spec · Kubernetes, CI, Ansible",
		claim:"The best ergonomics on this page for a human writing structured data, attached to the worst defaults.",
		forText:"Block scalars are the case. Nothing else here lets you paste a shell script into a config file and keep its newlines, indentation and quoting intact. That single feature is why the entire CI industry runs on YAML. Anchors and aliases give real reuse without a templating layer above the file. The multi-document stream is exactly what Kubernetes needed and nobody else offers it. YAML 1.2 was revised to swallow JSON almost whole, so migrating in that direction is close to free. As a language for people, it is the most pleasant thing here and it is not close.",
		againstText:"The failure mode is silence. region: NO is false under YAML 1.1, version: 1.20 is the float 1.2, a leading zero can be octal, and 22:22 can be the integer 1342. None of these produce an error. The specification is enormous, so implementations diverge at the edges and a file that behaves in Python behaves differently in Go. Anchors expand, so a few kilobytes can allocate gigabytes. PyYAML's load would instantiate arbitrary Python objects until enough people were hurt to change the default.",
		pays:"The on-call engineer. YAML's mistakes pass CI and arrive in production dressed as a working deploy."
	},
	{
		name:"TOML", meta:"2013 · 1.1.0 Dec 2025 · Cargo, pyproject",
		claim:"Unambiguous types, because the syntax refuses to guess.",
		forText:"Quoted means string, always, so the Norway problem is structurally impossible rather than merely unlikely. Dates and times are first-class, including the separation of offset date-time, local date-time, local date and local time, a distinction the rest of this list leaves to application code that gets it wrong. Integers are specified as 64-bit signed. Comments are native. The grammar is small enough to read in an afternoon, and the design goal was that somebody with no reference guide can edit the file correctly, which Cargo and pyproject have now tested at enormous scale.",
		againstText:"Nesting. Past about three levels you are writing [[servers.eu.replicas]], repeating the prefix on every table, and the reader is reassembling the tree by hand. There is no null, so a cleared field and an absent field are the same state and git cannot tell them apart during a merge. TOML 1.1 landed in December 2025 and finally allowed inline tables to span lines, which fixes most of the nesting complaint and breaks every parser still pinned to 1.0. The Python packaging PEPs do not name a TOML version, so \"valid TOML\" is ambiguous in a way it was not two years ago.",
		pays:"Anyone whose data is genuinely a tree. TOML is a flat format with tree syntax bolted on and the seams show early."
	},
	{
		name:"XML", meta:"1998 · W3C · DOCX, EPUB, SVG, RSS, HTML",
		claim:"Mixed content, schemas that actually enforce and a query language older than most of this list and still better.",
		forText:"Text with structure inside it, in order, is a thing only XML represents natively. It is why every document format you use is XML-shaped underneath. XSD and RELAX NG enforce cardinality, value ranges, enumerations and required-ness at the parser rather than in your code, which no other format here does without a separate validation library and a lot of discipline. XPath addresses any node in one expression. XSLT transforms one document into another declaratively. Namespaces let two vocabularies share a file without collision, which JSON has never solved and mostly pretends not to need. Document order and repeated siblings are preserved by the data model; JSON objects guarantee neither.",
		againstText:"Verbose, and the verbosity is not aesthetic: closing tags are bytes on the wire and noise in the diff. Attributes and elements can carry identical information with nothing to arbitrate, so every team invents its own convention and the translation layer between two of them never goes away. The data model does not fit the structures your language already has, which is why every XML binding library is baroque and why the mapping code is where the bugs live. The specification family is enormous and XSD in particular is hard enough that most teams using it are copying a schema somebody else wrote. Namespaces are painful in every API that touches them. Entity expansion and external entities are enabled in enough parsers that billion laughs and XXE are still worth writing tests for.",
		pays:"Every reader, on every read, in exchange for power the schema author exercises once."
	},
	{
		name:"RDF / Turtle / JSON-LD", meta:"1999 · RDF 1.1 (2014) · schema.org, Wikidata",
		claim:"A claim rather than a record, which is why two files written by strangers merge without a mapping layer.",
		forText:"Everything else here puts fields in a bag and leaves identity to whoever reads it. RDF makes every statement a subject-predicate-object triple where the subject and the predicate are URIs, so a record has a name that survives leaving the file and a field has a definition anybody can dereference. Merging two documents is set union: no schema negotiation, no translation layer. Datatypes hang off the literal rather than the field, so the vocabulary extends without a new version of the format. Named graphs make provenance first-class, letting the data say which source asserted which triple rather than leaving it to a comment. JSON-LD is the serialisation that actually shipped, and it is why schema.org markup and Wikidata work at all.",
		againstText:"The tooling has been the problem for twenty-five years and still is. SPARQL is a real query language with a real learning curve, and the list of triple stores worth running in production is short. Blank nodes have no stable identifier, so anything you fail to name cannot be referred to, diffed or merged reliably. Modelling around that is most of the work in practice. Open-world semantics mean an empty result never means false, so every closed-world check your application needs gets hand-written. Ordered lists require rdf:List, a linked list of blank nodes, unpleasant enough that people give up and store arrays as JSON strings. RDF 1.2 adds triple terms and was still working through W3C Candidate Recommendation in mid-2026, so the interesting version is not the settled one.",
		pays:"The first team to adopt it. The benefits are network effects and the costs are paid up front, alone."
	}
];

export const OTHERS: MinorFormat[] = [
	{ name:".env", good:"Zero parser and zero dependency. Every shell, container runtime and CI system already reads it, the values arrive in the process environment where twelve-factor wants them, and a person with no documentation edits it correctly on the first try. Nothing else here has all three properties.", bad:"No specification, no types, no nesting and no lists. Quoting, escaping and interpolation differ between dotenv, python-dotenv and docker compose, so the file means whatever your loader happens to do. Nesting arrives as a naming convention that nothing enforces." },
	{ name:"INI", good:"No specification, which is exactly why it works: a human with no documentation edits it correctly on the first try. Sections and key-value pairs are the whole model and everybody already knows it.", bad:"The semantics belong to your parser rather than to the format. Duplicate keys, escaping, nesting and comment characters all differ between implementations, and there is no document to appeal to." },
	{ name:"Protobuf / Avro / Cap'n Proto", good:"Schema first, and the schema is a checkable artefact rather than documentation. Field numbers rather than names go on the wire, so payloads are small and old readers survive new writers if you keep the compatibility rules. Codegen means the contract is enforced at compile time in every language that consumes it.", bad:"The bytes mean nothing without the schema, so debugging requires tooling and a registry becomes infrastructure you now operate. The compatibility rules are a discipline: reuse one retired field number and you will corrupt data in a way no test catches." },
	{ name:"CBOR / MessagePack", good:"JSON's data model in bytes, self-describing, no schema needed, and meaningfully smaller and faster. CBOR is RFC 8949 and carries real binary strings, tagged types and deterministic encoding, which is why WebAuthn and COSE use it rather than JSON.", bad:"You cannot cat it. That sounds trivial until an incident at 3am, and it is the single greatest property of text formats being traded away." },
	{ name:"Parquet / Arrow", good:"Columnar, so a query touching two of forty columns reads two columns. Compression is per column and the ratios are enormous because a column is homogeneous. Statistics per row group let a reader skip whole blocks without decoding them.", bad:"Rewriting a single row is expensive and updating one is worse, so it is wrong for anything transactional. It is not a file you edit, inspect casually or diff." },
	{ name:"SQLite", good:"Hipp's argument is that an application's on-disk format should be a database, and on the thing every text format punts on it wins outright: change one field without rewriting the file, atomically, crash-safe, with the schema carried inside the file. The Library of Congress lists it as a preferred format for datasets alongside XML, JSON and CSV, which is a strange sentence about a binary blob and a correct one.", bad:"You cannot diff, review or read it without a tool, so it is wrong for anything that belongs in git. And a database that looks exactly like a file gets copied to places a database would never have been allowed." },
	{ name:"HCL / Jsonnet / CUE / Dhall", good:"Configuration that needs abstraction, because at scale you are already generating YAML with string templates and doing it in a language with types is strictly better. CUE unifies schema and data into one thing, so a constraint and a value are the same kind of object, which is a genuinely different idea rather than a nicer syntax.", bad:"Another language for the team to learn, and evaluation-time failures that no linter sees. The on-call engineer reads the generated output rather than your elegant source, and that output is usually worse than what a person would have written." },
	{ name:"KDL / EDN / S-expressions", good:"KDL takes XML's node-with-arguments-and-properties shape and gives it a syntax people will actually type. EDN has sets, keywords and namespaced symbols as real types, plus tagged literals so the format extends without a new version, which is the extensibility story XML wanted.", bad:"Small ecosystems. Outside Clojure, EDN support is a weekend project somebody stopped maintaining, and betting a boundary on that is a decision you will revisit." }
];

export const CARDS: ParseCard[] = [
	{ fmt:"YAML 1.1", inp:"region: NO", out:"false", why:"Boolean resolution in YAML 1.1 covers y, Y, yes, on, n, N, no and off. Norway's ISO code is one of them. Quote every string and this disappears." },
	{ fmt:"YAML 1.1", inp:"version: 1.20", out:"1.2", why:"Resolved as a float. Your version comparison now fails for a reason that looks nothing like a formatting problem." },
	{ fmt:"YAML 1.1", inp:"threshold: 1e2", out:"the string 1e2", why:"The Norway problem in reverse: a number that becomes a string. YAML 1.1 requires a dot in a float's mantissa, so an exponent without one fails to resolve as a number. PyYAML still does this; ruamel and js-yaml both return 100. One document, two answers, no error either way." },
	{ fmt:"YAML 1.1", inp:"restart: 22:22", out:"1342", why:"Base-60 integers were in YAML 1.1 and removed in 1.2. Twenty-two times sixty, plus twenty-two. Parsers still implementing 1.1 still do this." },
	{ fmt:"JSON", inp:'{"a": 1, "a": 2}', out:"undefined behaviour", why:"RFC 8259 says names SHOULD be unique and stops there. JavaScript keeps 2, some parsers keep 1, some throw. A validator reading one value and an executor reading the other is a documented attack pattern rather than a hypothetical." },
	{ fmt:"JSON", inp:"9007199254740993", out:"9007199254740992", why:"Two to the fifty-third plus one, into an IEEE-754 double. The specification permits arbitrary precision; almost no implementation delivers it. Send large IDs as strings." },
	{ fmt:"TOML", inp:"expires = null", out:"parse error", why:"TOML has no null. Absent is the only way to say nothing, which is clean until you need to distinguish deliberately cleared from never set, and until two branches disagree about a line that one of them deleted." },
	{ fmt:"XML", inp:'<a b="1"/>  vs  <a><b>1</b></a>', out:"two different trees", why:"Identical information in incompatible shapes, and nothing in the format arbitrates. Every XML API you have ever disliked was mediating this choice on somebody else's behalf." },
	{ fmt:"Turtle", inp:"_:b1 svc:port 8080 .", out:"a node with no name", why:"Blank nodes are scoped to the document. Serialise and reparse, and _:b1 may come back as _:b7. Two files describing the same unnamed thing cannot be merged into one thing, which is why every RDF guide tells you to mint URIs for everything." },
	{ fmt:".env", inp:'NOTES="a b" # c', out:"ask your loader", why:"Whether the comment is stripped, whether the quotes survive and whether $VARS interpolate all differ between dotenv, python-dotenv and docker compose. No specification exists, so there is no correct answer to appeal to." },
	{ fmt:"CSV", inp:"SEPT2", out:"2-Sep", why:"Spreadsheet autoformatting, applied on open, saved on close. Human gene symbols were formally renamed in 2020 because this kept happening to published research data." }
];

export function docket(name: string): Docket {
	const found = DOCKETS.find((d) => d.name === name);
	if (!found) throw new Error(`No docket named "${name}"`);
	return found;
}

export function minorFormat(name: string): MinorFormat {
	const found = OTHERS.find((o) => o.name === name);
	if (!found) throw new Error(`No minor format named "${name}"`);
	return found;
}

/** Cards are looked up by their input, which is unique and readable at the call site. */
export function card(inp: string): ParseCard {
	const found = CARDS.find((c) => c.inp === inp);
	if (!found) throw new Error(`No parse card for input "${inp}"`);
	return found;
}
