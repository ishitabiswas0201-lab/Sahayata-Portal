// ============================================================
// admin.js
// Loads all cases from Firestore, renders them in a table,
// and lets the admin update each case's status.
// HIGH severity cases are highlighted as urgent.
// ============================================================

const dashboardBody = document.getElementById('dashboardBody');
const dashboardMsg = document.getElementById('dashboardMsg');

const STATUS_OPTIONS = ["received", "under review", "resolved"];

async function loadCases(){
  dashboardMsg.innerHTML = '<p class="loading-text">Loading cases...</p>';
  dashboardBody.innerHTML = '';

  try {
    // Order by timestamp descending (most recent first)
    const snapshot = await db.collection("cases")
      .orderBy("timestamp", "desc")
      .get();

    if(snapshot.empty){
      dashboardMsg.innerHTML = '<p class="note">No cases have been submitted yet.</p>';
      return;
    }

    dashboardMsg.innerHTML = '';

    snapshot.forEach(doc => {
      const data = doc.data();
      renderRow(doc.id, data);
    });

  } catch (err) {
    console.error("Error loading cases:", err);
    dashboardMsg.innerHTML = '<p class="error-text">Could not load cases. Please check your Firebase configuration. ' +
      'If you just created the Firestore database, make sure security rules allow read access, and that ' +
      'an index exists for ordering by "timestamp" (Firestore will prompt you with a link to create it if needed).</p>';
  }
}

function renderRow(docId, data){
  const severity = (data.severity || 'low').toLowerCase();
  const status = (data.status || 'received').toLowerCase();
  const isHigh = severity === 'high';

  const tr = document.createElement('tr');
  if(isHigh) tr.classList.add('urgent-row');

  const severityCell = `
    <span class="badge ${severity}">${severity}</span>
    ${isHigh ? '<span class="urgent-tag">URGENT REVIEW REQUIRED</span>' : ''}
  `;

  const statusCell = `
    <select class="status-select" data-doc-id="${docId}">
      ${STATUS_OPTIONS.map(opt =>
        `<option value="${opt}" ${opt === status ? 'selected' : ''}>${opt}</option>`
      ).join('')}
    </select>
  `;

  tr.innerHTML = `
    <td>${data.caseId || docId}</td>
    <td>${escapeHtml(data.name || '—')}</td>
    <td style="text-transform:capitalize;">${escapeHtml(data.type || '—')}</td>
    <td>${severityCell}</td>
    <td>${statusCell}</td>
  `;

  dashboardBody.appendChild(tr);

  // Attach change listener for status update
  const select = tr.querySelector('.status-select');
  select.addEventListener('change', async (e) => {
    const newStatus = e.target.value;
    await updateStatus(docId, newStatus, select);
  });
}

async function updateStatus(docId, newStatus, selectEl){
  selectEl.disabled = true;
  try {
    await db.collection("cases").doc(docId).update({
      status: newStatus
    });
  } catch (err) {
    console.error("Error updating status:", err);
    alert("Failed to update status. Please check your Firebase configuration and try again.");
  } finally {
    selectEl.disabled = false;
  }
}

// Basic HTML escaping to avoid breaking table markup with user input
function escapeHtml(str){
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

loadCases();
