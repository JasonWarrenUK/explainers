import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// _new-writer.ts resolves its targets from its own location and writes at
// module scope, so it is exercised as a subprocess against a throwaway copy
// of the repo layout rather than imported. Each case checks the same three
// things: exit code, whether the two source files are intact or updated, and
// that no .bak file is left behind on any path.

// vitest runs from the project root; import.meta.url is not a plain file
// URL under its jsdom environment, so cwd is the reliable anchor here.
const REPO_ROOT = process.cwd();
const SCRIPT = join(REPO_ROOT, 'scripts/explain.d/_new-writer.ts');
const EXPLAINERS_REL = 'src/lib/data/explainers.ts';
const REGISTRY_REL = 'src/lib/components/explainers/registry.ts';

let sandbox: string;
let explainersPath: string;
let registryPath: string;
let componentsDir: string;

function run(mode: string, id: string): { status: number | null; stderr: string } {
	const result = spawnSync('bun', ['run', join(sandbox, 'scripts/explain.d/_new-writer.ts'), mode, id, 'Test Title', 'Test blurb.', 'alpha, beta'], {
		encoding: 'utf8'
	});
	return { status: result.status, stderr: result.stderr };
}

function strandedBackups(): string[] {
	return [explainersPath, registryPath].map((p) => `${p}.bak`).filter((p) => existsSync(p));
}

beforeEach(() => {
	sandbox = mkdtempSync(join(tmpdir(), 'new-writer-'));
	explainersPath = join(sandbox, EXPLAINERS_REL);
	registryPath = join(sandbox, REGISTRY_REL);
	componentsDir = join(sandbox, 'src/lib/components/explainers');
	mkdirSync(join(sandbox, 'scripts/explain.d'), { recursive: true });
	mkdirSync(join(sandbox, 'src/lib/data'), { recursive: true });
	mkdirSync(componentsDir, { recursive: true });
	cpSync(SCRIPT, join(sandbox, 'scripts/explain.d/_new-writer.ts'));
	cpSync(join(REPO_ROOT, EXPLAINERS_REL), explainersPath);
	cpSync(join(REPO_ROOT, REGISTRY_REL), registryPath);
});

afterEach(() => {
	// Undo any read-only directory a case set up, or rmSync cannot clear it.
	chmodSync(componentsDir, 0o755);
	rmSync(sandbox, { recursive: true, force: true });
});

describe('_new-writer.ts write', () => {
	it('appends to both files, creates the stub and leaves no backups', () => {
		const before = readFileSync(explainersPath, 'utf8');
		const { status } = run('write', 'sandbox-test');
		expect(status).toBe(0);
		expect(readFileSync(explainersPath, 'utf8')).toContain("id: 'sandbox-test'");
		expect(readFileSync(registryPath, 'utf8')).toContain("'sandbox-test': () => import('./SandboxTest.svelte')");
		expect(existsSync(join(componentsDir, 'SandboxTest.svelte'))).toBe(true);
		expect(readFileSync(explainersPath, 'utf8').length).toBeGreaterThan(before.length);
		expect(strandedBackups()).toEqual([]);
	});

	it('restores both files and leaves no backups when a write fails', () => {
		const explainersBefore = readFileSync(explainersPath, 'utf8');
		const registryBefore = readFileSync(registryPath, 'utf8');
		// Backups land beside their sources; the component stub is the only
		// write into this directory, so making it read-only fails the third
		// write after the first two have already gone through.
		chmodSync(componentsDir, 0o555);
		const { status, stderr } = run('write', 'blocked-write');
		expect(status).toBe(1);
		expect(stderr).toContain('write failed, restored originals');
		expect(readFileSync(explainersPath, 'utf8')).toBe(explainersBefore);
		expect(readFileSync(registryPath, 'utf8')).toBe(registryBefore);
		expect(strandedBackups()).toEqual([]);
	});

	it('reports a failed backup through fail() and leaves no backups', () => {
		const explainersBefore = readFileSync(explainersPath, 'utf8');
		// registry.ts lives in the read-only directory, so its .bak cannot be
		// created: the first backup succeeds, the second throws before any
		// source file is touched.
		chmodSync(componentsDir, 0o555);
		const { status, stderr } = run('write', 'blocked-backup');
		expect(status).toBe(1);
		expect(stderr).toContain('write failed, restored originals');
		expect(readFileSync(explainersPath, 'utf8')).toBe(explainersBefore);
		expect(strandedBackups()).toEqual([]);
	});
});
