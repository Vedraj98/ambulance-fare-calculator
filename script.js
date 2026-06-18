/**
 * Ambulance Fare Calculator
 * script.js
 */

'use strict';

// ── DOM References ──────────────────────────────────────────────
const distanceInput  = document.getElementById('distance-input');
const errorMsg       = document.getElementById('error-msg');
const errorText      = document.getElementById('error-text');
const calculateBtn   = document.getElementById('btn-calcualte');
const resetBtn       = document.getElementById('btn-reset');
const resultSection  = document.getElementById('result-section');

// Output fields
const outDistance    = document.getElementById('out-distance');
const outBaseFare    = document.getElementById('out-base-fare');
const outExtraKm     = document.getElementById('out-extra-km');
const outExtraCharge = document.getElementById('out-extra-charge');
const outTotal       = document.getElementById('out-total');

// ── Pricing Constants ───────────────────────────────────────────
const BASE_FARE       = 1200;   // ₹1200 for first 6 km
const BASE_KM         = 6;      // included km in base fare
const RATE_PER_KM     = 50;     // ₹50 per km beyond base

// ── Utility: Format Indian Rupees ───────────────────────────────
function formatRupees(amount) {
  return amount.toLocaleString('en-IN');
}

// ── Fare Calculation Logic ──────────────────────────────────────
function calculateFare(distanceKm) {
  const distance   = parseFloat(distanceKm);
  const baseFare   = BASE_FARE;

  let extraKm      = 0;
  let extraCharge  = 0;
  let totalFare    = baseFare;

  if (distance > BASE_KM) {
    extraKm     = parseFloat((distance - BASE_KM).toFixed(2));
    extraCharge = extraKm * RATE_PER_KM;
    totalFare   = baseFare + extraCharge;
  }

  return { distance, baseFare, extraKm, extraCharge, totalFare };
}

// ── Validation ──────────────────────────────────────────────────
function validateInput(value) {
  const trimmed = value.trim();

  if (trimmed === '' || trimmed === null) {
    return { valid: false, message: 'Please enter a distance to calculate the fare.' };
  }

  const num = parseFloat(trimmed);

  if (isNaN(num)) {
    return { valid: false, message: 'Invalid input. Please enter a numeric value.' };
  }

  if (num < 0) {
    return { valid: false, message: 'Distance cannot be negative. Please enter a valid value.' };
  }

  if (num === 0) {
    return { valid: false, message: 'Distance must be greater than 0 km.' };
  }

  if (num > 5000) {
    return { valid: false, message: 'Distance seems unusually large. Please enter a realistic value (≤ 5000 km).' };
  }

  return { valid: true };
}

// ── Show Error ──────────────────────────────────────────────────
function showError(message) {
  errorText.textContent = message;
  errorMsg.classList.add('visible');
  distanceInput.classList.add('input-error');
  distanceInput.classList.remove('input-valid');
}

// ── Clear Error ─────────────────────────────────────────────────
function clearError() {
  errorMsg.classList.remove('visible');
  distanceInput.classList.remove('input-error');
}

// ── Animate Counter ─────────────────────────────────────────────
function animateCounter(element, targetValue, prefix = '₹', suffix = '') {
  const duration = 700;
  const start    = performance.now();
  const startVal = 0;

  function step(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(startVal + (targetValue - startVal) * eased);

    element.textContent = prefix + formatRupees(current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = prefix + formatRupees(targetValue) + suffix;
    }
  }

  requestAnimationFrame(step);
}

// ── Display Results ─────────────────────────────────────────────
function displayResults(result) {
  const { distance, baseFare, extraKm, extraCharge, totalFare } = result;

  // Show section first (needed before animating)
  resultSection.classList.add('visible');

  // Populate text fields
  outDistance.textContent    = `${distance} km`;
  outBaseFare.textContent    = `₹${formatRupees(baseFare)}`;
  outExtraKm.textContent     = extraKm > 0 ? `${extraKm} km` : '—';
  outExtraCharge.textContent = extraCharge > 0 ? `₹${formatRupees(extraCharge)}` : '₹0';

  // Animate total fare counter
  const totalAmountEl = document.getElementById('total-amount-value');
  animateCounter(totalAmountEl, totalFare, '', '');

  // Scroll to result
  setTimeout(() => {
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// ── Calculate Button Handler ─────────────────────────────────────
function handleCalculate() {
  const value      = distanceInput.value;
  const validation = validateInput(value);

  if (!validation.valid) {
    showError(validation.message);
    hideResult();
    return;
  }

  clearError();
  distanceInput.classList.add('input-valid');

  const result = calculateFare(parseFloat(value));

  // Brief button feedback
  calculateBtn.textContent = '✓ Calculating…';
  calculateBtn.disabled    = true;

  setTimeout(() => {
    calculateBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> Calculate Fare`;
    calculateBtn.disabled = false;
    displayResults(result);
  }, 400);
}

// ── Hide Result ─────────────────────────────────────────────────
function hideResult() {
  resultSection.classList.remove('visible');
}

// ── Reset Handler ───────────────────────────────────────────────
function handleReset() {
  distanceInput.value = '';
  distanceInput.classList.remove('input-error', 'input-valid');
  clearError();
  hideResult();
  distanceInput.focus();

  // Spin icon on reset
  resetBtn.style.transform = 'rotate(360deg)';
  setTimeout(() => { resetBtn.style.transform = ''; }, 400);
}

// ── Live Validation on Input ────────────────────────────────────
distanceInput.addEventListener('input', () => {
  if (errorMsg.classList.contains('visible')) {
    clearError();
  }
  if (distanceInput.classList.contains('input-valid')) {
    distanceInput.classList.remove('input-valid');
  }
});

// ── Prevent Negative via keyboard ──────────────────────────────
distanceInput.addEventListener('keydown', (e) => {
  if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
    e.preventDefault();
  }
  if (e.key === 'Enter') {
    handleCalculate();
  }
});

// ── Button Events ───────────────────────────────────────────────
calculateBtn.addEventListener('click', handleCalculate);
resetBtn.addEventListener('click', handleReset);

// ── Init ────────────────────────────────────────────────────────
distanceInput.focus();
