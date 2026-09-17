<script lang="ts">
	import Toy from './Toy.svelte';
	import Control from './Control.svelte';
	import Slider from './Slider.svelte';
	import Button from './Button.svelte';
	import Readout from './Readout.svelte';
	import { C } from './palette';
	import { PLAN, PLAN_STEPS, ALONE, WITH_HELP, DERAILS } from './doing-data';

	let iq = $state(120);
	let help = $state(false);
	let attempts = $state(0);
	let done = $state(0);
	let log = $state<string[]>([]);
	let marks = $state<boolean[]>([]);

	const level = $derived(Math.min(5, Math.floor((iq - 100) / 12.5)));
	const plan = $derived(level >= 1 ? [PLAN[1], PLAN[0], ...PLAN.slice(2)] : PLAN);
	const seq = $derived(help ? WITH_HELP : ALONE);
	const finished = $derived(done >= PLAN_STEPS.length);

	function tryStep() {
		if (finished) return;
		const ok = seq[attempts % seq.length] === 1;
		const attemptNumber = attempts + 1;
		const derailIndex = attempts % DERAILS.length;
		attempts += 1;
		marks = [...marks, ok];
		if (ok) {
			const doneNumber = done + 1;
			log = [`Attempt ${attemptNumber}: did step ${doneNumber}.`, ...log].slice(0, 4);
			done += 1;
		} else {
			log = [`Attempt ${attemptNumber}: ${DERAILS[derailIndex]}`, ...log].slice(0, 4);
		}
	}

	function reset() {
		attempts = 0;
		done = 0;
		log = [];
		marks = [];
	}
</script>

<Toy colour={C.reason} label="Toy 9 of 11: Knowing and Doing">
	<div class="task">The task: claim back &pound;41 that has been owed for fourteen weeks.</div>
	<Control label="Drag to add knowledge (a stand-in for reasoning): {iq}">
		<Slider min={100} max={162} bind:value={iq} colour={C.reason} />
	</Control>
	<div class="cols">
		<div class="knowing">
			<div class="col-title" style="color: {C.reason};">Knowing</div>
			{#if level >= 5}
				<div class="hint">
					Every note below is why the form is hard, and knowing all of them is why it feels like it
					should be easy.
				</div>
			{/if}
			<ol class="plan-list">
				{#each plan as p, i (p.text)}
					{@const notes = Object.entries(p.extra).filter(([lv]) => level >= +lv).map(([, t]) => t)}
					<li style="background: {level >= 1 && i < 2 ? C.amberSoft : 'transparent'};">
						{p.text}
						{#each notes as t (t)}
							<div class="note">{t}</div>
						{/each}
					</li>
				{/each}
			</ol>
		</div>
		<div class="doing">
			<div class="col-title" style="color: {C.drag};">Doing</div>
			<div class="progress-cells">
				{#each PLAN_STEPS as _, i (i)}
					<div class="cell" style="background: {i < done ? C.drag : C.panel}; border-color: {C.drag};"></div>
				{/each}
			</div>
			<div class="stats">
				Steps done: <strong>{done}</strong> of {PLAN_STEPS.length}
				<br />
				Attempts to start: <strong>{attempts}</strong>
			</div>
			<div class="marks">
				{#each marks as ok, i (i)}
					<span
						title={ok ? 'a step' : 'a derailment'}
						class="mark"
						style="background: {ok ? C.drag : 'transparent'}; border-color: {C.drag};"
					></span>
				{/each}
			</div>
			<div class="odds">
				{help
					? 'Odds with a colleague there: about four attempts in five move a step.'
					: 'Odds alone: about one attempt in four moves a step.'} The sequence is fixed and the same
				for everyone.
			</div>
		</div>
	</div>
	<div class="actions">
		<Button onclick={tryStep} active={!finished} colour={C.drag}>
			{finished ? 'Submitted' : 'Try to do the next step'}
		</Button>
		<Button onclick={() => (help = !help)} active={help} colour={C.mute}>
			{help ? 'Send the colleague away' : 'A colleague sits down next to you'}
		</Button>
		{#if attempts > 0}
			<Button onclick={reset} colour={C.mute}>Start the week again</Button>
		{/if}
	</div>
	{#if log.length > 0}
		<div class="log">
			{#each log as l, i (i)}
				<div style="opacity: {1 - i * 0.2};">{l}</div>
			{/each}
		</div>
	{/if}
	<Readout colour={C.drag}>
		{#if finished}
			<strong>Submitted, after {attempts} attempts.</strong> Look at the ratio. The plan on the left
			was complete and correct from the first second; the right-hand side needed {attempts} runs at
			it to execute five steps. That ratio is the gap, and it sits between having a plan and the plan
			happening. The slider only ever made the plan better.
		{:else}
			Move the slider and watch the left column: the plan gets sharper, the traps get named, the
			person can tell you exactly why this form is hard. Now press the button on the right and watch
			what the slider did to execution: nothing. Then let the colleague sit down. Structure changes
			the right column. Knowledge never does. That is Barkley&rsquo;s point in one form: &ldquo;people
			with ADHD know what to do; they cannot do what they know.&rdquo; &ldquo;You&rsquo;re so clever,
			just apply yourself&rdquo; is advice aimed at the column that was never the problem.
		{/if}
	</Readout>
</Toy>

<style>
	.task {
		font-size: 16px;
		margin-bottom: 4px;
	}
	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-top: 10px;
	}
	.knowing {
		background: #e3e7ff;
		padding: 10px;
	}
	.doing {
		background: #ffe4dc;
		padding: 10px;
	}
	.col-title {
		font-weight: 700;
		margin-bottom: 6px;
	}
	.hint {
		font-size: 13px;
		color: #1230c8;
		font-style: italic;
		margin-bottom: 6px;
	}
	.plan-list {
		margin: 0;
		padding-left: 18px;
		font-size: 14px;
		line-height: 1.4;
		list-style: decimal;
	}
	.plan-list li {
		margin-bottom: 4px;
	}
	.note {
		font-size: 13px;
		color: #1230c8;
		font-style: italic;
		margin-top: 2px;
	}
	.progress-cells {
		display: flex;
		gap: 4px;
		margin-bottom: 8px;
	}
	.cell {
		flex: 1;
		height: 14px;
		border: 1px solid;
	}
	.stats {
		font-size: 14px;
	}
	.marks {
		display: flex;
		flex-wrap: wrap;
		gap: 3px;
		margin-top: 8px;
	}
	.mark {
		width: 10px;
		height: 10px;
		display: inline-block;
		border: 1.5px solid;
	}
	.odds {
		font-size: 13px;
		color: #5c5c58;
		margin-top: 8px;
		line-height: 1.4;
	}
	.actions {
		margin-top: 12px;
	}
	.log {
		margin-top: 10px;
		font-size: 15px;
		color: #5c5c58;
		line-height: 1.5;
	}
</style>
