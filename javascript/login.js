// Initialize MDL components
function upgradeMDL() {
  componentHandler.upgradeAllRegistered();
}

// Add snackbar for notifications
const snackbarContainer = document.createElement('div');
snackbarContainer.id = 'snackbar';
snackbarContainer.className = 'mdl-js-snackbar mdl-snackbar';
snackbarContainer.innerHTML = `
  <div class="mdl-snackbar__text"></div>
  <button class="mdl-snackbar__action" type="button"></button>
`;
document.body.appendChild(snackbarContainer);
upgradeMDL();

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const data = {
      message: `Welcome ${user.firstName}! Login successful.`,
      timeout: 2000,
      actionHandler: () => {
        window.location.href = "index.html";
      },
      actionText: 'Go to Dashboard'
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    
    // Redirect after snackbar shows
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } else {
    const data = {
      message: 'Invalid email or password.',
      timeout: 3000
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  }
});

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
