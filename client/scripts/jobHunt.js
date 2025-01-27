const profileList = document.getElementById("profile-list");
const applicationList = document.getElementById("applications-list");
const companiesList = document.getElementById("companies-list");
const reminderList = document.getElementById("reminder-list");
const progressList = document.getElementById("progress-list");

const profileContainer = document.getElementById("profile-container");
const applicationContainer = document.getElementById("applications-container");
const companiesContainer = document.getElementById("companies-container");
const reminderContainer = document.getElementById("reminder-container");
const progressContainer = document.getElementById("progress-container");

const token = localStorage.getItem("token");
const backendApi = `http://localhost:3000`;

profileList.addEventListener("click", () => {
  profileContainer.style.display = "flex";
  applicationContainer.style.display = "none";
  companiesContainer.style.display = "none";
  reminderContainer.style.display = "none";
  progressContainer.style.display = "none";
  showProfile();
});

companiesList.addEventListener("click", () => {
  profileContainer.style.display = "none";
  applicationContainer.style.display = "none";
  companiesContainer.style.display = "flex";
  reminderContainer.style.display = "none";
  progressContainer.style.display = "none";
});

reminderList.addEventListener("click", () => {
  profileContainer.style.display = "none";
  applicationContainer.style.display = "none";
  companiesContainer.style.display = "none";
  reminderContainer.style.display = "flex";
  progressContainer.style.display = "none";
});

async function showProfile() {
  const profileResponse = await axios.get(`${backendApi}/profile/getprofile`, {
    headers: { Authorization: token },
  });

  if (profileResponse.status == 200) {
    renderProfile(profileResponse.data);
  }
  if (profileResponse.status == 201) {
    document.getElementById(
      "profile-details"
    ).innerHtml = `<p>Update your Profile</p>`;
  }
}

document.getElementById("edit-profile-btn").addEventListener("click", () => {
  document.getElementById("edit-profile-modal").style.display = "flex";
});

document.getElementById("add-company-btn").addEventListener("click", () => {
  document.getElementById("add-company-modal").style.display = "flex";
});
document.getElementById("add-reminder-btn").addEventListener("click", () => {
  document.getElementById("add-reminder-modal").style.display = "flex";
});

document.querySelector(".close-modal").addEventListener("click", () => {
  document.getElementById("edit-profile-modal").style.display = "none";
});
document.querySelector(".close-company-modal").addEventListener("click", () => {
  document.getElementById("add-company-modal").style.display = "none";
});
document
  .querySelector(".close-reminder-modal")
  .addEventListener("click", () => {
    document.getElementById("add-reminder-modal").style.display = "none";
  });

async function renderProfile(userData) {
  console.log(userData);
  const profile = document.getElementById("profile-details");
  profile.innerHTML = "";

  const listItem = document.createElement("ul");
  listItem.classList.add("profile-item");
  listItem.innerHTML = `
                <li>Full Name: ${userData.fullName}</li>
                <li>College: ${userData.college}</li>
                <li>Degree: ${userData.degree}</li>
                <li>Branch: ${userData.branch}</li>
                <li>Graduation Year: ${userData.graduation}</li>
                <li>Academic Score: ${userData.score}</li>
                <li>Career Goals: ${userData.goals}</li>
            `;
  profile.appendChild(listItem);
}

document
  .getElementById("edit-profile")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = {
      fullName: event.target.name.value,
      college: event.target.college.value,
      degree: event.target.degree.value,
      branch: event.target.branch.value,
      graduation: event.target.graduation.value,
      goals: event.target.goals.value,
      score: event.target.score.value,
    };
    const editResponse = await axios.post(
      `${backendApi}/profile/editprofile`,
      formData,
      { headers: { Authorization: token } }
    );
    if (editResponse.status == 200) {
      alert("profile updated");

      document.getElementById("edit-profile-modal").style.display = "none";
      showProfile();
    }
  });

document
  .getElementById("add-company")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = {
      name: event.target.name.value,
      location: event.target.location.value,
      address: event.target.address.value,
      email: event.target.email.value,
      contact: event.target.contact.value,
      companySize: event.target.size.value,
      industry: event.target.industry.value,
    };
    const editResponse = await axios.post(
      `${backendApi}/company/addcompany`,
      formData,
      { headers: { Authorization: token } }
    );
    if (editResponse.status == 200) {
      alert("company added");

      document.getElementById("add-company-modal").style.display = "none";
    }
  });

document
  .getElementById("add-reminder")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = {
      name: event.target.name.value,
      application: event.target.application.value,
      due: event.target.due.value,
      reminder: event.target.reminder.value,
    };
    const editResponse = await axios.post(
      `${backendApi}/reminder/addreminder`,
      formData,
      { headers: { Authorization: token } }
    );
    if (editResponse.status == 200) {
      alert("company added");

      document.getElementById("add-reminder-modal").style.display = "none";
    }
  });
