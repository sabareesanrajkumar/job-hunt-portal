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
  showCompanies();
});

reminderList.addEventListener("click", () => {
  profileContainer.style.display = "none";
  applicationContainer.style.display = "none";
  companiesContainer.style.display = "none";
  reminderContainer.style.display = "flex";
  progressContainer.style.display = "none";
  showReminders();
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

async function showCompanies() {
  const companyResponse = await axios.get(
    `${backendApi}/company/getcompanies`,
    {
      headers: { Authorization: token },
    }
  );

  if (companyResponse.status == 200) {
    renderCompanies(companyResponse.data.allCompanies);
  }
  if (companyResponse.status == 201) {
    document.getElementById(
      "Company-details"
    ).innerHtml = `<p>No companies added</p>`;
  }
}

async function showReminders() {
  const reminderResponse = await axios.get(
    `${backendApi}/reminder/getreminders`,
    {
      headers: { Authorization: token },
    }
  );

  if (reminderResponse.status == 200) {
    renderReminders(reminderResponse.data.userReminders);
  }
  if (reminderResponse.status == 201) {
    document.getElementById(
      "reminder-details"
    ).innerHtml = `<p>No pending reminders</p>`;
  }
}

document.getElementById("edit-profile-btn").addEventListener("click", () => {
  document.getElementById("edit-profile-modal").style.display = "flex";
  checkExistingProfile();
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

function renderProfile(userData) {
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

function renderCompanies(companies) {
  const companyDetails = document.getElementById("Company-details");
  companyDetails.innerHTML = "";

  companies.forEach((company) => {
    const companyCard = document.createElement("div");
    companyCard.classList.add("company-card");

    companyCard.innerHTML = `
      <h3>${company.name}</h3>
      <p><strong>Location:</strong> ${company.location}</p>
      <p><strong>Address:</strong> ${company.address}</p>
      <p><strong>Email:</strong> <a href="mailto:${company.email}">${company.email}</a></p>
      <p><strong>Contact:</strong> ${company.contact}</p>
      <p><strong>Company Size:</strong> ${company.companySize}</p>
      <p><strong>Industry:</strong> ${company.industry}</p>
      <button class="delete-btn">Delete</button>
    `;
    companyCard
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteCompany(company.id));

    companyDetails.appendChild(companyCard);
  });
}

async function deleteCompany(id) {
  try {
    const response = await axios.delete(`${backendApi}/company/delete/${id}`, {
      headers: { Authorization: token },
    });
    console.log(response);
    if (response.status == 200) {
      alert("company deleted successfully!");
      showCompanies();
    }
  } catch (error) {
    console.error("Error updating application:", error);
  }
}

function renderReminders(reminders) {
  const reminderDetails = document.getElementById("reminder-details");
  reminderDetails.innerHTML = "";
  reminders.forEach((reminder) => {
    const reminderItem = document.createElement("div");
    reminderItem.classList.add("reminder-item");

    reminderItem.innerHTML = `
      <p><strong>Company:</strong> ${reminder.name}</p>
      <p><strong>Due:</strong> ${reminder.due}</p>
      <p><strong>Application:</strong> ${reminder.application}</p>
    `;

    reminderDetails.appendChild(reminderItem);
  });
}

async function checkExistingProfile() {
  const existingProfile = await axios.get(`${backendApi}/profile/check`, {
    headers: { Authorization: token },
  });
  if (existingProfile.status == 200) {
    const user = existingProfile.data.userProfile;
    const formElement = document.getElementById("edit-profile");
    formElement.name.value = user.fullName;
    formElement.college.value = user.college;
    formElement.degree.value = user.degree;
    formElement.branch.value = user.branch;
    formElement.graduation.value = user.graduation;
    formElement.goals.value = user.goals;
    formElement.score.value = user.score;
  }
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
    showCompanies();
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
    showReminders();
  });
