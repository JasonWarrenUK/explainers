<script lang="ts">
	import { C } from './palette';

	let { left, right }: { left: string; right: string } = $props();
</script>

<div class="scale">
	<span class="pan">{left}</span>
	<span class="balances">balances</span>
	<span class="pan">{right}</span>
</div>

<style>
	.scale {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 10px 0;
		font-size: 17px;
	}
	.pan {
		background: #e3e7ff;
		padding: 6px 10px;
	}
	.balances {
		color: #5c5c58;
	}
</style>
