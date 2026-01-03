//Select Elements
const form = document.getElementById("applicationForm");
const applicationsList = document.getElementById("applicationsList");
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const dateInput = document.getElementById("date");
const statusInput = document.getElementById("status");
const notesInput = document.getElementById("notes");

//LocalStorage
function saveToLocalStorage() {
  localStorage.setItem("applications", JSON.stringify(applications));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("applications");
  return data ? JSON.parse(data) : [];
}



let applications = loadFromLocalStorage();
renderApplications(applications);


//Handling form submit-------------
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const application = {
    id: Date.now(),
    company: companyInput.value.trim(),
    role: roleInput.value.trim(),
    date: dateInput.value,
    status: statusInput.value,
    notes: notesInput.value.trim()
  };

  if (!application.company || !application.role || !application.date) {
    return;
  }

  applications.push(application);
  saveToLocalStorage();
  renderApplications(applications);
  form.reset();
});

//Rendering--------------
function renderApplications(list) {
  applicationsList.innerHTML = "";

  if (list.length === 0) {
    applicationsList.innerHTML = `
      <p class="empty-state">No applications added yet</p>
    `;
    return;
  }

  list.forEach(function (app) {
    const card = document.createElement("div");
    card.className = "application-card";

    card.innerHTML = `
        <h3>${app.company}</h3>
        <p><strong>Role:</strong> ${app.role}</p>
        <p><strong>Date:</strong> ${app.date}</p>

        <div class="card-controls">
            <select class="status-select" data-id="${app.id}">
            <option value="Applied" ${app.status === "Applied" ? "selected" : ""}>Applied</option>
            <option value="Interview" ${app.status === "Interview" ? "selected" : ""}>Interview</option>
            <option value="Rejected" ${app.status === "Rejected" ? "selected" : ""}>Rejected</option>
            <option value="Offer" ${app.status === "Offer" ? "selected" : ""}>Offer</option>
            </select>

            <button class="delete-btn" data-id="${app.id}">Delete</button>
        </div>
`;


    applicationsList.appendChild(card);
  });
}

applicationsList.addEventListener("change", function (event) {
  if (event.target.classList.contains("status-select")) {
    const id = Number(event.target.dataset.id);
    const newStatus = event.target.value;

    applications = applications.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    );

    saveToLocalStorage();
    renderApplications(applications);
  }
});
//DELETE-----------------
applicationsList.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const id = Number(event.target.dataset.id);

    applications = applications.filter(app => app.id !== id);
    saveToLocalStorage();
    renderApplications(applications);

  }
});

const filterSelect = document.getElementById("filterStatus");

filterSelect.addEventListener("change", function () {
  const value = filterSelect.value;

  if (value === "All") {
    renderApplications(applications);
  } else {
    const filtered = applications.filter(app => app.status === value);
    renderApplications(filtered);
  }
});


