<script lang="ts">
	import { hex } from './model';
	import type { DeriveResult, SimParams } from './model';
	import { FACETS, TABLE_POINTS, facetShade, pointsAttr, shade, tablePane } from './facets';

	let {
		res,
		params,
		uv = false,
		small = false,
		label
	}: {
		res: DeriveResult;
		params: SimParams | null;
		uv?: boolean;
		small?: boolean;
		label: string;
	} = $props();

	// Two Stone instances render at once (main + pinned), so the clip path needs a unique id.
	const clipId = `clip-stone-${Math.random().toString(36).slice(2, 9)}`;

	const base = $derived(uv ? (res.fluorRgb.map((v) => v * 0.9) as [number, number, number]) : res.rgb);
	const zone2 = $derived(res.zone && !uv ? res.zone.rgb : null);
	const cut = $derived(res.zone ? (1 - 2 * res.zone.frac) * 1.2 : 0);
	function sideOf(pts: [number, number][]): boolean {
		const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length,
			cy = pts.reduce((s, q) => s + q[1], 0) / pts.length;
		return cx - cy > cut;
	}
	function pick(pts: [number, number][]): [number, number, number] {
		return zone2 && sideOf(pts) ? zone2 : base;
	}
	const glare = $derived(uv ? 0.05 : 0.55 + 0.45 * (1 - res.desc.L / 100));
	const stroke = $derived(uv ? 'rgba(120,120,140,0.35)' : 'rgba(255,255,255,0.35)');

	const trianglesFill = $derived(Array.from({ length: 8 }, (_, i) => hex(shade(pick(tablePane(i)), i % 2 ? -0.42 : -0.18))));
	const facetFill = $derived(FACETS.map((f) => hex(shade(pick(f.pts), facetShade(f, glare)))));

	const grainLines = $derived.by(() => {
		if (!params || !(params.strain > 8) || uv) return [];
		const n = Math.round(params.strain / 9);
		const ang = 0.6;
		const dx = Math.cos(ang),
			dy = Math.sin(ang);
		return Array.from({ length: n }, (_, i) => {
			const off = -90 + (i + 0.5) * (180 / n);
			const nx = -dy * off,
				ny = dx * off;
			return {
				x1: (nx - dx * 110).toFixed(1),
				y1: (ny - dy * 110).toFixed(1),
				x2: (nx + dx * 110).toFixed(1),
				y2: (ny + dy * 110).toFixed(1),
				colour: `rgba(60,40,40,${(0.08 + (0.25 * params.strain) / 100).toFixed(2)})`
			};
		});
	});

	const stains = $derived.by(() => {
		if (!(res.stains > 0.05) || uv) return [];
		const spots = Math.min(14, Math.round(res.stains * 12));
		return Array.from({ length: spots }, (_, s) => {
			const a = (s * 2.399) % (Math.PI * 2),
				r = 0.62 + 0.36 * ((s * 0.618) % 1);
			return {
				cx: (100 * r * Math.cos(a)).toFixed(1),
				cy: (100 * r * Math.sin(a)).toFixed(1),
				rx: (3 + 5 * ((s * 0.37) % 1)).toFixed(1),
				ry: (2 + 4 * ((s * 0.71) % 1)).toFixed(1),
				colour: `rgba(56,120,70,${(0.35 + 0.4 * Math.min(1, res.stains)).toFixed(2)})`
			};
		});
	});

	const milkyOpacity = $derived(res.milky > 0.05 && !uv ? 0.5 * res.milky : 0);
</script>

<svg viewBox="-104 -104 208 208" role="img" aria-label={label} class:small>
	{#if grainLines.length}
		<clipPath id={clipId}><circle r="100" /></clipPath>
	{/if}
	<!-- table facet -->
	<polygon points={pointsAttr(TABLE_POINTS)} fill={hex(shade(base, -0.28))} {stroke} stroke-width="0.6" />
	<!-- eight table-adjacent triangles -->
	{#each Array.from({ length: 8 }, (_, i) => i) as i (i)}
		<polygon points={pointsAttr(tablePane(i))} fill={trianglesFill[i]} {stroke} stroke-width="0.6" />
	{/each}
	<!-- star, kite and upper-girdle facets -->
	{#each FACETS as f, i (f.kind + f.i + (i % 4))}
		<polygon points={pointsAttr(f.pts)} fill={facetFill[i]} {stroke} stroke-width="0.6" />
	{/each}
	<!-- graining from plastic deformation -->
	{#each grainLines as line, i (i)}
		<line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={line.colour} stroke-width="0.8" clip-path="url(#{clipId})" />
	{/each}
	<!-- alpha radiation skin stains -->
	{#each stains as s, i (i)}
		<ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={s.colour} />
	{/each}
	<!-- sub-microscopic cloud scatter -->
	{#if milkyOpacity > 0}
		<circle r="100" fill="rgba(255,255,255,{milkyOpacity})" />
	{/if}
	<circle r="100" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1" />
</svg>
