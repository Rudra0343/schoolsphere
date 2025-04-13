const studentForm = document.getElementById("studentForm");
const studentTableBody = document.querySelector("#studentTable tbody");
const studentIdInput = document.getElementById("roll");

// Only allow numbers in Student ID
studentIdInput?.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, '');
});

let students = JSON.parse(localStorage.getItem("students")) || [];
let editingIndex = null;

// Render Students Table
function renderStudents() {
  studentTableBody.innerHTML = "";
  students.forEach((student, index) => {
    const isEditing = editingIndex === index;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.className}</td>
      <td>${student.id}</td>
      <td colspan="2">
        ${
          isEditing
            ? `
              <button class="update-btn" data-index="${index}">Update</button>
              <button class="cancel-btn" data-index="${index}">Cancel</button>
              <button class="delete-btn" data-index="${index}">Delete</button>
            `
            : `<button class="edit-btn" data-index="${index}">Edit</button>`
        }
      </td>
    `;
    studentTableBody.appendChild(row);
  });
}

// Save to Local Storage
function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Form Submission
studentForm?.addEventListener("submit", function (e) {
  e.preventDefault();

  const studentName = document.getElementById("name").value.trim();
  const className = document.getElementById("class").value.trim();
  const studentId = studentIdInput.value.trim();

  if (!studentName || !className || !studentId) return;

  const newStudent = { name: studentName, className: className, id: studentId };

  if (editingIndex !== null) {
    students[editingIndex] = newStudent;
    editingIndex = null;
    studentForm.querySelector("button[type='submit']").textContent = "Add Student";
  } else {
    students.push(newStudent);
  }

  saveStudents();
  renderStudents();
  studentForm.reset();
});

// Handle Edit / Update / Cancel / Delete
studentTableBody?.addEventListener("click", function (e) {
  const index = parseInt(e.target.getAttribute("data-index"));

  if (e.target.classList.contains("edit-btn")) {
    const student = students[index];
    document.getElementById("name").value = student.name;
    document.getElementById("class").value = student.className;
    studentIdInput.value = student.id;
    editingIndex = index;
    renderStudents();
  }

  if (e.target.classList.contains("update-btn")) {
    const updatedName = document.getElementById("name").value.trim();
    const updatedClass = document.getElementById("class").value.trim();
    const updatedId = studentIdInput.value.trim();

    students[index] = { name: updatedName, className: updatedClass, id: updatedId };
    saveStudents();
    editingIndex = null;
    studentForm.reset();
    renderStudents();
  }

  if (e.target.classList.contains("cancel-btn")) {
    editingIndex = null;
    studentForm.reset();
    renderStudents();
  }

  if (e.target.classList.contains("delete-btn")) {
    const confirmed = confirm("Are you sure you want to delete this student?");
    if (confirmed) {
      students.splice(index, 1);
      saveStudents();
      editingIndex = null;
      studentForm.reset();
      renderStudents();
    }
  }
});

// Dark Mode Toggle
const toggleBtn = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (toggleBtn) toggleBtn.textContent = "☀️";
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Initial Render
renderStudents();