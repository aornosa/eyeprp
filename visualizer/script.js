// visualizer/visualizer.js
const IMAGE_URL = "./balloon_eyetest.png";
const DATA_URL = "../prescription.json";

const distanceSelect = document.getElementById("distance");
const eyeSelect = document.getElementById("eye");
const img = document.getElementById("sourceImage");
const canvas = document.getElementById("filteredCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

if (img) {
  img.src = IMAGE_URL;
}

let prescription = null;

async function loadPrescription() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load prescription.json");
  prescription = await res.json();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function dioptersToBlurPx(sphere) {
  const abs = Math.abs(sphere || 0);
  return clamp(abs * 6, 0, 18);
}

function cylinderToMotionPx(cyl) {
  const abs = Math.abs(cyl || 0);
  return clamp(abs * 10, 0, 22);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "-";
}

function formatNum(value) {
  return typeof value === "number" ? value.toFixed(2) : "-";
}

function getSeverityInfo(value, thresholds) {
  if (value <= thresholds.perfect) return { label: "perfecto", level: "low" };
  if (value <= thresholds.normal) return { label: "(Normal)", level: "low" };
  if (value <= thresholds.slight) return { label: "(Ligero)", level: "medium" };
  if (value <= thresholds.moderate) return { label: "(Moderado)", level: "medium" };
  if (value <= thresholds.high) return { label: "(Elevado)", level: "high" };
  return { label: "(Severo)", level: "high" };
}

function buildSummary() {
  const list = document.getElementById("summaryList");
  if (!list) return;

  const farOD = prescription?.far?.right_eye;
  const farOS = prescription?.far?.left_eye;

  if (!farOD && !farOS) {
    list.innerHTML = "<li>No summary available.</li>";
    return;
  }

  const rightSphere = farOD?.sphere ?? 0;
  const leftSphere = farOS?.sphere ?? 0;
  const rightCyl = farOD?.cylinder ?? 0;
  const leftCyl = farOS?.cylinder ?? 0;

  const sphereMax = Math.max(Math.abs(rightSphere), Math.abs(leftSphere));
  const cylMax = Math.max(Math.abs(rightCyl), Math.abs(leftCyl));
  const sphereDiff = Math.abs(rightSphere - leftSphere);

  const thresholds = {
    sphere: { perfect: 0.25, normal: 0.75, slight: 1.5, moderate: 4.0, high: 6.0 },
    cylinder: { perfect: 0.25, normal: 0.5, slight: 1.0, moderate: 2.0, high: 4.0 },
    aniso: { perfect: 0.25, normal: 0.5, slight: 1.0, moderate: 2.0, high: 4.0 },
  };

  const items = [];

  if (sphereMax > thresholds.sphere.perfect) {
    const severity = getSeverityInfo(sphereMax, thresholds.sphere);
    const signRight = Math.sign(rightSphere);
    const signLeft = Math.sign(leftSphere);
    const sameSign = signRight === 0 || signLeft === 0 || signRight === signLeft;
    let condition = "Refracción Mixta";
    if (sameSign) condition = signRight + signLeft < 0 ? "Miopía" : "Hipermetropía";
    items.push({ text: `${condition} ${severity.label}`, severity: severity.level });
  }

  if (cylMax > thresholds.cylinder.perfect) {
    const severity = getSeverityInfo(cylMax, thresholds.cylinder);
    items.push({ text: `Astigmatismo ${severity.label}`, severity: severity.level });
  }

  if (sphereDiff > thresholds.aniso.normal) {
    const severity = getSeverityInfo(sphereDiff, thresholds.aniso);
    items.push({ text: `Anisometropía ${severity.label}`, severity: severity.level });
  }

  if (items.length === 0) {
    items.push({ text: "Visión Perfecta", severity: "low" });
  }

  list.innerHTML = items
    .map((item) => `<li class="severity-${item.severity}">${item.text}</li>`)
    .join("");
}

function fillTable() {
  const farOD = prescription?.far?.right_eye;
  const farOS = prescription?.far?.left_eye;
  const nearOD = prescription?.near?.right_eye;
  const nearOS = prescription?.near?.left_eye;

  setText("farOdSphere", formatNum(farOD?.sphere));
  setText("farOdCylinder", formatNum(farOD?.cylinder));
  setText("farOdAxis", farOD?.axis ?? "-");

  setText("farOsSphere", formatNum(farOS?.sphere));
  setText("farOsCylinder", formatNum(farOS?.cylinder));
  setText("farOsAxis", farOS?.axis ?? "-");

  setText("nearOdSphere", formatNum(nearOD?.sphere));
  setText("nearOdCylinder", formatNum(nearOD?.cylinder));
  setText("nearOdAxis", nearOD?.axis ?? "-");

  setText("nearOsSphere", formatNum(nearOS?.sphere));
  setText("nearOsCylinder", formatNum(nearOS?.cylinder));
  setText("nearOsAxis", nearOS?.axis ?? "-");

  setText("additionValue", formatNum(prescription?.add));
  setText("pdValue", prescription?.dp ?? "-");
  setText("nearPointValue", formatNum(prescription?.np));
  setText("visualAcuityValue", formatNum(prescription?.av));
}

function applyFilters() {
    if (!prescription || !canvas || !ctx || !img) return;

    const dist = "far"; // or "near"
    const od = prescription?.[dist]?.right_eye || {};
    const os = prescription?.[dist]?.left_eye || {};

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const halfBlurOD = dioptersToBlurPx(Math.abs(od.sphere)) / 2;
    const halfBlurOS = dioptersToBlurPx(Math.abs(os.sphere)) / 2;
    const hasBlur = halfBlurOD > 0 || halfBlurOS > 0;

    if (!hasBlur) {
      ctx.filter = "none";
      ctx.drawImage(img, 0, 0, w, h);
      return;
    }

    if (halfBlurOD > 0) drawGradientBlur(halfBlurOD, od.sphere);
    if (halfBlurOS > 0) drawGradientBlur(halfBlurOS, os.sphere);

    function drawGradientBlur(blurPx, sphereValue) {
        if (!blurPx) return;

      const slices = 20;
      const boundaryRatio = 0.2;
      const midY = h * boundaryRatio;
      const bottomHeight = h - midY;
      const sliceH = bottomHeight / slices;
      const boundaryStrength = sphereValue < 0 ? 1 : 0;
      const boundaryBlur = blurPx * boundaryStrength;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, midY);
      ctx.clip();
      ctx.filter = `blur(${boundaryBlur}px)`;
      ctx.drawImage(img, 0, 0, w, h);
      ctx.restore();

        for (let i = 0; i < slices; i++) {
      const t = i / (slices - 1); // 0 mid -> 1 bottom
      const strength = sphereValue < 0 ? 1 - t : t; // myopia top-strong, hyperopia bottom-strong
      const sliceBlur = blurPx * strength;

        ctx.save();
        ctx.beginPath();
      ctx.rect(0, midY + i * sliceH, w, sliceH + 1);
        ctx.clip();

        ctx.filter = `blur(${sliceBlur}px)`;
        ctx.drawImage(img, 0, 0, w, h);

        ctx.restore();
        }

        ctx.filter = "none";
    }
}

async function init() {
  await loadPrescription();
  fillTable();
  buildSummary();

  if (img && canvas) {
    const render = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      applyFilters();
    };

    if (img.complete && img.naturalWidth) {
      render();
    } else {
      img.onload = render;
    }
  }

  if (distanceSelect) distanceSelect.addEventListener("change", applyFilters);
  if (eyeSelect) eyeSelect.addEventListener("change", applyFilters);
}

init().catch((err) => {
  console.error(err);
});