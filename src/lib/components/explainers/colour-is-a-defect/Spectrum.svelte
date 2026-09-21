<script lang="ts">
	import { BANDS, LAMBDAS, LINES, WAVE_RGB } from './model';
	import type { BandKey, DeriveResult } from './model';

	let {
		res,
		hoverBand = null
	}: {
		res: DeriveResult;
		hoverBand?: BandKey | null;
	} = $props();

	let canvas: HTMLCanvasElement | undefined = $state();

	function draw() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const W = canvas.width,
			H = canvas.height;
		ctx.clearRect(0, 0, W, H);
		const n = LAMBDAS.length;
		const strips = res.zone ? [res.T, res.zone.T] : [res.T];
		const bandH = 22;
		strips.forEach((T, si) => {
			const y0 = si * (bandH / strips.length),
				h = bandH / strips.length;
			for (let i = 0; i < n; i++) {
				const t = Math.min(1, T[i]);
				const w = WAVE_RGB[i];
				const x0 = Math.floor((i / n) * W),
					x1 = Math.ceil(((i + 1) / n) * W);
				ctx.fillStyle = `rgb(${Math.round(w[0] * 255 * t)},${Math.round(w[1] * 255 * t)},${Math.round(w[2] * 255 * t)})`;
				ctx.fillRect(x0, y0, x1 - x0, h);
			}
		});
		// hovered band overlay
		if (hoverBand && BANDS[hoverBand]) {
			ctx.fillStyle = 'rgba(255,255,255,0.55)';
			const mx = Math.max(...LAMBDAS.map((l) => BANDS[hoverBand](l)), 1e-6);
			LAMBDAS.forEach((l, i) => {
				const v = BANDS[hoverBand](l) / mx;
				const x0 = Math.floor((i / n) * W),
					x1 = Math.ceil(((i + 1) / n) * W);
				ctx.fillRect(x0, bandH - v * bandH, x1 - x0, v * bandH);
			});
		}
		// markers for zero-phonon lines of present centres
		ctx.font = '9px JetBrains Mono, monospace';
		ctx.textAlign = 'center';
		Object.entries(res.amps)
			.filter(([, v]) => (v ?? 0) > 0.12)
			.forEach(([k]) =>
				(LINES[k as BandKey] || []).forEach((l) => {
					const x = ((l - 380) / 400) * W;
					ctx.fillStyle = k === hoverBand ? '#fff' : 'rgba(255,255,255,0.75)';
					ctx.fillRect(Math.round(x), 0, 1, bandH + 4);
					ctx.fillText(String(l), x, H - 2);
				})
			);
	}

	$effect(() => {
		res;
		hoverBand;
		draw();
	});
</script>

<canvas bind:this={canvas} width="404" height="36" aria-label="Transmission spectrum, 380 to 780 nanometres"></canvas>
