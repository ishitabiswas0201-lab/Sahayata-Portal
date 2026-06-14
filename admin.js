const dashboardBody = document.getElementById('dashboardBody');
const dashboardMsg = document.getElementById('dashboardMsg');

const STATUS_OPTIONS = ["received", "under review", "resolved"];

function loadCases() {
  dashboardMsg.innerHTML = '<p class="loading-text">Loading cases...</p>';
  dashboardBody.innerHTML = '';

  db.collection("cases")
    .get()
    .then(snapshot => {

      if (snapshot.empty) {
        dashboardMsg.innerHTML = '<p class="note">No cases found</p>';
        return;
      }

      dashboardMsg.innerHTML = '';

      const docs = [];

      snapshot.forEach(doc => {
        docs.push({ id: doc.id, data: doc.data() });
      });

      // Sort manually (FIX for Date.now issue)
      docs.sort((a, b) => (b.data.timestamp || 0) - (a.data.timestamp || 0));

      docs.forEach(item => {
        renderRow(item.id, item.data);
      });

    })
    .catch(err => {
      console.error("Load error:", err);
      dashboardMsg.innerHTML =
        '<p class="error-text">Failed to load cases. Check Firebase rules/config.</p>';
    });
}

function renderRow(docId, data) {
  const severity = (data.severity || 'low').toLowerCase();
  const status = (data.status || 'received').toLowerCase();
  const isHigh = severity === 'high';

  const tr = document.createElement('tr');
  if (isHigh) tr.classList.add('urgent-row');

  tr.innerHTML = `
    <td>${data.caseId || docId}</td>
    <td>${escapeHtml(data.name || '—')}</td>
    <td>${escapeHtml(data.type || '—')}</td>
    <td>${severity}</td>
    <td>
      <select data-id="${docId}">
        ${STATUS_OPTIONS.map(opt =>
          `<option value="${opt}" ${opt === status ? 'selected' : ''}>${opt}</option>`
        ).join('')}
      </select>
    </td>
  `;

  dashboardBody.appendChild(tr);

  const select = tr.querySelector('select');

  select.addEventListener('change', async (e) => {
    const newStatus = e.target.value;
    select.disabled = true;

    try {
      await db.collection("cases").doc(docId).update({
        status: newStatus
      });
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      select.disabled = false;
    }
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

loadCases();
