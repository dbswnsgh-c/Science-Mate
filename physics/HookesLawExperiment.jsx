import React, { useMemo, useState } from "react";

/**
 * Hooke's Law / Spring-Mass Simulator
 * Based on the uploaded Hooke's Law PDF.
 *
 * Model:
 *   equilibrium extension: x_eq = mg / k
 *   restoring force: F = -kx
 *   period: T = 2π sqrt(m/k)
 *   spring potential energy: U = 1/2 kx²
 *   kinetic energy (using selected displacement from equilibrium):
 *     K = 1/2 k(A² - x²), where A is the selected amplitude.
 *
 * The simulator assumes an ideal spring within its elastic limit and
 * neglects friction for the energy and oscillation calculations.
 */
export default function HookesLawExperiment() {
  const [mass, setMass] = useState(0.3);        // kg
  const [springK, setSpringK] = useState(30);   // N/m
  const [gravity, setGravity] = useState(9.8);  // m/s²
  const [displacement, setDisplacement] = useState(0.05); // m from equilibrium

  const values = useMemo(() => {
    const equilibriumExtension = (mass * gravity) / springK;
    const restoringForce = -springK * displacement;
    const period = 2 * Math.PI * Math.sqrt(mass / springK);
    const amplitude = Math.max(Math.abs(displacement), 0.001);
    const potentialEnergy = 0.5 * springK * displacement * displacement;
    const totalEnergy = 0.5 * springK * amplitude * amplitude;
    const kineticEnergy = Math.max(0, totalEnergy - potentialEnergy);
    return {
      equilibriumExtension,
      restoringForce,
      period,
      potentialEnergy,
      kineticEnergy,
      totalEnergy,
    };
  }, [mass, springK, gravity, displacement]);

  const extensionPercent = Math.min(
    100,
    Math.max(8, (values.equilibriumExtension / 0.4) * 100)
  );

  return (
    <section style={styles.panel}>
      <header style={styles.header}>
        <div>
          <div style={styles.kicker}>PHYSICS · SPRING & MASS</div>
          <h2 style={styles.title}>Hooke’s Law</h2>
          <p style={styles.subtitle}>胡克定律 · 弹簧与质量块模拟器</p>
        </div>
        <div style={styles.formula}>F = −kx</div>
      </header>

      <div style={styles.layout}>
        <div style={styles.visual}>
          <div style={styles.ceiling}>
            <span />
          </div>
          <div
            style={{
              ...styles.spring,
              height: `${Math.max(76, extensionPercent * 1.8)}px`,
            }}
            aria-label="Spring illustration"
          >
            <svg viewBox="0 0 70 180" preserveAspectRatio="none" style={styles.springSvg}>
              <polyline
                points="35,0 35,12 17,24 53,36 17,48 53,60 17,72 53,84 17,96 53,108 17,120 35,132 35,180"
                fill="none"
                stroke="#155cae"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={styles.massBlock}>
            <strong>{mass.toFixed(2)} kg</strong>
          </div>
          <div style={styles.measure}>
            <span>Extension</span>
            <strong>{(values.equilibriumExtension * 100).toFixed(1)} cm</strong>
          </div>
          <div style={styles.forceMeasure}>
            <span>Restoring force</span>
            <strong>{values.restoringForce.toFixed(2)} N</strong>
          </div>
          <div style={styles.visualNote}>Illustrative spring · not to scale</div>
        </div>

        <div style={styles.controls}>
          <Control
            label="MASS (m)"
            value={mass}
            min={0.05}
            max={1}
            step={0.01}
            display={`${mass.toFixed(2)} kg`}
            onChange={setMass}
          />
          <Control
            label="SPRING CONSTANT (k)"
            value={springK}
            min={10}
            max={100}
            step={1}
            display={`${springK} N/m`}
            onChange={setSpringK}
          />
          <Control
            label="GRAVITY (g)"
            value={gravity}
            min={1.6}
            max={20}
            step={0.1}
            display={`${gravity.toFixed(1)} m/s²`}
            onChange={setGravity}
          />
          <Control
            label="DISPLACEMENT FROM EQUILIBRIUM (x)"
            value={displacement}
            min={-0.15}
            max={0.15}
            step={0.005}
            display={`${(displacement * 100).toFixed(1)} cm`}
            onChange={setDisplacement}
          />

          <div style={styles.resultBox}>
            <div style={styles.resultLabel}>CALCULATED RESULTS</div>
            <Result label="Equilibrium extension (mg/k)" value={`${(values.equilibriumExtension * 100).toFixed(2)} cm`} />
            <Result label="Restoring force (−kx)" value={`${values.restoringForce.toFixed(2)} N`} />
            <Result label="Oscillation period" value={`${values.period.toFixed(3)} s`} />
          </div>
        </div>
      </div>

      <div style={styles.infoGrid}>
        <InfoCard title="Restoring force" formula="F = −kx">
          The restoring force points toward the equilibrium position and opposes displacement.
        </InfoCard>
        <InfoCard title="Oscillation period" formula="T = 2π√(m/k)">
          A larger mass increases the period; a stiffer spring decreases it.
        </InfoCard>
        <InfoCard title="Energy" formula="E = ½kA²">
          Kinetic and elastic potential energy interchange during ideal oscillation.
        </InfoCard>
      </div>

      <div style={styles.energyBox}>
        <div style={styles.energyHeader}>
          <strong>ENERGY AT SELECTED DISPLACEMENT</strong>
          <span>Total: {values.totalEnergy.toFixed(4)} J</span>
        </div>
        <EnergyBar label="Elastic potential energy" value={values.potentialEnergy} total={values.totalEnergy} />
        <EnergyBar label="Kinetic energy (ideal model)" value={values.kineticEnergy} total={values.totalEnergy} />
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

function Result({ label, value }) {
  return (
    <div style={styles.resultRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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

function EnergyBar({ label, value, total }) {
  const percent = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div style={styles.energyRow}>
      <div style={styles.energyLabel}>
        <span>{label}</span>
        <strong>{value.toFixed(4)} J</strong>
      </div>
      <div style={styles.barTrack}>
        <div style={{ ...styles.barFill, width: `${percent}%` }} />
      </div>
    </div>
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
  title: { fontSize: 32, margin: "6px 0 0", fontWeight: 900 },
  subtitle: { margin: "4px 0 0", color: "#cbe8ff" },
  formula: { fontSize: 34, color: "#61d8ff", fontFamily: "Georgia, serif" },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(240px, 0.9fr) minmax(280px, 1.1fr)",
    gap: 20,
  },
  visual: {
    position: "relative",
    minHeight: 430,
    borderRadius: 12,
    background: "#e4f6ff",
    color: "#064da8",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 28,
    boxSizing: "border-box",
  },
  ceiling: {
    width: "58%",
    height: 14,
    background: "#145cae",
    borderRadius: 4,
    zIndex: 1,
  },
  spring: { width: 70, position: "relative", transition: "height 180ms ease" },
  springSvg: { width: "100%", height: "100%", overflow: "visible" },
  massBlock: {
    width: 116,
    height: 74,
    background: "#1971c9",
    border: "3px solid #064da8",
    borderRadius: 5,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 5px 0 rgba(4,60,133,.12)",
  },
  measure: {
    position: "absolute",
    bottom: 65,
    left: 16,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  forceMeasure: {
    position: "absolute",
    bottom: 65,
    right: 16,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    textAlign: "right",
  },
  measureLabel: { fontSize: 12 },
  visualNote: { position: "absolute", bottom: 14, fontSize: 10, color: "#5383b2" },
  controls: { display: "flex", flexDirection: "column", gap: 17 },
  control: { display: "block" },
  controlTop: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, marginBottom: 6 },
  scale: { display: "flex", justifyContent: "space-between", fontSize: 10, color: "#b8dfff" },
  resultBox: { padding: 15, borderRadius: 10, background: "#043c85", marginTop: 2 },
  resultLabel: { fontSize: 10, letterSpacing: 1.1, color: "#91dfff", fontWeight: 800, marginBottom: 8 },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
    padding: "7px 0",
    borderBottom: "1px solid rgba(255,255,255,.12)",
    fontSize: 12,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 12,
    marginTop: 20,
  },
  infoCard: { background: "#043c85", borderRadius: 10, padding: 15, lineHeight: 1.5, fontSize: 13 },
  infoFormula: { color: "#63d8ff", fontSize: 22, fontFamily: "Georgia, serif", marginTop: 7 },
  energyBox: { marginTop: 16, background: "#043c85", borderRadius: 10, padding: 16 },
  energyHeader: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 11,
    color: "#aeeaff",
    marginBottom: 14,
  },
  energyRow: { marginTop: 10 },
  energyLabel: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, marginBottom: 6 },
  barTrack: { height: 9, borderRadius: 999, background: "rgba(255,255,255,.15)", overflow: "hidden" },
  barFill: { height: "100%", background: "#45c7f4", borderRadius: 999, transition: "width 120ms ease" },
};
