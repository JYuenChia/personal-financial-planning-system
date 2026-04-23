// Initialize variables
const HISTORY_KEY = "roiCalculationHistory";
const saveBtn = document.getElementById("saveBtn");
const saveForm = document.getElementById("saveForm");
const calcTitleInput = document.getElementById("calcTitle");
const historyBody = document.getElementById("historyBody");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const roiForm = document.getElementById("roiForm");
const saveModal = new bootstrap.Modal(document.getElementById("saveModal"));
let latestCalculation = null;

// Handle navbar auth state
/*
function checkAuthState() {
  const token = localStorage.getItem('token');
  const authOnlyElements = document.querySelectorAll('.auth-only');
  const guestOnlyElements = document.querySelectorAll('.guest-only');

  if (token) {
    authOnlyElements.forEach(el => el.style.display = 'block');
    guestOnlyElements.forEach(el => el.style.display = 'none');
  } else {
    authOnlyElements.forEach(el => el.style.display = 'none');
    guestOnlyElements.forEach(el => el.style.display = 'block');
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', checkAuthState);
*/

// Read calculation history from localStorage
function readHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

// Write calculation history to localStorage
function writeHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// Render history table
function renderHistory() {
  const history = readHistory();

  if (!history.length) {
    historyBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-muted text-center">No saved calculations yet.</td>
      </tr>
    `;
    return;
  }

  historyBody.innerHTML = history
    .map(item => `
      <tr>
        <td>${item.title}</td>
        <td>${Number(item.initial).toFixed(2)}</td>
        <td>${Number(item.ratePercent).toFixed(2)}</td>
        <td>${Number(item.years).toFixed(2)}</td>
        <td>${Number(item.finalAmount).toFixed(2)}</td>
        <td>${Number(item.roi).toFixed(2)}</td>
      </tr>
    `)
    .join("");
}

// Handle ROI form submission
roiForm.addEventListener("submit", function(e) {
  e.preventDefault();

  let initial = parseFloat(document.getElementById("initial").value);
  let rate = parseFloat(document.getElementById("rate").value) / 100;
  let years = parseFloat(document.getElementById("years").value);

  // Validation
  if (initial <= 0 || rate <= 0 || years <= 0) {
    alert("Please enter valid positive values!");
    return;
  }

  // Calculation
  let finalAmount = initial * Math.pow((1 + rate), years);
  let roi = finalAmount - initial;

  let resultDiv = document.getElementById("result");
  resultDiv.classList.remove("d-none");

  resultDiv.innerHTML = `
    <strong>Final Amount:</strong> RM ${finalAmount.toFixed(2)} <br>
    <strong>Profit (ROI):</strong> RM ${roi.toFixed(2)}
  `;

  latestCalculation = {
    initial,
    ratePercent: rate * 100,
    years,
    finalAmount,
    roi
  };

  saveBtn.disabled = false;
});

// Handle save button click
saveBtn.addEventListener("click", function() {
  if (!latestCalculation) {
    alert("Please calculate first before saving.");
    return;
  }

  calcTitleInput.value = "";
  saveModal.show();
});

// Handle save form submission
saveForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const title = calcTitleInput.value.trim();

  if (!title) {
    alert("Please enter a title.");
    return;
  }

  const history = readHistory();
  history.unshift({
    title,
    ...latestCalculation
  });

  writeHistory(history);
  renderHistory();
  saveModal.hide();
});

// Handle form reset
roiForm.addEventListener("reset", function() {
  latestCalculation = null;
  saveBtn.disabled = true;
  document.getElementById("result").classList.add("d-none");
});

// Handle clear history button
clearHistoryBtn.addEventListener("click", function() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
  renderHistory();
});
