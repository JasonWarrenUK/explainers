import type { Component } from 'svelte';

export const explainerComponents: Record<string, () => Promise<{ default: Component }>> = {
	'inherited-property': () => import('./InheritedProperty.svelte'),
	'the-other-face': () => import('./TheOtherFace.svelte'),
	'the-break': () => import('./TheBreak.svelte'),
	'the-apparatus': () => import('./TheApparatus.svelte'),
	'what-exists': () => import('./WhatExists.svelte'),
	'the-older-layer': () => import('./TheOlderLayer.svelte'),
	'the-cost-of-looking-fine': () => import('./TheCostOfLookingFine.svelte'),
	'4-englishes': () => import('./FourEnglishes.svelte'),
	'what-everyone-said': () => import('./WhatEveryoneSaid.svelte'),
	'the-country-that-means-no': () => import('./TheCountryThatMeansNo.svelte'),
	'norway-is-not-a-boolean': () => import('./NorwayIsNotABoolean.svelte')
};
