// ============================================================
// report.js
// Handles the citizen complaint submission form.
// Writes a new document into the "cases" Firestore collection.
// ============================================================

let selectedSeverity = '';

// Severity selector
document.querySelectorAll('.severity-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.severity-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    selectedSeverity = opt.dataset.value;
  });
});

// Generates a human-readable unique Case ID, e.g. NDRP-2026-483920
function generateCaseId(){
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `NDRP-${year}-${random}`;
}

const form = document.getElementById('distressForm');
const errorBox = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async function(e){
  e.preventDefault();
  errorBox.style.display = 'none';

  if(!selectedSeverity){
    errorBox.textContent = 'Please select a severity level.';
    errorBox.style.display = 'block';
    return;
  }

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const type = document.getElementById('type').value;
  const description = document.getElementById('description').value.trim();

  const caseId = generateCaseId();

  const caseData = {
    caseId: caseId,
    name: name,
    phone: phone || null,
    type: type,
    description: description,
    severity: selectedSeverity,
    status: "received",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    // Use the generated caseId as the document ID for easy lookup
    await db.collection("cases").doc(caseId).set(caseData);

    // Show success state
    document.getElementById('generatedCaseId').textContent = caseId;
    document.getElementById('reportFormCard').style.display = 'none';
    document.getElementById('successCard').style.display = 'block';

    // Pre-fill the track link with the case ID as a query param
    document.getElementById('trackLink').href = `track.html?caseId=${encodeURIComponent(caseId)}`;

  } catch (err) {
    console.error("Error submitting complaint:", err);
    errorBox.textContent = "Something went wrong while submitting your complaint. Please check your Firebase configuration and try again.";
    errorBox.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Complaint";
  }
});
