// visualizer/visualizer.js
const IMAGE_URL = "https://picsum.photos/1200/800";
const DATA_URL = "../prescription.json";

const distanceSelect = document.getElementById("distance");
const eyeSelect = document.getElementById("eye");
const img = document.getElementById("sourceImage");
const canvas = document.getElementById("filteredCanvas");
const ctx = canvas.getContext("2d");

img.src = IMAGE_URL;

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

function applyFilters() {
  if (!prescription) return;

  const dist = distanceSelect.value;
  const eye = eyeSelect.value;
  const data = prescription?.[dist]?.[eye];

  const blurPx = dioptersToBlurPx(data?.sphere);
  const motionPx = cylinderToMotionPx(data?.cylinder);
  const axisDeg = data?.axis || 0;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Base blur
  ctx.filter = `blur(${blurPx}px)`;
  ctx.drawImage(img, 0, 0, w, h);

  // Directional blur for astigmatism: rotate, draw multiple offsets
  if (motionPx > 0.5) {
    const steps = 8;
    const step = motionPx / steps;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((axisDeg * Math.PI) / 180);
    ctx.translate(-w / 2, -h / 2);
    ctx.filter = "none";

    for (let i = -steps; i <= steps; i++) {
      ctx.globalAlpha = 1 / (steps * 2 + 1);
      ctx.drawImage(img, i * step, 0, w, h);
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

async function init() {
  await loadPrescription();
  img.onload = () => {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    applyFilters();
  };

  distanceSelect.addEventListener("change", applyFilters);
  eyeSelect.addEventListener("change", applyFilters);
}

init().catch((err) => {
  console.error(err);
});