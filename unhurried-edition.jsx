import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   WHAT NOBODY MEANT — THE UNHURRIED EDITION
   Same content as the standard edition. Nothing removed,
   nothing softened. Everything said out loud instead of
   implied, on a page built for comfortable reading.
   ============================================================ */

const P = {
  paper: "#F7F4ED",
  paperDeep: "#EFEAE0",
  card: "#FFFFFF",
  ink: "#1A2426",
  inkMid: "#40514F",
  inkSoft: "#5E706E",
  rule: "#D6CEC0",
  ruleSoft: "#E4DDD1",
  mark: "#9A5B18",
  markSoft: "#C4915A",
  deep: "#1F5A66",
  deepSoft: "#A8C6CC",
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.un-shell { background: ${P.paper}; min-height: 100%; }

.un-root {
  background: ${P.paper};
  color: ${P.ink};
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 400;
  font-size: 21px;
  line-height: 1.72;
  padding-bottom: 7rem;
  -webkit-font-smoothing: antialiased;
}
.un-wrap { max-width: 40rem; margin: 0 auto; padding: 0 1.6rem; }

.un-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.74rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: ${P.inkSoft}; margin: 0 0 1.4rem;
}

.un-mast { padding: 5.5rem 0 3rem; }
.un-mast h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 20, 'WONK' 0, 'opsz' 144;
  font-weight: 700; font-size: clamp(2.6rem, 8vw, 4.2rem);
  line-height: 1.02; letter-spacing: -0.02em; margin: 0 0 1.4rem; color: ${P.ink};
}
.un-standfirst { font-size: 1.24rem; line-height: 1.6; max-width: 32rem; margin: 0; color: ${P.inkMid}; }

.un-section { padding: 3rem 0; border-top: 1px solid ${P.rule}; }
.un-section h2 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 20, 'WONK' 0, 'opsz' 90;
  font-weight: 600; font-size: clamp(1.6rem, 4.2vw, 2.15rem);
  line-height: 1.16; letter-spacing: -0.015em; margin: 0 0 1.5rem; color: ${P.ink};
}
.un-section h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 20, 'WONK' 0, 'opsz' 40;
  font-weight: 600; font-size: 1.28rem; line-height: 1.25;
  margin: 2.4rem 0 0.9rem; color: ${P.ink};
}
.un-section p { margin: 0 0 1.3rem; max-width: 36rem; }
p.un-lead { font-size: 1.1rem; }
em { font-style: italic; }
strong { font-weight: 500; color: ${P.ink}; }

.un-term {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9em; color: ${P.deep}; font-weight: 500;
}

/* ---------- how to use ---------- */

.un-howto {
  background: ${P.paperDeep}; border: 1px solid ${P.rule};
  border-radius: 3px; padding: 1.2rem 1.35rem; margin: 2rem 0;
}
.un-howto-lab {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: ${P.mark}; margin-bottom: 0.6rem;
}
.un-howto p { font-size: 0.98rem; color: ${P.inkMid}; margin: 0; max-width: none; }

/* ---------- cards on the index ---------- */

.un-group-label {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: ${P.mark};
  margin: 2.6rem 0 0.6rem;
}
.un-group-note { font-size: 1rem; color: ${P.inkMid}; margin: 0 0 1.2rem; max-width: 34rem; }

.un-cards { display: grid; gap: 0.85rem; }
.un-card {
  display: block; width: 100%; text-align: left; cursor: pointer;
  background: ${P.card}; border: 1px solid ${P.rule}; border-radius: 3px;
  padding: 1.3rem 1.4rem; font-family: inherit;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.un-card:hover { border-color: ${P.markSoft}; box-shadow: 0 2px 10px rgba(26,36,38,0.06); }
.un-card:focus-visible { outline: 3px solid ${P.deep}; outline-offset: 2px; }
.un-card[disabled] { cursor: default; opacity: 0.55; background: ${P.paperDeep}; }
.un-card[disabled]:hover { border-color: ${P.rule}; box-shadow: none; }
.un-card-top {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 1rem; flex-wrap: wrap; margin-bottom: 0.55rem;
}
.un-card-topic {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: ${P.inkSoft};
}
.un-card-n {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.1em; color: ${P.markSoft};
}
.un-card h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 20, 'WONK' 0, 'opsz' 48;
  font-weight: 600; font-size: 1.4rem; line-height: 1.2;
  margin: 0 0 0.55rem; color: ${P.ink};
}
.un-card p { font-size: 1rem; color: ${P.inkMid}; margin: 0; max-width: none; line-height: 1.6; }

/* ---------- numbered points ---------- */

.un-points { display: grid; gap: 0.85rem; margin: 1.8rem 0 0; }
.un-point {
  background: ${P.card}; border: 1px solid ${P.rule};
  border-left: 3px solid ${P.markSoft}; border-radius: 3px; padding: 1.15rem 1.3rem;
}
.un-point-n {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: ${P.mark}; margin-bottom: 0.45rem;
}
.un-point p { font-size: 1rem; color: ${P.inkMid}; margin: 0; max-width: none; }

/* ---------- word tables ---------- */

.un-table {
  background: ${P.card}; border: 1px solid ${P.rule};
  border-radius: 3px; padding: 1.5rem 1.5rem 1.3rem; margin: 2rem 0;
}
.un-table-cap {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: ${P.inkSoft}; margin-bottom: 1.1rem;
}
.un-row {
  display: grid; grid-template-columns: 11rem 1fr; gap: 1rem;
  align-items: baseline; padding: 0.42rem 0;
}
.un-lang { font-family: 'IBM Plex Mono', monospace; font-size: 0.86rem; color: ${P.inkSoft}; }
.un-word { font-family: 'IBM Plex Mono', monospace; font-size: 1.16rem; color: ${P.ink}; }
.un-word .hit { color: ${P.mark}; font-weight: 500; }
.un-row.parent { margin-top: 0.8rem; padding-top: 0.95rem; border-top: 1px solid ${P.rule}; }
.un-row.parent .un-word { color: ${P.deep}; }
.un-row.parent .un-lang { color: ${P.deep}; }
.un-row.recon { border-top: 2px dashed ${P.markSoft}; }
.un-row.recon .un-word { color: ${P.mark}; }
.un-row.recon .un-lang { color: ${P.mark}; }
.un-table-note {
  font-size: 1rem; color: ${P.inkMid}; margin: 1.3rem 0 0;
  padding-left: 1rem; border-left: 3px solid ${P.ruleSoft}; max-width: none; line-height: 1.62;
}

/* ---------- buttons ---------- */

.un-btn {
  font-family: 'Newsreader', Georgia, serif; font-size: 1.02rem; font-weight: 400;
  background: ${P.card}; color: ${P.mark};
  border: 1px solid ${P.markSoft}; border-radius: 3px;
  padding: 0.8rem 1.3rem; cursor: pointer; margin-top: 1.6rem;
  transition: background 150ms ease, color 150ms ease;
}
.un-btn:hover { background: ${P.mark}; color: ${P.paper}; border-color: ${P.mark}; }
.un-btn:focus-visible { outline: 3px solid ${P.deep}; outline-offset: 2px; }
.un-btn[disabled] { opacity: 0.4; cursor: default; }
.un-btn[disabled]:hover { background: ${P.card}; color: ${P.mark}; border-color: ${P.markSoft}; }

/* ---------- question and answer ---------- */

.un-q { margin: 2rem 0 0; }
.un-q-text { font-size: 1.08rem; margin: 0 0 1.1rem; max-width: 34rem; }
.un-opts { display: grid; gap: 0.6rem; }
.un-opt {
  text-align: left; background: ${P.card}; border: 1px solid ${P.rule};
  color: ${P.ink}; font-family: 'Newsreader', Georgia, serif; font-size: 1.02rem;
  font-weight: 400; padding: 0.95rem 1.15rem; border-radius: 3px; cursor: pointer;
  line-height: 1.5;
}
.un-opt:hover { border-color: ${P.markSoft}; }
.un-opt:focus-visible { outline: 3px solid ${P.deep}; outline-offset: 2px; }
.un-opt.chosen { border-color: ${P.mark}; border-width: 2px; padding: 0.9rem 1.1rem; }
.un-opt.chosen::before { content: "✓  "; color: ${P.mark}; font-weight: 600; }

.un-answer {
  margin: 1.6rem 0 0; padding: 1.2rem 1.35rem;
  background: ${P.paperDeep}; border: 1px solid ${P.rule}; border-radius: 3px;
}
.un-answer p { font-size: 1.02rem; color: ${P.inkMid}; margin: 0 0 0.9rem; max-width: none; }
.un-answer p:last-child { margin-bottom: 0; }

/* ---------- expandable cards ---------- */

.un-open { display: grid; gap: 0.7rem; margin: 2rem 0 0; }
.un-open-item { background: ${P.card}; border: 1px solid ${P.rule}; border-radius: 3px; overflow: hidden; }
.un-open-head {
  width: 100%; text-align: left; background: transparent; border: none;
  color: ${P.ink}; font-family: 'Newsreader', Georgia, serif;
  font-size: 1.08rem; font-weight: 400; padding: 1.15rem 1.3rem; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center; gap: 1rem; line-height: 1.45;
}
.un-open-head:hover { background: ${P.paperDeep}; }
.un-open-head:focus-visible { outline: 3px solid ${P.deep}; outline-offset: -3px; }
.un-open-mark {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem;
  color: ${P.mark}; flex-shrink: 0; white-space: nowrap;
}
.un-open-body { padding: 0 1.3rem 1.35rem; }
.un-open-body p { font-size: 1.02rem; color: ${P.inkMid}; margin: 0 0 0.9rem; max-width: none; }
.un-open-body p:last-child { margin-bottom: 0; }

/* ---------- two-sided exhibits ---------- */

.un-two {
  background: ${P.card}; border: 1px solid ${P.rule};
  border-radius: 3px; padding: 1.35rem 1.4rem; margin-top: 1.4rem;
}
.un-two.reverse { background: ${P.paperDeep}; border-color: ${P.markSoft}; }
.un-two-side {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 1rem; flex-wrap: wrap; margin-bottom: 0.7rem;
}
.un-two-which {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: ${P.mark};
}
.un-two-when {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem;
  letter-spacing: 0.1em; color: ${P.inkSoft};
}
.un-two h3 {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 20, 'WONK' 0, 'opsz' 44;
  font-weight: 600; font-size: 1.3rem; line-height: 1.22;
  margin: 0 0 0.75rem; color: ${P.ink};
}
.un-two p { font-size: 1.02rem; color: ${P.inkMid}; margin: 0 0 0.9rem; max-width: none; line-height: 1.62; }
.un-two p:last-of-type { margin-bottom: 0; }
.un-turn {
  font-family: 'Newsreader', Georgia, serif; font-size: 1rem;
  background: transparent; color: ${P.mark};
  border: 1px solid ${P.markSoft}; border-radius: 3px;
  padding: 0.65rem 1.1rem; cursor: pointer; margin-top: 1.15rem;
}
.un-turn:hover { background: ${P.mark}; color: ${P.paper}; border-color: ${P.mark}; }
.un-turn:focus-visible { outline: 3px solid ${P.deep}; outline-offset: 2px; }

.un-meanwhile {
  margin-top: 0.6rem; padding: 0.85rem 1.1rem;
  border-left: 3px solid ${P.deepSoft}; background: ${P.paperDeep};
  border-radius: 0 3px 3px 0;
  font-size: 0.95rem; line-height: 1.65; color: ${P.inkMid};
}
.un-meanwhile b {
  display: block; font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: ${P.deep}; font-weight: 500; margin-bottom: 0.3rem;
}

/* ---------- fossils ---------- */

.un-fossil {
  background: ${P.card}; border: 1px solid ${P.rule};
  border-left: 3px solid ${P.deepSoft}; border-radius: 3px;
  padding: 1.3rem 1.35rem; margin-bottom: 0.8rem;
}
.un-fossil-head { display: flex; align-items: baseline; gap: 0.85rem; flex-wrap: wrap; margin-bottom: 0.7rem; }
.un-fossil-form { font-family: 'IBM Plex Mono', monospace; font-size: 1.12rem; color: ${P.mark}; font-weight: 500; }
.un-fossil-gloss {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.74rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: ${P.inkSoft};
}
.un-fossil-fam {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.12em; text-transform: uppercase; color: ${P.deep}; margin-left: auto;
}
.un-fossil-kids {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.94rem;
  line-height: 1.9; color: ${P.ink}; margin-bottom: 0.9rem;
  padding-left: 0.9rem; border-left: 2px solid ${P.ruleSoft};
}
.un-fossil-kids .src { color: ${P.inkSoft}; }
.un-fossil-body p { font-size: 1.02rem; color: ${P.inkMid}; margin: 0 0 0.85rem; max-width: none; }
.un-fossil-body p:last-child { margin-bottom: 0; }

/* ---------- stages ---------- */

.un-stage {
  display: grid; grid-template-columns: 2.4rem 1fr; gap: 1rem;
  background: ${P.card}; border: 1px solid ${P.rule};
  border-left: 3px solid ${P.markSoft}; border-radius: 3px;
  padding: 1.15rem 1.3rem; margin-bottom: 0.7rem; align-items: baseline;
}
.un-stage-n { font-family: 'IBM Plex Mono', monospace; font-size: 1rem; color: ${P.mark}; }
.un-stage-t { font-size: 1.02rem; color: ${P.inkMid}; line-height: 1.62; }

/* ---------- atmosphere, used only where it argues ---------- */

.un-quiet {
  background: #E4E4E1;
  border: 1px solid #CFCFC9;
  border-radius: 3px;
  padding: 1.9rem 1.7rem 1.6rem;
  margin: 1.8rem 0 0;
}
.un-quiet p { color: #4A4E52; }
.un-quiet strong { color: #23282B; }

.un-dimmed { transition: opacity 700ms ease, filter 700ms ease; }
.un-dimmed.out { opacity: 0.42; filter: saturate(0.15); }

/* ---------- closing ---------- */

.un-orphans {
  margin: 2.4rem 0; font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'SOFT' 20, 'WONK' 0, 'opsz' 40;
  font-size: 1.35rem; line-height: 2.1; color: ${P.ink};
}
.un-colophon {
  margin-top: 4rem; padding-top: 1.6rem; border-top: 1px solid ${P.rule};
  font-family: 'IBM Plex Mono', monospace; font-size: 0.74rem;
  letter-spacing: 0.12em; text-transform: uppercase; color: ${P.inkSoft};
}

/* ---------- navigation bar ---------- */

.un-bar { position: sticky; top: 0; z-index: 20; background: ${P.paper}; border-bottom: 1px solid ${P.rule}; }
.un-bar-inner {
  max-width: 40rem; margin: 0 auto; padding: 0.75rem 1.6rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
}
.un-bar-btn {
  font-family: 'Newsreader', Georgia, serif; font-size: 0.98rem;
  background: transparent; border: 1px solid ${P.rule}; color: ${P.inkMid};
  padding: 0.5rem 0.95rem; border-radius: 3px; cursor: pointer; white-space: nowrap;
}
.un-bar-btn:hover { background: ${P.paperDeep}; color: ${P.ink}; }
.un-bar-btn:focus-visible { outline: 3px solid ${P.deep}; outline-offset: 2px; }
.un-bar-where {
  font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem;
  letter-spacing: 0.12em; text-transform: uppercase; color: ${P.inkSoft};
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

@media (max-width: 560px) {
  .un-root { font-size: 19.5px; }
  .un-mast { padding: 3.5rem 0 2.4rem; }
  .un-section { padding: 2.4rem 0; }
  .un-row { grid-template-columns: 8.5rem 1fr; gap: 0.8rem; }
  .un-bar-inner { padding: 0.65rem 1.1rem; }
}
`;

/* ============================================================
   SHARED PIECES
   ============================================================ */

function Waiting({ children }) {
  return (
    <div className="un-howto" style={{ borderStyle: "dashed" }}>
      <div className="un-howto-lab">There is more below</div>
      <p>{children}</p>
    </div>
  );
}

function HowTo({ children }) {
  return (
    <div className="un-howto">
      <div className="un-howto-lab">How this page works</div>
      <p>{children}</p>
    </div>
  );
}

function Question({ text, options, value, onPick }) {
  return (
    <div className="un-q">
      <p className="un-q-text">{text}</p>
      <div className="un-opts">
        {options.map((o) => (
          <button
            key={o.key}
            className={`un-opt${value === o.key ? " chosen" : ""}`}
            onClick={() => onPick(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Word({ parts }) {
  const [pre, hit, post] = parts;
  return (
    <span className="un-word">
      {pre}
      <span className="hit">{hit}</span>
      {post}
    </span>
  );
}

/* ============================================================
   TOPIC ONE — INHERITED PROPERTY
   ============================================================ */

const ROMANCE = {
  caption: "The word for ‘hand’, in five languages",
  parent: { lang: "Latin", form: "manus" },
  rows: [
    { lang: "Portuguese", parts: ["m", "ã", "o"] },
    { lang: "Spanish", parts: ["m", "an", "o"] },
    { lang: "French", parts: ["m", "ain", ""] },
    { lang: "Italian", parts: ["m", "an", "o"] },
    { lang: "Romanian", parts: ["m", "ân", "ă"] },
  ],
};

const PACIFIC = [
  {
    caption: "‘Forbidden’, or ‘set apart’ — five Polynesian languages",
    rows: [
      { lang: "Tongan", parts: ["", "tapu", ""] },
      { lang: "Samoan", parts: ["", "tapu", ""] },
      { lang: "Māori", parts: ["", "tapu", ""] },
      { lang: "Tahitian", parts: ["", "tapu", ""] },
      { lang: "Hawaiian", parts: ["", "kapu", ""] },
    ],
    note: (
      <>
        English borrowed this word from Tongan in the 1770s and spelled it{" "}
        <em>taboo</em>. Now look at the last line. Hawaiian has a{" "}
        <span className="un-term">k</span> where all four of the others have a{" "}
        <span className="un-term">t</span>. On its own, that means nothing
        whatsoever. Two words can begin differently by pure accident. The
        question worth asking is whether it happens again.
      </>
    ),
  },
  {
    caption: "‘Person’ — the same five languages",
    rows: [
      { lang: "Tongan", parts: ["", "tangata", ""] },
      { lang: "Samoan", parts: ["", "tagata", ""] },
      { lang: "Māori", parts: ["", "tangata", ""] },
      { lang: "Tahitian", parts: ["", "ta’ata", ""] },
      { lang: "Hawaiian", parts: ["", "kanaka", ""] },
    ],
    note: (
      <>
        It happens again, and twice in the same word. Hawaiian has{" "}
        <span className="un-term">k</span> in both places where the others have{" "}
        <span className="un-term">t</span>. Tahitian has done something
        different but equally consistent: it has dropped the middle consonant
        altogether and left a small catch in the throat where it used to be.
        <br />
        <br />
        This is the point on which the entire subject rests, so it is worth
        saying slowly. Neither language is varying at random. Each one is
        applying a rule of its own, to every word it inherited, without
        exception — and without any speaker ever deciding to do it or noticing
        that they had.
      </>
    ),
  },
  {
    caption: "‘Eye’ — now across the whole family",
    rows: [
      { lang: "Malagasy · Madagascar", parts: ["ma", "s", "o"] },
      { lang: "Malay · Sumatra", parts: ["ma", "t", "a"] },
      { lang: "Tagalog · Philippines", parts: ["ma", "t", "a"] },
      { lang: "Fijian · Fiji", parts: ["ma", "t", "a"] },
      { lang: "Māori · New Zealand", parts: ["ma", "t", "a"] },
      { lang: "Hawaiian · Hawai‘i", parts: ["ma", "k", "a"] },
    ],
    note: (
      <>
        Now compare the first line with the last. Malagasy is spoken on
        Madagascar, off the east coast of Africa. Hawaiian is spoken in the
        middle of the Pacific Ocean. Between those two points lie something like
        fifteen thousand miles of open water.
        <br />
        <br />
        The same rules connect them. This family of languages runs from the
        coast of Africa to Easter Island, better than halfway around the world,
        and it got there by boat — and these words are a large part of how
        anybody knows that it did.
      </>
    ),
  },
];

const JOINTS = [
  {
    q: "How many blues are there?",
    a: (
      <>
        <p>
          English has one basic word for blue. If you want to be more precise,
          you add something to it: light blue, navy blue, sky blue. Those are all
          understood as versions of a single colour.
        </p>
        <p>
          Russian has two words, and they are not versions of one another.{" "}
          <span className="un-term">Goluboy</span> and{" "}
          <span className="un-term">siniy</span> are separate basic colours in
          the way that pink and red are separate colours for an English speaker.
          Ask a Russian speaker to name the colour of a clear sky and then the
          colour of deep water, and they are not choosing between two shades of
          the same thing. They are naming two different things.
        </p>
        <p>
          <strong>There is a measurable consequence.</strong> In laboratory
          tests, Russian speakers are consistently faster at telling those two
          ranges of colour apart than English speakers are, because their
          language obliges them to mark the boundary every time they mention
          either one.
        </p>
        <p>
          And here is the part that matters. Neither group experiences its own
          arrangement as a decision that anybody made. Each simply sees the
          colours that are there.
        </p>
      </>
    ),
  },
  {
    q: "Can you say “my brother” without saying more than that?",
    a: (
      <>
        <p>
          In English, yes. You can mention a brother and stop. Whether he is
          older or younger than you is additional information, which you supply
          if it happens to be relevant.
        </p>
        <p>
          Hungarian does not offer that option.{" "}
          <span className="un-term">Báty</span> means an older brother and{" "}
          <span className="un-term">öcs</span> means a younger one, and there is
          no ordinary neutral word that covers both. Japanese works the same way,
          with <span className="un-term">ani</span> and{" "}
          <span className="un-term">otōto</span>.
        </p>
        <p>
          <strong>
            So a speaker of either language cannot refer to a brother at all
            without revealing the birth order.
          </strong>{" "}
          It is not a detail they are choosing to include, and there is no polite
          way to withhold it. It is built into the only words available.
        </p>
      </>
    ),
  },
  {
    q: "How do you know?",
    a: (
      <>
        <p>
          English lets you report something without saying how you found out.{" "}
          <em>He came yesterday</em> works equally well whether you watched him
          arrive, heard about it from a neighbour, or worked it out from the wet
          coat in the hall.
        </p>
        <p>
          Turkish makes you choose before the sentence can end.{" "}
          <span className="un-term">Geldi</span> claims direct knowledge: you
          were there and you saw it.{" "}
          <span className="un-term">Gelmiş</span> marks the opposite: you were
          told, or you inferred it afterwards.
        </p>
        <p>
          <strong>There is no third form that stays out of the question.</strong>{" "}
          Every statement a Turkish speaker makes about somebody else's past
          actions commits them to an account of their own evidence, whether they
          wanted to give one or not.
        </p>
        <p>
          This is a real difference in what a language requires of the person
          using it, rather than a difference in what it permits them to say.
        </p>
      </>
    ),
  },
  {
    q: "Do these boundaries stay where they are?",
    a: (
      <>
        <p>They do not, and English is a very good place to watch them move.</p>
        <p>
          <span className="un-term">Silly</span> began as an Old English word,{" "}
          <span className="un-term">gesǣlig</span>, which meant blessed.
          Blessed shaded into innocent. Innocent shaded into naive. Naive shaded
          into foolish, which is where it sits today.
        </p>
        <p>
          <span className="un-term">Nice</span> arrived in English from the
          Latin <span className="un-term">nescius</span>, meaning ignorant, and
          worked its way through foolish, then shy, then fastidious, before
          settling into its present job.
        </p>
        <p>
          <strong>
            Each step happened because somebody used a word in a situation where
            two readings were both available, and a listener took one of them.
          </strong>{" "}
          Nothing decayed, and nobody made a mistake. An enormous number of very
          small decisions accumulated, and the word ended up somewhere its
          earliest speakers would not have recognised.
        </p>
      </>
    ),
  },
];

const FOSSILS = [
  {
    form: "*kʷekʷlos",
    gloss: "wheel",
    fam: "the ancestor of English, Greek and Sanskrit",
    kids: [
      ["English", "wheel"],
      ["Greek", "kúklos — which gives us cycle, bicycle, encyclopedia"],
      ["Sanskrit", "cakra — which gives us chakra"],
      ["Old Norse", "hjól"],
    ],
    body: (
      <>
        <p>
          The same word sits underneath all four of those, in branches of the
          family that had no contact with one another for thousands of years.
          That pattern means it was inherited from the common ancestor, rather
          than borrowed between them later on.
        </p>
        <p>
          <strong>Which produces a date, and this is the elegant part.</strong>{" "}
          Wheeled vehicles do not appear anywhere in the archaeological record
          before roughly 3500 BC. If the ancestral community already had a shared
          word for the wheel, then that community had not yet broken up when the
          wheel reached it.
        </p>
        <p>
          So the family tree acquires a floor. It cannot be older than the wheel,
          and we know when the wheel is.
        </p>
      </>
    ),
  },
  {
    form: "*melit",
    gloss: "honey",
    fam: "the same ancestor",
    kids: [
      ["Greek", "méli — surviving in English as mellifluous"],
      ["Latin", "mel — surviving in English as molasses"],
      ["English", "mildew, which was originally mildēaw, ‘honey-dew’"],
      ["Hittite", "milit"],
    ],
    body: (
      <>
        <p>
          They had honey, and separately they had a word for the drink fermented
          from it, which we would call mead.
        </p>
        <p>
          English lost the root almost entirely. It survives in one unexpected
          place. <em>Mildew</em> began as a word about the sticky deposits found
          on plants, and drifted across to describe damp walls, carrying the old
          word for honey inside it the whole way.
        </p>
        <p>
          <strong>The absences do work as well as the presences.</strong> There
          is no equally secure shared word for the sea, and that gap has kept
          scholars arguing about where these people lived for well over a
          century.
        </p>
      </>
    ),
  },
  {
    form: "*ama",
    gloss: "outrigger float",
    fam: "the Polynesian ancestor",
    kids: [
      ["Hawaiian", "ama"],
      ["Māori", "ama"],
      ["Samoan", "ama"],
      ["Fijian", "cama"],
    ],
    body: (
      <>
        <p>
          Back to the family from the first section. An outrigger is the beam
          lashed parallel to a canoe's hull to stop it rolling over, and this is
          the word for it. It is still the standard term among people who paddle
          outrigger canoes today.
        </p>
        <p>
          <strong>
            A community with a dedicated word for that specific component has
            solved the problem of open-water sailing.
          </strong>{" "}
          What follows from solving it is the largest expansion by sea that
          anybody managed anywhere before the modern era.
        </p>
      </>
    ),
  },
  {
    form: "*beRas",
    gloss: "husked rice",
    fam: "the wider Pacific ancestor",
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
          These people were farmers before they were sailors, and they took the
          crop with them when they went.
        </p>
        <p>
          <strong>
            Put the two words side by side and you have people with the
            technology to cross an ocean and a reason to want somewhere to plant
            when they arrive.
          </strong>{" "}
          The vocabulary amounts to a packing list for a way of life that nobody
          ever wrote down.
        </p>
      </>
    ),
  },
];

const NEGATION = [
  <>
    French once made a verb negative using the word{" "}
    <span className="un-term">ne</span> on its own. To give the negative more
    force, speakers added a small noun naming a tiny quantity: a crumb, a drop,
    a step. So <span className="un-term">je ne marche pas</span> originally
    meant <em>I do not walk a single step</em>, with{" "}
    <span className="un-term">pas</span> being the ordinary French word for a
    step.
  </>,
  <>
    The intensifier spread. It attached itself to verbs that had nothing to do
    with walking, and then to more or less every verb in the language. In doing
    so it stopped meaning a step at all.{" "}
    <span className="un-term">Pas</span> was now simply the second half of the
    negative, carrying no meaning of its own.
  </>,
  <>
    Then <span className="un-term">ne</span> began dropping out of speech
    altogether. Most French speakers today say{" "}
    <span className="un-term">je sais pas</span> rather than{" "}
    <span className="un-term">je ne sais pas</span>. So the word for step, which
    was never the negative and only ever turned up to add emphasis, now carries
    the entire negation by itself.
  </>,
];

const HORSE = [
  ["French", "cheval"],
  ["Spanish", "caballo"],
  ["Italian", "cavallo"],
  ["Portuguese", "cavalo"],
  ["Romanian", "cal"],
];
const SPEAK = [
  ["French", "parler"],
  ["Italian", "parlare"],
  ["Catalan", "parlar"],
  ["Occitan", "parlar"],
];

function TopicOne() {
  const [reveal, setReveal] = useState(0);
  const [openJoint, setOpenJoint] = useState(null);
  const [colourGuess, setColourGuess] = useState(null);
  const [dug, setDug] = useState(false);
  const [stage, setStage] = useState(0);
  const [checked, setChecked] = useState(false);

  return (
    <div className="un-root">
      <div className="un-wrap">
        <header className="un-mast">
          <p className="un-eyebrow">One of six · Historical linguistics</p>
          <h1>Inherited Property</h1>
          <p className="un-standfirst">
            Nobody knows anything at all about the people who spoke the
            languages that English and Hindi and Greek all came from. They left
            no buildings, no graves anybody can identify, and no writing.
            <br />
            <br />
            But the words survived, passed mouth to mouth for five thousand
            years, and it turns out that if you sort those words carefully enough
            they will tell you where those people lived and what they had
            invented.
          </p>
        </header>

        <section className="un-section">
          <h2>You already believe in one of these.</h2>
          <p className="un-lead">
            French, Spanish and Italian are related to one another. You knew that
            before you opened this, and you probably know roughly why. The Roman
            empire covered all three countries, and these languages are what
            became of Latin in each of them after Rome stopped running things.
          </p>

          <div className="un-table">
            <div className="un-table-cap">{ROMANCE.caption}</div>
            {ROMANCE.rows.map((r) => (
              <div className="un-row" key={r.lang}>
                <span className="un-lang">{r.lang}</span>
                <Word parts={r.parts} />
              </div>
            ))}
            <div className="un-row parent">
              <span className="un-lang">{ROMANCE.parent.lang}</span>
              <span className="un-word">{ROMANCE.parent.form}</span>
            </div>
            <p className="un-table-note">
              Nobody finds that suspicious, and nobody should. These are not five
              similar languages that happen to resemble each other. They are one
              language — Latin — in five different states of having changed,
              because every generation speaks a little differently from the one
              before it, and two thousand years of a little adds up.
            </p>
          </div>

          <p>
            That is what a language family is. Not a resemblance, and not one
            language borrowing a word from another. A group of languages that are
            all the same language, further along.
          </p>

          <h3>Two things follow, and the second one is the whole subject</h3>
          <p>
            The first is that relatives need not be recognisable to each other. A
            Portuguese speaker and a Romanian speaker cannot hold a conversation,
            despite the fact that both of them are speaking Latin.
          </p>
          <p>
            The second is about luck.{" "}
            <strong>Latin happens to be sitting in a library.</strong> We have
            it. We can look at the parent and check the children against it.
            Almost no other family of languages in the world comes with its
            parent still available, and the actual work of this subject is
            recovering a parent that nobody ever wrote down.
          </p>
          <p>
            Which raises a perfectly fair objection, and you should hold onto it
            as you read on. A great many words in completely unrelated languages
            resemble one another by pure chance. So resemblance on its own cannot
            possibly be the test. Something else has to be.
          </p>
        </section>

        <section className="un-section">
          <h2>You already own two words from a family you have never heard of.</h2>
          <p className="un-lead">
            <em>Taboo</em> and <em>tattoo</em>. Captain Cook's crews picked them
            up in the Pacific in the seventeen-sixties and seventies and carried
            them home, and they have been sitting in the English language ever
            since, doing perfectly ordinary work and looking entirely English.
          </p>
          <p>
            They belong to a family of about twelve hundred languages, spread
            across the Pacific and Indian oceans. That family is nothing like the
            Romance one. There is no Latin sitting in a library. Nobody wrote the
            parent language down, nobody recorded an empire, and there was no
            empire.
          </p>
          <p>
            So on what grounds is anybody entitled to say these languages are
            related? Here is the answer, and it is the answer to the objection
            from the last section.
          </p>
          <p>
            <strong>
              The test is not whether the words look alike. The test is whether
              the differences between them are consistent.
            </strong>{" "}
            If one language has a <span className="un-term">k</span> in every
            single place where its neighbours have a{" "}
            <span className="un-term">t</span>, word after word after word, that
            is not a resemblance. That is a rule, being applied without exception
            by people who had no idea they were applying it.
          </p>
          <p>
            Chance does not produce rules like that. Borrowing does not either,
            because borrowed words arrive one at a time and do not reshape an
            entire vocabulary in step. Watch for the rule in the tables below.
          </p>

          <HowTo>
            The button underneath each table brings up the next one. There are
            three, and each adds languages further away than the last.
          </HowTo>

          {PACIFIC.slice(0, reveal + 1).map((d) => (
            <div className="un-table" key={d.caption}>
              <div className="un-table-cap">{d.caption}</div>
              {d.rows.map((r) => (
                <div className="un-row" key={r.lang}>
                  <span className="un-lang">{r.lang}</span>
                  <Word parts={r.parts} />
                </div>
              ))}
              <p className="un-table-note">{d.note}</p>
            </div>
          ))}

          <button
            className="un-btn"
            onClick={() => setReveal((v) => Math.min(v + 1, PACIFIC.length - 1))}
            disabled={reveal >= PACIFIC.length - 1}
          >
            {reveal >= PACIFIC.length - 1
              ? "That is the whole family"
              : reveal === 0
              ? "Show me the same rule in another word"
              : "Now widen it to the whole family"}
          </button>

          {reveal >= PACIFIC.length - 1 && (
            <p style={{ marginTop: "2rem" }}>
              One last thing about that table. Malagasy's closest relatives are
              not anywhere in Africa. They are in southern Borneo, six thousand
              kilometres east across open ocean. Somebody made that crossing, in
              boats, more than a thousand years ago. The only surviving record
              that they did it is the way people in Madagascar say the word for
              eye.
            </p>
          )}
        </section>

        <section className="un-section">
          <h2>Your language has settings, and you cannot feel them from inside.</h2>
          <p className="un-lead">
            The obvious way to think about a language is as a set of names for
            things that were already out there in the world, with translation
            being a matter of swapping one label for another.
          </p>
          <p>
            That is not quite how it works. Every language has settled on which
            distinctions are worth building into its words, and different
            languages have settled differently. Some of those decisions are
            optional, in the sense that you can always add more words if you want
            to be precise. Others are compulsory: the grammar will not let you
            finish the sentence until you have chosen a side.
          </p>
          <p>
            Before the examples, one question. Answer it quickly.
          </p>

          <Question
            text="How many basic colours are there between the sky on a clear day and deep water at dusk?"
            options={[
              { key: "one", label: "One. They are both blue." },
              { key: "two", label: "Two. Those are quite different colours." },
              { key: "depends", label: "That depends on which language you are asking in." },
            ]}
            value={colourGuess}
            onPick={setColourGuess}
          />

          {colourGuess === "one" && (
            <div className="un-answer">
              <p>
                That is the English answer, and the interesting thing about it is
                that it does not feel like an answer at all. It feels like a
                straightforward observation about light. Roughly half the people
                reading this sentence in translation would have said two, and it
                would have felt equally obvious to them.
              </p>
            </div>
          )}
          {colourGuess === "two" && (
            <div className="un-answer">
              <p>
                Then either you speak one of the languages that divides them, or
                you are being unusually careful. Most English speakers say one,
                and say it in the tone of somebody reporting a fact about the
                world rather than a fact about their own vocabulary.
              </p>
            </div>
          )}
          {colourGuess === "depends" && (
            <div className="un-answer">
              <p>
                Quite right. And the genuinely interesting part is not that
                languages differ, which one would expect. It is that speakers of
                each one experience their own answer as a fact about colour.
              </p>
            </div>
          )}

          <p style={{ marginTop: "1.8rem" }}>
            Four examples follow. The first two come from languages you probably
            do not speak. The last two are in the one you are reading now.
          </p>

          <HowTo>
            Each of these is a question. Tap one to open the answer, and tap it
            again to close it.
          </HowTo>

          <div className="un-open">
            {JOINTS.map((j, i) => (
              <div className="un-open-item" key={j.q}>
                <button
                  className="un-open-head"
                  onClick={() => setOpenJoint(openJoint === i ? null : i)}
                  aria-expanded={openJoint === i}
                >
                  <span>{j.q}</span>
                  <span className="un-open-mark">
                    {openJoint === i ? "close" : "open"}
                  </span>
                </button>
                {openJoint === i && <div className="un-open-body">{j.a}</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="un-section">
          <h2>How would you find out what a people farmed?</h2>
          <p className="un-lead">
            Take a community that left no farms anybody has found, no tools, no
            graves that can be identified as theirs, and not one line of writing.
            Nothing survives of them at all except the language, and even that
            only in the form of its descendants, thousands of years later.
          </p>
          <p>
            You can still find out what they grew, what animals they kept, and
            what they had invented. The reasoning runs in four steps, and each
            one is small.
          </p>
          <p>
            A word turns up right across a family of languages. In each branch it
            obeys that branch's own sound rules exactly, which is how you know it
            was inherited from the parent rather than borrowed from a neighbour
            later on. Therefore the shared ancestor must have had the word. And
            if the ancestor had a word for a thing, the ancestor had the thing.
          </p>
          <p>
            Which turns a list of words into an archaeological site, for a people
            who left no pottery anybody can point at.
          </p>

          <HowTo>
            Each entry below opens with the surviving words you can go and check
            for yourself, and the reconstructed ancestor sits above them, marked
            with an asterisk to show that nobody ever wrote it down.
          </HowTo>

          {dug && (
            <div style={{ marginTop: "1.6rem" }}>
              {FOSSILS.map((f) => (
                <div className="un-fossil" key={f.form}>
                  <div className="un-fossil-head">
                    <span className="un-fossil-form">{f.form}</span>
                    <span className="un-fossil-gloss">{f.gloss}</span>
                    <span className="un-fossil-fam">{f.fam}</span>
                  </div>
                  <div className="un-fossil-kids">
                    {f.kids.map(([src, w]) => (
                      <div key={src}>
                        <span className="src">{src} </span>
                        {w}
                      </div>
                    ))}
                  </div>
                  <div className="un-fossil-body">{f.body}</div>
                </div>
              ))}
            </div>
          )}

          <button className="un-btn" onClick={() => setDug(true)} disabled={dug}>
            {dug ? "The inventory is open" : "Open the inventory"}
          </button>

          {dug && (
            <>
              <h3>The best evidence of all comes from people trying to stop something</h3>
              <p>
                Around the third century AD, somebody compiled a list of
                corrections for students of Latin. It is a very ordinary sort of
                document: say this, not that. Say{" "}
                <span className="un-term">vetulus</span>, not{" "}
                <span className="un-term">veclus</span>. Say{" "}
                <span className="un-term">auris</span>, not{" "}
                <span className="un-term">oricla</span>.
              </p>
              <p>
                <strong>
                  Every single form on the wrong side of that list is the
                  ancestor of the modern word.
                </strong>{" "}
                <span className="un-term">Veclus</span> became the Italian{" "}
                <span className="un-term">vecchio</span>.{" "}
                <span className="un-term">Oricla</span> became the French{" "}
                <span className="un-term">oreille</span>.
              </p>
              <p>
                A schoolmaster wrote down precisely how ordinary people were
                speaking, in the act of telling them to stop doing it, and it is
                the only reason we know. Nobody records the everyday. People do
                record what they object to.
              </p>
            </>
          )}
        </section>

        <section className="un-section">
          <h2>Grammar is not designed. It wears down out of ordinary sentences.</h2>
          <p className="un-lead">
            Nobody sat down and invented the future tense. No committee decided
            that English needed a way to mark politeness, or that French required
            two separate words in order to say no.
          </p>
          <p>
            What happens instead is erosion. An ordinary word gets used in one
            particular position so often that people stop noticing it. It loses
            its original meaning, wears down in the mouth, and ends up as a piece
            of grammatical machinery with no content of its own. The process
            takes centuries, which is long enough that nobody living through it
            can see it happening, and short enough that the written record
            catches the whole thing.
          </p>
          <p>Here is one complete cycle, from beginning to end, in French.</p>

          <HowTo>
            The button brings up the next stage. There are three, and they cover
            roughly eight hundred years.
          </HowTo>

          <div style={{ marginTop: "1.6rem" }}>
            {NEGATION.slice(0, stage + 1).map((t, i) => (
              <div className="un-stage" key={i}>
                <span className="un-stage-n">{i + 1}</span>
                <span className="un-stage-t">{t}</span>
              </div>
            ))}
          </div>

          <button
            className="un-btn"
            onClick={() => setStage((v) => Math.min(v + 1, NEGATION.length - 1))}
            disabled={stage >= NEGATION.length - 1}
          >
            {stage >= NEGATION.length - 1 ? "The cycle is complete" : "Advance the cycle"}
          </button>

          {stage >= NEGATION.length - 1 && (
            <p style={{ marginTop: "2rem" }}>
              English is partway through something of the same kind.{" "}
              <em>Going to</em> was once a statement about walking somewhere. It
              became a statement about intending something. It is now a future
              tense that has lost the ability to take a destination, which is why
              nobody can say <em>I'm going to the shop</em> and mean it in the
              new sense.
            </p>
          )}
        </section>

        <section className="un-section">
          <h2>One family kept the receipts, so the method can be marked.</h2>
          <p className="un-lead">
            Everything above rests on reconstruction, and reconstruction is
            exactly the sort of thing a person could talk themselves into. You
            look at some words, you decide what the ancestor must have been, and
            there is nobody available to contradict you.
          </p>
          <p>
            There is one family where you can check the working, and it is the
            one from the very first section. The Romance languages descend from
            Latin, and Latin is sitting in the library.
          </p>
          <p>
            So do it properly. Reconstruct the ancestor from the children alone,
            without looking. Then look.
          </p>

          <div className="un-table">
            <div className="un-table-cap">The word for ‘horse’</div>
            {HORSE.map(([lang, w]) => (
              <div className="un-row" key={lang}>
                <span className="un-lang">{lang}</span>
                <span className="un-word">{w}</span>
              </div>
            ))}
            {checked && (
              <div className="un-row recon">
                <span className="un-lang">Reconstructed</span>
                <span className="un-word">*caballus</span>
              </div>
            )}
          </div>

          <div className="un-table">
            <div className="un-table-cap">The word for ‘to speak’</div>
            {SPEAK.map(([lang, w]) => (
              <div className="un-row" key={lang}>
                <span className="un-lang">{lang}</span>
                <span className="un-word">{w}</span>
              </div>
            ))}
            {checked && (
              <div className="un-row recon">
                <span className="un-lang">Reconstructed</span>
                <span className="un-word">*parabolare</span>
              </div>
            )}
            <p className="un-table-note">
              Spanish and Portuguese are missing from this second list on
              purpose. They replaced the verb entirely, with{" "}
              <span className="un-term">hablar</span> and{" "}
              <span className="un-term">falar</span>, which come down from a
              different Latin word again. A family is under no obligation to keep
              every word it inherits, and you reconstruct from the branches that
              did keep it.
            </p>
          </div>

          <button className="un-btn" onClick={() => setChecked(true)} disabled={checked}>
            {checked ? "Marked" : "Now check the answers against Latin"}
          </button>

          {checked && (
            <>
              <p style={{ marginTop: "2rem" }}>
                Classical Latin for horse is{" "}
                <span className="un-term">equus</span>. Classical Latin for to
                speak is <span className="un-term">loqui</span>. Neither
                reconstruction matches the textbook, and at first glance the
                method appears to have failed.
              </p>
              <p>
                <strong>It is the exact opposite of a failure.</strong>{" "}
                <span className="un-term">Caballus</span> is a real Latin word,
                and it is attested. It is the everyday term for a nag or a
                workhorse, the word soldiers and farmers actually used.{" "}
                <span className="un-term">Parabolare</span> is late spoken Latin
                for holding forth at somebody.
              </p>
              <p>
                The method did not recover the language of Cicero, because the
                Romance languages are not descended from the language of Cicero.
                They are descended from what people were saying to each other in
                the street. So the reconstruction is correct, and it is correct
                about something that the written record had been quietly hiding
                for two thousand years.
              </p>
            </>
          )}
        </section>

        <section className="un-section">
          <h2>Some of them have no cousins at all.</h2>
          <p>
            Every method on this page needs at least two survivors. You compare
            them, you find the rules, and you run the rules backwards. Take away
            the relatives and there is nothing to compare, and the whole
            machinery has nothing to bite on.
          </p>
          <p>These languages have no relatives.</p>

          <div className="un-quiet">
          <div className="un-orphans">
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
            Basque is spoken by about three quarters of a million people across
            the western Pyrenees, on both sides of the border between Spain and
            France. It is the only language of western Europe that was already
            there before the Indo-European languages arrived, and that is still
            being used today to order a coffee.
          </p>
          <p>
            That is the part worth sitting with for a moment. Basque is not
            strange for being alone. It is a perfectly ordinary language,
            behaving in perfectly ordinary ways. It is simply the last one.
          </p>
          <p>
            Everything it was once related to is gone. Not badly recorded, not
            partially preserved: gone, without a wordlist, without a cousin,
            without a name. Western Europe before Indo-European was full of
            languages, and Basque is the only one anybody will ever be able to
            hear.
          </p>
          <p style={{ color: P.inkSoft, marginBottom: 0 }}>
            There is nothing to open in this section. The comparisons are lost
            forever.
          </p>
          </div>

          <div className="un-colophon">
            Inherited Property · one of six · the unhurried edition
          </div>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   TOPIC TWO — THE OTHER FACE
   ============================================================ */

function TwoSided({ item }) {
  const [back, setBack] = useState(false);
  const side = back ? item.back : item.front;
  return (
    <div>
      <div className={`un-two${back ? " reverse" : ""}`}>
        <div className="un-two-side">
          <span className="un-two-which">{side.tag}</span>
          <span className="un-two-when">{item.when}</span>
        </div>
        <h3>{side.title}</h3>
        {side.body}
        <button className="un-turn" onClick={() => setBack(!back)}>
          {back ? "← Turn it back to the first side" : "Turn it over →"}
        </button>
      </div>
      {item.meanwhile && (
        <div className="un-meanwhile">
          <b>Elsewhere at the same moment</b>
          {item.meanwhile}
        </div>
      )}
    </div>
  );
}

const ORKHON = {
  when: "Mongolia · the 730s",
  front: {
    tag: "Side one of two · the face turned outwards",
    title: "A gracious note about a loyal neighbour",
    body: (
      <>
        <p>
          One face of the monument is written in Chinese. It was composed at the
          court of the Tang emperor, who sent his own craftsmen several hundred
          miles north to cut it into the stone.
        </p>
        <p>
          Imperial inscriptions of this kind follow a well-worn pattern, and this
          one keeps to it faithfully. The dead man is praised. The relationship
          between the two houses is described as close and cordial. The whole
          arrangement is presented as settled, long-standing and agreeable to
          everybody concerned.
        </p>
        <p>
          If this were the only face of the stone, the story would be a simple
          one. A cooperative neighbour on the northern frontier, remembered
          warmly by the greater power he served.
        </p>
      </>
    ),
  },
  back: {
    tag: "Side two of two · the faces turned inwards",
    title: "A warning to his own people",
    body: (
      <>
        <p>
          The other faces are written in Old Turkic, in an alphabet cut
          specifically for the purpose, and the audience has changed completely.
          Bilge Khagan is addressing the Turks directly, in his own voice, and he
          is not being diplomatic in the slightest.
        </p>
        <p>
          His argument is that Chinese generosity is a technique. Sweet words and
          soft silk are how a distant people are drawn in close, and a people
          drawn in close find that they can no longer leave. He points to the
          Turks who went south believing otherwise, and says plainly what became
          of them.
        </p>
        <p>
          <strong>
            He also states why the stone exists. He is putting this somewhere it
            can still be read after everybody who remembers is dead.
          </strong>
        </p>
        <p>
          It worked, although not in the way he intended. Nobody could read the
          alphabet at all until a Danish scholar named Vilhelm Thomsen worked it
          out in the 1890s, more than eleven hundred years later.
        </p>
      </>
    ),
  },
  meanwhile: (
    <>
      Tang China is near its height. The Umayyad caliphate stretches from Spain
      to the borders of India. The Maya cities of Palenque and Tikal are in full
      flourish. And in Northumbria, the previous year, a monk called Bede has
      just finished a history of the English church.
    </>
  ),
};

const MADE = [
  {
    when: "Gaul, now France · the story told from the 600s",
    front: {
      tag: "Side one · the story they told",
      title: "The Franks came from Troy",
      body: (
        <>
          <p>
            The Franks were the people who took over Roman Gaul and gave France
            its name. Their chroniclers gave them a founding migration: their
            ancestors, the story went, left the city of Troy when it fell,
            wandered for generations, and eventually settled in Gaul.
          </p>
          <p>
            It is a very useful pedigree. It makes the Franks cousins of the
            Romans rather than the people who replaced them. It presents their
            arrival in Gaul as a kind of homecoming. And it writes them into the
            single most prestigious story available anywhere in the Latin world.
          </p>
        </>
      ),
    },
    back: {
      tag: "Side two · what the evidence suggests",
      title: "A word the Romans used for a problem",
      body: (
        <>
          <p>
            The name arrives earlier than the story, and from the opposite
            direction. <strong>Frank</strong> appears in Roman writing of the
            third century as a term for a shifting coalition of groups along the
            lower Rhine. It was not the name of a nation with a homeland and a
            memory. It was closer to Roman shorthand for whoever was currently
            causing trouble in that direction.
          </p>
          <p>
            The people so described eventually took the name for themselves,
            kept it, and built a kingdom with it. The kingdom then needed a past,
            because kingdoms always do.
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
        China is being reunified under the Sui and then the Tang. The Arab
        conquests are beginning. Japan is adopting Chinese administration
        wholesale.
      </>
    ),
  },
  {
    when: "The rivers of what is now Russia and Ukraine · the 800s",
    front: {
      tag: "Side one · the story they told",
      title: "The Slavs sent for princes",
      body: (
        <>
          <p>
            The Rus' were the people from whom Russia takes its name, and their
            chronicle, compiled in Kiev, gives a disarmingly tidy account of how
            they came to be ruled.
          </p>
          <p>
            The Slavic peoples of the north, it says, were quarrelling among
            themselves and could not govern. So they sent across the sea to the
            Varangians — Scandinavians, in other words — and asked them to come
            and take charge. Three brothers accepted the invitation, and the
            eldest, Rurik, founded a dynasty that would still be ruling six
            centuries later.
          </p>
        </>
      ),
    },
    back: {
      tag: "Side two · what the evidence suggests",
      title: "Written two hundred years later, by people who needed it",
      body: (
        <>
          <p>
            Two things sit awkwardly with that account. The first is the name
            itself. <span className="un-term">Rus'</span> most likely reached
            Slavic through Finnish, from an Old Norse word connected with rowing
            and the men who did it. That points towards Scandinavians turning up
            rather than being sent for.
          </p>
          <p>
            The second is the date. The chronicle was put together roughly two
            hundred years after the events it describes, by monks working for the
            descendants of the dynasty whose right to rule it explains.
          </p>
          <p>
            <strong>
              An invitation is a far better story than an arrival.
            </strong>{" "}
            It makes the rule consensual from the very first day, which is
            precisely what a dynasty two centuries in would want on the record.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        Baghdad is probably the largest city on earth. The Maya cities of Central
        America are in the middle of their collapse. Southern Africa is trading
        into the Indian Ocean.
      </>
    ),
  },
  {
    when: "The steppe north of the Caucasus · the 800s",
    front: {
      tag: "Side one · the story they told",
      title: "A king held a debate and chose",
      body: (
        <>
          <p>
            The Khazars ruled a large and wealthy territory on the grasslands
            between the Black Sea and the Caspian. Their own account describes a
            decision taken properly and in the open.
          </p>
          <p>
            The ruler summoned representatives of Christianity, Islam and
            Judaism, and heard each of them out in turn. When he pressed the
            Christian and the Muslim, each conceded that Judaism had come first.
            He drew what the story presents as the obvious conclusion, and
            converted.
          </p>
        </>
      ),
    },
    back: {
      tag: "Side two · what the evidence suggests",
      title: "A move on a board with two very large players",
      body: (
        <>
          <p>
            Something real did happen. Coins, burial practice and the accounts of
            neighbouring Arab and Byzantine writers all point to a genuine
            conversion, although historians still argue about its date and about
            how far beyond the ruling class it ever went.
          </p>
          <p>
            The staged debate is a different matter. Contests of this kind between
            three faiths are a recognised literary form of the period, and they
            turn up wherever a conversion needs accounting for.
          </p>
          <p>
            <strong>
              Look at the position it produces rather than at the theology.
            </strong>{" "}
            The Khazars sat between two expanding empires, each of which claimed
            authority over its own co-religionists wherever in the world they
            happened to live. Taking a third faith placed the Khazar realm
            outside both of those claims at once.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        Byzantine iconoclasm has recently ended. The Abbasid caliphate is past
        its height. The kingdom of Srivijaya controls the shipping straits of
        Southeast Asia.
      </>
    ),
  },
];

const TRANSLATED = [
  {
    when: "Fujian, on the south coast of China",
    front: {
      tag: "Side one · what you would see",
      title: "A seated Buddha in a small stone hall",
      body: (
        <>
          <p>
            In a small stone hall in Fujian there is a seated figure in the
            posture you would expect of a Buddha, inside a building that reads
            as a perfectly ordinary local temple.
          </p>
          <p>
            For a very long time that is exactly what everybody took it to be.
            Visitors came and made offerings accordingly.
          </p>
        </>
      ),
    },
    back: {
      tag: "Side two · what it actually is",
      title: "Mani, dressed for the neighbourhood",
      body: (
        <>
          <p>
            The figure is not a Buddha. It is Mani, a religious teacher born in
            Mesopotamia in the third century, and the hall is a Manichaean one.
          </p>
          <p>
            Manichaeism was for several hundred years a genuinely
            intercontinental religion, and it spent a thousand years travelling
            east. At every stage it described itself using whatever religious
            vocabulary was already on the ground where it arrived. In the Iranian
            world it spoke in Zoroastrian terms. Further east it borrowed from
            Buddhism so completely that its founder ended up with a Buddha's
            title.
          </p>
          <p>
            <strong>
              It is tempting to call that a disguise. It is more accurate to call
              it the price of travelling at all.
            </strong>{" "}
            A religion crossing a border has no choice but to be said in words
            that already exist on the other side, and those words arrive with
            meanings of their own already attached.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        The Silk Road is carrying its heaviest traffic. Sogdian, a language now
        almost entirely extinct, is the trade tongue of Central Asia. The Chinese
        capital of Chang'an holds perhaps a million people.
      </>
    ),
  },
  {
    when: "Constantinople, now Istanbul · 726 to 843",
    front: {
      tag: "Side one · the argument as stated",
      title: "Whether to have pictures in church",
      body: (
        <>
          <p>
            The Byzantine empire was what remained of the Roman empire in the
            east, ruled from Constantinople, and for well over a century it tore
            itself apart over religious images.
          </p>
          <p>
            Stated flatly, it can sound like a dispute about decoration. Images
            were removed from churches, then restored, then removed again.
            Emperors and patriarchs lined up on both sides throughout, and the
            argument outlasted most of the people having it.
          </p>
        </>
      ),
    },
    back: {
      tag: "Side two · the argument as felt",
      title: "Whether an image participates in what it shows",
      body: (
        <>
          <p>
            The question underneath is not about taste at all. It is about what
            kind of thing an image actually is.
          </p>
          <p>
            If a painting of a saint is pigment and board and nothing more, then
            bowing to it is foolish at best and idolatry at worst. If the image
            somehow participates in the person it depicts, then destroying one is
            an act of violence committed against that person.
          </p>
          <p>
            <strong>Those two positions cannot be met in the middle.</strong>{" "}
            They do not disagree about how much respect an object deserves, which
            would be negotiable. They disagree about what the object is.
            Monasteries were emptied and careers ended over it, on and off, for
            more than a hundred years.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        Charlemagne is crowned in Rome midway through. Baghdad is founded in 762.
        The vast Buddhist monument of Borobudur is under construction in Java.
      </>
    ),
  },
  {
    when: "Baghdad · the 800s and 900s",
    front: {
      tag: "Side one · what it looks like",
      title: "Books moved from one language to another",
      body: (
        <>
          <p>
            The Abbasids were the dynasty that ruled the Islamic world from
            Baghdad, and over roughly two centuries they paid for one of the
            largest translation projects in history.
          </p>
          <p>
            Greek works on medicine, mathematics, astronomy and philosophy were
            rendered into Arabic, often by way of Syriac. Caliphs and wealthy
            Baghdad families funded it, and it ran for generations.
          </p>
          <p>
            Put like that, it sounds like a transfer operation. Books in one
            language, and then the same books in another.
          </p>
        </>
      ),
    },
    back: {
      tag: "Side two · what it actually was",
      title: "A language acquiring words it did not have",
      body: (
        <>
          <p>
            It could not possibly be a straight transfer, because the vocabulary
            did not exist yet.
          </p>
          <p>
            Greek philosophy draws distinctions for which Arabic had no settled
            words. The translators had to build the terms, argue about them, and
            reach agreements — and every later reader inherited those agreements
            without any sign that a decision had ever been taken. One translator,
            Hunayn ibn Ishaq, had a reputation for chasing a better manuscript
            across provinces rather than working from a poor copy.
          </p>
          <p>
            <strong>The consequences run a very long way downstream.</strong>{" "}
            Much of Aristotle reached Latin Europe centuries later through this
            Arabic, which means that European readers received a Greek
            philosopher with Baghdad's rulings about what his words meant already
            built into him.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        The Vikings are in Ireland and Normandy. Tang China is collapsing into
        the Five Dynasties. The empire of Ghana is taxing the gold roads of West
        Africa.
      </>
    ),
  },
];

const UNMEANT = [
  {
    when: "Southern Spain · names still in daily use",
    front: {
      tag: "Side one · what it is now",
      title: "A river in Andalusia",
      body: (
        <p>
          The Guadalquivir runs through Córdoba and Seville and out to the
          Atlantic. Spaniards say the name without thinking about it, in the way
          you would say the name of your nearest main road.
        </p>
      ),
    },
    back: {
      tag: "Side two · what it says",
      title: "Arabic for ‘the great valley’",
      body: (
        <>
          <p>
            Southern Spain was ruled from Arabic-speaking courts for something
            close to eight hundred years, and the name is Arabic:{" "}
            <span className="un-term">al-wādī al-kabīr</span>, the great valley,
            worn down by centuries of Spanish mouths into a single word.
          </p>
          <p>
            It has a great deal of company. Guadalajara, Guadalupe, Guadiana and
            a long list of others all open the same way, and Andalusia itself
            comes from <span className="un-term">al-Andalus</span>. Plotted on a
            map, those names show where Arabic-speaking populations lived, and
            roughly for how long.
          </p>
          <p>
            <strong>None of it was recorded deliberately.</strong> Nobody names a
            river in order to tell the future about settlement patterns. They
            named it because it needed a name, and that is exactly why the
            evidence holds.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        Córdoba is among the largest cities in the world. In northern France,
        Charlemagne's scribes are inventing the lower-case letters you are
        reading this in.
      </>
    ),
  },
  {
    when: "The Persian and Arabic world · a word going soft",
    front: {
      tag: "Side one · what it is now",
      title: "A couch",
      body: (
        <p>
          A divan is a long low seat without a back, the sort of thing that ends
          up in a hotel lobby or a waiting room. The word reached English through
          French, and French had it from Turkish, and by the time it arrived it
          carried no trace at all of where it began.
        </p>
      ),
    },
    back: {
      tag: "Side two · what it was",
      title: "A register of who gets paid",
      body: (
        <>
          <p>
            It started as <span className="un-term">dīwān</span>, a Persian and
            then Arabic word for an administrative register: the list of who was
            entitled to be paid.
          </p>
          <p>
            From there it moved by entirely ordinary steps. The register gave its
            name to the office that kept it. The office gave its name to the
            council that met there. The council gave its name to the long
            cushioned bench that the council sat on. And eventually the bench was
            all that was left.
          </p>
          <p>
            <strong>The register itself was an improvisation.</strong> Somebody
            had the problem of paying an army, invented a mechanism for it, and
            the mechanism outlived the army, the office, the council and the
            empire, and ended up as a piece of furniture with a foreign name.
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        Byzantium is reorganising its provinces around soldiers who farm. Japan
        is building a Chinese-style bureaucracy that it will quietly stop using.
      </>
    ),
  },
  {
    when: "Northumbria · finished in 731",
    front: {
      tag: "Side one · what he meant to do",
      title: "Condemn the British church",
      body: (
        <>
          <p>
            Bede was a monk in the north of England and the finest historian
            anybody in western Europe produced for several centuries. He had a
            low opinion of the British church — meaning the Christianity of the
            Britons, who had been in Britain before the English arrived.
          </p>
          <p>
            It calculated Easter by the wrong method. Its clergy wore the wrong
            haircut. And worst of all, in his view, it had made no serious effort
            to convert the incoming English. He set the complaint out at length,
            and then moved on to the people he approved of.
          </p>
        </>
      ),
    },
    back: {
      tag: "Side two · what he actually did",
      title: "Preserve almost the only description of it",
      body: (
        <>
          <p>
            The British church left very little writing of its own. What survives
            about how it reckoned the calendar, how it organised itself, what its
            clergy looked like and what it cared about comes to a substantial
            degree from the man explaining why all of it was wrong.
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
        The Orkhon stones from the first section go up the following year, four
        thousand miles to the east.
      </>
    ),
  },
  {
    when: "North-east London · recorded in the 1000s",
    front: {
      tag: "Side one · what it is now",
      title: "A stop on the Victoria line",
      body: (
        <p>
          Walthamstow. A postcode, a street market, the far end of an
          Underground line. Several hundred thousand people say the name every
          day, meaning nothing whatsoever by it beyond where they are going.
        </p>
      ),
    },
    back: {
      tag: "Side two · what it says",
      title: "Wilcumestōw, and an argument nobody can settle",
      body: (
        <>
          <p>
            The ending is Old English <span className="un-term">stōw</span>,
            meaning a place, and used particularly for places where people
            gathered or that were held to be sacred.
          </p>
          <p>
            The first part is where it stops being straightforward. It is either{" "}
            <span className="un-term">wilcuma</span>, a welcome guest, or a
            personal name, Wilcume, belonging to whoever held the land. Both are
            perfectly good readings, and the surviving records contain nothing at
            all that would settle the question.
          </p>
          <p>
            <strong>
              So the name means either the welcoming place or one man's place,
              and it has quietly meant both at once for a thousand years.
            </strong>
          </p>
        </>
      ),
    },
    meanwhile: (
      <>
        Essex sits inside the boundary that King Alfred and the Danish leader
        Guthrum drew across England. Córdoba is among the great cities of the
        world. China is consolidating under the Song after the fall of the Tang.
      </>
    ),
  },
];

const MUGH = {
  when: "A mountain in Tajikistan · 722",
  front: {
    tag: "Side one · what was found",
    title: "A bundle of ordinary paperwork",
    body: (
      <>
        <p>
          Found on a mountainside above the Zarafshan valley in the 1930s: a
          bundle of documents on leather, wood and paper. Legal contracts,
          accounts, correspondence, a marriage agreement.
        </p>
        <p>
          It is exactly the sort of material that any administration anywhere
          produces continuously and that nobody ever thinks to preserve.
        </p>
      </>
    ),
  },
  back: {
    tag: "Side two · what it was",
    title: "The last months of a man who lost",
    body: (
      <>
        <p>
          The papers belonged to Divashtich, the ruler of Panjikent, a
          Sogdian-speaking city on the Silk Road. When the Arab armies reached
          his region he withdrew to a fortress on that mountain and took his
          archive with him. He held out, negotiated a surrender, and was executed
          anyway. The documents stayed exactly where he left them for twelve
          hundred years.
        </p>
        <p>
          Every one of them can be read. They have been catalogued, translated
          and published. The legal formulae are intact and the handwriting is
          clear.
        </p>
        <p>
          <strong>None of it reaches him.</strong> A contract about a garden tells
          you the price of a garden. He kept the records that a man in his
          position kept, and a man in his position does not write down what he
          thought was going to happen.
        </p>
      </>
    ),
  },
  meanwhile: (
    <>
      Sogdian is the common language from Samarkand to the Chinese frontier.
      Within a few centuries it will have one small descendant left, spoken in a
      single mountain valley, where a few thousand people speak it still.
    </>
  ),
};

function TopicTwo() {
  const [guess, setGuess] = useState(null);

  return (
    <div className="un-root">
      <div className="un-wrap">
        <header className="un-mast">
          <p className="un-eyebrow">Two of six · Early medieval history</p>
          <h1>The Other Face</h1>
          <p className="un-standfirst">
            In the centuries after the Roman empire fell, a great many peoples
            across the world were in the middle of inventing themselves: taking
            names, drawing borders, and acquiring ancestors.
            <br />
            <br />
            A surprising amount of what they said about it survives. Almost none
            of it was written for us, and that turns out to be exactly why it can
            be trusted.
          </p>
        </header>

        <section className="un-section">
          <h2>One monument, two languages, two incompatible accounts.</h2>
          <p className="un-lead">
            Historians call the centuries after the fall of the Roman empire the
            early medieval period. The older nickname, the Dark Ages, was never
            really about the people who lived through it. It was about the
            sources.
          </p>
          <p>
            There is far less surviving writing from these six hundred years than
            from the periods on either side of them, and most of what does
            survive was produced by somebody with a case to make.
          </p>
          <p>
            That sounds like a problem, and it is also the opening.{" "}
            <strong>
              A document that is arguing for something usually tells you who it
              was arguing with.
            </strong>
          </p>

          <h3>The clearest example anybody has</h3>
          <p>
            In the 730s, in a valley in central Mongolia, two brothers of the
            ruling family of the Turkic khaganate raised carved stones for their
            dead. A khaganate is a steppe empire; this one was a serious military
            power on the northern border of Tang China, which was at that moment
            the richest and most sophisticated state on earth.
          </p>
          <p>
            The stones carry the oldest substantial writing in any Turkic
            language — the family that includes modern Turkish. They also carry a
            second inscription, in Chinese. The two texts do not say the same
            thing, because they were meant for two different audiences who were
            never going to read them side by side.
          </p>

          <HowTo>
            Every exhibit on this page has two sides. Read the first, then press
            the button underneath to turn it over. You can turn it back again at
            any point.
          </HowTo>

          <TwoSided item={ORKHON} />

          <p style={{ marginTop: "2rem" }}>
            Every exhibit that follows is built the same way. There is an account
            meant to travel, and an account meant to stay at home, and the useful
            thing is very often the distance between the two.
          </p>
        </section>

        <section className="un-section">
          <h2>Most of these peoples had only recently decided who they were.</h2>
          <p className="un-lead">
            A nation almost always presents itself as old. That is what national
            stories are for. They explain that the people in charge have been
            here all along, that the borders follow something real, and that the
            whole arrangement is natural rather than recent.
          </p>
          <p>
            In this period the claim is often demonstrably new. Groups that had
            existed for two or three generations were acquiring names, territory
            and ancestors at speed, and because it happened so recently you can
            frequently see the joins.
          </p>
          <p>
            Before you read them, one question, because your answer is a fair
            sample of what most people bring to this period.
          </p>

          <Question
            text="Of these three origin stories, which would you expect to hold up best against the evidence?"
            options={[
              { key: "franks", label: "The Franks, descended from refugees out of Troy." },
              { key: "rus", label: "The Rus', who were invited in to rule by the people they ruled." },
              { key: "khazars", label: "The Khazars, whose king converted after hearing all three faiths argued out." },
              { key: "none", label: "None of them. Origin stories are written by the winners." },
            ]}
            value={guess}
            onPick={setGuess}
          />

          {guess && guess !== "none" && (
            <div className="un-answer">
              <p>
                None of the three holds up as told, which is exactly what an
                origin story is for.
              </p>
              <p>
                The one you picked is the one whose purpose is best disguised,
                which is a genuine compliment to whoever wrote it.
              </p>
            </div>
          )}
          {guess === "none" && (
            <div className="un-answer">
              <p>
                Correct, and it does not get you out of the interesting part.
              </p>
              <p>
                Knowing that a story was written to do a job tells you nothing
                about which job it was, who it was for, or who it was aimed
                against. That is where the evidence actually lives.
              </p>
            </div>
          )}

          {guess &&
            MADE.map((m, i) => <TwoSided item={m} key={i} />)}
        </section>

        <section className="un-section">
          <h2>Meaning does not survive a border intact.</h2>
          <p className="un-lead">
            Religions travelled enormous distances in these centuries, and they
            arrived in places that already had gods, temples and settled ways of
            talking about all of it.
          </p>
          <p>
            A missionary cannot simply hand somebody a set of ideas. In order to
            say anything at all, you have to use words your audience already
            knows, and those words arrive carrying meanings of their own. So the
            thing that gets delivered is never quite the thing that set out.
            Decisions get made in the crossing that nobody sat down and made.
          </p>
          <p>
            Three cases follow. A religion that changed its clothes at every
            border. An empire that tore itself apart over what a picture is. And
            a translation project that had to invent the vocabulary it needed
            while it was already using it.
          </p>
          {TRANSLATED.map((m, i) => (
            <TwoSided item={m} key={i} />
          ))}
        </section>

        <section className="un-section">
          <h2>The best evidence was left by people who were not trying to leave any.</h2>
          <p className="un-lead">
            Everything so far was made by somebody with an argument. Chronicles,
            inscriptions and origin stories are all aimed at a reader, which
            means they can be checked against other evidence but never entirely
            taken at face value.
          </p>
          <p>
            There is a second kind of evidence that is much duller and very much
            harder to fake. Nobody names a river in order to inform the future.
            Nobody sets up a government office so that it will be remembered.
            Things like these record how people lived as a side effect of people
            living, and a side effect has no motive to mislead anybody.
          </p>
          <p>
            Four of them below. The third is the strongest kind of all, where
            somebody preserves a thing precisely by attacking it.
          </p>
          {UNMEANT.map((m, i) => (
            <TwoSided item={m} key={i} />
          ))}
        </section>

        <section className="un-section">
          <h2>And then the ones you cannot get to.</h2>
          <p className="un-lead">
            One more exhibit, and it behaves differently from all the rest.
          </p>
          <p>
            Everything above rewards turning over. There is an account on the
            first side and, on the second, a motive, an older name or a quieter
            version of events, and the second side is the one you actually
            wanted.
          </p>
          <p>This one turns over exactly like the others.</p>

          <TwoSided item={MUGH} />

          <p style={{ marginTop: "2.2rem" }}>
            Nothing is missing from the Mugh documents. They have been read,
            catalogued and published in full. Every legal formula is intact and
            the handwriting is clear.
          </p>
          <p>
            What is not there is Divashtich himself. Not the man's motives. Not
            what he believed he was doing on that mountain. Not whether he
            expected the terms of his surrender to be honoured.
          </p>
          <p>
            He kept the sort of records that a person keeps, and{" "}
            <strong>
              a person does not write down the thing you want to know.
            </strong>
          </p>
          <p style={{ color: P.inkSoft }}>
            The other face is always there. It is simply not always the one you
            were looking for.
          </p>

          <div className="un-colophon">
            The Other Face · two of six · the unhurried edition
          </div>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   SHARED — a stepped exhibit
   ============================================================ */

function Stepped({ where, title, steps, extra }) {
  const [i, setI] = useState(0);
  return (
    <div className="un-two" style={{ borderLeft: `3px solid ${P.deepSoft}` }}>
      <div className="un-two-side">
        <span className="un-two-which">
          Step {i + 1} of {steps.length} · {steps[i].label}
        </span>
        <span className="un-two-when">{where}</span>
      </div>
      <h3>{title}</h3>
      {extra && i === 0 && extra}
      {steps[i].body}
      <button
        className="un-turn"
        onClick={() => setI((v) => (v + 1) % steps.length)}
      >
        {i === steps.length - 1
          ? "← Back to the beginning"
          : `Next: ${steps[i + 1].label} →`}
      </button>
    </div>
  );
}

/* ============================================================
   TOPIC THREE — THE BREAK
   ============================================================ */

const LIGHTS = [
  { name: "Ugarit, a port on the Syrian coast", note: "burned, and never reoccupied", survives: false },
  { name: "Hattusa, capital of the Hittite empire", note: "abandoned", survives: false },
  { name: "Pylos, a palace in southern Greece", note: "burned", survives: false },
  { name: "Mycenae and Tiryns", note: "destroyed", survives: false },
  { name: "Emar, a city on the Euphrates", note: "destroyed", survives: false },
  { name: "Linear B, the Greek writing system", note: "unreadable within a generation", survives: false },
  { name: "The correspondence between great kings", note: "no further letters", survives: false },
  { name: "Egypt", note: "holds on, much reduced", survives: true },
  { name: "Assyria", note: "holds", survives: true },
  { name: "Shang China", note: "unaffected, two more centuries to run", survives: true },
  { name: "The Andes", note: "unaffected, another world entirely", survives: true },
];

function TopicThree() {
  const [guess, setGuess] = useState(null);
  const [broken, setBroken] = useState(false);

  return (
    <div className="un-root">
      <div className="un-wrap">
        <header className="un-mast">
          <p className="un-eyebrow">Three of six · The Bronze Age</p>
          <h1>The Break</h1>
          <p className="un-standfirst">
            Three thousand years ago the eastern Mediterranean was a connected
            world of kingdoms, ports and long trade routes. Within about fifty
            years most of it was destroyed or abandoned.
            <br />
            <br />
            The people who came afterwards lived among the ruins, could see them
            perfectly well, and had lost the ability to read a single word of the
            writing left on them.
          </p>
        </header>

        <section className="un-section">
          <h2>For a few centuries, the world was joined up.</h2>
          <p className="un-lead">
            The Bronze Age takes its name from a metal, and the metal is the
            reason for everything else. Bronze is copper mixed with tin. Copper
            is common enough in the ancient world. Tin is rare, and the places
            that had it were nowhere near the places that needed it.
          </p>
          <p>
            So a technology that every state depended on, for tools and for
            weapons alike, could only exist if goods moved reliably across
            enormous distances. That requirement built something: a network of
            kingdoms, ports and agreements running from Greece to Mesopotamia and
            out towards Afghanistan and the Baltic.
          </p>
          <p>Two objects show what that looked like from the inside.</p>

          <HowTo>
            Each exhibit has two steps. Read the first, then press the button to
            move to the second.
          </HowTo>

          <Stepped
            where="Off the Turkish coast · about 1300 BC"
            title="One ship, and most of the known world inside it"
            extra={
              <div className="un-fossil-kids" style={{ marginBottom: "1rem" }}>
                <div><span className="src">from Cyprus </span>ten tonnes of copper, cast in ox-hide ingots</div>
                <div><span className="src">from somewhere east </span>a tonne of tin, roughly the ratio bronze needs</div>
                <div><span className="src">from the Baltic </span>amber</div>
                <div><span className="src">from Africa </span>ebony, hippo and elephant ivory, ostrich eggshell</div>
                <div><span className="src">from Egypt </span>a gold scarab carrying Nefertiti's name</div>
                <div><span className="src">from the Levant </span>jars of resin</div>
                <div><span className="src">from Greece and Cyprus </span>pottery, weapons, tools</div>
              </div>
            }
            steps={[
              {
                label: "the manifest",
                body: (
                  <p>
                    A sponge diver spotted metal slabs on an underwater slope off
                    the coast of Turkey in 1982. Eleven diving seasons later, the
                    wreck had produced the most complete cargo anybody has from
                    the entire Bronze Age. The list above is a fair summary of
                    what was in it.
                  </p>
                ),
              },
              {
                label: "what it tells you",
                body: (
                  <>
                    <p>
                      Copper from one island and tin from thousands of miles away
                      had to meet in the same hull, because bronze is an alloy and
                      neither metal is much use on its own.
                    </p>
                    <p>
                      Which means the technology that gives the age its name could
                      not exist unless goods crossed continents reliably. The
                      network was not a luxury laid over the period. It was
                      holding the period up.
                    </p>
                    <p>
                      <strong>
                        Nobody knows whose ship it was or where it was going.
                      </strong>{" "}
                      The single most informative object of the period is
                      anonymous. And among the cargo was a wooden writing board
                      with an ivory hinge, of the kind that held wax pages. The
                      wax dissolved. The book survived and the words did not.
                    </p>
                  </>
                ),
              },
            ]}
          />

          <Stepped
            where="Amarna, in Egypt · the 1300s BC"
            title="Kings who had never met, writing to each other as brothers"
            steps={[
              {
                label: "what was found",
                body: (
                  <>
                    <p>
                      Around three hundred and fifty clay tablets turned up at the
                      site of an abandoned Egyptian capital. They are the
                      diplomatic correspondence of the Egyptian court with the
                      other great powers of the day: Babylonia, Assyria, the
                      Hittites, Cyprus, and a long list of smaller rulers in
                      between.
                    </p>
                    <p>
                      Kings address one another as brother, arrange marriages, ask
                      for gold, and complain at length when a gift arrives late or
                      turns out to be of lower quality than promised.
                    </p>
                  </>
                ),
              },
              {
                label: "what it tells you",
                body: (
                  <>
                    <p>
                      They are written in Akkadian, which was the first language of
                      none of the great kings involved. It had become the common
                      tongue of international business, in the way that people who
                      share no native language today will negotiate in a third.
                    </p>
                    <p>
                      <strong>
                        A shared working language is not something anybody sets up
                        in an afternoon.
                      </strong>{" "}
                      It implies generations of scribes trained to the same
                      standard in different countries, a stable convention about
                      how a letter should open, and enough traffic to make all of
                      that worth the expense.
                    </p>
                    <p>
                      Which also tells you what sort of thing can break. The whole
                      system runs on everybody continuing to answer.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </section>

        <section className="un-section">
          <h2>Two of them refused the template.</h2>
          <p className="un-lead">
            Before the exhibits, a question, because the answer you give is what
            this section is actually about.
          </p>
          <p>
            Imagine archaeologists working on a Bronze Age city. Several hundred
            hectares. Tens of thousands of people. Standardised weights, planned
            streets, brick made to consistent proportions. They have been digging
            for a hundred years.
          </p>

          <Question
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
            <div className="un-answer">
              <p>
                <strong>Whichever you picked, it has not been found.</strong> Not
                one of those five, at any site of the Indus civilisation, in a
                century of excavation.
              </p>
              <p>
                The expectation is entirely reasonable and it comes from
                somewhere. There is a standard picture of what an early
                civilisation looks like, assembled mostly from Mesopotamia and
                Egypt, in which power announces itself in stone.
              </p>
              <p>
                That picture is a description of some places rather than a rule
                about all of them, and carrying it into these two societies
                guarantees that you will misread what you are looking at.
              </p>
            </div>
          )}

          {guess && (
            <>
              <Stepped
                where="Pakistan and north-west India · 2600 to 1900 BC"
                title="The largest of them all, and nobody can find the king"
                steps={[
                  {
                    label: "what was dug up",
                    body: (
                      <>
                        <p>
                          By area this was the biggest civilisation of the Bronze
                          Age. Its cities were laid out on street grids, built
                          from fired brick made to consistent proportions, and
                          drained by covered sewer systems that would not be
                          matched anywhere for thousands of years.
                        </p>
                        <p>
                          Weights recovered from sites hundreds of miles apart
                          agree with one another to a fraction of a gram.
                        </p>
                      </>
                    ),
                  },
                  {
                    label: "what is not there",
                    body: (
                      <>
                        <p>
                          Standardisation on that scale normally means somebody is
                          enforcing it, and enforcement normally leaves traces: a
                          palace, a rich burial, a temple, an image of somebody
                          looking as though they are in charge.
                        </p>
                        <p>
                          <strong>None of it has been found.</strong> No securely
                          identified palace, no royal tomb, no unambiguous
                          depiction of a ruler, and very little sign of organised
                          warfare.
                        </p>
                        <p>
                          Either power was arranged in some way that leaves no
                          trace of the kind we know how to look for, or we have
                          spent a century looking for the wrong things.
                        </p>
                      </>
                    ),
                  },
                ]}
              />

              <Stepped
                where="The Supe valley, Peru · from about 2600 BC"
                title="Monuments, no pottery, and nothing to read"
                steps={[
                  {
                    label: "what was dug up",
                    body: (
                      <>
                        <p>
                          While the pyramids were going up in Egypt, people in a
                          river valley north of modern Lima were raising platform
                          mounds and sunken circular plazas at a site now called
                          Caral. It is among the oldest urban complexes anywhere
                          in the world.
                        </p>
                        <p>
                          They did it without pottery, which had not reached them,
                          and with no evidence so far of fortification, weaponry
                          or the destruction layers that mark a conquest.
                        </p>
                      </>
                    ),
                  },
                  {
                    label: "what is not there",
                    body: (
                      <>
                        <p>
                          <strong>They also did it without writing.</strong> The
                          Indus at least left a script, and being unable to read a
                          script is a different problem from there being nothing
                          to read.
                        </p>
                        <p>
                          Caral left knotted cords and architecture. Whatever
                          these people understood themselves to be doing, the only
                          surviving account of it is the shape of what they built.
                          It is the most opaque society on this page by a
                          considerable distance.
                        </p>
                      </>
                    ),
                  },
                ]}
              />
            </>
          )}
        </section>

        <section className="un-section">
          <h2>Some things had not yet become inevitable.</h2>
          <p className="un-lead">
            Writing, authorship and astronomy all feel like fixed features of
            human life. The sort of thing that was always going to happen, and
            always going to take roughly the shape it took.
          </p>
          <p>
            This period is early enough that you can catch several of them before
            they settled, while the decisions were still being made and could
            have gone otherwise. The last of the four is here for a different
            reason, and it will matter shortly.
          </p>

          <Stepped
            where="Uruk, southern Iraq · about 3300 BC"
            title="Writing begins as a warehouse problem"
            steps={[
              {
                label: "what the tablets say",
                body: (
                  <>
                    <p>
                      The oldest substantial writing anybody has is not
                      literature, law or scripture. It is stock control. The
                      earliest tablets record quantities of grain, beer, textiles
                      and livestock, and who was answerable for them.
                    </p>
                    <p>
                      It grew out of an older habit of sealing small clay tokens
                      inside clay envelopes and marking the outside to show what
                      was inside, until somebody noticed the tokens had become
                      redundant.
                    </p>
                  </>
                ),
              },
              {
                label: "why that matters",
                body: (
                  <>
                    <p>
                      <strong>
                        For several centuries the system cannot record a sentence.
                      </strong>{" "}
                      It has signs for commodities and numbers and almost nothing
                      for the words in between.
                    </p>
                    <p>
                      So the thing that would eventually carry epic poetry, law,
                      correspondence and every argument anybody has ever written
                      down spent its first stretch of existence unable to express
                      anything except how much barley was in the shed. Nobody
                      designed it to become what it became.
                    </p>
                  </>
                ),
              },
            ]}
          />

          <Stepped
            where="Ur, southern Iraq · about 2300 BC"
            title="The first person to put her name to her own work"
            steps={[
              {
                label: "what survives",
                body: (
                  <>
                    <p>
                      Enheduanna was the daughter of Sargon of Akkad and high
                      priestess of the moon god at Ur. A body of hymns comes down
                      attached to her name, and by long convention she is the
                      earliest author in history who can be called by one.
                    </p>
                    <p>
                      She writes about herself in trouble: driven from her office,
                      appealing to the goddess Inanna, describing what the loss of
                      position felt like from the inside.
                    </p>
                  </>
                ),
              },
              {
                label: "how firm it is",
                body: (
                  <>
                    <p>
                      <strong>The attribution is not beyond argument.</strong> The
                      surviving copies were made centuries after she lived, and
                      scholars differ over how much of the text is hers and how
                      much accrued to a famous name later on.
                    </p>
                    <p>
                      That the question can be asked at all is the novelty worth
                      noticing. Before this there is a great deal of writing and
                      nobody to attribute any of it to, so there is no earlier
                      case where the argument would even be possible.
                    </p>
                  </>
                ),
              },
            ]}
          />

          <Stepped
            where="Nebra, central Germany · about 1600 BC"
            title="An object revised by successive owners"
            steps={[
              {
                label: "the object",
                body: (
                  <p>
                    A bronze disc about the size of a dinner plate, inlaid with
                    gold: a sun or full moon, a crescent, a scatter of stars, and
                    a tight cluster usually read as the Pleiades. It is the oldest
                    concrete depiction of the night sky anybody has found.
                  </p>
                ),
              },
              {
                label: "what was done to it",
                body: (
                  <>
                    <p>
                      It did not stay the same. Gold arcs were added along the
                      edges later, marking how far along the horizon the sun rises
                      and sets across the year. A further curved band went on
                      after that. Later still, somebody punched holes around the
                      rim, and then it went into the ground.
                    </p>
                    <p>
                      <strong>
                        Each modification is a different generation deciding what
                        the object was for.
                      </strong>{" "}
                      It is not a finished statement of what these people
                      believed. It is an argument still in progress, stopped at
                      the point where somebody buried it.
                    </p>
                  </>
                ),
              },
            ]}
          />

          <Stepped
            where="Anyang, northern China · about 1250 BC"
            title="The one that never stopped"
            steps={[
              {
                label: "what they wrote on",
                body: (
                  <>
                    <p>
                      Diviners of the Shang dynasty applied heat to ox shoulder
                      blades and turtle shells until they cracked, read the cracks
                      as answers, and inscribed the question alongside. Will the
                      harvest hold. Will the king's toothache pass. Is a
                      particular ancestor responsible for the trouble.
                    </p>
                    <p>
                      These are the oldest Chinese writings anybody has, and they
                      are somebody's actual anxieties rather than an official
                      account of anything.
                    </p>
                  </>
                ),
              },
              {
                label: "why it is here",
                body: (
                  <>
                    <p>
                      <strong>
                        Keep this one in mind, because it is the control for
                        everything that follows.
                      </strong>
                    </p>
                    <p>
                      The script on these bones is the direct ancestor of the
                      characters written in China this morning. The line of
                      descent has never once been cut, so anyone who learns the
                      modern system can be walked back three thousand years to
                      the shells and read them.
                    </p>
                    <p>
                      Nothing else on this page can say that, and the next section
                      is about why.
                    </p>
                  </>
                ),
              },
            ]}
          />
        </section>

        <section className="un-section">
          <h2>Then, in about fifty years, most of it stopped.</h2>
          <p className="un-lead">
            Between roughly 1200 and 1150 BC, city after city in the eastern
            Mediterranean and the Near East was destroyed or abandoned. Some were
            burned. Some were simply walked away from. The trade routes emptied,
            the correspondence stopped, and the palace administrations that had
            run the whole system ceased to exist.
          </p>
          <p>
            Historians still argue about the cause, and the honest answer is that
            there probably is not one. Drought, earthquake, migration, warfare and
            the fragility of a system in which every state depended on every other
            are all somewhere in the mix.
          </p>
          <p>
            <strong>
              What matters here is not why it happened but what it did to the
              record.
            </strong>{" "}
            Below is a list of things that were running in 1200 BC. Some of them
            stop. Some of them do not, and noticing which is which is the whole
            point of the exercise.
          </p>

          <HowTo>
            Press the button underneath the list to run the collapse. You can
            put it all back afterwards.
          </HowTo>

          <div className={`un-dimmed${broken ? " out" : ""}`} style={{ marginTop: "1.6rem" }}>
            {LIGHTS.map((l, i) => (
              <div
                key={l.name}
                className="un-stage"
                style={{
                  borderLeftColor:
                    broken && !l.survives ? P.rule : broken ? P.deep : P.markSoft,
                  opacity: broken && !l.survives ? 0.5 : 1,
                  filter: broken && l.survives ? "saturate(6) brightness(1.02)" : "none",
                  transition:
                    "opacity 600ms ease, border-color 600ms ease, filter 600ms ease",
                  transitionDelay: broken ? `${i * 150}ms` : "0ms",
                }}
              >
                <span
                  className="un-stage-n"
                  style={{ color: broken && !l.survives ? P.inkSoft : P.mark }}
                >
                  {broken ? (l.survives ? "held" : "gone") : "·"}
                </span>
                <span className="un-stage-t">
                  <strong
                    style={{
                      textDecoration:
                        broken && !l.survives ? "line-through" : "none",
                    }}
                  >
                    {l.name}
                  </strong>
                  <br />
                  <span style={{ color: P.inkSoft, fontSize: "0.95rem" }}>
                    {broken ? l.note : "running"}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <button className="un-btn" onClick={() => setBroken(!broken)}>
            {broken ? "Put it back" : "Let it happen"}
          </button>

          {broken && (
            <>
              <p style={{ marginTop: "2.4rem" }}>
                Four of them held, and that is worth dwelling on, because the
                shorthand for this period encourages you to imagine a global
                catastrophe. It was not one.
              </p>
              <p>
                Egypt survived in reduced form. Assyria came through. Shang China
                was entirely unaffected and had another two centuries ahead of it.
                The Andes were on a separate trajectory that this had nothing
                whatever to do with, and the Indus cities had already declined
                several centuries earlier for reasons of their own.
              </p>
              <p>
                <strong>
                  The instinct to globalise it is itself the thing to correct.
                </strong>{" "}
                What collapsed was one very interconnected region, and being
                interconnected is precisely what made it collapsible.
              </p>
              <p>
                The line that matters most on that list is the sixth. Greece did
                not merely lose its palaces. It lost the ability to write, and it
                did not get it back for four hundred years.
              </p>
            </>
          )}
        </section>

        <section className="un-section">
          <h2>What it looks like from the far side.</h2>
          <p className="un-lead">
            Everything in the first three sections could be opened and read. The
            ship's cargo has been catalogued, the letters have been translated,
            and the oracle bones can be studied by anybody who learns the script.
          </p>
          <p>
            The material below is the same sort of thing. Objects, inscriptions,
            poems. The difference is what happened to the chain carrying them, and
            that chain is worth picturing properly, because it is not a metaphor.
          </p>
          <p>
            <strong>Writing is not a property of a place. It is a line of
            people</strong>, in which every single person who can read learned it
            from a person who could. There has never been any other way of
            acquiring it. Break that line for one generation and the marks are all
            still there, on the same walls and tablets, and there is nobody alive
            who can turn them back into words.
          </p>
          <p>
            The Shang line has never once been broken, which is why a reader today
            can be walked back to the oracle bones. The line in Greece was cut,
            and stayed cut for four centuries.
          </p>

          <Stepped
            where="Crete · the script that stopped"
            title="Readable aloud, and meaningless"
            steps={[
              {
                label: "what we have",
                body: (
                  <>
                    <p>
                      Minoan Crete wrote in a script called Linear A. A later
                      script, Linear B, borrowed a great many of its signs in
                      order to write early Greek, and Linear B was successfully
                      cracked in the 1950s.
                    </p>
                    <p>
                      Because the signs are shared, we can make a decent guess at
                      how a Linear A tablet sounded. You could read one aloud in a
                      room and be broadly right about the noises.
                    </p>
                  </>
                ),
              },
              {
                label: "what is missing",
                body: (
                  <>
                    <p>
                      <strong>
                        Nobody has the faintest idea what you would be saying.
                      </strong>{" "}
                      The language underneath is not Greek and matches nothing
                      else known.
                    </p>
                    <p>
                      A century of very capable people have failed at it, and
                      without a text in two languages there may be no way in at
                      all. The sound survived the break and the sense did not,
                      which is an unusually clean illustration of what a chain of
                      transmission actually carries.
                    </p>
                  </>
                ),
              },
            ]}
          />

          <Stepped
            where="A temple wall in Egypt · about 1177 BC"
            title="A list of enemies, and no other trace"
            steps={[
              {
                label: "what we have",
                body: (
                  <>
                    <p>
                      Egyptian inscriptions describe a coalition arriving by land
                      and sea, overwhelming everything in its path, and being
                      fought off. The inscriptions name them: Peleset, Tjeker,
                      Shekelesh, Denyen, Weshesh.
                    </p>
                    <p>
                      That is very nearly the whole file. Modern writing calls
                      them the Sea Peoples, which is a scholarly convenience
                      rather than anything they would have recognised.
                    </p>
                  </>
                ),
              },
              {
                label: "what is missing",
                body: (
                  <>
                    <p>
                      <strong>
                        They have no account of themselves anywhere, in any
                        language.
                      </strong>
                    </p>
                    <p>
                      Whether they were invaders, refugees from the collapse,
                      opportunists moving into a vacuum, or several unrelated
                      groups filed under one convenient heading is still argued,
                      because the only witness available is the empire that fought
                      them and wrote up the victory on a temple wall.
                    </p>
                  </>
                ),
              },
            ]}
          />

          <Stepped
            where="Greece · four centuries later"
            title="A memory of a memory"
            steps={[
              {
                label: "what we have",
                body: (
                  <>
                    <p>
                      Greece came out of the break without writing and stayed that
                      way for roughly four hundred years. When literacy returned it
                      had to be borrowed: the Greek alphabet is an adaptation of a
                      Phoenician one.
                    </p>
                    <p>
                      Homer is composed at around that point, about a war set in
                      the world that fell.
                    </p>
                  </>
                ),
              },
              {
                label: "what is missing",
                body: (
                  <>
                    <p>
                      Some details are genuinely Bronze Age, carried across the
                      whole gap by word of mouth. A helmet made of boar's tusks
                      appears in the poems and again in graves of the period, and
                      nobody in Homer's own century had ever seen one.
                    </p>
                    <p>
                      <strong>
                        Other details belong to the poet's own century, and the two
                        are mixed together with no seam.
                      </strong>
                    </p>
                    <p>
                      Nobody involved could check anything. The archives had
                      burned, the script was gone, and there was no living person
                      who had read a word of it.
                    </p>
                  </>
                ),
              },
            ]}
          />

          <p style={{ marginTop: "2.4rem" }}>
            This is the part worth taking away. A collapse of this kind is not
            buildings falling over. Buildings can be rebuilt, and generally were.
          </p>
          <p>
            What broke was transmission. The people who came afterwards were
            living among the ruins of something they could see perfectly well and
            could no longer read, in a landscape full of writing that had become
            decoration. Everything they said about it was reconstruction, and they
            had no way of knowing which parts they had got right.
          </p>
          <p style={{ color: P.inkSoft }}>
            Neither, for a good deal of it, do we.
          </p>

          <div className="un-colophon">
            The Break · three of six · the unhurried edition
          </div>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   TOPIC FOUR — THE APPARATUS
   ============================================================ */

function rngA(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pickA = (r, xs) => xs[Math.floor(r() * xs.length)];

const FORMS = [
  "a shallow bowl", "a long-handled ladle", "a hafted blade", "a pierced disc",
  "a lidded jar", "a curved pin", "a socketed hook", "a flat weight",
];
const CONTEXTS = [
  "beneath a house floor", "in a pit outside the wall", "in a burial with two others",
  "in a burned storeroom", "in a river channel", "under a collapsed threshold",
];
const SHOPS = {
  A: { materials: ["bronze", "worked bone"], spiral: true },
  B: { materials: ["fired clay", "polished stone"], spiral: false },
};

function makeFind(r, id, used) {
  const shop = r() < 0.5 ? "A" : "B";
  const w = SHOPS[shop];
  let form = pickA(r, FORMS);
  let g = 0;
  while (used.has(form) && g++ < 30) form = pickA(r, FORMS);
  used.add(form);
  return {
    id, shop, form,
    material: pickA(r, w.materials),
    spiral: w.spiral,
    context: pickA(r, CONTEXTS),
    worn: r() < 0.5,
  };
}
const FIND_SPACE = FORMS.length * CONTEXTS.length * 2 * 4;

function describeFind(f, lens) {
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  const spiral = f.spiral ? "carrying the spiral mark" : "with no spiral mark";
  const wear = f.worn ? "heavily worn" : "showing almost no wear";
  if (lens === "rank")
    return `${cap(f.form)} in ${f.material}, ${spiral}. ${cap(wear)}${f.worn ? ", consistent with long use by successive holders of a position" : ", as one would expect of an object kept for display rather than work"}. Recovered ${f.context}.`;
  if (lens === "ritual")
    return `${cap(f.form)} in ${f.material}, ${spiral}. The mark is applied with care and appears reserved rather than casual. ${cap(wear)}${f.worn ? ", suggesting repeated handling in ceremony" : ", as though kept apart from daily use"}. Deposited ${f.context}.`;
  if (lens === "production")
    return `${cap(f.form)} in ${f.material}, ${spiral}. The cut of the mark matches the others that carry it, in depth and spacing. ${cap(wear)}${f.worn ? ", so the piece saw use after leaving the workshop" : ", so the piece was buried close to new"}. Recovered ${f.context}.`;
  return `${cap(f.form)} in ${f.material}, ${spiral}. ${cap(wear)}. Recovered ${f.context}.`;
}

const USED = new Set();
const SET_A = (() => { const r = rngA(90210); return [1,2,3,4].map(i => makeFind(r, `1${i}`, USED)); })();
const SET_B = (() => { const r = rngA(4417); return [5,6,7].map(i => makeFind(r, `1${i}`, USED)); })();

const WILD_ON = ["k","t","p","m","n","s","l","r","v","th","kh","z","b","d","g","f","h","j","w","y"];
const WILD_V = ["a","e","i","o","u"];
const WILD_C = ["","","n","s","r","l","k","t","m"];
const TAME_ON = ["k","t","m","n","s","l","r"];
const FRONT = ["e","i"];
const BACK = ["a","o","u"];

function wildName(r) {
  let out = "";
  const n = 2 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) out += pickA(r, WILD_ON) + pickA(r, WILD_V) + pickA(r, WILD_C);
  return out.charAt(0).toUpperCase() + out.slice(1);
}
function tameName(r) {
  const v = r() < 0.5 ? FRONT : BACK;
  const n = 2 + Math.floor(r() * 2);
  let out = "", prev = "";
  for (let i = 0; i < n; i++) {
    let c = pickA(r, TAME_ON);
    while (c === prev) c = pickA(r, TAME_ON);
    prev = c;
    out += c + pickA(r, v);
  }
  return out.charAt(0).toUpperCase() + out.slice(1);
}

const CONS = ["k","t","p","m","n","s","l","r","v","z","d","g","th","sh"];
const HARSH = ["k","t","p","g","d"];
const PROHIBITIONS = [
  { id: "harmony", label: "The vowels in a word must all be at the front of the mouth, or all at the back" },
  { id: "norepeat", label: "No consonant may be followed by itself" },
  { id: "openend", label: "Every word must end in a vowel" },
  { id: "oneharsh", label: "At most one hard stop — k, t, p, g or d — per word" },
];

function buildName(r, on) {
  const v = on.harmony ? (r() < 0.5 ? FRONT : BACK) : WILD_V;
  const n = 2 + Math.floor(r() * 2);
  let out = "", prev = "", harsh = 0;
  for (let i = 0; i < n; i++) {
    let c = pickA(r, CONS), g = 0;
    while (g++ < 40) {
      if (!(on.norepeat && c === prev) && !(on.oneharsh && HARSH.includes(c) && harsh >= 1)) break;
      c = pickA(r, CONS);
    }
    if (HARSH.includes(c)) harsh++;
    prev = c;
    out += c + pickA(r, v);
  }
  if (!on.openend && r() < 0.45) out += pickA(r, ["n","s","r","l"]);
  return out.charAt(0).toUpperCase() + out.slice(1);
}
function spaceSize(on) {
  const c = on.oneharsh ? CONS.length - 2.5 : CONS.length;
  const v = on.harmony ? 2.5 : 5;
  const syll = c * v;
  const tail = on.openend ? 1 : 1 + 4 * 0.45;
  return Math.round((Math.pow(syll,2) * (on.norepeat?0.93:1) + Math.pow(syll,3) * (on.norepeat?0.86:1)) * tail);
}

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
    { key: "a", label: "It came out of a different workshop." },
    { key: "b", label: "It was left unfinished." },
    { key: "c", label: "It was a repair, made outside the usual process." },
  ],
};


/* ---- the history generator: what happened, what was written, what survived ---- */

const ALL_RULES = { harmony: true, norepeat: true, openend: true, oneharsh: true };
const EPITHETS = ["the Elder", "the Younger", "the Quiet", "the Lame", "the Bold", "the Third", "the Grey", "the Late"];

function simulate(seed) {
  const r = rngA(seed);
  const polities = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    name: buildName(r, ALL_RULES),
    ruler: buildName(r, ALL_RULES) + " " + pickA(r, EPITHETS),
    strength: 3 + Math.floor(r() * 3),
    alive: true,
  }));

  const events = [];
  const say = (year, text, kind) => events.push({ year, text, kind });

  for (let year = 4; year <= 96; year += 2 + Math.floor(r() * 4)) {
    const living = polities.filter((x) => x.alive);
    if (living.length < 2) break;
    const roll = r();
    const a = pickA(r, living);

    if (roll < 0.24) {
      const heir = buildName(r, ALL_RULES) + " " + pickA(r, EPITHETS);
      say(year, `${a.ruler} of ${a.name} dies. ${heir} succeeds.`, "succession");
      a.ruler = heir;
    } else if (roll < 0.52) {
      const rest = living.filter((x) => x.id !== a.id);
      const b = pickA(r, rest);
      if (!b) continue;
      const win = a.strength + r() * 2 >= b.strength + r() * 2 ? a : b;
      const lose = win === a ? b : a;
      win.strength -= 1;
      lose.strength -= 2;
      say(year, `${a.name} and ${b.name} go to war. ${win.name} prevails.`, "war");
    } else if (roll < 0.66) {
      a.strength -= 2;
      say(year, `Failed harvests across ${a.name}. Its levies cannot be raised.`, "famine");
    } else if (roll < 0.78) {
      const rest = living.filter((x) => x.id !== a.id);
      const b = pickA(r, rest);
      if (!b) continue;
      say(year, `${a.name} and ${b.name} swear terms against their neighbours.`, "treaty");
    } else if (roll < 0.9) {
      a.strength -= 1;
      say(year, `The outer districts of ${a.name} refuse ${a.ruler}.`, "revolt");
    } else {
      a.strength += 1;
      say(year, `${a.ruler} of ${a.name} takes tribute from the coast.`, "tribute");
    }

    for (const q of polities) {
      if (q.alive && q.strength <= 0) {
        q.alive = false;
        say(year + 1, `${q.name} ceases to hold together. Its record ends here.`, "collapse");
        const dead = polities.filter((x) => !x.alive).length;
        if (dead <= 2 && r() < 0.7) {
          const born = {
            id: polities.length,
            name: buildName(r, ALL_RULES),
            ruler: buildName(r, ALL_RULES) + " " + pickA(r, EPITHETS),
            strength: 3,
            alive: true,
          };
          polities.push(born);
          say(year + 2, `${born.name} is founded in the country ${q.name} held.`, "founding");
        }
      }
    }
  }

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
      const prevRec = records.find((x) => x.of === i - 1);
      if (prevRec && prevRec.fate !== "unwritten") prevRec.fate = "absorbed";
      records.push({
        year: e.year,
        fate: "conflated",
        of: i,
        text: `${prev.text.replace(/\.$/, "")}, and in the same season, ${e.text}`,
      });
      continue;
    }
    if (roll < 0.56) {
      records.push({ year: e.year + 2 + Math.floor(r() * 9), fate: "misdated", of: i, text: e.text });
      continue;
    }
    records.push({ year: e.year, fate: "intact", of: i, text: e.text });
  }
  return { events, records };
}

const FATE_LABEL = {
  intact: "written down correctly",
  misdated: "written under the wrong year",
  conflated: "two events written up as one",
  absorbed: "folded into the entry below",
  lost: "written down, then lost",
  unwritten: "never written down at all",
};


function HistorySection({ seed, setSeed, layer, setLayer }) {
  const { events, records } = simulate(seed);
  const hidden = ["lost", "unwritten", "absorbed"];

  let rows;
  if (layer === 0) {
    rows = records
      .filter((r) => !hidden.includes(r.fate))
      .slice()
      .sort((a, b) => a.year - b.year)
      .map((r, i) => ({ key: i, year: r.year, text: r.text, note: null, gap: false }));
  } else if (layer === 1) {
    rows = records
      .filter((r) => r.fate !== "unwritten" && r.fate !== "absorbed")
      .slice()
      .sort((a, b) => a.year - b.year)
      .map((r, i) => ({
        key: i,
        year: r.year,
        text: r.fate === "lost" ? "— a page is missing here —" : r.text,
        note: FATE_LABEL[r.fate],
        gap: r.fate === "lost",
      }));
  } else {
    rows = events.map((e, i) => {
      const rec = records.find((r) => r.of === i);
      return {
        key: i,
        year: e.year,
        text: e.text,
        note: rec ? FATE_LABEL[rec.fate] : "never written down at all",
        gap: false,
      };
    });
  }

  const nUnwritten = records.filter((r) => r.fate === "unwritten").length;
  const nLost = records.filter((r) => r.fate === "lost").length;
  const nWrong = records.filter((r) => r.fate === "misdated" || r.fate === "conflated").length;

  return (
    <section className="un-section">
      <h2>What is the difference between a plot and a past?</h2>
      <p className="un-lead">
        A plot is a sequence of events that somebody arranged so that it would
        land properly. A past is a sequence of events that merely happened, most
        of which nobody bothered to write down, and which reaches you through
        people who were not trying to help.
      </p>
      <p>
        Generating a plot is very difficult. Generating a past is not, so long as
        you build three things rather than one.
      </p>
      <p>
        <strong>The first is consequence.</strong> Events have to change the
        state of the world, so that later events can only happen because earlier
        ones did. A war costs both sides strength; weakness invites revolt; a
        kingdom that runs out of strength stops existing. Without that you have a
        list, and a list is porridge with dates on it.
      </p>
      <p>
        <strong>The second and third are the two kinds of loss.</strong> Things
        that were never written down, and things that were written down and did
        not survive. A record that captures everything is not a record. It is a
        transcript, and no history has ever been one.
      </p>

      <HowTo>
        Below is a century of an invented country, in three versions. Start with
        what survives, then look at what was written, then at what actually
        happened.
      </HowTo>

      <div className="un-opts" style={{ marginTop: "1.4rem" }}>
        {["What survives", "What was written down", "What actually happened"].map(
          (label, i) => (
            <button
              key={label}
              className={`un-opt${layer === i ? " chosen" : ""}`}
              onClick={() => setLayer(i)}
            >
              {label}
            </button>
          )
        )}
      </div>

      <div className="un-table" style={{ marginTop: "1.2rem" }}>
        <div className="un-table-cap">
          {["The chronicle as it comes down to us", "Everything the chroniclers wrote", "Every event, as it happened"][layer]}
        </div>
        {rows.map((row) => (
          <div
            key={row.key}
            style={{
              display: "grid",
              gridTemplateColumns: "3.2rem 1fr",
              gap: "1rem",
              padding: "0.55rem 0",
              borderBottom: `1px solid ${P.ruleSoft}`,
              alignItems: "baseline",
            }}
          >
            <span className="un-lang" style={{ color: P.deep }}>
              year {row.year}
            </span>
            <span>
              <span
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.55,
                  color: row.gap ? P.inkSoft : P.ink,
                  fontStyle: row.gap ? "italic" : "normal",
                }}
              >
                {row.text}
              </span>
              {row.note && (
                <span
                  style={{
                    display: "block",
                    marginTop: "0.25rem",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.04em",
                    color: row.note.startsWith("written down correctly")
                      ? P.inkSoft
                      : P.mark,
                  }}
                >
                  {row.note}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      <button
        className="un-btn"
        onClick={() => setSeed((v) => (v * 7919) % 2147483647)}
      >
        Generate a different century
      </button>

      <p style={{ marginTop: "2.2rem" }}>
        In this particular run, {nUnwritten}{" "}
        {nUnwritten === 1 ? "event was" : "events were"} never written down at
        all, {nLost} {nLost === 1 ? "record was" : "records were"} written and
        then lost, and {nWrong} of what remains is either under the wrong year or
        has two separate events fused into a single episode.
      </p>
      <p>
        Notice one rule in particular. Every collapse goes unrecorded, and it does
        so by design, because the kingdom that would have written it down is the
        thing that stopped existing.
      </p>
      <p>
        <strong>
          Nothing in the first column is false, and the first column is not what
          happened.
        </strong>{" "}
        A reader given only that view will build a perfectly coherent account of
        this century, and it will be wrong in ways that nothing available to them
        could possibly expose.
      </p>
      <p>
        Which is where this joins up with the rest. The first three sections put
        you in front of a record and let you draw conclusions from it. This one is
        the same machine seen from the other side: not interpreting a past, but
        manufacturing one with the gaps already built in, so that somebody else
        can come along afterwards and get it wrong in the ordinary way.
      </p>

      <div className="un-colophon">
        The Apparatus · four of six · the unhurried edition
      </div>
    </section>
  );
}

function TopicFour() {
  const [lens, setLens] = useState(null);
  const [second, setSecond] = useState(null);
  const [opened, setOpened] = useState(false);
  const [roll, setRoll] = useState(0);
  const [on, setOn] = useState({ harmony:false, norepeat:false, openend:false, oneharsh:false });
  const [gen, setGen] = useState(0);
  const [seed, setSeed] = useState(31417);
  const [layer, setLayer] = useState(0);

  const wild = (() => { const r = rngA(1234 + roll*7); return Array.from({length:8}, () => wildName(r)); })();
  const tame = (() => { const r = rngA(8888 + roll*13); return Array.from({length:8}, () => tameName(r)); })();
  const built = (() => { const r = rngA(20260731 + gen*31); return Array.from({length:10}, () => buildName(r, on)); })();
  const size = spaceSize(on);
  const nOn = Object.values(on).filter(Boolean).length;
  const wasRight = lens === "production";
  const others = ["rank","ritual","production"].filter(k => k !== lens);
  const sample = SET_B[0];

  return (
    <div className="un-root">
      <div className="un-wrap">
        <header className="un-mast">
          <p className="un-eyebrow">Four of six · Making stories by machine</p>
          <h1>The Apparatus</h1>
          <p className="un-standfirst">
            It is possible to build a machine that invents stories: you write
            the rules rather than the words, set it running, and read what comes
            out.
            <br />
            <br />
            The hard part is not making it produce a great deal. Anything can
            produce a great deal. The hard part is making the things it produces
            feel meaningfully different from one another.
          </p>
        </header>

        <section className="un-section">
          <h2>A word before this one starts.</h2>
          <p className="un-lead">
            The other five explain something and then show you the evidence. This
            one goes the other way round: it asks for your opinion first, and
            opens the workings at the end. It seemed only decent to say so before
            starting rather than afterwards.
          </p>
          <p>
            It will make a good deal more sense at the end than it does at the
            beginning, which is the arrangement.
          </p>
        </section>

        <section className="un-section">
          <h2>Have a look at these first.</h2>
          <p className="un-lead">
            Below are four objects recovered from a single archaeological site.
            Do what anybody does when handed a set of things: notice a pattern
            and form a view about what it means.
          </p>
          <p>
            Nobody is available to ask. The people who made these are gone, they
            left no writing, and everything anybody will ever know about them has
            to come out of the objects themselves.
          </p>

          {SET_A.map((f) => (
            <div className="un-fossil" key={f.id}>
              <div className="un-fossil-head">
                <span className="un-fossil-gloss">Find {f.id}</span>
              </div>
              <div className="un-fossil-body">
                <p>{describeFind(f, "neutral")}</p>
              </div>
            </div>
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
            <div className="un-answer">
              <p>
                That is the correct answer, and it is not available. Four finds
                will support any of the readings on that list equally well.
              </p>
              <p>
                A site director still has to write something down before the next
                season is funded, so pick a working hypothesis. You are allowed to
                abandon it later. Everybody in this field is doing exactly this.
              </p>
            </div>
          )}
          {lens && lens !== "refuse" && (
            <div className="un-answer">
              <p>
                Reasonable, and the evidence permits it. Hold onto it, because the
                next three finds are going to be written up by somebody who has
                read your interim report.
              </p>
            </div>
          )}
        </section>

        {(!lens || lens === "refuse") && (
          <section className="un-section">
            <Waiting>
              Four more sections follow. Choose one of the four answers above and
              the next one opens.
            </Waiting>
          </section>
        )}

        {lens && lens !== "refuse" && (
          <section className="un-section">
            <h2>Three more from the same site.</h2>
            <p className="un-lead">
              A second season has produced three further objects. The site
              director has written them up, and she has read your interim report.
            </p>
            {SET_B.map((f) => (
              <div className="un-fossil" key={f.id}>
                <div className="un-fossil-head">
                  <span className="un-fossil-gloss">Find {f.id}</span>
                </div>
                <div className="un-fossil-body">
                  <p>{describeFind(f, lens)}</p>
                </div>
              </div>
            ))}
            <Question
              text="At least one of these carries no spiral. What is the most likely explanation?"
              options={FOLLOW_UP[lens]}
              value={second}
              onPick={setSecond}
            />
          </section>
        )}

        {lens && lens !== "refuse" && !second && (
          <section className="un-section">
            <Waiting>
              The workings open once you have answered the second question.
            </Waiting>
          </section>
        )}

        {second && (
          <section className="un-section">
            <h2>Now the machine.</h2>
            <p className="un-lead">
              There is no site. There are no objects. Everything you have just
              read was produced by a small generator running inside this page, and
              its rules fit on a postcard.
            </p>

            {!opened && (
              <button className="un-btn" onClick={() => setOpened(true)}>
                Open the workings
              </button>
            )}

            {opened && (
              <>
                <div className="un-fossil" style={{ borderLeftColor: P.mark }}>
                  <div className="un-fossil-head">
                    <span className="un-fossil-gloss">The rules, in full</span>
                  </div>
                  <div className="un-fossil-kids">
                    <div>the workshop is A or B, chosen at random</div>
                    <div>A works in bronze and bone, and always cuts the spiral</div>
                    <div>B works in clay and stone, and never cuts the spiral</div>
                    <div>form, findspot and wear are independent of all of that</div>
                    <div style={{ color: P.inkSoft }}>
                      {FIND_SPACE} possible finds. You were shown seven.
                    </div>
                  </div>
                </div>

                <p style={{ marginTop: "2rem" }}>
                  The spiral marks who made the object. That is the whole of its
                  meaning. There is no status in the generator and no ritual
                  either, because neither was ever written into it.
                </p>

                {wasRight ? (
                  <>
                    <h3>You had it right from the first section</h3>
                    <p>
                      Now look at what happened next, because being right did not
                      protect you from anything.
                    </p>
                    <p>
                      The three finds in the second season were written up in the
                      language of manufacture — consistency of cut, of alloy, of
                      finish — because that is what you had asked for. Every
                      sentence pushed you further towards a conclusion you had
                      already reached, and the case would have felt as though it
                      were strengthening.
                    </p>
                    <p>
                      <strong>The evidence did not strengthen.</strong> Four finds
                      underdetermined the question and seven underdetermine it in
                      exactly the same way. What changed was the vocabulary, and
                      it would have done identical work for a wrong answer.
                    </p>
                  </>
                ) : (
                  <>
                    <h3>You did not reason badly</h3>
                    <p>
                      This is the part to be precise about. The evidence supports
                      your reading as well as it supports any other, which is what
                      it means for a question to be underdetermined. Seven objects
                      and no writing will not settle it, and no amount of care
                      would have.
                    </p>
                    <p>
                      What is worth noticing is the second question rather than the
                      first. You were asked why one object had no spiral, and you
                      were offered three explanations. All three assumed your
                      reading was correct and asked only what sort of exception
                      this was.
                    </p>
                    <p>
                      <strong>
                        The answer that the object simply came out of a different
                        workshop was not on the list
                      </strong>
                      , and it was never going to be, because you had already
                      ruled it out without knowing that is what you had done.
                    </p>
                  </>
                )}

                <h3>The same object, written up four ways</h3>
                <div className="un-fossil">
                  <div className="un-fossil-head">
                    <span className="un-fossil-gloss">What the generator produced</span>
                  </div>
                  <div className="un-fossil-body"><p>{describeFind(sample, "neutral")}</p></div>
                </div>
                <div className="un-fossil">
                  <div className="un-fossil-head">
                    <span className="un-fossil-gloss">As you were shown it</span>
                  </div>
                  <div className="un-fossil-body"><p>{describeFind(sample, lens)}</p></div>
                </div>
                {others.map((o) => (
                  <div className="un-fossil" key={o}>
                    <div className="un-fossil-head">
                      <span className="un-fossil-gloss">
                        As the {o} reading would have written it
                      </span>
                    </div>
                    <div className="un-fossil-body"><p>{describeFind(sample, o)}</p></div>
                  </div>
                ))}

                <p style={{ marginTop: "2rem" }}>
                  The underlying facts are identical in all four. Material, mark,
                  wear, findspot: nothing moves. What moves is the language
                  wrapped around them, and none of these versions contains a false
                  statement. Each one selects an emphasis and lets the rest sit
                  quietly.
                </p>
                <p>
                  <strong>That is a mechanism rather than a trick.</strong> A
                  system that filters what somebody sees through what they have
                  already said will produce a person who grows more confident and
                  no more correct, without having been lied to once.
                </p>
              </>
            )}
          </section>
        )}

        <section className="un-section">
          <h2>Making a lot of things is easy. Making them feel different is not.</h2>
          <p className="un-lead">
            The obvious way to judge a machine like this is by how much it can
            produce. By that measure the generator on the left is far better than
            the one on the right. It has more sounds to draw on, longer words,
            more possible combinations, and every output it has ever made is
            unique.
          </p>
          <p>
            Read them and see whether that is how it feels. This is a problem the
            game designer Kate Compton gave a name to: you can serve ten thousand
            bowls of porridge, each one mathematically distinct from all the
            others, and every person you serve will say they have been given the
            same thing twice.
          </p>
          <p>
            The numbers underneath are worth taking literally.{" "}
            <strong>
              Think of a generator as a bag of tiles rather than as a machine.
            </strong>{" "}
            You are not writing the words. You are deciding which tiles go in the
            bag, and then reaching in. The number is how many tiles are in there.
          </p>

          <div className="un-fossil">
            <div className="un-fossil-head">
              <span className="un-fossil-form">Unconstrained</span>
              <span className="un-fossil-gloss">about 660 billion tiles</span>
            </div>
            <div className="un-fossil-kids">
              {wild.map((w, i) => <div key={i}>{w}</div>)}
            </div>
          </div>
          <div className="un-fossil">
            <div className="un-fossil-head">
              <span className="un-fossil-form">Constrained</span>
              <span className="un-fossil-gloss">about 5,700 tiles</span>
            </div>
            <div className="un-fossil-kids">
              {tame.map((w, i) => <div key={i}>{w}</div>)}
            </div>
          </div>
          <button className="un-btn" onClick={() => setRoll((v) => v + 1)}>
            Run them both again
          </button>

          <p style={{ marginTop: "2rem" }}>
            The second generator can produce roughly a hundred million times fewer
            things than the first, and it is the one that reads as a language. Its
            words could belong to the same people. You could probably invent a
            plausible new one yourself, which is a sign that you have picked up
            its rules without being told them.
          </p>
          <p>
            The first has more variety and no character at all, so its outputs
            blur into one another. Variety and distinctiveness are not the same
            quantity, and past a certain point they pull in opposite directions.
          </p>

          <h3>The same problem has a twin</h3>
          <p>
            Between them they define the two ways anybody builds a story machine,
            and both are easier to see as objects on a table than as software.
          </p>
          <p>
            The first is <strong>a deck of cards</strong>. Each card has a scene
            written on the front and a condition on the back saying when it may be
            played, and the machine deals whichever cards are currently legal.
            Every word the reader sees was written by a person. It fails by
            running out: there is only ever as much as somebody found time to
            write.
          </p>
          <p>
            The second is <strong>a board with pieces on it</strong> that move
            according to rules, where the story is whatever you find yourself
            narrating while you watch. Nobody wrote any of it. It fails by
            porridge: it will produce events for ever, and almost all of them are
            indistinguishable from one another.
          </p>
          <p>
            Neither failure is a fault to be fixed later. Each is the standing
            cost of the approach, and choosing between them is mostly a decision
            about which problem you would rather spend the next several years on.
          </p>
        </section>

        <section className="un-section">
          <h2>So the design work is deciding what cannot happen.</h2>
          <p className="un-lead">
            Here is the same generator with nothing switched on. It can produce an
            enormous number of words and none of them belong together.
          </p>
          <p>
            Underneath are four prohibitions. Each one removes possibilities and
            not one of them adds anything at all. Switch them on and watch both
            numbers move: the size of the bag goes down, and the sense that these
            words come from somewhere goes up.
          </p>

          <HowTo>
            Tap any rule to switch it on or off. The list of words changes
            immediately.
          </HowTo>

          <div className="un-fossil">
            <div className="un-fossil-head">
              <span className="un-fossil-form">
                {nOn === 0 ? "No rules" : `${nOn} rule${nOn > 1 ? "s" : ""} in force`}
              </span>
              <span className="un-fossil-gloss">
                about {size.toLocaleString()} tiles in the bag
              </span>
            </div>
            <div className="un-fossil-kids">
              {built.map((w, i) => <div key={i}>{w}</div>)}
            </div>
          </div>

          <div className="un-opts" style={{ marginTop: "1.2rem" }}>
            {PROHIBITIONS.map((r) => (
              <button
                key={r.id}
                className={`un-opt${on[r.id] ? " chosen" : ""}`}
                onClick={() => setOn((s) => ({ ...s, [r.id]: !s[r.id] }))}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button className="un-btn" onClick={() => setGen((v) => v + 1)}>
            Generate a new set of words
          </button>

          <p style={{ marginTop: "2.2rem" }}>
            Back to the bag. The thing you are actually designing is not any of
            the words that came out of it. It is what is in the bag, and every one
            of those switches takes tiles out. None of them puts any in.
          </p>
          <p>
            Which is the part that takes some getting used to. Adding a rule feels
            like adding something, and it is the opposite. A generator gets better
            by being allowed to do less.
          </p>

          <h3>And what that costs</h3>
          <p>
            This section has so far made only one side of the case, so here is the
            other. Every prohibition deletes outputs, and some of them were good.
            A rule forbidding a consonant from following itself has just removed
            every name that would have been memorable for precisely that reason,
            and it removed them silently, because a bag of tiles gives you no way
            of inspecting what is no longer in it.
          </p>
          <p>
            Push it far enough and coherence turns into monotony: a bag small
            enough that a reader sees the whole of it and stops looking. There is
            no formula for where that point sits. It is a judgement, made by ear,
            and it is the part of the job that stays a craft.
          </p>
          <p style={{ color: P.inkSoft }}>
            The spiral meant something because it was never once cut by the wrong
            workshop.
          </p>
        </section>

        <HistorySection
          seed={seed}
          setSeed={setSeed}
          layer={layer}
          setLayer={setLayer}
        />
      </div>
    </div>
  );
}

/* ============================================================
   TOPIC FIVE — WHAT EXISTS
   ============================================================ */

function TopicFive() {
  const [shape, setShape] = useState(null);
  const [fix, setFix] = useState(null);
  const [absence, setAbsence] = useState(null);
  const [link, setLink] = useState(0);
  const [time, setTime] = useState(null);
  const [store, setStore] = useState(null);
  const [last, setLast] = useState(null);
  const one = shape === "one";
  const three = shape === "three";

  return (
    <div className="un-root">
      <div className="un-wrap">
        <header className="un-mast">
          <p className="un-eyebrow">Five of six · Designing records</p>
          <h1>What Exists</h1>
          <p className="un-standfirst">
            Before anybody can build a computer system, somebody has to decide
            what kinds of thing it will know about, and what facts it is allowed
            to hold about each of them.
            <br />
            <br />
            It sounds like the dullest job in the world. It is the point at which
            it is decided whose name will fit in the box, and whose will not.
          </p>
        </header>

        <section className="un-section">
          <h2>Before anything gets built, somebody decides what things there are.</h2>
          <p className="un-lead">
            A small charity has asked you to sort out its records. It knows about
            people, and it knows about the organisations those people work for,
            and at present all of it lives in a spreadsheet that three people edit
            at the same time.
          </p>
          <p>
            Your job is to write down what exists. Not to describe the world,
            which is what it will feel like, but to rule on it. Whatever you write
            down is what the system will be able to say, and anything you leave
            out will be unsayable for as long as the system runs.
          </p>
          <p>Start with something that could not be simpler. How do you store a name?</p>

          <Question
            text="Pick one."
            options={[
              { key: "one", label: "One box. Put the whole name in it." },
              { key: "two", label: "Two boxes. First name and last name." },
              { key: "three", label: "Three boxes. First, middle, last." },
            ]}
            value={shape}
            onPick={setShape}
          />
          {shape && (
            <div className="un-answer">
              <p>
                {one && "Noted. Almost nobody picks this one, and the reasons are real rather than superstitious. Whether they outweigh what it buys you is a question for a few paragraphs from now."}
                {shape === "two" && "Noted. This is what nearly every form you have ever filled in does, which is worth knowing but is not by itself an argument."}
                {three && "Noted. More boxes than most people give themselves, on the reasoning that more room handles more of the world."}
              </p>
            </div>
          )}
        </section>

        {!shape && (
          <section className="un-section">
            <Waiting>
              Four more sections follow, and they respond to the choice you make
              above. Pick one of the three and the rest of the page opens.
            </Waiting>
          </section>
        )}

        {shape && (
          <section className="un-section">
            <h2>Then somebody walks in.</h2>
            <p className="un-lead">
              Four people need to go into the system this week. Not one of them is
              being difficult, or unusual, or trying to make a point. They are
              simply people.
            </p>

            <div className="un-fossil" style={{ borderLeftColor: one ? P.deepSoft : P.markSoft }}>
              <div className="un-fossil-head">
                <span className="un-fossil-form">A new volunteer, from Java</span>
                {one && <span className="un-fossil-fam">your model holds this</span>}
              </div>
              <div className="un-fossil-body">
                <p>
                  Her name is Sukarti. That is the whole of it. Not a shortening,
                  and not a first name waiting for a surname. Single names are
                  entirely ordinary across much of Indonesia and in a good many
                  other places.
                </p>
                {one && <p><strong>She goes in as Sukarti and nothing objects.</strong> You asked for a name and she gave you her name.</p>}
                {shape === "two" && <p><strong>Your form has a required box she has nothing to put in.</strong></p>}
                {three && <p><strong>Your form has two boxes she has nothing to put in, and one of them is required.</strong> The extra box did not buy flexibility. It bought another blank.</p>}
              </div>
            </div>

            <div className="un-fossil" style={{ borderLeftColor: one ? P.deepSoft : P.markSoft }}>
              <div className="un-fossil-head">
                <span className="un-fossil-form">A trustee, from Tamil Nadu</span>
                {one && <span className="un-fossil-fam">stored correctly</span>}
              </div>
              <div className="un-fossil-body">
                <p>
                  He gives his name as R. Ganesan. The R is his father's given
                  name, which functions as an initial and is not a family name at
                  all. His own name is the second part.
                </p>
                {one ? (
                  <p><strong>Stored exactly as he wrote it, which is the point.</strong> Nothing has been taken apart, so nothing has been taken apart wrongly.</p>
                ) : (
                  <>
                    <p>
                      Asked for a last name, he does what most people in his
                      position do on a form like yours, and puts the initial
                      there, because it is the only part that resembles one.
                    </p>
                    <p><strong>So the system files him under R and writes to him as Ganesan R.</strong> {three ? "The third box is empty and has changed nothing, because the assumption underneath all three is that a name comes apart into pieces you can label in advance." : "It will also print it on a badge."}</p>
                  </>
                )}
              </div>
            </div>

            <div className="un-fossil" style={{ borderLeftColor: P.markSoft }}>
              <div className="un-fossil-head">
                <span className="un-fossil-form">A donor of eleven years</span>
              </div>
              <div className="un-fossil-body">
                <p>
                  She has changed her name. The old one still has to resolve,
                  because eleven years of correspondence, tax declarations and a
                  pledge in her will are all attached to it, and a solicitor will
                  one day need to follow the thread.
                </p>
                <p>
                  <strong>She is not two people, and she is not one row either.</strong>{" "}
                  Nothing in your model has anywhere to keep a name that is no
                  longer current, and no number of boxes helped with that.
                </p>
              </div>
            </div>

            {one ? (
              <div className="un-fossil" style={{ borderLeftColor: P.markSoft }}>
                <div className="un-fossil-head">
                  <span className="un-fossil-form">The Christmas appeal, and the trustee list</span>
                </div>
                <div className="un-fossil-body">
                  <p>
                    The fundraiser wants the appeal to open with whatever each
                    person is actually called, because it reads as though a human
                    being wrote it. From your one box she has a single line of text
                    per person, and she needs a rule that turns that into a form
                    of address.
                  </p>
                  <p>
                    There is no such rule. Margaret Oyelaran-Whitfield is Margaret.
                    R. Ganesan is Ganesan, not R. Sukarti is Sukarti. Jón
                    Sigurðsson is Jón. Every one of those is obvious to somebody
                    who knows the convention, and not one can be worked out from
                    the letters in the box.
                  </p>
                  <p>
                    <strong>You have not lost any information. You have lost the
                    ability to act on it.</strong> What somebody is called and how
                    they should be addressed are two separate facts, and you are
                    storing one.
                  </p>
                </div>
              </div>
            ) : (
              <div className="un-fossil" style={{ borderLeftColor: P.markSoft }}>
                <div className="un-fossil-head">
                  <span className="un-fossil-form">A caseworker in Reykjavík</span>
                </div>
                <div className="un-fossil-body">
                  <p>
                    Jón Sigurðsson. Sigurðsson is not a family name. It is a
                    statement that his father was called Sigurður. His sister's
                    name is Sigurðardóttir.
                  </p>
                  <p>
                    <strong>Sorting Icelanders by that box groups siblings apart
                    and strangers together.</strong> Icelandic phone books sort by
                    first name for exactly this reason, and your model has no way
                    of recording that he is one of the people who needs sorting
                    differently.
                  </p>
                </div>
              </div>
            )}

            <p style={{ marginTop: "2rem" }}>
              None of this is exotic. Between them these patterns cover an
              enormous number of people, and every one of those people has at some
              point been told by a form that they have filled it in wrongly.
            </p>

            <Question
              text="What do you do?"
              options={
                one
                  ? [
                      { key: "single", label: "Keep the single box, and add a separate one for how to address them and a list of former names." },
                      { key: "patch", label: "Split it back out after all. First and last name, with last name optional." },
                      { key: "hold", label: "Leave it. The charity is small and the appeal can be formal." },
                    ]
                  : [
                      { key: "patch", label: `Keep the ${three ? "three" : "two"} boxes and make the last name optional.` },
                      { key: "single", label: "Collapse to one name box, plus a separate one for how to address them and a list of former names." },
                      { key: "hold", label: "Leave it. These are edge cases and the charity is small." },
                    ]
              }
              value={fix}
              onPick={setFix}
            />
            {fix && (
              <div className="un-answer">
                {fix === "patch" && shape === "two" && <p><strong>Cheap, and it half works.</strong> Sukarti fits now. Ganesan is still filed under R, Jón still sorts away from his sister, and the donor's old name still has nowhere to live. You have solved the case that was easiest to see.</p>}
                {fix === "patch" && three && <p><strong>You now have three boxes, two of them optional, and the same assumption underneath.</strong> Sukarti fits. Nothing else moved, because the problem was never how many parts a name has. It was the belief that the parts can be labelled in advance and that everybody uses them the same way.</p>}
                {fix === "patch" && one && <p><strong>You have traded a working model for a familiar one.</strong> Sorting and salutation get easier, and Ganesan gets filed under R, which he was not before. This is the trade almost every system makes, usually without noticing there was one.</p>}
                {fix === "single" && !one && <p><strong>The expensive one, and it holds.</strong> Notice the shape of what replaced it: one box for what somebody is called, one for how to sort and address them, and one for names that are no longer current. Three facts, not three parts.</p>}
                {fix === "single" && one && <p><strong>You were most of the way there and it still took two more boxes.</strong> One to say how a person should be sorted and addressed, which is a separate fact from what they are called, and one to hold names that are no longer current.</p>}
                {fix === "hold" && <p><strong>A real option, and a defensible one.</strong> Every set of records excludes somebody and no budget is infinite. What it is not is neutral.{one ? " Nobody is stored wrongly, the donor's history is simply gone, and the appeal goes out formal to two thousand people." : " Four people will be entered wrongly, and none of them will be asked whether they minded."}</p>}
              </div>
            )}
          </section>
        )}

        {shape && !fix && (
          <section className="un-section">
            <Waiting>
              Three more sections follow. Decide what to do about the names and
              they open.
            </Waiting>
          </section>
        )}

        {fix && (
          <section className="un-section">
            <h2>An empty box with four meanings.</h2>
            <p className="un-lead">
              There is a telephone number box. For four hundred of the charity's
              two thousand records it is blank.
            </p>
            <p>
              Blank is not one thing. Read what actually happened in each case and
              the box turns out to be carrying four entirely different pieces of
              information under a single appearance.
            </p>
            <div className="un-fossil"><div className="un-fossil-body">
              <p><strong>Record 1102.</strong> Nobody has ever asked her. The box is blank because the conversation has not happened.</p>
            </div></div>
            <div className="un-fossil"><div className="un-fossil-body">
              <p><strong>Record 1187.</strong> He was asked and said no. That is a decision he made, and telephoning him would be a breach of it.</p>
            </div></div>
            <div className="un-fossil"><div className="un-fossil-body">
              <p><strong>Record 1240.</strong> She has no telephone. Asking again next quarter will not change that and will be irritating.</p>
            </div></div>
            <div className="un-fossil"><div className="un-fossil-body">
              <p><strong>Record 1355.</strong> There was a number. It has been disconnected for two years, and somebody deleted it rather than record that fact.</p>
            </div></div>

            <p style={{ marginTop: "1.8rem" }}>
              The distinction that matters most is the least visible.{" "}
              <strong>
                We have not looked, and we looked and there is nothing, are
                opposite findings, and an empty box renders them identically.
              </strong>{" "}
              One of them is an open question. The other is an answer, and it cost
              somebody a telephone call to get.
            </p>

            <Question
              text="How do you make that difference sayable?"
              options={[
                { key: "sentinel", label: "Agree a convention. Blank means never asked; the word NONE means asked and declined." },
                { key: "status", label: "Add a second box next to it, with the four cases as options." },
                { key: "ask", label: "Record the enquiry itself: when it was asked, and what came back." },
              ]}
              value={absence}
              onPick={setAbsence}
            />
            {absence && (
              <div className="un-answer">
                {absence === "sentinel" && <p><strong>Free, and it will not survive contact with staff turnover.</strong> The convention lives in somebody's head and in a training document nobody reads. Within two years there will be records containing the word "none", records containing "n/a", and records containing a hyphen.</p>}
                {absence === "status" && <p><strong>The workable middle.</strong> The four cases become sayable and countable, at the cost of a second box that has to be kept in step with the first, which it will not always be.</p>}
                {absence === "ask" && <><p><strong>The most honest and the most work.</strong> You have stopped storing a fact and started storing the history of trying to find it out, which is what actually happened.</p><p>Notice what that took. The enquiry could not live on the person, because a person can be asked more than once and give a different answer each time, so it had to become a thing in its own right. It is a third list nobody asked you for, and the charity has one part-time administrator.</p></>}
              </div>
            )}
          </section>
        )}

        {fix && !absence && (
          <section className="un-section">
            <Waiting>Two more sections follow, once you have settled the empty boxes.</Waiting>
          </section>
        )}

        {absence && (
          <section className="un-section">
            <h2>A line between two boxes turns out to be a thing.</h2>
            <p className="un-lead">
              Your model says that a person has an employer. It is a single entry
              pointing at an organisation, and it is the most natural thing in the
              world to write down.
            </p>
            <p>Now watch it come apart, one ordinary Tuesday at a time.</p>

            <div className="un-fossil"><div className="un-fossil-body">
              <p><strong>First.</strong> A caseworker takes a second job with a partner organisation, two days a week. Your entry holds one value.</p>
            </div></div>
            {link >= 1 && (
              <div className="un-fossil"><div className="un-fossil-body">
                <p><strong>Second.</strong> You have widened it, so a person can now be connected to several organisations. Good. The finance officer then asks which of them employs her, since one post is paid and the other is voluntary, and she has a different start date at each, and a different job title at each.</p>
                <p><strong>None of that belongs to the person, and none of it belongs to the organisation.</strong> It belongs to the connection between them, and a connection was not something your model said existed.</p>
              </div></div>
            )}
            {link >= 2 && (
              <div className="un-fossil" style={{ borderLeftColor: P.mark }}><div className="un-fossil-body">
                <p><strong>What actually happened.</strong> The line was never a line. There was always a third thing in this domain, with its own start, its own terms and its own name, and you did not notice because on the diagram it looked like a piece of plumbing between two boxes.</p>
                <p><strong>This is not a tidying-up exercise. It is finding out that engagements exist.</strong> Every set of records you will ever design has at least one of these hiding in it, and you generally meet them at the point where somebody asks a question you cannot answer.</p>
                {absence === "ask" && <p>You have already done this once, two sections ago, when the enquiry about a telephone number turned out to need a list of its own. Same move, different corner. It will keep happening.</p>}
              </div></div>
            )}
            {link < 2 && (
              <button className="un-btn" onClick={() => setLink(link + 1)}>
                {link === 0 ? "Let people have more than one job" : "Add the details the finance officer needs"}
              </button>
            )}

            {link >= 2 && (
              <>
                <h3>Two questions follow immediately</h3>
                <p>
                  They are the two that separate people who have done this before
                  from people who have not. The first is about time. The
                  caseworker's hours change in April.
                </p>
                <Question
                  text="What happens to the old entry?"
                  options={[
                    { key: "overwrite", label: "Update it. The current position is what the system is for." },
                    { key: "history", label: "Close it with an end date and open a new one." },
                  ]}
                  value={time}
                  onPick={setTime}
                />
                {time && (
                  <div className="un-answer">
                    {time === "overwrite"
                      ? <p><strong>Simpler, and the past is gone.</strong> Next year somebody asks how many hours she worked in March, for a funder's report, and there is no answer anywhere in the system.</p>
                      : <p><strong>You are now recording the world changing rather than the world as it is.</strong> Every question gets a little harder, because every question has to say when it means. In exchange, "what was true in March" becomes answerable at all.</p>}
                  </div>
                )}

                {time && (
                  <>
                    <h3>The second decides how all of this is physically kept</h3>
                    <p>
                      And it is genuinely a question about the world rather than
                      about computers.{" "}
                      <strong>
                        Does an engagement exist on its own, or only as part of a
                        person?
                      </strong>
                    </p>
                    <p>
                      It is easier to see on paper, so forget computers for a
                      moment. The charity has a back room, and three ways of
                      arranging it.
                    </p>

                    <div className="un-fossil">
                      <div className="un-fossil-head"><span className="un-fossil-form">Three card indexes</span></div>
                      <div className="un-fossil-body">
                        <p>One drawer of cards for people, one for organisations, one for engagements. Each engagement card names a person and an organisation. To answer anything you pull cards from more than one drawer and match them up.</p>
                        <p style={{ color: P.inkSoft }}>Nothing sits inside anything else. Every question costs a little work and no question is impossible.</p>
                      </div>
                    </div>
                    <div className="un-fossil">
                      <div className="un-fossil-head"><span className="un-fossil-form">A folder for each person</span></div>
                      <div className="un-fossil-body">
                        <p>One folder per person, and the engagement is a sheet filed inside it. Everything about somebody is in one place, so anything you want to know about a person takes one folder.</p>
                        <p style={{ color: P.inkSoft }}>Ask who works at one particular organisation and you are opening every folder in the cabinet.</p>
                      </div>
                    </div>
                    <div className="un-fossil">
                      <div className="un-fossil-head"><span className="un-fossil-form">Pins and string</span></div>
                      <div className="un-fossil-body">
                        <p>A pin on a board for each person and each organisation, and a length of string between them for each engagement, with the role and the dates written along the string.</p>
                        <p style={{ color: P.inkSoft }}>Following who is connected to whom is trivial. Producing a plain alphabetical list of everybody is oddly awkward.</p>
                      </div>
                    </div>

                    <p style={{ marginTop: "1.5rem" }}>
                      Those are the three families of database, and they are
                      usually called relational, document and graph. The names
                      matter less than what each has already assumed. Cards say
                      nothing is inside anything. Folders say containment is real,
                      because a sheet in somebody's folder is part of that person.
                      String says the connection is a thing in its own right.
                    </p>

                    <Question
                      text="Pick one, knowing that you are answering a question about what kind of thing an engagement is."
                      options={[
                        { key: "relational", label: "Card indexes. Keep everything separate and match it up when asked." },
                        { key: "document", label: "Folders. An engagement belongs to a person and lives inside them." },
                        { key: "graph", label: "Pins and string. The connection is a thing in its own right." },
                      ]}
                      value={store}
                      onPick={setStore}
                    />
                    {store && (
                      <div className="un-answer">
                        {store === "document" && <p><strong>You have committed, in the physical arrangement, to the claim that an engagement has no life of its own.</strong> It is a sheet in somebody's folder, so it goes where they go. Six months from now the funder asks for everybody connected to one organisation, and answering means opening every folder you have.</p>}
                        {store === "relational" && <p><strong>You have declined to commit, which is itself a position.</strong> Nothing is inside anything, so nothing is ever cheap and nothing is ever impossible. The arrangement also tells whoever inherits it nothing about what you believed an engagement was.</p>}
                        {store === "graph" && <p><strong>You have said the connection is as real as the things it connects.</strong> Anything of the form "who is linked to whom, and how far does that go" becomes easy. Anything of the form "give me everybody in one plain alphabetical list" becomes more work than you would expect.</p>}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </section>
        )}

        {absence && !store && (
          <section className="un-section">
            <Waiting>
              One section left. It opens once you have chosen how the records are
              kept, and it is the only one that does not resolve.
            </Waiting>
          </section>
        )}

        {store && (
          <section className="un-section">
            <h2>The last one has no right answer.</h2>
            <p className="un-lead">
              One box left. The charity needs to record how each person is
              connected to it, because the trustees have to report on governance
              and the funder wants to know who the work reaches.
            </p>
            <p>
              There are two ways to build a box like this, and they are the oldest
              argument in the subject. A fixed list is enforceable: everybody picks
              from the same options, the options mean the same thing to everybody,
              and you can count them at the end of the year. Free text is
              expressive: anybody can say what is actually the case, in the words
              that fit.
            </p>
            <p>Here are four people, and they are not awkward. They are Tuesday.</p>

            <div className="un-fossil"><div className="un-fossil-body">
              <p><strong>A trustee.</strong> She also receives the service. That is a governance fact with legal weight, and it is also the single best reason she is on the board.</p>
            </div></div>
            <div className="un-fossil"><div className="un-fossil-body">
              <p><strong>A former beneficiary.</strong> He now runs a peer support group, unpaid, which the charity depends on but has never formally constituted.</p>
            </div></div>
            <div className="un-fossil"><div className="un-fossil-body">
              <p><strong>A funder's representative.</strong> She attends board meetings, has no vote, and is not staff, volunteer or beneficiary.</p>
            </div></div>
            <div className="un-fossil"><div className="un-fossil-body">
              <p><strong>Somebody the charity is not sure about.</strong> He has been coming to the drop-in for a year. Nobody has ever established whether he is a service user, and asking directly would probably end it.</p>
            </div></div>

            <Question
              text="Fixed list or free text?"
              options={[
                { key: "enum", label: "Fixed list. Governance reporting is a legal duty and it has to be countable." },
                { key: "text", label: "Free text. People are more complicated than five options." },
                { key: "both", label: "Both. A fixed list for reporting, and a free text note beside it." },
              ]}
              value={last}
              onPick={setLast}
            />

            {last && (
              <>
                <div className="un-answer">
                  {last === "enum" && <p><strong>Who pays:</strong> the trustee, who is filed as one thing and is two, so the conflict of interest the board is legally obliged to manage becomes invisible in its own records. The peer group leader, filed as a beneficiary while doing unpaid work the charity relies on. And the man at the drop-in, who has to be given a category before anybody has asked him.</p>}
                  {last === "text" && <p><strong>Who pays:</strong> the trustees, at the point where the annual report needs a number and there are four hundred distinct phrases in the column, eleven of which say "volunteer" with different capitalisation. Nobody is excluded and nobody can be counted, so the governance duty gets discharged by somebody reading four hundred rows and making a judgement.</p>}
                  {last === "both" && <p><strong>Who pays:</strong> whoever does the data entry, twice, for ever. And in practice the note is where the truth goes and the list is where the reporting comes from, so the two drift apart and the organisation ends up believing the list.</p>}
                </div>

                <p style={{ marginTop: "2.4rem" }}>
                  There is no fourth option, and this section does not resolve,
                  because the world genuinely does not contain an answer. Some part
                  of what these four people are will not survive being written
                  down, and you are the one deciding which part.
                </p>
                <p>
                  That is the whole job, and it is why it is worth doing carefully.
                  A set of records is not a description of the world. It is a
                  ruling about what the world is permitted to contain, made in
                  advance, by somebody who has not met most of the people it will
                  be applied to.
                </p>
                <p style={{ color: P.inkSoft }}>
                  Everybody who fills in the form afterwards is living inside a
                  decision you made on a Tuesday.
                </p>
              </>
            )}

            <div className="un-colophon">
              What Exists · five of six · the unhurried edition
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TOPIC SIX — THE OLDER LAYER
   ============================================================ */

const GILG = [
  { t: "Tablet I. Gilgamesh, king of Uruk, oppresses his people. The gods create Enkidu to match him.", notes: [null, "The standard version opens by praising the king as one who saw the deep and came back wise. An earlier Babylonian version opened by simply calling him the greatest of kings. Somebody rewrote the first line to be about knowledge rather than status.", "Behind both sit five separate Sumerian poems about a king called Bilgames, circulating some three centuries earlier and never as one story."] },
  { t: "Tablets II to VI. The two become friends, kill the forest guardian Humbaba, and refuse the goddess Ishtar.", notes: [null, null, "The Humbaba expedition exists as its own Sumerian poem, complete in itself and with a different ending."] },
  { t: "Tablets VII and VIII. Enkidu sickens and dies. Gilgamesh will not leave the body.", notes: [null, null, null] },
  { t: "Tablets IX to X. Gilgamesh goes looking for the one man who never died.", notes: [null, null, null] },
  { t: "Tablet XI. Utnapishtim describes the flood: the boat, the animals, the birds sent out to find land, the sacrifice afterwards.", later: true, notes: [null, "This is a separate composition. Nearly all of it corresponds to a Babylonian poem about a man called Atrahasis, which exists on its own tablets and is not about Gilgamesh at all.", "So the most famous passage in the epic is an insertion, and it was already old when it was inserted."] },
  { t: "Tablet XII. Enkidu goes down to the underworld and describes what he finds there.", later: true, notes: [null, "Enkidu died four tablets ago and is alive again here, with no explanation offered.", "Because tablet XII is a partial translation of one of the old Sumerian poems, appended to the end without being fitted to the story. The seam is not a theory. It is a contradiction sitting in the text."] },
];

const DEUT = [
  { t: "When the Most High divided up the nations and separated humankind, he fixed the boundaries of the peoples.", notes: [null, "Uncontroversial, and identical in every manuscript.", null] },
  { t: "He fixed them according to the number of the sons of Israel.", later: true, notes: [null, "This is the reading in the medieval Hebrew manuscripts that most translations follow.", "It is also slightly odd: the number of the sons of Israel has nothing obvious to do with the number of nations."] },
  { t: "He fixed them according to the number of the sons of God.", older: true, notes: [null, "This is the reading in a Dead Sea Scrolls fragment of Deuteronomy, and it agrees with the ancient Greek translation, which has divine beings here rather than Israelites. Two independent witnesses, both older than the manuscripts behind the other version.", "Read this way, the nations are distributed among divine beings, one each."] },
  { t: "For the LORD's own portion is his people, and Jacob is his allotted share.", notes: [null, "Unchanged in all versions, and this is the line that makes the passage interesting.", "With the older reading above it, the sense is that the Most High allots the nations among divine beings, and the one who receives Israel is Yahweh. The passage describes an assembly of gods with a portion each, and the God of Israel receiving his."] },
];

function Dig({ caption, lines, labels }) {
  const [d, setD] = useState(0);
  return (
    <div className="un-table">
      <div className="un-table-cap">{caption}</div>
      <div className="un-opts" style={{ marginBottom: "1.2rem" }}>
        {labels.map((l, i) => (
          <button key={l} className={`un-opt${d === i ? " chosen" : ""}`} onClick={() => setD(i)}>
            {l}
          </button>
        ))}
      </div>
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            padding: "0.7rem 0",
            borderBottom: i < lines.length - 1 ? `1px solid ${P.ruleSoft}` : "none",
          }}
        >
          <p style={{
            margin: 0, fontSize: "1.02rem", lineHeight: 1.6, maxWidth: "none",
            color: d > 0 && l.later ? P.mark : d > 0 && l.older ? P.deep : P.ink,
          }}>
            {l.t}
          </p>
          {l.notes[d] && (
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.95rem", color: P.inkSoft, maxWidth: "none", lineHeight: 1.6 }}>
              {l.notes[d]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

const PRESERVED = [
  {
    who: "An inscription on a storage jar",
    title: "Yahweh, and his asherah",
    steps: [
      { label: "what was found", body: (<><p>Kuntillet Ajrud is a waystation in the Sinai desert. Travellers passing through in about the eighth century BC wrote blessings on the plaster and on the large storage jars, in the ordinary way that people wrote blessings.</p><p>Several of them invoke Yahweh, identified by locality as gods were then, and add three further words: <span className="un-term">and his asherah</span>.</p><p>Separately, the Hebrew Bible instructs its readers, repeatedly and at length, to cut down and burn asherahs.</p></>) },
      { label: "what follows", body: (<><p>Asherah is a goddess known independently from tablets found on the Syrian coast, where she is the consort of the high god El. The same word is also used in the Bible for a wooden cult object, so scholars argue about which is meant on the jars, and that argument is live and unresolved.</p><p><strong>The direction of the other evidence is not in doubt.</strong> Nobody legislates against a practice that nobody is engaged in. Instructions to destroy a thing are issued because the thing is there, in quantity, and shows no sign of going away.</p><p>So the prohibition is a description. The text that wants asherahs gone is among the better records that they were widespread.</p></>) },
    ],
  },
  {
    who: "An epithet that changed owner",
    title: "The one who rides on the clouds",
    steps: [
      { label: "what was found", body: (<><p>A French excavation on the Syrian coast in 1928 turned up the archives of a city called Ugarit, written some centuries before most of the Hebrew Bible and in a closely related language.</p><p>The tablets describe a storm god, Baal, and give him a set of standing epithets that recur wherever he appears. One of them calls him the one who rides on the clouds. The same phrase turns up in the Psalms, applied to Yahweh.</p></>) },
      { label: "what follows", body: (<><p>The literature in which it appears is elsewhere about as hostile to Baal as a literature can be. This is not a borrowing anybody would have admitted to.</p><p><strong>Poetic formulae are stickier than the theology attached to them.</strong> A phrase that scans well and sounds right gets used, and it can cross from one god to a rival god carried by people who would have been appalled to be told whose line they were reciting.</p><p>Which makes fixed phrases some of the most reliable evidence going. They survive precisely because nobody is paying attention to them.</p></>) },
    ],
  },
  {
    who: "A religion preserved by its opponents",
    title: "Almost everything known about the Manichaeans",
    steps: [
      { label: "what was found", body: (<><p>Manichaeism was for several centuries a genuinely intercontinental religion, running from the western Mediterranean to China, and its own scriptures were destroyed with unusual thoroughness.</p><p>For most of history, what survived came through the people suppressing it. Christian bishops quoted passages in order to refute them. Muslim heresiographers catalogued the beliefs in order to classify the error precisely.</p></>) },
      { label: "what follows", body: (<><p><strong>Refutation requires accurate quotation, or the refutation misses.</strong> An opponent who paraphrases loosely can be told he is attacking something nobody believes, which is fatal to the argument. The incentive runs towards getting it right.</p><p>That is a claim you would want to test rather than assume, and it was testable. Manuscript finds in Egypt and along the Silk Road during the twentieth century finally supplied Manichaean texts directly, which allowed the hostile summaries to be checked against the real thing.</p><p>They came out of it reasonably well. Not perfectly, and better than their authors deserved.</p></>) },
    ],
  },
];

const ENEMIES = [
  {
    who: "Gaul · first century BC",
    title: "A general describing what he is conquering",
    steps: [
      { label: "what he wrote", body: (<><p>A large share of everything known about Gaulish religion comes from Julius Caesar's account of his own campaigns, written for readers in Rome whose support he needed.</p><p>He describes the druids at some length: how long the training took, the authority they held in disputes, the rites he presents as barbaric. He then lists the gods. The Gauls, he says, worship Mercury above all, and after him Apollo, Mars, Jupiter and Minerva.</p></>) },
      { label: "what we get from it", body: (<><p><strong>Those are not their names, and Caesar knew it.</strong> He is translating, in the ordinary Roman way, by identifying a foreign god with whichever domestic one does the same job.</p><p>So the account tells us what functions Gaulish gods were thought to perform, expressed in the categories of a different pantheon, and loses almost every name they were actually called by. Where inscriptions have since supplied real Gaulish names, they do not map onto his list neatly.</p><p>The information is real. It has simply been passed through a grid that was not built for it, and the grid is now inseparable from the data.</p></>) },
    ],
  },
  {
    who: "Mexico · sixteenth century",
    title: "A friar compiling in order to extirpate",
    steps: [
      { label: "what he made", body: (<><p>Bernardino de Sahagún was a Spanish friar who spent decades working with Nahua elders and with trained Nahua assistants to compile an enormous encyclopaedia of Aztec life, in Nahuatl and Spanish, covering the calendar, the rhetoric, the trades and the religion in great detail.</p><p>He was entirely open about why. A physician has to know the disease before he can treat it, and missionaries could not root out practices they were unable to recognise.</p></>) },
      { label: "what we get from it", body: (<><p><strong>It is the richest source on Aztec religion in existence, and it was made by somebody who wanted that religion to end.</strong></p><p>It also rests on testimony from people who had watched their world destroyed within living memory, given to a member of the order doing the destroying. Every informant had reason to consider carefully what to volunteer and what to leave out, and none of those calculations is recorded anywhere.</p><p>The material is indispensable and it is not neutral, and those two facts have to be held at the same time by anybody using it.</p></>) },
    ],
  },
  {
    who: "Iceland · thirteenth century",
    title: "A Christian politician explaining the old gods",
    steps: [
      { label: "what he wrote", body: (<><p>Most of what is known about Norse mythology comes from Snorri Sturluson, writing roughly two centuries after Iceland converted to Christianity. He was a Christian, a lawyer and a formidable political operator, and his handbook exists so that poets could go on using the traditional imagery without losing the key to it.</p><p>His prologue explains that the gods were never gods. They were men, refugees out of Troy, whose descendants travelled north and were taken for divine by the people they found there.</p></>) },
      { label: "what we get from it", body: (<><p><strong>That prologue is a solution to Snorri's problem rather than a piece of tradition.</strong> It let a Christian write down a pagan cosmology in detail without appearing to endorse any of it, which is presumably the only way the material was going to get written down at all.</p><p>It also puts Odin's family into exactly the story the Franks had claimed for themselves three centuries earlier. Troy was the standard explanation for where a people came from, available off the shelf across the whole of Latin Europe.</p><p>So the frame is borrowed, the contents are not, and separating the two is most of the work.</p></>) },
    ],
  },
];

const SKY = [
  ["Vedic Sanskrit", "Dyáuṣ Pitā́", "sky father"],
  ["Greek", "Zeù Páter", "father Zeus"],
  ["Latin", "Iūpiter", "from an older Diēspiter"],
  ["Umbrian", "Iupater", ""],
  ["Illyrian", "Dei-pátrous", ""],
];

const UNDER = [
  { who: "Ireland", title: "The people who went under the hills", steps: [
    { label: "what they said", body: <p>Irish tradition describes a sequence of peoples arriving on the island, each displacing the last. The Tuatha Dé Danann are defeated by the final wave and withdraw, not overseas but downwards, into the mounds. They are still there, they are called the folk of the hills, and it is well understood that you do not annoy them.</p> },
    { label: "what was there", body: <p>The mounds are real, and they are neolithic. Newgrange was already three thousand years old when these stories were being told, built by people who had left no name, no language and no successors anybody could point to. An earlier population that went into the ground is a reasonable reading of a landscape full of enormous graves nobody could account for.</p> },
  ]},
  { who: "England", title: "The old work of giants", steps: [
    { label: "what they said", body: <p>An Old English poem stands in front of a ruined city of worked stone, with towers and roofs and baths that ran hot, and describes it as the work of giants, fallen now, its builders long in the earth.</p> },
    { label: "what was there", body: <p>The ruins were Roman. Nobody in tenth-century England could build in that manner or knew anybody who could, and there was no available account of who had. A larger and stronger race of men, since departed, explains the evidence with the resources to hand, and it is not obvious what a better answer would have looked like from there.</p> },
  ]},
  { who: "Hawai‘i", title: "The ones who worked at night", steps: [
    { label: "what they said", body: <p>The menehune are a small people who were on the islands before the Hawaiians. They work only after dark and only in one night, so a fishpond or a watercourse that took them longer than that was abandoned unfinished, and several are pointed out as such.</p> },
    { label: "what was there", body: <p>A number of the structures attributed to them exist and are substantially older than the surrounding settlement, and they represent a serious quantity of coordinated labour. A watercourse that nobody remembers digging needs an explanation, and the explanation offered is unusually specific about the workforce.</p> },
  ]},
  { who: "The Andes", title: "The builders of the towers", steps: [
    { label: "what they said", body: <p>Aymara and Quechua traditions describe the chullpas: an earlier people who lived before the present sun rose, in dimmer light, and who were destroyed when it did. Their name is also the name given to the stone tower tombs that stand across the high plateau.</p> },
    { label: "what was there", body: <p>The towers predate the Inca and were raised by populations whose own account of themselves has not survived in any form. What remains is the architecture, standing in open country, obviously deliberate and obviously not recent, with nobody left to ask.</p> },
  ]},
];

function TopicSix() {
  const [shown, setShown] = useState(false);
  return (
    <div className="un-root">
      <div className="un-wrap">
        <header className="un-mast">
          <p className="un-eyebrow">Six of six · Comparative mythology</p>
          <h1>The Older Layer</h1>
          <p className="un-standfirst">
            Old religious texts were copied by hand for centuries, and each
            generation of copyists adjusted what it disagreed with. What they did
            not think to adjust stayed exactly where it was.
            <br />
            <br />
            Which means the awkward leftovers — the lines that no longer fit the
            beliefs of the people preserving them — are very often the oldest and
            most reliable part of the whole thing.
          </p>
        </header>

        <section className="un-section">
          <h2>A text is not a thing. It is a stack of things.</h2>
          <p className="un-lead">
            When a story is written down, copied, added to and copied again over
            centuries, the result is a single object that reads as though one
            person made it. It was not. Under the surface there are earlier
            versions, later insertions, and material that came in from somewhere
            else entirely.
          </p>
          <p>
            Usually that has to be argued for. Occasionally the seams are visible
            to anybody who looks, which makes it a good place to learn what
            looking involves.
          </p>
          <p>
            The Epic of Gilgamesh is the best-preserved long poem from the ancient
            Near East, and it survives in several versions spread across roughly a
            thousand years.
          </p>

          <HowTo>
            The three buttons take you down through the text. The first shows it
            as it comes to us, and each one after that adds what is known about
            how it got that way.
          </HowTo>

          <Dig
            caption="The Epic of Gilgamesh · the version most people read"
            labels={["As it comes to us", "The different hands", "What is underneath"]}
            lines={GILG}
          />

          <p className="un-table-note" style={{ borderLeftColor: P.markSoft }}>
            Nothing there is speculation. There are physical tablets carrying the
            Sumerian poems, physical tablets carrying the flood story about
            Atrahasis, and a final tablet in which a character who has been dead
            for four tablets is walking around.
          </p>
        </section>

        <section className="un-section">
          <h2>Sometimes both layers survived, and you can compare them.</h2>
          <p className="un-lead">
            The Gilgamesh case works because different versions were written on
            different tablets and buried in different places. The same thing
            happens with texts that stayed in continuous use, and there the
            evidence takes a different form: manuscripts that disagree.
          </p>
          <p>
            Deuteronomy 32 contains a short passage about how the world's peoples
            were divided up. It exists in two forms, and the difference between
            them is a single phrase. What follows is a description of the passage
            rather than any translation of it, and the point at issue is a matter
            of manuscript evidence rather than of interpretation.
          </p>

          <Dig
            caption="Deuteronomy 32, verses 8 and 9 · a passage that exists in two forms"
            labels={["As it comes to us", "The manuscripts", "What follows from it"]}
            lines={DEUT}
          />

          <p className="un-table-note" style={{ borderLeftColor: P.markSoft }}>
            Reasonable people read this differently, and the scholarship on it is
            extensive and not settled. What is not in dispute is the manuscript
            situation: two ancient witnesses carry one phrase, later manuscripts
            carry another, and the older reading is the more difficult one, which
            is generally taken as a sign of age rather than of error.
          </p>
        </section>

        <section className="un-section">
          <h2>How much can you learn from somebody who wants it gone?</h2>
          <p className="un-lead">
            Anybody who has been described by an opponent knows the answer is
            not nothing. A hostile account gets the emphasis wrong and the
            motives wrong, and it is often extremely well informed about the
            details, because it had to be in order to land.
          </p>
          <p>
            The same thing happens on a scale of centuries. You cannot tell
            people to stop doing something without saying what it is, and you
            cannot refute a belief without first stating it. So the surviving
            record of a practice is very often produced by the people who wanted
            it stopped, and is frequently the only record there is.
          </p>
          <p>
            Three of them below. Each opens on what was actually found, and the
            second step is what follows from it.
          </p>
          {PRESERVED.map((c, i) => (
            <Stepped key={i} where={c.who} title={c.title} steps={c.steps} />
          ))}
        </section>

        <section className="un-section">
          <h2>And sometimes the only witness is the other side.</h2>
          <p className="un-lead">
            The previous section dealt with traditions arguing with themselves.
            This one is harder. There are whole religions for which no follower
            ever wrote a surviving account, and everything known about them comes
            from somebody who arrived from outside.
          </p>
          <p>
            That is not the same as the record being worthless. It does mean the
            record has a shape, and the shape belongs to the writer rather than to
            the subject.
          </p>
          {ENEMIES.map((c, i) => (
            <Stepped key={i} where={c.who} title={c.title} steps={c.steps} />
          ))}
          <p className="un-table-note" style={{ borderLeftColor: P.markSoft }}>
            Three writers, three purposes, and the same structural fact
            underneath. Each was working against the thing he was recording, and
            each is now indispensable, which is why the discipline spends so much
            of its time working out what a source was for.
          </p>
        </section>

        <section className="un-section">
          <h2>Some of them are cousins, and the family can be proved.</h2>
          <p className="un-lead">
            Everything so far has worked downwards through one tradition at a
            time. There is a second method that works sideways, and it is the
            reason this subject is a subject rather than a collection of
            resemblances.
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
            <span className="un-term">pater</span> turns up as French{" "}
            <span className="un-term">père</span>, Italian{" "}
            <span className="un-term">padre</span> and Spanish{" "}
            <span className="un-term">padre</span>. Those are not four similar
            words. They are one word, with each language's own regular changes
            applied to it, and those are the same changes that language applies to
            every other word it inherited.
          </p>
          <p>
            So if a divine name shows up across a family of languages, having been
            put through exactly those same changes, it did not travel on its own.
            It rode the language, along with the words for father and water and
            two.
          </p>

          <div className="un-table">
            <div className="un-table-cap">A god addressed as father sky</div>
            {SKY.map(([lang, form, gloss]) => (
              <div className="un-row" key={lang}>
                <span className="un-lang">{lang}</span>
                <span className="un-word">
                  {form}
                  {gloss && <span style={{ color: P.inkSoft, fontSize: "0.85rem", marginLeft: "0.6rem" }}>{gloss}</span>}
                </span>
              </div>
            ))}
            {shown && (
              <div className="un-row recon">
                <span className="un-lang">Reconstructed</span>
                <span className="un-word">*Dyēus ph₂tēr</span>
              </div>
            )}
          </div>

          <button className="un-btn" onClick={() => setShown(true)} disabled={shown}>
            {shown ? "That is the ancestor" : "Show me what they all come from"}
          </button>

          {shown && (
            <>
              <p style={{ marginTop: "2rem" }}>
                These are not similar names. They are the same name, in languages
                that separated thousands of years ago, each one having applied its
                own regular sound changes to it along the way.
              </p>
              <p>
                <strong>There was a community that said this.</strong> Not a
                theme, not an archetype, not a pattern in the human mind. A group
                of people, somewhere, who addressed the daylit sky as father, and
                whose descendants carried the phrase to Iceland and to the Ganges
                without ever knowing that they had.
              </p>
              <p>
                The same method finds the Norse god Týr, whose name comes from the
                ordinary word for a god in the parent language and is cognate with
                Zeus. By the time anybody wrote the Norse material down he was a
                minor figure who had lost a hand. The name is older than the
                position.
              </p>
            </>
          )}
        </section>

        <section className="un-section">
          <h2>And they were doing this too.</h2>
          <p className="un-lead">
            One last thing, and it is the reason the subject is worth a life
            rather than an afternoon.
          </p>
          <p>
            Everything above has involved standing in front of a tradition and
            working out what is underneath it. That is a modern activity with
            journals and departments attached. It is also, in a rougher form,
            something the traditions were already doing.
          </p>
          <p>
            People in every one of these places found monuments they had not
            built, in a style nobody around them could manage, left by somebody.
            And they did what anybody does with unreadable evidence. They
            explained it.
          </p>
          {UNDER.map((c, i) => (
            <Stepped key={i} where={c.who} title={c.title} steps={c.steps} />
          ))}

          <p style={{ marginTop: "2.4rem" }}>
            Four traditions on four continents, none of them in contact with the
            others, each arriving at a prior people who were smaller or larger or
            worked at night, and who are gone but not entirely gone. The
            explanations are wrong in the way that unaided explanations are wrong,
            and the observation underneath them is completely correct.{" "}
            <strong>
              Somebody was here before, and left something nobody could account
              for.
            </strong>
          </p>
          <p>
            Which is the whole of the subject in miniature. A myth is what a
            people says about a past it cannot reach, assembled out of whatever
            happens to be lying around, and it preserves far more than it means
            to.
          </p>
          <p style={{ color: P.inkSoft }}>
            Everyone who has ever tried to read the ground has been doing this.
            These are just the earliest drafts.
          </p>

          <div className="un-colophon">
            The Older Layer · six of six · the unhurried edition
          </div>
        </section>
      </div>
    </div>
  );
}

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
      "The people whose language became English, Greek and Hindi left no writing, no buildings and no graves anybody can identify. So how does anyone know they kept bees?",
    ready: true,
  },
  {
    id: "otherface",
    n: "Two",
    topic: "Early medieval history",
    title: "The Other Face",
    blurb:
      "The Franks claimed they came from Troy. Why would a people only two generations old need ancestors from a famous war fifteen centuries earlier?",
    ready: true,
  },
  {
    id: "break",
    n: "Three",
    topic: "The Bronze Age",
    title: "The Break",
    blurb:
      "Around 1200 BC a connected world came apart in about fifty years. What happens to a civilisation's memory of itself when everybody who could read is gone?",
    ready: true,
  },
  {
    id: "olderlayer",
    n: "Six",
    topic: "Comparative mythology",
    title: "The Older Layer",
    blurb:
      "Sacred texts were copied by hand for centuries, and each generation quietly adjusted what it disagreed with. So why is the older version still sitting in there?",
    ready: true,
  },
];

const MAKING = [
  {
    id: "apparatus",
    n: "Four",
    topic: "Making stories by machine",
    title: "The Apparatus",
    blurb:
      "A machine can invent ten thousand names, every one of them different from all the others. Why do they all feel like the same name?",
    ready: true,
  },
  {
    id: "whatexists",
    n: "Five",
    topic: "Designing records",
    title: "What Exists",
    blurb:
      "Every form you have ever filled in had boxes that somebody chose in advance. Whose name does not fit, and who decided that it would not?",
    ready: true,
  },
];

function Card({ item, onOpen }) {
  return (
    <button
      className="un-card"
      onClick={() => item.ready && onOpen(item.id)}
      disabled={!item.ready}
    >
      <div className="un-card-top">
        <span className="un-card-topic">{item.topic}</span>
        <span className="un-card-n">{item.ready ? item.n : "not yet"}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.blurb}</p>
    </button>
  );
}

function Index({ onOpen }) {
  return (
    <div className="un-root">
      <div className="un-wrap">
        <header className="un-mast">
          <p className="un-eyebrow">Six explainers</p>
          <h1>What Nobody Meant</h1>
          <p className="un-standfirst">
            Six things I find it very hard to shut up about.
          </p>
        </header>

        <section className="un-section">
          <h2>Start with a seagull.</h2>
          <p className="un-lead">
            In Chekhov's play <em>The Seagull</em>, a young woman called Nina
            describes what has become of her. In Russian she says two words:{" "}
            <span className="un-term">ya chaika</span>. Russian has no word for{" "}
            <em>the</em> and no word for <em>a</em>, so what she says is, word
            for word, <em>I seagull</em>.
          </p>
          <p>
            English will not let a translator leave that alone. You have to
            choose between <em>I am the seagull</em>, which points back to a
            particular bird earlier in the play, and{" "}
            <em>I am a seagull</em>, which is a stranger and more frightening
            thing for a person to say about herself. Both are defensible.
            Chekhov committed to neither, because his language never made him.
          </p>
          <p>
            <strong>
              When we make decisions about how we represent the world, what are
              the hidden costs?
            </strong>
          </p>
        </section>

        <section className="un-section">
          <h2>The six.</h2>
          <p>Read them in any order.</p>

          <div className="un-group-label">Reading what survived</div>
          <p className="un-group-note">
            Somebody else's broken record, and what can be got back out of it.
          </p>
          <div className="un-cards">
            {READING.map((t) => (
              <Card item={t} key={t.id} onOpen={onOpen} />
            ))}
          </div>

          <div className="un-group-label">Building the conditions</div>
          <p className="un-group-note">
            The same interest from the other end: machines that manufacture an
            unreadable past on purpose, and decisions about what is allowed to
            exist at all.
          </p>
          <div className="un-cards">
            {MAKING.map((t) => (
              <Card item={t} key={t.id} onOpen={onOpen} />
            ))}
          </div>
        </section>

        <section className="un-section">
          <h2>What the six have in common.</h2>
          <p>
            Skip this and come back to it, if you like. It will make more sense
            once you have read one of them.
          </p>
          <p>
            They look unrelated and they are the same interest wearing six sets
            of clothes. Three things are true of all of them at once, and a
            subject that misses any one of the three does not hold my attention
            at all.
          </p>
          <div className="un-points">
            <div className="un-point">
              <div className="un-point-n">The first</div>
              <p>
                <strong>The subject is people, not a system.</strong> A god
                somebody actually worshipped, rather than a type of story. If it
                does not deliver a person who was really there, it does not
                qualify.
              </p>
            </div>
            <div className="un-point">
              <div className="un-point-n">The second</div>
              <p>
                <strong>The evidence was never meant for us.</strong> A place
                name, a schoolmaster's list of mistakes, an argument that has to
                describe the thing it wants abolished. Nobody was trying to
                inform anybody, which is exactly why it can be trusted.
              </p>
            </div>
            <div className="un-point">
              <div className="un-point-n">The third</div>
              <p>
                <strong>Something is at stake in the resolving.</strong> Either
                the chain carrying the meaning broke and nobody alive can read it
                now, or two incompatible systems met and somebody was forced to
                commit.
              </p>
            </div>
          </div>

          <div className="un-colophon">
            The unhurried edition · all six
          </div>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

const VIEWS = {
  inherited: TopicOne,
  otherface: TopicTwo,
  break: TopicThree,
  apparatus: TopicFour,
  whatexists: TopicFive,
  olderlayer: TopicSix,
};
const ALL = [...READING, ...MAKING];
const READY = ALL.filter((t) => t.ready).map((t) => t.id);
const titleOf = (id) => (ALL.find((t) => t.id === id) || {}).title;

export default function UnhurriedEdition() {
  const [view, setView] = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current && topRef.current.scrollIntoView) {
      topRef.current.scrollIntoView({ block: "start" });
    }
  }, [view]);

  const pos = view ? READY.indexOf(view) : -1;
  const next = pos >= 0 && pos < READY.length - 1 ? READY[pos + 1] : null;
  const Current = view ? VIEWS[view] : null;

  return (
    <div className="un-shell">
      <style>{styles}</style>
      <div ref={topRef} />
      {!view && <Index onOpen={setView} />}
      {view && (
        <>
          <div className="un-bar">
            <div className="un-bar-inner">
              <button className="un-bar-btn" onClick={() => setView(null)}>
                ← Back to the six
              </button>
              <span className="un-bar-where">{titleOf(view)}</span>
              <button
                className="un-bar-btn"
                onClick={() => next && setView(next)}
                disabled={!next}
              >
                Next →
              </button>
            </div>
          </div>
          <Current />
        </>
      )}
    </div>
  );
}
