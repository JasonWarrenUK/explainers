# Design token audit (1DS.1)

**Date:** 2026-09-23
**Scope:** every inline colour, font stack and spacing value across `src/routes`, `src/lib/components/shared` and the twelve registered explainers.
**Consumers:** 1DS.2 (what the palette has to cover), 1DS.5 (what gets replaced), 1DS.6 (what stays).

The roadmap says nine explainers. `registry.ts` and `explainers.ts` both hold twelve. The count in the phase document is stale; this audit covers all twelve.

---

## 1. The headline

Six explainers independently invented the same token vocabulary under six different spellings. Nobody coordinated it, and it converged anyway:

| Role | unhurried | cost-of-looking-fine | what-everyone-said | last-verified | norway | 4-englishes |
|---|---|---|---|---|---|---|
| Page ground | `--un-paper` | `page` | `--paper` | `--paper` | `--page` | `--parchment` |
| Raised ground | `--un-paper-deep` | `panel` | `--paper-sunk` | `--paper-sunk` | `--panel` | `--parchment-2` |
| Primary text | `--un-ink` | `ink` | `--ink` | `--ink` | `--ink` | `--ink` |
| Secondary text | `--un-ink-mid` | `mute` | `--ink-mid` | `--ink-mid` | `--muted` | `--ink-soft` |
| Tertiary text | `--un-ink-soft` | — | `--ink-soft` | `--ink-soft` | `--faint` | — |
| Hairline | `--un-rule` | `hair` | `--rule` | `--rule` | `--rule` | `--rule` |
| Emphasis | `--un-mark` | `reason` | `--mark` | `--mark` | `--violet` | `--accent` |
| Positive | — | — | `--gain` | `--gain` | `--green` | `--accent-2` |
| Negative | — | `drag` | `--cost` | `--cost` | `--red` | — |

That convergence is the palette's shape, and it arrived without a shared source to copy from: no explainer imports another's tokens, and only eight of the project's 100 colour values appear in more than one place (section 4). Six independent solutions to the same problem landing on the same nine roles is stronger evidence for those roles than a top-down scheme would be.

**What 1DS.2 must cover:** two ground levels, three ink levels, one hairline, one emphasis, and a positive/negative pair. Nine roles, in light and dark.

---

## 2. Raw inventory

Counted across `*.svelte`, `*.ts` and `*.css` under `src/`.

| Axis | Declarations | Distinct values |
|---|---|---|
| Hex colours | 225 | 100 |
| `rgb()` / `rgba()` | 19 | 19 |
| `font-family` | 62 in `.svelte`/`.css` | 18 spellings: 11 literal stacks, 6 `var()` indirections, 1 `inherit` |
| `font-size` | 327 | 151 in `px`, 158 in `rem`, 18 keyword or relative |
| `padding` | 99 | 65 |
| `margin` | 179 | 77 |
| `gap` | 69 | 26 |
| `border-radius` | 51 | 10 |

Spacing figures exclude Svelte template expressions (`gap: {cond ? a : b}` and similar), which a naive grep picks up as values.

**Reconciliation.** A naive grep for `#[0-9a-f]{3,8}` returns 270 hits across 109 distinct values. Forty-five of those hits, spanning nine distinct values, are HTML numeric entities rather than colours: `&#8209;` (non-breaking hyphen, 27 uses alone), `&#809;`, `&#803;`, `&#688;`, `&#468;`, `&#8321;`, `&#257;`, `&#299;`, `&#333;`, all in `FourEnglishes.svelte` and `WhatEveryoneSaid.svelte`. Subtracting them gives **225 occurrences of 100 distinct colours**. Section 4 classifies all 100; the buckets sum to 100 exactly.

One more count needs subtracting from any mental model of the work: `#ffffff` accounts for 11 of the 225, and the hub greyscale for another 26. The long tail is per-explainer.

---

## 3. Type

Eleven literal stacks appear in `font-family` declarations, resolving to seven distinct faces. Six more declarations go through `var()` indirections (`--mono`, `--serif`, `--display`, `--label`, `--body`, `--explainer-nav-font`), which is how `colour-is-a-defect`'s four extra families stay invisible to a naive grep. The table below groups by face; the loading subsection covers what that hides.

| Stack | Used by | Verdict |
|---|---|---|
| IBM Plex Mono, in three different fallback chains | unhurried, cost-of-looking-fine, norway, what-everyone-said, last-verified, formats/CodeSpecimen | **Identity.** The de facto project mono, six explainers deep. |
| `'Fraunces', Georgia, serif` | unhurried, norway, what-everyone-said | **Identity.** Display serif. |
| `'Newsreader', Georgia, serif` | unhurried, what-everyone-said, last-verified | **Identity.** Body serif. |
| `'Instrument Serif', 'Times New Roman', serif` | cost-of-looking-fine | **Character.** That explainer's editorial display voice. |
| `'Iowan Old Style', Palatino, …, serif` and a shorter `Palatino, Georgia, serif` | 4-englishes | **Character.** A manuscript face for a manuscript subject, though the two spellings of it should be one. |
| `'IBM Plex Sans', system-ui, sans-serif` | cost-of-looking-fine | **Character**, and the project's only sans beyond `system-ui`. |
| `system-ui, sans-serif` | all three hub routes | **Drift.** The default nobody chose. 1DS.5 replaces it. |
| `var(--explainer-nav-font, system-ui, sans-serif)` | ExplainerNav | **Drift**, but already themeable; only the fallback changes. |
| `monospace` (bare) | ScalesToy | **Drift.** Should be the Plex Mono token. |

Three faces carry the project. Three are deliberate per-explainer character. Three are accidents.

The Plex Mono row collapses three distinct spellings, and the inconsistency is its own small finding: `'IBM Plex Mono', monospace`, `'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace` and `'IBM Plex Mono', ui-monospace, Menlo, monospace` all appear. One face, three fallback chains, so a reader without the webfont sees three different monos depending on which explainer they opened.

**Fonts are loaded six separate times, and `colour-is-a-defect` loads four families nobody else uses.**

`app.html` has no font link at all. Instead every styled explainer fetches its own from Google Fonts at component level:

| Loader | Families requested |
|---|---|
| `unhurried.css` (`@import`) | Fraunces, Newsreader, IBM Plex Mono |
| `LastVerified.svelte` | Fraunces, Newsreader, IBM Plex Mono |
| `WhatEveryoneSaid.svelte` | Fraunces, IBM Plex Mono, Newsreader |
| `NorwayIsNotABoolean.svelte` | Fraunces, IBM Plex Mono |
| `TheCostOfLookingFine.svelte` | Instrument Serif, IBM Plex Sans, IBM Plex Mono |
| `ColourIsADefect.svelte` | Bodoni Moda, Barlow Condensed, JetBrains Mono, Barlow |

Four of those six request overlapping subsets of the same three families with slightly different weight axes, so the same font is fetched under several URLs. The `@import` in `unhurried.css` is the worst of them: it blocks rendering and cannot be preconnected.

`colour-is-a-defect` is the outlier twice over. It is the only explainer using Bodoni Moda, Barlow, Barlow Condensed and JetBrains Mono, none of which appear in the `font-family` audit above because they are referenced through its local `--display`/`--label`/`--mono` tokens. That is four extra families for one explainer.

**For 1DS.2:** the type decision is really two decisions. Which families the system carries, and where they load from. One `<link>` in `app.html` covering the shared three, with per-explainer additions justified case by case, replaces six uncoordinated fetches.

---

## 4. Colour classification

All 100 distinct values, in three buckets that sum to 100.

| Bucket | Distinct values | Fate |
|---|---|---|
| Hub greyscale (routes + shared) | 10 | → tokens (1DS.5 replaces every use) |
| Per-explainer palettes | 76 | → mostly character, see 4.2 |
| `colour-is-a-defect` chrome + domain | 14 | → dark-mode seed and out-of-scope, see 4.3 |

**The convergence is in the names, not the values.** Only eight of the 100 appear in more than one area, and six of those are `#fff`/`#ffffff` or the cost-of-looking-fine explainer sharing values with its own toy directory. No two explainers independently picked the same ink or the same paper. What they picked independently was the same *set of roles* (section 1). That distinction matters for 1DS.2: the palette is being designed fresh, not extracted; the audit tells you what slots it must fill, not what colours to put in them.

### 4.1 Hub greyscale: 10 values, all drift

The hub's ten values do one job each, and no two of them were chosen against the others:

| Value | Role | Sites |
|---|---|---|
| `#1a1a1a` | body ink | `+page`, `collection`, `tag` |
| `#666` | secondary ink | `+page` ×3, `collection`, `tag` |
| `#555` | body prose | `collection` ×2, `tag` |
| `#444` | card prose | `+page` |
| `#888` | tertiary/counts | `+page` ×3 |
| `#bbb` | numerals | `collection` |
| `#ddd` `#eee` `#ccc` | hairlines | routes, ExplainerNav |
| `#f2f2f2` | one-off wash | ExplainerNav |

Ten values, six roles, no deliberate scheme behind any of them. Every one is drift and 1DS.5 replaces the lot.

The clustering that matters for 1DS.2 sits across the explainers rather than inside the hub. Six explainers reach for a warm off-white ground with six near-identical values: `#f7f4ed`, `#f7f3ea`, `#f6f2e9`, `#f6efe0`, `#efeee8`, `#faf8fd`. Seven reach for a near-black ink: `#1a1a1a`, `#0b0b0b`, `#1a2426`, `#1f1b16`, `#1c1e24`, `#2b2016`, `#1a1226`. Nobody coordinated either cluster. Each collapses to one token.

### 4.2 Per-explainer palettes: 76 values

This is where 1DS.6's decision lives, so every value gets a verdict rather than an illustration.

**The rule.** A value is **structural** when it fills a ground, ink or hairline role: six explainers each invented their own because there was no shared token to reach for, so it is drift and 1DS.6 replaces it. A value is **character** when the explainer's argument or its in-page prose depends on that specific colour. Token name is the discriminator, because the authors already named their own intent.

#### unhurried layer (15 values, shared by six explainers)

| Token | Value | Verdict |
|---|---|---|
| `--un-paper`, `--un-paper-deep`, `--un-card` | `#f7f4ed` `#efeae0` `#ffffff` | Structural → token |
| `--un-ink`, `--un-ink-mid`, `--un-ink-soft` | `#1a2426` `#40514f` `#5e706e` | Structural → token |
| `--un-rule`, `--un-rule-soft` | `#d6cec0` `#e4ddd1` | Structural → token |
| `--un-mark`, `--un-mark-soft` | `#9a5b18` `#c4915a` | **Character** |
| `--un-deep`, `--un-deep-soft` | `#1f5a66` `#a8c6cc` | **Character** |

Plus three values used directly rather than through tokens: `#23282b`, `#4a4e52`, `#cfcfc9`, `#e4e4e1`. Structural, and drift twice over since the layer has tokens they ignore.

Eleven of fifteen are structural. **But see question 1 in section 7:** this layer serves half the catalogue, so "replace with the shared token" may mean "this layer's paper *becomes* the shared token."

#### 4-englishes (14 values)

| Token | Value | Verdict |
|---|---|---|
| `--ink`, `--ink-soft` | `#2b2016` `#5c4d3c` | Structural → token |
| `--parchment`, `--parchment-2`, `--rule` | `#f6efe0` `#efe5d0` `#cbb992` | **Character.** The manuscript ground is the subject. |
| `--accent`, `--accent-2`, `--gold` | `#7a2e1d` `#3d5a45` `#9c7c3a` | **Character** |
| SVG strokes | `#a1442f` `#c3ac7f` | **Character.** Load-bearing vs inherited branches in the family tree. |
| Violet | `#4a3b6b` | **Character.** The prose explains this convention in-page. |
| Loose | `#fbf6ea` `#e7dcc4` `#8a7d68` | Structural → token |

#### norway-is-not-a-boolean (12 values)

| Token | Value | Verdict |
|---|---|---|
| `--page`, `--panel`, `--code` | `#faf8fd` `#ffffff` `#f3effa` | Structural → token |
| `--ink`, `--muted`, `--faint` | `#1a1226` `#544869` `#6b6084` | Structural → token |
| `--rule`, `--edge` | `#d5cae8` `#8d7bac` | Structural → token |
| `--amber`, `--green`, `--red`, `--violet` | `#7a5200` `#116644` `#a32c10` `#5734a0` | **Character.** Bound to `--spec-key/str/num/lit`: these *are* the syntax classes. |
| `--mark` | `#ffe783` | **Character** |

#### what-everyone-said (12 values)

`--paper` `#f7f3ea`, `--paper-sunk` `#efe9dc`, `--ink` `#1f1b16`, `--ink-mid` `#4a423a`, `--ink-soft` `#6b6157`, `--rule` `#dcd3c4`, `--edge` `#8f8069` are structural (7). `--mark` `#3b3a8c`, `--gain` `#2a6b45`, `--cost` `#7a2617` and their washes `#e7e4f0`, `#f2e4df` are character (5).

#### last-verified (10 values)

`--paper` `#f6f2e9`, `--paper-sunk` `#ede7da`, `--ink` `#1c1e24`, `--ink-mid` `#43474f`, `--ink-soft` `#5d6069`, `--rule` `#dcd4c4` are structural (6; `--card` `#ffffff` is counted once globally). `--mark` `#2a3f6b`, `--gain` `#24503a`, `--cost` `#a34a31`, `--machine` `#6e6455` are character (4).

#### cost-of-looking-fine (13 values, across `palette.ts` and the wrapper)

`page` `#efeee8`, `panel`/`paper` `#ffffff`, `#fff`, `mute` `#5c5c58`, `hair` `#dddcd6`, plus the wrapper's near-duplicate `#ddddd6`, are structural (6). `ink`/`rule` `#0b0b0b` is **character**: the explainer deliberately uses one value for both text and rules, which is the graph-paper severity the argument rests on. `reason` `#1230c8` + `reasonSoft` `#e3e7ff`, `drag` `#df3a1b` + `dragSoft` `#ffe4dc`, `amber` `#6e5400` + `amberSoft` `#ffe95c` are character (6), making 7 with the ink.

That `#dddcd6` against `#ddddd6` is the clearest single illustration of drift in the project: two hairline greys, one character apart, in the same explainer.

#### Tally

| | Values | Structural (1DS.6 replaces) | Character (stays) |
|---|---|---|---|
| unhurried | 15 | 11 | 4 |
| 4-englishes | 14 | 5 | 9 |
| norway | 12 | 7 | 5 |
| what-everyone-said | 12 | 7 | 5 |
| last-verified | 10 | 6 | 4 |
| cost-of-looking-fine | 13 | 6 | 7 |
| **Total** | **76** | **42** | **34** |

**1DS.6 is a 42-value change, not a 76-value one**, and none of the 42 is a decision anyone made on purpose. The 34 that stay are the reason the milestone note says "keeping each one's deliberate character where it earns its place": 4-englishes and cost-of-looking-fine are mostly character and should barely move; unhurried is mostly structure and carries half the catalogue.

### 4.3 `colour-is-a-defect`: 14 values, two different fates

This explainer is *about* colour, so its values split cleanly and the split must be respected.

**Out of scope (never tokens).** The gemstone appearance is computed, not written: `model.ts`, `solver.ts`, `facets.ts` and `combinations.ts` derive colour from physical parameters, and `Spectrum.svelte` and `Stone.svelte` paint it with expressions like `rgb(${w[0]*255*t}…)`. Only three literal hexes exist in that whole layer: `#c6a4d6` (a default target stone in the UI), plus `#ff0000` and `#000000` as test assertions in `model.test.ts`. Nothing here is a palette requirement.

**In scope, and valuable.** Its chrome at `ColourIsADefect.svelte:629-638` is a complete dark UI set following the same role vocabulary as every other explainer: `--bg #0b0b0d`, `--bg2 #101013`, `--rule #2a2a2f`, `--rule2 #3b3b42`, `--ink #ececec`, `--mute #9a9aa3`, `--dim #5e5e68`, `--ok #9dcf9b`, `--warn #e0b07a`. Three ground levels, three ink levels, two rules, positive and warning. It is the project's only existing dark palette and it already maps onto the nine roles from section 1. **1DS.7 should derive from it rather than mechanically inverting the light palette.**

---

## 5. Spacing

The hub is already coherent; the toys are not.

**All three hub routes open with a byte-identical block.** Verified by diffing the `main` rule across `+page`, `collection/[id]/+page` and `tag/[slug]/+page`: three files, one declaration each, no variation.

```
max-width: 56rem;
margin: 0 auto;
padding: 3rem 1.25rem 6rem;
```

`ExplainerNav` uses the same `56rem` via `var(--explainer-nav-width, 56rem)`. That measure is settled and should become a token unchanged.

**Measures in use:** `56rem` (hub), `40rem` (what-everyone-said `--measure`), `34rem`, `36rem`, `32rem`, `66ch`, `62ch`, `60ch`, `58ch`. Nine reading widths for what is broadly one job. The `ch` units are prose columns and defensible; the `rem` spread is drift.

**Unit split:** 158 `rem` font-sizes against 151 `px`. The division is clean: hub routes and the unhurried layer use `rem`, the cost-of-looking-fine toys use `px` throughout (often in inline `style=` attributes). This is not a style preference to reconcile at token level; it is a question of whether the toys' fixed-pixel geometry survives 2PR.2's extraction. Flag for that milestone, not this one.

**Padding and margin are the largest axes and the least structured.** 99 padding declarations across **65 distinct values**; 179 margin declarations across **77 distinct values**. Excluding the `0` and `0 auto` resets that account for 45 of the margins, that is still well over 100 distinct spacing decisions with no scale beneath them. Nothing recurs enough to suggest an intended ladder: after `0`, the commonest paddings are `8px` (×7), `10px` (×4), `8px 10px` (×3) and `6px 10px` (×3).

**Units, across padding, margin and gap:** 293 `px`, 85 `rem`, 8 `em`. Pixels outnumber rem 3.4 to 1, which is the opposite of the font-size split and comes from the same place: the cost-of-looking-fine toys set geometry in pixels, often inline.

**Gaps:** 26 distinct values. `1rem` leads (×10), then `10px` (×7), `12px` (×6), `6px` (×5), `14px` (×5), `8px` (×4), `4px` (×3). A 2px-step run from 4 to 14 with no rationale for any step.

**Radii:** 51 declarations, 10 distinct. `3px` ×24, `4px` ×8, `2px` ×8, then `6px`, `999px`, `50%`, `1px`, `0`, `0 3px 3px 0`, `var(--spec-radius, 3px)`. The `3px`/`4px`/`2px` cluster is roughly one token's worth of intent expressed three ways; `999px` (pill) and `50%` (circle) are shape primitives rather than scale.

**For 1DS.2:** spacing needs a scale invented, not extracted. Colour and type can be derived from what exists because the roles converged. Spacing has no convergence to derive from, so the design system should impose a ladder (a 4px or 0.25rem base is the obvious candidate given the existing clustering) and let 1DS.5 and 1DS.6 round values onto it.

---

## 6. What 1DS.5 actually has to touch

Small, and smaller than the roadmap note implies. The known offenders, with real counts:

| File | Hex uses | Notes |
|---|---|---|
| `routes/+page.svelte` | 10 | greyscale only |
| `routes/collection/[id]/+page.svelte` | 6 | greyscale only |
| `routes/tag/[slug]/+page.svelte` | 4 | greyscale only |
| `components/shared/ExplainerNav.svelte` | 6 | already `var()`-wrapped; only the fallbacks change |
| `routes/+layout.svelte` | 0 | no `<style>` block at all |
| `routes/explainer/[id]/+page.svelte` | 0 | no `<style>` block at all |

**26 uses of 10 distinct greyscale values across four files**, none load-bearing, and `ExplainerNav`'s six are already behind custom properties with a documented override contract. 1DS.5 is an afternoon, not a week.

`+layout.svelte` has no style block whatsoever, which makes it the natural home for the `:root` token declarations 1DS.3 emits. `explainer/[id]/+page.svelte` is likewise bare, so explainer chrome currently inherits nothing.

---

## 7. Open questions for 1DS.2

1. **Is the unhurried layer the design system, or an input to it?** Six of twelve explainers share `unhurried.css`, making it the most-used visual system in the project, ahead of the hub's own. Section 4.2 finds it is also the most structural: 11 of its 15 values are ground, ink and hairline, with only the teal `#1f5a66` and the ochre `#9a5b18` carrying character. A palette that is mostly structure and already serves half the catalogue is a strong candidate to *become* the shared tokens rather than be replaced by them. The alternative is that it stays a named sub-family. This is the biggest call in the milestone and it belongs to 1DS.2.

2. **Where do fonts load from, and does `colour-is-a-defect` keep its four?** Six component-level fetches should become one in `app.html` for the shared three (Plex Mono, Fraunces, Newsreader). The open call is `colour-is-a-defect`'s Bodoni Moda, Barlow, Barlow Condensed and JetBrains Mono: four families for one explainer, and the only case in the project where the display face is not one of the shared serifs.

3. **Does the hub adopt warm or cool neutrals?** Every hub grey is exactly neutral: `#ddd`, `#eee`, `#f2f2f2` and `#ffffff` all have identical red and blue channels. Five of the six explainer grounds are measurably warm (red exceeds blue by 7 to 22 points: `#efeee8`, `#f7f4ed`, `#f7f3ea`, `#f6f2e9`, `#f6efe0`), and norway's `#faf8fd` is faintly cool. A reader moving from hub to explainer currently crosses a temperature change, and the hub is the odd one out.

4. **Dark mode's starting point.** `colour-is-a-defect`'s chrome is the only existing dark set and it already follows the role vocabulary. 1DS.7 should derive from it rather than invert the light palette mechanically.

---

## 8. Method

Counts come from `grep -rohE` over `src/**/*.{svelte,ts,css}`, deduplicated case-insensitively, with two classes of false positive removed by explicit filter rather than by eye: the nine HTML numeric entities in the colour grep (`&#8209;` and friends), and Svelte template expressions in the spacing greps (`gap: {cond ? a : b}`). Both were the same kind of error and both would have inflated the headline numbers.

Bucket totals were computed by walking the tree and attributing each distinct value to every area that uses it, then reconciled programmatically: 10 + 76 + 14 = 100 in section 4, and 42 + 34 = 76 in section 4.2. Warmth in question 3 is the red-minus-blue channel difference.

Classification is judgement, applied per value against one rule:

- **Character** when the explainer's own argument depends on that specific colour, evidenced by the prose or the markup rather than by taste: 4-englishes explains its violet convention in-page, norway binds its set to `--spec-key`/`--spec-str`/`--spec-num`/`--spec-lit`, cost-of-looking-fine builds a thesis on blue against red.
- **Structural drift** when the value fills a ground, ink or hairline role. The token names the authors chose are the evidence: `paper`, `page`, `parchment`, `ink`, `rule`, `hair` describe position in a layout, not meaning in an argument.
- **Out of scope** when the value is computed data rather than a styling decision, which in practice means only `colour-is-a-defect`'s gemstone layer.

One distinction runs through the whole document and is easy to misread. The *roles* converged across six explainers (section 1); the *values* almost never did (section 4). The design system is therefore being designed fresh against a set of requirements this audit establishes, not extracted from colours already in the tree.
