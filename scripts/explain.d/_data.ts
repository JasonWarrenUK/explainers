#!/usr/bin/env bun
// _data.ts: the single point of contact between `explain` and the real data
// layer. Every command reads through this file rather than importing
// explainers.ts / registry.ts / collections.ts directly, so there is one
// place that knows the shapes and one place that formats output.
//
// Invocation: bun run _data.ts <query> [args...]
// Output:     tab-separated rows on stdout, one record per line, no header.
//             Tabs and newlines inside a field are stripped at the boundary.
// Errors:     message on stderr, exit 1, nothing on stdout.
//
// Queries: explainers | tags | collections
//          explainer <id> | tag <slug> | collection <id>
//          doctor | roadmap

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative, resolve, sep } from 'node:path';

const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

const {
	explainers,
	getExplainer,
	getExplainersByTag,
	getAllTags,
	getStaticParent
} = await import(join(REPO_ROOT, 'src/lib/data/explainers.ts'));
const { collections, getCollection, getCollectionForExplainer } = await import(
	join(REPO_ROOT, 'src/lib/data/collections.ts')
);
const { explainerComponents } = await import(
	join(REPO_ROOT, 'src/lib/components/explainers/registry.ts')
);

type Row = Array<string | number>;

// Strip tabs/newlines from a field so the TSV format can never break.
function clean(value: string | number): string {
	return String(value).replace(/[\t\n\r]+/g, ' ').trim();
}

function emit(rows: Row[]): void {
	for (const row of rows) {
		console.log(row.map(clean).join('\t'));
	}
}

function fail(message: string): never {
	console.error(message);
	process.exit(1);
}

function registryComponentPath(id: string): string | undefined {
	// registry.ts entries are `() => import('./relative/Path.svelte')`.
	// We recover the literal from the function's own source text rather than
	// re-parsing the file, since we already have the live import map.
	const fn = explainerComponents[id];
	if (!fn) return undefined;
	const match = fn.toString().match(/import\(['"](.+?)['"]\)/);
	return match?.[1];
}

// Walk every .svelte and .ts file under `root`, resolve each relative import
// specifier against the importing file and return the set of top-level
// directory names (relative to `root`) those imports land in. Imports that
// resolve outside `root`, or to a file at its top level, contribute nothing.
function importedTopLevelDirs(root: string): Set<string> {
	const dirs = new Set<string>();
	const specifierPattern = /(?:from\s*|import\s*\(\s*|import\s+)['"](\.[^'"]+)['"]/g;

	const walk = (dir: string): void => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const abs = join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(abs);
				continue;
			}
			if (!/\.(svelte|ts)$/.test(entry.name)) continue;
			const source = readFileSync(abs, 'utf8');
			for (const match of source.matchAll(specifierPattern)) {
				const resolved = relative(root, resolve(dir, match[1]));
				if (resolved.startsWith('..')) continue;
				const [first, ...rest] = resolved.split(sep);
				if (rest.length > 0) dirs.add(first);
			}
		}
	};

	walk(root);
	return dirs;
}

const [query, ...args] = process.argv.slice(2);

switch (query) {
	case 'explainers': {
		emit(
			explainers.map((e: any) => [e.id, e.title, e.tags.join(', ')])
		);
		break;
	}

	case 'explainer': {
		const [id] = args;
		if (!id) fail('explainer: missing id');
		const meta = getExplainer(id);
		if (!meta) fail(`explainer: no explainer "${id}"`);
		const collection = getCollectionForExplainer(id);
		const componentPath = registryComponentPath(id);
		const parent = getStaticParent(meta);
		emit([
			[
				meta.id,
				meta.title,
				meta.blurb,
				meta.tags.join(', '),
				collection ? collection.id : '',
				componentPath ?? '',
				componentPath ? 'ok' : 'missing',
				parent.label
			]
		]);
		break;
	}

	case 'tags': {
		const tags: string[] = getAllTags();
		emit(tags.map((t) => [t, getExplainersByTag(t).length]));
		break;
	}

	case 'tag': {
		const [slug] = args;
		if (!slug) fail('tag: missing slug');
		const matches = getExplainersByTag(slug);
		if (matches.length === 0) fail(`tag: no explainers tagged "${slug}"`);
		emit(matches.map((e: any) => [e.id, e.title, e.tags.join(', ')]));
		break;
	}

	case 'collections': {
		emit(
			collections.map((c: any) => [c.id, c.title, c.explainerIds.length])
		);
		break;
	}

	case 'collection': {
		const [id] = args;
		if (!id) fail('collection: missing id');
		const collection = getCollection(id);
		if (!collection) fail(`collection: no collection "${id}"`);
		emit([[collection.id, collection.title, collection.description]]);
		emit(
			collection.explainerIds.map((eid: string) => {
				const meta = getExplainer(eid);
				return [eid, meta ? meta.title : '(missing metadata)'];
			})
		);
		break;
	}

	case 'doctor': {
		const problems: string[] = [];
		const explainerIds = new Set<string>(explainers.map((e: any) => e.id as string));
		const registryIds = new Set<string>(Object.keys(explainerComponents));

		for (const id of explainerIds) {
			if (!registryIds.has(id)) {
				problems.push(`explainer "${id}" has metadata but no registry.ts entry`);
			}
		}
		for (const id of registryIds) {
			if (!explainerIds.has(id)) {
				problems.push(`registry.ts entry "${id}" has no metadata in explainers.ts`);
			}
		}
		for (const c of collections) {
			for (const eid of c.explainerIds) {
				if (!explainerIds.has(eid)) {
					problems.push(`collection "${c.id}" references unknown explainer "${eid}"`);
				}
			}
		}

		const registryFileDir = join(REPO_ROOT, 'src/lib/components/explainers');
		for (const id of registryIds) {
			const importPath = registryComponentPath(id);
			if (!importPath) continue;
			if (!existsSync(join(registryFileDir, importPath))) {
				problems.push(`registry.ts entry "${id}" imports missing file "${importPath}"`);
			}
		}

		// A top-level directory is accounted for when any explainer source file
		// (the registry, an entry component or a support module in another
		// directory) imports something inside it. That covers per-explainer
		// support directories, shared layers such as unhurried/ and formats/,
		// and entry components that sit one level above their own directory,
		// without hardcoding a list of any of them. What remains is a directory
		// nothing reaches, which is drift.
		const topLevelDirs = readdirSync(registryFileDir, { withFileTypes: true })
			.filter((d) => d.isDirectory())
			.map((d) => d.name);
		const importedDirs = importedTopLevelDirs(registryFileDir);
		for (const dir of topLevelDirs) {
			if (!importedDirs.has(dir)) {
				problems.push(`directory "${dir}" is imported by nothing under components/explainers`);
			}
		}

		emit(problems.map((p) => ['problem', p]));
		if (problems.length > 0) process.exit(1);
		break;
	}

	case 'roadmap': {
		const roadmapPath = join(REPO_ROOT, '.claude/roadmaps.json');
		if (!existsSync(roadmapPath)) {
			fail('roadmap: .claude/roadmaps.json not found (gitignored; run on a machine that has it)');
		}
		const roadmaps = JSON.parse(readFileSync(roadmapPath, 'utf8'));
		for (const roadmap of roadmaps) {
			for (const milestone of roadmap.milestones) {
				const counts: Record<string, number> = {};
				for (const task of milestone.tasks) {
					counts[task.status] = (counts[task.status] ?? 0) + 1;
				}
				const countStr = Object.entries(counts)
					.map(([status, n]) => `${status}:${n}`)
					.join(' ');
				emit([[roadmap.name, milestone.id, milestone.name, countStr]]);
			}
			const doneIds = new Set(
				roadmap.milestones.flatMap((m: any) =>
					m.tasks.filter((t: any) => t.status === 'done').map((t: any) => t.id)
				)
			);
			const unblocked = roadmap.milestones.flatMap((m: any) =>
				m.tasks.filter(
					(t: any) =>
						t.status === 'todo' && t.dependsOn.every((dep: string) => doneIds.has(dep))
				)
			);
			emit(unblocked.map((t: any) => ['unblocked', t.id, t.description]));
		}
		break;
	}

	default:
		fail(`_data.ts: unknown query "${query ?? ''}"`);
}
