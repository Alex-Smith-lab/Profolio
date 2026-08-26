/* =========================================================
   PROFOLIO APP
   Professional Career / Portfolio Manager
========================================================= */


/* =========================================================
   DATABASE
========================================================= */

const STORAGE_KEY = "profolio_v1";


const defaultData = {

  profile: {

    fullName: "",
    email: "",
    phone: "",
    location: "",
    professionalTitle: "",
    summary: "",
    linkedin: "",
    github: "",
    website: "",
    industries: "",
    photo: ""

  },

  skills: [],

  projects: [],

  evidence: [],

  goals: [],

  events: [],

  transactions: [],

  theme: "light"

};


let data = loadData();


function loadData() {

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {

      return structuredClone(defaultData);

    }

    return {
      ...structuredClone(defaultData),
      ...JSON.parse(saved)
    };

  } catch (error) {

    console.error(error);

    return structuredClone(defaultData);

  }

}


function saveData() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

  updateDashboard();

}


/* =========================================================
   HELPERS
========================================================= */

function $(id) {

  return document.getElementById(id);

}


function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");

}


function showToast(message) {

  const container = $("toastContainer");

  const toast = document.createElement("div");

  toast.className = "toast";

  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {

    toast.remove();

  }, 2800);

}


function uid(prefix = "item") {

  return prefix + "_" + Date.now() + "_" +
    Math.random().toString(36).slice(2, 8);

}


function formatMoney(number) {

  return new Intl.NumberFormat(
    "en-KE",
    {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0
    }
  ).format(Number(number) || 0);

}


function formatDate(date) {

  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "en-KE",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


function todayISO() {

  const d = new Date();

  const month = String(d.getMonth() + 1).padStart(2, "0");

  const day = String(d.getDate()).padStart(2, "0");

  return `${d.getFullYear()}-${month}-${day}`;

}


/* =========================================================
   NAVIGATION
========================================================= */

const pageTitles = {

  dashboard: [
    "Dashboard",
    "PROFESSIONAL WORKSPACE"
  ],

  profile: [
    "My Profile",
    "IDENTITY"
  ],

  skills: [
    "Skills & Work",
    "EXPERIENCE"
  ],

  evidence: [
    "Evidence",
    "PROOF OF WORK"
  ],

  plans: [
    "Plans & Goals",
    "DIRECTION"
  ],

  calendar: [
    "Calendar",
    "PLANNING"
  ],

  finance: [
    "Financial Calculator",
    "MONEY"
  ],

  documents: [
    "Portfolio / CV",
    "PROFESSIONAL DOCUMENTS"
  ]

};


function openPage(pageName) {

  document.querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });


  document.querySelectorAll(".nav-item[data-page]")
    .forEach(button => {

      button.classList.remove("active");

    });


  const page = $("page-" + pageName);

  if (!page) return;

  page.classList.add("active");


  const nav = document.querySelector(
    `.nav-item[data-page="${pageName}"]`
  );

  if (nav) {

    nav.classList.add("active");

  }


  $("pageTitle").textContent =
    pageTitles[pageName][0];

  $("pageEyebrow").textContent =
    pageTitles[pageName][1];


  document.querySelector(".sidebar")
    .classList.remove("open");


  if (pageName === "calendar") {

    renderCalendar();

  }

  if (pageName === "documents") {

    generateDocument();

  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


document.querySelectorAll(
  ".nav-item[data-page]"
).forEach(button => {

  button.addEventListener("click", () => {

    openPage(button.dataset.page);

  });

});


$("mobileMenu").addEventListener(
  "click",
  () => {

    $("sidebar").classList.toggle("open");

  }
);


/* =========================================================
   THEME
========================================================= */

function applyTheme() {

  document.body.classList.toggle(
    "dark",
    data.theme === "dark"
  );


  const icon =
    $("themeButton").querySelector("i");

  const text =
    $("themeButton").querySelector("span");


  if (data.theme === "dark") {

    icon.className = "fa-solid fa-sun";

    text.textContent = "Light Mode";

  } else {

    icon.className = "fa-solid fa-moon";

    text.textContent = "Dark Mode";

  }

}


$("themeButton").addEventListener(
  "click",
  () => {

    data.theme =
      data.theme === "dark"
        ? "light"
        : "dark";

    saveData();

    applyTheme();

  }
);


/* =========================================================
   PROFILE
========================================================= */

function loadProfile() {

  const p = data.profile;

  $("fullName").value = p.fullName || "";

  $("email").value = p.email || "";

  $("phone").value = p.phone || "";

  $("location").value = p.location || "";

  $("professionalTitle").value =
    p.professionalTitle || "";

  $("summary").value =
    p.summary || "";

  $("linkedin").value =
    p.linkedin || "";

  $("github").value =
    p.github || "";

  $("website").value =
    p.website || "";

  $("industries").value =
    p.industries || "";


  if (p.photo) {

    $("profilePhotoPreview").innerHTML =
      `<img src="${p.photo}" alt="Profile">`;

  }

}


$("saveProfileButton").addEventListener(
  "click",
  () => {

    data.profile.fullName =
      $("fullName").value.trim();

    data.profile.email =
      $("email").value.trim();

    data.profile.phone =
      $("phone").value.trim();

    data.profile.location =
      $("location").value.trim();

    data.profile.professionalTitle =
      $("professionalTitle").value.trim();

    data.profile.summary =
      $("summary").value.trim();

    data.profile.linkedin =
      $("linkedin").value.trim();

    data.profile.github =
      $("github").value.trim();

    data.profile.website =
      $("website").value.trim();

    data.profile.industries =
      $("industries").value.trim();

    saveData();

    updateTopUser();

    showToast("Profile saved successfully.");

  }
);


/* =========================================================
   PROFILE PHOTO
========================================================= */

$("profilePhotoInput").addEventListener(
  "change",
  async event => {

    const file = event.target.files[0];

    if (!file) return;

    const image = await resizeImage(
      file,
      500,
      500
    );

    data.profile.photo = image;

    $("profilePhotoPreview").innerHTML =
      `<img src="${image}" alt="Profile">`;

    saveData();

    showToast("Profile photo saved.");

  }
);


function resizeImage(
  file,
  maxWidth,
  maxHeight
) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = event => {

      const img = new Image();

      img.onload = () => {

        let width = img.width;

        let height = img.height;

        const ratio =
          Math.min(
            maxWidth / width,
            maxHeight / height,
            1
          );

        width *= ratio;
        height *= ratio;

        const canvas =
          document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const ctx =
          canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        resolve(
          canvas.toDataURL(
            "image/jpeg",
            .75
          )
        );

      };

      img.onerror = reject;

      img.src = event.target.result;

    };

    reader.onerror = reject;

    reader.readAsDataURL(file);

  });

}


/* =========================================================
   TOP USER
========================================================= */

function updateTopUser() {

  const name =
    data.profile.fullName ||
    "Your Name";

  const email =
    data.profile.email ||
    "your@email.com";


  $("topUserName").textContent = name;

  $("topUserEmail").textContent = email;

  $("topAvatar").textContent =
    name.charAt(0).toUpperCase();


  $("heroGreeting").textContent =
    data.profile.fullName
      ? `Build proof of what ${data.profile.fullName.split(" ")[0]} can do.`
      : "Build proof of what you can do.";

}


/* =========================================================
   SKILLS
========================================================= */

$("addSkillButton").addEventListener(
  "click",
  () => {

    openModal(
      "Add Skill",
      `
        <div class="field">
          <label>Skill Name</label>
          <input id="modalSkillName" placeholder="e.g. Data Annotation">
        </div>

        <div class="field">
          <label>Level</label>

          <select id="modalSkillLevel">

            <option value="Beginner">Beginner</option>

            <option value="Intermediate">
              Intermediate
            </option>

            <option value="Advanced">
              Advanced
            </option>

            <option value="Expert">
              Expert
            </option>

          </select>

        </div>

        <div class="field">
          <label>Years of Experience</label>
          <input id="modalSkillYears" type="number" min="0">
        </div>

        <button class="primary-button full-button" onclick="saveSkill()">
          Save Skill
        </button>
      `
    );

  }
);


function saveSkill() {

  const name =
    $("modalSkillName").value.trim();

  const level =
    $("modalSkillLevel").value;

  const years =
    $("modalSkillYears").value;


  if (!name) {

    showToast("Enter a skill name.");

    return;

  }


  data.skills.push({

    id: uid("skill"),

    name,

    level,

    years

  });


  saveData();

  renderSkills();

  closeModal();

  showToast("Skill added.");

}


function deleteSkill(id) {

  data.skills =
    data.skills.filter(
      skill => skill.id !== id
    );

  saveData();

  renderSkills();

}


function renderSkills() {

  const container = $("skillsList");

  if (!data.skills.length) {

    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-bolt"></i>
        <p>No skills added yet.</p>
      </div>
    `;

    return;

  }


  const levelPercent = {

    Beginner: 25,

    Intermediate: 50,

    Advanced: 75,

    Expert: 95

  };


  container.innerHTML =
    data.skills.map(skill => `

      <div class="skill-item">

        <div class="skill-main">

          <strong>
            ${escapeHTML(skill.name)}
          </strong>

          <span>
            ${escapeHTML(skill.level)}
            ${skill.years
              ? ` · ${escapeHTML(skill.years)} years`
              : ""}
          </span>

          <div class="skill-level">

            <span
              style="width:${levelPercent[skill.level] || 50}%"
            ></span>

          </div>

        </div>

        <div class="item-actions">

          <button
            class="small-icon"
            onclick="deleteSkill('${skill.id}')"
          >
            <i class="fa-solid fa-trash"></i>
          </button>

        </div>

      </div>

    `).join("");

}


/* =========================================================
   PROJECTS
========================================================= */

$("addProjectButton").addEventListener(
  "click",
  () => {

    openModal(
      "Add Project / Work",
      `
        <div class="field">
          <label>Project / Job Title</label>
          <input id="modalProjectName" placeholder="e.g. AI Data Annotation Project">
        </div>

        <div class="field">
          <label>Organization / Client</label>
          <input id="modalProjectOrg" placeholder="Company or client">
        </div>

        <div class="field">
          <label>Date</label>
          <input id="modalProjectDate" type="text" placeholder="2025 - 2026">
        </div>

        <div class="field">
          <label>Description</label>
          <textarea id="modalProjectDescription" rows="5"
            placeholder="What did you do? What was your responsibility?"></textarea>
        </div>

        <div class="field">
          <label>Skills Used</label>
          <input id="modalProjectSkills"
            placeholder="Annotation, QA, Python, Research">
        </div>

        <button class="primary-button full-button" onclick="saveProject()">
          Save Project
        </button>
      `
    );

  }
);


function saveProject() {

  const name =
    $("modalProjectName").value.trim();

  if (!name) {

    showToast("Enter a project title.");

    return;

  }


  data.projects.push({

    id: uid("project"),

    name,

    organization:
      $("modalProjectOrg").value.trim(),

    date:
      $("modalProjectDate").value.trim(),

    description:
      $("modalProjectDescription").value.trim(),

    skills:
      $("modalProjectSkills").value.trim()

  });


  saveData();

  renderProjects();

  closeModal();

  showToast("Project added.");

}


function deleteProject(id) {

  data.projects =
    data.projects.filter(
      project => project.id !== id
    );

  saveData();

  renderProjects();

}


function renderProjects() {

  const container =
    $("projectsList");


  if (!data.projects.length) {

    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-folder-open"></i>
        <p>No projects added yet.</p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    data.projects.map(project => `

      <div class="project-card">

        <div class="project-top">

          <div>

            <h4>
              ${escapeHTML(project.name)}
            </h4>

            <p>
              ${escapeHTML(project.organization || "")}
              ${project.date
                ? " · " + escapeHTML(project.date)
                : ""}
            </p>

          </div>

          <div class="item-actions">

            <button
              class="small-icon"
              onclick="deleteProject('${project.id}')"
            >
              <i class="fa-solid fa-trash"></i>
            </button>

          </div>

        </div>

        <p style="margin-top:12px">
          ${escapeHTML(project.description || "No description added.")}
        </p>

        ${
          project.skills
          ?
          `<div class="project-meta">
            ${project.skills
              .split(",")
              .map(skill =>
                `<span class="tag">
                  ${escapeHTML(skill.trim())}
                </span>`
              )
              .join("")
            }
          </div>`
          : ""
        }

      </div>

    `).join("");

}


/* =========================================================
   EVIDENCE
========================================================= */

$("evidenceInput").addEventListener(
  "change",
  async event => {

    const files =
      Array.from(event.target.files);

    if (!files.length) return;


    for (const file of files) {

      if (!file.type.startsWith("image/")) {
        continue;
      }


      try {

        const image =
          await resizeImage(
            file,
            1200,
            900
          );


        data.evidence.push({

          id: uid("evidence"),

          name: file.name,

          image,

          date: new Date().toISOString()

        });

      } catch (error) {

        console.error(error);

      }

    }


    saveData();

    renderEvidence();

    showToast(
      `${files.length} evidence file(s) added.`
    );

    event.target.value = "";

  }
);


function deleteEvidence(id) {

  data.evidence =
    data.evidence.filter(
      item => item.id !== id
    );

  saveData();

  renderEvidence();

}


function renderEvidence() {

  const container =
    $("evidenceGrid");


  if (!data.evidence.length) {

    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-camera"></i>
        <p>No evidence uploaded yet.</p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    data.evidence.map(item => `

      <div class="evidence-card">

        <div class="evidence-image">

          <img
            src="${item.image}"
            alt="${escapeHTML(item.name)}"
          >

        </div>

        <div class="evidence-content">

          <strong>
            ${escapeHTML(item.name)}
          </strong>

          <small>
            ${formatDate(item.date)}
          </small>

          <button
            class="small-icon"
            onclick="deleteEvidence('${item.id}')"
          >
            <i class="fa-solid fa-trash"></i>
          </button>

        </div>

      </div>

    `).join("");

}


/* =========================================================
   GOALS
========================================================= */

$("addGoalButton").addEventListener(
  "click",
  () => {

    openModal(
      "Add Goal",
      `
        <div class="field">
          <label>Goal</label>
          <input id="modalGoalName"
            placeholder="e.g. Complete advanced annotation training">
        </div>

        <div class="field">
          <label>Deadline</label>
          <input id="modalGoalDate" type="date">
        </div>

        <div class="field">
          <label>Notes</label>
          <textarea id="modalGoalNotes" rows="4"></textarea>
        </div>

        <button class="primary-button full-button" onclick="saveGoal()">
          Add Goal
        </button>
      `
    );

  }
);


function saveGoal() {

  const name =
    $("modalGoalName").value.trim();


  if (!name) {

    showToast("Enter a goal.");

    return;

  }


  data.goals.push({

    id: uid("goal"),

    name,

    date:
      $("modalGoalDate").value,

    notes:
      $("modalGoalNotes").value.trim(),

    completed: false

  });


  saveData();

  renderGoals();

  closeModal();

  showToast("Goal added.");

}


function toggleGoal(id) {

  const goal =
    data.goals.find(
      item => item.id === id
    );

  if (!goal) return;

  goal.completed =
    !goal.completed;

  saveData();

  renderGoals();

}


function deleteGoal(id) {

  data.goals =
    data.goals.filter(
      item => item.id !== id
    );

  saveData();

  renderGoals();

}


function renderGoals() {

  const container =
    $("goalsList");


  const completed =
    data.goals.filter(
      goal => goal.completed
    ).length;


  $("goalTotal").textContent =
    data.goals.length;

  $("goalCompleted").textContent =
    completed;

  $("goalProgress").textContent =
    data.goals.length - completed;


  if (!data.goals.length) {

    container.innerHTML = `
      <div class="panel">
        <div class="empty-state">
          <i class="fa-solid fa-bullseye"></i>
          <p>No goals created yet.</p>
        </div>
      </div>
    `;

    return;

  }


  container.innerHTML =
    data.goals.map(goal => `

      <div class="goal-card ${goal.completed ? "completed" : ""}">

        <button
          class="goal-check ${goal.completed ? "done" : ""}"
          onclick="toggleGoal('${goal.id}')"
        >
          <i class="fa-solid fa-check"></i>
        </button>

        <div class="goal-content">

          <strong>
            ${escapeHTML(goal.name)}
          </strong>

          <span>
            ${
              goal.date
              ? "Deadline: " + formatDate(goal.date)
              : "No deadline"
            }
          </span>

        </div>

        <button
          class="small-icon"
          onclick="deleteGoal('${goal.id}')"
        >
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>

    `).join("");

}


/* =========================================================
   CALENDAR
========================================================= */

let calendarDate = new Date();


function renderCalendar() {

  const year =
    calendarDate.getFullYear();

  const month =
    calendarDate.getMonth();


  $("calendarMonth").textContent =
    new Date(year, month, 1)
      .toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric"
        }
      );


  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();


  const days =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  const previousDays =
    new Date(
      year,
      month,
      0
    ).getDate();


  const grid =
    $("calendarGrid");

  grid.innerHTML = "";


  for (
    let i = firstDay - 1;
    i >= 0;
    i--
  ) {

    const cell =
      document.createElement("div");

    cell.className =
      "calendar-day other-month";

    cell.innerHTML =
      `<span class="day-number">
        ${previousDays - i}
      </span>`;

    grid.appendChild(cell);

  }


  for (
    let day = 1;
    day <= days;
    day++
  ) {

    const cell =
      document.createElement("div");

    cell.className =
      "calendar-day";


    const dateString =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    if (
      dateString === todayISO()
    ) {

      cell.classList.add("today");

    }


    cell.innerHTML =
      `<span class="day-number">${day}</span>`;


    const events =
      data.events.filter(
        event =>
          event.date === dateString
      );


    events.forEach(event => {

      const eventEl =
        document.createElement("div");

      eventEl.className =
        "calendar-event";

      eventEl.textContent =
        event.title;

      cell.appendChild(eventEl);

    });


    cell.addEventListener(
      "click",
      () => {

        openEventModal(dateString);

      }
    );


    grid.appendChild(cell);

  }


  const total =
    firstDay + days;


  const remaining =
    total % 7 === 0
      ? 0
      : 7 - (total % 7);


  for (
    let i = 1;
    i <= remaining;
    i++
  ) {

    const cell =
      document.createElement("div");

    cell.className =
      "calendar-day other-month";

    cell.innerHTML =
      `<span class="day-number">${i}</span>`;

    grid.appendChild(cell);

  }


  renderEvents();

}


$("previousMonth").addEventListener(
  "click",
  () => {

    calendarDate.setMonth(
      calendarDate.getMonth() - 1
    );

    renderCalendar();

  }
);


$("nextMonth").addEventListener(
  "click",
  () => {

    calendarDate.setMonth(
      calendarDate.getMonth() + 1
    );

    renderCalendar();

  }
);


$("addEventButton").addEventListener(
  "click",
  () => {

    openEventModal(todayISO());

  }
);


function openEventModal(date) {

  openModal(
    "Add Calendar Event",
    `
      <div class="field">

        <label>Event</label>

        <input
          id="modalEventTitle"
          placeholder="e.g. Submit CV"
        >

      </div>

      <div class="field">

        <label>Date</label>

        <input
          id="modalEventDate"
          type="date"
          value="${date}"
        >

      </div>

      <div class="field">

        <label>Notes</label>

        <textarea
          id="modalEventNotes"
          rows="4"
        ></textarea>

      </div>

      <button
        class="primary-button full-button"
        onclick="saveEvent()"
      >
        Add Event
      </button>
    `
  );

}


function saveEvent() {

  const title =
    $("modalEventTitle").value.trim();

  const date =
    $("modalEventDate").value;


  if (!title || !date) {

    showToast("Enter event and date.");

    return;

  }


  data.events.push({

    id: uid("event"),

    title,

    date,

    notes:
      $("modalEventNotes").value.trim()

  });


  saveData();

  closeModal();

  renderCalendar();

  showToast("Event added.");

}


function deleteEvent(id) {

  data.events =
    data.events.filter(
      event => event.id !== id
    );

  saveData();

  renderCalendar();

}


function renderEvents() {

  const container =
    $("eventsList");


  const events =
    [...data.events]
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date)
      );


  if (!events.length) {

    container.innerHTML = `
      <div class="empty-state small">
        <i class="fa-solid fa-calendar"></i>
        <p>No upcoming events.</p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    events.slice(0, 15)
      .map(event => `

        <div class="event-item">

          <div>

            <strong>
              ${escapeHTML(event.title)}
            </strong>

            <small>
              ${escapeHTML(event.notes || "")}
            </small>

          </div>

          <div style="text-align:right">

            <div class="event-date">
              ${formatDate(event.date)}
            </div>

            <button
              class="small-icon"
              onclick="deleteEvent('${event.id}')"
            >
              <i class="fa-solid fa-trash"></i>
            </button>

          </div>

        </div>

      `).join("");

}


/* =========================================================
   FINANCE
========================================================= */

function calculateIncome() {

  const rate =
    Number($("calcRate").value) || 0;

  const hours =
    Number($("calcHours").value) || 0;

  const total =
    rate * hours;

  $("calculatedAmount").textContent =
    formatMoney(total);

  return total;

}


$("calcRate").addEventListener(
  "input",
  calculateIncome
);


$("calcHours").addEventListener(
  "input",
  calculateIncome
);


$("saveIncomeButton").addEventListener(
  "click",
  () => {

    const amount =
      calculateIncome();


    if (!amount) {

      showToast("Enter rate and hours.");

      return;

    }


    data.transactions.push({

      id: uid("transaction"),

      type: "income",

      description:
        "Calculated work income",

      amount,

      date: todayISO()

    });


    saveData();

    renderFinance();

    showToast("Income added.");

  }
);


$("saveExpenseButton").addEventListener(
  "click",
  () => {

    const description =
      $("expenseName").value.trim();

    const amount =
      Number($("expenseAmount").value);


    if (!description || !amount) {

      showToast("Enter expense details.");

      return;

    }


    data.transactions.push({

      id: uid("transaction"),

      type: "expense",

      description,

      amount,

      date: todayISO()

    });


    $("expenseName").value = "";

    $("expenseAmount").value = "";

    saveData();

    renderFinance();

    showToast("Expense added.");

  }
);


function deleteTransaction(id) {

  data.transactions =
    data.transactions.filter(
      transaction =>
        transaction.id !== id
    );

  saveData();

  renderFinance();

}


function renderFinance() {

  const income =
    data.transactions
      .filter(t => t.type === "income")
      .reduce(
        (sum, t) =>
          sum + Number(t.amount),
        0
      );


  const expenses =
    data.transactions
      .filter(t => t.type === "expense")
      .reduce(
        (sum, t) =>
          sum + Number(t.amount),
        0
      );


  $("totalIncome").textContent =
    formatMoney(income);

  $("totalExpenses").textContent =
    formatMoney(expenses);

  $("totalBalance").textContent =
    formatMoney(income - expenses);


  const container =
    $("transactionsList");


  if (!data.transactions.length) {

    container.innerHTML = `
      <div class="empty-state small">
        <i class="fa-solid fa-wallet"></i>
        <p>No transactions yet.</p>
      </div>
    `;

    return;

  }


  const transactions =
    [...data.transactions]
      .reverse();


  container.innerHTML =
    transactions.map(transaction => `

      <div class="transaction">

        <div>

          <strong>
            ${escapeHTML(transaction.description)}
          </strong>

          <small>
            ${formatDate(transaction.date)}
          </small>

        </div>

        <div>

          <strong
            class="transaction-amount ${transaction.type}"
          >
            ${
              transaction.type === "income"
              ? "+"
              : "-"
            }

            ${formatMoney(transaction.amount)}
          </strong>

          <button
            class="small-icon"
            onclick="deleteTransaction('${transaction.id}')"
          >
            <i class="fa-solid fa-trash"></i>
          </button>

        </div>

      </div>

    `).join("");

}


/* =========================================================
   DOCUMENT GENERATOR
========================================================= */

let selectedDocument =
  "portfolio";


document.querySelectorAll(
  ".document-type"
).forEach(button => {

  button.addEventListener(
    "click",
    () => {

      document.querySelectorAll(
        ".document-type"
      ).forEach(item =>
        item.classList.remove("active")
      );


      button.classList.add("active");

      selectedDocument =
        button.dataset.document;


      $("previewDocumentTitle").textContent =
        capitalize(selectedDocument);


      generateDocument();

    }
  );

});


$("generateDocumentButton")
  .addEventListener(
    "click",
    () => {

      generateDocument();

      showToast(
        `${capitalize(selectedDocument)} generated.`
      );

    }
  );


function capitalize(text) {

  return text.charAt(0).toUpperCase()
    + text.slice(1);

}


function generateDocument() {

  const p = data.profile;


  if (!p.fullName && !p.email) {

    $("documentPaper").innerHTML = `

      <div class="document-empty">

        <i class="fa-solid fa-user"></i>

        <h3>Complete your profile first</h3>

        <p>
          Add your name, email, professional title,
          summary and other information.
        </p>

      </div>

    `;

    return;

  }


  const includeSkills =
    $("includeSkills").checked;

  const includeProjects =
    $("includeProjects").checked;

  const includeEvidence =
    $("includeEvidence").checked;

  const includeGoals =
    $("includeGoals").checked;


  let html = `

    <div class="doc-header">

      <div class="doc-header-info">

        <h1>
          ${escapeHTML(p.fullName || "Your Name")}
        </h1>

        <h2>
          ${escapeHTML(
            p.professionalTitle ||
            "Professional"
          )}
        </h2>

      </div>

      ${
        p.photo
        ?
        `<img
          class="doc-photo"
          src="${p.photo}"
          alt="Profile"
        >`
        : ""
      }

      <div class="doc-contact">

        ${
          p.email
          ? `<div>${escapeHTML(p.email)}</div>`
          : ""
        }

        ${
          p.phone
          ? `<div>${escapeHTML(p.phone)}</div>`
          : ""
        }

        ${
          p.location
          ? `<div>${escapeHTML(p.location)}</div>`
          : ""
        }

        ${
          p.linkedin
          ? `<div>${escapeHTML(p.linkedin)}</div>`
          : ""
        }

        ${
          p.github
          ? `<div>${escapeHTML(p.github)}</div>`
          : ""
        }

      </div>

    </div>

  `;


  if (p.summary) {

    html += `

      <section class="doc-section">

        <div class="doc-section-title">
          PROFESSIONAL PROFILE
        </div>

        <p>
          ${escapeHTML(p.summary)}
        </p>

      </section>

    `;

  }


  if (p.industries) {

    html += `

      <section class="doc-section">

        <div class="doc-section-title">
          AREAS OF EXPERTISE
        </div>

        <p>
          ${escapeHTML(p.industries)}
        </p>

      </section>

    `;

  }


  if (
    includeSkills &&
    data.skills.length
  ) {

    html += `

      <section class="doc-section">

        <div class="doc-section-title">
          SKILLS
        </div>

        <div class="doc-skill-list">

          ${data.skills.map(skill => `

            <span class="doc-skill">

              ${escapeHTML(skill.name)}

              ${
                skill.level
                ? ` · ${escapeHTML(skill.level)}`
                : ""
              }

            </span>

          `).join("")}

        </div>

      </section>

    `;

  }


  if (
    includeProjects &&
    data.projects.length
  ) {

    html += `

      <section class="doc-section">

        <div class="doc-section-title">
          WORK & PROJECT EXPERIENCE
        </div>

        ${data.projects.map(project => `

          <div class="doc-project">

            <h4>

              ${escapeHTML(project.name)}

              ${
                project.organization
                ? ` — ${escapeHTML(project.organization)}`
                : ""
              }

            </h4>

            <p>

              ${
                project.date
                ? `<strong>${escapeHTML(project.date)}</strong><br>`
                : ""
              }

              ${escapeHTML(
                project.description || ""
              )}

            </p>

            ${
              project.skills
              ? `
                <p>
                  <strong>Skills:</strong>
                  ${escapeHTML(project.skills)}
                </p>
              `
              : ""
            }

          </div>

        `).join("")}

      </section>

    `;

  }


  if (
    includeGoals &&
    data.goals.length
  ) {

    html += `

      <section class="doc-section">

        <div class="doc-section-title">
          PROFESSIONAL GOALS
        </div>

        ${data.goals.map(goal => `

          <p>
            • ${escapeHTML(goal.name)}
            ${
              goal.date
              ? ` — ${formatDate(goal.date)}`
              : ""
            }
          </p>

        `).join("")}

      </section>

    `;

  }


  if (
    includeEvidence &&
    data.evidence.length
  ) {

    html += `

      <section class="doc-section">

        <div class="doc-section-title">
          SELECTED WORK EVIDENCE
        </div>

        <div class="doc-evidence-grid">

          ${data.evidence.slice(0, 6).map(item => `

            <img
              src="${item.image}"
              alt="${escapeHTML(item.name)}"
            >

          `).join("")}

        </div>

      </section>

    `;

  }


  html += `

    <section class="doc-section">

      <div class="doc-section-title">
        DOCUMENT INFORMATION
      </div>

      <p>

        ${capitalize(selectedDocument)}
        prepared for

        <strong>
          ${escapeHTML(p.fullName || "")}
        </strong>

        ${
          p.email
          ? ` · ${escapeHTML(p.email)}`
          : ""
        }

      </p>

    </section>

  `;


  $("documentPaper").innerHTML = html;

}


/* =========================================================
   PDF EXPORT
========================================================= */

$("downloadPdfButton").addEventListener(
  "click",
  async () => {

    const paper =
      $("documentPaper");


    if (
      !paper ||
      paper.querySelector(".document-empty")
    ) {

      showToast(
        "Generate the document first."
      );

      return;

    }


    showToast(
      "Preparing PDF..."
    );


    try {

      const canvas =
        await html2canvas(
          paper,
          {
            scale: 2,
            backgroundColor: "#ffffff"
          }
        );


      const imgData =
        canvas.toDataURL("image/png");


      const {
        jsPDF
      } = window.jspdf;


      const pdf =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );


      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();


      const imageWidth =
        pageWidth;

      const imageHeight =
        canvas.height *
        imageWidth /
        canvas.width;


      let heightLeft =
        imageHeight;

      let position = 0;


      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imageWidth,
        imageHeight
      );


      heightLeft -= pageHeight;


      while (heightLeft > 0) {

        position =
          heightLeft -
          imageHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imageWidth,
          imageHeight
        );

        heightLeft -= pageHeight;

      }


      const name =
        (data.profile.fullName ||
          "Professional")
          .replace(
            /[^a-z0-9]/gi,
            "_"
          );


      pdf.save(
        `${name}_${selectedDocument}.pdf`
      );


      showToast(
        "PDF downloaded."
      );

    } catch (error) {

      console.error(error);

      showToast(
        "Could not create PDF."
      );

    }

  }
);


/* =========================================================
   IMAGE EXPORT
========================================================= */

$("downloadImageButton")
  .addEventListener(
    "click",
    async () => {

      const paper =
        $("documentPaper");


      if (
        !paper ||
        paper.querySelector(".document-empty")
      ) {

        showToast(
          "Generate the document first."
        );

        return;

      }


      try {

        const canvas =
          await html2canvas(
            paper,
            {
              scale: 2,
              backgroundColor: "#ffffff"
            }
          );


        const link =
          document.createElement("a");


        const name =
          (data.profile.fullName ||
            "Professional")
            .replace(
              /[^a-z0-9]/gi,
              "_"
            );


        link.download =
          `${name}_${selectedDocument}.png`;


        link.href =
          canvas.toDataURL("image/png");


        link.click();


        showToast(
          "PNG image downloaded."
        );

      } catch (error) {

        console.error(error);

        showToast(
          "Could not create image."
        );

      }

    }
  );


/* =========================================================
   MODAL
========================================================= */

function openModal(title, body) {

  $("modalTitle").textContent =
    title;

  $("modalBody").innerHTML =
    body;

  $("modalOverlay")
    .classList.add("show");

}


function closeModal() {

  $("modalOverlay")
    .classList.remove("show");

}


$("closeModal").addEventListener(
  "click",
  closeModal
);


$("modalOverlay").addEventListener(
  "click",
  event => {

    if (
      event.target ===
      $("modalOverlay")
    ) {

      closeModal();

    }

  }
);


/* =========================================================
   QUICK ADD
========================================================= */

$("quickAddButton")
  .addEventListener(
    "click",
    () => {

      openModal(
        "Quick Add",
        `
          <div style="
            display:grid;
            gap:10px;
          ">

            <button
              class="quick-card"
              onclick="closeModal();openPage('skills')"
            >
              <strong>Add Skill</strong>
              <span>Record a professional skill.</span>
            </button>

            <button
              class="quick-card"
              onclick="closeModal();openPage('evidence')"
            >
              <strong>Add Evidence</strong>
              <span>Upload work snapshots.</span>
            </button>

            <button
              class="quick-card"
              onclick="closeModal();openPage('plans')"
            >
              <strong>Add Goal</strong>
              <span>Create a professional goal.</span>
            </button>

            <button
              class="quick-card"
              onclick="closeModal();openPage('calendar')"
            >
              <strong>Add Calendar Event</strong>
              <span>Schedule important work.</span>
            </button>

          </div>
        `
      );

    }
  );


/* =========================================================
   BACKUP
========================================================= */

$("backupButton").addEventListener(
  "click",
  () => {

    const backup =
      JSON.stringify(
        data,
        null,
        2
      );


    const blob =
      new Blob(
        [backup],
        {
          type: "application/json"
        }
      );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      "profolio_backup.json";


    link.click();


    URL.revokeObjectURL(url);


    showToast(
      "Backup downloaded."
    );

  }
);


/* =========================================================
   RESTORE
========================================================= */

$("restoreInput")
  .addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];

      if (!file) return;


      const reader =
        new FileReader();


      reader.onload = () => {

        try {

          const imported =
            JSON.parse(
              reader.result
            );


          data = {

            ...structuredClone(defaultData),

            ...imported

          };


          saveData();

          loadProfile();

          renderEverything();

          showToast(
            "Backup restored."
          );

        } catch (error) {

          showToast(
            "Invalid backup file."
          );

        }

      };


      reader.readAsText(file);

      event.target.value = "";

    }
  );


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

  $("statSkills").textContent =
    data.skills.length;

  $("statProjects").textContent =
    data.projects.length;

  $("statEvidence").textContent =
    data.evidence.length;

  $("statGoals").textContent =
    data.goals.length;


  const fields = [

    data.profile.fullName,

    data.profile.email,

    data.profile.phone,

    data.profile.location,

    data.profile.professionalTitle,

    data.profile.summary,

    data.profile.industries,

    data.profile.photo

  ];


  const completed =
    fields.filter(Boolean).length;


  const percent =
    Math.round(
      completed /
      fields.length *
      100
    );


  $("profilePercent").textContent =
    percent + "%";


  const degrees =
    percent * 3.6;


  $("profileCircle").style.background =
    `
      conic-gradient(
        var(--primary) ${degrees}deg,
        #ececf3 ${degrees}deg
      )
    `;


  if (percent >= 80) {

    $("profileStatus").textContent =
      "Excellent profile";

  } else if (percent >= 50) {

    $("profileStatus").textContent =
      "Good progress";

  } else {

    $("profileStatus").textContent =
      "Let's get started";

  }


  const recent =
    $("recentProjects");


  if (!data.projects.length) {

    recent.innerHTML = `
      <div class="empty-state small">
        <i class="fa-solid fa-folder-open"></i>
        <p>No projects yet.</p>
      </div>
    `;

  } else {

    recent.innerHTML =
      data.projects
        .slice(-5)
        .reverse()
        .map(project => `

          <div class="event-item">

            <div>

              <strong>
                ${escapeHTML(project.name)}
              </strong>

              <small>
                ${escapeHTML(
                  project.organization || ""
                )}
              </small>

            </div>

            <span class="tag">
              Project
            </span>

          </div>

        `)
        .join("");

  }

}


/* =========================================================
   RENDER ALL
========================================================= */

function renderEverything() {

  loadProfile();

  updateTopUser();

  renderSkills();

  renderProjects();

  renderEvidence();

  renderGoals();

  renderCalendar();

  renderFinance();

  updateDashboard();

  applyTheme();

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderEverything();

    calculateIncome();

    generateDocument();

  }
);


/* =========================================================
   AUTO SAVE FORM DATA
========================================================= */

[
  "fullName",
  "email",
  "phone",
  "location",
  "professionalTitle",
  "summary",
  "linkedin",
  "github",
  "website",
  "industries"
].forEach(id => {

  $(id).addEventListener(
    "input",
    () => {

      data.profile[id] =
        $(id).value;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

      updateTopUser();

      updateDashboard();

    }
  );

});
