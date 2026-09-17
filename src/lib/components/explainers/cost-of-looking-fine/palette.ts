export const C = {
	paper: '#FFFFFF',
	page: '#EFEEE8',
	panel: '#FFFFFF',
	ink: '#0B0B0B',
	mute: '#5C5C58',
	rule: '#0B0B0B',
	hair: '#DDDCD6',
	reason: '#1230C8',
	reasonSoft: '#E3E7FF',
	drag: '#DF3A1B',
	dragSoft: '#FFE4DC',
	amber: '#6E5400',
	amberSoft: '#FFE95C'
};
export const MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
export const DISPLAY = "'Instrument Serif', 'Times New Roman', serif";

export function erf(x: number): number {
	const s = x < 0 ? -1 : 1;
	x = Math.abs(x);
	const t = 1 / (1 + 0.3275911 * x);
	const y =
		1 -
		(((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) *
			Math.exp(-x * x);
	return s * y;
}
export const phi = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));
