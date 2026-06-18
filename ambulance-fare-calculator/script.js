/**
 * Ambulance Fare Calculator – Logic
 * Base fare: ₹1200 for first 6 km
 * Beyond 6 km: ₹50 per additional km
 */

(function () {
  'use strict';

  // ===== Constants =====
  const BASE_FARE = 1200;
  const BASE_KM = 6;
  const RATE_PER_KM = 50;

  // ===== DOM Elements =====
  const distanceInput = document.getElementById('distance-input');
  const calculateBtn = document.getElementById('btn-calculate');
  const resetBtn = document.getElementById('btn-reset');
  const errorMessage = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  const resultsSection = document.getElementById('results');

  const outDistance = document.getElementById('out-distance');
  const outBaseFare = document.getElementById('out-base-fare');
  const outExtraKm = document.getElementById('out-extra-km');
  const outExtraCharge = document.getElementById('out-extra-charge');
  const outTotalFare = document.getElementById('out-total-fare');

  // ===== Utility Functions =====

  /**
   * Format a number as Indian Rupee currency string.
   * @param {number} amount
   * @returns {string}
   */
  function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
  }

  /**
   * Show the error message with given text.
   * @param {string} message
   */
  function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('visible');
    distanceInput.setAttribute('aria-invalid', 'true');
  }

  /**
   * Hide the error message.
   */
  function hideError() {
    errorMessage.classList.remove('visible');
    distanceInput.removeAttribute('aria-invalid');
  }

  /**
   * Show the results section with a fresh animation.
   */
  function showResults() {
    resultsSection.classList.remove('visible');
    // Force reflow to restart animation
    void resultsSection.offsetWidth;
    resultsSection.classList.add('visible');
  }

  /**
   * Hide the results section.
   */
  function hideResults() {
    resultsSection.classList.remove('visible');
  }

  /**
   * Validate user input and return distance or null.
   * @returns {number|null}
   */
  function validateInput() {
    const raw = distanceInput.value.trim();

    if (raw === '') {
      showError('Please enter the distance in kilometers.');
      return null;
    }

    const distance = parseFloat(raw);

    if (isNaN(distance)) {
      showError('Please enter a valid numeric value.');
      return null;
    }

    if (distance < 0) {
      showError('Distance cannot be negative.');
      return null;
    }

    if (distance === 0) {
      showError('Distance must be greater than zero.');
      return null;
    }

    if (distance > 99999) {
      showError('Please enter a realistic distance (max 99,999 km).');
      return null;
    }

    return distance;
  }

  /**
   * Calculate and display the fare breakdown.
   */
  function calculateFare() {
    hideError();

    const distance = validateInput();
    if (distance === null) return;

    // Fare calculation
    let extraKm = 0;
    let extraCharge = 0;
    let totalFare = BASE_FARE;

    if (distance > BASE_KM) {
      extraKm = distance - BASE_KM;
      extraCharge = extraKm * RATE_PER_KM;
      totalFare = BASE_FARE + extraCharge;
    }

    // Populate results
    outDistance.textContent = distance + ' km';
    outBaseFare.textContent = formatCurrency(BASE_FARE);
    outExtraKm.textContent = extraKm > 0 ? extraKm + ' km' : '0 km';
    outExtraCharge.textContent = extraCharge > 0 ? formatCurrency(extraCharge) : '₹0';
    outTotalFare.textContent = formatCurrency(totalFare);

    showResults();
  }

  /**
   * Reset the calculator to its initial state.
   */
  function resetCalculator() {
    distanceInput.value = '';
    hideError();
    hideResults();
    distanceInput.focus();
  }

  // ===== Event Listeners =====

  calculateBtn.addEventListener('click', calculateFare);
  resetBtn.addEventListener('click', resetCalculator);

  // Allow pressing Enter in the input field
  distanceInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculateFare();
    }
  });

  // Clear error when user starts typing
  distanceInput.addEventListener('input', function () {
    if (errorMessage.classList.contains('visible')) {
      hideError();
    }
  });

  // Prevent pasting non-numeric content
  distanceInput.addEventListener('paste', function (e) {
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    if (!/^[\d.]+$/.test(paste.trim())) {
      e.preventDefault();
      showError('Only numeric values are allowed.');
    }
  });

  // Set initial focus for better UX
  distanceInput.focus();
})();
