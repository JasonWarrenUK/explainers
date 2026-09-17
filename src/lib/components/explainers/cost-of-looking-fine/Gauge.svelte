<script lang="ts">
	let {
		label,
		v,
		colour,
		rising = false,
		laps
	}: { label: string; v: number; colour: string; rising?: boolean; laps: number } = $props();
</script>

<div class="gauge">
	<div class="row">
		<span>{label}</span>
		<span class="value" style="color: {colour};">
			{v}% {#if laps > 0}{rising ? '↑' : '↓'}{/if}
		</span>
	</div>
	<div class="track">
		<div class="fill" style="width: {v}%; background: {colour};"></div>
	</div>
</div>

<style>
	.gauge {
		margin: 6px 0;
	}
	.row {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		margin-bottom: 2px;
	}
	.value {
		font-weight: 600;
	}
	.track {
		height: 12px;
		background: #efeee8;
		overflow: hidden;
	}
	.fill {
		height: 100%;
		transition: width 0.4s;
	}
</style>
