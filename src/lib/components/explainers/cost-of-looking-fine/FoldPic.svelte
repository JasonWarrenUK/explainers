<script lang="ts">
	import { C } from './palette';
</script>

<svg viewBox="0 0 340 100" width="100%" style="display: block; margin: 6px 0 10px;">
	<rect x="10" y="10" width="80" height="80" fill="none" stroke={C.ink} stroke-width="1.5" />
	<text x="50" y="98" font-size="10" fill={C.mute} text-anchor="middle">a square sheet</text>
	<path d="M130 50 L150 50" stroke={C.mute} stroke-width="1.5" />
	<rect x="170" y="30" width="40" height="40" fill="none" stroke={C.ink} stroke-width="1.5" />
	<line x1="170" y1="30" x2="210" y2="30" stroke={C.ink} stroke-width="3" />
	<line x1="170" y1="30" x2="170" y2="70" stroke={C.ink} stroke-width="3" />
	<path d="M170 30 L182 30 L170 42 Z" fill={C.drag} />
	<text x="190" y="88" font-size="10" fill={C.mute} text-anchor="middle">folded twice; the thick</text>
	<text x="190" y="98" font-size="10" fill={C.mute} text-anchor="middle">edges are the folds</text>
	<path d="M240 50 L260 50" stroke={C.mute} stroke-width="1.5" />
	<text x="300" y="54" font-size="22" fill={C.drag} text-anchor="middle">?</text>
	<text x="300" y="98" font-size="10" fill={C.mute} text-anchor="middle">unfolded</text>
</svg>
