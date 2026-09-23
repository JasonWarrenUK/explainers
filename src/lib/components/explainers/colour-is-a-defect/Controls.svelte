<script lang="ts">
	import type { SimParams } from './model';
	import { CONTROLS, DEFAULTS } from './data';
	import type { ControlKey } from './data';

	let {
		sim,
		playingKey = null,
		onchange,
		ontogglePlay
	}: {
		sim: SimParams;
		playingKey?: ControlKey | null;
		onchange: (k: keyof SimParams) => void;
		ontogglePlay: () => void;
	} = $props();

	function fmt(v: number, k: ControlKey): string {
		if (k === 'time') return v < 10 ? v.toFixed(1) : String(Math.round(v));
		if (k === 'boron' || k === 'carats') return String(Math.round(v * 100) / 100);
		return String(Math.round(v));
	}

	function logToValue(pos: number, min: number, max: number): number {
		return Math.exp(Math.log(min) + (pos / 1000) * (Math.log(max) - Math.log(min)));
	}
	function valueToLog(v: number, min: number, max: number): number {
		return Math.round((1000 * (Math.log(v) - Math.log(min))) / (Math.log(max) - Math.log(min)));
	}

	function setNumeric(k: ControlKey, v: number) {
		(sim[k] as number) = v;
	}
	function handleRange(k: ControlKey, log: boolean | undefined, min: number, max: number, raw: string) {
		const n = Number(raw);
		setNumeric(k, log ? logToValue(n, min, max) : n);
		onchange(k);
	}
	function resetOne(k: ControlKey) {
		setNumeric(k, DEFAULTS[k] as number);
		onchange(k);
	}
</script>

<div id="controls">
	{#each CONTROLS as group (group.group)}
		<section class="group">
			<h3>{group.group}</h3>
			{#each group.items as c (c.k)}
				{@const reason = 'inert' in c && c.inert ? c.inert(sim) : null}
				<div class="ctl" class:inert={!!reason}>
					{#if c.k === 'radSource'}
						<div class="ctl-head"><span>{c.label}</span></div>
						<div class="seg">
							{#each c.options as [v, l] (v)}
								<button
									type="button"
									class:on={sim.radSource === v}
									onclick={() => {
										sim.radSource = v as SimParams['radSource'];
										onchange('radSource');
									}}>{l}</button
								>
							{/each}
						</div>
					{:else if c.k === 'hpht'}
						<div class="ctl-head">
							<button
								type="button"
								class="tog"
								class:on={sim.hpht}
								aria-pressed={sim.hpht}
								onclick={() => {
									sim.hpht = !sim.hpht;
									onchange('hpht');
								}}>{c.label}</button
							>
						</div>
					{:else}
						{@const value = sim[c.k] as number}
						<div class="ctl-head">
							<span class="lbl" ondblclick={() => resetOne(c.k)} role="button" tabindex="-1">{c.label}</span>
							{#if c.play}
								<button type="button" class="play" aria-label="Play residence" onclick={ontogglePlay}>{playingKey === c.k ? '■' : '▶'}</button>
							{/if}
							<output>{fmt(value, c.k)}{c.unit ? ' ' + c.unit : ''}</output>
						</div>
						<input
							type="range"
							min={c.log ? 0 : c.min}
							max={c.log ? 1000 : c.max}
							step={c.log ? 1 : c.step}
							aria-label={c.label}
							value={c.log ? valueToLog(value, c.min, c.max) : value}
							oninput={(e) => handleRange(c.k, c.log, c.min, c.max, (e.target as HTMLInputElement).value)}
						/>
						{#if c.lo}
							<div class="ends"><span>{c.lo}</span><span>{c.hi}</span></div>
						{/if}
					{/if}
					<p class="note" class:warn={!!reason}>{reason || c.note}</p>
				</div>
			{/each}
		</section>
	{/each}
</div>
