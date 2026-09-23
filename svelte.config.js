import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Pinned to the Vercel adapter rather than adapter-auto: adapter-auto
		// installs it at build time outside the lockfile, which left Vercel's
		// restored build cache with an incoherent tree (@vercel/nft resolving
		// the hoisted ESM-only estree-walker@3 instead of its own v2).
		// The runtime matches the project's Node setting on Vercel (24.x) and
		// is stated explicitly so a local build on a newer Node still works.
		adapter: adapter({ runtime: 'nodejs24.x' })
	}
};

export default config;
