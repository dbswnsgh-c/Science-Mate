import React, { useMemo, useState } from "react";

/**
 * Young's Double-Slit Experiment
 * Interactive React component based on the uploaded physics-young PDF.
 *
 * Formula shown in the source:
 *   y_n = n L λ / d
 *
 * Model assumptions:
 * - Small-angle approximation for fringe positions.
 * - Equal-intensity coherent slits.
 * - Idealized screen intensity I(y) = cos²(π d y / (λ L)).
 * - λ is entered in nm, d in mm, L in m; calculations convert to SI.
 */
export default function YoungDoubleSlitExperiment() {
  const [wavelengthNm, setWavelengthNm] = useState(600);
  const [slitDistanceMm, setSlitDistanceMm] = useState(0.3);
  const [screenDistanceM, setScreenDistanceM] = useState(1.5);
  const [fringeOrder, setFringeOrder] = useState(1);

  const result = useMemo(() => {
    const wavelength = wavelengthNm * 1e-9;
    const slitDistance = slitDistanceMm * 1e-3;
    const fringeSpacing = (screenDistanceM * wavelength) / slitDistance;
    const selectedFringePosition = fringeOrder * fringeSpacing;
    return {
      wavelength,
      slitDistance,
      fringeSpacing,
      selectedFringePosition,
      fringeSpacingMm: fringeSpacing * 1000,
      selectedFringePositionMm: selectedFringePosition * 1000,
    };
  }, [wavelengthNm, slitDistanceMm, screenDistanceM, fringeOrder]);

  const graphPath = useMemo(() => {
    const width = 600;
    const height = 170;
    const mid = height / 2;
    const amplitude = 64;
    const halfRange = 4 * result.fringeSpacing;
    const points = [];
    for (let i = 0; i <= 600; i++) {
      const x = (i / 600) * width;
      const yPosition = ((x / width) * 2 - 1) * halfRange;
      const phase = Math.PI * result.slitDistance * yPosition /
        (result.wavelength * screenDistanceM);
      const intensity = Math.pow(Math.cos(phase), 2);
      const y = mid - intensity * amplitude;
      points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(" ");
  }, [result, screenDistanceM]);

  const brightFringes = Array.from({ length: 9 }, (_, i) => i - 4);
  const fringePositions = brightFringes.map((order) => ({
    order,
    position: order * result.fringeSpacing,
  }));

  return (
    <section style={styles.panel}>
      <header style={styles.header}>
        <div>
          <div style={styles.kicker}>PHYSICS · WAVE OPTICS</div>
          <h2 style={styles.title}>Young’s Double-Slit Experiment</h2>
          <p style={styles.subtitle}>杨氏双缝实验 · 光的干涉</p>
        </div>
        <div style={styles.formula}>
          <span>yₙ = </span>
          <span style={styles.fraction}>
            <span>nLλ</span>
            <span>d</span>
          </span>
        </div>
      </header>

      <div style={styles.layout}>
        <div style={styles.visual}>
          <div style={styles.diagramTitle}>DOUBLE-SLIT SIMULATION</div>
          <div style={styles.diagramSubtitle}>From light source to interference pattern</div>
          <svg viewBox="0 0 520 290" style={styles.diagramSvg} role="img" aria-label="Light source, double slit and screen interference diagram">
            <rect x="20" y="66" width="72" height="156" rx="14" fill="#c4eaff" />
            <text x="56" y="247" textAnchor="middle" fill="#145cae" fontSize="14" fontWeight="700">LIGHT</text>
            <circle cx="56" cy="145" r="13" fill="#fff" stroke="#1971c9" strokeWidth="3" />
            <path d="M56 132 V158 M43 145 H69" stroke="#1971c9" strokeWidth="2" />

            <rect x="185" y="54" width="20" height="180" rx="4" fill="#145cae" />
            <rect x="181" y="117" width="28" height="14" rx="3" fill="#e4f6ff" />
            <rect x="181" y="157" width="28" height="14" rx="3" fill="#e4f6ff" />
            <text x="195" y="247" textAnchor="middle" fill="#145cae" fontSize="14" fontWeight="700">SLITS</text>

            <g stroke="#78bce8" strokeWidth="2" opacity="0.75">
              <path d="M92 145 H181" />
              <path d="M209 124 L360 80" />
              <path d="M209 124 L360 124" />
              <path d="M209 124 L360 168" />
              <path d="M209 164 L360 80" />
              <path d="M209 164 L360 124" />
              <path d="M209 164 L360 168" />
            </g>

            <rect x="360" y="48" width="22" height="190" rx="5" fill="#145cae" />
            {Array.from({ length: 13 }, (_, i) => (
              <rect
                key={i}
                x="362"
                y={58 + i * 14}
                width="18"
                height="7"
                rx="2"
                fill={i % 2 === 0 ? "#e4f6ff" : "#65c9f6"}
              />
            ))}
            <text x="371" y="257" textAnchor="middle" fill="#145cae" fontSize="14" fontWeight="700">SCREEN</text>
            <text x="130" y="107" textAnchor="middle" fill="#145cae" fontSize="12">λ</text>
            <text x="280" y="202" textAnchor="middle" fill="#145cae" fontSize="12">L</text>
          </svg>

          <div style={styles.patternLabel}>SCREEN INTENSITY I(y)</div>
          <svg viewBox="0 0 600 170" style={styles.graph} role="img" aria-label="Calculated interference intensity graph">
            <line x1="0" y1="85" x2="600" y2="85" stroke="#9fc8e7" strokeWidth="1" />
            <line x1="300" y1="10" x2="300" y2="150" stroke="#9fc8e7" strokeWidth="1" strokeDasharray="4 4" />
            <path d={graphPath} fill="none" stroke="#1971c9" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div style={styles.graphAxis}>
            <span>−4 fringe spacings</span>
            <span>Position on screen (y)</span>
            <span>+4 fringe spacings</span>
          </div>
        </div>

        <div style={styles.controls}>
          <Control
            label="WAVELENGTH (λ)"
            value={wavelengthNm}
            min={380}
            max={750}
            step={1}
            display={`${wavelengthNm} nm`}
            onChange={setWavelengthNm}
          />
          <Control
            label="SLIT SEPARATION (d)"
            value={slitDistanceMm}
            min={0.1}
            max={1}
            step={0.01}
            display={`${slitDistanceMm.toFixed(2)} mm`}
            onChange={setSlitDistanceMm}
          />
          <Control
            label="SCREEN DISTANCE (L)"
            value={screenDistanceM}
            min={0.5}
            max={3}
            step={0.01}
            display={`${screenDistanceM.toFixed(2)} m`}
            onChange={setScreenDistanceM}
          />
          <Control
            label="FRINGE ORDER (n)"
            value={fringeOrder}
            min={1}
            max={5}
            step={1}
            display={`n = ${fringeOrder}`}
            onChange={setFringeOrder}
          />

          <div style={styles.resultBox}>
            <div style={styles.resultLabel}>CALCULATED RESULTS</div>
            <div style={styles.bigResult}>
              {result.fringeSpacingMm.toFixed(3)} <span>mm</span>
            </div>
            <div style={styles.resultCaption}>Fringe spacing Δy = Lλ/d</div>
            <div style={styles.resultRow}>
              <span>Bright fringe position yₙ</span>
              <strong>{result.selectedFringePositionMm.toFixed(3)} mm</strong>
            </div>
            <div style={styles.resultRow}>
              <span>Order</span>
              <strong>n = {fringeOrder}</strong>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.fringePanel}>
        <div style={styles.fringeTitle}>BRIGHT FRINGE POSITIONS</div>
        <div style={styles.fringeStrip}>
          {fringePositions.map(({ order, position }) => (
            <div key={order} style={styles.fringeItem}>
              <div
                style={{
                  ...styles.fringeMark,
                  opacity: order === 0 ? 1 : 0.65,
                  height: order === 0 ? 46 : 30,
                }}
              />
              <span>{order === 0 ? "0" : order > 0 ? `+${order}` : order}</span>
              <small>{(position * 1000).toFixed(2)} mm</small>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.infoGrid}>
        <InfoCard title="Constructive interference" formula="Δr = nλ">
          Waves meet in phase and form a bright fringe.
        </InfoCard>
        <InfoCard title="Destructive interference" formula="Δr = (n + ½)λ">
          Waves meet in opposite phase and form a dark fringe.
        </InfoCard>
        <InfoCard title="Wave nature of light" formula="Superposition">
          The overlapping waves from the two slits create an interference pattern on the screen.
        </InfoCard>
      </div>
      <p style={styles.note}>
        Idealized simulation using the small-angle approximation. The intensity graph is normalized;
        the displayed fringe positions are calculated from yₙ = nLλ/d.
      </p>
    </section>
  );
}

function Control({ label, value, min, max, step, display, onChange }) {
  return (
    <label style={styles.control}>
      <span style={styles.controlTop}>
        <strong>{label}</strong>
        <output>{display}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ width: "100%", accentColor: "#45c7f4" }}
      />
      <span style={styles.scale}>
        <span>{min}</span>
        <span>{max}</span>
      </span>
    </label>
  );
}

function InfoCard({ title, formula, children }) {
  return (
    <article style={styles.infoCard}>
      <strong>{title}</strong>
      <div style={styles.infoFormula}>{formula}</div>
      <p>{children}</p>
    </article>
  );
}

const styles = {
  panel: {
    maxWidth: 1000,
    margin: "24px auto",
    padding: 24,
    borderRadius: 18,
    background: "#064da8",
    color: "#fff",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 22,
  },
  kicker: { fontSize: 11, letterSpacing: 1.4, color: "#54d4ff", fontWeight: 800 },
  title: { fontSize: 30, margin: "6px 0 0", fontWeight: 900 },
  subtitle: { margin: "4px 0 0", color: "#cbe8ff" },
  formula: { display: "flex", alignItems: "center", gap: 5, fontSize: 30, color: "#61d8ff", fontFamily: "Georgia, serif" },
  fraction: { display: "inline-flex", flexDirection: "column", textAlign: "center", lineHeight: 1.1 },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 1.1fr) minmax(280px, 0.9fr)",
    gap: 20,
  },
  visual: {
    borderRadius: 12,
    background: "#e4f6ff",
    color: "#064da8",
    padding: 16,
    overflow: "hidden",
    boxSizing: "border-box",
  },
  diagramTitle: { fontSize: 11, letterSpacing: 0.7, fontWeight: 900 },
  diagramSubtitle: { fontSize: 10, color: "#5383b2", marginTop: 4 },
  diagramSvg: { width: "100%", height: "auto", display: "block", marginTop: 4 },
  patternLabel: { fontSize: 11, fontWeight: 900, marginTop: 4 },
  graph: { width: "100%", height: "auto", display: "block", marginTop: 8 },
  graphAxis: { display: "flex", justifyContent: "space-between", gap: 6, fontSize: 9, color: "#5383b2" },
  controls: { display: "flex", flexDirection: "column", gap: 17 },
  control: { display: "block" },
  controlTop: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, marginBottom: 6 },
  scale: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "#b8dfff" },
  resultBox: { padding: 15, borderRadius: 10, background: "#043c85", marginTop: 2 },
  resultLabel: { fontSize: 10, letterSpacing: 1.1, color: "#91dfff", fontWeight: 800 },
  bigResult: { fontSize: 32, fontWeight: 900, margin: "5px 0 0" },
  bigResultUnit: { fontSize: 15 },
  resultCaption: { fontSize: 11, color: "#cceaff", marginBottom: 12 },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 12,
    padding: "7px 0",
    borderTop: "1px solid rgba(255,255,255,.12)",
  },
  fringePanel: { marginTop: 18, background: "#043c85", borderRadius: 10, padding: 16 },
  fringeTitle: { fontSize: 11, fontWeight: 900, color: "#aeeaff", marginBottom: 14 },
  fringeStrip: { display: "flex", justifyContent: "space-between", gap: 5, overflowX: "auto" },
  fringeItem: { minWidth: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, fontSize: 12 },
  fringeMark: { width: 5, background: "#e4f6ff", borderRadius: 3 },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  infoCard: { background: "#043c85", borderRadius: 10, padding: 15, lineHeight: 1.5, fontSize: 13 },
  infoFormula: { color: "#63d8ff", fontSize: 21, fontFamily: "Georgia, serif", marginTop: 7 },
  note: { fontSize: 11, lineHeight: 1.5, color: "#cbe8ff", marginTop: 16 },
};
