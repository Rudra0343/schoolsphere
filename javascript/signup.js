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

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!firstName || !lastName || !mobile || !email || !password) {
    const data = { message: 'Please fill in all fields.' };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    return;
  }

  // Get existing users or empty array
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check for duplicate email
  const isUserExist = users.some(user => user.email === email);
  if (isUserExist) {
    const data = { message: 'User with this email already exists.' };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    return;
  }

  // Save new user
  const newUser = { firstName, lastName, mobile, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  const data = {
    message: 'Signup successful! Redirecting to login...',
    timeout: 2000,
    actionHandler: () => {
      window.location.href = "login.html";
    },
    actionText: 'Login Now'
  };
  snackbarContainer.MaterialSnackbar.showSnackbar(data);

  // Redirect after snackbar shows
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
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
