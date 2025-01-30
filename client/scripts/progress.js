{
  const token = localStorage.getItem("token");
  const backendApi = `http://localhost:3000`;

  const progressList = document.getElementById("progress-list");

  const profileContainer = document.getElementById("profile-container");
  const applicationContainer = document.getElementById(
    "applications-container"
  );
  const companiesContainer = document.getElementById("companies-container");
  const reminderContainer = document.getElementById("reminder-container");
  const progressContainer = document.getElementById("progress-container");

  progressList.addEventListener("click", () => {
    profileContainer.style.display = "none";
    applicationContainer.style.display = "none";
    companiesContainer.style.display = "none";
    reminderContainer.style.display = "none";
    progressContainer.style.display = "flex";
    getDashboard();
  });

  async function getDashboard() {
    try {
      const response = await axios.get(`${backendApi}/progress/getdashboard`, {
        headers: { Authorization: token },
      });

      const data = response.data;
      document.getElementById("totalApplications").textContent =
        data.totalApplications;
      document.getElementById("inProgressApplications").textContent =
        data.inProgressApplications;

      const canvas = document.getElementById("applicationsChart");
      const ctx = canvas.getContext("2d");

      if (window.applicationsChart instanceof Chart) {
        window.applicationsChart.destroy();
        window.applicationsChart = null;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      window.applicationsChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: [
            "Applied",
            "Interview Scheduled",
            "Offer Received",
            "Rejected",
          ],
          datasets: [
            {
              data: [
                data.statusData["Applied"] || 0,
                data.statusData["Interview Scheduled"] || 0,
                data.statusData["Offer Received"] || 0,
                data.statusData["Rejected"] || 0,
              ],
              backgroundColor: ["#007bff", "#ffc107", "#28a745", "#dc3545"],
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }
}
