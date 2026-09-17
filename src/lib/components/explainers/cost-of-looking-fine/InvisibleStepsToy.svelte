<script lang="ts">
	import Toy from './Toy.svelte';
	import Control from './Control.svelte';
	import Readout from './Readout.svelte';
	import Button from './Button.svelte';
	import Kicker from './Kicker.svelte';
	import FoldPic from './FoldPic.svelte';
	import Face from './Face.svelte';
	import { C, MONO, DISPLAY } from './palette';
	import { FACES, CLAIMS, PROCESS_WORDS, STAGES11, words, mentions, secs, type Stage11 } from './invisible-steps-data';

	type StageId = Stage11['id'];
	type Phase = 'intro' | 'judge' | 'answer' | 'explain' | 'item' | 'summary';
	type When = 'Before' | 'After' | 'I cannot tell';

	interface Record_ {
		said: boolean;
		ms: number;
		text: string;
		when: When | null;
	}

	let stage = $state<StageId>('fold');
	let phase = $state<Phase>('intro');
	let t0 = $state(0);
	let idx = $state(0);
	let records = $state<Record_[]>([]);
	let answer = $state('');
	let text = $state('');
	let when = $state<When | null>(null);

	const items = $derived(stage === 'faces' ? FACES : stage === 'ideas' ? CLAIMS : [null]);
	const cur = $derived(records[idx]);

	function reset(d: StageId) {
		stage = d;
		phase = 'intro';
		idx = 0;
		records = [];
		answer = '';
		text = '';
		when = null;
	}

	function begin() {
		t0 = Date.now();
		phase = 'judge';
	}

	function judge(said: boolean) {
		const ms = Date.now() - t0;
		records = [...records, { said, ms, text: '', when: null }];
		text = '';
		when = null;
		phase = stage === 'fold' ? 'answer' : 'explain';
	}

	function commit() {
		const r = [...records];
		r[idx] = { ...r[idx], text, when };
		records = r;
		phase = 'item';
	}

	function next() {
		if (idx + 1 < items.length) {
			idx = idx + 1;
			t0 = Date.now();
			phase = 'judge';
		} else {
			phase = 'summary';
		}
	}

	function truthOf(n: number): boolean {
		return stage === 'faces' ? FACES[n].off : stage === 'ideas' ? CLAIMS[n].holds : true;
	}

	const hits = $derived(records.filter((r, n) => r.said === truthOf(n)).length);
	const mean = $derived(records.length ? records.reduce((a, r) => a + r.ms, 0) / records.length : 0);
	const afters = $derived(records.filter((r) => r.when === 'After').length);

	const intro = $derived(
		{
			fold: 'A short spatial puzzle. It appears when you press begin, and the clock runs until you say you have an answer. Then, with no clock, you write the answer and how you got to it, in your own words with nothing to choose from.',
			faces:
				'Five drawn faces, each different, one at a time, hidden until you press begin. Tap whether each looks fine or looks wrong, as quickly as you can: that tap is timed. Then, with no clock, write what you saw, say whether the reason came before or after you decided, and read what was actually done to that face. Pressing next shows the next face and starts its clock.',
			ideas:
				'Five short arguments, one at a time, hidden until you press begin. Tap whether each holds or does not, as quickly as you can: that tap is timed. Then, with no clock, write why, say whether the reason came before or after you decided, and read the fault, or why it holds. Pressing next shows the next argument and starts its clock.'
		}[stage]
	);

	const explainLabel = $derived(
		{
			fold: 'How did you get there? Your own words, step by step if there were steps.',
			faces: 'What did you see? If it looked wrong, what was wrong with it? Your own words.',
			ideas: 'Why? If it fails, name the fault if you can. Your own words.'
		}[stage]
	);

	const stageName = $derived(STAGES11.find((x) => x.id === stage)!.name);
</script>

<Toy colour={C.amber} label="Toy 11 of 11: The Invisible Steps">
	<div style="margin-bottom: 8px;">
		{#each STAGES11 as x (x.id)}
			<Button active={stage === x.id} onclick={() => reset(x.id)} colour={C.amber}>{x.label}</Button>
		{/each}
	</div>
	<div style="font-family: {DISPLAY}; font-size: 24px; margin-bottom: 6px;">
		{stageName}{stage !== 'fold' && phase !== 'intro' && phase !== 'summary' ? ` · ${idx + 1} of ${items.length}` : ''}
	</div>

	{#if phase === 'intro'}
		<div>
			<div style="font-size: 17px; margin: 0 0 1.15em;">{intro}</div>
			<Button onclick={begin} active colour={C.amber}>Begin</Button>
		</div>
	{/if}

	{#if phase === 'judge' && stage === 'fold'}
		<div>
			<div style="font-size: 18px; margin-bottom: 8px;">
				Fold a square of paper in half, then in half again. Snip off the corner where the two folds
				meet. Unfold it. How many holes are there, and where?
			</div>
			<FoldPic />
			<Button onclick={() => judge(true)} active colour={C.amber}>I have an answer</Button>
		</div>
	{/if}
	{#if phase === 'judge' && stage === 'faces'}
		<div style="text-align: center;">
			<div style="display: inline-block; margin: 4px 0 8px;"><Face f={FACES[idx].f} size={110} /></div>
			<div>
				<Button onclick={() => judge(false)} active colour={C.reason}>Looks fine</Button>
				<Button onclick={() => judge(true)} active colour={C.drag}>Looks wrong</Button>
			</div>
		</div>
	{/if}
	{#if phase === 'judge' && stage === 'ideas'}
		<div>
			<div style="font-size: 19px; line-height: 1.4; padding: 12px 14px; border: 1.5px solid {C.ink}; margin-bottom: 10px;">
				{CLAIMS[idx].text}
			</div>
			<Button onclick={() => judge(true)} active colour={C.reason}>Holds</Button>
			<Button onclick={() => judge(false)} active colour={C.drag}>Does not hold</Button>
		</div>
	{/if}

	{#if phase === 'answer'}
		<div>
			<div style="font-family: {MONO}; font-size: 12px; color: {C.mute}; margin-bottom: 6px;">the clock has stopped</div>
			<Control label="Your answer, in a few words">
				<input
					bind:value={answer}
					style="font: inherit; font-size: 16px; width: 100%; padding: 8px; border: 1.5px solid {C.ink};"
				/>
			</Control>
			<Button onclick={() => (phase = 'explain')} active colour={C.amber}>Next</Button>
		</div>
	{/if}

	{#if phase === 'explain'}
		<div>
			<div style="font-family: {MONO}; font-size: 12px; color: {C.mute}; margin-bottom: 6px;">
				the clock has stopped &middot; you said: {stage === 'faces'
					? cur.said
						? 'looks wrong'
						: 'looks fine'
					: stage === 'ideas'
						? cur.said
							? 'holds'
							: 'does not hold'
						: answer || '(no answer given)'}
			</div>
			<Control label={explainLabel}>
				<textarea
					bind:value={text}
					style="font: inherit; font-size: 16px; width: 100%; min-height: 80px; padding: 8px; border: 1.5px solid {C.ink}; resize: vertical;"
				></textarea>
			</Control>
			<div style="font-size: 16px; font-weight: 600; margin: 10px 0 6px;">
				Did that reason come to you before you decided, or after?
			</div>
			{#each ['Before', 'After', 'I cannot tell'] as const as w (w)}
				<Button active={when === w} onclick={() => (when = w)} colour={C.amber}>{w}</Button>
			{/each}
			{#if when}
				<div style="margin-top: 6px;">
					<Button onclick={commit} active colour={C.ink}>Readout</Button>
				</div>
			{/if}
		</div>
	{/if}

	{#if phase === 'item'}
		<div>
			<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 6px 0 10px;">
				<div style="border: 1.5px solid {C.ink}; padding: 10px;">
					<Kicker colour={C.reason}>Judged in</Kicker>
					<div style="font-family: {DISPLAY}; font-size: 36px; line-height: 1;">
						{secs(cur.ms)}<span style="font-size: 16px;"> s</span>
					</div>
					<div style="font-size: 13px; color: {C.mute};">
						{stage === 'fold'
							? 'from begin to the button'
							: cur.said === truthOf(idx)
								? 'as most people call it'
								: 'not as most people call it'}
					</div>
				</div>
				<div style="border: 1.5px solid {C.ink}; padding: 10px;">
					<Kicker colour={C.drag}>Reason came</Kicker>
					<div style="font-family: {DISPLAY}; font-size: 28px; line-height: 1.1;">{cur.when}</div>
					<div style="font-size: 13px; color: {C.mute};">
						{words(cur.text)} {words(cur.text) === 1 ? 'word' : 'words'} of it
					</div>
				</div>
			</div>
			<div style="font-style: italic; font-size: 15px; padding: 8px 10px; background: {C.page}; margin-bottom: 10px; white-space: pre-wrap;">
				{cur.text.trim() || '(nothing written)'}
			</div>
			<Readout colour={cur.said === truthOf(idx) ? C.reason : C.drag}>
				{#if stage === 'fold'}
					<strong>One hole, in the middle.</strong> Folded twice the paper is four layers, the folded corner
					is the centre of the sheet, and one snip cuts the same spot in all four.
					{mentions(cur.text, PROCESS_WORDS) >= 2
						? 'Your account names parts of that process, so some of the working was visible to you.'
						: 'Your account is mostly the answer restated, which is what most people produce: the sheet appeared unfolded, hole and all.'}
				{/if}
				{#if stage === 'faces'}
					<strong>{FACES[idx].off ? 'Drawn wrong.' : 'Drawn right.'}</strong> {FACES[idx].cue}
					{#if FACES[idx].off}
						{mentions(cur.text, FACES[idx].words) > 0
							? 'Your words point at that feature, at least vaguely.'
							: 'Your words describe the effect rather than the feature, which is where most people land.'}
					{/if}
				{/if}
				{#if stage === 'ideas'}
					<strong>{CLAIMS[idx].holds ? 'It holds.' : 'It does not hold.'}</strong> {CLAIMS[idx].note}
					{mentions(cur.text, CLAIMS[idx].words) > 0
						? 'Your words name the kind of fault, or the reason it stands, at least in part.'
						: 'Your words give the verdict more than the reason, which is what most people produce, including people who reason very well.'}
				{/if}
			</Readout>
			<Button onclick={next} active colour={C.amber}>{idx + 1 < items.length ? 'Next (starts the clock)' : 'Finish'}</Button>
		</div>
	{/if}

	{#if phase === 'summary'}
		<div>
			<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 6px 0 10px;">
				<div style="border: 1.5px solid {C.ink}; padding: 8px;">
					<Kicker colour={C.reason}>Per judgement</Kicker>
					<div style="font-family: {DISPLAY}; font-size: 30px; line-height: 1;">
						{secs(mean)}<span style="font-size: 14px;"> s</span>
					</div>
				</div>
				<div style="border: 1.5px solid {C.ink}; padding: 8px;">
					<Kicker colour={C.ink}>As most call them</Kicker>
					<div style="font-family: {DISPLAY}; font-size: 30px; line-height: 1;">
						{hits}<span style="font-size: 14px;"> of {records.length}</span>
					</div>
				</div>
				<div style="border: 1.5px solid {C.ink}; padding: 8px;">
					<Kicker colour={C.drag}>Reason after</Kicker>
					<div style="font-family: {DISPLAY}; font-size: 30px; line-height: 1;">
						{afters}<span style="font-size: 14px;"> of {records.length}</span>
					</div>
				</div>
			</div>
			<Readout colour={C.amber}>
				{#if stage === 'fold'}
					One puzzle is one data point, and it says only what it said above. The next two rounds ask
					the same question of a judgement you have made all your life, and then of an argument.
				{/if}
				{#if stage === 'faces'}
					Five faces, each judged in about {secs(mean)} seconds, and the reason came after the decision
					on {afters} of them. For faces that is the usual pattern: the judgement is made by something
					that is not consulting a reason, and the reason is assembled on request, often as a
					description of the feeling rather than the feature.
				{/if}
				{#if stage === 'ideas'}
					Five arguments, each judged in about {secs(mean)} seconds, and the reason came after the decision
					on {afters} of them. This is the round that matters for the rest of the page. In an argument,
					the sense that something is broken arrives long before the fault can be named, and for a
					person at the top of the reasoning scale that gap is a permanent feature of conversation:
					they are right, they know it first, and the explanation is a step behind, which from the
					outside looks like disagreeing without reasons.
				{/if}
			</Readout>
			<Readout colour={C.amber}>
				<strong>What this shows and what it does not.</strong> It shows that the steps were not
				<em>reportable</em> at the moment the answer arrived. It does not show that no steps happened;
				something computed the answer, and you were not invited to watch. That is the ordinary
				condition of expertise. The clinical descriptions of people at the top of the reasoning scale
				say it is their condition across far more of life than most people&rsquo;s: the answer comes,
				it is right, and asked to show the working they have to build one afterwards, which feels like
				making it up and can be told apart from making it up only by whether the answer was right.
				Nothing here measures your ability. It measures a gap, and everyone has one.
			</Readout>
			<Button onclick={() => reset(stage)} colour={C.mute}>Run it again</Button>
			{#if stage !== 'ideas'}
				<Button onclick={() => reset(stage === 'fold' ? 'faces' : 'ideas')} active colour={C.amber}>
					Next domain
				</Button>
			{/if}
		</div>
	{/if}
</Toy>
