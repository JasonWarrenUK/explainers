# Explainers PHASE_1: Roadmap Overview

**29 tasks across 5 milestones.** Files: `.claude/roadmaps.json` (machine-readable), `docs/roadmaps/PHASE_1.md` (full task list with Mermaid dependency diagram).

> Phase 1 starts from a working set of nine ported explainers. Nothing already built appears as a task: the roadmap is forward-looking, and statuses come out of `roadmap.py recompute` rather than judgement.

---

## What we're building

The porting work is done. Nine explainers run as Svelte components, `registry.ts` resolves each id to a lazy import, `collections.ts` and the tag functions group them, and `ExplainerNav` moves a reader between them. That is a working site and almost nothing else. It has no visual identity beyond whatever hex values each explainer arrived with, no public address, no meta tags and one test file guarding twenty-nine components.

Phase 1 delivers four things on top of that. A design system authored in Claude Design and synced into the repo, so colour lives in one place instead of inline in every route. A kit of shared primitives pulled out of the toys, so the eleven interactive components in `cost-of-looking-fine` stop being the template for writing the next eleven by hand. Discovery that works the way readers actually move, including the back-link that currently guesses. And a deployment with the metadata a shared link needs.

The phase then closes with the tests and tidying that make continuing to change all of this safe. That ordering is deliberate: shipping first, pipeline extracted from what shipping teaches, per the phase decision.

## Milestone sequence and the reasoning behind it

**M1, Design system (7 tasks).** Everything visual waits on this, so it goes first, and it goes through Claude Design instead of being assembled ad hoc. The audit task leads because the palette cannot be designed without knowing what it has to cover, and because it forces an early decision that recurs later: which per-explainer colours are deliberate character and which are drift. `1DS.3` is the hinge of the whole phase, since the sync is what makes tokens available to both the routes and the extracted kit.

**M2, Shared primitives (5 tasks).** The inventory task is independent and can start immediately, which matters because it is the one piece of M2 that needs no tokens. Extraction splits into controls and layout so the two can proceed in parallel once `1DS.3` lands. The authoring guide comes last on purpose: written after the migration, it documents what the kit actually does instead of what it was meant to do.

**M3, Discovery (5 tasks).** The `getStaticParent` TODO leads because it is a known correctness bug: collection membership is non-exclusive, so a reader arriving through a tag page gets sent back to a collection they never visited. Tag pages and search form their own chain, independent of the collection work, which gives the milestone two entry points. The landing page rebuild sits at the end because it needs both dark mode and the navigation it is meant to expose.

**M4, Publish (6 tasks).** Three independent starts: the adapter choice, the meta tags and the README. Meta tags need no design work, since the titles and blurbs already sit in `ExplainerMeta` and simply never reach the document head. Social cards wait on the verified palette. The deploy task depends on the whole of M1 plus the four other publish tasks and the landing page, which makes it the phase's terminal task by construction.

**M5, Confidence (6 tasks).** Two tasks start immediately: clearing the root-level source files, and the registry integrity test that guards against the obvious failure of adding an explainer to one list and not the other. The rest follow the code they test. The accessibility pass is a soft milestone member, so it stays visible without holding up anything downstream.

## Decisions that shaped the structure

**Claude Design is named in the task text.** `1DS.2` specifies the design system is built as a Claude Design project and `1DS.3` specifies `/design-sync` as the route into the repo. That was an explicit scoping decision, so it belongs in the roadmap itself and not in someone's memory of the conversation.

**Nothing already built appears as a task.** Nine ported explainers, the registry, collections, tags and nav are all finished work. Listing them as `done` tasks would inflate the roadmap and teach the dashboard to report progress that predates the phase.

**Two soft dependencies, deliberately.** Tag pages (`3NV.3`) read better after the hex replacement lands, and the README (`4PB.5`) reads better after the authoring guide exists, but neither should sit `blocked` waiting. Both are authored as `softDependsOn`, so they render as dotted edges and impose nothing.

**The accessibility pass does not gate the milestone.** `5QA.5` is marked `softMilestone`, which keeps it counted in M5 and visible in the dashboard while letting the milestone close without it. An accessibility pass expands to fill whatever time it is given; making it a hard gate would park M5 indefinitely.

**M1 is a hard dependency of the deploy.** `4PB.6` lists `M1` directly rather than enumerating its tasks. Deploying with half the design system applied would mean shipping a site that looks mid-refactor, which is the one outcome the phase is arranged to avoid.

## External blockers (flag early)

None. This is a solo project with no external gates, so `externalGates` is empty and every unblocked task is genuinely startable now.

Two decisions inside the phase are worth settling early, since both sit on the critical path or near it. The hosting target (`4PB.1`) is unresolved between Vercel and GitHub Pages; a set of prerenderable essays would suit static output, but nothing is committed. And `1DS.1`'s call on which per-explainer colours survive tokenisation shapes how much work `1DS.6` turns out to be.
