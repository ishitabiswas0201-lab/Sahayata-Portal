const allSteps = ["received", "under review", "resolved"];

const stepLabels = {
  received: "Your complaint has been received and registered in the system.",
  "under review": "Your case is currently being reviewed by an officer.",
  resolved: "Your case has been resolved and closed."
};

const trackCaseIdInput = document.getElementById('trackCaseId');
const checkBtn = document.getElementById('checkBtn');
const trackMsg = document.getElementById('trackMsg');
const trackResult = document.getElementById('trackResult');

async function checkStatus() {
  const id = trackCaseIdInput.value.trim();

  trackResult.style.display = 'none';
  trackMsg.innerHTML = '';

  if (!id) {
    trackMsg.innerHTML = '<p class="error-text">Please enter a Case ID.</p>';
    return;
  }

  trackMsg.innerHTML = '<p class="loading-text">Looking up case...</p>';
  checkBtn.disabled = true;

  try {
    const docSnap = await db.collection("cases").doc(id).get();

    if (!docSnap.exists) {
      trackMsg.innerHTML = '<p class="error-text">No case found.</p>';
      return;
    }

    const data = docSnap.data();

    trackMsg.innerHTML = '';

    document.getElementById('resCaseId').textContent = data.caseId || id;
    document.getElementById('resName').textContent = data.name || '—';
    document.getElementById('resType').textContent = data.type || '—';
    document.getElementById('resSeverity').textContent = data.severity || '—';

    // IMPORTANT FIX: normalize status
    const status = (data.status || 'received').toLowerCase().trim();

    document.getElementById('resStatus').textContent = status;

    const timeline = document.getElementById('resTimeline');
    timeline.innerHTML = '';

    const currentIndex = allSteps.indexOf(status);

    allSteps.forEach((step, idx) => {
      const completed = currentIndex !== -1 && idx <= currentIndex;

      const div = document.createElement('div');
      div.className = 'timeline-item' + (completed ? '' : ' pending');

      div.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h4>${step}</h4>
          <p>${stepLabels[step]}</p>
        </div>
      `;

      timeline.appendChild(div);
    });

    trackResult.style.display = 'block';

  } catch (err) {
    console.error(err);
    trackMsg.innerHTML = '<p class="error-text">Firebase error while fetching case.</p>';
  } finally {
    checkBtn.disabled = false;
  }
}

checkBtn.addEventListener('click', checkStatus);

trackCaseIdInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkStatus();
});

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get('caseId');

  if (caseId) {
    trackCaseIdInput.value = caseId;
    checkStatus();
  }
});
