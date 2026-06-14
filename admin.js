const tableBody = document.getElementById("dashboardBody");
const msg = document.getElementById("dashboardMsg");

// Load cases in real-time
db.collection("cases")
  .orderBy("timestamp", "desc")
  .onSnapshot((snapshot) => {
    tableBody.innerHTML = "";

    if (snapshot.empty) {
      msg.innerHTML = "<p>No cases found.</p>";
      return;
    }

    msg.innerHTML = "<p>Cases loaded successfully.</p>";

    snapshot.forEach((doc) => {
      const data = doc.data();
      const caseId = doc.id; // IMPORTANT: your tracking ID

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${caseId}</td>
        <td>${data.name || "-"}</td>
        <td>${data.type || "-"}</td>
        <td>${data.severity || "-"}</td>
        <td>
          <select onchange="updateStatus('${caseId}', this.value)">
            <option value="Pending" ${data.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="In Progress" ${data.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Resolved" ${data.status === "Resolved" ? "selected" : ""}>Resolved</option>
          </select>
        </td>
      `;

      tableBody.appendChild(row);
    });
  });

// Update status function
function updateStatus(caseId, status) {
  db.collection("cases").doc(caseId).update({
    status: status
  })
  .then(() => {
    console.log("Updated:", caseId, status);
  })
  .catch((err) => {
    console.error("Update failed:", err);
  });
              }
