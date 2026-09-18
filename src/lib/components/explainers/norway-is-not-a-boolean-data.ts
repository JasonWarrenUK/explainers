import type { SpecimenLine, TokenRule } from './formats/tokenise';

export interface Format {
	id: string;
	label: string;
	family: string;
	comments: boolean;
	spec: string;
	stance: string;
	lines: SpecimenLine[];
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

export const FORMATS: Format[] = [
	{
		id:"json", label:"JSON", family:"json", comments:false, spec:"RFC 8259 / ECMA-404",
		stance:"The default, and the default is usually right.",
		lines:[
			["{", "cost", "Nowhere to write down why any of this is set the way it is. The reasons live in a commit message nobody reads."],
			['  "service": "atlas",'],
			['  "region": "NO",', "gain", "Quoted means string, in every parser, always. The Norway problem cannot reach this line."],
			['  "version": "1.20",', "flat", "The trailing zero survives only because it is quoted. Unquote it and you have the number 1.2."],
			['  "port": 8080,'],
			['  "retries": 3,'],
			['  "released": "2026-03-14T09:00:00Z",', "cost", "No date type. Every consumer reparses this string and one of them gets the time zone wrong."],
			['  "id": 9007199254740993,', "cost", "Two to the fifty-third, plus one. Any parser backed by a double hands you 9007199254740992. The file is fine; the number is gone."],
			['  "tags": ["edge", "eu-west"],'],
			['  "notes": "Rolled back once.\\nSee incident 4417."', "cost", "Escaped newlines. At twenty lines this is unreadable and the diff is one enormous line."],
			["}", "cost", "No trailing comma, so adding a field touches two lines and git blames the wrong one."]
		]
	},
	{
		id:"jsonc", label:"JSONC", family:"json", comments:true, spec:"none",
		stance:"JSON plus the one thing configuration actually needs.",
		lines:[
			["{"],
			["  // Regional deploy. NO is Norway, not a boolean.", "gain", "The reason sits next to the value. This is the whole feature and it is worth more than it looks."],
			['  "service": "atlas",'],
			['  "region": "NO",'],
			['  "version": "1.20",'],
			['  "port": 8080, // 80 needs root'],
			['  "retries": 3,'],
			['  "released": "2026-03-14T09:00:00Z",'],
			['  "id": 9007199254740993,'],
			['  "tags": ["edge", "eu-west"],'],
			['  "notes": "Rolled back once.\\nSee incident 4417.",', "flat", "Most JSONC parsers accept the trailing comma. No specification says they must, because there is no specification."],
			["}", "cost", "The file is still called .json and JSON.parse throws on it. Every tool downstream assumed strict JSON and was not wrong to."]
		]
	},
	{
		id:"json5", label:"JSON5", family:"json", comments:true, spec:"JSON5 1.0.0",
		stance:"The full ES5 object literal, specified properly.",
		lines:[
			["{"],
			["  // Regional deploy", "gain", "Comments, and a real specification behind them, which is what separates this from JSONC."],
			["  service: 'atlas',", "gain", "Unquoted keys and single quotes. Small things, and they are most of what makes hand-edited JSON tiresome."],
			["  region: 'NO',"],
			["  version: '1.20',"],
			["  port: 8080,"],
			["  retries: 3,"],
			["  mask: 0xFF,", "gain", "Hex literals, leading-plus, .5, +Infinity and NaN all parse. The number tower matches the one your language already has."],
			["  timeout: +Infinity,"],
			["  id: 9007199254740993,", "cost", "Still a double in JavaScript. Nothing about the syntax fixes what the runtime does to the value."],
			["  tags: ['edge', 'eu-west'],"],
			["}", "cost", "Parser coverage outside JavaScript is thin, so you have added a build step to a format whose selling point was needing none."]
		]
	},
	{
		id:"yaml", label:"YAML", family:"yaml", comments:true, spec:"YAML 1.2.2 (and 1.1, still)",
		stance:"Better engineering than its reputation and worse defaults than anything else here.",
		lines:[
			["# Regional deploy", "gain", "Comments, plus --- to carry many documents in one file, plus anchors and aliases for reuse with no templating layer."],
			["service: atlas"],
			["region: NO", "cost", "Under YAML 1.1 this is the boolean false. Norway has been losing this argument since 2001, and several widely deployed parsers still implement 1.1."],
			["version: 1.20", "cost", "The float 1.2. The trailing zero is gone, nothing warns you, and your version comparison now fails in a way that looks like a logic bug."],
			["port: 8080"],
			["retries: 3"],
			["released: 2026-03-14T09:00:00Z", "cost", "A timestamp under 1.1 and a plain string under the 1.2 core schema. Which you get depends on the library, not on the file."],
			["id: 9007199254740993", "cost", "YAML integers are arbitrary precision on paper. In a JavaScript runtime you get a double and lose the last digit anyway."],
			["tags: [edge, eu-west]", "flat", "Flow style is JSON's syntax, and 1.2 was revised specifically to swallow JSON. Close enough that migration is cheap; not actually a superset. Duplicate keys are legal JSON and an error in YAML, and PyYAML rejects tabs that JSON permits."],
			["notes: |", "gain", "Block scalar. Newlines, indentation and quotes survive exactly as typed. Nothing else on this page does this, and it is why nearly every CI system in existence is YAML."],
			["  Rolled back once."],
			["  See incident 4417."]
		]
	},
	{
		id:"toml", label:"TOML", family:"toml", comments:true, spec:"TOML 1.1.0 (Dec 2025)",
		stance:"The only one on this list designed for the job it is mostly used for.",
		lines:[
			["# Regional deploy"],
			['service = "atlas"'],
			['region = "NO"', "gain", "Quoted means string. There is no path from this line to a boolean, and there never will be."],
			['version = "1.20"'],
			["port = 8080"],
			["retries = 3"],
			["released = 2026-03-14T09:00:00Z", "gain", "A first-class offset date-time. TOML also separates local date-time, local date and local time, which is the distinction everybody else reimplements badly in application code."],
			["id = 9007199254740993", "gain", "Integers are specified as 64-bit signed, so this survives. The specification made a decision instead of leaving it to the host language."],
			['tags = ["edge", "eu-west"]'],
			['notes = """', "gain", "Multi-line basic string. No escaping, no continuation characters."],
			["Rolled back once."],
			["See incident 4417."],
			['"""'],
			[""],
			["[limits]", "cost", "Here is where it stops being obvious. Three levels down you are writing [[servers.eu.replicas]] and repeating the prefix on every table while the reader rebuilds the tree in their head."],
			["rps = 500"],
			["burst = 900", "cost", "There is no null anywhere in TOML. Cleared and never-set are the same state, and a merge between a deleted line and a changed line produces no conflict at all."],
			[""],
			["[[routes]]", "cost", "Double brackets mean array-of-tables. Nothing about the syntax tells you that, which is the one promise TOML makes about itself that it does not keep."],
			['path = "/health"'],
			[""],
			["[[routes]]"],
			['path = "/metrics"']
		]
	},
	{
		id:"env", label:".env", family:"env", comments:true, spec:"none whatsoever",
		stance:"The floor. Twelve strings, no parser, and nothing underneath it.",
		lines:[
			["# Regional deploy"],
			["SERVICE=atlas", "gain", "Zero dependency. Every shell, container runtime and CI system already reads this, the values land in the process environment where twelve-factor wants them, and somebody with no documentation edits it correctly on the first try."],
			["REGION=NO", "gain", "Safe by accident. Every value is a string because there is no other option, so Norway survives here for exactly the reason nothing structured can be expressed."],
			["VERSION=1.20"],
			["PORT=8080"],
			["RETRIES=3"],
			["RELEASED=2026-03-14T09:00:00Z"],
			["ID=9007199254740993", "flat", "Survives the file and dies in your code. The parsing decision still gets made, in a place with no schema and no tests around it."],
			["TAGS=edge,eu-west", "cost", "No list type, so you invented a delimiter and now have to document it. CSV's problem, one level further down."],
			['NOTES="Rolled back once. See incident 4417."', "cost", "Quoting, escaping and $VAR interpolation all differ between dotenv, python-dotenv and docker compose. There is no specification to appeal to, so the file means whatever your loader does."],
			["LIMITS_RPS=500", "cost", "Nesting by naming convention. The tree lives in the prefix, nothing enforces it, and two keys can disagree about the shape with nothing to notice."],
			["LIMITS_BURST=900"]
		]
	},
	{
		id:"xml", label:"XML", family:"xml", comments:true, spec:"XML 1.0 5th ed.",
		stance:"Not legacy. Correct for a job the industry stopped admitting it has.",
		lines:[
			["<!-- Regional deploy -->", "flat", "XPath queries this document in one line and XSLT transforms it declaratively. Both are standards, both are older than most of this list, and the JSON equivalents are still worse."],
			['<service name="atlas" region="NO">', "cost", "name and region are attributes; version below is an element. Nothing in XML tells you which is right, so two teams model the same record two ways and the mapping layer between them is permanent."],
			["  <version>1.20</version>"],
			["  <port>8080</port>"],
			["  <retries>3</retries>"],
			["  <released>2026-03-14T09:00:00Z</released>", "flat", "A string until a schema says xs:dateTime. Add an XSD and the parser enforces types, ranges, enumerations and cardinality, which is more than any other format here offers."],
			["  <id>9007199254740993</id>"],
			["  <tags>", "cost", "A list costs a wrapper element and a repeated child. This is the verbosity, and it is real: bytes on every wire, characters in every diff."],
			["    <tag>edge</tag>"],
			["    <tag>eu-west</tag>"],
			["  </tags>"],
			['  <notes>Rolled back once. See <ref id="4417">incident 4417</ref>.</notes>', "gain", "Text with markup inside it, in order. This is the thing nothing else on this page can represent without inventing a convention, and it is why DOCX, EPUB, SVG and HTML are all XML-shaped."],
			["</service>", "cost", "Entity expansion and external entity resolution are still enabled in enough parsers that billion laughs and XXE remain live in 2026."]
		]
	},
	{
		id:"rdf", label:"Turtle", family:"turtle", comments:true, spec:"RDF 1.1 / Turtle, W3C",
		stance:"Not a record. A set of claims, each of which can be true on its own.",
		lines:[
			["@prefix ex:  <https://example.org/> .", "gain", "Every name here is a URI wearing a short form. svc:region is globally unique, so a stranger's file can make statements about ex:atlas without either of you agreeing a schema first. That is the entire argument and nothing else on this page offers it."],
			["@prefix svc: <https://schema.example.org/> ."],
			["@prefix xsd: <http://www.w3.org/2001/XMLSchema#> ."],
			[""],
			["ex:atlas a svc:Service ;", "cost", "Anything you do not give a URI becomes a blank node, which has no stable identifier and may come back renamed after a round trip. Modelling around blank nodes is most of the practical work."],
			['    svc:region     "NO" ;'],
			['    svc:version    "1.20" ;', "cost", "Absence means nothing. No triple says this service has no owner, so an empty result cannot distinguish unknown from untrue, and every closed-world check your application needs gets written by hand."],
			["    svc:port       8080 ;", "cost", "Every predicate carries its namespace, so this is longer than TOML for the same record and the payoff arrives only when somebody you have never met reads it."],
			['    svc:released   "2026-03-14T09:00:00Z"^^xsd:dateTime ;', "gain", "The type hangs off the value rather than the field. Any XSD datatype works and a new one needs no new version of the format."],
			['    svc:tag        "edge", "eu-west" ;', "cost", "No list type. A repeated predicate is the idiom and order is not preserved. If order matters you need rdf:List, a linked list of blank nodes, which is unpleasant enough that people encode arrays as JSON strings instead."],
			["    svc:supersedes ex:borealis .", "gain", "A link that means something. A foreign key is a number your application interprets; this is a predicate with a definition anybody can dereference, pointing at a subject whose identity survives leaving the file."],
			[""],
			['ex:borealis svc:region "SE" .', "gain", "A second subject, and the file has no container to close. Merging two documents is set union, which is why the same trick works across the whole web and why schema.org and Wikidata are possible."]
		]
	},
	{
		id:"csv", label:"CSV", family:"csv", comments:false, spec:"RFC 4180, widely ignored",
		stance:"One job, done better than anything else can do it.",
		lines:[
			["service,region,version,port,retries,released,id,tags,notes", "gain", "This loads into any database, spreadsheet or dataframe with one command, and it streams while it does it. No other format here is that portable."],
			['atlas,NO,1.20,8080,3,2026-03-14T09:00:00Z,9007199254740993,"edge;eu-west","Rolled back once.', "flat", "No types at all, so nothing converts NO to anything. Every field is a string until your code decides otherwise, which is at least honest about where the decision lives."],
			['See incident 4417."', "cost", "A quoted field may contain newlines, so one-record-per-line is false and every hand-rolled parser that splits on \\n is broken. The nested list also had to become a string with a delimiter you invented and now have to document."],
			["", "cost", "Open this in a spreadsheet and watch it decide what your identifiers mean. Human gene symbols were formally renamed in 2020 because Excel kept turning SEPT2 into a date."]
		]
	},
	{
		id:"ndjson", label:"NDJSON", family:"json", comments:false, spec:"convention",
		stance:"The fix for JSON's worst structural property.",
		lines:[
			['{"service":"atlas","region":"NO","port":8080}', "gain", "Append a record by appending a line. tail -f works, a stream has no closing bracket to wait for, and a truncated write costs one record rather than the file."],
			['{"service":"borealis","region":"SE","port":8080}'],
			['{"service":"cinder","region":"NO","port":9090}', "cost", "This is not a JSON document, so nothing expecting one will read it. You swapped a container the format guarantees for a convention your team has to remember."]
		]
	}
];

export const DOCKETS: Docket[] = [
	{
		name:"JSON", meta:"2001 · RFC 8259 · everywhere",
		claim:"One data model, one page of grammar, and a parser in every language that agrees with all the others.",
		forText:"That last property is rarer than it sounds and it is the entire argument. JSON is the only format here where you can hand a file to a stranger's stack and be confident it comes back as the same tree. It maps onto primitives every language already has, it is trivial to generate, and the surrounding tooling is a genuine ecosystem rather than two libraries and a prayer: JSON Schema, jq, JSON Pointer, JSON Patch, Merge Patch. Nothing else on this list has all of that.",
		againstText:"No comments, so the reasoning behind a setting lives somewhere the file cannot reach. No date type, so every consumer reinvents ISO 8601. Numbers become IEEE-754 doubles the moment JavaScript touches them, which quietly destroys integers above two to the fifty-third. Duplicate keys are undefined by RFC 8259: some parsers keep the last, some the first, some throw, and a validator reading one while an executor reads the other is a live attack class rather than a curiosity. No trailing commas, so every append is a two-line diff.",
		pays:"Whoever edits it by hand. JSON is a wire format that got promoted to a configuration format because it was already in the building."
	},
	{
		name:"JSONC / JSON5", meta:"no spec / JSON5 1.0.0 · VS Code, tsconfig",
		claim:"Comments are a real requirement and both of these are honest about it.",
		forText:"The thing missing from JSON for configuration is the ability to say why. JSONC adds // and /* */ and, in most implementations, trailing commas; VS Code settings and tsconfig.json have run on it for years without incident. JSON5 goes further with unquoted keys, single quotes, hex, +Infinity, NaN and trailing decimals, and unlike JSONC it has an actual written specification you can point a parser author at.",
		againstText:"JSONC has no specification at all. What it means is whatever the reference parser does this week, and the file extension is still .json, so anything downstream that assumed strict JSON breaks on your comments and is entitled to. JSON5's specification is real but its parser coverage outside JavaScript is thin, which means a build step, which means the format's main selling point is gone.",
		pays:"The next tool in the chain, written against the strict grammar by somebody who had no reason to expect otherwise."
	},
	{
		name:"YAML", meta:"2001 · 1.2.2 spec · Kubernetes, CI, Ansible",
		claim:"The best ergonomics on this page for a human writing structured data, attached to the worst defaults.",
		forText:"Block scalars are the case. Nothing else here lets you paste a shell script into a config file and keep its newlines, indentation and quoting intact, and that single feature is why the entire CI industry runs on YAML. Anchors and aliases give real reuse without a templating layer above the file. The multi-document stream is exactly what Kubernetes needed and nobody else offers it. YAML 1.2 was revised to swallow JSON almost whole, so migrating in that direction is close to free. As a language for people, it is the most pleasant thing here and it is not close.",
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
		claim:"Mixed content, schemas that actually enforce, and a query language older than most of this list and still better.",
		forText:"Text with structure inside it, in order, is a thing only XML represents natively, and it is why every document format you use is XML-shaped underneath. XSD and RELAX NG enforce cardinality, value ranges, enumerations and required-ness at the parser rather than in your code, which no other format here does without a separate validation library and a lot of discipline. XPath addresses any node in one expression. XSLT transforms one document into another declaratively. Namespaces let two vocabularies share a file without collision, which JSON has never solved and mostly pretends not to need. Document order and repeated siblings are preserved by the data model; JSON objects guarantee neither.",
		againstText:"Verbose, and the verbosity is not aesthetic: closing tags are bytes on the wire and noise in the diff. Attributes and elements can carry identical information with nothing to arbitrate, so every team invents its own convention and the translation layer between two of them never goes away. The data model does not fit the structures your language already has, which is why every XML binding library is baroque and why the mapping code is where the bugs live. The specification family is enormous and XSD in particular is hard enough that most teams using it are copying a schema somebody else wrote. Namespaces are painful in every API that touches them. Entity expansion and external entities are enabled in enough parsers that billion laughs and XXE are still worth writing tests for.",
		pays:"Every reader, on every read, in exchange for power the schema author exercises once."
	},
	{
		name:"RDF / Turtle / JSON-LD", meta:"1999 · RDF 1.1 (2014) · schema.org, Wikidata",
		claim:"A claim rather than a record, which is why two files written by strangers merge without a mapping layer.",
		forText:"Everything else here puts fields in a bag and leaves identity to whoever reads it. RDF makes every statement a subject-predicate-object triple where the subject and the predicate are URIs, so a record has a name that survives leaving the file and a field has a definition anybody can dereference. Merging two documents is set union: no schema negotiation, no translation layer. Datatypes hang off the literal rather than the field, so the vocabulary extends without a new version of the format. Named graphs make provenance first-class, letting the data say which source asserted which triple rather than leaving it to a comment. JSON-LD is the serialisation that actually shipped, and it is why schema.org markup and Wikidata work at all.",
		againstText:"The tooling has been the problem for twenty-five years and still is. SPARQL is a real query language with a real learning curve, and the list of triple stores worth running in production is short. Blank nodes have no stable identifier, so anything you fail to name cannot be referred to, diffed or merged reliably, and modelling around that is most of the work in practice. Open-world semantics mean an empty result never means false, so every closed-world check your application needs gets hand-written. Ordered lists require rdf:List, a linked list of blank nodes, unpleasant enough that people give up and store arrays as JSON strings. RDF 1.2 adds triple terms and was still working through W3C Candidate Recommendation in mid-2026, so the interesting version is not the settled one.",
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
	{ fmt:"XML", inp:'<a b="1"/>  vs  <a><b>1</b></a>', out:"two different trees", why:"Identical information, incompatible shapes, and nothing in the format arbitrates. Every XML API you have ever disliked was mediating this choice on somebody else's behalf." },
	{ fmt:"Turtle", inp:"_:b1 svc:port 8080 .", out:"a node with no name", why:"Blank nodes are scoped to the document. Serialise, reparse, and _:b1 may come back as _:b7. Two files describing the same unnamed thing cannot be merged into one thing, which is why every RDF guide tells you to mint URIs for everything." },
	{ fmt:".env", inp:'NOTES="a b" # c', out:"ask your loader", why:"Whether the comment is stripped, whether the quotes survive and whether $VARS interpolate all differ between dotenv, python-dotenv and docker compose. No specification exists, so there is no correct answer to appeal to." },
	{ fmt:"CSV", inp:"SEPT2", out:"2-Sep", why:"Spreadsheet autoformatting, applied on open, saved on close. Human gene symbols were formally renamed in 2020 because this kept happening to published research data." }
];

export const RULES: Record<string, TokenRule[]> = {
	json:[
		[/\/\/[^\n]*/, "com"],
		[/"(?:[^"\\]|\\.)*"(?=\s*:)/, "key"],
		[/"(?:[^"\\]|\\.)*"/, "str"],
		[/'(?:[^'\\]|\\.)*'(?=\s*:)/, "key"],
		[/'(?:[^'\\]|\\.)*'/, "str"],
		[/(?:^|(?<=[{,\s]))[A-Za-z_$][\w$]*(?=\s*:)/, "key"],
		[/\b(?:true|false|null|NaN)\b|[+-]?Infinity/, "lit"],
		[/[+-]?0[xX][0-9a-fA-F]+|[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, "num"],
		[/[{}\[\],:]/, "pun"]
	],
	yaml:[
		[/#[^\n]*/, "com"],
		[/^\s*-?\s*[\w.\-\/]+(?=\s*:)/, "key"],
		[/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, "str"],
		[/\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?/, "num"],
		[/\b(?:true|false|null|yes|no|on|off)\b/, "lit"],
		[/(?<=[:\s\[,])[+-]?\d+(?:\.\d+)?\b/, "num"],
		[/[|>&*\[\]{},]/, "pun"]
	],
	toml:[
		[/#[^\n]*/, "com"],
		[/^\s*\[\[?[^\]]+\]\]?/, "lit"],
		[/^\s*[\w.\-"]+(?=\s*=)/, "key"],
		[/"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, "str"],
		[/\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?/, "num"],
		[/\b(?:true|false)\b/, "lit"],
		[/(?<=[=\s\[,])[+-]?\d+(?:\.\d+)?\b/, "num"],
		[/[=\[\],]/, "pun"]
	],
	env:[
		[/#[^\n]*/, "com"],
		[/^[A-Za-z_][A-Za-z0-9_]*(?==)/, "key"],
		[/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, "str"],
		[/=/, "pun"]
	],
	turtle:[
		[/#[^\n]*/, "com"],
		[/@[a-z]+/, "lit"],
		[/<[^>\s]*>/, "lit"],
		[/"(?:[^"\\]|\\.)*"/, "str"],
		[/\^\^/, "pun"],
		[/\ba\b(?=\s)/, "lit"],
		[/[A-Za-z][\w.\-]*:[\w.\-]*/, "key"],
		[/(?<=\s)[+-]?\d+(?:\.\d+)?\b/, "num"],
		[/[;,.]/, "pun"]
	],
	xml:[
		[/<!--[\s\S]*?-->/, "com"],
		[/"(?:[^"\\]|\\.)*"/, "str"],
		[/<\/?[A-Za-z][\w.\-]*|\/?>/, "tag"],
		[/[A-Za-z_][\w.\-]*(?==)/, "att"],
		[/=/, "pun"]
	],
	csv:[
		[/"(?:[^"]|"")*"?/, "str"],
		[/\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?/, "num"],
		[/(?<=^|,)\d+(?:\.\d+)?(?=,|$)/, "num"],
		[/,/, "pun"]
	]
};
