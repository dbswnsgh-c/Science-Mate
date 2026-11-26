import React, { useMemo, useState } from "react";

/**
 * Faraday's Electromagnetic Induction Experiment
 * Based on the uploaded PDF's interactive controls:
 * initial magnetic field B0, final field B1, coil turns N, and time interval Δt.
 *
 * Model assumption for this simulation:
 * - magnetic field is uniform and perpendicular to the coil
 * - coil area is fixed at 0.01 m²
 * - ε = -N * A * (B1 - B0) / Δt
 */
export default function FaradayExperiment() {
  const [b0, setB0] = useState(0.2);       // tesla
  const [b1, setB1] = useState(1.0);       // tesla
  const [turns, setTurns] = useState(25);  // coil turns
  const [dt, setDt] = useState(1.0);       // seconds

  const area = 0.01; // m², fixed coil area for this demo

  const result = useMemo(() => {
    const deltaB = b1 - b0;
    const flux0 = b0 * area;
    const flux1 = b1 * area;
    const emf = -turns * area * deltaB / dt;
    return { deltaB, flux0, flux1, emf, magnitude: Math.abs(emf) };
  }, [b0, b1, turns, dt]);

  const directionText =
    result.deltaB > 0
      ? "磁通量增加：感应电流产生的磁场反抗磁通量增加。"
      : result.deltaB < 0
      ? "磁通量减少：感应电流产生的磁场反抗磁通量减少。"
      : "磁通量没有变化：没有感应电动势。";

  const rangeStyle = { width: "100%", accentColor: "#1763b0" };

  return (
    <section style={styles.panel}>
      <header style={styles.header}>
        <div>
          <div style={styles.kicker}>PHYSICS · ELECTROMAGNETIC INDUCTION</div>
          <h2 style={styles.title}>Faraday’s Experiment</h2>
          <p style={styles.subtitle}>法拉第电磁感应实验</p>
        </div>
        <div style={styles.formula}>ε = −N ΔΦ / Δt</div>
      </header>

      <div style={styles.layout}>
        <div style={styles.visual}>
          <div style={styles.fieldGrid} aria-hidden="true">
            {Array.from({ length: 49 }, (_, i) => (
              <span key={i}>{b1 >= b0 ? "⊗" : "⊙"}</span>
            ))}
          </div>
          <div style={styles.coil}>
            <div style={styles.coilLabel}>N = {turns} turns</div>
          </div>
          <div style={styles.meter}>
            <span style={styles.meterNeedle}>↗</span>
            <strong>{result.magnitude.toFixed(3)} V</strong>
            <small>INDUCED EMF</small>
          </div>
        </div>

        <div style={styles.controls}>
          <Control
            label="INITIAL FIELD B₀"
            value={b0}
            min={-2}
            max={2}
            step={0.01}
            display={`${b0.toFixed(2)} T`}
            onChange={setB0}
          />
          <Control
            label="FINAL FIELD B₁"
            value={b1}
            min={-2}
            max={2}
            step={0.01}
            display={`${b1.toFixed(2)} T`}
            onChange={setB1}
          />
          <Control
            label="COIL TURNS N"
            value={turns}
            min={1}
            max={100}
            step={1}
            display={`${turns}`}
            onChange={setTurns}
          />
          <Control
            label="CHANGE TIME Δt"
            value={dt}
            min={0.1}
            max={5}
            step={0.1}
            display={`${dt.toFixed(1)} s`}
            onChange={setDt}
          />

          <div style={styles.resultBox}>
            <div style={styles.resultLabel}>INDUCED EMF</div>
            <div style={styles.resultValue}>
              {result.emf.toFixed(3)} <span>V</span>
            </div>
            <div style={styles.resultLabel}>MAGNITUDE</div>
            <div style={styles.magnitude}>{result.magnitude.toFixed(3)} V</div>
          </div>
        </div>
      </div>

      <div style={styles.explanation}>
        <strong>Faraday’s law</strong>
        <p>
          ε = −N ΔΦ / Δt, where Φ = B × A. In this demo the coil area is
          fixed at {area.toFixed(2)} m² and the magnetic field is perpendicular
          to the coil.
        </p>
        <p style={styles.lenz}>{directionText}</p>
        <div style={styles.stats}>
          <span>ΔB: {result.deltaB.toFixed(2)} T</span>
          <span>Φ₀: {result.flux0.toFixed(4)} Wb</span>
          <span>Φ₁: {result.flux1.toFixed(4)} Wb</span>
        </div>
      </div>
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

const styles = {
  panel: {
    maxWidth: 980,
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
  formula: { fontSize: 27, color: "#61d8ff", fontFamily: "Georgia, serif" },
  layout: { display: "grid", gridTemplateColumns: "minmax(240px, 1fr) minmax(260px, 1fr)", gap: 20 },
  visual: {
    position: "relative",
    minHeight: 320,
    borderRadius: 12,
    background: "#dff5ff",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldGrid: {
    position: "absolute",
    inset: 18,
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 10,
    color: "#8acde9",
    fontSize: 17,
    textAlign: "center",
  },
  coil: {
    position: "relative",
    width: "62%",
    aspectRatio: "1",
    border: "8px solid #145cae",
    borderRadius: "50%",
    background: "rgba(255,255,255,.18)",
    zIndex: 1,
    boxShadow: "inset 0 0 0 5px #b9e9ff",
  },
  coilLabel: {
    position: "absolute",
    top: "42%",
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#064da8",
    fontWeight: 800,
    fontSize: 13,
  },
  meter: {
    position: "absolute",
    bottom: 12,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "8px 14px",
    border: "2px solid #145cae",
    borderRadius: 999,
    background: "#fff",
    color: "#064da8",
    zIndex: 2,
    whiteSpace: "nowrap",
  },
  meterNeedle: { fontSize: 20, color: "#e78b21" },
  controls: { display: "flex", flexDirection: "column", gap: 17 },
  control: { display: "block" },
  controlTop: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, marginBottom: 6 },
  scale: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "#b8dfff" },
  resultBox: { padding: 15, borderRadius: 10, background: "#043c85", marginTop: 2 },
  resultLabel: { fontSize: 10, letterSpacing: 1.1, color: "#91dfff", fontWeight: 800 },
  resultValue: { fontSize: 30, fontWeight: 900, margin: "3px 0 10px" },
  magnitude: { fontSize: 17, fontWeight: 800, marginTop: 3 },
  explanation: { marginTop: 20, padding: 16, borderRadius: 10, background: "#043c85", lineHeight: 1.55, fontSize: 14 },
  lenz: { color: "#aeeaff", fontWeight: 700 },
  stats: { display: "flex", flexWrap: "wrap", gap: 14, fontSize: 12, color: "#cceaff" },
};

