<script lang="ts">
	import Toy from './Toy.svelte';
	import Control from './Control.svelte';
	import Slider from './Slider.svelte';
	import Readout from './Readout.svelte';
	import Button from './Button.svelte';
	import { C, MONO } from './palette';
	import { DOMAINS, DIGITS, PHRASE, lcs } from './chunks-data';

	type Phase = 'idle' | 'showDigits' | 'typeDigits' | 'showPhrase' | 'typePhrase' | 'done';

	let phase = $state<Phase>('idle');
	let d = $state('');
	let ph = $state('');
	let know = $state(0);
	let domain = $state<'web' | 'chess'>('web');
	let left = $state(0);
	const DUR = 3000;

	function show(next: Phase, after: Phase) {
		phase = next;
		left = 100;
		const t0 = Date.now();
		const tick = setInterval(() => {
			const pct = Math.max(0, 100 - ((Date.now() - t0) / DUR) * 100);
			left = pct;
			if (pct <= 0) {
				clearInterval(tick);
				phase = after;
			}
		}, 50);
	}

	function score(typed: string, target: string): number {
		const a = typed.replace(/\s+/g, '').toUpperCase();
		const b = target.replace(/\s+/g, '').toUpperCase();
		return lcs(a, b);
	}

	const D = $derived(DOMAINS[domain]);
	const chunking = $derived([...D.levels].reverse().find((c) => know >= c.at) ?? D.levels[0]);
	const items = $derived(chunking.chunks.length);
	const total = $derived(D.levels[0].chunks.length);

	function runAgain() {
		phase = 'idle';
		d = '';
		ph = '';
	}
</script>

<Toy colour={C.drag} label="Toy 6 of 11: Chunks Versus Digits">
	{#if phase === 'idle'}
		<div>
			<div style="font-size: 17px; margin: 0 0 1.15em;">
				Two memory tasks, three seconds each, nine characters each. A bar counts the three seconds
				down. Tap start, look, then type what you saw. This is a demonstration of a mechanism, not a
				test of your memory.
			</div>
			<Button onclick={() => show('showDigits', 'typeDigits')} active colour={C.drag}>
				Start the first one
			</Button>
		</div>
	{/if}

	{#if phase === 'showDigits' || phase === 'showPhrase'}
		<div>
			<div class="reveal">
				{phase === 'showDigits' ? DIGITS : PHRASE}
			</div>
			<div class="bar-track">
				<div class="bar-fill" style="width: {left}%;"></div>
			</div>
		</div>
	{/if}

	{#if phase === 'typeDigits'}
		<div>
			<Control label="Type the nine digits">
				<input
					bind:value={d}
					inputmode="numeric"
					style="font: inherit; font-family: {MONO}; font-size: 20px; width: 100%; padding: 8px; border: 1.5px solid {C.ink};"
				/>
			</Control>
			<Button onclick={() => show('showPhrase', 'typePhrase')} active colour={C.drag}>
				Done, show me the second
			</Button>
		</div>
	{/if}

	{#if phase === 'typePhrase'}
		<div>
			<Control label="Type the nine letters">
				<input
					bind:value={ph}
					style="font: inherit; font-family: {MONO}; font-size: 20px; width: 100%; padding: 8px; border: 1.5px solid {C.ink};"
				/>
			</Control>
			<Button onclick={() => (phase = 'done')} active colour={C.drag}>Done</Button>
		</div>
	{/if}

	{#if phase === 'done'}
		<div>
			<Readout colour={C.drag}>
				Digits: <strong>{score(d, DIGITS)} of 9</strong> in order. Letters:
				<strong>{score(ph, PHRASE)} of 9</strong>. Same length, same three seconds. The letters were
				three chunks; the digits were nine items. A buffer holds a handful of things, and what counts
				as a thing depends on what you already know. The scoring forgives a dropped or swapped
				character; it is looking for the shape of the result, and so should you.
			</Readout>
			<div style="margin-top: 14px;">
				<Button active={domain === 'web'} onclick={() => (domain = 'web')} colour={C.reason}>
					{DOMAINS.web.name}
				</Button>
				<Button active={domain === 'chess'} onclick={() => (domain = 'chess')} colour={C.reason}>
					{DOMAINS.chess.name}
				</Button>
			</div>
			<Control label="How well you know this domain: {know}%">
				<Slider min={0} max={100} bind:value={know} colour={C.reason} />
			</Control>
			<div style="font-size: 15px; color: {C.mute}; margin: 4px 0 8px;">
				What this much knowledge sees: {chunking.label}
			</div>
			<div class="chunk-row">
				{#each chunking.chunks as [text, meaning], i (i)}
					<div style="max-width: {items <= 3 ? '100%' : items <= 8 ? '150px' : '64px'};">
						<div class="chunk-text">{text === ' ' ? '␣' : text}</div>
						<div class="chunk-meaning">{meaning}</div>
					</div>
				{/each}
			</div>
			<Readout colour={C.reason}>
				The same {total} characters are <strong>{items} {items === 1 ? 'thing' : 'things'}</strong> to
				somebody who knows this much.
				{#if items >= total}
					{total} items overruns any buffer.
				{/if}
				{#if items > 1 && items < total}
					Getting closer to fitting.
				{/if}
				{#if items === 1}
					One chunk. It fits with room to spare, and the buffer never had to grow.
				{/if}
				This is how a working memory at 118 runs a reasoning engine near 190: the engine has turned
				most of the world into large chunks, so the buffer is rarely asked to hold raw items. It
				works right up until something arrives that cannot be chunked.
			</Readout>
			<Readout colour={C.drag}>
				<strong>What will not chunk.</strong> A phone number read out once. A six-step spoken instruction.
				The running total in a mental sum. A name at a party. On these the reasoning engine has nothing
				to grip, the 118 is exposed, and the person who just explained the rail network cannot tell you
				what you said thirty seconds ago.
			</Readout>
			<div style="font-size: 14px; color: {C.mute}; margin-top: 8px;">
				The shape of this is Chase and Simon&rsquo;s chess result from 1973: masters recalled real
				positions far better than novices and random positions barely better at all. The percentages
				on the slider are illustrative.
			</div>
			<Button onclick={runAgain} colour={C.mute}>Run it again</Button>
		</div>
	{/if}
</Toy>

<style>
	.reveal {
		font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 30px;
		text-align: center;
		padding: 24px 0 12px;
		letter-spacing: 0.1em;
	}
	.bar-track {
		height: 8px;
		background: #efeee8;
		border: 1px solid #0b0b0b;
	}
	.bar-fill {
		height: 100%;
		background: #df3a1b;
	}
	.chunk-row {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 8px 0;
		align-items: flex-start;
	}
	.chunk-text {
		font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 15px;
		border: 1px solid #1230c8;
		padding: 2px 6px;
		background: #e3e7ff;
		white-space: pre;
		display: inline-block;
	}
	.chunk-meaning {
		font-size: 12px;
		color: #5c5c58;
		line-height: 1.3;
		margin-top: 2px;
	}
</style>
