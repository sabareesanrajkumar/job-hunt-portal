{
  const token = localStorage.getItem("token");
  const backendApi = `http://localhost:3000`;

  const applicationList = document.getElementById("applications-list");

  const profileContainer = document.getElementById("profile-container");
  const applicationContainer = document.getElementById(
    "applications-container"
  );
  const companiesContainer = document.getElementById("companies-container");
  const reminderContainer = document.getElementById("reminder-container");
  const progressContainer = document.getElementById("progress-container");

  applicationList.addEventListener("click", () => {
    profileContainer.style.display = "none";
    applicationContainer.style.display = "flex";
    companiesContainer.style.display = "none";
    reminderContainer.style.display = "none";
    progressContainer.style.display = "none";
    showApplications();
  });

  document
    .getElementById("add-application-btn")
    .addEventListener("click", () => {
      document.getElementById("add-application-modal").style.display = "flex";
    });

  document
    .querySelector(".close-application-modal")
    .addEventListener("click", () => {
      document.getElementById("add-application-modal").style.display = "none";
    });

  async function showApplications() {
    const response = await axios.get(
      `${backendApi}/application/getapplication`,
      { headers: { Authorization: token } }
    );
    if (response.data) {
      localStorage.setItem(
        "applications",
        JSON.stringify(response.data.applications)
      );
      renderApplications(response.data);
    }
  }

  function renderApplications(data) {
    const applicationRecord = document.getElementById("applicationsList");
    applicationRecord.innerHTML = "";

    data.applications.forEach((app) => {
      const appDiv = document.createElement("div");
      appDiv.classList.add("application-card");
      appDiv.dataset.id = app.id;

      appDiv.innerHTML = `
      <h4>${app.jobTitle} at ${app.company}</h4>
      <p>Date Applied: ${new Date(app.dateApplied).toLocaleDateString()}</p>

      <label>Status:</label>
      <select class="status-dropdown">
        <option value="Applied" ${
          app.status === "Applied" ? "selected" : ""
        }>Applied</option>
        <option value="Interview Scheduled" ${
          app.status === "Interview Scheduled" ? "selected" : ""
        }>Interview Scheduled</option>
        <option value="Offer Received" ${
          app.status === "Offer Received" ? "selected" : ""
        }>Offer Received</option>
        <option value="Rejected" ${
          app.status === "Rejected" ? "selected" : ""
        }>Rejected</option>
      </select>

      <label>Notes:</label>
      <textarea class="notes-field">${app.notes || ""}</textarea>

      <label>Attachments:</label>
      <input type="file" class="attachments-input" multiple>

      <button class="update-btn">Update</button>
      <button class="delete-btn">Delete</button>
    `;
      appDiv
        .querySelector(".update-btn")
        .addEventListener("click", () => updateApplication(app.id, appDiv));
      appDiv
        .querySelector(".delete-btn")
        .addEventListener("click", () => deleteApplication(app.id));

      applicationRecord.appendChild(appDiv);
    });
  }

  async function updateApplication(id, appDiv) {
    const status = appDiv.querySelector(".status-dropdown").value;
    const notes = appDiv.querySelector(".notes-field").value;

    try {
      const response = await axios.put(
        `${backendApi}/application/update/${id}`,
        { status, notes },
        { headers: { Authorization: token } }
      );
      console.log(response);
      if (response.status == 200) {
        alert("Application updated successfully!");
        showApplications();
      }
    } catch (error) {
      console.error("Error updating application:", error);
    }
  }

  async function deleteApplication(id) {
    try {
      const response = await axios.delete(
        `${backendApi}/application/delete/${id}`,
        { headers: { Authorization: token } }
      );
      console.log(response);
      if (response.status == 200) {
        alert("Application deleted successfully!");
        showApplications();
      }
    } catch (error) {
      console.error("Error updating application:", error);
    }
  }

  document
    .getElementById("add-application")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = {
        jobTitle: event.target.jobTitle.value,
        company: event.target.companyName.value,
        dateApplied: event.target.dateApplied.value,
        status: event.target.status.value,
        notes: event.target.notes.value,
      };
      const addResponse = await axios.post(
        `${backendApi}/application/addapplication`,
        formData,
        { headers: { Authorization: token } }
      );
      if (addResponse.status == 200) {
        alert("application added!");

        document.getElementById("add-application-modal").style.display = "none";
        showApplications();
      }
    });
}

document.getElementById("search-button").addEventListener("click", async () => {
  const keyword = document.getElementById("search-keyword").value;
  const searchResponse = await axios.post(
    `${backendApi}/application/search`,
    { keyword },
    { headers: { Authorization: token } }
  );
  if (searchResponse.status == 201) {
    alert(`No application found`);
  }
  if (searchResponse.status === 200) {
    renderApplications(searchResponse.data);
  }
});

document.getElementById("filter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const startDate = new Date(document.getElementById("start-date").value);
  const status = document.getElementById("status").value;
  const applications = JSON.parse(localStorage.getItem("applications"));

  let dateFilters = [];
  if (startDate != "Invalid Date") {
    dateFilters = applications.filter((app) => {
      const appDate = new Date(app.dateApplied);
      return appDate >= startDate;
    });
  }
  let statusFilters = [];
  if (status != "select status") {
    statusFilters = applications.filter((app) => {
      const appStatus = app.status;
      return appStatus == status;
    });
  }

  const sendResponse = {
    applications: [...new Set([...dateFilters, ...statusFilters])],
  };
  renderApplications(sendResponse);
});
