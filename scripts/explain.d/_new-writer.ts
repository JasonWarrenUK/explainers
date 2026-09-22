#!/usr/bin/env bun
// _new-writer.ts: performs the three-file lockstep write for `explain new`.
// Never called directly by the user; the `new` command shells out to it
// after gum confirm. Splices text rather than using sed/awk (CLAUDE.md
// §7.4) and preserves the tab indentation both files already use.
//
// Usage: bun run _new-writer.ts <mode> <id> <title> <blurb> <tags-csv>
//   mode: "diff"  — print the diff and exit, write nothing
//         "write" — perform the writes, all-or-nothing
//
// Exit 0 on success, 1 with a message on stderr on any failure. On a
// partial failure during "write", already-written files are restored from
// the backups taken before any write began.

import { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO_ROOT = join(new URL('.', import.meta.url).pathname, '..', '..');
const EXPLAINERS_PATH = join(REPO_ROOT, 'src/lib/data/explainers.ts');
const REGISTRY_PATH = join(REPO_ROOT, 'src/lib/components/explainers/registry.ts');

function fail(message: string): never {
	console.error(message);
	process.exit(1);
}

function toPascalCase(id: string): string {
	return id
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

function escapeSingleQuotes(s: string): string {
	return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const [mode, id, title, blurb, tagsCsv] = process.argv.slice(2);
if (!mode || !id || !title || !blurb) {
	fail('_new-writer.ts: usage: <diff|write> <id> <title> <blurb> <tags-csv>');
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
	fail(`_new-writer.ts: "${id}" is not kebab-case`);
}

const tags = (tagsCsv ?? '')
	.split(',')
	.map((t) => t.trim())
	.filter(Boolean);

const componentName = toPascalCase(id);
const componentPath = `${componentName}.svelte`;

// --- explainers.ts: append an ExplainerMeta before the closing `];` -------

const explainersSrc = readFileSync(EXPLAINERS_PATH, 'utf8');
const arrayCloseMatch = explainersSrc.match(/\n(\t*)\];\s*\n/);
if (!arrayCloseMatch) {
	fail('_new-writer.ts: could not find the closing "];" of the explainers array');
}
if (explainersSrc.includes(`id: '${id}'`)) {
	fail(`_new-writer.ts: explainer id "${id}" already exists in explainers.ts`);
}

const entryLines = [
	'\t{',
	`\t\tid: '${escapeSingleQuotes(id)}',`,
	`\t\ttitle: '${escapeSingleQuotes(title)}',`,
	'\t\tblurb:',
	`\t\t\t'${escapeSingleQuotes(blurb)}',`,
	`\t\ttags: [${tags.map((t) => `'${escapeSingleQuotes(t)}'`).join(', ')}]`,
	'\t},'
];

const insertPoint = arrayCloseMatch.index! + 1; // right after the preceding newline
let beforeInsert = explainersSrc.slice(0, insertPoint);
// The array's last existing element has no trailing comma (it's the final
// element until now). Add one before splicing in the new entry, or the
// array becomes syntactically invalid: "...} {..." with no separator.
if (/\}\s*$/.test(beforeInsert) && !/\},\s*$/.test(beforeInsert)) {
	beforeInsert = beforeInsert.replace(/\}(\s*)$/, '},$1');
}
const newExplainersSrc =
	beforeInsert + entryLines.join('\n') + '\n' + explainersSrc.slice(insertPoint);

// --- registry.ts: append an entry before the closing `};` -----------------

const registrySrc = readFileSync(REGISTRY_PATH, 'utf8');
const objectCloseMatch = registrySrc.match(/\n\};\s*\n?$/);
if (!objectCloseMatch) {
	fail('_new-writer.ts: could not find the closing "};" of the registry object');
}
if (registrySrc.includes(`'${id}':`)) {
	fail(`_new-writer.ts: explainer id "${id}" already exists in registry.ts`);
}

const registryLine = `\t'${escapeSingleQuotes(id)}': () => import('./${componentPath}'),`;
const registryInsertPoint = objectCloseMatch.index! + 1;
let beforeRegistryInsert = registrySrc.slice(0, registryInsertPoint);
// Same trailing-comma gap as explainers.ts: the last existing property has
// no trailing comma until a second one is added after it.
if (/[^,\s]\s*$/.test(beforeRegistryInsert)) {
	beforeRegistryInsert = beforeRegistryInsert.replace(/([^,\s])(\s*)$/, '$1,$2');
}
const newRegistrySrc = beforeRegistryInsert + registryLine + '\n' + registrySrc.slice(registryInsertPoint);

// --- component stub ---------------------------------------------------------

const componentStub = `<script lang="ts">
</script>

<section>
\t<h1>${title}</h1>
</section>
`;

const componentAbsPath = join(REPO_ROOT, 'src/lib/components/explainers', componentPath);

if (mode === 'diff') {
	console.log(`--- ${EXPLAINERS_PATH} (append) ---`);
	console.log(entryLines.join('\n'));
	console.log();
	console.log(`--- ${REGISTRY_PATH} (append) ---`);
	console.log(registryLine);
	console.log();
	console.log(`--- ${componentAbsPath} (new file) ---`);
	console.log(componentStub);
	process.exit(0);
}

if (mode !== 'write') {
	fail(`_new-writer.ts: unknown mode "${mode}"`);
}

if (existsSync(componentAbsPath)) {
	fail(`_new-writer.ts: ${componentAbsPath} already exists`);
}

// All-or-nothing: back up the two files we're editing, write everything,
// and restore from backup if anything after the first write throws.
const explainersBackup = `${EXPLAINERS_PATH}.bak`;
const registryBackup = `${REGISTRY_PATH}.bak`;
copyFileSync(EXPLAINERS_PATH, explainersBackup);
copyFileSync(REGISTRY_PATH, registryBackup);

try {
	writeFileSync(EXPLAINERS_PATH, newExplainersSrc);
	writeFileSync(REGISTRY_PATH, newRegistrySrc);
	writeFileSync(componentAbsPath, componentStub);
} catch (err) {
	copyFileSync(explainersBackup, EXPLAINERS_PATH);
	copyFileSync(registryBackup, REGISTRY_PATH);
	if (existsSync(componentAbsPath)) unlinkSync(componentAbsPath);
	fail(`_new-writer.ts: write failed, restored originals: ${err}`);
} finally {
	unlinkSync(explainersBackup);
	unlinkSync(registryBackup);
}

console.log(componentAbsPath);
