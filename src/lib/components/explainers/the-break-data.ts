export interface Light {
	name: string;
	note: string;
	survives: boolean;
}

export const LIGHTS: Light[] = [
	{ name: 'Ugarit, a port on the Syrian coast', note: 'burned, and never reoccupied', survives: false },
	{ name: 'Hattusa, capital of the Hittite empire', note: 'abandoned', survives: false },
	{ name: 'Pylos, a palace in southern Greece', note: 'burned', survives: false },
	{ name: 'Mycenae and Tiryns', note: 'destroyed', survives: false },
	{ name: 'Emar, a city on the Euphrates', note: 'destroyed', survives: false },
	{ name: 'Linear B, the Greek writing system', note: 'unreadable within a generation', survives: false },
	{ name: 'The correspondence between great kings', note: 'no further letters', survives: false },
	{ name: 'Egypt', note: 'holds on, much reduced', survives: true },
	{ name: 'Assyria', note: 'holds', survives: true },
	{ name: 'Shang China', note: 'unaffected, two more centuries to run', survives: true },
	{ name: 'The Andes', note: 'unaffected, another world entirely', survives: true }
];
