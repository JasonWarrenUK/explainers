import React, { useState, useEffect, useMemo, useRef } from "react";

/* ============================================================
   WHAT NOBODY MEANT
   Six explainers and a front door. Each topic below is a
   self-contained artefact; this file holds them together.
   ============================================================ */

const H = {
  ground: "#0D1719",
  panel: "#132326",
  panelLift: "#1A2E32",
  ink: "#E9E3D5",
  inkDim: "#93A6A8",
  inkFaint: "#5C7073",
  signal: "#F0BE4B",
  signalDim: "#8A7233",
  cool: "#6FB3C0",
  coolDim: "#3C6570",
  rule: "#294044",
};

const shellStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,800&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300&family=IBM+Plex+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.hub-shell { background: ${H.ground}; min-height: 100%; }

.hub-root {
  background: ${H.ground}; color: ${H.ink};
  font-family: 'Newsreader', Georgia, serif; font-weight: 300;
  font-size: 19px; line-height: 1.62; padding-bottom: 7rem;
  -webkit-font-smoothing: antialiased;
}
.hub-wrap { max-width: 46rem; margin: 0 auto; padding: 0 1.5rem; }

.hub-mast { padding: 7rem 0 3.5rem; }
.hub-eyebrow {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem;
  letter-spacing: 0.22em; text-transform: uppercase; color: ${H.inkFaint}; margin: 0 0 1.4rem;
}
.hub-mast h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 144;
  font-weight: 800; font-size: clamp(2.8rem, 9vw, 5rem);
  line-height: 0.95; letter-spacing: -0.035em; margin: 0 0 1.5rem;
}
.hub-standfirst { font-size: clamp(1.05rem, 2.4vw, 1.3rem); max-width: 33rem; margin: 0; }

.hub-section { padding: 3.2rem 0; border-top: 1px solid ${H.rule}; }
.hub-section p { margin: 0 0 1.25rem; max-width: 40rem; }
.hub-section h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600; font-size: clamp(1.6rem, 4vw, 2.1rem);
  line-height: 1.08; letter-spacing: -0.02em; margin: 0 0 1.4rem;
}
.hub-term { font-family: 'IBM Plex Mono', monospace; font-size: 0.93em; color: ${H.cool}; }

.hub-conditions { display: grid; gap: 0.7rem; margin: 1.8rem 0 0; }
.hub-cond {
  border: 1px solid ${H.rule}; border-left: 2px solid ${H.signalDim};
  border-radius: 2px; padding: 1rem 1.15rem; background: ${H.panel};
}
.hub-cond-n {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: ${H.signal}; margin-bottom: 0.4rem;
}
.hub-cond p { font-size: 0.96rem; color: ${H.inkDim}; margin: 0; max-width: none; }
.hub-cond strong { color: ${H.ink}; font-weight: 400; }

.hub-group-label {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.64rem;
  letter-spacing: 0.18em; text-transform: uppercase; color: ${H.inkFaint};
  margin: 2.6rem 0 0.9rem;
}
.hub-group-label:first-of-type { margin-top: 1.8rem; }
.hub-group-note { font-size: 0.94rem; color: ${H.inkDim}; margin: 0 0 1.2rem; max-width: 38rem; }

.hub-cards { display: grid; gap: 0.7rem; }
.hub-card {
  display: block; width: 100%; text-align: left; cursor: pointer;
  background: ${H.panel}; border: 1px solid ${H.rule}; border-radius: 2px;
  padding: 1.15rem 1.25rem; font-family: inherit;
  transition: border-color 150ms ease, background 150ms ease;
}
.hub-card:hover { border-color: ${H.signalDim}; background: ${H.panelLift}; }
.hub-card:focus-visible { outline: 2px solid ${H.cool}; outline-offset: 2px; }
.hub-card-top {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem;
}
.hub-card-topic {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: ${H.inkFaint};
}
.hub-card-n {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem;
  letter-spacing: 0.12em; color: ${H.signalDim};
}
.hub-card h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 48;
  font-weight: 600; font-size: 1.3rem; line-height: 1.15;
  letter-spacing: -0.015em; margin: 0 0 0.5rem; color: ${H.ink};
}
.hub-card p { font-size: 0.95rem; color: ${H.inkDim}; margin: 0; max-width: none; }

.hub-colophon {
  margin-top: 4rem; padding-top: 1.6rem; border-top: 1px solid ${H.rule};
  font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.1em; text-transform: uppercase; color: ${H.inkFaint};
}

/* ---------- the bar shown while reading a topic ---------- */

.hub-bar {
  position: sticky; top: 0; z-index: 20;
  background: rgba(13, 23, 25, 0.94);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid ${H.rule};
}
.hub-bar-inner {
  max-width: 46rem; margin: 0 auto; padding: 0.7rem 1.5rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
}
.hub-bar-btn {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem;
  letter-spacing: 0.13em; text-transform: uppercase;
  background: transparent; border: 1px solid ${H.rule}; color: ${H.inkDim};
  padding: 0.45rem 0.85rem; border-radius: 1px; cursor: pointer; white-space: nowrap;
}
.hub-bar-btn:hover { background: ${H.panelLift}; color: ${H.ink}; }
.hub-bar-btn:focus-visible { outline: 2px solid ${H.cool}; outline-offset: 2px; }
.hub-bar-btn[disabled] { opacity: 0.3; cursor: default; }
.hub-bar-btn[disabled]:hover { background: transparent; color: ${H.inkDim}; }
.hub-bar-where {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.63rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: ${H.inkFaint};
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* ---------- the tail shown after a topic ---------- */

.hub-tail { border-top: 1px solid ${H.rule}; }
.hub-tail-inner { max-width: 46rem; margin: 0 auto; padding: 2.8rem 1.5rem 5rem; }
.hub-tail-lab {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.63rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: ${H.inkFaint}; margin-bottom: 1rem;
}

@media (max-width: 560px) {
  .hub-root { font-size: 17.5px; }
  .hub-mast { padding: 4rem 0 2.6rem; }
  .hub-section { padding: 2.6rem 0; }
  .hub-bar-inner { padding: 0.6rem 1rem; }
}
`;

/* ============================================================
   THE INDEX
   ============================================================ */

const READING = [
  {
    id: "inherited",
    n: "One",
    topic: "Historical linguistics",
    title: "Inherited Property",
    blurb:
      "The words you use every day were handed to you by people who left no other trace. Sorted carefully enough, they give those people back.",
  },
  {
    id: "otherface",
    n: "Two",
    topic: "Early medieval history",
    title: "The Other Face",
    blurb:
      "For six hundred years an unusual number of peoples were deciding who they were. Almost nothing they wrote about it was addressed to us.",
  },
  {
    id: "break",
    n: "Three",
    topic: "The Bronze Age",
    title: "The Break",
    blurb:
      "The world was joined up, and then most of it stopped. The people who came next could see the ruins and could not read a word.",
  },
  {
    id: "olderlayer",
    n: "Six",
    topic: "Comparative mythology",
    title: "The Older Layer",
    blurb:
      "A text is a stack of things. Underneath the surface are earlier versions, insertions, and the beliefs it was written to argue against.",
  },
];

const MAKING = [
  {
    id: "apparatus",
    n: "Four",
    topic: "Procedural generation",
    title: "The Apparatus",
    blurb:
      "Some stories are written and some are grown. This one is grown around you first and explained afterwards.",
  },
  {
    id: "whatexists",
    n: "Five",
    topic: "Designing data schemas",
    title: "What Exists",
    blurb:
      "Somebody decides what kinds of thing there are before anything gets built. It sounds administrative. It is where people get left out.",
  },
];

const ORDER = ["inherited", "otherface", "break", "apparatus", "whatexists", "olderlayer"];
const ALL = [...READING, ...MAKING];
const byId = (id) => ALL.find((t) => t.id === id);

function Card({ item, onOpen }) {
  return (
    <button className="hub-card" onClick={() => onOpen(item.id)}>
      <div className="hub-card-top">
        <span className="hub-card-topic">{item.topic}</span>
        <span className="hub-card-n">{item.n}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.blurb}</p>
    </button>
  );
}

function Index({ onOpen }) {
  return (
    <div className="hub-root">
      <div className="hub-wrap">
        <header className="hub-mast">
          <p className="hub-eyebrow">Six explainers</p>
          <h1>
            What Nobody
            <br />
            Meant
          </h1>
          <p className="hub-standfirst">
            Six things I find it hard to shut up about, explained from scratch,
            with no assumed knowledge and nothing to read first.
          </p>
        </header>

        <section className="hub-section">
          <h2>Start with a seagull.</h2>
          <p>
            In Chekhov's play, Nina says two words about herself:{" "}
            <span className="hub-term">ya chaika</span>. Russian has no articles,
            so what she says is, literally, <em>I seagull</em>.
          </p>
          <p>
            English will not let a translator leave it there. You have to choose
            between <em>I am the seagull</em>, which makes her the one from
            earlier in the play, and <em>I am a seagull</em>, which makes her
            something more like a bird that got shot. Both are defensible. The
            original commits to neither, and the not committing is doing real
            work.
          </p>
          <p>
            <strong style={{ color: H.ink, fontWeight: 400 }}>
              Somebody has to decide, and the decision costs something, and you
              can watch it being made.
            </strong>{" "}
            Everything below is a version of that.
          </p>
        </section>

        <section className="hub-section">
          <h2>What these six have in common.</h2>
          <p>
            They look unrelated and they are the same interest wearing different
            clothes. Three things are true of all of them at once, and a topic
            that misses any one of the three turns out not to hold my attention
            at all.
          </p>
          <div className="hub-conditions">
            <div className="hub-cond">
              <div className="hub-cond-n">One</div>
              <p>
                <strong>The subject is people rather than a system.</strong> A
                god somebody worshipped, not a story type. A language somebody
                spoke, not a well-formed reconstruction.
              </p>
            </div>
            <div className="hub-cond">
              <div className="hub-cond-n">Two</div>
              <p>
                <strong>The evidence was not meant for us.</strong> A place
                name, a schoolmaster's list of errors, a polemic that has to
                describe the thing it wants abolished. Nobody was trying to
                inform anybody.
              </p>
            </div>
            <div className="hub-cond">
              <div className="hub-cond-n">Three</div>
              <p>
                <strong>Something is at stake in the resolving.</strong> Either
                the chain carrying the meaning broke and nobody can read it now,
                or two incompatible systems met and somebody had to commit.
              </p>
            </div>
          </div>
        </section>

        <section className="hub-section">
          <h2>The six.</h2>
          <p>
            Any of them can be read on its own and in any order. They are
            grouped by which side of the evidence you are standing on, which is
            the most interesting thing the whole exercise turned up.
          </p>

          <div className="hub-group-label">Reading what survived</div>
          <p className="hub-group-note">
            Somebody else's broken transmission, and what can be recovered from
            it.
          </p>
          <div className="hub-cards">
            {READING.map((t) => (
              <Card item={t} key={t.id} onOpen={onOpen} />
            ))}
          </div>

          <div className="hub-group-label">Building the conditions</div>
          <p className="hub-group-note">
            The same interest from the other end: machines that manufacture an
            unreadable past, and rulings about what exists at all.
          </p>
          <div className="hub-cards">
            {MAKING.map((t) => (
              <Card item={t} key={t.id} onOpen={onOpen} />
            ))}
          </div>

          <div className="hub-colophon">Six explainers · read in any order</div>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   TOPIC BODIES
   ============================================================ */


/* ============================================================
   InheritedProperty
   ============================================================ */

const Inherited = (() => {

/* ============================================================
   INHERITED PROPERTY
   An explainer on historical linguistics and language families.
   Six movements. The last one has nothing to click.
   ============================================================ */

const C = {
  ground: "#0D1719",
  groundDeep: "#080F11",
  panel: "#132326",
  panelLift: "#1A2E32",
  ink: "#E9E3D5",
  inkDim: "#93A6A8",
  inkFaint: "#5C7073",
  signal: "#F0BE4B",
  signalDim: "#8A7233",
  cool: "#6FB3C0",
  rule: "#294044",
};

const FONTS = `
`;

const styles = `
${FONTS}

*, *::before, *::after { box-sizing: border-box; }

.ip-root {
  background: ${C.ground};
  color: ${C.ink};
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 300;
  font-size: 19px;
  line-height: 1.62;
  min-height: 100%;
  padding-bottom: 8rem;
  -webkit-font-smoothing: antialiased;
}

.ip-wrap { max-width: 46rem; margin: 0 auto; padding: 0 1.5rem; }

.ip-display {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 120;
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.015em;
}

.ip-mono {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-weight: 400;
}

/* ---------- masthead ---------- */

.ip-mast { padding: 7rem 0 5rem; }
.ip-mast h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 144;
  font-weight: 800;
  font-size: clamp(2.9rem, 9vw, 5rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
  margin: 0 0 1.6rem;
}
.ip-mast .ip-standfirst {
  font-size: clamp(1.05rem, 2.4vw, 1.3rem);
  max-width: 32rem;
  color: ${C.ink};
  margin: 0 0 2.5rem;
}
.ip-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${C.inkFaint};
  margin: 0 0 1.4rem;
}

/* ---------- movements ---------- */

.ip-movement { padding: 4.5rem 0; border-top: 1px solid ${C.rule}; }
.ip-movement:first-of-type { border-top: none; }

.ip-rail {
  display: flex;
  align-items: baseline;
  gap: 0.85rem;
  margin-bottom: 1.9rem;
  flex-wrap: wrap;
}
.ip-rail-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: ${C.signal};
  letter-spacing: 0.1em;
}
.ip-rail-class {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${C.inkFaint};
  padding-bottom: 3px;
}
.ip-rail-class.solid { border-bottom: 1px solid ${C.inkFaint}; }
.ip-rail-class.dashed { border-bottom: 1px dashed ${C.inkFaint}; }
.ip-rail-class.none { border-bottom: none; opacity: 0.55; }

.ip-movement h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600;
  font-size: clamp(1.75rem, 4.6vw, 2.5rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
}

.ip-movement p { margin: 0 0 1.25rem; max-width: 40rem; }
.ip-movement p.ip-lead { font-size: 1.1rem; }

em { font-style: italic; }
.ip-form { font-family: 'IBM Plex Mono', monospace; font-size: 0.94em; color: ${C.ink}; }
.ip-recon { font-family: 'IBM Plex Mono', monospace; font-size: 0.94em; color: ${C.signal}; }

/* ---------- buttons ---------- */

.ip-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  background: transparent;
  color: ${C.signal};
  border: 1px solid ${C.signalDim};
  padding: 0.62rem 1.15rem;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease;
  border-radius: 1px;
}
.ip-btn:hover { background: ${C.signalDim}; color: ${C.groundDeep}; }
.ip-btn:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 3px; }
.ip-btn[disabled] { opacity: 0.34; cursor: default; }
.ip-btn[disabled]:hover { background: transparent; color: ${C.signal}; }

.ip-btnrow { display: flex; gap: 0.7rem; flex-wrap: wrap; margin: 1.9rem 0 0; }

/* ---------- cognate table (signature) ---------- */

.ip-table {
  background: ${C.panel};
  border: 1px solid ${C.rule};
  padding: 1.6rem 1.4rem 1.3rem;
  margin: 2rem 0 0;
  border-radius: 2px;
}
.ip-table-cap {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${C.inkFaint};
  margin-bottom: 1.15rem;
}
.ip-row {
  display: grid;
  grid-template-columns: 9.5rem 1fr;
  gap: 1rem;
  align-items: baseline;
  padding: 0.34rem 0;
  opacity: 0;
  transform: translateY(6px);
  animation: ipIn 460ms cubic-bezier(.2,.7,.3,1) forwards;
}
@keyframes ipIn { to { opacity: 1; transform: none; } }
.ip-lang {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.76rem;
  color: ${C.inkDim};
  letter-spacing: 0.02em;
}
.ip-word {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.06rem;
  color: ${C.ink};
  letter-spacing: 0.01em;
}
.ip-word .hit { color: ${C.signal}; }
.ip-row.proto { margin-top: 0.7rem; padding-top: 0.85rem; border-top: 1px dashed ${C.rule}; }
.ip-row.proto .ip-word { color: ${C.signal}; }
.ip-row.proto .ip-lang { color: ${C.signalDim}; }
.ip-row.proto.attested { border-top: 1px solid ${C.rule}; }
.ip-row.proto.attested .ip-word { color: ${C.cool}; }
.ip-row.proto.attested .ip-lang { color: ${C.cool}; opacity: 0.7; }

.ip-note {
  font-size: 0.92rem;
  color: ${C.inkDim};
  margin: 1.25rem 0 0;
  padding-left: 0.9rem;
  border-left: 1px solid ${C.rule};
  max-width: 36rem;
}

/* ---------- commitment ---------- */

.ip-q { margin: 1.9rem 0 0; }
.ip-q-text { font-size: 1.02rem; margin: 0 0 1rem; }
.ip-opts { display: grid; gap: 0.5rem; }
.ip-opt {
  text-align: left; background: transparent; border: 1px solid ${C.rule};
  color: ${C.ink}; font-family: 'Newsreader', Georgia, serif; font-size: 0.97rem;
  font-weight: 300; padding: 0.72rem 1rem; border-radius: 2px; cursor: pointer;
}
.ip-opt:hover { border-color: ${C.signalDim}; background: ${C.panel}; }
.ip-opt:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 2px; }
.ip-opt.chosen { border-color: ${C.signal}; color: ${C.signal}; }
.ip-opt.chosen::before { content: "▸ "; }

/* ---------- joint cards ---------- */

.ip-cards { display: grid; gap: 0.7rem; margin: 2rem 0 0; }
.ip-card {
  background: ${C.panel};
  border: 1px solid ${C.rule};
  border-radius: 2px;
  padding: 0;
  overflow: hidden;
}
.ip-card-head {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: ${C.ink};
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.02rem;
  font-weight: 400;
  padding: 1.05rem 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.ip-card-head:hover { background: ${C.panelLift}; }
.ip-card-head:focus-visible { outline: 2px solid ${C.cool}; outline-offset: -2px; }
.ip-card-mark {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
  color: ${C.signal};
  flex-shrink: 0;
}
.ip-card-body {
  padding: 0 1.2rem 1.25rem;
  font-size: 0.98rem;
  color: ${C.inkDim};
  max-width: 40rem;
}
.ip-card-body strong { color: ${C.ink}; font-weight: 400; }
.ip-card-body p { margin: 0 0 0.75rem; }
.ip-card-body p:last-child { margin-bottom: 0; }

/* ---------- stack (palaeontology) ---------- */

.ip-stack { margin: 2rem 0 0; display: grid; gap: 0.55rem; }
.ip-strat {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
  background: ${C.panel};
  border: 1px solid ${C.rule};
  border-left: 2px solid ${C.signalDim};
  padding: 0.95rem 1.15rem;
  border-radius: 2px;
  align-items: baseline;
}
.ip-strat-key {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.94rem;
  color: ${C.signal};
}
.ip-strat-val { font-size: 0.96rem; color: ${C.inkDim}; }
.ip-strat-val strong { color: ${C.ink}; font-weight: 400; }

.ip-fossil {
  background: ${C.panel};
  border: 1px solid ${C.rule};
  border-left: 2px solid ${C.signalDim};
  padding: 1.1rem 1.2rem 1.15rem;
  border-radius: 2px;
}
.ip-fossil-head {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 0.55rem;
}
.ip-fossil-form {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.02rem;
  color: ${C.signal};
}
.ip-fossil-gloss {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${C.inkFaint};
}
.ip-fossil-fam {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${C.signalDim};
  margin-left: auto;
}
.ip-fossil-kids {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.86rem;
  color: ${C.cool};
  line-height: 1.75;
  margin-bottom: 0.75rem;
}
.ip-fossil-kids .src { color: ${C.inkFaint}; }
.ip-fossil-body { font-size: 0.96rem; color: ${C.inkDim}; }
.ip-fossil-body p { margin: 0 0 0.7rem; }
.ip-fossil-body p:last-child { margin-bottom: 0; }
.ip-fossil-body strong { color: ${C.ink}; font-weight: 400; }

/* ---------- final movement ---------- */

.ip-final { padding: 6rem 0 3rem; border-top: 1px solid ${C.rule}; }
.ip-final h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600;
  font-size: clamp(1.75rem, 4.6vw, 2.5rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
}
.ip-final p { max-width: 38rem; margin: 0 0 1.3rem; }
.ip-orphans {
  margin: 2.4rem 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.02rem;
  color: ${C.inkDim};
  line-height: 2.1;
  letter-spacing: 0.04em;
}
.ip-colophon {
  margin-top: 5rem;
  padding-top: 1.6rem;
  border-top: 1px solid ${C.rule};
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.inkFaint};
}

@media (max-width: 560px) {
  .ip-root { font-size: 17.5px; }
  .ip-row { grid-template-columns: 7rem 1fr; gap: 0.7rem; }
  .ip-strat { grid-template-columns: 5.5rem 1fr; gap: 0.7rem; }
  .ip-mast { padding: 4rem 0 3rem; }
  .ip-movement { padding: 3.2rem 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ip-row { animation: none; opacity: 1; transform: none; }
  .ip-btn { transition: none; }
}
`;

/* ============================================================
   DATA
   ============================================================ */

// Groundwork — a family the reader already believes in.
const GROUNDWORK = {
  caption: "Romance · ‘hand’",
  protoAttested: true,
  proto: { lang: "Latin", parts: ["", "manus", ""] },
  rows: [
    { lang: "Portuguese", parts: ["m", "ã", "o"] },
    { lang: "Spanish", parts: ["m", "an", "o"] },
    { lang: "French", parts: ["m", "ain", ""] },
    { lang: "Italian", parts: ["m", "an", "o"] },
    { lang: "Romanian", parts: ["m", "ân", "ă"] },
  ],
  note:
    "Nobody finds this suspicious. These are all later versions of Latin, changed by nothing more dramatic than every generation speaking a little differently from the one before, for two thousand years.",
};

// Movement 1 — three progressive reveals, widening the family.
const REVEALS = [
  {
    caption: "Polynesian · ‘forbidden, set apart’",
    proto: { lang: "Proto-Polynesian", parts: ["", "tapu", ""] },
    rows: [
      { lang: "Tongan", parts: ["", "tapu", ""] },
      { lang: "Samoan", parts: ["", "tapu", ""] },
      { lang: "Māori", parts: ["", "tapu", ""] },
      { lang: "Tahitian", parts: ["", "tapu", ""] },
      { lang: "Hawaiian", parts: ["", "kapu", ""] },
    ],
    note:
      "English took this word from Tongan in the 1770s and spelled it taboo. Look at the Hawaiian row. It has a k where every other language has a t. On its own that means nothing at all. The question is whether it happens again.",
  },
  {
    caption: "Polynesian · ‘person’",
    proto: { lang: "Proto-Polynesian", parts: ["", "taŋata", ""] },
    rows: [
      { lang: "Tongan", parts: ["", "tangata", ""] },
      { lang: "Samoan", parts: ["", "tagata", ""] },
      { lang: "Māori", parts: ["", "tangata", ""] },
      { lang: "Tahitian", parts: ["", "ta’ata", ""] },
      { lang: "Hawaiian", parts: ["", "kanaka", ""] },
    ],
    note:
      "Hawaiian does it again, in both positions where the others have t. Tahitian has dropped the middle consonant altogether and left a catch in the throat where it used to be. This is the thing to notice: neither language is varying at random. Each is applying a rule of its own, in every word, without exception and without anybody deciding to.",
  },
  {
    caption: "Austronesian · ‘eye’",
    proto: { lang: "Proto-Austronesian", parts: ["", "maCa", ""] },
    rows: [
      { lang: "Malagasy · Madagascar", parts: ["ma", "s", "o"] },
      { lang: "Malay · Sumatra", parts: ["ma", "t", "a"] },
      { lang: "Tagalog · Luzon", parts: ["ma", "t", "a"] },
      { lang: "Fijian · Viti Levu", parts: ["ma", "t", "a"] },
      { lang: "Māori · Aotearoa", parts: ["ma", "t", "a"] },
      { lang: "Hawaiian · Hawai‘i", parts: ["ma", "k", "a"] },
    ],
    note:
      "Now compare the first row with the last. Malagasy is spoken on Madagascar, off the coast of Mozambique. Hawaiian is spoken in the middle of the Pacific. The same rules connect them, and the family they belong to runs from the east coast of Africa to Rapa Nui, better than halfway round the planet. It got there by boat, and this is most of the evidence that it did.",
  },
];

// Movement 2 — the joints.
const JOINTS = [
  {
    q: "How many blues are there?",
    a: (
      <>
        <p>
          English has one basic word for blue. If you want to be more specific
          you reach for a modifier, so you get light blue and navy and sky
          blue, all of them versions of a single colour.
        </p>
        <p>
          Russian has two, and they are not versions of each other.{" "}
          <span className="ip-form">Goluboy</span> and{" "}
          <span className="ip-form">siniy</span> are separate basic colours in
          the way that pink and red are separate for an English speaker. Asked
          to name the colour of a clear sky and the colour of deep water, a
          Russian speaker is not choosing between shades of one thing.
        </p>
        <p>
          <strong>There is a measurable consequence.</strong> Russian speakers
          are consistently quicker at telling those two ranges apart, because
          their language obliges them to mark the boundary every time they
          mention either one. Neither language experiences its own arrangement
          as a decision that was ever made.
        </p>
      </>
    ),
  },
  {
    q: "Can you say “my brother” without saying more?",
    a: (
      <>
        <p>
          In English you can mention a sibling and stop there. Whether they are
          older or younger than you is extra detail, supplied if it happens to
          matter.
        </p>
        <p>
          Hungarian does not offer that option.{" "}
          <span className="ip-form">Báty</span> is an older brother and{" "}
          <span className="ip-form">öcs</span> is a younger one, and there is no
          neutral word covering both. Japanese works the same way, with{" "}
          <span className="ip-form">ani</span> and{" "}
          <span className="ip-form">otōto</span>.
        </p>
        <p>
          <strong>
            So a speaker of either language cannot refer to a brother at all
            without disclosing the birth order.
          </strong>{" "}
          It is not information they are choosing to include. It is built into
          the only words available.
        </p>
      </>
    ),
  },
  {
    q: "How do you know?",
    a: (
      <>
        <p>
          English lets you report an event without saying how you came by it.{" "}
          <em>He came</em> works equally well whether you watched him arrive,
          heard about it from a friend, or worked it out from the wet coat in
          the hall.
        </p>
        <p>
          Turkish makes you choose before the sentence can end.{" "}
          <span className="ip-form">Geldi</span> claims direct knowledge: you
          were there. <span className="ip-form">Gelmiş</span> marks the
          opposite: you were told, or you inferred it afterwards.
        </p>
        <p>
          <strong>There is no third form that stays out of it.</strong> Every
          statement about somebody else's actions in the past commits the
          speaker to an account of their own evidence, whether they wanted to
          give one or not.
        </p>
      </>
    ),
  },
  {
    q: "Do the joints stay put?",
    a: (
      <>
        <p>
          They do not, and English is a good place to watch them move.
        </p>
        <p>
          <span className="ip-form">Silly</span> began as Old English{" "}
          <span className="ip-form">gesǣlig</span>, which meant blessed. Blessed
          shaded into innocent, innocent into naive, and naive into foolish.{" "}
          <span className="ip-form">Nice</span> arrived from Latin{" "}
          <span className="ip-form">nescius</span>, ignorant, and worked through
          foolish, then shy, then fussy, before settling into its present job.
        </p>
        <p>
          <strong>
            Each step happened because somebody used a word where two readings
            were both available, and a listener took one of them.
          </strong>{" "}
          Nothing decayed and nobody made a mistake. A very large number of very
          small rulings accumulated, and the word ended up somewhere its
          earliest speakers would not recognise.
        </p>
      </>
    ),
  },
];

// Movement 3 — palaeontology. Every reconstruction arrives with living descendants.
const REMEMBERED = [
  {
    form: "*kʷekʷlos",
    gloss: "wheel",
    fam: "Proto-Indo-European",
    kids: [
      ["English", "wheel"],
      ["Greek", "kúklos → cycle, bicycle, encyclopedia"],
      ["Sanskrit", "cakra → chakra"],
      ["Old Norse", "hjól"],
    ],
    body: (
      <>
        <p>
          The same word sits underneath all of these, in branches of the family
          that had no contact with each other for thousands of years. That
          pattern means it was inherited from the common ancestor rather than
          passed around later.
        </p>
        <p>
          <strong>
            Which produces a date. Wheeled vehicles do not appear anywhere in
            the archaeological record before roughly 3500 BC.
          </strong>{" "}
          If the ancestral community had a shared word for the wheel, it had not
          yet broken up when the wheel reached it, and the whole family tree
          acquires a floor it cannot sink below.
        </p>
      </>
    ),
  },
  {
    form: "*melit",
    gloss: "honey",
    fam: "Proto-Indo-European",
    kids: [
      ["Greek", "méli → mellifluous"],
      ["Latin", "mel → molasses"],
      ["English", "mildew (‘honey-dew’)"],
      ["Hittite", "milit"],
    ],
    body: (
      <>
        <p>
          They had honey, and separately they had a word for the drink
          fermented from it.
        </p>
        <p>
          English lost the root almost completely. It survives in one
          unexpected place: mildew was originally{" "}
          <span className="ip-form">mildēaw</span>, honey-dew, a word about
          sticky deposits on plants that ended up describing damp walls.
        </p>
        <p>
          <strong>The absences do work too.</strong> There is no comparably
          secure shared word for the sea, and that gap has kept people arguing
          about where these communities lived for well over a century.
        </p>
      </>
    ),
  },
  {
    form: "*ama",
    gloss: "outrigger float",
    fam: "Proto-Polynesian",
    kids: [
      ["Hawaiian", "ama"],
      ["Māori", "ama"],
      ["Samoan", "ama"],
      ["Fijian", "cama"],
    ],
    body: (
      <>
        <p>
          Back to the family from the first section. This is the beam lashed
          parallel to a canoe's hull to stop it rolling over, and it is still
          the standard term in outrigger paddling today.
        </p>
        <p>
          <strong>
            A community with a dedicated word for that specific component has
            solved open-water sailing.
          </strong>{" "}
          What follows is the largest expansion by sea that anybody managed
          before the modern period.
        </p>
      </>
    ),
  },
  {
    form: "*beRas",
    gloss: "husked rice",
    fam: "Proto-Austronesian",
    kids: [
      ["Malay", "beras"],
      ["Javanese", "beras"],
      ["Tagalog", "bigas"],
      ["Malagasy", "vary"],
    ],
    body: (
      <>
        <p>
          The same family again, and it fills in the other half of the picture.
          These were farmers before they were sailors, and they took the crop
          with them.
        </p>
        <p>
          <strong>
            Put the two words together and you have people with the technology
            to cross open ocean and a reason to arrive somewhere they can
            plant.
          </strong>{" "}
          The vocabulary amounts to a packing list for a way of life nobody
          wrote down.
        </p>
      </>
    ),
  },
];

// Movement 5 — the control case. Two words, separate tables, no empty cells.
const CONTROL_HORSE = [
  ["French", "cheval"],
  ["Spanish", "caballo"],
  ["Italian", "cavallo"],
  ["Portuguese", "cavalo"],
  ["Romanian", "cal"],
];
const CONTROL_SPEAK = [
  ["French", "parler"],
  ["Italian", "parlare"],
  ["Catalan", "parlar"],
  ["Occitan", "parlar"],
];

/* ============================================================
   COMPONENTS
   ============================================================ */

function Rail({ n, cls, kind }) {
  return (
    <div className="ip-rail">
      {n && <span className="ip-rail-num">{n}</span>}
      <span className={`ip-rail-class ${kind}`}>{cls}</span>
    </div>
  );
}

function Word({ parts }) {
  const [pre, hit, post] = parts;
  return (
    <span className="ip-word">
      {pre}
      <span className="hit">{hit}</span>
      {post}
    </span>
  );
}

function CognateTable({ data, showProto }) {
  const attested = !!data.protoAttested;
  return (
    <div className="ip-table">
      <div className="ip-table-cap">{data.caption}</div>
      {data.rows.map((r, i) => (
        <div
          className="ip-row"
          key={r.lang}
          style={{ animationDelay: `${i * 85}ms` }}
        >
          <span className="ip-lang">{r.lang}</span>
          <Word parts={r.parts} />
        </div>
      ))}
      {showProto && (
        <div
          className={`ip-row proto${attested ? " attested" : ""}`}
          style={{ animationDelay: `${data.rows.length * 85 + 120}ms` }}
        >
          <span className="ip-lang">{data.proto.lang}</span>
          <span className="ip-word">
            <span className="hit">
              {attested ? "" : "*"}
              {data.proto.parts[1]}
            </span>
          </span>
        </div>
      )}
      <p className="ip-note">{data.note}</p>
    </div>
  );
}

function Commit({ text, options, value, onPick }) {
  return (
    <div className="ip-q">
      <p className="ip-q-text">{text}</p>
      <div className="ip-opts">
        {options.map((o) => (
          <button
            key={o.key}
            className={`ip-opt${value === o.key ? " chosen" : ""}`}
            onClick={() => onPick(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function JointCard({ item, open, onToggle }) {
  return (
    <div className="ip-card">
      <button
        className="ip-card-head"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <span className="ip-card-mark">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="ip-card-body">{item.a}</div>}
    </div>
  );
}

function Movement({ n, cls, kind, title, children }) {
  return (
    <section className="ip-movement">
      <Rail n={n} cls={cls} kind={kind} />
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/* ============================================================
   MOVEMENTS
   ============================================================ */

function Groundwork() {
  return (
    <section className="ip-movement">
      <Rail cls="Groundwork" kind="solid" />
      <h2>You already believe in one of these.</h2>
      <p className="ip-lead">
        French, Spanish and Italian are related. You knew that before you
        arrived, and you know roughly why: the Romans got everywhere, and these
        are what happened to Latin afterwards.
      </p>
      <CognateTable data={GROUNDWORK} showProto={true} />
      <p style={{ marginTop: "2.2rem" }}>
        That is a language family. Not a resemblance, and not a borrowing. A
        group of languages that are all the same language, further on.
      </p>
      <p>
        Two things follow from it. The first is that relatives need not be
        recognisable: a Portuguese speaker and a Romanian speaker cannot hold a
        conversation. The second is the entire subject.{" "}
        <strong style={{ color: C.ink, fontWeight: 400 }}>
          Latin happens to be sitting in a library.
        </strong>{" "}
        Almost no family comes with the parent attached, and the work is
        recovering a parent nobody wrote down.
      </p>
      <p>
        Which raises the fair objection, and you should hold onto it: plenty of
        words in unrelated languages look alike by pure chance. So resemblance
        cannot be the test. Something else has to be.
      </p>
    </section>
  );
}

function MovementOne() {
  const [step, setStep] = useState(0);
  return (
    <Movement
      n="I"
      cls="Attested"
      kind="solid"
      title="You already own two words from a family you have never heard of."
    >
      <p className="ip-lead">
        <em>Taboo</em> and <em>tattoo</em>. Cook's crews picked them up in the
        Pacific in the seventeen-sixties and seventies and carried them home,
        and they have been sitting in your vocabulary ever since, doing
        ordinary work, looking English.
      </p>
      <p>
        They belong to a family of about twelve hundred languages, spread over
        most of the Pacific and Indian oceans. It is nothing like the Romance
        one. There is no Latin. Nobody wrote the parent language down, nobody
        recorded the empire, and there was no empire.
      </p>
      <p>
        So how is anyone entitled to say these languages are related? Not
        because the words look alike. Words look alike all the time by
        accident, and languages borrow from each other constantly.{" "}
        <strong style={{ color: C.ink, fontWeight: 400 }}>
          The test is whether the differences are consistent.
        </strong>{" "}
        If one language has a <span className="ip-form">k</span> in every single
        place its neighbours have a <span className="ip-form">t</span>, word
        after word, that is not resemblance. It is a rule, applied without
        exception by people who had no idea they were applying it.
      </p>
      <p>
        Chance does not produce rules like that. Borrowing does not either,
        because borrowed words arrive one at a time and do not reshape an entire
        vocabulary in step. Watch for the rule in the tables below.
      </p>

      {REVEALS.slice(0, step + 1).map((d, i) => (
        <CognateTable key={d.caption} data={d} showProto={i < step || step === REVEALS.length - 1} />
      ))}

      <div className="ip-btnrow">
        <button
          className="ip-btn"
          onClick={() => setStep((s) => Math.min(s + 1, REVEALS.length - 1))}
          disabled={step >= REVEALS.length - 1}
        >
          {step >= REVEALS.length - 1
            ? "That is the family"
            : step === 0
            ? "Same rule, another word"
            : "Widen it"}
        </button>
      </div>

      {step >= REVEALS.length - 1 && (
        <p style={{ marginTop: "2rem" }}>
          Malagasy's closest relatives are not in Africa. They are in southern
          Borneo, six thousand kilometres east across open water. Somebody made
          that crossing, and the only surviving record that they did it is the
          way people in Madagascar say the word for eye.
        </p>
      )}
    </Movement>
  );
}

function MovementTwo() {
  const [open, setOpen] = useState(null);
  const [guess, setGuess] = useState(null);
  return (
    <Movement
      n="II"
      cls="Attested"
      kind="solid"
      title="Your language has settings, and you cannot feel them from inside."
    >
      <p className="ip-lead">
        The obvious way to think about a language is as a set of names for
        things that were already out there, with translation as a matter of
        swapping one label for another.
      </p>
      <p>
        That is not quite how it works. Every language has settled on which
        distinctions are worth building into its words, and different languages
        settled differently. Some of those decisions are optional, in the sense
        that you can always add more words if you want to be precise. Others are
        compulsory: the grammar simply will not let you finish the sentence
        until you have picked a side.
      </p>
      <p>
        Before the examples, answer this without thinking about it too hard.
      </p>
      <Commit
        text="How many basic colours are there between the sky on a clear day and deep water at dusk?"
        options={[
          { key: "one", label: "One. They are both blue." },
          { key: "two", label: "Two. They are quite different colours." },
          { key: "depends", label: "That depends on the language you are asking in." },
        ]}
        value={guess}
        onPick={setGuess}
      />
      {guess === "one" && (
        <p className="ip-note" style={{ marginTop: "1.4rem" }}>
          That is the English answer, and it feels like an observation about
          light rather than a fact about English. Roughly half the people
          reading this sentence in translation would have said two.
        </p>
      )}
      {guess === "two" && (
        <p className="ip-note" style={{ marginTop: "1.4rem" }}>
          Then either you speak one of the languages that divides them, or you
          are being careful. Most English speakers say one, and say it as though
          reporting on the world rather than on their vocabulary.
        </p>
      )}
      {guess === "depends" && (
        <p className="ip-note" style={{ marginTop: "1.4rem" }}>
          Correct, and the interesting part is not that languages differ. It is
          that speakers of each one experience their own answer as a fact about
          colour.
        </p>
      )}
      <p style={{ marginTop: "1.6rem" }}>
        Four examples. The first two come from languages you probably do not
        speak. The last two are in the one you are reading now.
      </p>
      <div className="ip-cards">
        {JOINTS.map((j, i) => (
          <JointCard
            key={j.q}
            item={j}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>
    </Movement>
  );
}

function MovementThree() {
  const [shown, setShown] = useState(false);
  return (
    <Movement
      n="III"
      cls="Reconstructed"
      kind="dashed"
      title="Vocabulary is an inventory nobody knew they were keeping."
    >
      <p className="ip-lead">
        Once you have the sound rules, you can do something that looks like a
        conjuring trick and is not.
      </p>
      <p>
        The chain runs like this. A word turns up right across a family. In each
        branch it obeys that branch's sound rules exactly, which means it was
        inherited rather than borrowed later. So the shared ancestor must have
        had it. And if the ancestor had a word for a thing, the ancestor had the
        thing.
      </p>
      <p>
        Which turns a wordlist into an archaeological site for a people who left
        no pottery you can point at. Each entry below starts with the living
        descendants you can go and check, and puts the reconstruction above
        them.
      </p>

      {shown && (
        <div className="ip-stack">
          {REMEMBERED.map((r) => (
            <div className="ip-fossil" key={r.form}>
              <div className="ip-fossil-head">
                <span className="ip-fossil-form">{r.form}</span>
                <span className="ip-fossil-gloss">{r.gloss}</span>
                <span className="ip-fossil-fam">{r.fam}</span>
              </div>
              <div className="ip-fossil-kids">
                {r.kids.map(([src, w]) => (
                  <div key={src}>
                    <span className="src">{src} </span>
                    {w}
                  </div>
                ))}
              </div>
              <div className="ip-fossil-body">{r.body}</div>
            </div>
          ))}
        </div>
      )}

      <div className="ip-btnrow">
        <button className="ip-btn" onClick={() => setShown(true)} disabled={shown}>
          {shown ? "Excavated" : "Open the inventory"}
        </button>
      </div>

      {shown && (
        <>
          <p style={{ marginTop: "2.4rem" }}>
            The best evidence of this kind comes from people trying to stop
            something. Around the third century somebody compiled a list of
            corrections for Latin students: say <span className="ip-form">vetulus</span>,
            not <span className="ip-form">veclus</span>. Say{" "}
            <span className="ip-form">auris</span>, not{" "}
            <span className="ip-form">oricla</span>.
          </p>
          <p>
            Every form on the wrong side of that list is the ancestor of the
            modern word. <span className="ip-form">Veclus</span> became Italian{" "}
            <span className="ip-form">vecchio</span>.{" "}
            <span className="ip-form">Oricla</span> became French{" "}
            <span className="ip-form">oreille</span>. A schoolmaster wrote down
            exactly how ordinary people spoke, in the act of telling them to
            stop, and it is the only reason we know.
          </p>
        </>
      )}
    </Movement>
  );
}

function MovementFour() {
  const [n, setN] = useState(0);
  const stages = [
    <>
      French once negated a verb using <span className="ip-form">ne</span> on
      its own. To make the negation emphatic, speakers added a small noun
      naming a minimal quantity: a crumb, a drop, a step.{" "}
      <span className="ip-form">Je ne marche pas</span> meant I do not walk{" "}
      <em>a single step</em>.
    </>,
    <>
      The intensifier spread. It attached itself to verbs that had nothing to
      do with walking, then to more or less every verb, and in the process it
      stopped meaning a step at all.{" "}
      <span className="ip-form">Pas</span> was now simply the second half of
      the negative, carrying no content of its own.
    </>,
    <>
      Then <span className="ip-form">ne</span> began dropping out of speech
      altogether. Most French speakers today say{" "}
      <span className="ip-form">je sais pas</span> rather than{" "}
      <span className="ip-form">je ne sais pas</span>. The word for step, which
      was never the negative and only ever turned up to add emphasis, now
      carries the whole negation by itself.
    </>,
  ];
  return (
    <Movement
      n="IV"
      cls="Attested"
      kind="solid"
      title="Grammar is not designed. It wears down out of ordinary sentences."
    >
      <p className="ip-lead">
        Nobody sat down and invented the future tense. No committee decided that
        English needed a way to mark politeness, or that French required two
        words to say no.
      </p>
      <p>
        What happens instead is erosion. An ordinary word gets used in one
        particular slot so often that it stops being noticed, loses its original
        meaning, wears down in the mouth and ends up as a piece of grammatical
        machinery. The process takes centuries, which is long enough that nobody
        living through it can see it and short enough that the written record
        catches the whole thing.
      </p>
      <p>Here is one cycle, start to finish, in French.</p>
      <div className="ip-stack">
        {stages.slice(0, n + 1).map((s, i) => (
          <div className="ip-strat" key={i}>
            <span className="ip-strat-key">{i + 1}</span>
            <span className="ip-strat-val">{s}</span>
          </div>
        ))}
      </div>
      <div className="ip-btnrow">
        <button
          className="ip-btn"
          onClick={() => setN((v) => Math.min(v + 1, stages.length - 1))}
          disabled={n >= stages.length - 1}
        >
          {n >= stages.length - 1 ? "Complete" : "Advance the cycle"}
        </button>
      </div>
      {n >= stages.length - 1 && (
        <p style={{ marginTop: "2rem" }}>
          English is midway through the same kind of thing.{" "}
          <span className="ip-form">Going to</span> was locomotion, then
          intention, and is now a future tense that has lost the ability to take
          a destination. You cannot say <em>I'm gonna the shop</em>.
        </p>
      )}
    </Movement>
  );
}

function MovementFive() {
  const [checked, setChecked] = useState(false);
  return (
    <Movement
      n="V"
      cls="Verified"
      kind="solid"
      title="One family kept the receipts, so the method can be marked."
    >
      <p className="ip-lead">
        Everything above rests on reconstruction, and reconstruction sounds like
        something you could talk yourself into. There is one family where you
        can check.
      </p>
      <p>
        The Romance languages descend from Latin, and Latin is sitting in the
        library. So do the reconstruction without looking, then look.
      </p>

      <div className="ip-table">
        <div className="ip-table-cap">Compare · ‘horse’</div>
        {CONTROL_HORSE.map(([lang, w], i) => (
          <div className="ip-row" key={lang} style={{ animationDelay: `${i * 70}ms` }}>
            <span className="ip-lang">{lang}</span>
            <span className="ip-word">{w}</span>
          </div>
        ))}
        {checked && (
          <div className="ip-row proto">
            <span className="ip-lang">Reconstructed</span>
            <span className="ip-word">
              <span className="hit">*caballus</span>
            </span>
          </div>
        )}
        <p className="ip-note">
          Classical Latin for horse is <span className="ip-form">equus</span>.
        </p>
      </div>

      <div className="ip-table">
        <div className="ip-table-cap">Compare · ‘to speak’</div>
        {CONTROL_SPEAK.map(([lang, w], i) => (
          <div className="ip-row" key={lang} style={{ animationDelay: `${i * 70}ms` }}>
            <span className="ip-lang">{lang}</span>
            <span className="ip-word">{w}</span>
          </div>
        ))}
        {checked && (
          <div className="ip-row proto">
            <span className="ip-lang">Reconstructed</span>
            <span className="ip-word">
              <span className="hit">*parabolare</span>
            </span>
          </div>
        )}
        <p className="ip-note">
          Spanish and Portuguese are missing from this list on purpose. They
          replaced this verb entirely, with{" "}
          <span className="ip-form">hablar</span> and{" "}
          <span className="ip-form">falar</span>, which descend from a different
          Latin word again. A family is under no obligation to keep every word,
          and you reconstruct from the branches that did. Classical Latin for to
          speak is <span className="ip-form">loqui</span>, which is not the
          ancestor of any word on this page.
        </p>
      </div>

      <div className="ip-btnrow">
        <button className="ip-btn" onClick={() => setChecked(true)} disabled={checked}>
          {checked ? "Marked" : "Check against Latin"}
        </button>
      </div>

      {checked && (
        <>
          <p style={{ marginTop: "2.2rem" }}>
            That looks like a failure and is the opposite.{" "}
            <span className="ip-form">Caballus</span> is attested: it is the
            everyday Latin word for a nag, a workhorse, the one soldiers and
            farmers actually used.{" "}
            <span className="ip-form">Parabolare</span> is late spoken Latin for
            holding forth.
          </p>
          <p>
            The method did not recover the language of Cicero, because the
            Romance languages are not descended from the language of Cicero.
            They are descended from what people were saying in the street. The
            reconstruction is right, and it is right about something the
            written record was hiding.
          </p>
        </>
      )}
    </Movement>
  );
}

function MovementSix() {
  return (
    <section className="ip-final">
      <div className="ip-rail">
        <span className="ip-rail-num">VI</span>
        <span className="ip-rail-class none">Unrecoverable</span>
      </div>
      <h2>Some of them have no cousins.</h2>
      <p>
        Every method on this page needs at least two survivors. You compare, you
        find the rules, you run them backwards. Take away the relatives and
        there is nothing to compare, and the machinery has nothing to bite on.
      </p>
      <p>These have no relatives.</p>

      <div className="ip-orphans">
        Basque
        <br />
        Sumerian
        <br />
        Elamite
        <br />
        Etruscan
        <br />
        Burushaski
        <br />
        Ainu
      </div>

      <p>
        Basque is spoken by about three quarters of a million people across the
        western Pyrenees. It is the only language of western Europe that was
        there before Indo-European arrived and is still being used to order
        coffee.
      </p>
      <p>
        Which is the part worth sitting with. Basque is not strange for being
        alone. It is ordinary, and it is the last one. Everything it was once
        related to went without leaving a wordlist, a cousin or a name, and no
        amount of method will get any of it back.
      </p>
      <p style={{ color: C.inkDim }}>
        There is nothing to open here. That is the point.
      </p>

      <div className="ip-colophon">
        Inherited Property · one of six
      </div>
    </section>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

function InheritedProperty() {
  return (
    <div className="ip-root">
      <style>{styles}</style>
      <div className="ip-wrap">
        <header className="ip-mast">
          <p className="ip-eyebrow">Historical linguistics</p>
          <h1>
            Inherited
            <br />
            Property
          </h1>
          <p className="ip-standfirst">
            The words you use every day were handed to you by people who left no
            other trace. Sorted carefully enough, they give those people back.
          </p>
        </header>

        <Groundwork />
        <MovementOne />
        <MovementTwo />
        <MovementThree />
        <MovementFour />
        <MovementFive />
        <MovementSix />
      </div>
    </div>
  );
}

  return InheritedProperty;
})();


/* ============================================================
   TheOtherFace
   ============================================================ */

const OtherFace = (() => {

/* ============================================================
   THE OTHER FACE
   An explainer on early medieval history, roughly 400 to 1000,
   everywhere. Every exhibit has two accounts. You turn it over.
   ============================================================ */

const C = {
  ground: "#0D1719",
  groundDeep: "#080F11",
  panel: "#132326",
  panelLift: "#1A2E32",
  panelBack: "#1B1B26",
  ink: "#E9E3D5",
  inkDim: "#93A6A8",
  inkFaint: "#5C7073",
  signal: "#F0BE4B",
  signalDim: "#8A7233",
  cool: "#6FB3C0",
  rule: "#294044",
  ruleBack: "#3A3348",
};

const styles = `
*, *::before, *::after { box-sizing: border-box; }

.of-root {
  background: ${C.ground};
  color: ${C.ink};
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 300;
  font-size: 19px;
  line-height: 1.62;
  min-height: 100%;
  padding-bottom: 8rem;
  -webkit-font-smoothing: antialiased;
}
.of-wrap { max-width: 46rem; margin: 0 auto; padding: 0 1.5rem; }

.of-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${C.inkFaint};
  margin: 0 0 1.4rem;
}

/* ---------- masthead ---------- */

.of-mast { padding: 7rem 0 4.5rem; }
.of-mast h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 144;
  font-weight: 800;
  font-size: clamp(2.9rem, 9vw, 5rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
  margin: 0 0 1.6rem;
}
.of-standfirst {
  font-size: clamp(1.05rem, 2.4vw, 1.3rem);
  max-width: 33rem;
  margin: 0 0 1rem;
}

/* ---------- movements ---------- */

.of-movement { padding: 4.5rem 0; border-top: 1px solid ${C.rule}; }
.of-rail {
  display: flex;
  align-items: baseline;
  gap: 0.85rem;
  margin-bottom: 1.9rem;
  flex-wrap: wrap;
}
.of-rail-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: ${C.signal};
  letter-spacing: 0.1em;
}
.of-rail-class {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${C.inkFaint};
  padding-bottom: 3px;
}
.of-rail-class.solid { border-bottom: 1px solid ${C.inkFaint}; }
.of-rail-class.dashed { border-bottom: 1px dashed ${C.inkFaint}; }
.of-rail-class.none { border-bottom: none; opacity: 0.55; }

.of-movement h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600;
  font-size: clamp(1.75rem, 4.6vw, 2.5rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
}
.of-movement p { margin: 0 0 1.25rem; max-width: 40rem; }
.of-movement p.of-lead { font-size: 1.1rem; }
em { font-style: italic; }
.of-term { font-family: 'IBM Plex Mono', monospace; font-size: 0.93em; color: ${C.cool}; }

/* ---------- the turning card ---------- */

.of-cards { display: grid; gap: 1.1rem; margin: 2.2rem 0 0; }

.of-card { perspective: 1600px; }

.of-inner {
  display: grid;
  transform-style: preserve-3d;
  transition: transform 620ms cubic-bezier(.2,.75,.25,1);
  position: relative;
}
.of-inner.turned { transform: rotateY(180deg); }
.of-inner > .of-face { grid-area: 1 / 1; }

.of-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 2px;
  padding: 1.35rem 1.4rem 1.3rem;
  border: 1px solid ${C.rule};
  background: ${C.panel};
}
.of-face.back {
  transform: rotateY(180deg);
  background: ${C.panelBack};
  border-color: ${C.ruleBack};
}

.of-face-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.9rem;
}
.of-face-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.63rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${C.signal};
}
.of-face.back .of-face-tag { color: ${C.cool}; }
.of-face-date {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.63rem;
  letter-spacing: 0.12em;
  color: ${C.inkFaint};
}
.of-face h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 40;
  font-weight: 600;
  font-size: 1.22rem;
  line-height: 1.2;
  margin: 0 0 0.65rem;
  letter-spacing: -0.01em;
}
.of-face p { font-size: 0.97rem; color: ${C.inkDim}; margin: 0 0 0.85rem; max-width: none; }
.of-face p:last-of-type { margin-bottom: 0; }
.of-face strong { color: ${C.ink}; font-weight: 400; }

.of-turn {
  margin-top: 1.15rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid ${C.signalDim};
  color: ${C.signal};
  padding: 0.55rem 1rem;
  cursor: pointer;
  border-radius: 1px;
  transition: background 160ms ease, color 160ms ease;
}
.of-face.back .of-turn { border-color: ${C.ruleBack}; color: ${C.cool}; }
.of-turn:hover { background: ${C.signalDim}; color: ${C.groundDeep}; }
.of-face.back .of-turn:hover { background: ${C.cool}; color: ${C.groundDeep}; }
.of-turn:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 3px; }

/* ---------- commitment ---------- */

.of-q { margin: 1.9rem 0 0.4rem; }
.of-q-text { font-size: 1.02rem; margin: 0 0 1rem; }
.of-opts { display: grid; gap: 0.5rem; }
.of-opt {
  text-align: left; background: transparent; border: 1px solid ${C.rule};
  color: ${C.ink}; font-family: 'Newsreader', Georgia, serif; font-size: 0.97rem;
  font-weight: 300; padding: 0.72rem 1rem; border-radius: 2px; cursor: pointer;
}
.of-opt:hover { border-color: ${C.signalDim}; background: ${C.panelLift}; }
.of-opt:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 2px; }
.of-opt.chosen { border-color: ${C.signal}; color: ${C.signal}; }
.of-opt.chosen::before { content: "▸ "; }

/* ---------- meanwhile ---------- */

.of-meanwhile {
  margin-top: 0.65rem;
  padding-left: 0.9rem;
  border-left: 1px solid ${C.rule};
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  line-height: 1.85;
  color: ${C.inkFaint};
  letter-spacing: 0.02em;
}
.of-meanwhile b {
  color: ${C.inkDim};
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.63rem;
  display: block;
  margin-bottom: 0.2rem;
}

/* ---------- pull quote / notes ---------- */

.of-note {
  font-size: 0.94rem;
  color: ${C.inkDim};
  margin: 1.6rem 0 0;
  padding-left: 0.9rem;
  border-left: 1px solid ${C.rule};
  max-width: 36rem;
}

/* ---------- final ---------- */

.of-final { padding: 6rem 0 3rem; border-top: 1px solid ${C.rule}; }
.of-final h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600;
  font-size: clamp(1.75rem, 4.6vw, 2.5rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
}
.of-final p { max-width: 38rem; margin: 0 0 1.3rem; }
.of-colophon {
  margin-top: 5rem;
  padding-top: 1.6rem;
  border-top: 1px solid ${C.rule};
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.inkFaint};
}

@media (max-width: 560px) {
  .of-root { font-size: 17.5px; }
  .of-mast { padding: 4rem 0 3rem; }
  .of-movement { padding: 3.2rem 0; }
}

@media (prefers-reduced-motion: reduce) {
  .of-inner { transition: none; }
}
`;

/* ============================================================
   EXHIBITS
   ============================================================ */

const ORKHON = {
  date: "Mongolia · 732",
  front: {
    tag: "The face facing out",
    title: "A gracious note about a loyal neighbour",
    body: (
      <>
        <p>
          One face of the monument is in Chinese. It was composed at the Tang
          court, and the emperor sent craftsmen north to cut it.
        </p>
        <p>
          Court inscriptions of this kind follow a well-worn pattern, and this
          one keeps to it. The dead man is praised, the relationship between
          the two houses is described as close and cordial, and the whole
          arrangement is presented as settled and agreeable to everybody.
        </p>
        <p>
          If this were the only face, the story would be simple. A cooperative
          neighbour on the northern frontier, remembered warmly by the greater
          power he served.
        </p>
      </>
    ),
  },
  back: {
    tag: "The faces facing in",
    title: "A warning to his own people",
    body: (
      <>
        <p>
          The other faces are in Old Turkic, in a script cut for the purpose,
          and the audience has changed completely. Bilge Khagan is speaking to
          the Turks, in the first person, and he is not being diplomatic.
        </p>
        <p>
          His argument is that Chinese generosity is a method. Sweet words and
          soft silk are how a distant people is drawn in close, and a people
          drawn in close stops being able to leave. He points at the Turks who
          went south believing otherwise, and says what became of them.
        </p>
        <p>
          <strong>
            He also states why the stone exists. He is putting this somewhere it
            can still be read once everybody who remembers is dead.
          </strong>{" "}
          It worked, though not as he intended. Nobody could read the script at
          all until Vilhelm Thomsen worked it out in the 1890s.
        </p>
      </>
    ),
  },
  meanwhile: (
    <>
      <b>Meanwhile</b>
      Tang China near its height under Xuanzong · the Umayyad caliphate running
      from Iberia to the Indus · Palenque and Tikal in full flourish · Bede
      finishing his history in Northumbria the previous year
    </>
  ),
};

const MADE = [
  {
    date: "Gaul · from the 600s",
    front: {
      tag: "The story told",
      title: "The Franks came from Troy",
      body: (
        <>
          <p>
            Frankish chroniclers gave their people a founding migration. Their
            ancestors, the story went, left Troy when it fell, wandered for
            generations and eventually settled in Gaul.
          </p>
          <p>
            It is a useful pedigree. It makes the Franks cousins of the Romans
            rather than their replacements, it presents their presence in Gaul
            as a kind of homecoming, and it writes them into the most
            prestigious story available in the Latin west.
          </p>
        </>
      ),
    },
    back: {
      tag: "Underneath",
      title: "A word Romans used for a problem",
      body: (
        <>
          <p>
            The name arrives earlier, and from the other direction.{" "}
            <strong>Frank</strong> appears in third-century Roman writing as a
            term for a shifting coalition of groups along the lower Rhine. Not a
            nation with a homeland and a memory. Something closer to Roman
            shorthand for whoever was currently a problem in that direction.
          </p>
          <p>
            The people described that way eventually took the name for
            themselves, kept it, and built a kingdom with it. The kingdom then
            needed a past, because kingdoms do.
          </p>
          <p>
            Troy was supplied afterwards, several centuries later, by writers
            working for the people in charge.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        <b>Meanwhile</b>
        Sui and then Tang unifying China · the Arab conquests beginning · Nara
        Japan adopting Chinese administration
      </>
    ),
  },
  {
    date: "The Volga and Dnieper · 800s",
    front: {
      tag: "The story told",
      title: "The Slavs sent for princes",
      body: (
        <>
          <p>
            The chronicle account, compiled in Kiev, is disarmingly tidy. The
            Slavic peoples of the north were quarrelling among themselves and
            could not govern, so they sent across the sea to the Varangians and
            asked them to come and rule.
          </p>
          <p>
            Three brothers accepted the invitation. The eldest, Rurik, founded
            the line that would still be ruling centuries later.
          </p>
        </>
      ),
    },
    back: {
      tag: "Underneath",
      title: "Written two hundred years later, by people who needed it",
      body: (
        <>
          <p>
            Two things sit awkwardly with that. The first is the name.{" "}
            <span className="of-term">Rus'</span> most likely reaches Slavic
            through Finnish, from an Old Norse word connected with rowing and
            the men who did it. That points at Scandinavians turning up rather
            than being sent for.
          </p>
          <p>
            The second is the date. The chronicle was put together roughly two
            centuries after the events it describes, by monks working for the
            descendants of the dynasty whose right to rule it explains.
          </p>
          <p>
            <strong>
              An invitation is a far better story than an arrival.
            </strong>{" "}
            It makes the rule consensual from the first day, which is exactly
            what a dynasty two hundred years in wants on the record.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        <b>Meanwhile</b>
        Baghdad the largest city on earth · the Maya Classic collapse under way
        · Great Zimbabwe's region trading to the Indian Ocean
      </>
    ),
  },
  {
    date: "The steppe north of the Caucasus · 800s",
    front: {
      tag: "The story told",
      title: "A king held a debate and chose",
      body: (
        <>
          <p>
            The Khazar account describes a decision taken properly. The ruler
            summoned representatives of Christianity, Islam and Judaism and
            heard each of them out in turn.
          </p>
          <p>
            When he pressed the Christian and the Muslim, each conceded that
            Judaism had come first. He drew what the story presents as the
            obvious conclusion, and converted.
          </p>
        </>
      ),
    },
    back: {
      tag: "Underneath",
      title: "A move on a board with two large players",
      body: (
        <>
          <p>
            Something real happened. Coins, burial practice and neighbouring
            Arab and Byzantine writers all point to a genuine conversion, though
            historians still argue about its date and about how far beyond the
            ruling class it went.
          </p>
          <p>
            The staged debate is a different matter. Contests of this kind
            between three faiths are a recognised literary form, and they turn
            up wherever a conversion needs accounting for.
          </p>
          <p>
            <strong>
              Look at the position it produces rather than at the theology.
            </strong>{" "}
            The Khazars sat between two expanding empires, each claiming
            authority over its co-religionists wherever they lived. Taking a
            third faith put the khaganate outside both claims at once.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        <b>Meanwhile</b>
        Byzantine iconoclasm recently ended · the Abbasids past their height ·
        Srivijaya controlling the straits of Malacca
      </>
    ),
  },
];

const TRANSLATED = [
  {
    date: "Fujian, China · Mani arrives from Mesopotamia",
    front: {
      tag: "What you would see",
      title: "A seated Buddha in a small stone hall",
      body: (
        <>
          <p>
            In a small stone hall in Fujian there is a seated figure in the
            posture you would expect of a Buddha, inside a building that reads
            as an ordinary local temple.
          </p>
          <p>
            For a very long time that is exactly what everybody took it to be.
            Visitors came and made offerings accordingly.
          </p>
        </>
      ),
    },
    back: {
      tag: "What it is",
      title: "Mani, dressed for the neighbourhood",
      body: (
        <>
          <p>
            The figure is Mani, and the hall is Manichaean.
          </p>
          <p>
            Manichaeism began in third-century Mesopotamia and spent the next
            thousand years travelling east. At every stage it described itself
            in whatever religious vocabulary was already on the ground. In the
            Iranian world it spoke in Zoroastrian terms. Further east it
            borrowed from Buddhism so completely that its founder ended up with
            a Buddha's title.
          </p>
          <p>
            <strong>
              It is tempting to call that a disguise, and more accurate to call
              it the price of travelling.
            </strong>{" "}
            A religion crossing a border has no choice but to be said in words
            that already exist on the other side, and those words arrive with
            their own meanings attached.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        <b>Meanwhile</b>
        the Silk Road at full traffic · Sogdian the trade language of Central
        Asia · Chang'an holding perhaps a million people
      </>
    ),
  },
  {
    date: "Constantinople · 726 to 843",
    front: {
      tag: "The argument as stated",
      title: "Whether to have pictures in church",
      body: (
        <>
          <p>
            Stated flatly, it sounds like a dispute about decoration. Between
            the 720s and the 840s images were removed from Byzantine churches,
            then restored, then removed again.
          </p>
          <p>
            Emperors and patriarchs lined up on both sides throughout, and the
            argument outlasted most of the people having it.
          </p>
        </>
      ),
    },
    back: {
      tag: "The argument as felt",
      title: "Whether an image participates in what it shows",
      body: (
        <>
          <p>
            The question underneath is not about taste. It is about what kind of
            thing an image is.
          </p>
          <p>
            If a painting of a saint is pigment and board and nothing more, then
            bowing to it is foolish at best and idolatry at worst. If the image
            somehow participates in the person it depicts, then destroying one
            is an act of violence against that person.
          </p>
          <p>
            <strong>
              Those two positions cannot be met in the middle.
            </strong>{" "}
            They do not disagree about how much respect an object deserves. They
            disagree about what the object is. Monasteries were emptied and
            careers ended over it, on and off, for more than a century.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        <b>Meanwhile</b>
        Charlemagne crowned in Rome midway through · Baghdad founded in 762 ·
        Borobudur under construction in Java
      </>
    ),
  },
  {
    date: "Baghdad · 800s and 900s",
    front: {
      tag: "What it looks like",
      title: "Books moved from one language to another",
      body: (
        <>
          <p>
            Between roughly the eighth and tenth centuries, Greek works on
            medicine, mathematics, astronomy and philosophy were translated into
            Arabic, often by way of Syriac. Caliphs and wealthy Baghdad families
            paid for it, and it ran for generations.
          </p>
          <p>
            Put like that it sounds like a transfer operation. Books in one
            language, the same books in another.
          </p>
        </>
      ),
    },
    back: {
      tag: "What it was",
      title: "A language acquiring words it did not have",
      body: (
        <>
          <p>
            It could not be, because the vocabulary did not exist yet.
          </p>
          <p>
            Greek philosophy draws distinctions Arabic had no settled words for.
            The translators had to build the terms, argue about them and reach
            agreements, and later readers inherited those agreements without any
            sign that a decision had been taken. Hunayn ibn Ishaq had a
            reputation for chasing a better manuscript across provinces rather
            than working from a poor copy.
          </p>
          <p>
            <strong>
              The consequences run a long way downstream.
            </strong>{" "}
            Much of Aristotle reached Latin Europe centuries later through this
            Arabic, which means European readers received a Greek philosopher
            with Baghdad's rulings about his words already built in.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        <b>Meanwhile</b>
        the Vikings in Ireland and Normandy · the Tang collapsing into the Five
        Dynasties · the Ghana empire taxing the gold roads
      </>
    ),
  },
];

const UNMEANT = [
  {
    date: "Andalusia · names still in daily use",
    front: {
      tag: "What it is now",
      title: "A river in southern Spain",
      body: (
        <p>
          The Guadalquivir runs through Córdoba and Seville and out to the
          Atlantic. Spaniards say the name without thinking about it, in the way
          you say the name of your nearest main road.
        </p>
      ),
    },
    back: {
      tag: "What it says",
      title: "Arabic for the great valley",
      body: (
        <>
          <p>
            It is Arabic. <span className="of-term">al-wādī al-kabīr</span>, the
            great valley, worn down by centuries of Spanish mouths into a single
            word.
          </p>
          <p>
            It has a great deal of company. Guadalajara, Guadalupe, Guadiana and
            a long list of others open the same way, and Andalusia itself is{" "}
            <span className="of-term">al-Andalus</span>. Plotted on a map they
            show where Arabic-speaking populations lived, and roughly for how
            long.
          </p>
          <p>
            <strong>
              None of it was recorded deliberately.
            </strong>{" "}
            Nobody names a river in order to tell the future about settlement
            patterns. They named it because it needed a name, and that is
            exactly why the evidence holds.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        <b>Meanwhile</b>
        Córdoba among the largest cities in the world · Carolingian scribes
        inventing the lower-case letters you are reading
      </>
    ),
  },
  {
    date: "The Persian world · a word going soft",
    front: {
      tag: "What it is now",
      title: "A couch",
      body: (
        <p>
          A divan is a long low seat without a back, the sort of thing that ends
          up in a hotel lobby or a waiting room. The word reached English
          through French, and French through Turkish, and by the time it arrived
          it carried no trace at all of where it began.
        </p>
      ),
    },
    back: {
      tag: "What it was",
      title: "A register of who gets paid",
      body: (
        <>
          <p>
            It started as <span className="of-term">dīwān</span>, a Persian and
            then Arabic word for an administrative register: the list of who was
            entitled to be paid.
          </p>
          <p>
            From there it moved by ordinary steps. The register named the office
            that kept it. The office named the council that met there. The
            council named the long cushioned bench it sat on. Eventually the
            bench was all that was left.
          </p>
          <p>
            <strong>
              The register itself was an improvisation.
            </strong>{" "}
            Somebody had the problem of paying an army, invented a mechanism for
            it, and the mechanism outlived the army, the office, the council and
            the empire, and ended up as a piece of furniture with a foreign
            name.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        <b>Meanwhile</b>
        the theme system reorganising Byzantine provinces around soldiers who
        farm · Japan building a Chinese-style bureaucracy it will quietly stop
        using
      </>
    ),
  },
  {
    date: "Northumbria · 731",
    front: {
      tag: "What he meant to do",
      title: "Condemn the British church",
      body: (
        <>
          <p>
            Bede, writing in Northumbria and finishing in 731, had a low opinion
            of the British church. It calculated Easter by the wrong method, its
            clergy wore the wrong tonsure, and worst of all it had made no
            serious effort to convert the English who had arrived among them.
          </p>
          <p>
            He set the complaint out at length, and then moved on to the people
            he approved of.
          </p>
        </>
      ),
    },
    back: {
      tag: "What he did",
      title: "Preserve almost the only description of it",
      body: (
        <>
          <p>
            The British church left very little writing of its own. What
            survives about how it reckoned the calendar, how it organised
            itself, what its clergy looked like and what it cared about comes to
            a substantial degree from the man explaining why it was wrong.
          </p>
          <p>
            <strong>
              This turns out to be the normal situation rather than an oddity.
            </strong>{" "}
            You cannot argue against a practice without first describing it, in
            enough detail that your reader knows which practice you mean.
          </p>
          <p>
            So attacks are among the most detailed sources anybody has, and they
            exist because somebody wanted the thing gone.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        <b>Meanwhile</b>
        the Orkhon stones going up the following year, four thousand miles east
      </>
    ),
  },
  {
    date: "North-east London · recorded in the 1000s",
    front: {
      tag: "What it is now",
      title: "A stop on the Victoria line",
      body: (
        <p>
          Walthamstow, in north-east London. A postcode, a market, the far end
          of the Victoria line. Several hundred thousand people say the name
          every day, meaning nothing by it beyond where they are going.
        </p>
      ),
    },
    back: {
      tag: "What it says",
      title: "Wilcumestōw, and an argument nobody can settle",
      body: (
        <>
          <p>
            The ending is Old English <span className="of-term">stōw</span>,
            meaning a place, and used particularly for places where people
            gathered or that were held sacred.
          </p>
          <p>
            The first part is where it stops being straightforward. It is either{" "}
            <span className="of-term">wilcuma</span>, a welcome guest, or a
            personal name, Wilcume, belonging to whoever held the land. Both are
            perfectly good readings and the surviving records contain nothing
            that would settle it.
          </p>
          <p>
            <strong>
              So the name means either the welcoming place or one man's place,
              and it has meant both at once for a thousand years.
            </strong>
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        <b>Meanwhile</b>
        Essex sitting inside the boundary Alfred and Guthrum drew · Córdoba
        among the great cities of the world · the Song dynasty consolidating
        after the Tang
      </>
    ),
  },
];

const MUGH = {
  date: "A mountain above the Zarafshan · 722",
  front: {
    tag: "What was found",
    title: "A bundle of ordinary paperwork",
    body: (
      <>
        <p>
          Found on a mountainside above the Zarafshan valley in Tajikistan in
          the 1930s: a bundle of documents on leather, wood and paper. Legal
          contracts, accounts, correspondence, a marriage agreement.
        </p>
        <p>
          It is the sort of material any administration produces continuously
          and nobody thinks to preserve.
        </p>
      </>
    ),
  },
  back: {
    tag: "What it was",
    title: "The last months of a man who lost",
    body: (
      <>
        <p>
          The papers belonged to Divashtich, the ruler of Panjikent. When the
          Arab armies reached Sogdiana he withdrew to a fortress on that
          mountain and took his archive with him. He held out, negotiated a
          surrender and was executed anyway. The documents stayed where he left
          them for twelve hundred years.
        </p>
        <p>
          Every one of them can be read. They have been catalogued, translated
          and published. The legal formulae are intact and the hands are clear.
        </p>
        <p>
          <strong>None of it reaches him.</strong> A contract about a garden
          tells you the price of a garden. He kept the records a man in his
          position kept, and a man in his position does not write down what he
          thought was going to happen.
        </p>
      </>
    ),
  },
  meanwhile: (
    <>
      <b>Meanwhile</b>
      Sogdian is the common language from Samarkand to the Chinese frontier ·
      within a few centuries it has one small descendant left, spoken in a
      single valley
    </>
  ),
};

/* ============================================================
   COMPONENTS
   ============================================================ */

function Rail({ n, cls, kind }) {
  return (
    <div className="of-rail">
      {n && <span className="of-rail-num">{n}</span>}
      <span className={`of-rail-class ${kind}`}>{cls}</span>
    </div>
  );
}

function Face({ side, data, date, onTurn, label }) {
  return (
    <div className={`of-face ${side}`} aria-hidden={false}>
      <div className="of-face-head">
        <span className="of-face-tag">{data.tag}</span>
        <span className="of-face-date">{date}</span>
      </div>
      <h3>{data.title}</h3>
      {data.body}
      <button className="of-turn" onClick={onTurn}>
        {label}
      </button>
    </div>
  );
}

function TurnCard({ item }) {
  const [turned, setTurned] = useState(false);
  return (
    <div>
      <div className="of-card">
        <div className={`of-inner${turned ? " turned" : ""}`}>
          <Face
            side="front"
            data={item.front}
            date={item.date}
            onTurn={() => setTurned(true)}
            label="Turn it over"
          />
          <Face
            side="back"
            data={item.back}
            date={item.date}
            onTurn={() => setTurned(false)}
            label="Turn it back"
          />
        </div>
      </div>
      {item.meanwhile && <div className="of-meanwhile">{item.meanwhile}</div>}
    </div>
  );
}

function Commit({ text, options, value, onPick }) {
  return (
    <div className="of-q">
      <p className="of-q-text">{text}</p>
      <div className="of-opts">
        {options.map((o) => (
          <button
            key={o.key}
            className={`of-opt${value === o.key ? " chosen" : ""}`}
            onClick={() => onPick(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Movement({ n, cls, kind, title, children }) {
  return (
    <section className="of-movement">
      <Rail n={n} cls={cls} kind={kind} />
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/* ============================================================
   MOVEMENTS
   ============================================================ */

function One() {
  return (
    <Movement
      n="I"
      cls="Attested"
      kind="solid"
      title="One monument, two languages, two incompatible accounts."
    >
      <p className="of-lead">
        Historians call the centuries after the Roman empire the early medieval
        period. The older nickname, the Dark Ages, was never really about the
        people. It was about the sources. There is far less surviving writing
        from these six hundred years than from the periods either side of them,
        and most of what does survive was produced by somebody with a case to
        make.
      </p>
      <p>
        That sounds like a problem, and it is also the opening. A document that
        is arguing for something usually tells you who it was arguing with.
      </p>
      <p>
        Here is the clearest example anyone has. In the 730s, in a valley in
        central Mongolia, two brothers of the ruling family of the Turkic
        khaganate raised carved stones for their dead. The stones carry the
        oldest substantial writing in any Turkic language. They also carry a
        second inscription, in Chinese, and the two texts do not say the same
        thing, because they were meant for two audiences who were never going
        to read them side by side.
      </p>
      <p>Read the front, then turn it over.</p>
      <div className="of-cards">
        <TurnCard item={ORKHON} />
      </div>
      <p className="of-note">
        Every exhibit on this page is built the same way. There is an account
        meant to travel, and an account meant to stay at home, and the useful
        thing is usually the distance between them.
      </p>
    </Movement>
  );
}

function Two() {
  const [guess, setGuess] = useState(null);
  return (
    <Movement
      n="II"
      cls="Attested"
      kind="solid"
      title="Most of these peoples had only recently decided who they were."
    >
      <p className="of-lead">
        A nation almost always presents itself as old. That is what national
        stories are for. They explain that the people in charge have been here
        all along, that the borders follow something real, and that the whole
        arrangement is natural rather than recent.
      </p>
      <p>
        In this period the claim is often demonstrably new. Groups that had
        existed for two or three generations were acquiring names, territory
        and ancestors at speed, and because it happened so recently you can
        frequently see the joins.
      </p>
      <p>
        Each of the three below told a story about where it came from. Before
        you read them, one question, because your answer is a fair sample of
        what most people bring to this period.
      </p>
      <Commit
        text="Of these three origin stories, which would you expect to hold up best against the evidence?"
        options={[
          { key: "franks", label: "The Franks, descended from refugees out of Troy." },
          { key: "rus", label: "The Rus', who were invited in to rule by the people they ruled." },
          { key: "khazars", label: "The Khazars, whose king converted after hearing all three faiths argued." },
          { key: "none", label: "None of them. Origin stories are written by winners." },
        ]}
        value={guess}
        onPick={setGuess}
      />
      {guess && guess !== "none" && (
        <p className="of-note" style={{ marginTop: "1.4rem" }}>
          None of the three holds up as told, and that is not a trick. It is
          what an origin story is for. The one you picked is the one whose
          purpose is best disguised, which is a compliment to whoever wrote it.
        </p>
      )}
      {guess === "none" && (
        <p className="of-note" style={{ marginTop: "1.4rem" }}>
          Correct, and it does not get you out of the interesting part. Knowing
          that a story was written to do a job tells you nothing about which job,
          for whom, or against whom, and that is where the evidence actually
          lives.
        </p>
      )}
      {guess && (
        <div className="of-cards">
          {MADE.map((m, i) => (
            <TurnCard item={m} key={i} />
          ))}
        </div>
      )}
    </Movement>
  );
}

function Three() {
  return (
    <Movement
      n="III"
      cls="Attested"
      kind="solid"
      title="Meaning does not survive a border intact."
    >
      <p className="of-lead">
        Religions travelled enormous distances in these centuries, and they
        arrived in places that already had gods, temples and settled ways of
        talking about all of it.
      </p>
      <p>
        A missionary cannot simply hand somebody a set of ideas. To say anything
        at all, you have to use words your audience already knows, and those
        words arrive with meanings attached. So the thing that gets delivered is
        never quite the thing that set out. Decisions get made in the crossing
        that nobody sat down and made.
      </p>
      <p>
        Three cases. A religion that changed its clothes at every border, an
        empire that tore itself apart over what a picture is, and a translation
        project that had to invent the vocabulary it needed while using it.
      </p>
      <div className="of-cards">
        {TRANSLATED.map((m, i) => (
          <TurnCard item={m} key={i} />
        ))}
      </div>
    </Movement>
  );
}

function Four() {
  return (
    <Movement
      n="IV"
      cls="Inadvertent"
      kind="dashed"
      title="The best evidence was left by people who were not trying to leave any."
    >
      <p className="of-lead">
        Everything so far was made by somebody with an argument. Chronicles,
        inscriptions and origin stories are all aimed at a reader, which means
        they can be checked against other evidence but never entirely taken at
        face value.
      </p>
      <p>
        There is a second kind of evidence that is much duller and much harder
        to fake. Nobody names a river in order to inform the future. Nobody sets
        up a government office so that it will be remembered. Things like these
        record how people lived as a side effect of people living, and a side
        effect has no motive to mislead you.
      </p>
      <p>
        Four of them below. The third is the strongest kind, where somebody
        preserves a thing by attacking it.
      </p>
      <div className="of-cards">
        {UNMEANT.map((m, i) => (
          <TurnCard item={m} key={i} />
        ))}
      </div>
    </Movement>
  );
}

function Five() {
  return (
    <section className="of-final">
      <Rail n="V" cls="Unreachable" kind="none" />
      <h2>And then the ones you cannot get to.</h2>
      <p>
        One more, and it behaves differently from the rest.
      </p>
      <p>
        Everything above rewards turning over. There is an account on the front
        and, on the back, a motive, an older name or a quieter version of
        events, and the second face is the one you actually wanted.
      </p>
      <p>This one turns over exactly like the others.</p>
      <div className="of-cards">
        <TurnCard item={MUGH} />
      </div>
      <p style={{ marginTop: "2.4rem" }}>
        Nothing is missing from the Mugh documents. They have been read,
        catalogued and published. Every legal formula is intact, and the
        handwriting is clear.
      </p>
      <p>
        What is not there is Divashtich. Not the man's motives, not what he
        thought he was doing on that mountain, not whether he expected the terms
        to be honoured. He kept the sort of records a person keeps, and a person
        does not write down the thing you want to know.
      </p>
      <p style={{ color: C.inkDim }}>
        The other face is always there. It is just not always the one you were
        looking for.
      </p>
      <div className="of-colophon">The Other Face · two of six</div>
    </section>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

function TheOtherFace() {
  return (
    <div className="of-root">
      <style>{styles}</style>
      <div className="of-wrap">
        <header className="of-mast">
          <p className="of-eyebrow">Early medieval · 400 to 1000 · everywhere</p>
          <h1>
            The Other
            <br />
            Face
          </h1>
          <p className="of-standfirst">
            Between roughly 400 and 1000, across most of the world, an unusual
            number of peoples were in the middle of working out who they were.
            A good deal of what they said about themselves survives. Almost
            none of it was written for us, and that turns out to be why it is
            worth reading.
          </p>
        </header>
        <One />
        <Two />
        <Three />
        <Four />
        <Five />
      </div>
    </div>
  );
}

  return TheOtherFace;
})();


/* ============================================================
   TheBreak
   ============================================================ */

const Break = (() => {

/* ============================================================
   THE BREAK
   An explainer on the Bronze Age. Something happens in the
   middle of it, and the reader has to be the one who does it.
   ============================================================ */

const C = {
  ground: "#0D1719",
  panel: "#132326",
  panelLift: "#1A2E32",
  ink: "#E9E3D5",
  inkDim: "#93A6A8",
  inkFaint: "#5C7073",
  signal: "#F0BE4B",
  signalDim: "#8A7233",
  cool: "#6FB3C0",
  rule: "#294044",
  ash: "#4A4E52",
  ashDim: "#33373A",
};

const styles = `
*, *::before, *::after { box-sizing: border-box; }

.br-root {
  background: ${C.ground};
  color: ${C.ink};
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 300;
  font-size: 19px;
  line-height: 1.62;
  padding-bottom: 8rem;
  -webkit-font-smoothing: antialiased;
}
.br-wrap { max-width: 46rem; margin: 0 auto; padding: 0 1.5rem; }

.br-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${C.inkFaint};
  margin: 0 0 1.4rem;
}

.br-mast { padding: 7rem 0 4.5rem; }
.br-mast h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 144;
  font-weight: 800;
  font-size: clamp(3rem, 10vw, 5.4rem);
  line-height: 0.95;
  letter-spacing: -0.035em;
  margin: 0 0 1.6rem;
}
.br-standfirst { font-size: clamp(1.05rem, 2.4vw, 1.3rem); max-width: 33rem; margin: 0; }

.br-movement { padding: 4.5rem 0; border-top: 1px solid ${C.rule}; }
.br-rail { display: flex; align-items: baseline; gap: 0.85rem; margin-bottom: 1.9rem; flex-wrap: wrap; }
.br-rail-num { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: ${C.signal}; letter-spacing: 0.1em; }
.br-rail-class {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${C.inkFaint};
  padding-bottom: 3px;
}
.br-rail-class.solid { border-bottom: 1px solid ${C.inkFaint}; }
.br-rail-class.dashed { border-bottom: 1px dashed ${C.inkFaint}; }
.br-rail-class.none { border-bottom: none; opacity: 0.55; }

.br-movement h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600;
  font-size: clamp(1.75rem, 4.6vw, 2.5rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
}
.br-movement p { margin: 0 0 1.25rem; max-width: 40rem; }
.br-movement p.br-lead { font-size: 1.1rem; }
em { font-style: italic; }
.br-term { font-family: 'IBM Plex Mono', monospace; font-size: 0.93em; color: ${C.cool}; }

/* ---------- exhibits ---------- */

.br-ex {
  background: ${C.panel};
  border: 1px solid ${C.rule};
  border-left: 2px solid ${C.signalDim};
  border-radius: 2px;
  padding: 1.3rem 1.35rem;
  margin-top: 1.1rem;
}
.br-ex-head { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.7rem; }
.br-ex-where { font-family: 'IBM Plex Mono', monospace; font-size: 0.63rem; letter-spacing: 0.16em; text-transform: uppercase; color: ${C.inkFaint}; }
.br-ex h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 40;
  font-weight: 600;
  font-size: 1.24rem;
  line-height: 1.2;
  margin: 0 0 0.7rem;
  letter-spacing: -0.01em;
}
.br-ex p { font-size: 0.97rem; color: ${C.inkDim}; margin: 0 0 0.8rem; max-width: none; }
.br-ex p:last-child { margin-bottom: 0; }
.br-ex strong { color: ${C.ink}; font-weight: 400; }

.br-manifest {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.83rem;
  line-height: 1.95;
  color: ${C.cool};
  margin: 0.4rem 0 1rem;
}
.br-manifest .from { color: ${C.inkFaint}; }

/* ---------- commitment ---------- */

.br-q { margin: 1.9rem 0 0; }
.br-q-text { font-size: 1.02rem; margin: 0 0 1rem; }
.br-opts { display: grid; gap: 0.5rem; }
.br-opt {
  text-align: left; background: transparent; border: 1px solid ${C.rule};
  color: ${C.ink}; font-family: 'Newsreader', Georgia, serif; font-size: 0.97rem;
  font-weight: 300; padding: 0.72rem 1rem; border-radius: 2px; cursor: pointer;
}
.br-opt:hover { border-color: ${C.signalDim}; background: ${C.panelLift}; }
.br-opt:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 2px; }
.br-opt.chosen { border-color: ${C.signal}; color: ${C.signal}; }
.br-opt.chosen::before { content: "▸ "; }

.br-steps { display: flex; gap: 0.4rem; flex-wrap: wrap; margin: 0.2rem 0 1rem; }
.br-step {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem;
  letter-spacing: 0.12em; text-transform: uppercase; background: transparent;
  border: 1px solid ${C.rule}; color: ${C.inkDim}; padding: 0.45rem 0.8rem;
  border-radius: 1px; cursor: pointer;
}
.br-step:hover { background: ${C.panelLift}; }
.br-step:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 2px; }
.br-step.on { border-color: ${C.signalDim}; color: ${C.signal}; }

/* ---------- the break ---------- */

.br-fire { padding: 5.5rem 0; border-top: 1px solid ${C.rule}; }
.br-fire h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600;
  font-size: clamp(1.75rem, 4.6vw, 2.5rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
}
.br-fire p { margin: 0 0 1.25rem; max-width: 40rem; }

.br-list { margin: 2rem 0 0; border-top: 1px solid ${C.rule}; }
.br-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: baseline;
  padding: 0.72rem 0;
  border-bottom: 1px solid ${C.rule};
  transition: opacity 700ms ease, color 700ms ease, filter 700ms ease;
}
.br-item-name { font-family: 'IBM Plex Mono', monospace; font-size: 0.94rem; color: ${C.ink}; }
.br-item-note { font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem; letter-spacing: 0.13em; text-transform: uppercase; color: ${C.signalDim}; text-align: right; }
.br-item.gone { opacity: 0.3; }
.br-item.gone .br-item-name { color: ${C.ash}; text-decoration: line-through; text-decoration-color: ${C.ashDim}; }
.br-item.gone .br-item-note { color: ${C.ash}; }
.br-item.held .br-item-note { color: ${C.cool}; }

.br-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  background: transparent;
  color: ${C.signal};
  border: 1px solid ${C.signalDim};
  padding: 0.68rem 1.25rem;
  cursor: pointer;
  border-radius: 1px;
  margin-top: 2rem;
  transition: background 160ms ease, color 160ms ease;
}
.br-btn:hover { background: ${C.signalDim}; color: ${C.ground}; }
.br-btn:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 3px; }
.br-btn[disabled] { opacity: 0.35; cursor: default; }
.br-btn[disabled]:hover { background: transparent; color: ${C.signal}; }

/* ---------- after ---------- */

.br-after { padding: 5rem 0 3rem; border-top: 1px solid ${C.rule}; }
.br-after h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600;
  font-size: clamp(1.75rem, 4.6vw, 2.5rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
}
.br-after p { margin: 0 0 1.25rem; max-width: 40rem; }
.br-after .br-ex { border-left-color: ${C.ashDim}; background: #11191B; }
.br-after .br-ex-where { color: ${C.ash}; }
.br-after .br-manifest { color: ${C.ash}; }

.br-locked {
  margin-top: 2rem;
  padding: 1.6rem 1.4rem;
  border: 1px dashed ${C.rule};
  border-radius: 2px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.9;
  color: ${C.inkFaint};
  letter-spacing: 0.03em;
}

.br-colophon {
  margin-top: 5rem;
  padding-top: 1.6rem;
  border-top: 1px solid ${C.rule};
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.inkFaint};
}

@media (max-width: 560px) {
  .br-root { font-size: 17.5px; }
  .br-mast { padding: 4rem 0 3rem; }
  .br-movement, .br-fire { padding: 3.2rem 0; }
  .br-item { grid-template-columns: 1fr; gap: 0.15rem; }
  .br-item-note { text-align: left; }
}

@media (prefers-reduced-motion: reduce) {
  .br-item { transition: none; }
}
`;

/* ============================================================
   DATA
   ============================================================ */

const NETWORK = [
  {
    where: "Off Uluburun, southern Turkey · about 1300 BC",
    title: "One ship, and most of the known world in it",
    manifest: [
      ["Cyprus", "ten tonnes of copper, cast in ox-hide ingots"],
      ["somewhere east", "a tonne of tin, roughly the ratio bronze needs"],
      ["the Baltic", "amber"],
      ["Africa", "ebony, hippo and elephant ivory, ostrich eggshell"],
      ["Egypt", "a gold scarab carrying Nefertiti's name"],
      ["the Levant", "jars of terebinth resin"],
      ["Mycenae and Cyprus", "pottery, weapons, tools"],
    ],
    layers: [
      {
        label: "The manifest",
        body: (
          <p>
            A sponge diver spotted metal slabs on a slope off the Turkish coast
            in 1982. Eleven diving seasons later, the wreck had produced the
            most complete cargo anybody has from the Bronze Age, and the list
            above is a fair summary of it.
          </p>
        ),
      },
      {
        label: "What it tells you",
        body: (
          <>
            <p>
              Copper from one island and tin from thousands of miles away had to
              meet in the same hull, because bronze is an alloy and neither metal
              is any use on its own. The technology that gives the age its name
              could not exist unless goods crossed continents reliably, which
              means the network was not a luxury laid over the period. It was
              load-bearing.
            </p>
            <p>
              <strong>
                Nobody knows whose ship it was or where it was going.
              </strong>{" "}
              The single most informative object of the period is anonymous.
            </p>
            <p>
              Among the cargo was a wooden writing board with an ivory hinge, of
              the kind that held wax pages. The wax dissolved. The book survived
              and the words did not, which is as good a summary of this period's
              evidence as anything else on the page.
            </p>
          </>
        ),
      },
    ],
  },
  {
    where: "Amarna, Egypt · fourteenth century BC",
    title: "Kings who had never met, writing to each other as brothers",
    layers: [
      {
        label: "What was found",
        body: (
          <>
            <p>
              Around three hundred and fifty clay tablets turned up at the site
              of Akhenaten's abandoned capital: the diplomatic correspondence of
              the Egyptian court with the other great powers of the day.
              Babylonia, Assyria, Mitanni, the Hittites, Cyprus, and a long list
              of smaller rulers in between.
            </p>
            <p>
              Kings address each other as brother, arrange marriages, ask for
              gold, and complain at length when a gift arrives late or turns out
              to be lower quality than promised.
            </p>
          </>
        ),
      },
      {
        label: "What it tells you",
        body: (
          <>
            <p>
              They are written in Akkadian, which was the first language of none
              of the great kings involved. It had become the common tongue of
              international business, in the way that people who share no native
              language today will negotiate in a third.
            </p>
            <p>
              <strong>
                A shared working language is not something anybody sets up in an
                afternoon.
              </strong>{" "}
              It implies generations of scribes trained to the same standard in
              different countries, a stable convention about how a letter should
              open, and enough traffic to make all of that worth the expense.
            </p>
            <p>
              Which also tells you what kind of thing can break. The system runs
              on everybody continuing to answer.
            </p>
          </>
        ),
      },
    ],
  },
];

const REFUSALS = [
  {
    where: "The Indus valley · about 2600 to 1900 BC",
    title: "The largest of them, and nobody can find the king",
    layers: [
      {
        label: "What was dug up",
        body: (
          <>
            <p>
              By area this was the biggest civilisation of the Bronze Age,
              spread across what is now Pakistan and north-west India. Its
              cities were laid out on street grids, built from fired brick made
              to consistent proportions, and drained by covered sewer systems
              that would not be matched for millennia.
            </p>
            <p>
              Weights recovered from sites hundreds of miles apart agree with
              each other to a fraction of a gram.
            </p>
          </>
        ),
      },
      {
        label: "What is not there",
        body: (
          <>
            <p>
              Standardisation on that scale normally means somebody is enforcing
              it, and enforcement normally leaves traces: a palace, a rich
              burial, a temple, an image of somebody looking like they are in
              charge.
            </p>
            <p>
              <strong>None of it has been found.</strong> No securely identified
              palace, no royal tomb, no unambiguous depiction of a ruler, and
              very little sign of organised warfare.
            </p>
            <p>
              Either the power was arranged in some way that leaves no trace of
              the kind we know how to look for, or we have spent a century
              looking for the wrong things.
            </p>
          </>
        ),
      },
    ],
  },
  {
    where: "The Supe valley, Peru · from about 2600 BC",
    title: "Monuments, no pottery, and nothing to read",
    layers: [
      {
        label: "What was dug up",
        body: (
          <>
            <p>
              While the pyramids were going up in Egypt, people in a river
              valley north of modern Lima were raising platform mounds and sunken
              circular plazas at a site now called Caral. It is among the oldest
              urban complexes anywhere.
            </p>
            <p>
              They did it without pottery, which had not reached them, and with
              no evidence so far of fortification, weaponry or the destruction
              layers that mark a conquest.
            </p>
          </>
        ),
      },
      {
        label: "What is not there",
        body: (
          <>
            <p>
              <strong>They also did it without writing.</strong> The Indus at
              least left a script, and being unable to read it is a different
              problem from there being nothing to read.
            </p>
            <p>
              Caral left knotted cords and architecture. Whatever these people
              understood themselves to be doing, the only surviving account of it
              is the shape of what they built, and that is the most opaque
              society on this page by a distance.
            </p>
          </>
        ),
      },
    ],
  },
];

const FIRSTS = [
  {
    where: "Uruk, southern Iraq · about 3300 BC",
    title: "Writing begins as a warehouse problem",
    layers: [
      {
        label: "What the tablets say",
        body: (
          <>
            <p>
              The oldest substantial writing anybody has is not literature, law
              or scripture. It is stock control. The earliest tablets from Uruk
              record quantities of grain, beer, textiles and livestock, and who
              was answerable for them.
            </p>
            <p>
              It grew out of an older habit of sealing small clay tokens inside
              clay envelopes and marking the outside to show what was inside,
              until somebody noticed the tokens had become redundant.
            </p>
          </>
        ),
      },
      {
        label: "Why that matters",
        body: (
          <>
            <p>
              <strong>
                For several centuries the system cannot record a sentence.
              </strong>{" "}
              It has signs for commodities and numbers and almost nothing for
              the words in between.
            </p>
            <p>
              So the thing that would eventually carry epic poetry, law,
              correspondence and every argument anybody has ever written down
              spent its first stretch of existence unable to express anything
              except how much barley was in the shed. Nobody designed it to
              become what it became.
            </p>
          </>
        ),
      },
    ],
  },
  {
    where: "Ur, southern Iraq · about 2300 BC",
    title: "The first person to sign her name to her own work",
    layers: [
      {
        label: "What survives",
        body: (
          <>
            <p>
              Enheduanna was the daughter of Sargon of Akkad and high priestess
              of the moon god at Ur. A body of hymns comes down attached to her
              name, and by long convention she is the earliest author in history
              who can be called by one.
            </p>
            <p>
              She writes about herself in trouble: driven from her office,
              appealing to the goddess Inanna, describing what the loss of
              position felt like from inside it.
            </p>
          </>
        ),
      },
      {
        label: "How firm it is",
        body: (
          <>
            <p>
              <strong>The attribution is not beyond argument.</strong> The
              surviving copies were made centuries after she lived, and scholars
              differ over how much of the text is hers and how much accrued to a
              famous name.
            </p>
            <p>
              That the question can be asked at all is the novelty worth
              noticing. Before this there is a great deal of writing and nobody
              to attribute any of it to, so there is no earlier case where the
              argument would even be possible.
            </p>
          </>
        ),
      },
    ],
  },
  {
    where: "Nebra, central Germany · about 1600 BC",
    title: "An object revised by successive owners",
    layers: [
      {
        label: "The object",
        body: (
          <p>
            A bronze disc about the size of a dinner plate, inlaid with gold: a
            sun or full moon, a crescent, a scatter of stars and a tight cluster
            usually read as the Pleiades. It is the oldest concrete depiction of
            the night sky anyone has found.
          </p>
        ),
      },
      {
        label: "What was done to it",
        body: (
          <>
            <p>
              It did not stay the same. Gold arcs were added along the edges
              later, marking how far along the horizon the sun rises and sets
              across the year. A further curved band went on after that. Later
              still somebody punched holes around the rim, and then it went into
              the ground.
            </p>
            <p>
              <strong>
                Each modification is a different generation deciding what the
                object was for.
              </strong>{" "}
              It is not a finished statement of what these people believed. It
              is an argument still in progress, stopped at the point where
              somebody buried it.
            </p>
          </>
        ),
      },
    ],
  },
  {
    where: "Anyang, northern China · about 1250 BC",
    title: "The one that never stopped",
    layers: [
      {
        label: "What they wrote on",
        body: (
          <>
            <p>
              Shang diviners applied heat to ox shoulder blades and turtle shells
              until they cracked, read the cracks as answers, and inscribed the
              question alongside. Will the harvest hold. Will the king's toothache
              pass. Is a particular ancestor responsible for the trouble.
            </p>
            <p>
              These are the oldest Chinese writings anybody has, and they are
              somebody's actual anxieties rather than an official account of
              anything.
            </p>
          </>
        ),
      },
      {
        label: "Why it is here",
        body: (
          <>
            <p>
              <strong>
                Keep this one in mind, because it is the control for everything
                that follows.
              </strong>
            </p>
            <p>
              The script on these bones is the direct ancestor of the characters
              written in China this morning. The line of descent has never once
              been cut, so anyone who learns the modern system can be walked back
              three thousand years to the shells and read them.
            </p>
            <p>
              Nothing else on this page can say that, and the next section is
              about why.
            </p>
          </>
        ),
      },
    ],
  },
];

const LIGHTS = [
  { name: "Ugarit, on the Syrian coast", note: "burned, never reoccupied", survives: false },
  { name: "Hattusa, the Hittite capital", note: "abandoned", survives: false },
  { name: "Pylos, in the Peloponnese", note: "palace burned", survives: false },
  { name: "Mycenae and Tiryns", note: "destroyed", survives: false },
  { name: "Emar, on the Euphrates", note: "destroyed", survives: false },
  { name: "Linear B, the Greek script", note: "unreadable within a generation", survives: false },
  { name: "The great-king correspondence", note: "no further letters", survives: false },
  { name: "Egypt", note: "holds, diminished", survives: true },
  { name: "Assyria", note: "holds", survives: true },
  { name: "Shang China", note: "unaffected, another two centuries to run", survives: true },
  { name: "The Andes", note: "unaffected, another world entirely", survives: true },
];

const AFTER = [
  {
    where: "Crete · the script that stopped",
    title: "Readable aloud, meaningless",
    layers: [
      {
        label: "What we have",
        body: (
          <>
            <p>
              Minoan Crete wrote in a script called Linear A. A later script,
              Linear B, borrowed a great many of its signs to write early Greek,
              and Linear B was cracked in the 1950s.
            </p>
            <p>
              Because the signs are shared, we can make a decent guess at how a
              Linear A tablet sounded. You could read one aloud in a room and be
              broadly right about the noises.
            </p>
          </>
        ),
      },
      {
        label: "What is missing",
        body: (
          <>
            <p>
              <strong>Nobody has any idea what you would be saying.</strong> The
              language underneath is not Greek and matches nothing else known.
            </p>
            <p>
              A century of very capable people have failed at it, and without a
              bilingual text there may be no way in at all. The sound survived
              the break and the sense did not, which is an unusually clean
              illustration of what a transmission chain actually carries.
            </p>
          </>
        ),
      },
    ],
  },
  {
    where: "Medinet Habu, Egypt · about 1177 BC",
    title: "A list of enemies, and no other trace",
    layers: [
      {
        label: "What we have",
        body: (
          <>
            <p>
              Egyptian inscriptions describe a coalition arriving by land and
              sea, overwhelming everything in its path, and being fought off. The
              inscriptions name them: Peleset, Tjeker, Shekelesh, Denyen,
              Weshesh.
            </p>
            <p>
              That is very nearly the whole file. Modern writing calls them the
              Sea Peoples, which is a scholarly convenience rather than anything
              they would have recognised.
            </p>
          </>
        ),
      },
      {
        label: "What is missing",
        body: (
          <>
            <p>
              <strong>
                They have no account of themselves anywhere, in any language.
              </strong>
            </p>
            <p>
              Whether they were invaders, refugees from the collapse,
              opportunists moving into a vacuum, or several unrelated groups
              filed under one convenient heading is still argued, because the
              only witness available is the empire that fought them and wrote up
              the victory on a temple wall.
            </p>
          </>
        ),
      },
    ],
  },
  {
    where: "The Aegean · four centuries later",
    title: "A memory of a memory",
    layers: [
      {
        label: "What we have",
        body: (
          <>
            <p>
              Greece came out of the break without writing and stayed that way
              for roughly four hundred years. When literacy returned it had to be
              borrowed: the Greek alphabet is an adaptation of a Phoenician one.
            </p>
            <p>
              Homer is composed at around that point, about a war set in the
              world that fell.
            </p>
          </>
        ),
      },
      {
        label: "What is missing",
        body: (
          <>
            <p>
              Some details are genuinely Bronze Age, carried across the whole gap
              by oral transmission. A helmet made of boar's tusks appears in the
              poems and again in Mycenaean graves, and nobody in the eighth
              century had seen one.
            </p>
            <p>
              <strong>
                Other details belong to the poet's own century, and the two are
                mixed together with no seam.
              </strong>
            </p>
            <p>
              Nobody involved could check anything. The archives had burned, the
              script was gone, and there was no living person who had read a word
              of it.
            </p>
          </>
        ),
      },
    ],
  },
];

/* ============================================================
   COMPONENTS
   ============================================================ */

function Rail({ n, cls, kind }) {
  return (
    <div className="br-rail">
      {n && <span className="br-rail-num">{n}</span>}
      <span className={`br-rail-class ${kind}`}>{cls}</span>
    </div>
  );
}

function Exhibit({ item }) {
  const [d, setD] = useState(0);
  const layered = Array.isArray(item.layers);
  return (
    <div className="br-ex">
      <div className="br-ex-head">
        <span className="br-ex-where">{item.where}</span>
      </div>
      <h3>{item.title}</h3>
      {layered && (
        <div className="br-steps">
          {item.layers.map((l, i) => (
            <button
              key={l.label}
              className={`br-step${d === i ? " on" : ""}`}
              onClick={() => setD(i)}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
      {item.manifest && (!layered || d === 0) && (
        <div className="br-manifest">
          {item.manifest.map(([from, what]) => (
            <div key={from}>
              <span className="from">{from} </span>
              {what}
            </div>
          ))}
        </div>
      )}
      {layered ? item.layers[d].body : item.body}
    </div>
  );
}

function Commit({ text, options, value, onPick }) {
  return (
    <div className="br-q">
      <p className="br-q-text">{text}</p>
      <div className="br-opts">
        {options.map((o) => (
          <button
            key={o.key}
            className={`br-opt${value === o.key ? " chosen" : ""}`}
            onClick={() => onPick(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Movement({ n, cls, kind, title, children }) {
  return (
    <section className="br-movement">
      <Rail n={n} cls={cls} kind={kind} />
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/* ============================================================
   SECTIONS
   ============================================================ */

function One() {
  return (
    <Movement
      n="I"
      cls="Attested"
      kind="solid"
      title="For a few centuries, the world was joined up."
    >
      <p className="br-lead">
        The Bronze Age gets its name from an alloy, and the alloy is the reason
        for everything else. Bronze is copper mixed with tin. Copper is common
        enough. Tin is rare, and the sources are nowhere near the places that
        needed it.
      </p>
      <p>
        So a technology that every state depended on, for tools and weapons
        alike, could only exist if goods moved reliably across enormous
        distances. That requirement built something: a network of kingdoms,
        ports and agreements running from Greece to Mesopotamia and out to
        Afghanistan and the Baltic.
      </p>
      <p>Two objects show what that looked like from the inside.</p>
      {NETWORK.map((e, i) => (
        <Exhibit item={e} key={i} />
      ))}
    </Movement>
  );
}

function Two() {
  const [guess, setGuess] = useState(null);
  return (
    <Movement
      n="II"
      cls="Attested"
      kind="solid"
      title="Two of them refused the template."
    >
      <p className="br-lead">
        Before the exhibits, a question, because the answer you give is the
        thing this section is actually about.
      </p>
      <p>
        Imagine archaeologists working a Bronze Age city: several hundred
        hectares, tens of thousands of people, standardised weights and planned
        streets. They have been digging for a century.
      </p>
      <Commit
        text="Which of these would you expect them to have found by now?"
        options={[
          { key: "palace", label: "A palace, or something like one." },
          { key: "tomb", label: "A rich burial for whoever was in charge." },
          { key: "ruler", label: "An image of a ruler, looking like a ruler." },
          { key: "war", label: "Evidence of organised warfare." },
          { key: "all", label: "All of those, frankly. That is what cities have." },
        ]}
        value={guess}
        onPick={setGuess}
      />
      {guess && (
        <p style={{ marginTop: "1.6rem" }}>
          <strong style={{ color: C.ink, fontWeight: 400 }}>
            Whichever you picked, it has not been found.
          </strong>{" "}
          Not one of those five, at any Indus site, in a hundred years of
          excavation. The expectation is entirely reasonable and it comes from
          somewhere: a standard picture of early civilisation, assembled mostly
          from Mesopotamia and Egypt, in which power announces itself in stone.
        </p>
      )}
      {guess && (
        <p>
          That picture is a description of some places rather than a rule about
          all of them, and carrying it into these two societies guarantees you
          will misread what you are looking at.
        </p>
      )}
      {guess &&
        REFUSALS.map((e, i) => (
          <Exhibit item={e} key={i} />
        ))}
      {!guess && (
        <div className="br-list" style={{ borderTop: "none" }} />
      )}
    </Movement>
  );
}

function Three() {
  return (
    <Movement
      n="III"
      cls="Attested"
      kind="solid"
      title="Some things had not yet become inevitable."
    >
      <p className="br-lead">
        Writing, authorship and astronomy all feel like fixed features of human
        life, the sort of thing that was always going to happen and always going
        to take the shape it took.
      </p>
      <p>
        This period is early enough that you can catch several of them before
        they settled, while the decisions were still being made and could have
        gone differently.
      </p>
      <p>
        The last of the four is here for a different reason, and it will matter
        shortly.
      </p>
      {FIRSTS.map((e, i) => (
        <Exhibit item={e} key={i} />
      ))}
    </Movement>
  );
}

function Fire({ broken, onBreak }) {
  // onBreak toggles, so the sequence can be watched more than once.
  return (
    <section className="br-fire">
      <Rail n="IV" cls="The break" kind="dashed" />
      <h2>Then, in about fifty years, most of it stopped.</h2>
      <p>
        Between roughly 1200 and 1150 BC, city after city in the eastern
        Mediterranean and the Near East was destroyed or abandoned. Some were
        burned. Some were simply walked away from. The trade routes emptied, the
        correspondence stopped, and the palace administrations that had run the
        whole system ceased to exist.
      </p>
      <p>
        Historians still argue about the cause, and the honest answer is that
        there probably is not one. Drought, earthquake, migration, warfare and
        the fragility of a system where every state depended on every other are
        all in the mix.
      </p>
      <p>
        <strong style={{ color: C.ink, fontWeight: 400 }}>
          What matters here is not why it happened but what it did to the
          record.
        </strong>{" "}
        Below is a list of things that were running in 1200 BC. Some of them
        stop. Some of them do not, and paying attention to which is which is the
        whole point of the exercise.
      </p>

      <div className="br-list">
        {LIGHTS.map((l, i) => (
          <div
            className={`br-item${broken && !l.survives ? " gone" : ""}${
              broken && l.survives ? " held" : ""
            }`}
            key={l.name}
            style={{ transitionDelay: broken ? `${i * 160}ms` : "0ms" }}
          >
            <span className="br-item-name">{l.name}</span>
            <span className="br-item-note">{broken ? l.note : "running"}</span>
          </div>
        ))}
      </div>

      <button className="br-btn" onClick={onBreak}>
        {broken ? "Put it back" : "Let it happen"}
      </button>

      {broken && (
        <>
          <p style={{ marginTop: "2.6rem" }}>
            Four of them held. That is worth dwelling on, because the shorthand
            for this period encourages you to imagine a global catastrophe, and
            it was not one.
          </p>
          <p>
            Egypt survived in reduced form. Assyria came through. Shang China
            was entirely unaffected and had another two centuries ahead of it.
            The Andes were on a separate trajectory that this had nothing to do
            with, and the Indus cities had already declined several centuries
            earlier for reasons of their own.
          </p>
          <p>
            <strong style={{ color: C.ink, fontWeight: 400 }}>
              The instinct to globalise it is itself the thing to correct.
            </strong>{" "}
            What collapsed was one very interconnected region, and being
            interconnected is precisely what made it collapsible.
          </p>
          <p>
            The line that matters most on that list is the sixth. Greece did not
            merely lose its palaces. It lost the ability to write, and it did not
            get it back for four hundred years.
          </p>
        </>
      )}
    </section>
  );
}

function After({ broken }) {
  if (!broken) {
    return (
      <section className="br-after">
        <Rail n="V" cls="Unreadable" kind="none" />
        <h2>What it looks like from the far side.</h2>
        <div className="br-locked">
          This section is about the period after the break, and it does not make
          much sense before one. The control above is one click.
        </div>
      </section>
    );
  }
  return (
    <section className="br-after">
      <Rail n="V" cls="Unreadable" kind="none" />
      <h2>What it looks like from the far side.</h2>
      <p>
        Everything in the first three sections could be opened and read. The
        ship's cargo has been catalogued, the letters have been translated, the
        oracle bones can be studied by anyone who learns the script, and the
        line from those bones to modern Chinese is unbroken.
      </p>
      <p>
        The material below is the same kind of thing. Objects, inscriptions,
        poems. The difference is what happened to the chain carrying them, and
        that chain is worth picturing properly, because it is not a metaphor.
      </p>
      <p>
        Writing is not a property of a place. It is a line of people, in which
        every single person who can read learned it from a person who could.
        There is no other way anybody has ever acquired it. Break that line for
        one generation and the marks are all still there, on the same walls and
        tablets, and there is nobody alive who can turn them back into words.
      </p>
      <p>
        The Shang line has never once been broken, which is why a reader today
        can be walked back to the oracle bones. The line in Greece was cut, and
        stayed cut for four hundred years.
      </p>
      {AFTER.map((e, i) => (
        <Exhibit item={e} key={i} />
      ))}
      <p style={{ marginTop: "2.6rem" }}>
        This is the part worth taking away. A collapse of this kind is not
        buildings falling over. Buildings can be rebuilt and often were.
      </p>
      <p>
        What broke was transmission. The people who came afterwards were living
        among the ruins of something they could see perfectly well and could no
        longer read, in a landscape full of writing that had become decoration.
        Everything they said about it was reconstruction, and they had no way of
        knowing which parts they had got right.
      </p>
      <p style={{ color: C.inkDim }}>
        Neither, for a good deal of it, do we.
      </p>
      <div className="br-colophon">The Break · three of six</div>
    </section>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

function TheBreak() {
  const [broken, setBroken] = useState(false);
  return (
    <div className="br-root">
      <style>{styles}</style>
      <div className="br-wrap">
        <header className="br-mast">
          <p className="br-eyebrow">The Bronze Age · and what came after it</p>
          <h1>The Break</h1>
          <p className="br-standfirst">
            For a few centuries the world was joined up. Then most of it stopped,
            and the people who came next could see the ruins and could not read
            a word.
          </p>
        </header>
        <One />
        <Two />
        <Three />
        <Fire broken={broken} onBreak={() => setBroken((v) => !v)} />
        <After broken={broken} />
      </div>
    </div>
  );
}

  return TheBreak;
})();


/* ============================================================
   TheApparatus
   ============================================================ */

const Apparatus = (() => {

/* ============================================================
   THE APPARATUS
   An explainer on procedural narrative generation.
   The reader is the experiment before they are shown the machine.
   ============================================================ */

const C = {
  ground: "#0D1719",
  panel: "#132326",
  panelLift: "#1A2E32",
  machine: "#101B26",
  ink: "#E9E3D5",
  inkDim: "#93A6A8",
  inkFaint: "#5C7073",
  signal: "#F0BE4B",
  signalDim: "#8A7233",
  cool: "#6FB3C0",
  coolDim: "#3C6570",
  rule: "#294044",
  ruleMachine: "#2A3B4D",
};

const styles = `
*, *::before, *::after { box-sizing: border-box; }

.ap-root {
  background: ${C.ground};
  color: ${C.ink};
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 300;
  font-size: 19px;
  line-height: 1.62;
  padding-bottom: 8rem;
  -webkit-font-smoothing: antialiased;
}
.ap-wrap { max-width: 46rem; margin: 0 auto; padding: 0 1.5rem; }

.ap-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: ${C.inkFaint}; margin: 0 0 1.4rem;
}
.ap-mast { padding: 7rem 0 4.5rem; }
.ap-mast h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 144;
  font-weight: 800; font-size: clamp(3rem, 10vw, 5.2rem);
  line-height: 0.96; letter-spacing: -0.035em; margin: 0 0 1.6rem;
}
.ap-standfirst { font-size: clamp(1.05rem, 2.4vw, 1.3rem); max-width: 33rem; margin: 0; }

.ap-movement { padding: 4.5rem 0; border-top: 1px solid ${C.rule}; }
.ap-rail { display: flex; align-items: baseline; gap: 0.85rem; margin-bottom: 1.9rem; flex-wrap: wrap; }
.ap-rail-num { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: ${C.signal}; letter-spacing: 0.1em; }
.ap-rail-class {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem;
  letter-spacing: 0.18em; text-transform: uppercase; color: ${C.inkFaint}; padding-bottom: 3px;
}
.ap-rail-class.solid { border-bottom: 1px solid ${C.inkFaint}; }
.ap-rail-class.dashed { border-bottom: 1px dashed ${C.inkFaint}; }
.ap-rail-class.machine { border-bottom: 1px solid ${C.coolDim}; color: ${C.cool}; }

.ap-movement h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600; font-size: clamp(1.75rem, 4.6vw, 2.5rem);
  line-height: 1.06; letter-spacing: -0.02em; margin: 0 0 1.5rem;
}
.ap-movement p { margin: 0 0 1.25rem; max-width: 40rem; }
.ap-movement p.ap-lead { font-size: 1.1rem; }
em { font-style: italic; }

/* ---------- finds ---------- */

.ap-find {
  background: ${C.panel}; border: 1px solid ${C.rule};
  border-left: 2px solid ${C.signalDim}; border-radius: 2px;
  padding: 1.15rem 1.25rem; margin-top: 0.8rem;
}
.ap-find-id {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.63rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: ${C.inkFaint};
  margin-bottom: 0.5rem;
}
.ap-find-desc { font-size: 0.99rem; color: ${C.ink}; margin: 0; }
.ap-find-desc .hl { color: ${C.signal}; }

/* ---------- questions ---------- */

.ap-q { margin-top: 2rem; padding-top: 1.6rem; border-top: 1px solid ${C.rule}; }
.ap-q-text { font-size: 1.02rem; margin: 0 0 1rem; }
.ap-opts { display: grid; gap: 0.5rem; }
.ap-opt {
  text-align: left; background: transparent; border: 1px solid ${C.rule};
  color: ${C.ink}; font-family: 'Newsreader', Georgia, serif; font-size: 0.98rem;
  font-weight: 300; padding: 0.75rem 1rem; border-radius: 2px; cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;
}
.ap-opt:hover { border-color: ${C.signalDim}; background: ${C.panelLift}; }
.ap-opt:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 2px; }
.ap-opt.chosen { border-color: ${C.signal}; color: ${C.signal}; }
.ap-opt.chosen::before { content: "▸ "; }

/* ---------- machine sections ---------- */

.ap-machine {
  background: ${C.machine}; border: 1px solid ${C.ruleMachine};
  border-radius: 2px; padding: 1.5rem 1.4rem; margin-top: 1.6rem;
}
.ap-machine-cap {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.64rem;
  letter-spacing: 0.18em; text-transform: uppercase; color: ${C.cool}; margin-bottom: 1rem;
}
.ap-rules { font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; line-height: 2; color: ${C.inkDim}; }
.ap-rules .k { color: ${C.cool}; }

.ap-sbs { display: grid; gap: 0.7rem; margin-top: 1.2rem; }
.ap-sbs-cell { border: 1px solid ${C.ruleMachine}; border-radius: 2px; padding: 0.95rem 1.05rem; }
.ap-sbs-lab {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: ${C.inkFaint}; margin-bottom: 0.45rem;
}
.ap-sbs-cell p { font-size: 0.95rem; color: ${C.inkDim}; margin: 0; max-width: none; }

/* ---------- generators ---------- */

.ap-gens { display: grid; gap: 0.9rem; margin-top: 1.8rem; }
@media (min-width: 680px) { .ap-gens { grid-template-columns: 1fr 1fr; } }
.ap-gen { border: 1px solid ${C.rule}; border-radius: 2px; padding: 1.1rem 1.15rem; background: ${C.panel}; }
.ap-gen h4 {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: ${C.inkDim};
  margin: 0 0 0.3rem; font-weight: 400;
}
.ap-gen .size { font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem; color: ${C.inkFaint}; margin-bottom: 0.85rem; }
.ap-words { font-family: 'IBM Plex Mono', monospace; font-size: 0.95rem; line-height: 1.95; color: ${C.ink}; }
.ap-gen.wild .ap-words { color: ${C.inkDim}; }

.ap-toggles { display: grid; gap: 0.45rem; margin-top: 1.5rem; }
.ap-toggle {
  display: flex; justify-content: space-between; align-items: center; gap: 1rem;
  text-align: left; background: transparent; border: 1px solid ${C.rule};
  color: ${C.inkDim}; font-family: 'Newsreader', Georgia, serif; font-size: 0.95rem;
  font-weight: 300; padding: 0.65rem 0.95rem; border-radius: 2px; cursor: pointer;
}
.ap-toggle:hover { background: ${C.panelLift}; }
.ap-toggle:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 2px; }
.ap-toggle.on { border-color: ${C.coolDim}; color: ${C.ink}; }
.ap-toggle .mark { font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; color: ${C.cool}; flex-shrink: 0; }

.ap-btn {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.73rem;
  letter-spacing: 0.13em; text-transform: uppercase; background: transparent;
  color: ${C.signal}; border: 1px solid ${C.signalDim}; padding: 0.62rem 1.15rem;
  cursor: pointer; border-radius: 1px; margin-top: 1.5rem;
  transition: background 160ms ease, color 160ms ease;
}
.ap-btn:hover { background: ${C.signalDim}; color: ${C.ground}; }
.ap-btn:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 3px; }
.ap-btn[disabled] { opacity: 0.35; cursor: default; }
.ap-btn[disabled]:hover { background: transparent; color: ${C.signal}; }

.ap-chron { margin-top: 1.4rem; border-top: 1px solid ${C.ruleMachine}; }
.ap-entry {
  display: grid; grid-template-columns: 3.2rem 1fr; gap: 1rem;
  padding: 0.62rem 0; border-bottom: 1px solid ${C.ruleMachine}; align-items: baseline;
}
.ap-entry-year { font-family: 'IBM Plex Mono', monospace; font-size: 0.76rem; color: ${C.cool}; }
.ap-entry-text { font-size: 0.95rem; color: ${C.ink}; }
.ap-entry-fate {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.61rem;
  letter-spacing: 0.13em; text-transform: uppercase; color: ${C.inkFaint};
  display: block; margin-top: 0.25rem;
}
.ap-entry.gap .ap-entry-text { color: ${C.inkFaint}; font-style: italic; }
.ap-entry.gap .ap-entry-year { color: ${C.inkFaint}; }
.ap-entry.flagged .ap-entry-fate { color: ${C.signal}; }

.ap-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 1.6rem; }
.ap-tab {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem;
  letter-spacing: 0.12em; text-transform: uppercase; background: transparent;
  border: 1px solid ${C.rule}; color: ${C.inkDim}; padding: 0.5rem 0.9rem;
  border-radius: 1px; cursor: pointer;
}
.ap-tab:hover { background: ${C.panelLift}; }
.ap-tab:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 2px; }
.ap-tab.on { border-color: ${C.coolDim}; color: ${C.cool}; }

.ap-note {
  font-size: 0.94rem; color: ${C.inkDim}; margin: 1.5rem 0 0;
  padding-left: 0.9rem; border-left: 1px solid ${C.rule}; max-width: 36rem;
}
.ap-locked {
  margin-top: 1.8rem; padding: 1.5rem 1.3rem; border: 1px dashed ${C.rule};
  border-radius: 2px; font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;
  line-height: 1.9; color: ${C.inkFaint};
}
.ap-colophon {
  margin-top: 5rem; padding-top: 1.6rem; border-top: 1px solid ${C.rule};
  font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.1em; text-transform: uppercase; color: ${C.inkFaint};
}

@media (max-width: 560px) {
  .ap-root { font-size: 17.5px; }
  .ap-mast { padding: 4rem 0 3rem; }
  .ap-movement { padding: 3.2rem 0; }
}
`;

/* ============================================================
   THE GENERATOR
   A real one. The hidden rule is that the spiral marks a
   workshop, and has nothing to do with rank or with ritual.
   ============================================================ */

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, xs) => xs[Math.floor(r() * xs.length)];

const FORMS = [
  "a shallow bowl", "a long-handled ladle", "a hafted blade", "a pierced disc",
  "a lidded jar", "a curved pin", "a socketed hook", "a flat weight",
];
const CONTEXTS = [
  "beneath a house floor", "in a pit outside the wall", "in a burial with two others",
  "in a burned storeroom", "in a river channel", "under a collapsed threshold",
  "in a refuse layer behind the kiln", "packed into a wall cavity",
];

// Workshop A: bronze and bone, and always the spiral.
// Workshop B: clay and stone, and never the spiral.
const WORKSHOP = {
  A: { materials: ["bronze", "worked bone"], spiral: true },
  B: { materials: ["fired clay", "polished stone"], spiral: false },
};

function makeFind(r, id, usedForms) {
  const shop = r() < 0.5 ? "A" : "B";
  const w = WORKSHOP[shop];
  let form = pick(r, FORMS);
  let guard = 0;
  while (usedForms.has(form) && guard++ < 30) form = pick(r, FORMS);
  usedForms.add(form);
  return {
    id,
    shop,
    form,
    material: pick(r, w.materials),
    spiral: w.spiral,
    context: pick(r, CONTEXTS),
    worn: r() < 0.5,
  };
}

// How large is the space these finds are drawn from?
const FIND_SPACE =
  FORMS.length * CONTEXTS.length * 2 /* wear */ *
  (WORKSHOP.A.materials.length + WORKSHOP.B.materials.length);

// Three framings of identical underlying facts.
function describe(f, lens) {
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  const spiral = f.spiral ? "carrying the spiral mark" : "with no spiral mark";
  const wear = f.worn ? "heavily worn" : "showing almost no wear";

  // Both lenses select an interpretation. Neither states anything the
  // generator did not produce, which is what makes the reveal fair.
  if (lens === "rank") {
    return (
      <>
        {cap(f.form)} in {f.material}, <span className="hl">{spiral}</span>.{" "}
        {cap(wear)}
        {f.worn
          ? ", consistent with long use by successive holders of a position"
          : ", as one would expect of an object kept for display rather than work"}
        . Recovered {f.context}.
      </>
    );
  }
  if (lens === "production") {
    return (
      <>
        {cap(f.form)} in {f.material}, <span className="hl">{spiral}</span>. The
        cut of the mark is consistent in depth and spacing with the others that
        carry it. {cap(wear)}
        {f.worn
          ? ", so the piece saw use after leaving the workshop"
          : ", so the piece appears to have been deposited close to new"}
        . Recovered {f.context}.
      </>
    );
  }
  if (lens === "ritual") {
    return (
      <>
        {cap(f.form)} in {f.material}, <span className="hl">{spiral}</span>. The
        mark is applied with care and appears reserved rather than casual.{" "}
        {cap(wear)}
        {f.worn
          ? ", suggesting repeated handling in ceremony"
          : ", as though kept apart from daily use"}
        . Deposited {f.context}.
      </>
    );
  }
  return (
    <>
      {cap(f.form)} in {f.material}, <span className="hl">{spiral}</span>.{" "}
      {cap(wear)}. Recovered {f.context}.
    </>
  );
}

const USED = new Set();
const SET_ONE = (() => { const r = rng(90210); return [1, 2, 3, 4].map((i) => makeFind(r, `F-0${i}`, USED)); })();
const SET_TWO = (() => { const r = rng(4417); return [5, 6, 7].map((i) => makeFind(r, `F-0${i}`, USED)); })();

/* ---- name generators for the oatmeal demo ---- */

const ONSETS = ["k", "t", "p", "m", "n", "s", "l", "r", "v", "th", "kh", "z", "b", "d", "g", "f", "h", "j", "w", "y"];
const VOWELS = ["a", "e", "i", "o", "u"];
const CODAS = ["", "", "n", "s", "r", "l", "k", "t", "m"];

function wildName(r) {
  const n = 2 + Math.floor(r() * 3);
  let out = "";
  for (let i = 0; i < n; i++) out += pick(r, ONSETS) + pick(r, VOWELS) + pick(r, CODAS);
  return out.charAt(0).toUpperCase() + out.slice(1);
}

const TAMED_ONSETS = ["k", "t", "m", "n", "s", "l", "r"];
const FRONT = ["e", "i"];
const BACK = ["a", "o", "u"];

function tamedName(r) {
  const front = r() < 0.5;
  const vowels = front ? FRONT : BACK;
  const n = 2 + Math.floor(r() * 2);
  let out = "";
  let prev = "";
  for (let i = 0; i < n; i++) {
    let on = pick(r, TAMED_ONSETS);
    while (on === prev) on = pick(r, TAMED_ONSETS);
    prev = on;
    out += on + pick(r, vowels);
  }
  return out.charAt(0).toUpperCase() + out.slice(1);
}

/* ---- movement 5: prohibition builder ---- */

const CONS = ["k", "t", "p", "m", "n", "s", "l", "r", "v", "z", "d", "g", "th", "sh"];
const HARSH = ["k", "t", "p", "g", "d"];
const RULES = [
  { id: "harmony", label: "Vowels within a word must all be front, or all back" },
  { id: "norepeat", label: "No consonant may follow itself" },
  { id: "openend", label: "Every word must end in a vowel" },
  { id: "oneharsh", label: "At most one hard stop per word" },
];

function buildName(r, on) {
  const cons = CONS;
  const vowels = on.harmony ? (r() < 0.5 ? FRONT : BACK) : VOWELS;
  const n = 2 + Math.floor(r() * 2);
  let out = "";
  let prev = "";
  let harsh = 0;
  for (let i = 0; i < n; i++) {
    let c = pick(r, cons);
    let guard = 0;
    while (guard++ < 40) {
      const repeats = on.norepeat && c === prev;
      const tooHarsh = on.oneharsh && HARSH.includes(c) && harsh >= 1;
      if (!repeats && !tooHarsh) break;
      c = pick(r, cons);
    }
    if (HARSH.includes(c)) harsh++;
    prev = c;
    out += c + pick(r, vowels);
  }
  if (!on.openend && r() < 0.45) out += pick(r, ["n", "s", "r", "l"]);
  return out.charAt(0).toUpperCase() + out.slice(1);
}

function spaceSize(on) {
  const c = CONS.length;
  const v = on.harmony ? 2.5 : 5;
  const cEff = on.oneharsh ? c - 2.5 : c;
  const syll = cEff * v;
  const tail = on.openend ? 1 : 1 + 4 * 0.45;
  const two = Math.pow(syll, 2) * (on.norepeat ? 0.93 : 1) * tail;
  const three = Math.pow(syll, 3) * (on.norepeat ? 0.86 : 1) * tail;
  return Math.round(two + three);
}


/* ============================================================
   THE HISTORY GENERATOR
   Three layers. What happened, what was written down, what
   survived. The reader sees the last one first.
   ============================================================ */

const ALL_RULES = { harmony: true, norepeat: true, openend: true, oneharsh: true };

const EPITHETS = ["the Elder", "the Younger", "the Quiet", "the Lame", "the Bold", "the Third", "the Grey", "the Late"];

function simulate(seed) {
  const r = rng(seed);
  const polities = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    name: buildName(r, ALL_RULES),
    ruler: buildName(r, ALL_RULES) + " " + pick(r, EPITHETS),
    strength: 3 + Math.floor(r() * 3),
    alive: true,
  }));

  const events = [];
  const say = (year, text, actors, kind) =>
    events.push({ year, text, actors, kind });

  for (let year = 4; year <= 96; year += 2 + Math.floor(r() * 4)) {
    const living = polities.filter((p) => p.alive);
    if (living.length < 2) break;
    const roll = r();
    const a = pick(r, living);

    if (roll < 0.24) {
      const heir = buildName(r, ALL_RULES) + " " + pick(r, EPITHETS);
      say(year, `${a.ruler} of ${a.name} dies. ${heir} succeeds.`, [a.id], "succession");
      a.ruler = heir;
    } else if (roll < 0.52) {
      const b = pick(r, living.filter((p) => p.id !== a.id));
      if (!b) continue;
      const winner = a.strength + r() * 2 >= b.strength + r() * 2 ? a : b;
      const loser = winner === a ? b : a;
      winner.strength -= 1;
      loser.strength -= 2;
      say(year, `${a.name} and ${b.name} go to war. ${winner.name} prevails.`, [a.id, b.id], "war");
    } else if (roll < 0.66) {
      a.strength -= 2;
      say(year, `Failed harvests across ${a.name}. Its levies cannot be raised.`, [a.id], "famine");
    } else if (roll < 0.78) {
      const b = pick(r, living.filter((p) => p.id !== a.id));
      if (!b) continue;
      say(year, `${a.name} and ${b.name} swear terms against their neighbours.`, [a.id, b.id], "treaty");
    } else if (roll < 0.9) {
      a.strength -= 1;
      say(year, `The outer districts of ${a.name} refuse ${a.ruler}.`, [a.id], "revolt");
    } else {
      a.strength += 1;
      say(year, `${a.ruler} of ${a.name} takes tribute from the coast.`, [a.id], "tribute");
    }

    for (const p of polities) {
      if (p.alive && p.strength <= 0) {
        p.alive = false;
        say(year + 1, `${p.name} ceases to hold together. Its record ends here.`, [p.id], "collapse");
        const dead = polities.filter((q) => !q.alive).length;
        if (dead <= 2 && r() < 0.7) {
          const born = {
            id: polities.length,
            name: buildName(r, ALL_RULES),
            ruler: buildName(r, ALL_RULES) + " " + pick(r, EPITHETS),
            strength: 3,
            alive: true,
          };
          polities.push(born);
          say(year + 2, `${born.name} is founded in the country ${p.name} held.`, [born.id], "founding");
        }
      }
    }
  }

  // ---- the record: lossy, biased, and sometimes wrong ----
  const records = [];
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const roll = r();

    if (e.kind === "collapse" || roll < 0.16) {
      records.push({ year: e.year, fate: "unwritten", of: i });
      continue;
    }
    if (roll < 0.3) {
      records.push({ year: e.year, fate: "lost", of: i, text: e.text });
      continue;
    }
    if (roll < 0.42 && i > 0) {
      const prev = events[i - 1];
      // The absorbed event must not also stand as its own entry, or the
      // chronicle reports it twice under two different years.
      const prevRec = records.find((x) => x.of === i - 1);
      if (prevRec && prevRec.fate !== "unwritten") prevRec.fate = "absorbed";
      records.push({
        year: e.year,
        fate: "conflated",
        of: i,
        absorbed: i - 1,
        text: `${prev.text.replace(/\.$/, "")}, and in the same season, ${e.text}`,
      });
      continue;
    }
    if (roll < 0.56) {
      const off = 2 + Math.floor(r() * 9);
      records.push({ year: e.year + off, fate: "misdated", of: i, text: e.text, trueYear: e.year });
      continue;
    }
    records.push({ year: e.year, fate: "intact", of: i, text: e.text });
  }
  return { events, records, polities };
}

const FATE_LABEL = {
  absorbed: "folded into the entry below",
  intact: "as it happened",
  misdated: "wrong year",
  conflated: "two events written as one",
  lost: "written, then lost",
  unwritten: "never written down",
};

/* ============================================================
   COMPONENTS
   ============================================================ */

function Rail({ n, cls, kind }) {
  return (
    <div className="ap-rail">
      {n && <span className="ap-rail-num">{n}</span>}
      <span className={`ap-rail-class ${kind}`}>{cls}</span>
    </div>
  );
}

function Find({ f, lens }) {
  return (
    <div className="ap-find">
      <div className="ap-find-id">Find {f.id}</div>
      <p className="ap-find-desc">{describe(f, lens)}</p>
    </div>
  );
}

function Question({ text, options, value, onPick }) {
  return (
    <div className="ap-q">
      <p className="ap-q-text">{text}</p>
      <div className="ap-opts">
        {options.map((o) => (
          <button
            key={o.key}
            className={`ap-opt${value === o.key ? " chosen" : ""}`}
            onClick={() => onPick(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Movement({ n, cls, kind, title, children }) {
  return (
    <section className="ap-movement">
      <Rail n={n} cls={cls} kind={kind} />
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/* ============================================================
   SECTIONS
   ============================================================ */

function One({ lens, setLens }) {
  return (
    <Movement n="I" cls="Field report" kind="solid" title="Have a look at these first.">
      <p className="ap-lead">
        Below are four objects recovered from a single site. You are not
        expected to be an archaeologist. You are expected to do what anyone does
        when handed a set of things: notice a pattern and form a view about what
        it means.
      </p>
      <p>
        Nobody is available to ask. The people who made these are gone, they
        left no writing, and everything anybody will ever know about them has to
        come out of the objects themselves.
      </p>
      {SET_ONE.map((f) => (
        <Find f={f} lens="neutral" key={f.id} />
      ))}
      <Question
        text="Some of them carry a spiral mark and some do not. What is your best guess about what the mark means?"
        options={[
          { key: "rank", label: "It marks status. These belonged to people who mattered." },
          { key: "ritual", label: "It marks the sacred. These were used in ceremony." },
          { key: "production", label: "It marks who made the object, and says nothing about who used it." },
          { key: "refuse", label: "Four objects is not enough to say anything at all." },
        ]}
        value={lens}
        onPick={setLens}
      />
      {lens === "refuse" && (
        <>
          <p className="ap-note">
            That is the correct answer, and it is not available. Four finds
            underdetermine every reading on the list, and a site director still
            has to write something down before the next season is funded.
          </p>
          <p className="ap-note" style={{ marginTop: "0.8rem" }}>
            So pick a working hypothesis. You are allowed to abandon it later.
            Everybody in this field is doing exactly this.
          </p>
        </>
      )}
      {lens && lens !== "refuse" && (
        <p className="ap-note">
          Reasonable, and the evidence permits it. Hold onto it, because the
          next three finds are going to be written up by somebody who has read
          your interim report.
        </p>
      )}
    </Movement>
  );
}

// The follow-up options are drawn from whichever frame is in force. Only the
// production frame is ever offered the true explanation.
const FOLLOW_UP = {
  rank: [
    { key: "a", label: "It belonged to somebody of lower standing." },
    { key: "b", label: "It was a private object rather than an official one." },
    { key: "c", label: "It belonged to an outsider." },
  ],
  ritual: [
    { key: "a", label: "It was for everyday use, outside ceremony." },
    { key: "b", label: "It was deliberately stripped of its marking." },
    { key: "c", label: "It belonged to a lesser rite." },
  ],
  production: [
    { key: "a", label: "It came from a different workshop." },
    { key: "b", label: "It was left unfinished." },
    { key: "c", label: "It was a repair, made outside the usual process." },
  ],
};

function Two({ lens, second, setSecond }) {
  if (!lens || lens === "refuse") {
    return (
      <Movement n="II" cls="Field report" kind="solid" title="Three more from the same site.">
        <div className="ap-locked">
          {lens === "refuse"
            ? "Still waiting on a working hypothesis. Pick one of the other three above and this opens."
            : "This section follows on from your answer above. Pick one and it will open."}
        </div>
      </Movement>
    );
  }
  const frame = lens;
  return (
    <Movement n="II" cls="Field report" kind="solid" title="Three more from the same site.">
      <p className="ap-lead">
        A second season has produced three further objects. The site director
        has written them up, and she has read your interim report.
      </p>
      {SET_TWO.map((f) => (
        <Find f={f} lens={frame} key={f.id} />
      ))}
      <Question
        text="At least one of these carries no spiral. What is the most likely explanation?"
        options={FOLLOW_UP[frame]}
        value={second}
        onPick={setSecond}
      />
    </Movement>
  );
}

function Three({ lens, second, opened, onOpen }) {
  if (!second) {
    return (
      <Movement n="III" cls="The apparatus" kind="machine" title="Now the machine.">
        <div className="ap-locked">Answer the question above and this opens.</div>
      </Movement>
    );
  }
  const wasRight = lens === "production";
  const others = ["rank", "ritual", "production"].filter((k) => k !== lens);
  const sample = SET_TWO[0];
  return (
    <Movement n="III" cls="The apparatus" kind="machine" title="Now the machine.">
      <p className="ap-lead">
        There is no site. There are no objects. Everything you have just read
        was produced by a small generator running inside this page, and its
        rules fit on a postcard.
      </p>
      {!opened && (
        <button className="ap-btn" onClick={onOpen}>
          Open it
        </button>
      )}
      {opened && (
        <>
          <div className="ap-machine">
            <div className="ap-machine-cap">The rules, in full</div>
            <div className="ap-rules">
              <div>
                <span className="k">workshop</span> = A or B, chosen at random
              </div>
              <div>
                <span className="k">A</span> works in bronze and bone, and
                always cuts the spiral
              </div>
              <div>
                <span className="k">B</span> works in clay and stone, and never
                cuts the spiral
              </div>
              <div>
                <span className="k">form</span>,{" "}
                <span className="k">context</span>,{" "}
                <span className="k">wear</span> = independent, unrelated to
                anything above
              </div>
              <div style={{ color: C.inkFaint, marginTop: "0.5rem" }}>
                {FIND_SPACE.toLocaleString()} possible finds. You were shown
                seven.
              </div>
            </div>
          </div>

          <p style={{ marginTop: "2rem" }}>
            The spiral marks who made the object. That is the whole of its
            meaning. There is no status dimension in the generator and no ritual
            dimension either, because neither was ever written into it.
          </p>

          {wasRight ? (
            <>
              <p>
                <strong>You had it right from the first section.</strong> Now
                look at what happened next, because being right did not protect
                you from anything.
              </p>
              <p>
                The three finds in the second season were written up in the
                language of manufacture, because that is what you had asked for.
                Consistency of cut, alloy, finish. Every sentence of it pushed
                you further towards a conclusion you had already reached, and
                you would have felt the case strengthening.
              </p>
              <p>
                The evidence did not strengthen. Four finds underdetermined the
                question and seven finds underdetermine it in exactly the same
                way. What changed was the vocabulary, and it would have done the
                same work for a wrong answer.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>
                  This is the part to be precise about: you did not reason
                  badly.
                </strong>{" "}
                The evidence supports your reading as well as it supports any
                other, which is what it means for a question to be
                underdetermined. Seven objects and no writing will not settle
                it, and no amount of care would have.
              </p>
              <p>
                What is worth noticing is the second question rather than the
                first. You were asked why one object had no spiral, and you were
                offered three explanations. All three assumed your reading was
                correct and asked only what kind of exception this was. The
                answer that the object simply came out of a different workshop
                was not on the list, and it was never going to be, because you
                had already ruled it out without knowing that is what you were
                doing.
              </p>
            </>
          )}

          <div className="ap-machine">
            <div className="ap-machine-cap">
              Find {sample.id}, described three ways
            </div>
            <div className="ap-sbs">
              <div className="ap-sbs-cell">
                <div className="ap-sbs-lab">What the generator produced</div>
                <p>{describe(sample, "neutral")}</p>
              </div>
              <div className="ap-sbs-cell">
                <div className="ap-sbs-lab">
                  As you were shown it, given your answer
                </div>
                <p>{describe(sample, lens)}</p>
              </div>
              <div className="ap-sbs-cell">
                <div className="ap-sbs-lab">
                  As the {others[0]} reading would have written it
                </div>
                <p>{describe(sample, others[0])}</p>
              </div>
              <div className="ap-sbs-cell">
                <div className="ap-sbs-lab">
                  As the {others[1]} reading would have written it
                </div>
                <p>{describe(sample, others[1])}</p>
              </div>
            </div>
          </div>

          <p style={{ marginTop: "2rem" }}>
            The underlying attributes are identical in all four. Material, mark,
            wear, findspot: nothing moves. What moves is the language wrapped
            around them, and none of these versions contains a false statement.
            Each one selects an emphasis and lets the rest sit quietly.
          </p>
          <p>
            <strong>
              That is a mechanic rather than a trick, and it is one of the most
              useful things a generated world can do.
            </strong>{" "}
            A system that filters what a player sees through what the player has
            already said will produce somebody who grows more confident and no
            more correct, without ever having been lied to once.
          </p>
        </>
      )}
    </Movement>
  );
}

function Four() {
  const [n, setN] = useState(0);
  const wild = useMemo(() => {
    const r = rng(1234 + n * 7);
    return Array.from({ length: 10 }, () => wildName(r));
  }, [n]);
  const tamed = useMemo(() => {
    const r = rng(8888 + n * 13);
    return Array.from({ length: 10 }, () => tamedName(r));
  }, [n]);
  return (
    <Movement
      n="IV"
      cls="The apparatus"
      kind="machine"
      title="Making a lot of things is easy. Making them feel different is not."
    >
      <p className="ap-lead">
        The obvious way to judge a generator is by how much it can produce. By
        that measure the one on the left below is far better than the one on the
        right. It has a bigger alphabet to draw on, longer words, more possible
        combinations, and every single output it has ever made is unique.
      </p>
      <p>
        Read them and see whether that is how it feels. This is the problem the
        designer Kate Compton named: you can serve ten thousand bowls of
        oatmeal, each mathematically distinct from all the others, and every
        person you serve will say they have been given the same thing twice.
      </p>
      <p>
        The number under each heading is worth taking literally. Think of a
        generator as a bag of tiles rather than as a machine: you are not
        writing the words, you are deciding which tiles go in the bag, and then
        reaching in. The count is how many tiles are in there.
      </p>
      <div className="ap-gens">
        <div className="ap-gen wild">
          <h4>Unconstrained</h4>
          <div className="size">about 660 billion possible outputs</div>
          <div className="ap-words">
            {wild.map((w, i) => (
              <div key={i}>{w}</div>
            ))}
          </div>
        </div>
        <div className="ap-gen">
          <h4>Constrained</h4>
          <div className="size">about 5,700 possible outputs</div>
          <div className="ap-words">
            {tamed.map((w, i) => (
              <div key={i}>{w}</div>
            ))}
          </div>
        </div>
      </div>
      <button className="ap-btn" onClick={() => setN((v) => v + 1)}>
        Run them again
      </button>
      <p style={{ marginTop: "2rem" }}>
        The right-hand generator can produce roughly a hundred million times
        fewer things than the left-hand one, and it is the one that reads as a
        language. Its words could belong to the same
        people. You could guess at a plausible new one yourself, which is a sign
        that you have picked up its rules without being told them.
      </p>
      <p>
        The left-hand list has more variety and no character, so its outputs
        blur into one another. Variety and distinctiveness are not the same
        quantity, and past a certain point they pull in opposite directions.
      </p>

      <p style={{ marginTop: "2.4rem" }}>
        This problem has a twin, and between them they define the two ways
        anybody builds a story machine. Both are easier to see as objects on a
        table than as software.
      </p>
      <p>
        The first is a deck of cards. Each card has a scene written on the front
        and a condition on the back saying when it may be played, and the machine
        deals whichever cards are currently legal. The second is not a deck at
        all. It is a board with pieces on it that move according to rules, and
        the story is whatever you find yourself narrating while you watch.
      </p>
      <div className="ap-sbs" style={{ marginTop: "1.2rem" }}>
        <div className="ap-sbs-cell">
          <div className="ap-sbs-lab">Assembled</div>
          <p>
            A person writes fragments and attaches conditions to them. The
            machine works out which fragments are allowed right now and shows
            one. Every word the player reads was written by a human, so the
            quality is whatever that human's quality was.
          </p>
          <p style={{ marginTop: "0.7rem", color: C.inkFaint }}>
            Fails by running out. There is only ever as much content as somebody
            found time to write, and players reach the end of it.
          </p>
        </div>
        <div className="ap-sbs-cell">
          <div className="ap-sbs-lab">Emergent</div>
          <p>
            Nobody writes any story at all. There are things with properties,
            the things interact, and what results is a log of events that a
            person reads a story into. Nobody wrote the sentence about the
            elephant killing the carpenter.
          </p>
          <p style={{ marginTop: "0.7rem", color: C.inkFaint }}>
            Fails by oatmeal. It will produce events for ever, and almost all of
            them are indistinguishable from each other.
          </p>
        </div>
      </div>
      <p style={{ marginTop: "1.6rem" }}>
        Neither failure is a bug to be fixed later. Each is the standing cost of
        the approach, and choosing between them is mostly a decision about which
        problem you would rather spend the next several years on.
      </p>
      <p>
        The generator in the first three sections is the second kind, which is
        why the next section is about the only real defence against oatmeal.
      </p>
    </Movement>
  );
}

function Five() {
  const [on, setOn] = useState({ harmony: false, norepeat: false, openend: false, oneharsh: false });
  const [n, setN] = useState(0);
  const names = useMemo(() => {
    const r = rng(20260731 + n * 31);
    return Array.from({ length: 12 }, () => buildName(r, on));
  }, [on, n]);
  const size = spaceSize(on);
  const count = Object.values(on).filter(Boolean).length;
  return (
    <Movement
      n="V"
      cls="The apparatus"
      kind="machine"
      title="So the design work is deciding what cannot happen."
    >
      <p className="ap-lead">
        Here is the same generator with nothing switched on. It can produce a
        very large number of words and none of them belong together.
      </p>
      <p>
        Underneath are four prohibitions. Each one removes possibilities and
        none of them adds anything at all. Switch them on and watch both numbers
        move: the size of what the generator can produce goes down, and the
        sense that these words come from somewhere goes up.
      </p>
      <div className="ap-gen">
        <h4>{count === 0 ? "No rules" : `${count} prohibition${count > 1 ? "s" : ""} in force`}</h4>
        <div className="size">roughly {size.toLocaleString()} possible outputs</div>
        <div className="ap-words">
          {names.map((w, i) => (
            <div key={i}>{w}</div>
          ))}
        </div>
      </div>
      <div className="ap-toggles">
        {RULES.map((r) => (
          <button
            key={r.id}
            className={`ap-toggle${on[r.id] ? " on" : ""}`}
            onClick={() => setOn((s) => ({ ...s, [r.id]: !s[r.id] }))}
          >
            <span>{r.label}</span>
            <span className="mark">{on[r.id] ? "forbidden" : "allowed"}</span>
          </button>
        ))}
      </div>
      <button className="ap-btn" onClick={() => setN((v) => v + 1)}>
        Generate again
      </button>
      <p style={{ marginTop: "2.2rem" }}>
        Back to the bag. The thing you are actually designing is not any of the
        words that came out of it. It is what is in the bag, and every one of
        those switches takes tiles out. None of them puts any in.
      </p>
      <p>
        Which is the part that takes some getting used to. Adding a rule feels
        like adding something, and it is the opposite: a generator gets better by
        being allowed to do less.
      </p>
      <p>
        <strong style={{ color: C.ink, fontWeight: 400 }}>
          It is worth being clear about what that costs, because this section
          has so far only made one side of the case.
        </strong>{" "}
        Every prohibition you switch on deletes outputs, and some of them were
        good. A rule that forbids a consonant following itself has just removed
        every name that would have been memorable for exactly that reason, and
        it removed them silently, because a generative space gives you no way to
        inspect what is no longer in it.
      </p>
      <p>
        Push it far enough and coherence becomes monotony: a space small enough
        that a reader sees the whole of it and stops looking. There is no formula
        for where that point sits. It is a judgement, made by ear, and it is the
        part of the job that stays a craft.
      </p>
      <p>
        Which is where this joins up with the first three sections. A generated
        culture becomes legible for the same reason a generated language does:
        somebody decided what it would never do. The consistency is the
        signal, and consistency is made of prohibitions.
      </p>
      <p style={{ color: C.inkDim }}>
        The spiral meant something because it was never once cut by the wrong
        workshop.
      </p>
    </Movement>
  );
}


function Six() {
  const [seed, setSeed] = useState(31417);
  const [layer, setLayer] = useState("survives");
  const { events, records } = useMemo(() => simulate(seed), [seed]);

  const gone = ["lost", "unwritten", "absorbed"];
  const surviving = records.filter((r) => !gone.includes(r.fate));
  const written = records.filter((r) => r.fate !== "unwritten" && r.fate !== "absorbed");

  let rows;
  if (layer === "survives") {
    rows = surviving
      .slice()
      .sort((a, b) => a.year - b.year)
      .map((r, i) => ({ key: i, year: r.year, text: r.text, fate: null, gap: false }));
  } else if (layer === "written") {
    rows = written
      .slice()
      .sort((a, b) => a.year - b.year)
      .map((r, i) => ({
        key: i,
        year: r.year,
        text: r.text,
        fate: FATE_LABEL[r.fate],
        flagged: r.fate !== "intact",
        gap: r.fate === "lost",
      }));
  } else {
    rows = events.map((e, i) => {
      const rec = records.find((r) => r.of === i);
      return {
        key: i,
        year: e.year,
        text: e.text,
        fate: rec ? FATE_LABEL[rec.fate] : "never written down",
        flagged: !rec || rec.fate !== "intact",
        gap: false,
      };
    });
  }

  const nUnwritten = records.filter((r) => r.fate === "unwritten").length;
  const nLost = records.filter((r) => r.fate === "lost").length;
  const nWrong = records.filter((r) => r.fate === "misdated" || r.fate === "conflated").length;
  const nAbsorbed = records.filter((r) => r.fate === "absorbed").length;

  return (
    <Movement
      n="VI"
      cls="The apparatus"
      kind="machine"
      title="The machines worth building produce a past, not a plot."
    >
      <p className="ap-lead">
        A plot is a sequence somebody arranged so that it would land. A past is
        a sequence that merely happened, most of which nobody bothered to write
        down, and which reaches you through people who were not trying to help.
      </p>
      <p>
        Generating a plot is difficult and generating a past is not, provided
        you build the right three things. The first is consequence: events have
        to change the state of the world, so that later events can only happen
        because earlier ones did. Without that you get a list, and a list is
        oatmeal with dates on it.
      </p>
      <p>
        The second and third are the losses. A record that captures everything
        is not a record, it is a transcript, and no history has ever been one.
      </p>

      <div className="ap-tabs">
        {[
          ["survives", "What survives"],
          ["written", "What was written"],
          ["happened", "What happened"],
        ].map(([k, label]) => (
          <button
            key={k}
            className={`ap-tab${layer === k ? " on" : ""}`}
            onClick={() => setLayer(k)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ap-chron">
        {rows.map((row) => (
          <div
            className={`ap-entry${row.gap ? " gap" : ""}${row.flagged ? " flagged" : ""}`}
            key={row.key}
          >
            <span className="ap-entry-year">{row.year}</span>
            <span className="ap-entry-text">
              {row.gap ? "[a leaf is missing here]" : row.text}
              {row.fate && <span className="ap-entry-fate">{row.fate}</span>}
            </span>
          </div>
        ))}
      </div>

      <button className="ap-btn" onClick={() => setSeed((v) => v * 7919 % 2147483647)}>
        Generate another century
      </button>

      <p style={{ marginTop: "2.2rem" }}>
        In this run, {nUnwritten} {nUnwritten === 1 ? "event was" : "events were"}{" "}
        never written down at all, {nLost} {nLost === 1 ? "record was" : "records were"}{" "}
        written and then lost, and {nWrong} of what remains is misdated or has
        two separate events fused into one episode
        {nAbsorbed > 0
          ? `, taking ${nAbsorbed} further ${nAbsorbed === 1 ? "event" : "events"} down with it`
          : ""}
        . Every collapse goes unrecorded by construction, because the polity
        that would have written it down is the thing that stopped existing.
      </p>
      <p>
        <strong>
          Nothing in the surviving column is false, and the surviving column is
          not what happened.
        </strong>{" "}
        A reader given only that view will build a perfectly coherent account of
        this century, and it will be wrong in ways nothing available to them can
        expose.
      </p>
      <p>
        Which is the whole of it. The first three sections put you in front of a
        record and let you draw conclusions from it. This section is the other
        side of the same machine: not interpreting a past, but manufacturing one
        with the gaps already in place, so that somebody else can come along
        afterwards and get it wrong in the ordinary way.
      </p>
      <p style={{ color: C.inkDim }}>
        The spiral meant something because it was never once cut by the wrong
        workshop. This century means something because {nUnwritten + nLost} of
        its events are missing from it.
      </p>
      <div className="ap-colophon">The Apparatus · four of six</div>
    </Movement>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

function TheApparatus() {
  const [lens, setLens] = useState(null);
  const [second, setSecond] = useState(null);
  const [opened, setOpened] = useState(false);
  return (
    <div className="ap-root">
      <style>{styles}</style>
      <div className="ap-wrap">
        <header className="ap-mast">
          <p className="ap-eyebrow">Procedural generation · how to grow a story</p>
          <h1>The Apparatus</h1>
          <p className="ap-standfirst">
            Some stories are written and some are grown. This one is going to be
            grown around you first, and explained afterwards.
          </p>
        </header>
        <One lens={lens} setLens={setLens} />
        <Two lens={lens} second={second} setSecond={setSecond} />
        <Three lens={lens} second={second} opened={opened} onOpen={() => setOpened(true)} />
        <Four />
        <Five />
        <Six />
      </div>
    </div>
  );
}

  return TheApparatus;
})();


/* ============================================================
   WhatExists
   ============================================================ */

const WhatExists = (() => {

/* ============================================================
   WHAT EXISTS
   An explainer on designing data schemas. The reader commits
   to a model and the world argues with it.
   ============================================================ */

const C = {
  ground: "#0D1719",
  panel: "#132326",
  panelLift: "#1A2E32",
  slate: "#111C24",
  ink: "#E9E3D5",
  inkDim: "#93A6A8",
  inkFaint: "#5C7073",
  signal: "#F0BE4B",
  signalDim: "#8A7233",
  cool: "#6FB3C0",
  coolDim: "#3C6570",
  rule: "#294044",
  ruleCool: "#2A3B4D",
  warn: "#D98B6B",
};

const styles = `
*, *::before, *::after { box-sizing: border-box; }

.we-root {
  background: ${C.ground}; color: ${C.ink};
  font-family: 'Newsreader', Georgia, serif; font-weight: 300;
  font-size: 19px; line-height: 1.62; padding-bottom: 8rem;
  -webkit-font-smoothing: antialiased;
}
.we-wrap { max-width: 46rem; margin: 0 auto; padding: 0 1.5rem; }

.we-eyebrow {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem;
  letter-spacing: 0.22em; text-transform: uppercase; color: ${C.inkFaint}; margin: 0 0 1.4rem;
}
.we-mast { padding: 7rem 0 4.5rem; }
.we-mast h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 144;
  font-weight: 800; font-size: clamp(3rem, 10vw, 5.2rem);
  line-height: 0.96; letter-spacing: -0.035em; margin: 0 0 1.6rem;
}
.we-standfirst { font-size: clamp(1.05rem, 2.4vw, 1.3rem); max-width: 33rem; margin: 0; }

.we-movement { padding: 4.5rem 0; border-top: 1px solid ${C.rule}; }
.we-rail { display: flex; align-items: baseline; gap: 0.85rem; margin-bottom: 1.9rem; flex-wrap: wrap; }
.we-rail-num { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: ${C.signal}; letter-spacing: 0.1em; }
.we-rail-class {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem;
  letter-spacing: 0.18em; text-transform: uppercase; color: ${C.inkFaint}; padding-bottom: 3px;
}
.we-rail-class.solid { border-bottom: 1px solid ${C.inkFaint}; }
.we-rail-class.dashed { border-bottom: 1px dashed ${C.inkFaint}; }
.we-rail-class.open { border-bottom: none; opacity: 0.6; }

.we-movement h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600; font-size: clamp(1.75rem, 4.6vw, 2.5rem);
  line-height: 1.06; letter-spacing: -0.02em; margin: 0 0 1.5rem;
}
.we-movement p { margin: 0 0 1.25rem; max-width: 40rem; }
.we-movement p.we-lead { font-size: 1.1rem; }
em { font-style: italic; }

/* ---------- the schema panel ---------- */

.we-schema {
  background: ${C.slate}; border: 1px solid ${C.ruleCool};
  border-radius: 2px; padding: 1.3rem 1.35rem; margin: 1.8rem 0;
}
.we-schema-cap {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.63rem;
  letter-spacing: 0.18em; text-transform: uppercase; color: ${C.cool}; margin-bottom: 1rem;
}
.we-ent { margin-bottom: 1.1rem; }
.we-ent:last-child { margin-bottom: 0; }
.we-ent-name {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.86rem;
  color: ${C.ink}; letter-spacing: 0.04em; margin-bottom: 0.35rem;
}
.we-ent-name .tag {
  font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: ${C.signal}; margin-left: 0.6rem;
}
.we-fields { font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem; line-height: 1.85; color: ${C.inkDim}; padding-left: 0.9rem; border-left: 1px solid ${C.ruleCool}; }
.we-fields .new { color: ${C.signal}; }
.we-fields .gone { color: ${C.inkFaint}; text-decoration: line-through; }
.we-fields .note { color: ${C.inkFaint}; }

/* ---------- cases ---------- */

.we-case {
  background: ${C.panel}; border: 1px solid ${C.rule};
  border-left: 2px solid ${C.warn}; border-radius: 2px;
  padding: 1.25rem 1.3rem; margin-top: 1.6rem;
}
.we-case.held { border-left-color: ${C.coolDim}; }
.we-case-who {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.63rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: ${C.warn}; margin-bottom: 0.6rem;
  display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
}
.we-case.held .we-case-who { color: ${C.cool}; }
.we-case-verdict { color: ${C.inkFaint}; letter-spacing: 0.14em; }
.we-case p { font-size: 0.98rem; color: ${C.inkDim}; margin: 0 0 0.8rem; max-width: none; }
.we-case p:last-child { margin-bottom: 0; }
.we-case strong { color: ${C.ink}; font-weight: 400; }

/* ---------- choices ---------- */

.we-q { margin-top: 1.8rem; }
.we-q-text { font-size: 1.02rem; margin: 0 0 1rem; }
.we-opts { display: grid; gap: 0.5rem; }
.we-opt {
  text-align: left; background: transparent; border: 1px solid ${C.rule};
  color: ${C.ink}; font-family: 'Newsreader', Georgia, serif; font-size: 0.97rem;
  font-weight: 300; padding: 0.75rem 1rem; border-radius: 2px; cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;
}
.we-opt:hover { border-color: ${C.signalDim}; background: ${C.panelLift}; }
.we-opt:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 2px; }
.we-opt.chosen { border-color: ${C.signal}; color: ${C.signal}; }
.we-opt.chosen::before { content: "▸ "; }

.we-cost {
  margin-top: 1.2rem; padding-left: 0.9rem; border-left: 1px solid ${C.rule};
  font-size: 0.95rem; color: ${C.inkDim}; max-width: 36rem;
}
.we-cost b { color: ${C.ink}; font-weight: 400; }

.we-btn {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.73rem;
  letter-spacing: 0.13em; text-transform: uppercase; background: transparent;
  color: ${C.signal}; border: 1px solid ${C.signalDim}; padding: 0.62rem 1.15rem;
  cursor: pointer; border-radius: 1px; margin-top: 1.5rem;
}
.we-btn:hover { background: ${C.signalDim}; color: ${C.ground}; }
.we-btn:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 3px; }
.we-btn[disabled] { opacity: 0.35; cursor: default; }
.we-btn[disabled]:hover { background: transparent; color: ${C.signal}; }

.we-locked {
  margin-top: 1.6rem; padding: 1.4rem 1.3rem; border: 1px dashed ${C.rule};
  border-radius: 2px; font-family: 'IBM Plex Mono', monospace; font-size: 0.8rem;
  line-height: 1.9; color: ${C.inkFaint};
}

.we-stores { display: grid; gap: 0.7rem; margin-top: 1.4rem; }
@media (min-width: 680px) { .we-stores { grid-template-columns: repeat(3, 1fr); } }
.we-store { border: 1px solid ${C.ruleCool}; border-radius: 2px; padding: 1rem 1.05rem; }
.we-store h4 {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.65rem; font-weight: 400;
  letter-spacing: 0.15em; text-transform: uppercase; color: ${C.cool}; margin: 0 0 0.55rem;
}
.we-store p { font-size: 0.93rem; color: ${C.inkDim}; margin: 0; max-width: none; }

.we-colophon {
  margin-top: 5rem; padding-top: 1.6rem; border-top: 1px solid ${C.rule};
  font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.1em; text-transform: uppercase; color: ${C.inkFaint};
}

@media (max-width: 560px) {
  .we-root { font-size: 17.5px; }
  .we-mast { padding: 4rem 0 3rem; }
  .we-movement { padding: 3.2rem 0; }
}
`;

/* ============================================================
   COMPONENTS
   ============================================================ */

function Rail({ n, cls, kind }) {
  return (
    <div className="we-rail">
      {n && <span className="we-rail-num">{n}</span>}
      <span className={`we-rail-class ${kind}`}>{cls}</span>
    </div>
  );
}

function Movement({ n, cls, kind, title, children }) {
  return (
    <section className="we-movement">
      <Rail n={n} cls={cls} kind={kind} />
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Choice({ text, options, value, onPick }) {
  return (
    <div className="we-q">
      <p className="we-q-text">{text}</p>
      <div className="we-opts">
        {options.map((o) => (
          <button
            key={o.key}
            className={`we-opt${value === o.key ? " chosen" : ""}`}
            onClick={() => onPick(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Case({ who, held, verdict, children }) {
  return (
    <div className={`we-case${held ? " held" : ""}`}>
      <div className="we-case-who">
        <span>{who}</span>
        {verdict && <span className="we-case-verdict">{verdict}</span>}
      </div>
      {children}
    </div>
  );
}

function Schema({ state }) {
  const { nameShape, nameFix, absenceFix, link, store, timeFix } = state;

  const nameFields = () => {
    // "optional" is a property of a field, not a field of its own.
    if (nameFix === "single") {
      return nameShape === "one"
        ? [["name", ""], ["sort_name", "new"], ["former_names", "new"]]
        : [["full_name", "new"], ["sort_name", "new"], ["former_names", "new"]];
    }
    if (nameFix === "patch") {
      if (nameShape === "one")
        return [["given_name", "new"], ["family_name (optional)", "new"]];
      if (nameShape === "three")
        return [
          ["given_name", ""],
          ["middle_names (optional)", ""],
          ["family_name (optional)", "new"],
        ];
      return [["given_name", ""], ["family_name (optional)", "new"]];
    }
    if (nameShape === "one") return [["name", ""]];
    if (nameShape === "two") return [["given_name", ""], ["family_name", ""]];
    if (nameShape === "three")
      return [["given_name", ""], ["middle_names", ""], ["family_name", ""]];
    return [["name", "note"]];
  };

  const absenceFields = () => {
    if (absenceFix === "status")
      return [
        ["phone", ""],
        ["phone_status", "new"],
      ];
    if (absenceFix === "sentinel")
      return [["phone", ""], ["  // blank means several things", "note"]];
    if (absenceFix === "ask")
      return [["phone", ""], ["  // latest known, if any", "note"]];
    return [["phone", ""]];
  };

  return (
    <div className="we-schema">
      <div className="we-schema-cap">Your model, as it currently stands</div>

      <div className="we-ent">
        <div className="we-ent-name">Person</div>
        <div className="we-fields">
          {nameFields().map(([f, cls], i) => (
            <div key={i} className={cls}>
              {f}
            </div>
          ))}
          {absenceFields().map(([f, cls], i) => (
            <div key={"a" + i} className={cls}>
              {f}
            </div>
          ))}
          {link === 0 && <div>employer <span className="note">→ Organisation</span></div>}
          {link >= 1 && link < 3 && (
            <div className="gone">employer → Organisation</div>
          )}
        </div>
      </div>

      <div className="we-ent">
        <div className="we-ent-name">Organisation</div>
        <div className="we-fields">
          <div>name</div>
          <div>registered_number</div>
        </div>
      </div>

      {absenceFix === "ask" && (
        <div className="we-ent">
          <div className="we-ent-name">
            ContactEnquiry <span className="tag">new table</span>
          </div>
          <div className="we-fields">
            <div className="new">person</div>
            <div className="new">asked_on</div>
            <div className="new">outcome</div>
            <div className="new">value_given</div>
          </div>
        </div>
      )}

      {link >= 1 && (
        <div className="we-ent">
          <div className="we-ent-name">
            {link >= 2 ? "Engagement" : "Person ↔ Organisation"}
            {link >= 2 && <span className="tag">it was a thing all along</span>}
          </div>
          <div className="we-fields">
            <div>person</div>
            <div>organisation</div>
            {link >= 2 && (
              <>
                <div className="new">role</div>
                <div className="new">started_on</div>
                <div className="new">hours_per_week</div>
              </>
            )}
            {timeFix === "history" && <div className="new">ended_on</div>}
            {timeFix === "overwrite" && (
              <div className="note">// previous roles are not kept</div>
            )}
          </div>
        </div>
      )}

      {store && (
        <div className="we-ent">
          <div className="we-ent-name">
            Kept as{" "}
            <span className="tag">
              {store === "relational"
                ? "card indexes · relational"
                : store === "document"
                ? "folders · document"
                : "pins and string · graph"}
            </span>
          </div>
          <div className="we-fields">
            {store === "document" && (
              <div className="note">// Engagement sits inside Person</div>
            )}
            {store === "relational" && (
              <div className="note">// three separate lists, matched up when asked</div>
            )}
            {store === "graph" && (
              <div className="note">// Engagement is the link itself, and carries its own details</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SECTIONS
   ============================================================ */

function One({ state, set }) {
  return (
    <Movement
      n="I"
      cls="Your ruling"
      kind="solid"
      title="Before anything gets built, somebody decides what things there are."
    >
      <p className="we-lead">
        A small charity has asked you to sort out its records. It knows about
        people, and it knows about the organisations those people work for, and
        at the moment all of it is in a spreadsheet that three people edit at
        once.
      </p>
      <p>
        Your job is to write down what exists. Not to describe the world, which
        is what it feels like, but to rule on it. Whatever you write down is
        what the system will be able to say, and everything you leave out will
        be unsayable for as long as the system runs.
      </p>
      <p>Start with something that could not be simpler. How do you store a name?</p>
      <Choice
        text="Pick one."
        options={[
          { key: "one", label: "One field. Just put the whole name in it." },
          { key: "two", label: "Two fields. Given name and family name." },
          { key: "three", label: "Three fields. Given, middle, family." },
        ]}
        value={state.nameShape}
        onPick={(k) => set({ nameShape: k })}
      />
      {state.nameShape && (
        <p className="we-cost">
          {state.nameShape === "one" && (
            <>
              <b>Noted.</b> Almost nobody picks this one, and the reasons are
              real rather than superstitious. Whether they outweigh what it buys
              you is a question for four paragraphs from now.
            </>
          )}
          {state.nameShape === "two" && (
            <>
              <b>Noted.</b> This is what nearly every form you have ever filled
              in does, which is worth knowing but is not by itself an argument.
            </>
          )}
          {state.nameShape === "three" && (
            <>
              <b>Noted.</b> More boxes than most people give themselves, on the
              reasoning that more room handles more of the world.
            </>
          )}
        </p>
      )}
      {state.nameShape && <Schema state={state} />}
    </Movement>
  );
}

function Two({ state, set }) {
  if (!state.nameShape) {
    return (
      <Movement n="II" cls="The world" kind="solid" title="Then somebody walks in.">
        <div className="we-locked">Make a ruling above and this opens.</div>
      </Movement>
    );
  }
  const shape = state.nameShape;
  const one = shape === "one";
  const three = shape === "three";
  const boxes = one ? "one box" : three ? "three boxes" : "two boxes";

  return (
    <Movement n="II" cls="The world" kind="solid" title="Then somebody walks in.">
      <p className="we-lead">
        Four people need to go into the system this week. None of them is
        difficult, unusual or trying to make a point. They are simply people.
      </p>
      {one && (
        <p>
          Your ruling holds two of them without complaint, which is more than
          most schemas manage, and it is worth seeing why before the other two
          arrive.
        </p>
      )}
      {three && (
        <p>
          You have more boxes than most people would have given yourself. Watch
          what that buys.
        </p>
      )}

      <Case
        who="A new volunteer, from Java"
        held={one}
        verdict={one ? "your model holds this" : undefined}
      >
        <p>
          Her name is Sukarti. That is the whole of it. Not a shortening, not a
          first name awaiting a surname. Mononyms are ordinary across much of
          Indonesia and in plenty of other places.
        </p>
        {one && (
          <p>
            <strong>She goes in as Sukarti and nothing objects.</strong> You
            asked for a name and she gave you her name.
          </p>
        )}
        {shape === "two" && (
          <p>
            <strong>
              Your form has a required field she has nothing to put in.
            </strong>
          </p>
        )}
        {three && (
          <p>
            <strong>
              Your form has two fields she has nothing to put in, and one of
              them is required.
            </strong>{" "}
            The extra box did not buy flexibility. It bought another blank.
          </p>
        )}
      </Case>

      <Case
        who="A trustee, originally from Tamil Nadu"
        held={one}
        verdict={one ? "stored correctly" : undefined}
      >
        <p>
          He gives his name as R. Ganesan. The R is his father's given name,
          which functions as an initial and is not a family name at all. His
          own given name is the second part.
        </p>
        {one ? (
          <p>
            <strong>Stored exactly as he wrote it, which is the point.</strong>{" "}
            Nothing has been parsed, so nothing has been parsed wrongly.
          </p>
        ) : (
          <>
            <p>
              Asked for a last name, he does what most people in his position
              do on a form like yours and puts the initial there, because it is
              the only part that resembles one.
            </p>
            <p>
              <strong>
                So the system files him under R and writes to him as Ganesan R.
              </strong>{" "}
              {three
                ? "The third box is empty and has changed nothing, because the assumption underneath all three is that a name comes apart into pieces you can label in advance."
                : "It will also print it on a badge."}
            </p>
          </>
        )}
      </Case>

      <Case who="A donor of eleven years">
        <p>
          She has changed her name. The old one still has to resolve, because
          eleven years of correspondence, gift aid declarations and a legacy
          pledge are attached to it, and a solicitor will one day need to follow
          the thread.
        </p>
        <p>
          <strong>She is not two people, and she is not one row either.</strong>{" "}
          Nothing in your model has anywhere to keep a name that is no longer
          current, and {boxes} did not help with that at all.
        </p>
      </Case>

      {one ? (
        <Case who="The Christmas appeal, and the trustee list">
          <p>
            The fundraiser wants the appeal to open with whatever each person is
            actually called, because it reads as though a human wrote it. From
            your field she has one string per person, and she needs a rule that
            turns a string into a form of address.
          </p>
          <p>
            There is no such rule. Margaret Oyelaran-Whitfield is Margaret. R.
            Ganesan is Ganesan, not R. Sukarti is Sukarti. Jón Sigurðsson is
            Jón. Every one of those is obvious to somebody who knows the
            convention, and not one of them can be worked out from the
            characters in the field.
          </p>
          <p>
            Sorting is the same problem from the other end. Sort the raw string
            and Jón files under J, which is right, and Ganesan files under R,
            which is not. One rule applied evenly to everybody is correct for
            some of these people and wrong for others, and your model has
            nowhere to record which is which.
          </p>
          <p>
            <strong>
              You have not lost any information. You have lost the ability to
              act on it.
            </strong>{" "}
            What somebody is called and how they should be addressed are two
            separate facts about them, and you are storing one.
          </p>
        </Case>
      ) : (
        <Case who="A caseworker in Reykjavík">
          <p>
            Jón Sigurðsson. Sigurðsson is not a family name, it is a statement
            that his father was Sigurður. His sister's is Sigurðardóttir.
          </p>
          <p>
            <strong>
              Sorting Icelanders by that field groups siblings apart and
              strangers together.
            </strong>{" "}
            Icelandic phone books sort by given name for exactly this reason,
            and your model has no way to say that he is one of the people who
            needs sorting differently.
          </p>
        </Case>
      )}

      <p style={{ marginTop: "2rem" }}>
        None of this is exotic. Between them these patterns cover a very large
        number of people, and every one of those people has at some point been
        told by a form that they have filled it in wrongly.
      </p>

      <Choice
        text="What do you do?"
        options={
          one
            ? [
                { key: "single", label: "Keep the single name field, and add a separate sort key and a list of former names." },
                { key: "patch", label: "Split it back out after all. Given and family name, with family name optional." },
                { key: "hold", label: "Leave it. The charity is small and the appeal can be formal." },
              ]
            : three
            ? [
                { key: "patch", label: "Keep the three fields and make family name optional as well." },
                { key: "single", label: "Collapse all three to one name field, plus a separate sort key and a list of former names." },
                { key: "hold", label: "Leave it. These are edge cases and the charity is small." },
              ]
            : [
                { key: "patch", label: "Keep the fields and make family name optional." },
                { key: "single", label: "Collapse to one name field, plus a separate sort key and a list of former names." },
                { key: "hold", label: "Leave it. These are edge cases and the charity is small." },
              ]
        }
        value={state.nameFix}
        onPick={(k) => set({ nameFix: k })}
      />

      {state.nameFix && (
        <p className="we-cost">
          {state.nameFix === "patch" && shape === "two" && (
            <>
              <b>Cheap, and it half works.</b> Sukarti fits now. Ganesan is
              still filed under R, Jón still sorts away from his sister, and the
              donor's old name still has nowhere to live. You have solved the
              case that was easiest to see.
            </>
          )}
          {state.nameFix === "patch" && three && (
            <>
              <b>You now have three boxes, two of them optional, and the same
              assumption underneath.</b>{" "}
              Sukarti fits. Nothing else moved, because the problem was never
              how many parts a name has. It was the belief that the parts can be
              labelled in advance and that everyone uses them the same way.
            </>
          )}
          {state.nameFix === "patch" && one && (
            <>
              <b>You have traded a working model for a familiar one.</b> Sorting
              and salutation get easier, and Ganesan gets filed under R, which
              he was not before. This is the trade almost every system makes,
              usually without noticing there was one.
            </>
          )}
          {state.nameFix === "single" && !one && (
            <>
              <b>The expensive one, and it holds.</b> You have given up the
              convenience of assuming a surname, and bought a model that does
              not have to be apologised for. Note the shape of what replaced it:
              one field for what somebody is called, one for how to sort and
              address them, and one for the names that are no longer current.
              Three facts, not three parts.
            </>
          )}
          {state.nameFix === "single" && one && (
            <>
              <b>You were most of the way there and it still took two more
              fields.</b>{" "}
              One to say how a person should be sorted and addressed, which is a
              separate fact from what they are called, and one to hold names
              that are no longer current. Getting the first ruling right bought
              you a great deal and did not buy you these.
            </>
          )}
          {state.nameFix === "hold" && (
            <>
              <b>A real option, and a defensible one.</b> Every schema excludes
              somebody and no budget is infinite. What it is not is neutral.
              {one
                ? " Nobody is stored wrongly, the donor's history is simply gone, and the appeal goes out formal to two thousand people."
                : " Four people will be entered wrongly, and none of them will be asked whether they minded."}
            </>
          )}
        </p>
      )}
      {state.nameFix && <Schema state={state} />}
    </Movement>
  );
}

function Three({ state, set }) {
  if (!state.nameFix) {
    return (
      <Movement n="III" cls="The world" kind="solid" title="An empty box with four meanings.">
        <div className="we-locked">Deal with the names above and this opens.</div>
      </Movement>
    );
  }
  return (
    <Movement n="III" cls="The world" kind="solid" title="An empty box with four meanings.">
      <p className="we-lead">
        There is a phone number field. For four hundred of the charity's two
        thousand records it is blank.
      </p>
      <p>
        Blank is not one thing. Read what the fundraising team actually did in
        each case and the field turns out to be carrying four completely
        different pieces of information under one appearance.
      </p>

      <Case who="Record 1102">
        <p>
          Nobody has ever asked her. The field is blank because the conversation
          has not happened.
        </p>
      </Case>
      <Case who="Record 1187">
        <p>
          He was asked and said no. That is a decision he made, and calling him
          would be a breach of it.
        </p>
      </Case>
      <Case who="Record 1240">
        <p>
          She has no phone. Asking again next quarter will not change it and
          will be irritating.
        </p>
      </Case>
      <Case who="Record 1355">
        <p>
          There was a number. It has been disconnected for two years and
          somebody deleted it rather than record that fact.
        </p>
      </Case>

      <p style={{ marginTop: "2rem" }}>
        The distinction that matters most is the least visible.{" "}
        <strong style={{ color: C.ink, fontWeight: 400 }}>
          We have not looked and we looked and there is nothing are opposite
          findings, and an empty field renders them identically.
        </strong>{" "}
        One of them is an open question. The other is an answer, and it cost
        somebody a phone call to get.
      </p>

      <Choice
        text="How do you make the difference sayable?"
        options={[
          { key: "sentinel", label: "Agree a convention. Blank means never asked, the word NONE means asked and declined." },
          { key: "status", label: "Add a status field next to it, with the four cases as options." },
          { key: "ask", label: "Record the enquiry itself: when it was asked, and what came back." },
        ]}
        value={state.absenceFix}
        onPick={(k) => set({ absenceFix: k })}
      />
      {state.absenceFix && (
        <p className="we-cost">
          {state.absenceFix === "sentinel" && (
            <>
              <b>Free, and it will not survive contact with staff turnover.</b>{" "}
              The convention lives in somebody's head and in a training document
              nobody reads. Within two years there will be records containing
              the word "none", records containing "n/a", and records containing
              a hyphen.
            </>
          )}
          {state.absenceFix === "status" && (
            <>
              <b>The workable middle.</b> The four cases become sayable and
              queryable, at the cost of a second field that must be kept in step
              with the first, which it will not always be.
            </>
          )}
          {state.absenceFix === "ask" && (
            <>
              <b>The most honest and the most work.</b> You have stopped storing
              a fact and started storing the history of trying to find it out,
              which is what actually happened. Notice what that took: the
              enquiry could not live on the person, because a person can be
              asked more than once and get a different answer each time, so it
              had to become a thing in its own right. It is a third table nobody
              asked you for, and the charity has one part-time administrator.
            </>
          )}
        </p>
      )}
      {state.absenceFix && <Schema state={state} />}
    </Movement>
  );
}

function Four({ state, set }) {
  if (!state.absenceFix) {
    return (
      <Movement n="IV" cls="The world" kind="solid" title="A line between two boxes turns out to be a thing.">
        <div className="we-locked">Settle the blank fields above and this opens.</div>
      </Movement>
    );
  }
  const { link } = state;
  return (
    <Movement n="IV" cls="The world" kind="solid" title="A line between two boxes turns out to be a thing.">
      <p className="we-lead">
        Your model says a person has an employer. It is a single field pointing
        at an organisation, and it is the most natural thing in the world to
        write.
      </p>
      <p>
        Now watch it come apart, one ordinary Tuesday at a time.
      </p>

      <Case who="First">
        <p>
          A caseworker takes a second job with a partner organisation, two days
          a week. Your field holds one value.
        </p>
      </Case>
      {link >= 1 && (
        <Case who="Second">
          <p>
            You have widened it, so a person can now be connected to several
            organisations. Good. The finance officer then asks which of them
            employs her, since one is a paid post and the other is voluntary,
            and she has a start date at each, and a different job title at each.
          </p>
          <p>
            <strong>
              None of that belongs to the person, and none of it belongs to the
              organisation.
            </strong>{" "}
            It belongs to the connection between them, and a connection was not
            something your model said existed.
          </p>
        </Case>
      )}
      {link >= 2 && (
        <Case who="What actually happened">
          <p>
            The line was never a line. There was always a third thing in this
            domain, with its own start, its own terms and its own name, and you
            did not notice because in the diagram it looked like a piece of
            plumbing between two boxes.
          </p>
          <p>
            <strong>
              This is not a tidy-up. It is finding out that engagements exist.
            </strong>{" "}
            Every schema you will ever write has at least one of these hiding in
            it, and you generally meet them at the point where somebody asks a
            question you cannot answer.
          </p>
          {state.absenceFix === "ask" && (
            <p>
              You have already done this once, two sections ago, when the
              enquiry about a phone number turned out to need a table. Same
              move, different corner of the domain. It will keep happening.
            </p>
          )}
        </Case>
      )}

      {link < 2 && (
        <button className="we-btn" onClick={() => set({ link: link + 1 })}>
          {link === 0 ? "Let people have more than one" : "Add the details finance needs"}
        </button>
      )}

      {link >= 2 && (
        <>
          <p style={{ marginTop: "2.2rem" }}>
            Two questions follow immediately, and they are the two that separate
            people who have done this before from people who have not.
          </p>
          <p>
            The first is about time. The caseworker's hours change in April.
          </p>
          <Choice
            text="What happens to the old row?"
            options={[
              { key: "overwrite", label: "Update it. The current position is what the system is for." },
              { key: "history", label: "Close it with an end date and open a new one." },
            ]}
            value={state.timeFix}
            onPick={(k) => set({ timeFix: k })}
          />
          {state.timeFix && (
            <p className="we-cost">
              {state.timeFix === "overwrite" ? (
                <>
                  <b>Simpler, and the past is gone.</b> Next year somebody asks
                  how many hours she worked in March, for a funder's report, and
                  there is no answer anywhere in the system.
                </>
              ) : (
                <>
                  <b>You are now modelling the world changing rather than the
                  world as it is.</b>{" "}
                  Every query gets a little harder because every query has to
                  say when it means. In exchange, the question "what was true in
                  March" becomes answerable at all.
                </>
              )}
            </p>
          )}

          {state.timeFix && (
            <>
              <p style={{ marginTop: "2.2rem" }}>
                The second question decides how all of this is physically kept,
                and it is genuinely a question about the world rather than about
                software.{" "}
                <strong style={{ color: C.ink, fontWeight: 400 }}>
                  Does an engagement exist on its own, or only as part of a
                  person?
                </strong>
              </p>
              <p>
                It is easier to see on paper, so forget computers for a moment.
                The charity has a back room and three ways of arranging it.
              </p>
              <div className="we-stores">
                <div className="we-store">
                  <h4>Three card indexes</h4>
                  <p>
                    One drawer of cards for people, one for organisations, one
                    for engagements. Each engagement card names a person and an
                    organisation. To answer anything you pull cards from more
                    than one drawer and match them up.
                  </p>
                  <p style={{ marginTop: "0.6rem", color: C.inkFaint }}>
                    Nothing sits inside anything else. Every question costs a bit
                    of work and no question is impossible.
                  </p>
                </div>
                <div className="we-store">
                  <h4>A folder per person</h4>
                  <p>
                    One folder for each person, and the engagement is a sheet
                    filed inside it. Everything about somebody is in one place,
                    so anything you want to know about a person takes one folder.
                  </p>
                  <p style={{ marginTop: "0.6rem", color: C.inkFaint }}>
                    Ask who works at one particular organisation and you are
                    opening every folder in the cabinet.
                  </p>
                </div>
                <div className="we-store">
                  <h4>Pins and string</h4>
                  <p>
                    A pin on a board for each person and each organisation, and a
                    length of string between them for each engagement, with the
                    role and the dates written along the string.
                  </p>
                  <p style={{ marginTop: "0.6rem", color: C.inkFaint }}>
                    Following who is connected to whom is trivial. Producing a
                    plain alphabetical list of everybody is oddly awkward.
                  </p>
                </div>
              </div>
              <p style={{ marginTop: "1.5rem" }}>
                Those are the three families of database, and they are usually
                called relational, document and graph. The names matter less than
                what each one has already assumed. Cards say nothing is inside
                anything. Folders say containment is real, because a sheet in
                somebody's folder is part of that person. String says the
                connection is a thing in its own right, with properties of its
                own.
              </p>
              <Choice
                text="Pick one, knowing that you are answering a question about what kind of thing an engagement is."
                options={[
                  { key: "relational", label: "Card indexes. Keep everything separate and match it up when asked." },
                  { key: "document", label: "Folders. An engagement belongs to a person and lives inside them." },
                  { key: "graph", label: "Pins and string. The connection is a thing in its own right." },
                ]}
                value={state.store}
                onPick={(k) => set({ store: k })}
              />
              {state.store && (
                <p className="we-cost">
                  {state.store === "document" && (
                    <>
                      <b>
                        You have committed, in the physical arrangement, to the
                        claim that an engagement has no life of its own.
                      </b>{" "}
                      It is a sheet in somebody's folder, so it goes where they
                      go. Six months from now the funder asks for everyone
                      connected to one organisation, and answering means opening
                      every folder you have.
                    </>
                  )}
                  {state.store === "relational" && (
                    <>
                      <b>You have declined to commit, which is itself a
                      position.</b>{" "}
                      Nothing is inside anything, so nothing is ever cheap and
                      nothing is ever impossible. The arrangement also tells
                      whoever inherits it nothing about what you believed an
                      engagement was.
                    </>
                  )}
                  {state.store === "graph" && (
                    <>
                      <b>
                        You have said the connection is as real as the things it
                        connects.
                      </b>{" "}
                      Anything of the form "who is linked to whom, and how far
                      does that go" becomes easy. Anything of the form "give me
                      everybody in one plain alphabetical list" becomes more
                      work than you would expect.
                    </>
                  )}
                </p>
              )}
            </>
          )}
          <Schema state={state} />
        </>
      )}
    </Movement>
  );
}

function Five({ state, set }) {
  if (!state.store) {
    return (
      <Movement n="V" cls="Still open" kind="open" title="The last one has no right answer.">
        <div className="we-locked">
          Finish the section above and this opens. It does not resolve.
        </div>
      </Movement>
    );
  }
  return (
    <Movement n="V" cls="Still open" kind="open" title="The last one has no right answer.">
      <p className="we-lead">
        One field left. The charity needs to record how each person is connected
        to it, because the trustees have to report on governance and the funder
        wants to know who the work reaches.
      </p>
      <p>
        There are two ways to build a field like this and they are the oldest
        argument in the subject.
      </p>
      <p>
        A fixed list is enforceable. Everyone picks from the same options, the
        options mean the same thing to everybody, and you can count them at the
        end of the year. Free text is expressive. Anyone can say what is
        actually the case, in the words that fit.
      </p>
      <p>
        Here are four people, and they are not awkward. They are Tuesday.
      </p>

      <Case who="A trustee">
        <p>
          She also receives the service. That is a governance fact with legal
          weight, and it is also the single best reason she is on the board.
        </p>
      </Case>
      <Case who="A former beneficiary">
        <p>
          He now runs a peer support group, unpaid, that the charity depends on
          but has never formally constituted.
        </p>
      </Case>
      <Case who="A funder's representative">
        <p>
          She attends board meetings, has no vote, and is not staff, volunteer
          or beneficiary.
        </p>
      </Case>
      <Case who="Someone the charity is not sure about">
        <p>
          He has been coming to the drop-in for a year. Nobody has ever
          established whether he is a service user, and asking directly would
          probably end it.
        </p>
      </Case>

      <Choice
        text="Fixed list or free text?"
        options={[
          { key: "enum", label: "Fixed list. Governance reporting is a legal duty and it has to be countable." },
          { key: "text", label: "Free text. People are more complicated than five options." },
          { key: "both", label: "Both. A fixed list for reporting, and a free text note beside it." },
        ]}
        value={state.listChoice}
        onPick={(k) => set({ listChoice: k })}
      />

      {state.listChoice && (
        <>
          <p className="we-cost">
            {state.listChoice === "enum" && (
              <>
                <b>Who pays:</b> the trustee, who is filed as one thing and is
                two, so the conflict of interest the board is legally obliged to
                manage becomes invisible in its own records. The peer group
                leader, who is filed as a beneficiary and is doing unpaid work
                the charity relies on. And the man at the drop-in, who has to be
                given a category before anyone has asked him.
              </>
            )}
            {state.listChoice === "text" && (
              <>
                <b>Who pays:</b> the trustees, at the point where the annual
                report needs a number and there are four hundred distinct
                strings in the column, eleven of which say "volunteer" with
                different capitalisation. Nobody is excluded and nobody can be
                counted, so the governance duty gets discharged by somebody
                reading four hundred rows and making a judgement.
              </>
            )}
            {state.listChoice === "both" && (
              <>
                <b>Who pays:</b> whoever does data entry, twice, for ever. And
                in practice the note is where the truth goes and the list is
                where the reporting comes from, so the two drift apart and the
                organisation ends up believing the list.
              </>
            )}
          </p>

          <p style={{ marginTop: "2.4rem" }}>
            There is no fourth option and the section does not resolve, because
            the domain genuinely does not contain an answer. Some part of what
            these four people are will not survive being written down, and you
            are the one deciding which part.
          </p>
          <p>
            That is the whole job, and it is why it is worth doing carefully. A
            schema is not a description of the world. It is a ruling about what
            the world is permitted to contain, made in advance, by somebody who
            has not met most of the people it will be applied to.
          </p>
          <p style={{ color: C.inkDim }}>
            Everybody who fills in the form afterwards is living inside a
            decision you made on a Tuesday.
          </p>
          <Schema state={state} />
        </>
      )}
      <div className="we-colophon">What Exists · five of six</div>
    </Movement>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

function WhatExists() {
  const [state, setState] = useState({
    nameShape: null,
    nameFix: null,
    absenceFix: null,
    link: 0,
    store: null,
    timeFix: null,
    listChoice: null,
  });
  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  return (
    <div className="we-root">
      <style>{styles}</style>
      <div className="we-wrap">
        <header className="we-mast">
          <p className="we-eyebrow">Data schemas · deciding what there is</p>
          <h1>What Exists</h1>
          <p className="we-standfirst">
            Somebody has to write down what kinds of thing there are before
            anything can be built. It sounds administrative. It is the part
            where people get left out.
          </p>
        </header>
        <One state={state} set={set} />
        <Two state={state} set={set} />
        <Three state={state} set={set} />
        <Four state={state} set={set} />
        <Five state={state} set={set} />
      </div>
    </div>
  );
}

  return WhatExists;
})();


/* ============================================================
   TheOlderLayer
   ============================================================ */

const OlderLayer = (() => {

/* ============================================================
   THE OLDER LAYER
   An explainer on comparative mythology. One text at a time,
   read downwards. The method is established on Gilgamesh
   before it is pointed anywhere that anybody still prays to.
   ============================================================ */

const C = {
  ground: "#0D1719",
  panel: "#132326",
  panelLift: "#1A2E32",
  dig: "#101A1E",
  ink: "#E9E3D5",
  inkDim: "#93A6A8",
  inkFaint: "#5C7073",
  signal: "#F0BE4B",
  signalDim: "#8A7233",
  cool: "#6FB3C0",
  coolDim: "#3C6570",
  deep: "#B98CC4",
  deepDim: "#5D4468",
  rule: "#294044",
};

const styles = `
*, *::before, *::after { box-sizing: border-box; }

.ol-root {
  background: ${C.ground}; color: ${C.ink};
  font-family: 'Newsreader', Georgia, serif; font-weight: 300;
  font-size: 19px; line-height: 1.62; padding-bottom: 8rem;
  -webkit-font-smoothing: antialiased;
}
.ol-wrap { max-width: 46rem; margin: 0 auto; padding: 0 1.5rem; }

.ol-eyebrow {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem;
  letter-spacing: 0.22em; text-transform: uppercase; color: ${C.inkFaint}; margin: 0 0 1.4rem;
}
.ol-mast { padding: 7rem 0 4.5rem; }
.ol-mast h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 144;
  font-weight: 800; font-size: clamp(2.9rem, 9.5vw, 5rem);
  line-height: 0.96; letter-spacing: -0.035em; margin: 0 0 1.6rem;
}
.ol-standfirst { font-size: clamp(1.05rem, 2.4vw, 1.3rem); max-width: 34rem; margin: 0; }

.ol-movement { padding: 4.5rem 0; border-top: 1px solid ${C.rule}; }
.ol-rail { display: flex; align-items: baseline; gap: 0.85rem; margin-bottom: 1.9rem; flex-wrap: wrap; }
.ol-rail-num { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; color: ${C.signal}; letter-spacing: 0.1em; }
.ol-rail-class {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem;
  letter-spacing: 0.18em; text-transform: uppercase; color: ${C.inkFaint}; padding-bottom: 3px;
}
.ol-rail-class.solid { border-bottom: 1px solid ${C.inkFaint}; }
.ol-rail-class.dashed { border-bottom: 1px dashed ${C.inkFaint}; }
.ol-rail-class.deep { border-bottom: 1px solid ${C.deepDim}; color: ${C.deep}; }

.ol-movement h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 100;
  font-weight: 600; font-size: clamp(1.75rem, 4.6vw, 2.5rem);
  line-height: 1.06; letter-spacing: -0.02em; margin: 0 0 1.5rem;
}
.ol-movement p { margin: 0 0 1.25rem; max-width: 40rem; }
.ol-movement p.ol-lead { font-size: 1.1rem; }
em { font-style: italic; }
.ol-term { font-family: 'IBM Plex Mono', monospace; font-size: 0.92em; color: ${C.cool}; }

/* ---------- the dig ---------- */

.ol-dig { background: ${C.dig}; border: 1px solid ${C.rule}; border-radius: 2px; padding: 1.4rem 1.35rem; margin: 1.9rem 0; }
.ol-dig-cap {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.63rem;
  letter-spacing: 0.18em; text-transform: uppercase; color: ${C.inkFaint}; margin-bottom: 1rem;
}
.ol-depths { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.3rem; }
.ol-depth {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem;
  letter-spacing: 0.12em; text-transform: uppercase; background: transparent;
  border: 1px solid ${C.rule}; color: ${C.inkDim}; padding: 0.48rem 0.85rem;
  border-radius: 1px; cursor: pointer;
}
.ol-depth:hover { background: ${C.panelLift}; }
.ol-depth:focus-visible { outline: 2px solid ${C.cool}; outline-offset: 2px; }
.ol-depth.on { border-color: ${C.deepDim}; color: ${C.deep}; }

.ol-line {
  display: grid; grid-template-columns: 1.9rem 1fr; gap: 0.9rem;
  padding: 0.5rem 0; border-bottom: 1px solid ${C.rule}; align-items: baseline;
}
.ol-line:last-child { border-bottom: none; }
.ol-line-n { font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; color: ${C.inkFaint}; }
.ol-line-t { font-size: 0.97rem; color: ${C.ink}; }
.ol-line-note {
  display: block; margin-top: 0.35rem; font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem; line-height: 1.7; letter-spacing: 0.02em; color: ${C.cool};
}
.ol-line.later .ol-line-t { color: ${C.signal}; }
.ol-line.later .ol-line-note { color: ${C.signalDim}; }
.ol-line.older .ol-line-t { color: ${C.deep}; }
.ol-line.older .ol-line-note { color: ${C.deepDim}; }

.ol-key {
  display: flex; gap: 1.2rem; flex-wrap: wrap; margin-top: 1.1rem;
  font-family: 'IBM Plex Mono', monospace; font-size: 0.63rem;
  letter-spacing: 0.13em; text-transform: uppercase; color: ${C.inkFaint};
}
.ol-key .sw { display: inline-block; width: 0.6rem; height: 0.6rem; margin-right: 0.4rem; }

/* ---------- cases ---------- */

.ol-case {
  background: ${C.panel}; border: 1px solid ${C.rule};
  border-left: 2px solid ${C.coolDim}; border-radius: 2px;
  padding: 1.25rem 1.3rem; margin-top: 1.3rem;
}
.ol-case-who {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.63rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: ${C.cool}; margin-bottom: 0.6rem;
}
.ol-case h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 0, 'WONK' 1, 'opsz' 40;
  font-weight: 600; font-size: 1.18rem; line-height: 1.2; margin: 0 0 0.65rem; letter-spacing: -0.01em;
}
.ol-case p { font-size: 0.97rem; color: ${C.inkDim}; margin: 0 0 0.8rem; max-width: none; }
.ol-case p:last-child { margin-bottom: 0; }
.ol-case strong { color: ${C.ink}; font-weight: 400; }

/* ---------- cognates ---------- */

.ol-cog { margin-top: 1.5rem; border-top: 1px solid ${C.rule}; }
.ol-cog-row {
  display: grid; grid-template-columns: 9.5rem 1fr; gap: 1rem;
  padding: 0.5rem 0; border-bottom: 1px solid ${C.rule}; align-items: baseline;
}
.ol-cog-lang { font-family: 'IBM Plex Mono', monospace; font-size: 0.74rem; color: ${C.inkDim}; }
.ol-cog-form { font-family: 'IBM Plex Mono', monospace; font-size: 1.02rem; color: ${C.ink}; }
.ol-cog-row.proto { border-bottom: none; margin-top: 0.6rem; padding-top: 0.8rem; border-top: 1px dashed ${C.rule}; }
.ol-cog-row.proto .ol-cog-form, .ol-cog-row.proto .ol-cog-lang { color: ${C.deep}; }
.ol-cog-gloss { font-size: 0.86rem; color: ${C.inkFaint}; margin-left: 0.6rem; }

.ol-note {
  font-size: 0.94rem; color: ${C.inkDim}; margin: 1.5rem 0 0;
  padding-left: 0.9rem; border-left: 1px solid ${C.rule}; max-width: 36rem;
}
.ol-colophon {
  margin-top: 5rem; padding-top: 1.6rem; border-top: 1px solid ${C.rule};
  font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.1em; text-transform: uppercase; color: ${C.inkFaint};
}

@media (max-width: 560px) {
  .ol-root { font-size: 17.5px; }
  .ol-mast { padding: 4rem 0 3rem; }
  .ol-movement { padding: 3.2rem 0; }
  .ol-cog-row { grid-template-columns: 7rem 1fr; gap: 0.7rem; }
}
`;

/* ============================================================
   DIGS
   Each line has a layer. Depth controls how much is visible.
   ============================================================ */

const GILGAMESH = {
  caption: "The Epic of Gilgamesh · the version most people read",
  depths: ["As received", "The hands", "What is underneath"],
  key: [
    ["later", C.signal, "added late"],
    ["older", C.deep, "older material"],
  ],
  lines: [
    {
      t: "Tablet I. Gilgamesh, king of Uruk, oppresses his people. The gods make Enkidu to match him.",
      layer: null,
      notes: [
        null,
        "The standard version opens by praising the king as one who saw the deep and came back wise. An earlier Babylonian version opened by simply calling him the greatest of kings. Somebody rewrote the first line to be about knowledge rather than status.",
        "Behind both sit five separate Sumerian poems about a king called Bilgames, circulating some three centuries earlier and never as one story.",
      ],
    },
    {
      t: "Tablets II to VI. The two become friends, kill the forest guardian Humbaba, and refuse the goddess Ishtar.",
      layer: null,
      notes: [null, null, "The Humbaba expedition exists as its own Sumerian poem, complete in itself and with a different ending."],
    },
    {
      t: "Tablets VII and VIII. Enkidu sickens and dies. Gilgamesh will not leave the body.",
      layer: null,
      notes: [null, null, null],
    },
    {
      t: "Tablets IX to X. Gilgamesh goes looking for the one man who never died.",
      layer: null,
      notes: [null, null, null],
    },
    {
      t: "Tablet XI. Utnapishtim describes the flood: the boat, the animals, the birds sent out to find land, the sacrifice afterwards.",
      layer: "later",
      notes: [
        null,
        "This is a separate composition. Nearly all of it corresponds to a Babylonian poem about Atrahasis, which exists on its own tablets and is not about Gilgamesh at all.",
        "So the most famous passage in the epic is an insertion, and it was already old when it was inserted.",
      ],
    },
    {
      t: "Tablet XII. Enkidu goes down to the underworld and describes what he finds there.",
      layer: "later",
      notes: [
        null,
        "Enkidu died four tablets ago and is alive again here, with no explanation offered.",
        "Because tablet XII is a partial translation of one of the old Sumerian poems, appended to the end without being fitted to the story. The seam is not a theory. It is a contradiction sitting in the text.",
      ],
    },
  ],
};

const DEUT = {
  caption: "Deuteronomy 32, verses 8 and 9 · a passage that exists in two forms",
  depths: ["As received", "The manuscripts", "What follows from it"],
  key: [
    ["later", C.signal, "the reading that circulated"],
    ["older", C.deep, "the older reading"],
  ],
  lines: [
    {
      t: "When the Most High divided up the nations and separated humankind, he fixed the boundaries of the peoples.",
      layer: null,
      notes: [null, "Uncontroversial, and identical in every manuscript.", null],
    },
    {
      t: "He fixed them according to the number of the sons of Israel.",
      layer: "later",
      notes: [
        null,
        "This is the reading in the medieval Hebrew manuscripts that most translations follow.",
        "It is also slightly odd: the number of the sons of Israel has nothing obvious to do with the number of nations.",
      ],
    },
    {
      t: "He fixed them according to the number of the sons of God.",
      layer: "older",
      notes: [
        null,
        "This is the reading in a Dead Sea Scrolls fragment of Deuteronomy, and it agrees with the ancient Greek translation, which has divine beings here rather than Israelites. Two independent witnesses, both older than the manuscripts behind the other version.",
        "Read this way, the nations are distributed among divine beings, one each.",
      ],
    },
    {
      t: "For the LORD's own portion is his people, and Jacob is his allotted share.",
      layer: null,
      notes: [
        null,
        "Unchanged in all versions, and this is the line that makes the passage interesting.",
        "With the older reading above it, the sense is that the Most High allots the nations among divine beings, and the one who receives Israel is Yahweh. The passage describes an assembly of gods with a portion each, and the God of Israel receiving his.",
      ],
    },
  ],
};

const PRESERVED = [
  {
    who: "An inscription on a storage jar",
    title: "Yahweh, and his asherah",
    layers: [
      {
        label: "What was found",
        body: (
          <>
            <p>
              Kuntillet Ajrud is a waystation in the Sinai desert. Travellers
              passing through around the eighth century BC wrote blessings on
              the plaster and on the large storage jars, in the ordinary way
              that people wrote blessings.
            </p>
            <p>
              Several of them invoke Yahweh, identified by locality as gods were
              then, and add three further words:{" "}
              <span className="ol-term">and his asherah</span>.
            </p>
            <p>
              Separately, the Hebrew Bible instructs its readers, repeatedly and
              at length, to cut down and burn asherahs.
            </p>
          </>
        ),
      },
      {
        label: "What follows",
        body: (
          <>
            <p>
              Asherah is a goddess known independently from tablets found on the
              Syrian coast, where she is the consort of the high god El. The same
              word is also used in the Bible for a wooden cult object, so
              scholars argue about which is meant on the jars, and that argument
              is live and unresolved.
            </p>
            <p>
              <strong>The direction of the other evidence is not in doubt.</strong>{" "}
              Nobody legislates against a practice that nobody is engaged in.
              Instructions to destroy a thing are issued because the thing is
              there, in quantity, and shows no sign of going away.
            </p>
            <p>
              So the prohibition is a description. The text that wants asherahs
              gone is among the better records that they were widespread.
            </p>
          </>
        ),
      },
    ],
  },
  {
    who: "An epithet that changed owner",
    title: "The one who rides on the clouds",
    layers: [
      {
        label: "What was found",
        body: (
          <>
            <p>
              A French excavation on the Syrian coast in 1928 turned up the
              archives of a city called Ugarit, written some centuries before
              most of the Hebrew Bible and in a closely related language.
            </p>
            <p>
              The tablets describe a storm god, Baal, and give him a set of
              standing epithets that recur wherever he appears. One of them
              calls him the one who rides on the clouds.
            </p>
            <p>
              The same phrase turns up in the Psalms, applied to Yahweh.
            </p>
          </>
        ),
      },
      {
        label: "What follows",
        body: (
          <>
            <p>
              The literature in which it appears is elsewhere about as hostile to
              Baal as a literature can be. This is not a borrowing anybody would
              have admitted to.
            </p>
            <p>
              <strong>
                Poetic formulae are stickier than the theology attached to them.
              </strong>{" "}
              A phrase that scans well and sounds right gets used, and it can
              cross from one god to a rival god carried by people who would have
              been appalled to be told whose line they were reciting.
            </p>
            <p>
              Which makes fixed phrases some of the most reliable evidence going.
              They survive precisely because nobody is paying attention to them.
            </p>
          </>
        ),
      },
    ],
  },
  {
    who: "A religion preserved by its opponents",
    title: "Almost everything known about the Manichaeans",
    layers: [
      {
        label: "What was found",
        body: (
          <>
            <p>
              Manichaeism was for several centuries a genuinely intercontinental
              religion, running from the western Mediterranean to China, and its
              own scriptures were destroyed with unusual thoroughness.
            </p>
            <p>
              For most of history, what survived came through the people
              suppressing it. Christian bishops quoted passages in order to
              refute them. Muslim heresiographers catalogued the beliefs in order
              to classify the error precisely.
            </p>
          </>
        ),
      },
      {
        label: "What follows",
        body: (
          <>
            <p>
              <strong>
                Refutation requires accurate quotation, or the refutation misses.
              </strong>{" "}
              An opponent who paraphrases loosely can be told he is attacking
              something nobody believes, which is fatal to the argument. The
              incentive runs towards getting it right.
            </p>
            <p>
              That is a claim you would want to test rather than assume, and it
              was testable. Manuscript finds in Egypt and along the Silk Road
              during the twentieth century finally supplied Manichaean texts
              directly, which allowed the hostile summaries to be checked against
              the real thing.
            </p>
            <p>
              They came out of it reasonably well. Not perfectly, and better than
              their authors deserved.
            </p>
          </>
        ),
      },
    ],
  },
];

const ENEMIES = [
  {
    who: "Gaul · first century BC",
    title: "A general describing what he is conquering",
    layers: [
      {
        label: "What he wrote",
        body: (
          <>
            <p>
              A large share of everything known about Gaulish religion comes
              from Julius Caesar's account of his own campaigns, written for
              readers in Rome whose support he needed.
            </p>
            <p>
              He describes the druids at some length: how long the training
              took, the authority they held in disputes, the rites he presents
              as barbaric. He then lists the gods. The Gauls, he says, worship
              Mercury above all, and after him Apollo, Mars, Jupiter and
              Minerva.
            </p>
          </>
        ),
      },
      {
        label: "What we get from it",
        body: (
          <>
            <p>
              <strong>Those are not their names, and Caesar knew it.</strong> He
              is translating, in the ordinary Roman way, by identifying a
              foreign god with whichever domestic one does the same job.
            </p>
            <p>
              So the account tells us what functions Gaulish gods were thought
              to perform, expressed in the categories of a different pantheon,
              and loses almost every name they were actually called by. Where
              inscriptions have since supplied real Gaulish names, they do not
              map onto his list neatly.
            </p>
            <p>
              The information is real. It has simply been passed through a grid
              that was not built for it, and the grid is now inseparable from the
              data.
            </p>
          </>
        ),
      },
    ],
  },
  {
    who: "Mexico · sixteenth century",
    title: "A friar compiling in order to extirpate",
    layers: [
      {
        label: "What he made",
        body: (
          <>
            <p>
              Bernardino de Sahagún spent decades working with Nahua elders and
              with trained Nahua assistants to compile an enormous encyclopaedia
              of Aztec life, in Nahuatl and Spanish, covering the calendar, the
              rhetoric, the trades and the religion in great detail.
            </p>
            <p>
              He was entirely open about why. A physician has to know the
              disease before he can treat it, and missionaries could not root out
              practices they were unable to recognise.
            </p>
          </>
        ),
      },
      {
        label: "What we get from it",
        body: (
          <>
            <p>
              <strong>
                It is the richest source on Aztec religion in existence, and it
                was made by somebody who wanted that religion to end.
              </strong>
            </p>
            <p>
              It also rests on testimony from people who had watched their world
              destroyed within living memory, given to a member of the order
              doing the destroying. Every informant had reason to consider
              carefully what to volunteer and what to leave out, and none of
              those calculations is recorded anywhere.
            </p>
            <p>
              The material is indispensable and it is not neutral, and those two
              facts have to be held at the same time by anybody using it.
            </p>
          </>
        ),
      },
    ],
  },
  {
    who: "Iceland · thirteenth century",
    title: "A Christian politician explaining the old gods",
    layers: [
      {
        label: "What he wrote",
        body: (
          <>
            <p>
              Most of what is known about Norse mythology comes from Snorri
              Sturluson, writing roughly two centuries after Iceland converted.
              He was a Christian, a lawyer and a formidable political operator,
              and his handbook exists so that poets could go on using the
              traditional imagery without losing the key to it.
            </p>
            <p>
              His prologue explains that the gods were never gods. They were men,
              refugees out of Troy, whose descendants travelled north and were
              taken for divine by the people they found there.
            </p>
          </>
        ),
      },
      {
        label: "What we get from it",
        body: (
          <>
            <p>
              <strong>
                That prologue is a solution to Snorri's problem rather than a
                piece of tradition.
              </strong>{" "}
              It let a Christian write down a pagan cosmology in detail without
              appearing to endorse any of it, which is presumably the only way
              the material was going to get written down at all.
            </p>
            <p>
              It also puts Odin's family into exactly the story the Franks had
              claimed for themselves three centuries earlier, and the Romans
              before them. Troy was the standard explanation for where a people
              came from, available off the shelf across the whole of Latin
              Europe.
            </p>
            <p>
              So the frame is borrowed, the contents are not, and separating the
              two is most of the work.
            </p>
          </>
        ),
      },
    ],
  },
];

const SKY = [
  ["Vedic Sanskrit", "Dyáuṣ Pitā́", "sky father"],
  ["Greek", "Zeù Páter", "vocative, father Zeus"],
  ["Latin", "Iūpiter", "from an older Diēspiter"],
  ["Umbrian", "Iupater", ""],
  ["Illyrian", "Dei-pátrous", ""],
];

const UNDERNEATH = [
  {
    who: "Ireland",
    title: "The people who went under the hills",
    layers: [
      {
        label: "What they said",
        body: (
          <p>
            Irish tradition describes a sequence of peoples arriving on the
            island, each displacing the last. The Tuatha Dé Danann are defeated
            by the final wave and withdraw, not overseas but downwards, into the
            mounds. They are still there, they are called the folk of the hills,
            and it is well understood that you do not annoy them.
          </p>
        ),
      },
      {
        label: "What was there",
        body: (
          <p>
            The mounds are real, and they are neolithic. Newgrange was already
            three thousand years old when these stories were being told, built
            by people who had left no name, no language and no successors anybody
            could point to. An earlier population that went into the ground is a
            reasonable reading of a landscape full of enormous graves nobody
            could account for.
          </p>
        ),
      },
    ],
  },
  {
    who: "England",
    title: "The old work of giants",
    layers: [
      {
        label: "What they said",
        body: (
          <p>
            An Old English poem stands in front of a ruined city of worked
            stone, with towers and roofs and baths that ran hot, and describes it
            as the work of giants, fallen now, its builders long in the earth.
          </p>
        ),
      },
      {
        label: "What was there",
        body: (
          <p>
            The ruins were Roman. Nobody in tenth-century England could build in
            that manner or knew anybody who could, and there was no available
            account of who had. A larger and stronger race of men, since departed,
            explains the evidence with the resources to hand, and it is not
            obvious what a better answer would have looked like from there.
          </p>
        ),
      },
    ],
  },
  {
    who: "Hawai‘i",
    title: "The ones who worked at night",
    layers: [
      {
        label: "What they said",
        body: (
          <p>
            The menehune are a small people who were on the islands before the
            Hawaiians. They work only after dark and only in one night, so a
            fishpond or a watercourse that took them longer than that was
            abandoned unfinished, and several are pointed out as such.
          </p>
        ),
      },
      {
        label: "What was there",
        body: (
          <p>
            A number of the structures attributed to them exist and are
            substantially older than the surrounding settlement, and they
            represent a serious quantity of coordinated labour. A watercourse
            that nobody remembers digging needs an explanation, and the
            explanation offered is unusually specific about the workforce.
          </p>
        ),
      },
    ],
  },
  {
    who: "The Andes",
    title: "The builders of the towers",
    layers: [
      {
        label: "What they said",
        body: (
          <p>
            Aymara and Quechua traditions describe the chullpas: an earlier
            people who lived before the present sun rose, in dimmer light, and
            who were destroyed when it did. Their name is also the name given to
            the stone tower tombs that stand across the altiplano.
          </p>
        ),
      },
      {
        label: "What was there",
        body: (
          <p>
            The towers predate the Inca and were raised by populations whose own
            account of themselves has not survived in any form. What remains is
            the architecture, standing in open country, obviously deliberate and
            obviously not recent, with nobody left to ask.
          </p>
        ),
      },
    ],
  },
];

/* ============================================================
   COMPONENTS
   ============================================================ */

function Rail({ n, cls, kind }) {
  return (
    <div className="ol-rail">
      {n && <span className="ol-rail-num">{n}</span>}
      <span className={`ol-rail-class ${kind}`}>{cls}</span>
    </div>
  );
}

function Movement({ n, cls, kind, title, children }) {
  return (
    <section className="ol-movement">
      <Rail n={n} cls={cls} kind={kind} />
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Dig({ data }) {
  const [d, setD] = useState(0);
  return (
    <div className="ol-dig">
      <div className="ol-dig-cap">{data.caption}</div>
      <div className="ol-depths">
        {data.depths.map((label, i) => (
          <button
            key={label}
            className={`ol-depth${d === i ? " on" : ""}`}
            onClick={() => setD(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {data.lines.map((l, i) => {
        const note = l.notes[d];
        const layerOn = d > 0 && l.layer;
        return (
          <div className={`ol-line${layerOn ? " " + l.layer : ""}`} key={i}>
            <span className="ol-line-n">{i + 1}</span>
            <span className="ol-line-t">
              {l.t}
              {note && <span className="ol-line-note">{note}</span>}
            </span>
          </div>
        );
      })}
      {d > 0 && (
        <div className="ol-key">
          {data.key.map(([k, col, label]) => (
            <span key={k}>
              <span className="sw" style={{ background: col }} />
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// A case with strata: the evidence first, then what follows from it.
function CaseDig({ item }) {
  const [d, setD] = useState(0);
  const layer = item.layers[d];
  return (
    <div className="ol-case">
      <div className="ol-case-who">{item.who}</div>
      <h3>{item.title}</h3>
      <div className="ol-depths" style={{ marginBottom: "1rem" }}>
        {item.layers.map((l, i) => (
          <button
            key={l.label}
            className={`ol-depth${d === i ? " on" : ""}`}
            onClick={() => setD(i)}
          >
            {l.label}
          </button>
        ))}
      </div>
      {layer.body}
    </div>
  );
}

/* ============================================================
   SECTIONS
   ============================================================ */

function One() {
  return (
    <Movement
      n="I"
      cls="Method"
      kind="solid"
      title="A text is not a thing. It is a stack of things."
    >
      <p className="ol-lead">
        When a story is written down, copied, added to and copied again over
        centuries, the result is a single object that reads as though one person
        made it. It was not. Under the surface there are earlier versions,
        insertions, and material that came in from somewhere else entirely.
      </p>
      <p>
        Usually that has to be argued for. Occasionally the seams are visible to
        anybody who looks, which makes it a good place to learn what looking
        involves.
      </p>
      <p>
        The Epic of Gilgamesh is the best-preserved long poem from the ancient
        Near East and it survives in several versions across roughly a thousand
        years. Use the controls to go down through it.
      </p>
      <Dig data={GILGAMESH} />
      <p className="ol-note">
        Nothing there is speculation. There are physical tablets carrying the
        Sumerian poems, physical tablets carrying the Atrahasis flood, and a
        final tablet in which a character who has been dead for four tablets is
        walking around. The strata are objects, not readings.
      </p>
    </Movement>
  );
}

function Two() {
  return (
    <Movement
      n="II"
      cls="Method"
      kind="solid"
      title="Sometimes both layers survived, and you can compare them."
    >
      <p className="ol-lead">
        The Gilgamesh case works because different versions were written on
        different tablets and buried in different places. The same thing happens
        with texts that stayed in continuous use, and there the evidence takes a
        different form: manuscripts that disagree.
      </p>
      <p>
        Deuteronomy 32 contains a short passage about how the world's peoples
        were divided up. It exists in two forms, and the difference is one
        phrase. What is presented below is a description of the passage rather
        than any translation of it, and the point at issue is a matter of
        manuscript evidence rather than of interpretation.
      </p>
      <Dig data={DEUT} />
      <p className="ol-note">
        Reasonable people read this differently, and the scholarship on it is
        extensive and not settled. What is not in dispute is the manuscript
        situation: two ancient witnesses carry one phrase, later manuscripts
        carry another, and the older reading is the more difficult one, which is
        generally taken as a sign of age rather than of error.
      </p>
    </Movement>
  );
}

function Three() {
  return (
    <Movement
      n="III"
      cls="Inadvertent"
      kind="dashed"
      title="An argument against something is a description of it."
    >
      <p className="ol-lead">
        This is the most productive rule in the subject, and it is almost
        embarrassingly simple. You cannot tell people to stop doing something
        without saying what it is. You cannot refute a belief without stating
        it. So a hostile source is, structurally, a source.
      </p>
      <p>
        Which means the surviving record of a practice is very often produced by
        the people who wanted it stopped, and is frequently the only record
        there is.
      </p>
      <p>
        Three of them below. Each opens on what was actually found, and the
        second step is what follows from it.
      </p>
      {PRESERVED.map((c, i) => (
        <CaseDig item={c} key={i} />
      ))}
    </Movement>
  );
}

function Four() {
  return (
    <Movement
      n="IV"
      cls="Inadvertent"
      kind="dashed"
      title="And sometimes the only witness is the other side."
    >
      <p className="ol-lead">
        The previous section dealt with traditions arguing with themselves. This
        one is harder. There are whole religions for which no follower ever
        wrote a surviving account, and everything known about them comes from
        somebody who arrived from outside.
      </p>
      <p>
        That is not the same as the record being worthless. It does mean the
        record has a shape, and the shape belongs to the writer rather than to
        the subject. Read what each of them wrote, then go down a step to what
        can be got out of it.
      </p>
      {ENEMIES.map((c, i) => (
        <CaseDig item={c} key={i} />
      ))}
      <p className="ol-note">
        Three writers, three purposes, and the same structural fact underneath.
        Each of them was working against the thing he was recording, and each of
        them is now indispensable, which is why the discipline spends so much of
        its time working out what a source was for.
      </p>
    </Movement>
  );
}

function Five() {
  const [shown, setShown] = useState(false);
  return (
    <Movement
      n="V"
      cls="Reconstructed"
      kind="deep"
      title="Some of them are cousins, and the family can be proved."
    >
      <p className="ol-lead">
        Everything so far has worked downwards through one tradition at a time.
        There is a second method that works sideways, and it is the reason this
        subject is a subject rather than a collection of resemblances.
      </p>
      <p>
        Similar stories in different places prove nothing on their own. People
        everywhere have floods, tricksters and dead relatives, and inferring
        contact from that is how the field embarrassed itself for most of the
        nineteenth century.
      </p>
      <p>
        What does prove something is a name that behaves like ordinary
        vocabulary. Take a word nobody argues about. Latin{" "}
        <span className="ol-term">pater</span> turns up as French{" "}
        <span className="ol-term">père</span>, Italian{" "}
        <span className="ol-term">padre</span> and Spanish{" "}
        <span className="ol-term">padre</span>. Those are not four similar
        words. They are one word, with each language's own regular changes
        applied to it, and the changes are the same ones that language applies
        to every other word it inherited.
      </p>
      <p>
        So if a divine name shows up across a family of languages and has been
        put through exactly those same changes, it did not travel on its own. It
        rode the language, along with the words for father and water and two,
        which means it was already there in the parent language and the people
        who spoke it had a god by that name.
      </p>
      <div className="ol-dig">
        <div className="ol-dig-cap">A god addressed as father sky</div>
        <div className="ol-cog">
          {SKY.map(([lang, form, gloss]) => (
            <div className="ol-cog-row" key={lang}>
              <span className="ol-cog-lang">{lang}</span>
              <span className="ol-cog-form">
                {form}
                {gloss && <span className="ol-cog-gloss">{gloss}</span>}
              </span>
            </div>
          ))}
          {shown && (
            <div className="ol-cog-row proto">
              <span className="ol-cog-lang">Reconstructed</span>
              <span className="ol-cog-form">*Dyēus ph₂tēr</span>
            </div>
          )}
        </div>
        {!shown && (
          <button className="ol-depth on" style={{ marginTop: "1.2rem" }} onClick={() => setShown(true)}>
            Go down one more
          </button>
        )}
      </div>
      {shown && (
        <>
          <p>
            These are not similar names. They are the same name, in languages
            that separated thousands of years ago, each one having applied its
            own regular sound changes to it along the way.
          </p>
          <p>
            <strong style={{ color: C.ink, fontWeight: 400 }}>
              There was a community that said this.
            </strong>{" "}
            Not a theme, not an archetype, not a pattern in the human mind. A
            group of people, somewhere, who addressed the daylit sky as father,
            and whose descendants carried the phrase to Iceland and to the
            Ganges without ever knowing they had.
          </p>
          <p>
            The same method finds Norse Týr, whose name comes from the ordinary
            word for a god in the parent language and is cognate with Zeus. By
            the time anyone wrote the Norse material down he was a minor figure
            who had lost a hand. The name is older than the position.
          </p>
        </>
      )}
    </Movement>
  );
}

function Six() {
  return (
    <Movement
      n="VI"
      cls="Reconstructed"
      kind="deep"
      title="And they were doing this too."
    >
      <p className="ol-lead">
        One last thing, and it is the reason the subject is worth a life rather
        than an afternoon.
      </p>
      <p>
        Everything above has involved standing in front of a tradition and
        working out what is underneath it. That is a modern activity with
        journals and departments attached. It is also, in a rougher form,
        something the traditions were already doing.
      </p>
      <p>
        People in every one of these places found monuments they had not built,
        in a style nobody around them could manage, left by somebody. And they
        did what anyone does with unreadable evidence. They explained it.
      </p>
      <p>
        Here is what four of them said, and underneath each one, what was
        standing there.
      </p>
      {UNDERNEATH.map((c, i) => (
        <CaseDig item={c} key={i} />
      ))}
      <p style={{ marginTop: "2.4rem" }}>
        Four traditions on four continents, none in contact with the others,
        each arriving at a prior people who were smaller or larger or worked at
        night, and who are gone but not entirely gone. The explanations are
        wrong in the way that unaided explanations are wrong, and the
        observation underneath them is completely correct.{" "}
        <strong style={{ color: C.ink, fontWeight: 400 }}>
          Somebody was here before, and left something nobody could account for.
        </strong>
      </p>
      <p>
        Which is the whole of the subject in miniature. A myth is what a people
        says about a past it cannot reach, assembled out of what happens to be
        lying around, and it preserves far more than it means to.
      </p>
      <p style={{ color: C.inkDim }}>
        Everyone who has ever tried to read the ground has been doing this.
        These are just the earliest drafts.
      </p>
      <div className="ol-colophon">The Older Layer · six of six</div>
    </Movement>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

function TheOlderLayer() {
  return (
    <div className="ol-root">
      <style>{styles}</style>
      <div className="ol-wrap">
        <header className="ol-mast">
          <p className="ol-eyebrow">Comparative mythology · reading downwards</p>
          <h1>
            The Older
            <br />
            Layer
          </h1>
          <p className="ol-standfirst">
            People leave better evidence of what they believed when they are not
            trying to tell you. The parts nobody could be bothered to change are
            the parts that say most.
          </p>
        </header>
        <One />
        <Two />
        <Three />
        <Four />
        <Five />
        <Six />
      </div>
    </div>
  );
}

  return TheOlderLayer;
})();


const VIEWS = {
  inherited: Inherited,
  otherface: OtherFace,
  break: Break,
  apparatus: Apparatus,
  whatexists: WhatExists,
  olderlayer: OlderLayer,
};

/* ============================================================
   ROOT
   ============================================================ */

export default function WhatNobodyMeant() {
  const [view, setView] = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current && topRef.current.scrollIntoView) {
      topRef.current.scrollIntoView({ block: "start" });
    }
  }, [view]);

  const idx = view ? ORDER.indexOf(view) : -1;
  const prev = idx > 0 ? ORDER[idx - 1] : null;
  const next = idx >= 0 && idx < ORDER.length - 1 ? ORDER[idx + 1] : null;
  const Current = view ? VIEWS[view] : null;
  const meta = view ? byId(view) : null;

  return (
    <div className="hub-shell">
      <style>{shellStyles}</style>
      <div ref={topRef} />
      {!view && <Index onOpen={setView} />}
      {view && (
        <>
          <div className="hub-bar">
            <div className="hub-bar-inner">
              <button className="hub-bar-btn" onClick={() => setView(null)}>
                ← All six
              </button>
              <span className="hub-bar-where">{meta.title}</span>
              <button
                className="hub-bar-btn"
                onClick={() => next && setView(next)}
                disabled={!next}
              >
                Next →
              </button>
            </div>
          </div>
          <Current />
          <div className="hub-tail">
            <div className="hub-tail-inner">
              <div className="hub-tail-lab">Where to next</div>
              <div className="hub-cards">
                {prev && <Card item={byId(prev)} onOpen={setView} />}
                {next && <Card item={byId(next)} onOpen={setView} />}
                {!next && (
                  <button className="hub-card" onClick={() => setView(null)}>
                    <div className="hub-card-top">
                      <span className="hub-card-topic">That is all of them</span>
                    </div>
                    <h3>Back to the index</h3>
                    <p>
                      Six topics, one interest, and a fair amount of evidence
                      nobody meant to leave.
                    </p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
