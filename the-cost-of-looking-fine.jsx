import { useState } from "react";

// ---------- palette: the assessment sheet ----------
const C = {
  paper: "#FFFFFF",
  page: "#EFEEE8", // tracks, readout beds
  panel: "#FFFFFF",
  ink: "#0B0B0B",
  mute: "#5C5C58",
  rule: "#0B0B0B",
  hair: "#DDDCD6",
  reason: "#1230C8", // the reasoning trait: ultramarine
  reasonSoft: "#E3E7FF",
  drag: "#DF3A1B", // the executive drag: vermilion
  dragSoft: "#FFE4DC",
  amber: "#6E5400",
  amberSoft: "#FFE95C", // marker-pen yellow
};
const MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const DISPLAY = "'Instrument Serif', 'Times New Roman', serif";

// ---------- small maths ----------
function erf(x) {
  const s = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return s * y;
}
const phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));

// ---------- shared bits ----------
const Prose = ({ children, style }) => (
  <p style={{ margin: "0 0 1.15em", ...style }}>{children}</p>
);

const Kicker = ({ children, colour }) => (
  <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: colour || C.mute }}>
    {children}
  </span>
);

const Toy = ({ colour, label, children }) => (
  <div
    style={{
      background: C.panel,
      border: `1.5px solid ${C.ink}`,
      padding: "14px 16px 18px",
      margin: "1.4em 0 1.8em",
      boxShadow: `6px 6px 0 ${colour}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: `1.5px solid ${C.ink}` }}>
      <span style={{ width: 12, height: 12, background: colour, display: "inline-block", flexShrink: 0 }} />
      <Kicker colour={C.ink}>{label}</Kicker>
    </div>
    {children}
  </div>
);

const Control = ({ label, children }) => (
  <label style={{ display: "block", margin: "14px 0 6px" }}>
    <span style={{ display: "block", fontFamily: MONO, fontSize: 13, letterSpacing: "0.04em", marginBottom: 6, color: C.ink }}>
      {label}
    </span>
    {children}
  </label>
);

const Slider = (props) => (
  <input
    type="range"
    {...props}
    style={{ width: "100%", accentColor: props.colour || C.ink, height: 28 }}
  />
);

const Readout = ({ children, colour }) => (
  <div
    style={{
      fontSize: 17,
      lineHeight: 1.5,
      padding: "12px 14px 14px",
      background: C.page,
      marginTop: 12,
      borderTop: `4px solid ${colour || C.ink}`,
    }}
  >
    <div style={{ marginBottom: 6 }}>
      <Kicker colour={colour || C.ink}>Readout</Kicker>
    </div>
    {children}
  </div>
);

const Button = ({ children, onClick, active, colour }) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: MONO,
      fontSize: 14,
      letterSpacing: "0.02em",
      padding: "10px 14px",
      border: `1.5px solid ${C.ink}`,
      background: active ? colour || C.ink : C.panel,
      color: active ? "#fff" : C.ink,
      cursor: "pointer",
      marginRight: 8,
      marginBottom: 8,
      boxShadow: active ? "none" : `3px 3px 0 ${C.ink}`,
      transform: active ? "translate(3px, 3px)" : "none",
    }}
  >
    {children}
  </button>
);

const Aside = ({ children }) => (
  <div
    style={{
      background: C.amberSoft,
      border: `1.5px solid ${C.ink}`,
      padding: "14px 16px",
      fontSize: 17,
      lineHeight: 1.5,
      margin: "1.2em 0",
    }}
  >
    <div style={{ marginBottom: 6 }}>
      <Kicker colour={C.ink}>Disclosure</Kicker>
    </div>
    {children}
  </div>
);

// ============================================================
// TOY 1 — where the score sits
// ============================================================
function CurveToy() {
  const [score, setScore] = useState(162);
  const z = (score - 100) / 15;
  const above = 1 - phi(z);
  const oneIn = above > 0 ? Math.round(1 / above) : Infinity;
  const W = 340,
    H = 120;
  const xOf = (s) => ((s - 40) / (180 - 40)) * W;
  const ptOf = (s) => {
    const zz = (s - 100) / 15;
    const y = H - 8 - Math.exp(-(zz * zz) / 2) * (H - 20);
    return `${xOf(s).toFixed(1)},${y.toFixed(1)}`;
  };
  const solid = [], dotted = [];
  for (let s = 40; s <= 150; s += 1) solid.push(ptOf(s));
  for (let s = 150; s <= 180; s += 1) dotted.push(ptOf(s));
  const beyond = score > 160;
  const sampleN = 2200;
  const expected = sampleN * above;
  let sample;
  if (score <= 150)
    sample = (
      <>
        Of the 2,200 people the current children&rsquo;s test was calibrated on, about{" "}
        <strong>{expected >= 10 ? Math.round(expected) : expected.toFixed(1)}</strong> would be
        expected to score here or higher. The line is still standing on people.
      </>
    );
  else if (score <= 160)
    sample = (
      <>
        Sixteen of those 2,200 scored above 150 on any composite, and exactly one reached 151 on
        the reasoning-only composite. The dotted line means the marker is standing on a handful
        of people, and the number under it is getting soft.
      </>
    );
  else
    sample = (
      <>
        Nobody. Past 160 the scale is extended norms: a statistical model of where people would
        fall if there were enough of them, built from a separate sample of about a hundred
        high-scoring children. The rank &ldquo;very rare&rdquo; is solid. The digits are not.
      </>
    );
  return (
    <Toy colour={C.reason} label="Toy 1 of 11: A Score on the Curve">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <rect x={xOf(160)} y={0} width={W - xOf(160)} height={H} fill={C.rule} opacity="0.35" />
        <polyline points={solid.join(" ")} fill="none" stroke={C.ink} strokeWidth="2" />
        <polyline points={dotted.join(" ")} fill="none" stroke={C.ink} strokeWidth="2" strokeDasharray="3 4" />
        <line x1={xOf(150)} x2={xOf(150)} y1={H - 30} y2={H} stroke={C.mute} strokeDasharray="2 3" />
        <text x={xOf(150) - 3} y={H - 32} fontSize="10" fill={C.mute} textAnchor="end">
          sample thins
        </text>
        <line x1={xOf(160)} x2={xOf(160)} y1={0} y2={H} stroke={C.mute} strokeDasharray="4 3" />
        <text x={xOf(160) + 4} y={14} fontSize="11" fill={C.mute}>
          most tests stop here
        </text>
        <line x1={xOf(score)} x2={xOf(score)} y1={0} y2={H} stroke={C.reason} strokeWidth="3" />
        {[70, 100, 130, 160].map((s) => (
          <text key={s} x={xOf(s)} y={H} fontSize="11" fill={C.mute} textAnchor="middle">
            {s}
          </text>
        ))}
      </svg>
      <Control label={`Drag to set the score: ${score}`}>
        <Slider min={70} max={175} value={score} onChange={(e) => setScore(+e.target.value)} colour={C.reason} />
      </Control>
      <Readout colour={C.reason}>
        A score of <strong>{score}</strong> is {z >= 0 ? "+" : ""}
        {z.toFixed(1)} standard deviations from the middle. Roughly{" "}
        <strong>1 person in {oneIn.toLocaleString()}</strong> scores this high or higher.
        {beyond && (
          <>
            {" "}
            The grey zone matters: the standard adult tests run out at about 160, so a number
            above it comes from extended norms, and the error bars are wide.
          </>
        )}
        {score === 162 && (
          <>
            {" "}
            And in the case this page is built around, the 162 is not one measurement. It is an
            average across several index scores, on extended norms, with the lowest of them down at
            118. The marker is standing where the midpoint of a very wide spread happens to fall.
            Toy 4 opens that spread up.
          </>
        )}
      </Readout>
      <Readout colour={score > 150 ? C.drag : C.mute}>
        <strong>Who was actually measured here.</strong> {sample}
      </Readout>
    </Toy>
  );
}

// ============================================================
// TOY 7 — interest in, attention out
// ============================================================
function AttentionToy() {
  const [interest, setInterest] = useState(7);
  const W = 340,
    H = 140;
  const adhd = (i) => 100 / (1 + Math.exp(-1.6 * (i - 6.2)));
  const typical = (i) => 38 + 5.5 * i;
  const xOf = (i) => 20 + (i / 10) * (W - 30);
  const yOf = (v) => H - 14 - (v / 100) * (H - 26);
  const path = (f) => {
    const p = [];
    for (let i = 0; i <= 10; i += 0.25) p.push(`${xOf(i).toFixed(1)},${yOf(f(i)).toFixed(1)}`);
    return p.join(" ");
  };
  const a = adhd(interest);
  let verdict;
  if (interest <= 2.5)
    verdict =
      "Almost nothing arrives. This is not a choice. Under-stimulation in this brain is aversive, close to physical discomfort in most descriptions, and a very fast mind fed slow input feels it acutely.";
  else if (interest <= 5.5)
    verdict =
      "The dangerous middle. The task is important enough to matter and dull enough to be nearly impossible to start. Most of adult life lives here.";
  else if (interest <= 8)
    verdict = "The switch flips. Attention floods in and the work looks effortless, because right now it is.";
  else
    verdict =
      "Hyperfocus. Hours vanish. Everyone calls this genius, and it is the same dysregulated switch that produced the dead zone on the left.";
  return (
    <Toy colour={C.drag} label="Toy 7 of 11: Interest In, Attention Out">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <line x1={20} x2={W - 10} y1={H - 14} y2={H - 14} stroke={C.rule} />
        <polyline points={path(typical)} fill="none" stroke={C.rule} strokeWidth="2" strokeDasharray="5 4" />
        <polyline points={path(adhd)} fill="none" stroke={C.drag} strokeWidth="3" />
        <circle cx={xOf(interest)} cy={yOf(a)} r="6" fill={C.drag} />
        <text x={xOf(0)} y={H} fontSize="11" fill={C.mute}>
          dull
        </text>
        <text x={xOf(10)} y={H} fontSize="11" fill={C.mute} textAnchor="end">
          fascinating
        </text>
        <text x={W - 10} y={yOf(typical(10)) - 6} fontSize="11" fill={C.mute} textAnchor="end">
          a typical brain (dashed)
        </text>
      </svg>
      <Control label={`Drag to set how interesting the task is: ${interest} of 10`}>
        <Slider min={0} max={10} step={0.5} value={interest} onChange={(e) => setInterest(+e.target.value)} colour={C.drag} />
      </Control>
      <Readout colour={C.drag}>
        Attention available: <strong>{Math.round(a)}%</strong>. {verdict}
      </Readout>
    </Toy>
  );
}

// ============================================================
// TOY 8 — the room
// ============================================================
const STAGES = [
  { name: "Primary school", age: "5 to 11", structure: 85, interest: 55 },
  { name: "Early secondary", age: "12 to 14", structure: 55, interest: 35 },
  { name: "GCSEs", age: "15 to 16", structure: 50, interest: 30 },
  { name: "A-levels", age: "16 to 18", structure: 30, interest: 25 },
  { name: "No degree, ordinary jobs", age: "19 to 25", structure: 35, interest: 20 },
  { name: "A master’s degree", age: "26", structure: 75, interest: 90 },
  { name: "Back into normal life", age: "27 onwards", structure: 30, interest: 30 },
];
const attentionFrom = (interest) => 100 / (1 + Math.exp(-1.6 * (interest / 10 - 6.2)));
const outputFrom = (structure, interest) =>
  Math.round(Math.min(100, Math.max(attentionFrom(interest), structure * 0.85)));
const verdictFor = (o) =>
  o >= 85 ? "Distinction" : o >= 65 ? "Doing well" : o >= 45 ? "Floundering" : "Falling apart";

function RoomToy() {
  const [k, setK] = useState(0);
  const [addStructure, setAddStructure] = useState(false);
  const [addInterest, setAddInterest] = useState(false);
  const s = STAGES[k];
  const structure = Math.min(100, s.structure + (addStructure ? 40 : 0));
  const interest = Math.min(100, s.interest + (addInterest ? 50 : 0));
  const output = outputFrom(structure, interest);
  const real = outputFrom(s.structure, s.interest);
  const changed = output !== real;
  const W = 340,
    H = 90;
  const xOf = (i) => 14 + (i / (STAGES.length - 1)) * (W - 28);
  const yOf = (v) => H - 10 - (v / 100) * (H - 20);
  const line = STAGES.map((st, i) => `${xOf(i)},${yOf(outputFrom(st.structure, st.interest))}`).join(" ");
  const Bar = ({ v, colour, label }) => (
    <div style={{ margin: "8px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ color: C.mute }}>{v}%</span>
      </div>
      <div style={{ height: 16, background: C.page, overflow: "hidden" }}>
        <div style={{ width: `${v}%`, height: "100%", background: colour, transition: "width 0.25s" }} />
      </div>
    </div>
  );
  const notes = [
    "The timetable is handed over complete, and the material is at least mildly new. The room is doing the executive work, so the executive drag is invisible. Praise arrives. “Gifted.”",
    "The first real drop, and it comes early. Secondary school starts expecting the pupil to carry the structure themselves, the homework, the planning, the remembering, at exactly the moment the content slows down. The reasoning has not changed at all. The room has.",
    "Still floundering. Reports say “could do so much more”, which is true and useless: it names the knowing, not the doing.",
    "Almost no structure, subjects chosen years ago that have stopped being interesting. This is where dropping out happens. From outside it reads as a bright person throwing it away.",
    "Years without a qualification, in jobs that supply neither scaffolding nor fascination. The line stays low. Everyone, including the person, now has a story in which the early promise was a fluke.",
    "Then a room that fits: a subject chosen for love, dense deadlines, a cohort, a supervisor. Attention floods in from the right of Toy 7 and structure covers the rest. A distinction at 26, with no undergraduate degree underneath it. The same ability meeting the right room for the first time since primary school.",
    "The course ends and normal life resumes: no timetable, no cohort, nothing on fire. The line falls straight back. Nothing was lost between the distinction and the collapse. The room changed again.",
  ];
  return (
    <Toy colour={C.drag} label="Toy 8 of 11: The Room">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <line x1={14} x2={W - 14} y1={yOf(100)} y2={yOf(100)} stroke={C.reason} strokeWidth="2" />
        <text x={W - 14} y={yOf(100) - 3} fontSize="11" fill={C.reason} textAnchor="end">
          reasoning available: never moves
        </text>
        <polyline points={line} fill="none" stroke={C.drag} strokeWidth="2.5" />
        {STAGES.map((st, i) => (
          <circle
            key={st.name}
            cx={xOf(i)}
            cy={yOf(outputFrom(st.structure, st.interest))}
            r={i === k ? 7 : 4}
            fill={i === k ? C.drag : C.panel}
            stroke={C.drag}
            strokeWidth="2"
          />
        ))}
      </svg>
      <Control label={`Drag through life: ${s.name}, age ${s.age}`}>
        <Slider min={0} max={STAGES.length - 1} step={1} value={k} onChange={(e) => { setK(+e.target.value); setAddStructure(false); setAddInterest(false); }} colour={C.drag} />
      </Control>
      <Bar v={structure} colour={C.mute} label="Structure the room supplies" />
      <Bar v={interest} colour={C.amber} label="How interesting the room is" />
      <Bar v={output} colour={C.drag} label="What everyone else sees" />
      <div style={{ fontSize: 22, fontWeight: 700, margin: "10px 0 6px", color: output >= 65 ? C.reason : C.drag }}>
        {verdictFor(output)}
        {changed && <span style={{ fontSize: 15, fontWeight: 400, color: C.mute }}> (was: {verdictFor(real)})</span>}
      </div>
      <div style={{ marginTop: 6 }}>
        <Button active={addStructure} onClick={() => setAddStructure(!addStructure)} colour={C.mute}>
          {addStructure ? "Remove the added structure" : "Add structure to this stage"}
        </Button>
        <Button active={addInterest} onClick={() => setAddInterest(!addInterest)} colour={C.amber}>
          {addInterest ? "Make it dull again" : "Make this stage interesting"}
        </Button>
      </div>
      <Readout colour={output >= 65 ? C.reason : C.drag}>
        {changed
          ? `Same person, same year, different room. ${addStructure && addInterest ? "You added structure and made it interesting" : addStructure ? "You added structure: a timetable, deadlines, somebody checking" : "You made it interesting: the attention switch from Toy 7 flipped"}, and the verdict moved from ${verdictFor(real).toLowerCase()} to ${verdictFor(output).toLowerCase()}. Neither button touched the reasoning line at the top. ${addStructure && !addInterest ? "Structure substitutes for the executive machinery the person cannot generate internally." : ""}${addInterest && !addStructure ? "Interest supplies the attention that importance alone cannot." : ""}`
          : notes[k]}
      </Readout>
    </Toy>
  );
}

// ============================================================
// TOY 4 — two rulers
// ============================================================
const COMPOSITE = 162;
const INDICES = [
  { key: "Verbal reasoning (inferred)", v: 196, inferred: true },
  { key: "Abstract reasoning (inferred)", v: 188, inferred: true },
  { key: "Working memory", v: 124 },
  { key: "Processing speed", v: 118 },
];
function RulersToy() {
  const [mode, setMode] = useState("pop");
  const peak = Math.max(...INDICES.map((i) => i.v));
  const ref = mode === "pop" ? 100 : peak;
  const pct = (v) => ((v - 60) / (215 - 60)) * 100;
  return (
    <Toy colour={C.reason} label="Toy 4 of 11: The Same Four Numbers, Two Rulers">
      <div style={{ fontSize: 15, color: C.mute, marginBottom: 8 }}>
        Two anchors are real: the composite of 162, and a floor of 118 on the indices ADHD drags
        down. The two reasoning bars are inferred from those &mdash; a composite that averages to
        162 with a floor at 118 must have peaks well above 162 &mdash; and their exact heights are
        illustrative.
      </div>
      <div style={{ marginBottom: 6 }}>
        <Button active={mode === "pop"} onClick={() => setMode("pop")} colour={C.reason}>
          Measure against everyone
        </Button>
        <Button active={mode === "own"} onClick={() => setMode("own")} colour={C.drag}>
          Measure against their own peak
        </Button>
      </div>
      <div style={{ position: "relative", padding: "6px 0" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${pct(ref)}%`,
            borderLeft: `2px dashed ${mode === "pop" ? C.mute : C.drag}`,
            transition: "left 0.3s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${pct(COMPOSITE)}%`,
            borderLeft: `2px solid ${C.amber}`,
          }}
        />
        <div style={{ fontSize: 12, color: C.amber, marginLeft: `${pct(COMPOSITE)}%`, paddingLeft: 4 }}>
          composite 162
        </div>
        {INDICES.map((i) => {
          const diff = i.v - ref;
          const bad = mode === "own" && diff <= -30;
          return (
            <div key={i.key} style={{ margin: "8px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 3 }}>
                <span>{i.key}</span>
                <span style={{ color: bad ? C.drag : C.mute, fontWeight: bad ? 700 : 400 }}>
                  {i.v} ({diff >= 0 ? "+" : ""}
                  {diff})
                </span>
              </div>
              <div style={{ height: 16, background: C.page }}>
                <div
                  style={{
                    width: `${pct(i.v)}%`,
                    height: "100%",
                    background: bad ? C.drag : C.reason,
                    transition: "background 0.3s",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <Readout colour={mode === "pop" ? C.reason : C.drag}>
        {mode === "pop" ? (
          <>
            <strong>Verdict: nothing here is below average.</strong> The floor is 118, which the
            manual calls &ldquo;high average&rdquo;. The dashed line is the population mean, and
            against it this person is above it on everything, including the two abilities ADHD
            damages. A clinic using this ruler sends them home. This is what Milioni and colleagues
            found in 2017: put high-IQ adults with ADHD through the standard test battery and they
            look almost normal on nearly every task.
          </>
        ) : (
          <>
            <strong>Verdict: the two dragged abilities sit roughly five standard deviations below
            the person&rsquo;s own ceiling.</strong> The dashed line is now their best index. The
            composite of 162 is an average, so it hides the size of the split: with a floor of 118,
            the peaks have to be far above 162, and the gap from peak to floor is at least 44 points
            and probably more like 70. This is what Brown, Reichel and Quinlan found in 2009, at
            smaller scale: measured against their own verbal ability, 73% of high-IQ adults with
            ADHD were impaired on most of the executive markers. The numbers did not change between the two buttons; the ruler did.
          </>
        )}
      </Readout>
      <Aside>
        Two knock-on effects of the headline number being an average. First, the 162 understates
        the reasoning: strip out the two dragged indices and the reasoning-only composite would sit
        well above it. Second, the 162 flatters the executive side: it lets a 118 hide inside a
        number that sounds like uniform brilliance. The single figure is wrong in both directions
        at once, and the direction it is wrong in depends on which trait you are asking about.
      </Aside>
    </Toy>
  );
}

// ============================================================
// TOY 9 — knowing and doing
// ============================================================
const PLAN = [
  { text: "Open the expenses portal", extra: { 1: "It times out after ten minutes, so have the receipt ready before you open it." } },
  { text: "Find the receipt", extra: { 3: "It is a PDF attachment in an email from 14 weeks ago; the portal only takes JPG, so screenshot it." } },
  { text: "Enter the amount: £41.00", extra: {} },
  { text: "Choose the cost code", extra: { 2: "The list is alphabetical by department, not by project. Finance bounces the wrong one." } },
  { text: "Press submit", extra: { 4: "Fourteen weeks crosses a quarter boundary: select the previous period first or it silently fails." } },
];
const PLAN_STEPS = PLAN.map((p) => p.text);
const ALONE = [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0];
const WITH_HELP = [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1];
const DERAILS = [
  "Opened email to find the receipt. Read four other emails. Closed email.",
  "Decided the cost-code list should really be searchable. Spent twenty minutes on that thought.",
  "Made tea.",
  "It is somehow 4pm.",
  "Noticed the portal’s date picker is broken in Firefox. Confirmed this. Did not enter the date.",
  "Started, then remembered the other thing that is also overdue.",
  "Re-read the plan. It is a good plan.",
  "Tomorrow. Definitely tomorrow.",
];
function DoingToy() {
  const [iq, setIq] = useState(120);
  const [help, setHelp] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(0);
  const [log, setLog] = useState([]);
  const level = Math.min(5, Math.floor((iq - 100) / 12.5));
  const plan = level >= 1 ? [PLAN[1], PLAN[0], ...PLAN.slice(2)] : PLAN;
  const seq = help ? WITH_HELP : ALONE;
  const finished = done >= PLAN_STEPS.length;
  const [marks, setMarks] = useState([]);
  const tryStep = () => {
    if (finished) return;
    const ok = seq[attempts % seq.length] === 1;
    setAttempts(attempts + 1);
    setMarks([...marks, ok]);
    if (ok) {
      setDone(done + 1);
      setLog([`Attempt ${attempts + 1}: did step ${done + 1}.`, ...log].slice(0, 4));
    } else {
      setLog([`Attempt ${attempts + 1}: ${DERAILS[attempts % DERAILS.length]}`, ...log].slice(0, 4));
    }
  };
  const reset = () => {
    setAttempts(0);
    setDone(0);
    setLog([]);
    setMarks([]);
  };
  return (
    <Toy colour={C.reason} label="Toy 9 of 11: Knowing and Doing">
      <div style={{ fontSize: 16, marginBottom: 4 }}>The task: claim back £41 that has been owed for fourteen weeks.</div>
      <Control label={`Drag to add knowledge (a stand-in for reasoning): ${iq}`}>
        <Slider min={100} max={162} value={iq} onChange={(e) => setIq(+e.target.value)} colour={C.reason} />
      </Control>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
        <div style={{ background: C.reasonSoft, padding: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: C.reason }}>Knowing</div>
          {level >= 5 && (
            <div style={{ fontSize: 13, color: C.reason, fontStyle: "italic", marginBottom: 6 }}>
              Every note below is why the form is hard, and knowing all of them is why it feels like it should be easy.
            </div>
          )}
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.4, listStyle: "decimal" }}>
            {plan.map((p, i) => {
              const notes = Object.entries(p.extra).filter(([lv]) => level >= +lv).map(([, t]) => t);
              return (
                <li key={p.text} style={{ background: level >= 1 && i < 2 ? C.amberSoft : "transparent", marginBottom: 4 }}>
                  {p.text}
                  {notes.map((t) => (
                    <div key={t} style={{ fontSize: 13, color: C.reason, fontStyle: "italic", marginTop: 2 }}>
                      {t}
                    </div>
                  ))}
                </li>
              );
            })}
          </ol>
        </div>
        <div style={{ background: C.dragSoft, padding: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: C.drag }}>Doing</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {PLAN_STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 14, background: i < done ? C.drag : C.panel, border: `1px solid ${C.drag}` }} />
            ))}
          </div>
          <div style={{ fontSize: 14 }}>
            Steps done: <strong>{done}</strong> of {PLAN_STEPS.length}
            <br />
            Attempts to start: <strong>{attempts}</strong>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 8 }}>
            {marks.map((ok, i) => (
              <span key={i} title={ok ? "a step" : "a derailment"} style={{ width: 10, height: 10, display: "inline-block", background: ok ? C.drag : "transparent", border: `1.5px solid ${C.drag}` }} />
            ))}
          </div>
          <div style={{ fontSize: 13, color: C.mute, marginTop: 8, lineHeight: 1.4 }}>
            {help ? "Odds with a colleague there: about four attempts in five move a step." : "Odds alone: about one attempt in four moves a step."} The sequence is fixed and the same for everyone.
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <Button onClick={tryStep} active={!finished} colour={C.drag}>
          {finished ? "Submitted" : "Try to do the next step"}
        </Button>
        <Button onClick={() => { setHelp(!help); }} active={help} colour={C.mute}>
          {help ? "Send the colleague away" : "A colleague sits down next to you"}
        </Button>
        {attempts > 0 && (
          <Button onClick={reset} colour={C.mute}>
            Start the week again
          </Button>
        )}
      </div>
      {log.length > 0 && (
        <div style={{ marginTop: 10, fontSize: 15, color: C.mute, lineHeight: 1.5 }}>
          {log.map((l, i) => (
            <div key={i} style={{ opacity: 1 - i * 0.2 }}>
              {l}
            </div>
          ))}
        </div>
      )}
      <Readout colour={C.drag}>
        {finished ? (
          <>
            <strong>Submitted, after {attempts} attempts.</strong> Look at the ratio. The plan on the
            left was complete and correct from the first second; the right-hand side needed{" "}
            {attempts} runs at it to execute five steps. That ratio is the gap, and it sits between having a plan and the plan happening. The
            slider only ever made the plan better.
          </>
        ) : (
          <>
            Move the slider and watch the left column: the plan gets sharper, the traps get named,
            the person can tell you exactly why this form is hard. Now press the button on the right
            and watch what the slider did to execution: nothing. Then let the colleague sit down.
            Structure changes the right column. Knowledge never does. That is Barkley&rsquo;s point
            in one form: &ldquo;people with ADHD know what to do; they cannot do what they
            know.&rdquo; &ldquo;You&rsquo;re so clever, just apply yourself&rdquo; is advice aimed
            at the column that was never the problem.
          </>
        )}
      </Readout>
    </Toy>
  );
}

// ============================================================
// TOY 10 — the loop
// ============================================================
const LOOP = [
  {
    t: "A standard is set",
    r: (lap) =>
      lap === 0
        ? "It is set very high, because the person can see exactly what excellent looks like."
        : "Higher than last time, because last time has to be made up for.",
    who: C.reason,
  },
  {
    t: "Starting doesn’t happen",
    r: (lap) =>
      lap === 0
        ? "The task is important and dull. Toy 7 showed what the attention system does with that."
        : "The task is important, dull, and now also carries the memory of every previous time. Opening it means feeling all of that first.",
    who: C.drag,
  },
  {
    t: "Time goes missing",
    r: () => "Deadlines are known in the abstract and not felt in the body. It is suddenly the night before.",
    who: C.drag,
  },
  {
    t: "A rescue, or a miss",
    r: (lap) =>
      lap < 2
        ? "Hyperfocus salvages something creditable at 3am, or nothing arrives. Either way it fell short of the standard from step one."
        : "The 3am rescue is getting rarer. Hyperfocus needs something to grip, and dread is not it. More often now, nothing arrives.",
    who: C.reason,
  },
  {
    t: "Shame",
    r: (lap) =>
      lap === 0
        ? "“If I’m this capable, this shouldn’t be hard.” Landing on a nervous system already primed to feel criticism as pain."
        : "Not a new feeling now; a familiar one, arriving on schedule, and a little larger each time because it has evidence.",
    who: C.drag,
  },
  {
    t: "The standard goes up",
    r: () => "Next time will make up for it. The standard rises to cover the shame, which makes step two more likely.",
    who: C.reason,
  },
];
function LoopToy() {
  const [i, setI] = useState(0);
  const [laps, setLaps] = useState(0);
  const [helped, setHelped] = useState(false);
  const step = LOOP[i];
  const standard = Math.min(100, 50 + 12 * laps);
  const dread = Math.max(0, Math.min(100, 20 * laps - (helped ? 30 : 0)));
  const startChance = Math.max(5, Math.min(90, 80 - 16 * laps + (helped ? 45 : 0)));
  const rescueChance = Math.max(5, 65 - 15 * laps);
  const next = () => {
    if (i === LOOP.length - 1) setLaps(laps + 1);
    setI((i + 1) % LOOP.length);
  };
  const Gauge = ({ label, v, colour, rising }) => (
    <div style={{ margin: "6px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 2 }}>
        <span>{label}</span>
        <span style={{ color: colour, fontWeight: 600 }}>
          {v}% {laps > 0 && (rising ? "↑" : "↓")}
        </span>
      </div>
      <div style={{ height: 12, background: C.page, overflow: "hidden" }}>
        <div style={{ width: `${v}%`, height: "100%", background: colour, transition: "width 0.4s" }} />
      </div>
    </div>
  );
  return (
    <Toy colour={C.amber} label="Toy 10 of 11: The Loop">
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {LOOP.map((s, k) => (
          <div key={k} style={{ flex: 1, height: 8, background: k === i ? s.who : k < i ? C.rule : C.page, border: `1px solid ${C.rule}` }} />
        ))}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
        {i + 1}. {step.t}
        {laps > 0 && <span style={{ fontSize: 15, fontWeight: 400, color: C.mute }}> (lap {laps + 1})</span>}
      </div>
      <div style={{ fontSize: 15, color: step.who, marginBottom: 8 }}>
        {step.who === C.reason ? "The reasoning trait does this part." : "The executive drag does this part."}
      </div>
      <Prose style={{ fontSize: 18 }}>{step.r(laps)}</Prose>
      <div style={{ background: C.page, padding: "10px 12px", margin: "8px 0 12px" }}>
        <div style={{ fontSize: 14, color: C.mute, marginBottom: 4 }}>{laps === 0 ? "Where things stand before the first lap" : "What each lap leaves behind"}</div>
        <Gauge label="The standard the work must meet" v={standard} colour={C.reason} rising />
        <Gauge label="Dread on opening the task" v={dread} colour={C.drag} rising />
        <Gauge label="Chance of starting next time" v={startChance} colour={C.amber} />
        <Gauge label="Chance the 3am rescue works" v={rescueChance} colour={C.amber} />
      </div>
      <Button onClick={next} active colour={C.amber}>
        {i === LOOP.length - 1 ? "Go round again" : "What happens next"}
      </Button>
      {laps >= 2 && (
        <Button onClick={() => setHelped(!helped)} active={helped} colour={C.mute}>
          {helped ? "Take the help away" : "Someone intervenes: diagnosis, medication, a person alongside"}
        </Button>
      )}
      {laps > 0 && (
        <Readout colour={C.amber}>
          {helped ? (
            <>
              Look at which gauges moved. Dread dropped and the chance of starting recovered:
              those are the executive drag, and medication and external structure act on them
              directly. The standard did not move. That one belongs to the reasoning trait and to
              years of evidence, and a prescription does nothing to it. This is why people describe
              a late diagnosis as a relief and not a cure: the loop gets slower, but the residue of
              every previous lap is still there to be worked through.
            </>
          ) : laps >= 4 ? (
            <>
              By now the task itself is nearly irrelevant. The loop runs on what the loop produces:
              the standard is so high that anything that could be produced would fail it, dread makes
              starting close to impossible, and hyperfocus &mdash; which needs something it wants
              to grip &mdash; will not come to something that only frightens. Nothing about this
              person&rsquo;s reasoning has changed since lap one. Everything about their odds has.
            </>
          ) : (
            <>
              Lap {laps + 1}. Watch the four gauges: none of them reset. Notice that the two traits
              take alternate turns &mdash; one supplies the standard and the rescue, the other the
              stall and the sting &mdash; and that the two things going up belong to different
              traits. Neither could sustain the loop alone.
            </>
          )}
        </Readout>
      )}
    </Toy>
  );
}

// ============================================================
// SECTION WRAPPER (collapsed by default)
// ============================================================
function Section({ n, title, children, open, onToggle }) {
  const setOpen = () => onToggle();
  return (
    <section style={{ borderTop: `1.5px solid ${C.ink}` }}>
      <button
        onClick={setOpen}
        aria-expanded={open}
        style={{
          font: "inherit",
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: "none",
          padding: "16px 0 18px",
          cursor: "pointer",
          color: C.ink,
          display: "flex",
          alignItems: "baseline",
          gap: 14,
        }}
      >
        <span style={{ fontFamily: DISPLAY, fontSize: 44, lineHeight: 1, minWidth: 44, color: open ? C.ink : C.mute, fontStyle: "italic" }}>
          {n || "·"}
        </span>
        <span style={{ fontFamily: DISPLAY, fontSize: 30, lineHeight: 1.15, flex: 1 }}>{title}</span>
        <span style={{ fontFamily: MONO, fontSize: 16, color: C.mute }}>{open ? "−" : "+"}</span>
      </button>
      {open && <div style={{ paddingBottom: 18 }}>{children}</div>}
    </section>
  );
}
const PartLabel = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "3em 0 0.6em" }}>
    <Kicker colour={C.ink}>{children}</Kicker>
    <span style={{ flex: 1, borderTop: `1.5px solid ${C.ink}` }} />
  </div>
);

// ============================================================
// TOY 2 — how many at once
// ============================================================
const SHAPES = ["circle", "square", "triangle"];
function cellSpec(r, c, level) {
  const shape = SHAPES[r];
  const count = level >= 2 ? c + 1 : 1;
  const filled = level >= 3 ? (r + c) % 2 === 0 : true;
  const accent = level >= 4 ? count >= 2 && !filled : false;
  return { shape, count, filled, accent };
}
function Cell({ spec, size = 64, highlight }) {
  const { shape, count, filled, accent } = spec;
  const r = 9;
  const gap = size / (count + 1);
  const colour = accent ? C.drag : C.ink;
  const fill = filled ? colour : "none";
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ background: highlight ? C.amberSoft : C.panel, border: `1px solid ${C.rule}` }}>
      {Array.from({ length: count }).map((_, i) => {
        const cx = gap * (i + 1), cy = size / 2;
        if (shape === "circle") return <circle key={i} cx={cx} cy={cy} r={r} fill={fill} stroke={colour} strokeWidth="2.5" />;
        if (shape === "square") return <rect key={i} x={cx - r} y={cy - r} width={2 * r} height={2 * r} fill={fill} stroke={colour} strokeWidth="2.5" />;
        return <polygon key={i} points={`${cx},${cy - r} ${cx + r},${cy + r} ${cx - r},${cy + r}`} fill={fill} stroke={colour} strokeWidth="2.5" />;
      })}
    </svg>
  );
}
const MISSING_BY_LEVEL = [null, { r: 2, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 0 }, { r: 0, c: 1 }];
function optionsFor(level) {
  const M = MISSING_BY_LEVEL[level];
  const ans = cellSpec(M.r, M.c, level);
  const alts = [
    { ...ans, shape: "triangle" },
    { ...ans, count: level >= 2 ? (ans.count === 2 ? 3 : 2) : 1, shape: level >= 2 ? ans.shape : "circle" },
    { ...ans, filled: !ans.filled },
    { ...ans, accent: !ans.accent, filled: level >= 4 ? ans.filled : !ans.filled },
  ];
  const seen = new Set();
  const all = [ans, ...alts].filter((o) => {
    const k = JSON.stringify(o);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const order = [2, 0, 3, 1, 4].filter((i) => i < all.length);
  return { ans, opts: order.map((i) => all[i]) };
}

// The same load, off the test: one turn of a tactical card game, one more rule to hold each notch
const ROUND_RULES = [
  null,
  { rule: "Damage. Hew is a melee attack for 4. Bolt is a ranged attack for 2. The enemy has 3 health.", best: "A",
    A: "Hew deals 4. The enemy has 3. Dead.", B: "Bolt deals 2. The enemy is left on 1." },
  { rule: "Retaliate. The enemy has Retaliate 2: anything that hits it from an adjacent space takes 2 damage back. You have 2 health.", best: "B",
    A: "Hew kills the enemy, and the retaliate lands on you for 2. You have 2. You are dead too.", B: "Bolt is ranged, so there is nothing to retaliate against. Enemy on 1, you on 2." },
  { rule: "Shield. Last turn's card gave you Shield 2 until the end of this round: every hit on you is reduced by 2.", best: "A",
    A: "Hew kills the enemy. Retaliate 2 hits your Shield 2 and does nothing. Enemy dead, you on 2.", B: "Bolt leaves the enemy on 1. You were never at risk from retaliate anyway. Nothing gained." },
  { rule: "Initiative. The enemy acts at 35, and its action this round is: move 2 away, then attack 3 at range. Hew acts at 60. Bolt acts at 20.", best: "B",
    A: "Hew acts at 60. At 35 the enemy has already stepped out of reach and shot you for 3, which your shield cuts to 1. Hew hits nothing. Enemy on 3, you on 1.", B: "Bolt acts at 20, before the enemy moves: 2 damage, enemy on 1. Then it steps away and shoots; shield cuts it to 1. Enemy on 1, you on 1." },
  { rule: "Movement. Hew's card reads Move 2, then Attack 4: you close the distance before you swing.", best: "A",
    A: "At 35 the enemy steps away and shoots you down to 1. At 60 Hew moves 2, catches it, and hits for 4. Enemy dead. Retaliate 2 is stopped by your shield. You on 1, enemy dead.", B: "Bolt still leaves the enemy on 1, and you on 1. Alive, but so is it." },
  { rule: "Errata. Retaliate damage is not reduced by Shield.", best: "B",
    A: "Hew catches the enemy and kills it. Retaliate 2 now goes straight through your shield. You were on 1. Enemy dead, you dead.", B: "Bolt from range, nothing to retaliate against. Enemy on 1, you on 1, and next turn is yours." },
];
function CombatPayoff() {
  const [lvl, setLvl] = useState(1);
  const [pick, setPick] = useState(null);
  const R = ROUND_RULES[lvl];
  const right = pick && pick === R.best;
  const cardStyle = (k) => ({
    flex: 1, padding: "10px 12px", cursor: "pointer", textAlign: "left", font: "inherit",
    border: `1.5px solid ${C.ink}`, background: pick === k ? (right ? C.reasonSoft : C.dragSoft) : C.panel,
    boxShadow: pick === k ? "none" : `3px 3px 0 ${C.ink}`, transform: pick === k ? "translate(3px,3px)" : "none",
  });
  return (
    <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1.5px solid ${C.ink}` }}>
      <div style={{ marginBottom: 6 }}>
        <Kicker colour={C.ink}>The same load, off the test</Kicker>
      </div>
      <div style={{ fontSize: 16, marginBottom: 4 }}>
        One turn of a tactical card game. You hold two cards. You want the enemy dead and yourself alive, in that order of preference. Which card do you play?
      </div>
      <Control label={`Rules in play this round: ${lvl}`}>
        <Slider min={1} max={6} step={1} value={lvl} onChange={(e) => { setLvl(+e.target.value); setPick(null); }} colour={C.reason} />
      </Control>
      <ol style={{ margin: "6px 0 10px", paddingLeft: 22, fontSize: 15, lineHeight: 1.45, listStyle: "decimal" }}>
        {ROUND_RULES.slice(1, lvl + 1).map((r, k) => (
          <li key={k} style={{ background: k === lvl - 1 ? C.amberSoft : "transparent", marginBottom: 3 }}>{r.rule}</li>
        ))}
      </ol>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setPick("A")} style={cardStyle("A")}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: C.mute }}>Card A</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 24 }}>Hew</div>
          <div style={{ fontSize: 13, color: C.mute }}>melee · {lvl >= 5 ? "move 2, then " : ""}4 damage{lvl >= 4 ? " · initiative 60" : ""}</div>
        </button>
        <button onClick={() => setPick("B")} style={cardStyle("B")}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: C.mute }}>Card B</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 24 }}>Bolt</div>
          <div style={{ fontSize: 13, color: C.mute }}>ranged · 2 damage{lvl >= 4 ? " · initiative 20" : ""}</div>
        </button>
      </div>
      {pick && (
        <Readout colour={right ? C.reason : C.drag}>
          <strong>{right ? "Right." : "Not this round."}</strong> Hew: {R.A} Bolt: {R.B}
          {lvl >= 4 && lvl < 6 && ` ${lvl} rules in play and the right card has flipped ${lvl - 1} times. Keep going.`}
          {lvl === 6 && " Six rules, and the right card flipped every time one was added. Nobody at a real table reads the rules off a list; they hold them, and the number they can hold is what decides whether the turn is played well. Past four, everybody starts saying “hang on” and counting on their fingers, which is the table’s version of writing it down."}
        </Readout>
      )}
      <div style={{ fontSize: 14, color: C.mute, marginTop: 8 }}>
        The cards and enemy are invented; the mechanics are the ordinary ones of the tactical card games this page&rsquo;s author designs. The rule that changes at each notch is highlighted.
      </div>
    </div>
  );
}

const BAND = ["", "around 100", "around 120", "around 140", "the top of the ordinary scale"];
function GridToy() {
  const [level, setLevel] = useState(1);
  const [picked, setPicked] = useState(null);
  const { ans, opts } = optionsFor(level);
  const MISSING = MISSING_BY_LEVEL[level];
  const correct = picked !== null && JSON.stringify(opts[picked]) === JSON.stringify(ans);
  return (
    <Toy colour={C.reason} label="Toy 2 of 11: How Many at Once">
      <Control label={`How many rules change at once: ${level}`}>
        <Slider min={1} max={4} step={1} value={level} onChange={(e) => { setLevel(+e.target.value); setPicked(null); }} colour={C.reason} />
      </Control>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 64px)", gap: 6, justifyContent: "center", margin: "12px 0" }}>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) =>
            r === MISSING.r && c === MISSING.c ? (
              <div key={`${r}${c}`} style={{ width: 64, height: 64, border: `2px dashed ${C.drag}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.drag, fontSize: 22 }}>
                ?
              </div>
            ) : (
              <Cell key={`${r}${c}`} spec={cellSpec(r, c, level)} />
            )
          )
        )}
      </div>
      <div style={{ fontSize: 15, color: C.mute, marginBottom: 6 }}>Which goes in the dashed cell?</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {opts.map((o, i) => (
          <button key={i} onClick={() => setPicked(i)} style={{ background: "none", border: picked === i ? `3px solid ${correct ? C.reason : C.drag}` : "3px solid transparent", padding: 0, cursor: "pointer" }}>
            <Cell spec={o} size={56} />
          </button>
        ))}
      </div>
      {picked !== null && (
        <Readout colour={correct ? C.reason : C.drag}>
          {correct ? (
            <>
              <strong>Yes. Things you had to hold at once: {level}.</strong>{" "}
              {level === 1 && "One rule: the shape follows the row. Items of this shape separate people from about 100 downwards."}
              {level === 2 && "Two rules: shape by row, count by column. Holding both is where items start to separate people around 120."}
              {level === 3 && "Three rules, and the third (filled or hollow) depends on where the cell sits in both the row and the column. This is the load where most adults start dropping a rule; items like it separate people around 140."}
              {level === 4 && "Four rules, and the fourth (colour) depends on two of the others: red only when there are several shapes and they are hollow. Holding four interacting rules at once is the soft ceiling for adults; the real tests run out of headroom about here."}
            </>
          ) : (
            <>
              Not that one. Read across the missing cell&rsquo;s row for what stays the same, then down its column for what changes.
              {level >= 3 && " Then check the fill pattern against its neighbours."}
              {level >= 4 && " Then ask when the shapes turn red."}
            </>
          )}
        </Readout>
      )}
      <div style={{ fontSize: 14, color: C.mute, marginTop: 10 }}>
        These grids are mine and are not normed. The band each level &ldquo;starts separating people&rdquo; at follows the published analysis of how matrix items get harder (the number of rules and sub-goals to track), not a measurement of these particular puzzles.
      </div>
      <CombatPayoff />
    </Toy>
  );
}

// ============================================================
// TOY 3 — the contract
// ============================================================
const RULEBOOK = [
  "An attack deals its printed damage to its target.",
  "Shield X: when a figure with Shield takes damage from an attack, reduce that damage by X, to a minimum of 0.",
  "Pierce X: this attack ignores up to X points of the target's Shield.",
  "Poison: a poisoned figure takes 1 extra damage from every attack that damages it. Poison is removed when the figure is healed.",
  "Retaliate X: after a figure with Retaliate is attacked by an adjacent attacker, it performs a Retaliate action, dealing X damage to that attacker.",
  "A figure reduced to 0 health is defeated and removed from the map immediately.",
  "Effects on a figure end when the figure is removed from the map.",
  "Actions are resolved one at a time, in full, in the order they are triggered.",
];
const RULE_QUESTIONS = [
  {
    kicker: "Locate", band: "reading at about 100", sub: "Plain",
    q: "A monster with Shield 2 is hit by an Attack 5. How much damage does it take?",
    options: ["5", "3", "2", "0"], answer: "3", hi: [1, 2],
    why: "Rule 1 says the attack deals its damage; rule 2 says shield takes some off: 5 minus 2. Two adjacent rules, one number. This is where the ladder starts, and most readers manage it.",
  },
  {
    kicker: "Locate", band: "reading at about 110", sub: "Buried",
    q: "A monster is poisoned. What removes the poison?",
    options: ["It wears off at the end of the round", "It is removed when the monster is defeated", "It is removed when the monster is healed", "Nothing; poison is permanent"], answer: "It is removed when the monster is healed", hi: [4],
    why: "Still one rule, but the answer is the second sentence of a rule whose first sentence is about something else, and a plausible distractor (rule 7, effects end on removal) is sitting nearby. Locating a stated fact gets harder when the text puts it somewhere you were not looking.",
  },
  {
    kicker: "Combine", band: "reading at about 120", sub: "Two rules",
    q: "A poisoned monster with Shield 1 is hit by Attack 3. How much damage does it take?",
    options: ["1", "2", "3", "4"], answer: "3", hi: [1, 2, 4],
    why: "Shield takes 3 down to 2. The attack damaged the figure, so poison adds 1 back. Two rules from different parts of the page, applied in sequence, and neither is hard on its own.",
  },
  {
    kicker: "Combine", band: "reading at about 130", sub: "Three rules",
    q: "A poisoned monster with Shield 3 is hit by Attack 3, Pierce 2. How much damage does it take?",
    options: ["0", "1", "2", "3"], answer: "3", hi: [1, 2, 3, 4],
    why: "Pierce 2 knocks the shield down to 1; the attack of 3 becomes 2; poison adds 1 because the attack damaged the figure. Three rules, and an order of application the book never states. Drop any one and you get a confident wrong number.",
  },
  {
    kicker: "Model", band: "reading at about 140", sub: "What a word is doing",
    q: "A poisoned monster with Shield 3 is hit by Attack 2. How much damage does it take?",
    options: ["0", "1", "2", "3"], answer: "0", hi: [1, 2, 4],
    why: "Shield 3 reduces 2 to 0. Does poison add 1? Rule 4 says poison adds damage to an attack that damages the figure, and this one did not. The answer turns on noticing what the word “damages” is doing in the sentence: it is a condition, not a description. Nobody wrote a rule for this case. The rule that exists was written so the case would fall out of it.",
  },
  {
    kicker: "Model", band: "reading at 150 and above", sub: "What the book is built to do",
    q: "Your attack kills an adjacent monster that has Retaliate 2. Your opponent says the retaliate still hits you. The rules do not say either way. Who is right?",
    options: ["Retaliate hits you: the rule says “after it is attacked”, and it was", "No retaliate: a defeated figure has been removed and has nothing to act with", "Roll a die", "Both readings are equally supported"], answer: "No retaliate: a defeated figure has been removed and has nothing to act with", hi: [5, 6, 7, 8],
    why: "There is no sentence to find. Retaliate is written as an action the monster performs (rule 5). Defeat is immediate removal (rule 6), removal ends its effects (rule 7), and actions resolve one at a time in full (rule 8): the attack finishes, the monster is gone, and there is no figure left to perform anything. The book was written so that this case falls out of its structure rather than needing its own line. A reader at this level is not searching the text; they are running it.",
  },
];
function RulesToy() {
  const [qi, setQi] = useState(0);
  const [pick, setPick] = useState(null);
  const Q = RULE_QUESTIONS[qi];
  const right = pick !== null && pick === Q.answer;
  return (
    <Toy colour={C.reason} label="Toy 3 of 11: The Rulebook">
      <div style={{ fontSize: 15, color: C.mute, marginBottom: 8 }}>Eight rules from an invented card game. Six questions, two from each rung of the reading ladder, the second harder than the first. Answer, then see which rules did the work.</div>
      <ol style={{ margin: "0 0 12px", paddingLeft: 24, fontSize: 14, lineHeight: 1.45, listStyle: "decimal" }}>
        {RULEBOOK.map((t, i) => {
          const hot = pick !== null && Q.hi.includes(i + 1);
          return (
            <li key={i} style={{ background: hot ? C.amberSoft : "transparent", padding: "2px 4px", marginBottom: 2 }}>
              {t}
            </li>
          );
        })}
      </ol>
      <div style={{ marginBottom: 6 }}>
        {RULE_QUESTIONS.map((x, k) => (
          <Button key={k} active={qi === k} onClick={() => { setQi(k); setPick(null); }} colour={C.reason}>
            {x.kicker}: {x.sub}
          </Button>
        ))}
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, margin: "8px 0" }}>{Q.q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {Q.options.map((o) => (
          <button key={o} onClick={() => setPick(o)} style={{ font: "inherit", fontSize: 15, textAlign: "left", padding: "8px 10px", border: `1.5px solid ${C.ink}`, background: pick === o ? (o === Q.answer ? C.reasonSoft : C.dragSoft) : C.panel, cursor: "pointer" }}>
            {o}
          </button>
        ))}
      </div>
      {pick !== null && (
        <Readout colour={right ? C.reason : C.drag}>
          <strong>{right ? "Yes." : `No: ${Q.answer}.`} {Q.band}.</strong> {Q.why}
        </Readout>
      )}
      <div style={{ fontSize: 14, color: C.mute, marginTop: 10 }}>
        The rungs come from the adult literacy surveys, which grade reading by whether a person can locate a stated fact, combine several conditional pieces from one text, or infer what the text does as a whole; the IQ figures attached are approximate. The third rung is the one that settles arguments at the table, and it is the one most adults do not reach.
      </div>
    </Toy>
  );
}

// ============================================================
// TOY 5 — the scales
// ============================================================
const SCALES = [
  { left: "1 square", right: "2 circles", note: "square = 2 circles" },
  { left: "1 triangle", right: "3 squares", note: "triangle = 3 squares = 6 circles" },
  { left: "1 star", right: "1 triangle + 1 square", note: "star = 6 + 2 = 8 circles" },
];
function ScalePic({ left, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "10px 0", fontSize: 17 }}>
      <span style={{ background: C.reasonSoft, padding: "6px 10px" }}>{left}</span>
      <span style={{ color: C.mute }}>balances</span>
      <span style={{ background: C.reasonSoft, padding: "6px 10px" }}>{right}</span>
    </div>
  );
}
function ScalesToy() {
  const [mode, setMode] = useState("paper");
  const [step, setStep] = useState(0); // head mode progression
  const [answer, setAnswer] = useState(null);
  const [results, setResults] = useState({ paper: null, head: null });
  const inHead = mode === "head";
  const showQuestion = !inHead || step >= 4;
  const choose = (v) => {
    setAnswer(v);
    setResults({ ...results, [mode]: v === 8 });
  };
  const reset = (m) => {
    setMode(m);
    setStep(0);
    setAnswer(null);
  };
  return (
    <Toy colour={C.drag} label="Toy 5 of 11: The Scales">
      <div style={{ marginBottom: 6 }}>
        <Button active={mode === "paper"} onClick={() => reset("paper")} colour={C.reason}>
          You may write the rates down
        </Button>
        <Button active={mode === "head"} onClick={() => reset("head")} colour={C.drag}>
          Hold them in your head
        </Button>
      </div>
      {!inHead && (
        <div>
          {SCALES.map((s) => (
            <ScalePic key={s.left} {...s} />
          ))}
          <div style={{ fontSize: 15, color: C.mute, fontFamily: "monospace", background: C.page, padding: "8px 10px" }}>
            {SCALES.map((s) => (
              <div key={s.note}>{s.note}</div>
            ))}
          </div>
        </div>
      )}
      {inHead && step < 3 && (
        <div>
          <ScalePic {...SCALES[step]} />
          <Button onClick={() => setStep(step + 1)} active colour={C.drag}>
            {step < 2 ? "Next scale (this one disappears)" : "Ready for the question"}
          </Button>
        </div>
      )}
      {inHead && step === 3 && (
        <div>
          <Readout colour={C.amber}>Someone leans over and asks whether you have seen their charger. You say no. They keep talking.</Readout>
          <Button onClick={() => setStep(4)} active colour={C.drag}>
            Back to the puzzle
          </Button>
        </div>
      )}
      {showQuestion && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>How many circles balance one star?</div>
          {[6, 8, 9, 12].map((v) => (
            <Button key={v} onClick={() => choose(v)} active={answer === v} colour={answer === v ? (v === 8 ? C.reason : C.drag) : C.ink}>
              {v}
            </Button>
          ))}
        </div>
      )}
      {answer !== null && (
        <Readout colour={answer === 8 ? C.reason : C.drag}>
          {answer === 8 ? <strong>Eight. </strong> : <strong>Eight, not {answer}. </strong>}
          {inHead
            ? "In your head, with an interruption in the middle. Nothing about the structure changed between the two modes: three exchange rates, chained. What changed was whether the intermediate results had somewhere to live. Seeing how the scales relate is the reasoning index. Keeping \"six\" alive while a person talks at you is the working-memory index. In the profile this page describes they are seventy points apart."
            : "With the rates on paper, the puzzle is easy: read the last note and add. Now try it the other way, and notice that the way you were about to solve it is the part that survives."}
        </Readout>
      )}
      <div style={{ fontSize: 14, color: C.mute, marginTop: 10 }}>
        Written down: {results.paper === null ? "not yet" : results.paper ? "right" : "wrong"} · In your head: {results.head === null ? "not yet" : results.head ? "right" : "wrong"}. Same puzzle for everyone; this is a demonstration, not a test of you.
      </div>
    </Toy>
  );
}

// ============================================================
// TOY 6 — chunks versus digits
// ============================================================
const DOMAINS = {
  web: {
    name: "A web request",
    string: "GET /users HTTP/1.1",
    levels: [
      { at: 0, label: "None. Nineteen marks on a screen.", chunks: [["G", "a letter"], ["E", "a letter"], ["T", "a letter"], [" ", "a gap"], ["/", "a slash"], ["u", "a letter"], ["s", "a letter"], ["e", "a letter"], ["r", "a letter"], ["s", "a letter"], [" ", "a gap"], ["H", "a letter"], ["T", "a letter"], ["T", "a letter"], ["P", "a letter"], ["/", "a slash"], ["1", "a digit"], [".", "a dot"], ["1", "a digit"]] },
      { at: 13, label: "Enough to read: the letters clump into words.", chunks: [["GET", "a word, in capitals"], [" ", "a gap"], ["/", "a slash"], ["users", "a word"], [" ", "a gap"], ["HTTP", "a word, in capitals; probably an abbreviation"], ["/", "a slash"], ["1", "a number"], [".", "a dot"], ["1", "a number"]] },
      { at: 26, label: "Enough to recognise a version number.", chunks: [["GET", "a word, in capitals"], [" ", "a gap"], ["/", "a slash"], ["users", "a word"], [" ", "a gap"], ["HTTP", "an abbreviation"], ["/", "a slash"], ["1.1", "a version number: one point one"]] },
      { at: 39, label: "Enough to know a slash before a word is a path.", chunks: [["GET", "a word, in capitals"], [" ", "a gap"], ["/users", "a path: a place on a server, like a folder"], [" ", "a gap"], ["HTTP", "an abbreviation"], ["/", "a slash"], ["1.1", "a version number"]] },
      { at: 52, label: "Enough to know HTTP is the protocol the web speaks.", chunks: [["GET", "a word, in capitals"], [" ", "a gap"], ["/users", "a path on a server"], [" ", "a gap"], ["HTTP/1.1", "the protocol and its version: the language this line is written in"]] },
      { at: 65, label: "Enough to know the three-part shape of a request line.", chunks: [["GET", "a verb: fetch something without changing it"], ["/users", "what to fetch: the users resource"], ["HTTP/1.1", "which dialect the two machines are speaking"]] },
      { at: 78, label: "Enough to read verb and path as one instruction.", chunks: [["GET /users", "fetch the list of users"], ["HTTP/1.1", "speaking HTTP, version 1.1"]] },
      { at: 91, label: "Fluent. The whole line is one familiar thing.", chunks: [["GET /users HTTP/1.1", "a request line: the first line of every web request, asking a server for its users list. Seen ten thousand times."]] },
    ],
  },
  chess: {
    name: "A chess opening",
    string: "e4 e5 Nf3 Nc6 Bb5",
    levels: [
      { at: 0, label: "None. Seventeen marks on a screen.", chunks: [["e", "a letter"], ["4", "a digit"], [" ", "a gap"], ["e", "a letter"], ["5", "a digit"], [" ", "a gap"], ["N", "a capital"], ["f", "a letter"], ["3", "a digit"], [" ", "a gap"], ["N", "a capital"], ["c", "a letter"], ["6", "a digit"], [" ", "a gap"], ["B", "a capital"], ["b", "a letter"], ["5", "a digit"]] },
      { at: 13, label: "Enough to see letter-digit pairs.", chunks: [["e4", "a letter and a digit"], [" ", "a gap"], ["e5", "a letter and a digit"], [" ", "a gap"], ["Nf3", "a capital, a letter, a digit"], [" ", "a gap"], ["Nc6", "a capital, a letter, a digit"], [" ", "a gap"], ["Bb5", "a capital, a letter, a digit"]] },
      { at: 26, label: "Enough to know these name squares on a board.", chunks: [["e4", "a square: file e, rank 4"], ["e5", "a square: file e, rank 5"], ["Nf3", "N for knight, going to f3"], ["Nc6", "a knight going to c6"], ["Bb5", "B for bishop, going to b5"]] },
      { at: 39, label: "Enough to know moves alternate: white, black, white.", chunks: [["e4 e5", "white pushes a pawn to the centre; black answers in kind"], ["Nf3 Nc6", "white brings a knight out; black brings one out"], ["Bb5", "white brings a bishop out"]] },
      { at: 52, label: "Enough to see what each pair of moves is for.", chunks: [["e4 e5", "both sides claim the centre"], ["Nf3 Nc6", "white's knight attacks the e5 pawn; black's knight defends it"], ["Bb5", "the bishop attacks the defender"]] },
      { at: 65, label: "Enough to recognise the open game.", chunks: [["e4 e5 Nf3 Nc6", "the open game: the four most common first moves in chess"], ["Bb5", "the bishop pins the knight that guards e5"]] },
      { at: 78, label: "Enough to know the plan behind it.", chunks: [["e4 e5 Nf3 Nc6 Bb5", "white piles pressure on e5 by attacking its defender; black will answer a6 and the fight is about whether the bishop stays"]] },
      { at: 91, label: "Fluent. One name.", chunks: [["e4 e5 Nf3 Nc6 Bb5", "the Ruy Lopez, the oldest opening in the book, played a million times. A club player sees the name, not the moves."]] },
    ],
  },
};
const DIGITS = "4 7 2 9 1 8 3 6 5";
const PHRASE = "THE CAT SAT";
// longest common subsequence: tolerant of one dropped or transposed character
function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[m][n];
}
function ChunksToy() {
  const [phase, setPhase] = useState("idle"); // idle | showDigits | typeDigits | showPhrase | typePhrase | done
  const [d, setD] = useState("");
  const [ph, setPh] = useState("");
  const [know, setKnow] = useState(0);
  const [domain, setDomain] = useState("web");
  const [left, setLeft] = useState(0);
  const DUR = 3000;
  const show = (next, after) => {
    setPhase(next);
    setLeft(100);
    const t0 = Date.now();
    const tick = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - t0) / DUR) * 100);
      setLeft(pct);
      if (pct <= 0) {
        clearInterval(tick);
        setPhase(after);
      }
    }, 50);
  };
  const score = (typed, target) => {
    const a = typed.replace(/\s+/g, "").toUpperCase();
    const b = target.replace(/\s+/g, "").toUpperCase();
    return lcs(a, b);
  };
  const D = DOMAINS[domain];
  const chunking = [...D.levels].reverse().find((c) => know >= c.at) || D.levels[0];
  const items = chunking.chunks.length;
  const total = D.levels[0].chunks.length;
  return (
    <Toy colour={C.drag} label="Toy 6 of 11: Chunks Versus Digits">
      {phase === "idle" && (
        <div>
          <Prose style={{ fontSize: 17 }}>Two memory tasks, three seconds each, nine characters each. A bar counts the three seconds down. Tap start, look, then type what you saw. This is a demonstration of a mechanism, not a test of your memory.</Prose>
          <Button onClick={() => show("showDigits", "typeDigits")} active colour={C.drag}>
            Start the first one
          </Button>
        </div>
      )}
      {(phase === "showDigits" || phase === "showPhrase") && (
        <div>
          <div style={{ fontFamily: MONO, fontSize: 30, textAlign: "center", padding: "24px 0 12px", letterSpacing: "0.1em" }}>
            {phase === "showDigits" ? DIGITS : PHRASE}
          </div>
          <div style={{ height: 8, background: C.page, border: `1px solid ${C.ink}` }}>
            <div style={{ height: "100%", width: `${left}%`, background: C.drag }} />
          </div>
        </div>
      )}
      {phase === "typeDigits" && (
        <div>
          <Control label="Type the nine digits">
            <input value={d} onChange={(e) => setD(e.target.value)} inputMode="numeric" style={{ font: "inherit", fontFamily: MONO, fontSize: 20, width: "100%", padding: 8, border: `1.5px solid ${C.ink}` }} />
          </Control>
          <Button onClick={() => show("showPhrase", "typePhrase")} active colour={C.drag}>
            Done, show me the second
          </Button>
        </div>
      )}
      {phase === "typePhrase" && (
        <div>
          <Control label="Type the nine letters">
            <input value={ph} onChange={(e) => setPh(e.target.value)} style={{ font: "inherit", fontFamily: MONO, fontSize: 20, width: "100%", padding: 8, border: `1.5px solid ${C.ink}` }} />
          </Control>
          <Button onClick={() => setPhase("done")} active colour={C.drag}>
            Done
          </Button>
        </div>
      )}
      {phase === "done" && (
        <div>
          <Readout colour={C.drag}>
            Digits: <strong>{score(d, DIGITS)} of 9</strong> in order. Letters: <strong>{score(ph, PHRASE)} of 9</strong>. Same length, same three seconds. The letters were three chunks; the digits were nine items. A buffer holds a handful of things, and what counts as a thing depends on what you already know. The scoring forgives a dropped or swapped character; it is looking for the shape of the result, and so should you.
          </Readout>
          <div style={{ marginTop: 14 }}>
            <Button active={domain === "web"} onClick={() => setDomain("web")} colour={C.reason}>
              {DOMAINS.web.name}
            </Button>
            <Button active={domain === "chess"} onClick={() => setDomain("chess")} colour={C.reason}>
              {DOMAINS.chess.name}
            </Button>
          </div>
          <Control label={`How well you know this domain: ${know}%`}>
            <Slider min={0} max={100} value={know} onChange={(e) => setKnow(+e.target.value)} colour={C.reason} />
          </Control>
          <div style={{ fontSize: 15, color: C.mute, margin: "4px 0 8px" }}>What this much knowledge sees: {chunking.label}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0", alignItems: "flex-start" }}>
            {chunking.chunks.map(([text, meaning], i) => (
              <div key={i} style={{ maxWidth: items <= 3 ? "100%" : items <= 8 ? 150 : 64 }}>
                <div style={{ fontFamily: MONO, fontSize: 15, border: `1px solid ${C.reason}`, padding: "2px 6px", background: C.reasonSoft, whiteSpace: "pre", display: "inline-block" }}>
                  {text === " " ? "␣" : text}
                </div>
                <div style={{ fontSize: 12, color: C.mute, lineHeight: 1.3, marginTop: 2 }}>{meaning}</div>
              </div>
            ))}
          </div>
          <Readout colour={C.reason}>
            The same {total} characters are <strong>{items} {items === 1 ? "thing" : "things"}</strong> to somebody who knows this much.
            {items >= total && ` ${total} items overruns any buffer.`}
            {items > 1 && items < total && " Getting closer to fitting."}
            {items === 1 && " One chunk. It fits with room to spare, and the buffer never had to grow."}{" "}
            This is how a working memory at 118 runs a reasoning engine near 190: the engine has turned most of the world into large chunks, so the buffer is rarely asked to hold raw items. It works right up until something arrives that cannot be chunked.
          </Readout>
          <Readout colour={C.drag}>
            <strong>What will not chunk.</strong> A phone number read out once. A six-step spoken instruction. The running total in a mental sum. A name at a party. On these the reasoning engine has nothing to grip, the 118 is exposed, and the person who just explained the rail network cannot tell you what you said thirty seconds ago.
          </Readout>
          <div style={{ fontSize: 14, color: C.mute, marginTop: 8 }}>
            The shape of this is Chase and Simon&rsquo;s chess result from 1973: masters recalled real positions far better than novices and random positions barely better at all. The percentages on the slider are illustrative.
          </div>
          <Button onClick={() => { setPhase("idle"); setD(""); setPh(""); }} colour={C.mute}>
            Run it again
          </Button>
        </div>
      )}
    </Toy>
  );
}

// ============================================================
// TOY 11 — the invisible steps
// ============================================================
function FoldPic() {
  return (
    <svg viewBox="0 0 340 100" width="100%" style={{ display: "block", margin: "6px 0 10px" }}>
      <rect x="10" y="10" width="80" height="80" fill="none" stroke={C.ink} strokeWidth="1.5" />
      <text x="50" y="98" fontSize="10" fill={C.mute} textAnchor="middle">a square sheet</text>
      <path d="M130 50 L150 50" stroke={C.mute} strokeWidth="1.5" />
      <rect x="170" y="30" width="40" height="40" fill="none" stroke={C.ink} strokeWidth="1.5" />
      <line x1="170" y1="30" x2="210" y2="30" stroke={C.ink} strokeWidth="3" />
      <line x1="170" y1="30" x2="170" y2="70" stroke={C.ink} strokeWidth="3" />
      <path d="M170 30 L182 30 L170 42 Z" fill={C.drag} />
      <text x="190" y="88" fontSize="10" fill={C.mute} textAnchor="middle">folded twice; the thick</text>
      <text x="190" y="98" fontSize="10" fill={C.mute} textAnchor="middle">edges are the folds</text>
      <path d="M240 50 L260 50" stroke={C.mute} strokeWidth="1.5" />
      <text x="300" y="54" fontSize="22" fill={C.drag} textAnchor="middle">?</text>
      <text x="300" y="98" fontSize="10" fill={C.mute} textAnchor="middle">unfolded</text>
    </svg>
  );
}
// Head runs from y=14 to y=106. Each face has its own proportions; the wrong ones move exactly one feature.
function Face({ f, size = 88 }) {
  const { rx = 34, eyeY = 60, eyeGap = 12, mouthY = 92, curve = 8, noseLen = 16 } = f;
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} style={{ display: "block" }}>
      <ellipse cx="50" cy="60" rx={rx} ry="46" fill={C.panel} stroke={C.ink} strokeWidth="2" />
      <circle cx={50 - eyeGap} cy={eyeY} r="3.2" fill={C.ink} />
      <circle cx={50 + eyeGap} cy={eyeY} r="3.2" fill={C.ink} />
      <path d={`M50 68 l3 ${noseLen} h-6`} fill="none" stroke={C.ink} strokeWidth="1.6" />
      <path d={`M40 ${mouthY} q10 ${curve} 20 0`} fill="none" stroke={C.ink} strokeWidth="2" />
    </svg>
  );
}
const FACES = [
  { f: { rx: 34, eyeY: 60, eyeGap: 12, mouthY: 92, curve: 8 }, off: false,
    cue: "Nothing was moved. This one is drawn to the usual proportions: eyes halfway down, about an eye's width apart, mouth a third of the way from nose to chin.", words: [] },
  { f: { rx: 36, eyeY: 42, eyeGap: 12, mouthY: 92, curve: 6 }, off: true,
    cue: "The eyes. They sit about a third of the way down the head; on a real one they sit halfway. Nothing else moved.", words: ["eye", "eyes", "high", "forehead", "up", "top", "half"] },
  { f: { rx: 34, eyeY: 60, eyeGap: 24, mouthY: 92, curve: 8, noseLen: 14 }, off: true,
    cue: "The spacing. The eyes are two eye-widths apart and nearly at the edges of the face; on a real one there is about one eye's width between them. Nothing else moved.", words: ["apart", "wide", "far", "spacing", "space", "edge", "edges", "gap", "spread", "side", "sides"] },
  { f: { rx: 40, eyeY: 61, eyeGap: 13, mouthY: 91, curve: 3, noseLen: 15 }, off: false,
    cue: "Nothing was moved. A rounder head and a flatter mouth, but the features are where they belong.", words: [] },
  { f: { rx: 32, eyeY: 59, eyeGap: 11, mouthY: 102, curve: 7, noseLen: 14 }, off: true,
    cue: "The mouth. It is sitting on the chin, with a long gap under the nose; on a real face it is about a third of the way from nose to chin. Nothing else moved.", words: ["mouth", "chin", "low", "down", "nose", "gap", "bottom", "smile"] },
];
const CLAIMS = [
  { text: "The oldest buildings in the city are all beautifully made, so builders in those days were better than builders today.", holds: false,
    note: "Survivorship. The city has been pulling down its ugly and badly made buildings for centuries; the ones still standing are the ones worth keeping. The sample was selected by the very quality the argument claims to have discovered.",
    words: ["surviv", "demolish", "pulled down", "knocked down", "left", "remain", "select", "sample", "still standing", "kept", "worst", "bad ones", "gone"] },
  { text: "Every swan anyone in this village has ever seen is white, so the next swan we see will probably be white.", holds: true,
    note: "It holds. This is ordinary induction, and the word doing the work is “probably”. It would not hold with “certainly”: one black swan breaks certainty and barely dents probability.",
    words: ["probab", "induct", "certain", "likely", "black swan", "evidence", "past", "pattern"] },
  { text: "Pub closures have sped up since the smoking ban came in, so the ban is what is closing the pubs.", holds: false,
    note: "One cause chosen from many. Supermarket alcohol, rents, a recession and the price of a pint all changed over the same years. A trend that followed the ban is not a trend the ban caused, and the argument never tries to rule the others out.",
    words: ["cause", "correlat", "other", "reason", "reasons", "factor", "factors", "supermarket", "rent", "recession", "price", "coincid", "same time", "also", "post hoc", "after"] },
  { text: "A test for a disease that affects one person in ten thousand is 99% accurate. You test positive. It is still more likely than not that you do not have the disease.", holds: true,
    note: "It holds, and most people’s first instinct says otherwise. In a million people, a hundred have the disease and the test catches ninety-nine of them. But of the 999,900 who do not, one per cent, about ten thousand, test positive anyway. A positive result is a hundred times more likely to be a false alarm than a true one.",
    words: ["rare", "false positive", "false positives", "base rate", "prevalence", "ten thousand", "10,000", "1%", "one percent", "most positives", "healthy people", "many more"] },
  { text: "Nobody has ever proved that the house is not haunted, so it is reasonable to believe it is.", holds: false,
    note: "The absence of a disproof is treated as support. By the same move, any claim nobody has bothered to disprove becomes reasonable, which is to say the argument proves everything and therefore nothing.",
    words: ["burden", "prove", "proof", "disprove", "absence", "evidence", "anything", "everything", "any claim", "negative"] },
];
const PROCESS_WORDS = ["four", "layer", "layers", "centre", "center", "middle", "corner", "fold", "folded", "thick", "quarter", "meet", "same spot", "through"];
const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const mentions = (t, list) => list.filter((w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(t)).length;
const secs = (ms) => (ms / 1000).toFixed(1);

const STAGES11 = [
  { id: "fold", label: "1. Abstract", name: "A folded sheet" },
  { id: "faces", label: "2. Concrete", name: "Five faces" },
  { id: "ideas", label: "3. Ideas", name: "Five claims" },
];

function InvisibleStepsToy() {
  const [stage, setStage] = useState("fold");
  const [phase, setPhase] = useState("intro"); // intro | judge | answer | explain | item | summary
  const [t0, setT0] = useState(0);
  const [idx, setIdx] = useState(0);
  const [records, setRecords] = useState([]); // {said, ms, text, when}
  const [answer, setAnswer] = useState("");
  const [text, setText] = useState("");
  const [when, setWhen] = useState(null);
  const items = stage === "faces" ? FACES : stage === "ideas" ? CLAIMS : [null];
  const cur = records[idx];
  const reset = (d) => { setStage(d); setPhase("intro"); setIdx(0); setRecords([]); setAnswer(""); setText(""); setWhen(null); };
  const begin = () => { setT0(Date.now()); setPhase("judge"); };
  const judge = (said) => {
    const ms = Date.now() - t0;
    setRecords([...records, { said, ms, text: "", when: null }]);
    setText(""); setWhen(null);
    setPhase(stage === "fold" ? "answer" : "explain");
  };
  const commit = () => {
    const r = [...records];
    r[idx] = { ...r[idx], text, when };
    setRecords(r);
    setPhase("item");
  };
  const next = () => {
    if (idx + 1 < items.length) { setIdx(idx + 1); setT0(Date.now()); setPhase("judge"); }
    else setPhase("summary");
  };
  const truthOf = (n) => (stage === "faces" ? FACES[n].off : stage === "ideas" ? CLAIMS[n].holds : true);
  const hits = records.filter((r, n) => r.said === truthOf(n)).length;
  const mean = records.length ? records.reduce((a, r) => a + r.ms, 0) / records.length : 0;
  const afters = records.filter((r) => r.when === "After").length;
  const ta = { font: "inherit", fontSize: 16, width: "100%", minHeight: 80, padding: 8, border: `1.5px solid ${C.ink}`, resize: "vertical" };
  const intro = {
    fold: "A short spatial puzzle. It appears when you press begin, and the clock runs until you say you have an answer. Then, with no clock, you write the answer and how you got to it, in your own words with nothing to choose from.",
    faces: "Five drawn faces, each different, one at a time, hidden until you press begin. Tap whether each looks fine or looks wrong, as quickly as you can: that tap is timed. Then, with no clock, write what you saw, say whether the reason came before or after you decided, and read what was actually done to that face. Pressing next shows the next face and starts its clock.",
    ideas: "Five short arguments, one at a time, hidden until you press begin. Tap whether each holds or does not, as quickly as you can: that tap is timed. Then, with no clock, write why, say whether the reason came before or after you decided, and read the fault, or why it holds. Pressing next shows the next argument and starts its clock.",
  }[stage];
  const explainLabel = {
    fold: "How did you get there? Your own words, step by step if there were steps.",
    faces: "What did you see? If it looked wrong, what was wrong with it? Your own words.",
    ideas: "Why? If it fails, name the fault if you can. Your own words.",
  }[stage];
  const stageName = STAGES11.find((x) => x.id === stage).name;
  return (
    <Toy colour={C.amber} label="Toy 11 of 11: The Invisible Steps">
      <div style={{ marginBottom: 8 }}>
        {STAGES11.map((x) => (
          <Button key={x.id} active={stage === x.id} onClick={() => reset(x.id)} colour={C.amber}>{x.label}</Button>
        ))}
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 24, marginBottom: 6 }}>{stageName}{stage !== "fold" && phase !== "intro" && phase !== "summary" ? ` · ${idx + 1} of ${items.length}` : ""}</div>

      {phase === "intro" && (
        <div>
          <Prose style={{ fontSize: 17 }}>{intro}</Prose>
          <Button onClick={begin} active colour={C.amber}>Begin</Button>
        </div>
      )}

      {phase === "judge" && stage === "fold" && (
        <div>
          <div style={{ fontSize: 18, marginBottom: 8 }}>
            Fold a square of paper in half, then in half again. Snip off the corner where the two folds meet. Unfold it. How many holes are there, and where?
          </div>
          <FoldPic />
          <Button onClick={() => judge(true)} active colour={C.amber}>I have an answer</Button>
        </div>
      )}
      {phase === "judge" && stage === "faces" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", margin: "4px 0 8px" }}><Face f={FACES[idx].f} size={110} /></div>
          <div>
            <Button onClick={() => judge(false)} active colour={C.reason}>Looks fine</Button>
            <Button onClick={() => judge(true)} active colour={C.drag}>Looks wrong</Button>
          </div>
        </div>
      )}
      {phase === "judge" && stage === "ideas" && (
        <div>
          <div style={{ fontSize: 19, lineHeight: 1.4, padding: "12px 14px", border: `1.5px solid ${C.ink}`, marginBottom: 10 }}>{CLAIMS[idx].text}</div>
          <Button onClick={() => judge(true)} active colour={C.reason}>Holds</Button>
          <Button onClick={() => judge(false)} active colour={C.drag}>Does not hold</Button>
        </div>
      )}

      {phase === "answer" && (
        <div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.mute, marginBottom: 6 }}>the clock has stopped</div>
          <Control label="Your answer, in a few words">
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} style={{ font: "inherit", fontSize: 16, width: "100%", padding: 8, border: `1.5px solid ${C.ink}` }} />
          </Control>
          <Button onClick={() => setPhase("explain")} active colour={C.amber}>Next</Button>
        </div>
      )}

      {phase === "explain" && (
        <div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.mute, marginBottom: 6 }}>the clock has stopped · you said: {stage === "faces" ? (cur.said ? "looks wrong" : "looks fine") : stage === "ideas" ? (cur.said ? "holds" : "does not hold") : answer || "(no answer given)"}</div>
          <Control label={explainLabel}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} style={ta} />
          </Control>
          <div style={{ fontSize: 16, fontWeight: 600, margin: "10px 0 6px" }}>Did that reason come to you before you decided, or after?</div>
          {["Before", "After", "I cannot tell"].map((w) => (
            <Button key={w} active={when === w} onClick={() => setWhen(w)} colour={C.amber}>{w}</Button>
          ))}
          {when && <div style={{ marginTop: 6 }}><Button onClick={commit} active colour={C.ink}>Readout</Button></div>}
        </div>
      )}

      {phase === "item" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "6px 0 10px" }}>
            <div style={{ border: `1.5px solid ${C.ink}`, padding: 10 }}>
              <Kicker colour={C.reason}>Judged in</Kicker>
              <div style={{ fontFamily: DISPLAY, fontSize: 36, lineHeight: 1 }}>{secs(cur.ms)}<span style={{ fontSize: 16 }}> s</span></div>
              <div style={{ fontSize: 13, color: C.mute }}>{stage === "fold" ? "from begin to the button" : cur.said === truthOf(idx) ? "as most people call it" : "not as most people call it"}</div>
            </div>
            <div style={{ border: `1.5px solid ${C.ink}`, padding: 10 }}>
              <Kicker colour={C.drag}>Reason came</Kicker>
              <div style={{ fontFamily: DISPLAY, fontSize: 28, lineHeight: 1.1 }}>{cur.when}</div>
              <div style={{ fontSize: 13, color: C.mute }}>{words(cur.text)} {words(cur.text) === 1 ? "word" : "words"} of it</div>
            </div>
          </div>
          <div style={{ fontStyle: "italic", fontSize: 15, padding: "8px 10px", background: C.page, marginBottom: 10, whiteSpace: "pre-wrap" }}>{cur.text.trim() || "(nothing written)"}</div>
          <Readout colour={cur.said === truthOf(idx) ? C.reason : C.drag}>
            {stage === "fold" && (
              <>
                <strong>One hole, in the middle.</strong> Folded twice the paper is four layers, the folded corner is the centre of the sheet, and one snip cuts the same spot in all four.{" "}
                {mentions(cur.text, PROCESS_WORDS) >= 2 ? "Your account names parts of that process, so some of the working was visible to you." : "Your account is mostly the answer restated, which is what most people produce: the sheet appeared unfolded, hole and all."}
              </>
            )}
            {stage === "faces" && (
              <>
                <strong>{FACES[idx].off ? "Drawn wrong." : "Drawn right."}</strong> {FACES[idx].cue}{" "}
                {FACES[idx].off && (mentions(cur.text, FACES[idx].words) > 0 ? "Your words point at that feature, at least vaguely." : "Your words describe the effect rather than the feature, which is where most people land.")}
              </>
            )}
            {stage === "ideas" && (
              <>
                <strong>{CLAIMS[idx].holds ? "It holds." : "It does not hold."}</strong> {CLAIMS[idx].note}{" "}
                {mentions(cur.text, CLAIMS[idx].words) > 0 ? "Your words name the kind of fault, or the reason it stands, at least in part." : "Your words give the verdict more than the reason, which is what most people produce, including people who reason very well."}
              </>
            )}
          </Readout>
          <Button onClick={next} active colour={C.amber}>{idx + 1 < items.length ? "Next (starts the clock)" : "Finish"}</Button>
        </div>
      )}

      {phase === "summary" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "6px 0 10px" }}>
            <div style={{ border: `1.5px solid ${C.ink}`, padding: 8 }}>
              <Kicker colour={C.reason}>Per judgement</Kicker>
              <div style={{ fontFamily: DISPLAY, fontSize: 30, lineHeight: 1 }}>{secs(mean)}<span style={{ fontSize: 14 }}> s</span></div>
            </div>
            <div style={{ border: `1.5px solid ${C.ink}`, padding: 8 }}>
              <Kicker colour={C.ink}>As most call them</Kicker>
              <div style={{ fontFamily: DISPLAY, fontSize: 30, lineHeight: 1 }}>{hits}<span style={{ fontSize: 14 }}> of {records.length}</span></div>
            </div>
            <div style={{ border: `1.5px solid ${C.ink}`, padding: 8 }}>
              <Kicker colour={C.drag}>Reason after</Kicker>
              <div style={{ fontFamily: DISPLAY, fontSize: 30, lineHeight: 1 }}>{afters}<span style={{ fontSize: 14 }}> of {records.length}</span></div>
            </div>
          </div>
          <Readout colour={C.amber}>
            {stage === "fold" && "One puzzle is one data point, and it says only what it said above. The next two rounds ask the same question of a judgement you have made all your life, and then of an argument."}
            {stage === "faces" && `Five faces, each judged in about ${secs(mean)} seconds, and the reason came after the decision on ${afters} of them. For faces that is the usual pattern: the judgement is made by something that is not consulting a reason, and the reason is assembled on request, often as a description of the feeling rather than the feature.`}
            {stage === "ideas" && `Five arguments, each judged in about ${secs(mean)} seconds, and the reason came after the decision on ${afters} of them. This is the round that matters for the rest of the page. In an argument, the sense that something is broken arrives long before the fault can be named, and for a person at the top of the reasoning scale that gap is a permanent feature of conversation: they are right, they know it first, and the explanation is a step behind, which from the outside looks like disagreeing without reasons.`}
          </Readout>
          <Readout colour={C.amber}>
            <strong>What this shows and what it does not.</strong> It shows that the steps were not <em>reportable</em> at the moment the answer arrived. It does not show that no steps happened; something computed the answer, and you were not invited to watch. That is the ordinary condition of expertise. The clinical descriptions of people at the top of the reasoning scale say it is their condition across far more of life than most people&rsquo;s: the answer comes, it is right, and asked to show the working they have to build one afterwards, which feels like making it up and can be told apart from making it up only by whether the answer was right. Nothing here measures your ability. It measures a gap, and everyone has one.
          </Readout>
          <Button onClick={() => reset(stage)} colour={C.mute}>Run it again</Button>
          {stage !== "ideas" && <Button onClick={() => reset(stage === "fold" ? "faces" : "ideas")} active colour={C.amber}>Next domain</Button>}
        </div>
      )}
    </Toy>
  );
}




// ============================================================
// PAGE
// ============================================================
const SECTION_IDS = ["intro", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "end"];
export default function TheCostOfLookingFine() {
  const [openIds, setOpenIds] = useState({});
  const [seen, setSeen] = useState({});
  const sec = (id) => ({
    open: !!openIds[id],
    onToggle: () => {
      setOpenIds({ ...openIds, [id]: !openIds[id] });
      if (!openIds[id]) setSeen({ ...seen, [id]: true });
    },
  });
  const openAll = () => {
    const all = {};
    SECTION_IDS.forEach((id) => (all[id] = true));
    setOpenIds(all);
    setSeen(all);
  };
  const closeAll = () => setOpenIds({});
  const seenCount = SECTION_IDS.filter((id) => seen[id]).length;
  return (
    <div
      style={{
        background: C.paper,
        backgroundImage: `linear-gradient(${C.hair} 1px, transparent 1px), linear-gradient(90deg, ${C.hair} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
        minHeight: "100vh",
        color: C.ink,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .cost-root { font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 19px; line-height: 1.6; }
        .cost-root button:focus-visible, .cost-root input:focus-visible { outline: 3px solid ${C.reason}; outline-offset: 2px; }
        .cost-root input[type=range] { cursor: pointer; }
        @media (prefers-reduced-motion: reduce) { .cost-root * { transition: none !important; } }
      `}</style>
      <div className="cost-root" style={{ maxWidth: 640, margin: "0 auto", padding: "40px 22px 90px", background: C.paper, borderLeft: `1.5px solid ${C.ink}`, borderRight: `1.5px solid ${C.ink}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
          <Kicker colour={C.ink}>Assessment Sheet</Kicker>
          <Kicker>Eleven toys, three parts</Kicker>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontSize: 60, lineHeight: 0.98, fontWeight: 400, letterSpacing: "-0.01em", margin: "0 0 0.45em" }}>
          The Cost of{" "}
          <span style={{ fontStyle: "italic", background: `linear-gradient(transparent 55%, ${C.amberSoft} 55%)` }}>Looking Fine</span>
        </h1>
        <Prose style={{ fontFamily: DISPLAY, fontSize: 27, lineHeight: 1.3, fontStyle: "italic" }}>
          If somebody can do the hardest thing in the room, why can they not do the easiest?
        </Prose>
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: C.paper, borderTop: `1.5px solid ${C.ink}`, borderBottom: `1.5px solid ${C.ink}`, padding: "8px 0", display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <Kicker colour={C.ink}>Opened {seenCount} of {SECTION_IDS.length}</Kicker>
          <span style={{ flex: 1, height: 6, background: C.page, border: `1px solid ${C.ink}` }}>
            <span style={{ display: "block", height: "100%", width: `${(seenCount / SECTION_IDS.length) * 100}%`, background: C.ink, transition: "width 0.3s" }} />
          </span>
          <button onClick={openAll} style={{ font: "inherit", fontFamily: MONO, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", background: "none", border: "none", padding: 0, color: C.reason, cursor: "pointer", textDecoration: "underline" }}>Open all</button>
          <button onClick={closeAll} style={{ font: "inherit", fontFamily: MONO, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", background: "none", border: "none", padding: 0, color: C.reason, cursor: "pointer", textDecoration: "underline" }}>Close all</button>
        </div>

        <Section {...sec("intro")} n="" title="Where This Starts">
        <Prose>
          Here is a scene. Somebody talks you through how a national rail timetable propagates
          delays: which junctions amplify, which absorb, why a late train at Reading becomes a
          cancelled one at Cardiff. They are doing it from memory, unprompted, correcting
          themselves as they go. It is the best explanation of the thing you have ever heard.
        </Prose>
        <Prose>
          The same person has an expense claim for &pound;41 that is now fourteen weeks overdue.
          They have opened the form eleven times. They have not filled in the first box. They can
          tell you, accurately, exactly why they haven&rsquo;t, and it does not help.
        </Prose>
        <Prose>
          This page is about people who live in that scene permanently: a reasoning ability so far
          out on the curve the tests barely reach it, and a severe form of ADHD that affects both
          attention and impulse control. Not either trait alone. The collision. Eleven toys in
          three parts: what the number is, what the room does, and what is left behind. Each
          section is folded; open them in order the first time.
        </Prose>
        </Section>

        <PartLabel>Part One: The Number</PartLabel>

        <Section {...sec("1")} n="1" title="How Far Out Is Far Out?">
          <Prose>
            One thing you need before the rest makes sense. An IQ score is a position on a curve, not
            a quantity of anything. The middle is 100, and each step of 15 is one standard deviation.
            Drag the marker to see what a given number means, and pay attention to what happens past
            150, and again past 160.
          </Prose>
          <CurveToy />
          <Prose>
            Hold on to the dotted line and the grey zone. Together they mean that every study you will
            meet below was done on people scoring 120 or 130, sometimes 115: the top tenth or so.
            Nobody has studied a room full of 162s, because there is no such room. Everything that
            follows is an honest extrapolation up a very long tail, and it should be held that way.
          </Prose>
        </Section>

        <Section {...sec("2")} n="2" title="How Many Things at Once">
          <Prose>
            What does a higher number buy, concretely? Mostly one thing: how many rules you can hold
            in relation at the same moment. The grid below is the kind of item the tests use. Start
            with one rule and turn it up; then the same load arrives as one turn of a card game, where you have to pick. The point
            is to feel the load, not to pass.
          </Prose>
          <GridToy />
          <Prose>
            Most adults hold about four interacting things before the structure collapses and they
            have to break it into steps or write it down. That ceiling, and the way people differ in
            it, is the single most useful way to think about what the bands mean. It also sets up the
            split at the centre of this page: seeing the rules is one faculty, and keeping four of
            them alive while you work is another.
          </Prose>
        </Section>

        <Section {...sec("3")} n="3" title="The Rulebook">
          <Prose>
            The same ladder off the test. Here are eight rules from a card game and three questions,
            one from each rung: find a fact, combine several, and settle a dispute the text never
            addresses. Answer each, then look at which rules did the work.
          </Prose>
          <RulesToy />
          <Prose>
            Reading, at the top of the scale, stops being a search for the right sentence and becomes
            modelling the document as a system: what it does, what it was written to avoid saying,
            and where it will bite. The person this page is about settles the rules argument at the
            table without effort. They also have a &pound;41 form they cannot open, and part two is
            about why.
          </Prose>
        </Section>

        <Section {...sec("4")} n="4" title="Same Numbers, Opposite Diagnosis">
          <Prose>
            The standard adult IQ test produces four main index scores. ADHD drags two of them down,
            working memory and processing speed, and leaves the two reasoning indices alone. So a
            person with this profile has a jagged shape, and the 162 from Toy 1 is the average of that
            shape: in this case an extended-norms composite whose lowest indices fall to 118. Whether
            the jaggedness counts as a problem depends entirely on what you hold the ruler against.
            Press both buttons.
          </Prose>
          <RulersToy />
          <Prose>
            The two research camps here are not really contradicting each other. One measured against
            the population and found the person fine. The other measured against the person&rsquo;s
            own ceiling and found them impaired. For somebody whose composite is 162, the second
            ruler is the honest one, and it is also the one almost nobody picks up, because 118 is a
            perfectly good score, and a clinician looking at it in isolation has no reason to ask
            what it is sitting next to.
          </Prose>
        </Section>

        <Section {...sec("5")} n="5" title="The Scales">
          <Prose>
            Toy 4 says the reasoning and the buffer are seventy points apart. This one lets you feel
            the gap. Three balance scales, each one&rsquo;s exchange rate needed for the next. Do it
            once with the rates written down, then once without.
          </Prose>
          <ScalesToy />
          <Prose>
            Seeing how the scales relate and holding &ldquo;six&rdquo; through an interruption are
            different organs. The first is what the reasoning indices measure and the second is what
            working memory measures, and for most people they sit close enough together that nobody
            notices they are two things. In this profile they are not close, and everyday life is
            full of chained exchange rates with no paper.
          </Prose>
        </Section>

        <Section {...sec("6")} n="6" title="Chunks Versus Digits">
          <Prose>
            If the buffer is only high-average, how does the reasoning engine get anything done? By
            never handing it raw items. Two memory tasks, then a slider.
          </Prose>
          <ChunksToy />
          <Prose>
            This is the mechanism behind the rail-timetable explanation in the opening scene: years of
            knowledge have turned the network into a few large chunks, and the buffer holds chunks
            comfortably. It is also the mechanism behind the failure that follows it. A form is raw
            items. So is a spoken instruction, and so is the number somebody just said.
          </Prose>
        </Section>

        <PartLabel>Part Two: The Room</PartLabel>

        <Section {...sec("7")} n="7" title="The Attention System Is a Switch, Not a Dial">
          <Prose>
            The second thing you need. ADHD is badly named. The attention is all there; what is missing is any way of
            pointing it. Interest turns it on. Importance does not. Drag
            the slider and watch what comes out.
          </Prose>
          <AttentionToy />
          <Prose>
            Now put the two things together. A mind that reasons at the far end of the curve is
            constantly under-stimulated by ordinary tasks, so it spends more of its life on the left
            of that graph than most people do. And when it does hit the right-hand side, the result is
            spectacular, which is exactly what makes the left-hand side unforgivable to everyone
            watching. The gift makes the switch more visible; the switch makes the gift unreliable.
          </Prose>
        </Section>

        <Section {...sec("8")} n="8" title="The Room Does the Deciding">
          <Prose>
            This is the toy to spend time on. Put the last toy together with part one: the attention
            system needs interest to switch on, and ADHD means the person cannot reliably generate
            their own structure, the timetables, deadlines and sense of time passing. So whether
            things go well at any given age depends on whether the <em>room</em> supplies what the
            head cannot. The reasoning is flat the whole way through. Drag through a life and watch
            the line move for reasons that have nothing to do with ability.
          </Prose>
          <RoomToy />
          <Prose>
            The textbook version of this story, the one clinicians like Thomas Brown describe, is a
            slow slide: high grades through childhood, then a gradual loss of footing as school and
            work demand more self-management, then a first assessment in the late teens or at
            thirty-five. That shape exists. But the life in the toy is at least as common and gets
            told less, because it does not flatter anyone: the drop comes at twelve, when secondary
            school hands the structure over to a child who cannot carry it; the dropout comes before
            the exams; and the one spectacular success comes years later, in a room that happened to
            supply both scaffolding and fascination at once. Brute cleverness explains why primary school
            looked fine. It does not explain the sawtooth. The room does.
          </Prose>
          <Prose>
            Two things follow. The distinction was not a recovery, and the collapse afterwards was not
            a relapse; nothing inside the person changed between them. And the population data agrees
            with the sawtooth more than with the slide: a large Mayo Clinic cohort found no difference
            in age of diagnosis by IQ at all. The slow-slide story is strong among people who
            eventually turn up at clinics with a clean academic record. It is not the only shape, and
            for someone whose executive floor is 118 against a ceiling near 200, it may not even be
            the usual one.
          </Prose>
        </Section>

        <Section {...sec("9")} n="9" title="Knowing More Does Not Help">
          <Prose>
            The most common piece of advice this person receives, from teachers, parents, managers
            and eventually themselves, is some version of &ldquo;you know what you need to do.&rdquo;
            They do. That is the problem. This toy gives you the £41 expense form from the opening
            scene. Move the slider first and watch the plan improve; then try to actually do it.
          </Prose>
          <DoingToy />
          <Prose>
            The numbers behind the button are fixed, not random, so the ratio you got is the ratio
            everyone gets: roughly four false starts for every step, alone, and roughly one for every
            five with somebody sitting there. Those are my figures, chosen to show the shape. What
            they stand for is real: the only thing that moved the right-hand column was structure
            from outside, which is the same finding as Toy 8 arriving from the other direction.
          </Prose>
        </Section>

        <PartLabel>Part Three: The Residue</PartLabel>

        <Section {...sec("10")} n="10" title="What It Does to a Person, Over Years">
          <Prose>
            The toys so far are about mechanism. This one is about residue. Two traits, taking turns,
            can build a cycle neither could sustain on its own, and every lap leaves something behind.
            Step through it more than once, and watch the four gauges underneath.
          </Prose>
          <LoopToy />
          <Prose>
            Clinicians describe the emotional side of this as central rather than incidental. Brown
            argues that weak working memory lets a single feeling flood the whole system, with nothing
            left over for the other facts and memories that would put it in proportion. Combine that
            with a very high internal standard, and ordinary feedback lands as catastrophe. This
            part of the picture is well described by people who treat it, and thinly measured; take
            it as good testimony rather than settled effect sizes.
          </Prose>
        </Section>

        <Section {...sec("11")} n="11" title="The Invisible Steps">
          <Prose>
            One more piece of residue, and it belongs to the reasoning trait rather than the ADHD. At
            the top of the scale, the intermediate steps of one&rsquo;s own thinking are often not
            available to look at. This toy does not tell you that. It times you. Three rounds, from
            a paper puzzle through drawn faces to arguments: in each you judge against a clock, then
            explain with nothing offered to choose from and no clock, then say which came first.
          </Prose>
          <InvisibleStepsToy />
          <Prose>
            Put this next to the loop. A person who cannot show their working, and who has spent
            years failing at things everyone else finds easy, has two independent reasons to conclude
            that the good results were flukes. Neither reason is evidence. Both feel like it.
          </Prose>
        </Section>

        <Section {...sec("end")} n="" title="What the Evidence Cannot See">
          <Prose>
            Three honest limits. First, the dotted line from Toy 1: nobody at 162 has been studied as a
            group, so the whole picture is extrapolated from people a standard deviation or two
            lower. Second, the numbers in these toys are mostly models drawn to show a shape; the bar
            heights, curves, grids, rulebook and puzzles are mine. The exceptions are in Toy 4, where
            the composite of 162 and the floor of 118 are real anchors and the two reasoning peaks are
            inferred from them, not measured. Third, the lived-experience material comes largely from
            clinicians and from people describing their own lives, and above 160 it is a few dozen
            children in a century of case notes. It is consistent and vivid. It is not measurement.
          </Prose>
          <Prose>
            One thing that does hold up: medication seems to work about as well at high IQ as at any
            other, and the practical corrections are the same ones anyone with ADHD needs, structure
            outside the head rather than resolve inside it. The difference for this person is that
            they will be told they don&rsquo;t need any of it, by people who saw the rail timetable
            and never saw the expense form.
          </Prose>
          <Aside>
            What this page&rsquo;s own framing costs: it treats the diagnosis as settled and never
            gives the other side a hearing. Serious people argue that gifted traits are routinely
            mistaken for ADHD, and that argument has real force at the mild end of the spectrum, where
            a bored, bright child in the wrong classroom can look a lot like a disorder. It has much
            less force for a severe, cross-setting picture with a test profile split by seventy points,
            which is why this page proceeds as it does. But you have not seen that case made here,
            only dismissed. And the toys in part one make the reasoning estimate vivid, which is the
            flattering direction; the label &ldquo;inferred, not measured&rdquo; is on every screen
            where the number appears for that reason.
          </Aside>
        </Section>
      </div>
    </div>
  );
}
