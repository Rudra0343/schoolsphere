document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
  
    if (!firstName || !lastName || !mobile || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Get existing users or empty array
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Check for duplicate email
    const isUserExist = users.some(user => user.email === email);
    if (isUserExist) {
      alert("User with this email already exists.");
      return;
    }
  
    // Save new user
    const newUser = { firstName, lastName, mobile, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  
    alert("Signup successful! Redirecting to login...");
    window.location.href = "login.html";
  });
  