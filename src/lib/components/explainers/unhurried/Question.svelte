<script lang="ts">
	export interface QuestionOption {
		key: string;
		label: string;
	}

	let {
		text,
		options,
		value,
		onPick
	}: { text: string; options: QuestionOption[]; value: string | null; onPick: (key: string) => void } = $props();
</script>

<div class="un-q">
	<p class="un-q-text">{text}</p>
	<div class="un-opts">
		{#each options as o (o.key)}
			<button class="un-opt" class:chosen={value === o.key} onclick={() => onPick(o.key)}>
				{o.label}
			</button>
		{/each}
	</div>
</div>
