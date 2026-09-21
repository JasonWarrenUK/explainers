<script lang="ts">
	import { browser } from '$app/environment';
	import { BANDS, INFO, LAMBDAS, derive } from './model';
	import type { BandKey, DeriveResult, SimParams } from './model';
	import { CATALOGUE, CONTROLS, CUSTOM_LABEL, DEFAULTS, DOSSIER, PRESETS } from './data';
	import type { PresetParams } from './data';
	import { combos, comboParams, provenance } from './combinations';
	import type { Combo, ComboStatus } from './combinations';
	import { clarity, convergence, fluorescence, rarity } from './facts';
	import { solve } from './solver';
	import Controls from './Controls.svelte';
	import Stone from './Stone.svelte';
	import Spectrum from './Spectrum.svelte';

	type TabId = 'simulate' | 'catalogue' | 'combos' | 'types' | 'grades';
	const TABS: { id: TabId; label: string; n: string }[] = [
		{ id: 'simulate', label: 'Simulate', n: '01' },
		{ id: 'catalogue', label: 'Colours', n: '02' },
		{ id: 'combos', label: 'Combinations', n: '03' },
		{ id: 'types', label: 'Types', n: '04' },
		{ id: 'grades', label: 'Grades', n: '05' }
	];
	let tab = $state<TabId>('simulate');

	const STATUS_LABEL: Record<ComboStatus, string> = {
		documented: 'documented',
		possible: 'possible, no example known',
		cancels: 'cancels out',
		substitutes: 'substitutes',
		zoned: 'zoned, not blended'
	};

	// ---- simulator sim ----
	let sim = $state<SimParams>({ ...DEFAULTS });
	let presetIndex = $state(0);
	let pinned = $state<{ sim: SimParams; res: DeriveResult } | null>(null);
	let uv = $state(false);
	let hoverBand = $state<BandKey | null>(null);
	let playing = $state(false);
	let loadNote = $state<string[] | null>(null);
	let flashText = $state<string | null>(null);
	let flashTimer: ReturnType<typeof setTimeout> | undefined;
	let targetHex = $state('#c6a4d6');
	let solverLines = $state<string[] | null>(null);
	let raf = 0;
	let animRaf = 0;

	const res = $derived(derive(sim));
	const displayName = $derived(res.zone ? res.desc.name + ' and ' + res.zone.desc.name + ', zoned' : res.desc.name);
	const displayGrade = $derived(res.zone ? res.faceUp.desc.grade + ' face-up, zoning noted' : res.desc.grade);
	const swatchBg = $derived(res.zone ? `linear-gradient(135deg,${res.hex} 0 50%,${res.zone.hex} 50% 100%)` : res.hex);
	const rarityInfo = $derived(rarity(res, sim));
	const clarityText = $derived(clarity(sim, res));
	const fluorText = $derived(fluorescence(res) + (uv ? '. The stone is shown under the lamp; ' + (res.flStrength > 0.05 ? 'what glows is what you see' : 'it is inert, so it goes dark') : ''));
	const defectRows = $derived(
		Object.entries(res.amps)
			.filter(([, v]) => (v ?? 0) > 0.04)
			.sort((x, y) => (y[1] ?? 0) - (x[1] ?? 0))
			.map(([k, v]) => ({ key: k as BandKey, amt: v ?? 0, weight: (v ?? 0) < 0.15 ? 'trace' : (v ?? 0) < 0.5 ? 'moderate' : (v ?? 0) < 1.2 ? 'strong' : 'dominant' }))
	);
	const convergenceNotes = $derived(convergence(sim, res));
	const nitrogenState = $derived(
		sim.nitrogen < 5
			? 'no nitrogen to speak of'
			: Math.round(res.nIso) + ' ppm single, ' + Math.round(res.nA) + ' ppm A pairs, ' + Math.round(res.nB) + ' ppm B aggregates' +
					(res.zone && res.zone.kind === 'ib' ? '; the late sector keeps all ' + Math.round(sim.nitrogen) + ' ppm single' : '')
	);
	const prov = $derived(provenance(res, sim));
	const provClass = $derived(prov.label.split(',')[0].replace(/ /g, '-'));

	function bandGradient(k: BandKey): string {
		const mx = Math.max(...LAMBDAS.map((l) => BANDS[k](l)), 1e-6);
		const stops: string[] = [];
		for (let i = 0; i <= 16; i++) {
			const l = 380 + i * 25;
			const v = BANDS[k](l) / mx;
			stops.push(`rgba(255,255,255,${(0.12 + 0.8 * v).toFixed(2)}) ${(i / 16) * 100}%`);
		}
		return 'linear-gradient(90deg,' + stops.join(',') + ')';
	}
	function modelInfo(k: BandKey) {
		return INFO[k];
	}

	function setCustom() {
		presetIndex = -1;
	}
	function loadParams(params: Partial<SimParams>, idx: number, notes: string[] | null) {
		Object.assign(sim, DEFAULTS, params);
		sim.warm = false;
		stopPlay();
		presetIndex = idx;
		loadNote = notes && notes.length ? notes : null;
	}
	function loadPreset(i: number) {
		loadParams(PRESETS[i][1], i, null);
	}
	function loadCombo(c: Combo) {
		const { p, notes } = comboParams(c.keys);
		loadParams(p, -1, [
			'Loaded ' + c.names.join(' + ') + ' at moderate amounts. The simulator runs the full kinetics, so the result can differ from the fixed-amplitude swatch in the table.',
			...notes
		]);
		tab = 'simulate';
	}
	function onPresetChange(e: Event) {
		const v = (e.target as HTMLSelectElement).value;
		if (v !== 'custom') loadPreset(Number(v));
	}
	function onControlsChange() {
		setCustom();
	}

	// ---- residence playback ----
	let playStart = 0;
	const PLAY_DUR = 9000;
	function togglePlay() {
		if (playing) stopPlay();
		else startPlay();
	}
	function startPlay() {
		const c = CONTROLS[1].items[1] as { min: number; max: number };
		const lo = Math.log(c.min),
			hi = Math.log(c.max);
		playStart = performance.now();
		setCustom();
		playing = true;
		const step = (now: number) => {
			const u = Math.min(1, (now - playStart) / PLAY_DUR);
			sim.time = Math.exp(lo + u * (hi - lo));
			if (u < 1) animRaf = requestAnimationFrame(step);
			else stopPlay();
		};
		animRaf = requestAnimationFrame(step);
	}
	function stopPlay() {
		if (animRaf) cancelAnimationFrame(animRaf);
		playing = false;
	}

	// ---- pin and compare ----
	function pin() {
		pinned = { sim: { ...sim }, res };
	}
	function unpin() {
		pinned = null;
	}
	function loadPinned() {
		if (pinned) loadParams(pinned.sim, -1, null);
	}

	// ---- share / export ----
	const KEYS = Object.keys(DEFAULTS) as (keyof SimParams)[];
	function recipeCode(): string {
		return KEYS.filter((k) => sim[k] !== DEFAULTS[k])
			.map((k) => k + '=' + (typeof sim[k] === 'number' ? Math.round((sim[k] as number) * 100) / 100 : sim[k]))
			.join('&');
	}
	function applyCode(code: string): Partial<SimParams> | null {
		const p: Partial<SimParams> = {};
		let any = false;
		code.split('&').forEach((kv) => {
			const [k, v] = kv.split('=');
			if (!(k in DEFAULTS)) return;
			any = true;
			const dv = DEFAULTS[k as keyof SimParams];
			(p as Record<string, unknown>)[k] = typeof dv === 'number' ? Number(v) : typeof dv === 'boolean' ? v === 'true' : v;
		});
		return any ? p : null;
	}
	function flash(t: string) {
		flashText = t;
		clearTimeout(flashTimer);
		flashTimer = setTimeout(() => (flashText = null), 2200);
	}
	async function share() {
		const code = recipeCode() || 'defaults';
		try {
			await navigator.clipboard.writeText(code);
			flash('Recipe code copied. Paste it with Load recipe.');
		} catch {
			window.prompt('Copy this', code);
		}
	}
	function pasteRecipe() {
		const code = window.prompt('Paste a recipe code');
		if (!code) return;
		const p = applyCode(code.includes('#') ? code.split('#')[1] : code);
		if (p) loadParams(p, -1, ['Loaded a pasted recipe.']);
		else flash('That did not look like a recipe');
	}
	function download(name: string, text: string, type: string) {
		const a = document.createElement('a');
		a.href = URL.createObjectURL(new Blob([text], { type }));
		a.download = name;
		a.click();
		setTimeout(() => URL.revokeObjectURL(a.href), 1000);
	}
	function exportJson() {
		download(
			'diamond-recipe.json',
			JSON.stringify(
				{
					params: sim,
					result: { name: displayName, grade: displayGrade, type: res.type, hex: res.hex, lab: res.lab.map((v) => Math.round(v * 10) / 10) },
					code: recipeCode()
				},
				null,
				2
			),
			'application/json'
		);
	}
	async function copySummary() {
		const t = `${displayName}, ${displayGrade}, Type ${res.type}, ${sim.carats} ct. ${prov.label}.`;
		try {
			await navigator.clipboard.writeText(t);
			flash('Summary copied');
		} catch {
			flash(t);
		}
	}

	// ---- reverse solver ----
	function runSolver() {
		const r = solve(targetHex, sim.carats);
		const verdict = r.dE < 8 ? 'reached' : r.dE < 20 ? 'close, with a visible difference' : 'out of reach for this model';
		const lines = ['Nearest recipe to ' + targetHex + ': ' + r.reached.desc.name + ' (' + r.reached.desc.grade + '), colour distance ΔE ' + r.dE.toFixed(1) + ', ' + verdict + '.'];
		if (r.dE >= 8)
			lines.push(
				'What the model cannot do here: it only has these colour centres at these band shapes, and the mantle kinetics link nitrogen state to residence. A colour outside that gamut will always stop short.'
			);
		loadParams(r.params, -1, lines);
	}

	// ---- combinations tab ----
	// combos() runs the spectral model 511 times; compute once and cache outside reactivity so
	// opening the tab doesn't re-run it, and no reader who never opens the tab pays for it.
	let combosCache: Combo[] | undefined;
	function getCombos(): Combo[] {
		if (!combosCache) combosCache = combos();
		return combosCache;
	}
	let comboOrder = $state(2);
	let comboFilter = $state<'all' | ComboStatus>('all');
	let comboSort = $state<'order' | 'hue' | 'light' | 'chroma' | 'status'>('order');
	let comboQuery = $state('');
	const comboRows = $derived.by(() => {
		if (tab !== 'combos') return [];
		const all = getCombos();
		const q = comboQuery.trim().toLowerCase();
		let rows = all.filter(
			(c) => c.order <= comboOrder && (comboFilter === 'all' || c.status === comboFilter) && (!q || c.desc.name.includes(q) || c.names.join(' ').toLowerCase().includes(q))
		);
		const statusOrder = Object.keys(STATUS_LABEL);
		const key: ((c: Combo) => number) | null = { hue: (c: Combo) => c.desc.h, light: (c: Combo) => -c.desc.L, chroma: (c: Combo) => -c.desc.C, status: (c: Combo) => statusOrder.indexOf(c.status), order: (c: Combo) => c.order }[comboSort];
		if (key) rows = rows.slice().sort((a, b) => key(a) - key(b));
		return rows;
	});
	const comboTotal = $derived(tab === 'combos' ? getCombos().length : 0);

	function catalogueRes(entry: (typeof CATALOGUE)[number]): DeriveResult {
		const params = entry.preset != null ? PRESETS[entry.preset][1] : (entry.params as PresetParams);
		return derive({ ...DEFAULTS, ...params });
	}
	function dossierRes(entry: (typeof DOSSIER)[number]): DeriveResult {
		return derive({ ...DEFAULTS, ...entry.params });
	}

	$effect(() => {
		if (!browser) return;
		res;
		if (pinned) drawPinned();
	});
	function drawPinned() {
		// Stone.svelte handles its own render reactively; this effect exists only to note the
		// dependency so pinned redraws happen when uv toggles.
		uv;
	}

	// ---- initial hash load (recipe code only; no history writes, per share/paste flow) ----
	if (browser) {
		try {
			const h = window.location.hash;
			if (h && h.length > 1) {
				const p = applyCode(h.slice(1));
				if (p) {
					Object.assign(sim, p);
					presetIndex = -1;
				}
			}
		} catch {
			// sandboxed viewers may refuse hash access; Share/Load recipe still work
		}
	}
</script>

<svelte:head>
	<title>Colour Is a Defect</title>
	<meta name="color-scheme" content="dark" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Barlow+Condensed:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Barlow:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="page">
	<header class="masthead">
		<div class="plate">Diamond Colour Simulator</div>
		<h1>Colour Is a <em>Defect</em></h1>
		<p class="lede">
			A perfect diamond lattice is colourless. Every colour is something that went wrong: the wrong atom, a missing one, a shear through the
			crystal, a stray neutron. Set what the mantle did and read the grade.
		</p>
	</header>

	<nav class="tabs" role="tablist">
		{#each TABS as t (t.id)}
			<button class="tab" class:on={tab === t.id} role="tab" data-n={t.n} aria-selected={tab === t.id} onclick={() => (tab = t.id)}>{t.label}</button>
		{/each}
	</nav>

	{#if tab === 'simulate'}
		<section class="panel">
			<div class="toolbar">
				<label><span class="visually-hidden">Start from</span>
					<select value={presetIndex >= 0 ? String(presetIndex) : 'custom'} onchange={onPresetChange} aria-label="Start from a preset">
						{#each PRESETS as [n], i (n)}
							<option value={String(i)}>{n}</option>
						{/each}
						<option value="custom" disabled>{CUSTOM_LABEL}</option>
					</select>
				</label>
				<button type="button" onclick={() => loadPreset(0)}>Reset</button>
			</div>
			<div class="actions">
				<button type="button" onclick={pin}>{pinned ? 'Re-pin' : 'Pin to compare'}</button>
				<button type="button" class:on={uv} aria-pressed={uv} onclick={() => (uv = !uv)}>UV lamp</button>
				<button type="button" onclick={share}>Share</button>
				<button type="button" onclick={pasteRecipe}>Load recipe</button>
				<button type="button" onclick={exportJson}>JSON</button>
				<button type="button" onclick={copySummary}>Copy summary</button>
				<span class="solver">
					<label for="target">Solve for</label>
					<input type="color" id="target" bind:value={targetHex} />
					<button type="button" onclick={runSolver}>Nearest recipe</button>
				</span>
			</div>
			{#if flashText}<div class="flash">{flashText}</div>{/if}
			{#if loadNote}
				<div class="load-note">
					{#each loadNote as line (line)}<p>{line}</p>{/each}
					<button type="button" class="dismiss" aria-label="Dismiss" onclick={() => (loadNote = null)}>×</button>
				</div>
			{/if}

			<div class="sim">
				<Controls {sim} playingKey={playing ? 'time' : null} onchange={onControlsChange} ontogglePlay={togglePlay} />

				<aside class="results">
					<div class="hero">
						<div class="stone-wrap">
							<div class="window"><Stone {res} params={sim} {uv} label="Rendered stone, top view" /></div>
							<div class="verdict">
								<div aria-live="polite">
									<div class="name">{displayName}</div>
									<div class="grade"><span class="swatch" style="background:{swatchBg}"></span><span>{displayGrade}</span></div>
								</div>
								<button type="button" class="type" title="What the types mean" onclick={() => (tab = 'types')}>Type {res.type}</button>
								<div class="lab-readout">L {res.desc.L.toFixed(0)}, chroma {res.desc.C.toFixed(0)}, hue {res.desc.h.toFixed(0)}°</div>
								{#if res.chameleon}
									<button type="button" id="warm" class:on={sim.warm} onclick={() => { sim.warm = !sim.warm; }}>
										{sim.warm ? 'Let it cool' : 'Warm the stone'}
									</button>
								{/if}
							</div>
						</div>
						<div class="spectrum">
							<Spectrum {res} {hoverBand} />
							<div class="spec-axis"><span>380 nm</span><span>Lines mark centres present</span><span>780 nm</span></div>
						</div>
						<div class="prov {provClass}"><span class="prov-label">{prov.label}</span> <span>{prov.detail}</span></div>
						{#if pinned}
							<div class="pinned">
								<div class="window small"><Stone res={pinned.res} params={pinned.sim} {uv} small label="Pinned stone" /></div>
								<div class="pinned-body">
									<h3>Pinned</h3>
									<div class="pinned-name">{pinned.res.zone ? pinned.res.desc.name + ' and ' + pinned.res.zone.desc.name : pinned.res.desc.name}</div>
									<div class="grade"><span class="sw" style="background:{pinned.res.hex}"></span><span>{pinned.res.faceUp.desc.grade}</span></div>
									<div class="pinned-actions">
										<button type="button" class="link" onclick={loadPinned}>Load</button>
										<button type="button" class="link" onclick={unpin}>Clear</button>
									</div>
								</div>
							</div>
						{/if}
					</div>
					<div class="facts">
						<div class="fact"><h3>Nitrogen After Residence</h3><p>{nitrogenState}</p></div>
						<div class="fact">
							<h3>Colour Centres</h3>
							<ul>
								{#each defectRows as row (row.key)}
									{@const info = modelInfo(row.key)}
									<li class:hot={hoverBand === row.key} onmouseenter={() => (hoverBand = row.key)} onmouseleave={() => (hoverBand = null)}>
										<button
											type="button"
											class="defect-toggle"
											onclick={() => (hoverBand = hoverBand === row.key ? null : row.key)}
											aria-pressed={hoverBand === row.key}
										>
											<b>{info.label}</b><span class="amt">{row.weight}</span>
											<span class="band" style="background:{bandGradient(row.key)}" title="absorption across 380 to 780 nm"></span>
											<span class="det">{info.detail}</span>
										</button>
									</li>
								{:else}
									<li class="none">no colour centres above trace level</li>
								{/each}
							</ul>
						</div>
						{#if convergenceNotes.length}
							<div class="fact"><h3>Where Causes Meet</h3><ul>{#each convergenceNotes as n (n)}<li>{n}</li>{/each}</ul></div>
						{/if}
						<div class="fact">
							<h3>Rarity</h3>
							<div>
								<div class="bar"><i style="width:{rarityInfo.tier * 20}%"></i></div>
								<p><span>{rarityInfo.label}</span></p>
								<p>{rarityInfo.why}</p>
							</div>
						</div>
						<div class="fact"><h3>Clarity</h3><p>{clarityText}</p></div>
						<div class="fact"><h3>Fluorescence</h3><p>{fluorText}</p></div>
					</div>
				</aside>
			</div>
			<p class="model-note">
				The colour comes from a spectral model. Each centre contributes an absorption band; the bands sum; the transmitted light is
				converted to a colour the way a spectrophotometer would do it. The band shapes are illustrative, chosen so that each centre alone
				reproduces its documented hue, and the nitrogen aggregation kinetics are qualitative. Grade thresholds approximate GIA practice. The
				pink-versus-brown partition is a slider because the literature has not settled it.
			</p>
		</section>
	{:else if tab === 'catalogue'}
		<section class="panel">
			<h2>Every Documented Body Colour</h2>
			<p class="lede">Eighteen colours, each with its mechanism, its diamond type and the stones that made it famous. The swatch beside each is what the simulator produces for that recipe.</p>
			<div>
				{#each CATALOGUE as c (c.name)}
					{@const r = catalogueRes(c)}
					<article class="cat">
						<div class="cat-swatch" style="background:{r.hex}"></div>
						<div class="cat-body">
							<h3>{c.name}</h3>
							<p class="cat-type">Type {c.type}</p>
							<p>{c.cause}</p>
							<p class="cat-ex">{c.examples}</p>
							<button type="button" class="link" onclick={() => { loadParams(c.preset != null ? PRESETS[c.preset][1] : (c.params as PresetParams), c.preset ?? -1, ['Loaded the ' + c.name.toLowerCase() + ' recipe from the catalogue.']); tab = 'simulate'; }}>Load into the simulator</button>
						</div>
					</article>
				{/each}
			</div>
			<h2 class="sub">Famous Stones</h2>
			<p class="lede">Carat weights and lab colour descriptions are published figures. The slider recipe is the model's, and its grade is printed beside the lab's so the gap is visible. Where I am unsure of a published number the note says so.</p>
			<div>
				{#each DOSSIER as s (s.name)}
					{@const r = dossierRes(s)}
					<article class="cat dossier">
						<div class="cat-swatch" style="background:{r.hex}"></div>
						<div class="cat-body">
							<h3>{s.name}</h3>
							<p class="cat-type">{s.carats} ct, Type {s.type}</p>
							<p><span class="kv">Lab: </span>{s.lab}<br /><span class="kv">Model: </span>{r.desc.grade}{s.params.carats && s.params.carats < s.carats ? ' at ' + s.params.carats + ' ct' : ''}</p>
							{#if s.note}<p class="cat-ex">{s.note}</p>{/if}
							<button type="button" class="link" onclick={() => { loadParams(s.params, -1, ['Loaded the ' + s.name + ' recipe. The carat weight and lab colour are published; the slider positions are the model\'s guess at reproducing them.']); tab = 'simulate'; }}>Load into the simulator</button>
						</div>
					</article>
				{/each}
			</div>
		</section>
	{:else if tab === 'combos'}
		<section class="panel">
			<h2>Every Combination of the Nine Elemental Causes</h2>
			<p class="legend">
				Nine independent colour centres give 511 non-empty combinations. Each is run through the same spectral model with the total absorbance
				of any pairing or larger set capped near that of a strong single cause, so a five-way combination reads as a colour and not as mud;
				the name is what the model would call it. Every row can be loaded into the simulator.
			</p>
			<dl class="statuses">
				<dt>Documented</dt><dd>I know of natural stones showing this pairing. My own assessment; it will have omissions.</dd>
				<dt>Possible, no example known</dt><dd>Nothing in the chemistry forbids it. I know of no natural stone that shows it.</dd>
				<dt>Cancels out</dt><dd>One cause chemically neutralises another, so the blended colour cannot exist. The row says which cause loses and is rendered without it.</dd>
				<dt>Substitutes</dt><dd>The conditions that would make one centre make a different one instead. The row says what forms and is rendered with that.</dd>
				<dt>Zoned, not blended</dt><dd>Both causes can occur in one crystal, in separate growth sectors. The stone is two-toned and the swatch shows both zones.</dd>
			</dl>
			<div class="combo-tools">
				<label>Up to
					<select bind:value={comboOrder}>
						<option value={1}>1 cause</option>
						<option value={2}>2 causes</option>
						<option value={3}>3 causes</option>
						<option value={4}>4 causes</option>
						<option value={9}>all 9</option>
					</select>
				</label>
				<label>Show
					<select bind:value={comboFilter}>
						<option value="all">all</option>
						<option value="documented">documented</option>
						<option value="possible">possible, no example known</option>
						<option value="cancels">cancels out</option>
						<option value="substitutes">substitutes</option>
						<option value="zoned">zoned, not blended</option>
					</select>
				</label>
				<label>Sort
					<select bind:value={comboSort}>
						<option value="order">by causes</option>
						<option value="hue">by hue</option>
						<option value="light">by lightness</option>
						<option value="chroma">by saturation</option>
						<option value="status">by status</option>
					</select>
				</label>
				<input type="search" bind:value={comboQuery} placeholder="filter by colour or cause" aria-label="Filter combinations" />
				<span>{comboRows.length} of {comboTotal} combinations</span>
			</div>
			<div>
				{#each comboRows as c (c.keys.join('+'))}
					<div class="combo {c.status}">
						<div class="combo-sw" style={c.zones ? `background:linear-gradient(135deg,${c.zones[0].hex} 0 50%,${c.zones[1].hex} 50% 100%)` : `background:${c.hex}`}></div>
						<div class="combo-body">
							<div class="combo-name">{c.desc.name}<span class="combo-status">{STATUS_LABEL[c.status]}</span></div>
							<div class="combo-causes">{c.names.join(' + ')}</div>
							{#if c.why}<div class="combo-why">{c.why}</div>{/if}
							<button type="button" class="link" onclick={() => loadCombo(c)}>Load into the simulator</button>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{:else if tab === 'types'}
		<section class="panel">
			<h2>Types Are Chemistry; Grades Are Appearance</h2>
			<p class="lede">The D to Z scale and the fancy grades describe what a stone looks like. The type system describes what is in the lattice, and it predicts which colours are available at all.</p>
			<div class="types">
				<article>
					<h3>Type I: Contains Nitrogen</h3>
					<p>About 98% of natural diamond. Nitrogen swaps in for carbon during growth, and the colour depends on how those nitrogen atoms are arranged; the mantle rearranges them over time.</p>
					<dl>
						<dt>Ib</dt><dd>Nitrogen atoms sit alone (C centres). Strongly yellow to orange at a few ppm. Survives only when the stone left the mantle young or sat somewhere cool: under 0.1% of naturals, and nearly every HPHT synthetic starts here.</dd>
						<dt>IaA</dt><dd>Nitrogen has paired up (A centres). Pairs absorb only in the infrared, so IaA on its own is colourless. This is the first thing heat and time do to Ib material.</dd>
						<dt>IaB</dt><dd>Pairs have gathered into fours round a vacancy (B centres). Colourless in themselves, but N3 centres form alongside them and those are Cape yellow. Billions of years of hot residence.</dd>
						<dt>IaAB</dt><dd>Both, which covers most gem diamond. The simulator reports the balance under Nitrogen After Residence.</dd>
					</dl>
				</article>
				<article>
					<h3>Type II: No Measurable Nitrogen</h3>
					<p>About 2%. Grown from nitrogen-poor fluids, often deeper. Large, clean stones are disproportionately Type II.</p>
					<dl>
						<dt>IIa</dt><dd>Carbon and near enough nothing else. Colourless unless deformed: brown from vacancy clusters, or the pink and red of Golconda and the Pink Star. The Cullinan and the Koh-i-Noor are IIa.</dd>
						<dt>IIb</dt><dd>Boron in place of nitrogen. Blue, and the only diamond that conducts electricity. Boron shows only when there is no single nitrogen to cancel it, which is why blue is a Type II colour. The Hope is IIb.</dd>
					</dl>
				</article>
			</div>
			<p class="legend">The letters come from infrared absorption: a lab measures which bands are present and assigns the type from that. It classifies impurities, so a stone can be mixed type when its sectors grew from different fluids.</p>
		</section>
	{:else if tab === 'grades'}
		<section class="panel">
			<h2>How a Lab Describes Colour</h2>
			<p class="lede">Two scales, one for stones meant to be colourless and one for stones meant to be coloured, and they meet at Z.</p>
			<div class="types">
				<article>
					<h3>D to Z</h3>
					<p>For yellow, brown and grey tints on stones sold as white. The letter says how far from colourless the stone is, judged against master stones under controlled light.</p>
					<dl>
						<dt>D, E, F</dt><dd>Colourless. Differences are visible only to a grader with masters to hand.</dd>
						<dt>G to J</dt><dd>Near colourless. Face-up the stone reads white; the tint shows from the side against a white card.</dd>
						<dt>K to M</dt><dd>Faint. The tint is visible face-up in a well-cut stone of any size.</dd>
						<dt>N to R</dt><dd>Very light.</dd>
						<dt>S to Z</dt><dd>Light. Past Z the same tint stops being a defect and becomes a fancy colour, which is why a Z yellow is cheaper than a Fancy Light yellow that looks only slightly stronger.</dd>
					</dl>
				</article>
				<article>
					<h3>Fancy Grades</h3>
					<p>For every other colour, and for yellow and brown past Z. The grade is a position in a space of hue, tone and saturation. Hue is the colour name; tone is lightness; saturation is strength.</p>
					<dl>
						<dt>Faint, Very Light, Light</dt><dd>Low saturation, light tone. Used for colours other than yellow and brown, where D to Z does not apply.</dd>
						<dt>Fancy Light, Fancy, Fancy Intense, Fancy Vivid</dt><dd>Rising saturation at a medium-light tone. Vivid is the top of the ladder for most hues.</dd>
						<dt>Fancy Dark</dt><dd>Dark tone, low saturation. Most dark greys and browns.</dd>
						<dt>Fancy Deep</dt><dd>Dark tone, strong saturation. The Hope is Fancy Deep greyish blue.</dd>
					</dl>
					<p>Modifiers come before the hue: brownish pink, greenish yellow. A modifier says which way the hue leans, and every modifier lowers the price except on a pink, where purplish is prized.</p>
				</article>
				<article>
					<h3>Clarity</h3>
					<p>Separate from colour, graded at ten times magnification. The simulator reports it only where a formation factor caps it.</p>
					<dl>
						<dt>FL, IF</dt><dd>Flawless, internally flawless.</dd>
						<dt>VVS, VS</dt><dd>Very very slightly and very slightly included. Graining from plastic deformation usually lands a stone here.</dd>
						<dt>SI</dt><dd>Slightly included: visible at 10x, sometimes to the eye.</dd>
						<dt>I</dt><dd>Included, visible to the eye. Opaque clouds of graphite or sulphide sit here or beyond it.</dd>
					</dl>
				</article>
				<article>
					<h3>Units in the Simulator</h3>
					<dl>
						<dt>ppm</dt><dd>Parts per million by atom count. A thousand ppm of nitrogen is one nitrogen for every thousand carbons, which is a lot; a fraction of a ppm of boron is enough for blue.</dd>
						<dt>Myr</dt><dd>Millions of years of mantle residence. Most gem diamonds are one to three billion years old.</dd>
						<dt>L, chroma, hue</dt><dd>The CIELAB position the model grades from. L is lightness out of 100, chroma is saturation, hue is the angle round the colour wheel.</dd>
						<dt>ΔE</dt><dd>Distance between two CIELAB colours. Below about 2 is imperceptible; 8 is a clearly different shade; 20 is a different colour.</dd>
					</dl>
				</article>
			</div>
		</section>
	{/if}
</div>

<style>
	:root {
		--bg: #0b0b0d;
		--bg2: #101013;
		--rule: #2a2a2f;
		--rule2: #3b3b42;
		--ink: #ececec;
		--mute: #9a9aa3;
		--dim: #5e5e68;
		--ok: #9dcf9b;
		--warn: #e0b07a;
		--focus: #ececec;
		--display: 'Bodoni Moda', Didot, 'Times New Roman', serif;
		--label: 'Barlow Condensed', 'Arial Narrow', sans-serif;
		--mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;
		--body: 'Barlow', system-ui, sans-serif;
	}
	.page {
		background: var(--bg);
		color: var(--ink);
		font-family: var(--body);
		font-size: 16px;
		line-height: 1.5;
		min-height: 100vh;
		padding: 0 18px 80px;
	}
	.page :global(*) {
		box-sizing: border-box;
	}
	.page > :global(*) {
		max-width: 1120px;
		margin-inline: auto;
	}
	h1,
	h2,
	h3 {
		margin: 0;
		font-weight: 400;
		line-height: 1.05;
	}
	h1 {
		font-family: var(--display);
		font-size: clamp(2.6rem, 9vw, 4.6rem);
		letter-spacing: -0.015em;
		margin-top: 26px;
	}
	h1 :global(em) {
		font-style: italic;
		font-weight: 400;
	}
	h2 {
		font-family: var(--display);
		font-size: clamp(1.6rem, 4.5vw, 2.2rem);
		margin: 6px 0 10px;
	}
	h3 {
		font-family: var(--label);
		font-size: 0.82rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--mute);
		font-weight: 600;
	}
	p {
		margin: 0.4em 0;
	}
	button,
	select,
	input,
	:global(output) {
		font: inherit;
		color: inherit;
	}
	button {
		cursor: pointer;
		background: none;
		border: 1px solid var(--rule2);
		border-radius: 0;
		padding: 7px 14px;
		font-family: var(--label);
		font-size: 0.9rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	button:hover {
		border-color: var(--ink);
	}
	button:focus-visible,
	input:focus-visible,
	select:focus-visible {
		outline: 1px solid var(--focus);
		outline-offset: 3px;
	}
	.lab-readout,
	:global(output) {
		font-family: var(--mono);
		font-variant-numeric: tabular-nums;
	}
	.lede {
		color: var(--mute);
		max-width: 58ch;
		margin: 14px 0 26px;
		font-size: 1.05rem;
		line-height: 1.55;
	}
	.masthead {
		border-bottom: 1px solid var(--rule);
		padding-bottom: 4px;
		position: relative;
	}
	.masthead .plate {
		font-family: var(--label);
		font-size: 0.78rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--dim);
		margin-top: 24px;
	}
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	/* tabs as an instrument selector */
	.tabs {
		display: flex;
		gap: 0;
		margin: 0 0 26px;
		border-bottom: 1px solid var(--rule);
		overflow-x: auto;
		scrollbar-width: none;
	}
	.tab {
		border: 0;
		border-bottom: 2px solid transparent;
		padding: 14px 2px 10px;
		margin-right: 18px;
		color: var(--mute);
		white-space: nowrap;
		letter-spacing: 0.1em;
		font-size: 0.82rem;
	}
	@media (min-width: 640px) {
		.tab {
			margin-right: 26px;
			letter-spacing: 0.14em;
			font-size: 0.86rem;
		}
	}
	.tab::before {
		content: attr(data-n) ' ';
		color: var(--dim);
		font-family: var(--mono);
		letter-spacing: 0;
		margin-right: 4px;
	}
	.tab.on {
		color: var(--ink);
		border-bottom-color: var(--ink);
	}
	.tab.on::before {
		color: var(--ink);
	}

	/* toolbar */
	.toolbar {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 10px;
		align-items: stretch;
		margin-bottom: 18px;
	}
	.toolbar label {
		display: contents;
	}
	select {
		background: var(--bg2);
		color: var(--ink);
		border: 1px solid var(--rule2);
		border-radius: 0;
		padding: 9px 34px 9px 12px;
		appearance: none;
		background-image:
			linear-gradient(45deg, transparent 50%, var(--mute) 50%), linear-gradient(135deg, var(--mute) 50%, transparent 50%);
		background-position:
			calc(100% - 18px) 55%,
			calc(100% - 13px) 55%;
		background-size: 5px 5px;
		background-repeat: no-repeat;
		max-width: 100%;
		min-width: 0;
	}
	.load-note {
		border-left: 2px solid var(--warn);
		padding: 6px 14px;
		margin: 0 0 16px;
		font-size: 0.92rem;
		color: var(--mute);
		position: relative;
		padding-right: 40px;
	}
	.load-note :global(p) {
		margin: 0.25em 0;
	}
	.load-note .dismiss {
		position: absolute;
		top: 4px;
		right: 6px;
		border: 0;
		font-size: 1.1rem;
		padding: 2px 6px;
		color: var(--mute);
	}

	/* simulate layout */
	.sim {
		display: flex;
		flex-direction: column;
		gap: 26px;
	}
	.hero {
		padding: 0 0 14px;
		border-bottom: 1px solid var(--rule);
	}
	@media (min-width: 880px) {
		.sim {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 440px;
			align-items: start;
			gap: 40px;
		}
		.results {
			position: sticky;
			top: 12px;
		}
	}
	.stone-wrap {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 18px;
		align-items: center;
	}
	.window {
		position: relative;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background: radial-gradient(circle at 50% 45%, #232327 0, #0b0b0d 72%);
		box-shadow:
			inset 0 0 0 1px var(--rule2),
			inset 0 0 28px rgba(0, 0, 0, 0.9);
	}
	.window :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
		padding: 9px;
	}
	@media (min-width: 880px) {
		.stone-wrap {
			grid-template-columns: 170px 1fr;
		}
		.window {
			width: 170px;
			height: 170px;
		}
		.window :global(svg) {
			padding: 13px;
		}
	}
	.verdict .name {
		font-family: var(--display);
		font-size: clamp(1.7rem, 6.5vw, 2.5rem);
		line-height: 1;
		letter-spacing: -0.01em;
	}
	.verdict .grade {
		margin-top: 8px;
		font-family: var(--label);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		font-size: 0.95rem;
	}
	.swatch,
	.sw {
		display: inline-block;
		width: 12px;
		height: 12px;
		vertical-align: -1px;
		margin-right: 8px;
		border: 1px solid rgba(255, 255, 255, 0.35);
	}
	.type {
		border: 0;
		padding: 0;
		margin-top: 6px;
		font-family: var(--label);
		font-size: 0.82rem;
		letter-spacing: 0.12em;
		color: var(--mute);
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-color: var(--dim);
	}
	.type:hover {
		color: var(--ink);
	}
	.lab-readout {
		color: var(--dim);
		font-size: 0.74rem;
		margin-top: 8px;
	}
	#warm {
		margin-top: 10px;
		font-size: 0.8rem;
		padding: 5px 10px;
	}
	#warm.on {
		background: var(--ink);
		color: var(--bg);
		border-color: var(--ink);
	}
	.spectrum {
		margin: 14px 0 0;
	}
	.spectrum :global(canvas) {
		width: 100%;
		height: 22px;
		display: block;
		background: #000;
	}
	.spec-axis {
		display: flex;
		justify-content: space-between;
		color: var(--dim);
		font-size: 0.7rem;
		padding-top: 5px;
		background: repeating-linear-gradient(90deg, var(--rule2) 0 1px, transparent 1px 12.5%);
		background-size: 100% 4px;
		background-repeat: no-repeat;
	}
	.spec-axis span:nth-child(2) {
		font-family: var(--label);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.prov {
		margin-top: 10px;
		font-size: 0.88rem;
		color: var(--mute);
		line-height: 1.4;
		border-top: 1px dotted var(--rule2);
		padding-top: 8px;
	}
	.prov .prov-label {
		font-family: var(--label);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink);
		font-size: 0.8rem;
		margin-right: 6px;
	}
	.prov.documented .prov-label {
		color: var(--ok);
	}
	.prov.cancels-out .prov-label,
	.prov.zoned .prov-label {
		color: var(--warn);
	}

	/* spec sheet */
	.facts {
		display: grid;
		border-top: 1px solid var(--rule);
	}
	.fact {
		display: grid;
		grid-template-columns: 118px 1fr;
		gap: 12px;
		padding: 11px 0;
		border-bottom: 1px solid var(--rule);
	}
	.fact h3 {
		padding-top: 2px;
	}
	.fact p,
	.fact ul {
		margin: 0;
		font-size: 0.95rem;
	}
	.fact ul {
		padding: 0;
		list-style: none;
	}
	.fact li {
		margin: 0 0 6px;
		padding-left: 6px;
		border-left: 2px solid transparent;
		margin-left: -8px;
	}
	.fact li.hot {
		border-left-color: var(--ink);
	}
	.fact li b {
		font-weight: 500;
	}
	.fact li .amt {
		color: var(--mute);
		font-family: var(--mono);
		font-size: 0.72rem;
		margin-left: 6px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.fact li .det {
		display: block;
		color: var(--mute);
		font-size: 0.85rem;
	}
	.fact li.none {
		color: var(--mute);
	}
	.defect-toggle {
		display: block;
		width: 100%;
		text-align: left;
		border: 0;
		padding: 0;
		text-transform: none;
		letter-spacing: normal;
		font-size: inherit;
	}
	.defect-toggle:hover {
		border-color: transparent;
	}
	.fact li .band {
		display: block;
		height: 5px;
		margin: 4px 0 2px;
		background: var(--rule2);
		border: 1px solid var(--rule2);
	}
	.bar {
		height: 2px;
		background: var(--rule2);
		margin: 8px 0 8px;
		position: relative;
	}
	.bar i {
		display: block;
		height: 100%;
		background: var(--ink);
		transition: width 0.25s;
	}
	@media (prefers-reduced-motion: reduce) {
		.bar i {
			transition: none;
		}
	}
	.bar::after {
		content: '';
		position: absolute;
		inset: -4px 0;
		background: repeating-linear-gradient(90deg, var(--rule2) 0 1px, transparent 1px 20%);
		background-size: 100% 100%;
	}

	/* controls: faders */
	:global(.group) {
		border-top: 1px solid var(--rule);
		padding: 14px 0 6px;
		margin: 0 0 10px;
	}
	:global(.group h3) {
		margin-bottom: 8px;
	}
	:global(.ctl) {
		padding: 10px 0 12px;
		scroll-margin-top: 300px;
	}
	:global(.ctl + .ctl) {
		border-top: 1px dotted var(--rule);
	}
	:global(.ctl-head) {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-weight: 500;
	}
	:global(.ctl-head output) {
		color: var(--ink);
		font-size: 0.9rem;
	}
	:global(.ctl-head output:empty) {
		display: none;
	}
	:global(input[type='range']) {
		width: 100%;
		margin: 10px 0 4px;
		appearance: none;
		background: transparent;
		height: 22px;
	}
	:global(input[type='range']::-webkit-slider-runnable-track) {
		height: 2px;
		background: var(--rule2);
	}
	:global(input[type='range']::-webkit-slider-thumb) {
		-webkit-appearance: none;
		width: 14px;
		height: 22px;
		background: var(--ink);
		border: 0;
		border-radius: 1px;
		margin-top: -10px;
		box-shadow: 0 0 0 3px var(--bg);
	}
	:global(input[type='range']::-moz-range-track) {
		height: 2px;
		background: var(--rule2);
	}
	:global(input[type='range']::-moz-range-thumb) {
		width: 14px;
		height: 22px;
		background: var(--ink);
		border: 0;
		border-radius: 1px;
		box-shadow: 0 0 0 3px var(--bg);
	}
	:global(.ends) {
		display: flex;
		justify-content: space-between;
		color: var(--dim);
		font-size: 0.72rem;
		font-family: var(--label);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	:global(.note) {
		color: var(--mute);
		font-size: 0.88rem;
		margin: 6px 0 0;
		max-width: 60ch;
	}
	:global(.note.warn) {
		color: var(--warn);
		opacity: 1;
	}
	:global(.seg) {
		display: flex;
		gap: 0;
		margin-top: 10px;
		flex-wrap: wrap;
	}
	:global(.seg button) {
		margin: 0 -1px 0 0;
		font-size: 0.8rem;
	}
	:global(.seg button.on),
	:global(.tog.on) {
		background: var(--ink);
		color: var(--bg);
		border-color: var(--ink);
	}
	:global(.tog) {
		width: 100%;
		text-align: left;
		font-size: 0.85rem;
	}
	.model-note {
		color: var(--mute);
		font-size: 0.9rem;
		max-width: 66ch;
		border-top: 1px solid var(--rule);
		padding-top: 14px;
		margin: 26px 0 0;
	}
	:global(.ctl.inert) {
		opacity: 0.45;
	}
	:global(.ctl .lbl) {
		cursor: default;
	}
	.play {
		border: 1px solid var(--rule2);
		padding: 1px 8px;
		font-size: 0.7rem;
		margin: 0 10px 0 auto;
		line-height: 1.4;
	}

	/* catalogue as a plate series */
	.cat {
		display: grid;
		grid-template-columns: 72px 1fr;
		gap: 18px;
		padding: 18px 0;
		border-top: 1px solid var(--rule);
	}
	.cat:last-child {
		border-bottom: 1px solid var(--rule);
	}
	.cat-swatch {
		border-radius: 50%;
		width: 72px;
		height: 72px;
		border: 1px solid rgba(255, 255, 255, 0.22);
		box-shadow:
			inset 0 0 18px rgba(0, 0, 0, 0.35),
			0 0 0 6px var(--bg),
			0 0 0 7px var(--rule2);
	}
	.cat-body h3 {
		font-family: var(--display);
		font-size: 1.5rem;
		text-transform: none;
		letter-spacing: 0;
		color: var(--ink);
		font-weight: 400;
	}
	.cat-body p {
		font-size: 0.95rem;
	}
	.cat.dossier .cat-body p {
		font-size: 0.92rem;
	}
	.cat-type {
		color: var(--mute);
		font-family: var(--mono);
		font-size: 0.78rem;
		margin: 4px 0 6px;
	}
	.cat-ex {
		color: var(--mute);
		font-style: italic;
		font-family: var(--display);
		font-size: 1.02rem;
	}
	.link {
		border: 0;
		padding: 6px 0 0;
		text-decoration: underline;
		text-underline-offset: 4px;
		color: var(--mute);
		font-size: 0.8rem;
	}
	.link:hover {
		color: var(--ink);
	}
	.kv {
		font-family: var(--label);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-size: 0.72rem;
		color: var(--mute);
	}

	/* combinations */
	.legend {
		color: var(--mute);
		font-size: 0.92rem;
		max-width: 66ch;
	}
	.statuses {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2px 16px;
		font-size: 0.9rem;
		max-width: 66ch;
		margin: 14px 0 18px;
		border-top: 1px solid var(--rule);
		padding-top: 12px;
	}
	.statuses dt {
		font-family: var(--label);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-size: 0.8rem;
		color: var(--ink);
	}
	.statuses dd {
		margin: 0 0 10px;
		color: var(--mute);
	}
	@media (min-width: 640px) {
		.statuses {
			grid-template-columns: 200px 1fr;
			gap: 8px 16px;
		}
		.statuses dd {
			margin: 0;
		}
	}
	.combo-tools {
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
		align-items: center;
		margin: 10px 0 14px;
		font-family: var(--label);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-size: 0.85rem;
		color: var(--mute);
	}
	.combo-tools select {
		padding-block: 6px;
		font-family: var(--body);
		text-transform: none;
		letter-spacing: 0;
	}
	.combo-tools input[type='search'] {
		background: var(--bg2);
		color: var(--ink);
		border: 1px solid var(--rule2);
		padding: 6px 10px;
		font-family: var(--body);
		font-size: 0.9rem;
		min-width: 180px;
	}
	.combo-tools span {
		color: var(--dim);
		font-size: 0.78rem;
		text-transform: none;
		letter-spacing: 0;
	}
	.combo {
		display: grid;
		grid-template-columns: 44px 1fr;
		gap: 14px;
		padding: 11px 0;
		border-top: 1px solid var(--rule);
	}
	.combo-sw {
		border: 1px solid rgba(255, 255, 255, 0.22);
		min-height: 44px;
	}
	.combo-name {
		font-weight: 500;
	}
	.combo-status {
		margin-left: 10px;
		font-family: var(--label);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--mute);
		font-weight: 400;
	}
	.combo.documented .combo-status {
		color: var(--ok);
	}
	.combo.cancels .combo-status,
	.combo.substitutes .combo-status,
	.combo.zoned .combo-status {
		color: var(--warn);
	}
	.combo-causes {
		color: var(--mute);
		font-size: 0.86rem;
	}
	.combo-why {
		color: var(--dim);
		font-size: 0.84rem;
		margin-top: 3px;
		max-width: 62ch;
	}
	.combo .link {
		font-size: 0.76rem;
	}

	/* types */
	.types {
		display: grid;
		gap: 0;
	}
	@media (min-width: 880px) {
		.types {
			grid-template-columns: 1fr 1fr;
			gap: 40px;
		}
	}
	.types article {
		border-top: 1px solid var(--rule);
		padding: 16px 0 10px;
	}
	.types article h3 {
		font-family: var(--display);
		font-size: 1.4rem;
		text-transform: none;
		letter-spacing: 0;
		color: var(--ink);
		font-weight: 400;
	}
	.types article > p {
		color: var(--mute);
		font-size: 0.95rem;
	}
	.types dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 10px 16px;
		margin: 12px 0 0;
		font-size: 0.95rem;
	}
	.types dt {
		font-family: var(--mono);
		font-size: 0.85rem;
		color: var(--ink);
		padding-top: 2px;
	}
	.types dd {
		margin: 0;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
		margin: -6px 0 18px;
	}
	.actions button {
		font-size: 0.76rem;
		padding: 6px 10px;
	}
	.actions button.on {
		background: var(--ink);
		color: var(--bg);
		border-color: var(--ink);
	}
	.solver {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-left: auto;
		font-family: var(--label);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-size: 0.76rem;
		color: var(--mute);
	}
	.solver input[type='color'] {
		width: 34px;
		height: 30px;
		padding: 0;
		border: 1px solid var(--rule2);
		background: none;
		cursor: pointer;
	}
	.flash {
		position: fixed;
		left: 50%;
		bottom: 22px;
		transform: translateX(-50%);
		background: var(--ink);
		color: var(--bg);
		padding: 8px 14px;
		font-family: var(--label);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-size: 0.8rem;
		z-index: 9;
		max-width: 90vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.pinned {
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: 12px;
		align-items: center;
		border-top: 1px dotted var(--rule2);
		margin-top: 10px;
		padding-top: 10px;
	}
	.window.small {
		width: 64px;
		height: 64px;
	}
	.window.small :global(svg) {
		padding: 5px;
	}
	.pinned h3 {
		font-size: 0.7rem;
	}
	.pinned-name {
		font-family: var(--display);
		font-size: 1.1rem;
		line-height: 1.1;
		margin-top: 2px;
	}
	.pinned .grade {
		font-size: 0.8rem;
		margin-top: 3px;
	}
	.pinned-actions {
		display: flex;
		gap: 14px;
	}
	h2.sub {
		margin-top: 36px;
	}
</style>
