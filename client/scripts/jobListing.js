{
  const token = localStorage.getItem("token");
  const backendApi = `http://localhost:3000`;
  const companiesList = document.getElementById("companies-list");

  document.getElementById("add-job-btn").addEventListener("click", () => {
    document.getElementById("add-job-modal").style.display = "flex";
  });

  document.querySelector(".close-job-modal").addEventListener("click", () => {
    document.getElementById("add-job-modal").style.display = "none";
  });

  companiesList.addEventListener("click", () => {
    showJobListings();
  });

  const jobListingForm = document.getElementById("add-job");
  jobListingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const jobData = {
      jobTitle: event.target.jobTitle.value,
      company: event.target.company.value,
      description: event.target.description.value,
      requiredSkills: event.target.requiredSkills.value,
      jobType: event.target.jobType.value,
      salary: event.target.salary.value,
      deadline: event.target.deadline.value,
    };
    const addJobResponse = await axios.post(
      `${backendApi}/joblisting/addjob`,
      jobData,
      {
        headers: { Authorization: token },
      }
    );
    if (addJobResponse.status == 200) {
      alert("Job added");

      document.getElementById("add-job-modal").style.display = "none";
    }
    showJobListings();
  });
}

async function showJobListings() {
  const response = await axios.get(`${backendApi}/joblisting/getjoblisting`, {
    headers: { Authorization: token },
  });
  if (response.data) {
    renderJobListings(response.data.jobListings);
  }
  if (response.status == 201) {
    document.getElementById("Job-details").innerHtml = `<p>No jobs added</p>`;
  }
}

function renderJobListings(data) {
  const jobDetails = document.getElementById("Job-details");
  jobDetails.innerHTML = "";

  data.forEach((job) => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("job-card");

    jobCard.innerHTML = `
      <h3>${job.jobTitle}</h3>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Description:</strong> ${job.description}</p>
      <p><strong>Required Skills:</strong>${job.requiredSkills}</a></p>
      <p><strong>Job Type:</strong> ${job.jobType}</p>
      <p><strong>Salary Range:</strong> ${job.salary}</p>
      <p><strong>Deadline:</strong> ${job.deadline}</p>
      <button class="delete-btn">Delete</button>
    `;
    jobCard
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteJob(job.id));

    jobDetails.appendChild(jobCard);
  });
}

async function deleteJob(id) {
  try {
    const response = await axios.delete(
      `${backendApi}/joblisting/delete/${id}`,
      {
        headers: { Authorization: token },
      }
    );
    if (response.status == 200) {
      alert("job deleted successfully!");
      showJobListings();
    }
  } catch (error) {
    console.error("Error updating application:", error);
  }
}
