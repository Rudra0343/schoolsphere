// Initialize MDL components
function upgradeMDL() {
  componentHandler.upgradeAllRegistered();
}

// Load and display statistics
function loadStatistics() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const teachers = JSON.parse(localStorage.getItem("teachers")) || [];
  const classes = JSON.parse(localStorage.getItem("classes")) || [];

  // Update count cards
  document.querySelector("#studentCount .stat-number").textContent = students.length;
  document.querySelector("#teacherCount .stat-number").textContent = teachers.length;
  document.querySelector("#classCount .stat-number").textContent = classes.length;

  // Calculate additional stats
  const statsContainer = document.getElementById("stats");
  statsContainer.innerHTML = `
    <div class="mdl-cell mdl-cell--3-col">
      <div class="mdl-card mdl-shadow--2dp stat-card">
        <div class="mdl-card__supporting-text">
          <i class="material-icons">people</i>
          <h4>Average Class Size</h4>
          <div class="stat-value">${classes.length ? Math.round(students.length / classes.length) : 0}</div>
          <div class="stat-label">students per class</div>
        </div>
      </div>
    </div>

    <div class="mdl-cell mdl-cell--3-col">
      <div class="mdl-card mdl-shadow--2dp stat-card">
        <div class="mdl-card__supporting-text">
          <i class="material-icons">school</i>
          <h4>Student-Teacher Ratio</h4>
          <div class="stat-value">${teachers.length ? Math.round(students.length / teachers.length) : 0}:1</div>
          <div class="stat-label">students per teacher</div>
        </div>
      </div>
    </div>

    <div class="mdl-cell mdl-cell--3-col">
      <div class="mdl-card mdl-shadow--2dp stat-card">
        <div class="mdl-card__supporting-text">
          <i class="material-icons">subject</i>
          <h4>Subjects</h4>
          <div class="stat-value">${new Set(teachers.map(t => t.subject)).size}</div>
          <div class="stat-label">unique subjects</div>
        </div>
      </div>
    </div>

    <div class="mdl-cell mdl-cell--3-col">
      <div class="mdl-card mdl-shadow--2dp stat-card">
        <div class="mdl-card__supporting-text">
          <i class="material-icons">meeting_room</i>
          <h4>Rooms Used</h4>
          <div class="stat-value">${new Set(classes.map(c => c.roomNumber)).size}</div>
          <div class="stat-label">active classrooms</div>
        </div>
      </div>
    </div>
  `;
  upgradeMDL();
}

// Dark Mode Toggle with MDL
const toggleBtn = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  toggleBtn.querySelector('i').textContent = "brightness_7";
}

toggleBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  toggleBtn.querySelector('i').textContent = isDark ? "brightness_7" : "brightness_4";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Check authentication
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  const snackbarContainer = document.createElement('div');
  snackbarContainer.id = 'snackbar';
  snackbarContainer.className = 'mdl-js-snackbar mdl-snackbar';
  snackbarContainer.innerHTML = `
    <div class="mdl-snackbar__text"></div>
    <button class="mdl-snackbar__action" type="button"></button>
  `;
  document.body.appendChild(snackbarContainer);
  upgradeMDL();

  const data = {
    message: 'Please log in to access all features',
    timeout: 4000,
    actionHandler: () => {
      window.location.href = "login.html";
    },
    actionText: 'Login'
  };
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

// Load initial statistics
document.addEventListener('DOMContentLoaded', loadStatistics);

// Add CSS for dashboard stats
const style = document.createElement('style');
style.textContent = `
  .dashboard-stat {
    text-align: center;
    margin-bottom: 16px;
  }
  .stat-number {
    font-size: 36px;
    font-weight: 500;
    color: var(--primary-color);
  }
  .stat-label {
    font-size: 14px;
    color: rgba(0,0,0,0.54);
  }
  .stat-card {
    width: 100%;
    min-height: 180px;
  }
  .stat-card .material-icons {
    font-size: 36px;
    color: var(--primary-color);
  }
  .stat-card h4 {
    margin: 8px 0;
    font-size: 16px;
  }
  .stat-value {
    font-size: 24px;
    font-weight: 500;
    margin: 8px 0;
  }
  .dark .stat-label {
    color: rgba(255,255,255,0.7);
  }
  .mdl-card__title-text .material-icons {
    margin-right: 8px;
  }
`;
document.head.appendChild(style);
