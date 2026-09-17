<script lang="ts">
	import { C } from './palette';
	import type { FaceProportions } from './invisible-steps-data';

	let { f, size = 88 }: { f: FaceProportions; size?: number } = $props();

	const rx = $derived(f.rx ?? 34);
	const eyeY = $derived(f.eyeY ?? 60);
	const eyeGap = $derived(f.eyeGap ?? 12);
	const mouthY = $derived(f.mouthY ?? 92);
	const curve = $derived(f.curve ?? 8);
	const noseLen = $derived(f.noseLen ?? 16);
</script>

<svg viewBox="0 0 100 120" width={size} height={size * 1.2} style="display: block;">
	<ellipse cx="50" cy="60" {rx} ry="46" fill={C.panel} stroke={C.ink} stroke-width="2" />
	<circle cx={50 - eyeGap} cy={eyeY} r="3.2" fill={C.ink} />
	<circle cx={50 + eyeGap} cy={eyeY} r="3.2" fill={C.ink} />
	<path d="M50 68 l3 {noseLen} h-6" fill="none" stroke={C.ink} stroke-width="1.6" />
	<path d="M40 {mouthY} q10 {curve} 20 0" fill="none" stroke={C.ink} stroke-width="2" />
</svg>
