// ============================================================
// report.js
// Handles the citizen complaint submission form.
// Writes a new document into the "cases" Firestore collection,
// including the selected risk level (severity) and a generated
// Case ID, then displays that Case ID to the user.
// ============================================================

// Generates a unique Case ID, e.g. CASE-1718300000000
function generateCaseId(){
  return "CASE-" + Date.now();
}

const form = document.getElementById('distressForm');
const errorBox = document.getElementById('formError');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async function(e){
  e.preventDefault();
  errorBox.style.display = 'none';

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const type = document.getElementById('type').value;
  const description = document.getElementById('desc').value.trim();
  const severity = document.getElementById('severity').value;

  if(!severity){
    errorBox.textContent = 'Please select a risk level.';
    errorBox.style.display = 'block';
    return;
  }

  // Step 1: Generate ID
  const caseId = generateCaseId();

  // Step 2: Save it in database
  const caseData = {
    caseId: caseId,
    name: name,
    phone: phone || null,
    type: type,
    description: description,
    severity: severity,
    status: "Pending",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    await db.collection("cases").doc(caseId).set(caseData);

    // Step 3: Show it to user
    document.getElementById('output').innerText = "Your Case ID: " + caseId;

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
