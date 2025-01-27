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
  });

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await axios.get(`${backendApi}/progress/dashboard`);
      //const data = await response.json();

      data = {
        upcomingInterviews: [
          { company: "google", interviewDate: "20/05/2025" },
          { company: "ms", interviewDate: "20/02/2025" },
        ],
      };
      document.getElementById("totalApplications").textContent =
        data.totalApplications;
      document.getElementById("inProgressApplications").textContent =
        data.inProgressApplications;

      const ctx = document.getElementById("applicationsChart").getContext("2d");
      new Chart(ctx, {
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
              data: [],
              backgroundColor: ["#007bff", "#ffc107", "#28a745", "#dc3545"],
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  });
}
