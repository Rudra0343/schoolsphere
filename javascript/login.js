document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    alert(`Welcome ${user.firstName}! Login successful.`);
    localStorage.setItem("loggedInUser", JSON.stringify(user)); // optional for session use
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password.");
  }
});
