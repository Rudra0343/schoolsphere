const studentForm = document.getElementById("studentForm");
const studentTableBody = document.querySelector("#studentTable tbody");
const studentIdInput = document.getElementById("roll");

// Only allow numbers in Student ID
studentIdInput?.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, '');
});

let students = JSON.parse(localStorage.getItem("students")) || [];
let editingIndex = null;

// Function to populate teacher dropdown
function populateTeacherDropdown() {
  const teachers = JSON.parse(localStorage.getItem("teachers")) || [];
  const teacherSelect = document.getElementById("teacher");
  teacherSelect.innerHTML = '<option value="">Select Teacher</option>';
  teachers.forEach(teacher => {
    teacherSelect.innerHTML += `<option value="${teacher.name}">${teacher.name} (${teacher.subject})</option>`;
  });
}

// Function to populate class dropdown
function populateClassDropdown() {
  const classes = JSON.parse(localStorage.getItem("classes")) || [];
  const classSelect = document.getElementById("class");
  classSelect.innerHTML = '<option value="">Select Class</option>';
  classes.forEach(cls => {
    classSelect.innerHTML += `<option value="${cls.className}-${cls.section}">${cls.className}-${cls.section}</option>`;
  });
}

// Function to generate roll number
function generateRollNumber(className) {
  const classStudents = students.filter(student => student.className === className);
  return (classStudents.length + 1).toString().padStart(2, '0');
}

// Add a teacher field to the student object
const teacherInput = document.createElement("input");
teacherInput.setAttribute("type", "text");
teacherInput.setAttribute("id", "teacher");
teacherInput.setAttribute("placeholder", "Class Teacher");
teacherInput.required = true;
studentForm.insertBefore(teacherInput, studentForm.querySelector("button"));

// Render Students Table
function renderStudents() {
  studentTableBody.innerHTML = "";
  students.forEach((student, index) => {
    const isEditing = editingIndex === index;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.className}</td>
      <td>${student.rollNumber}</td>
      <td>${student.teacher}</td>
      <td>${student.contactNumber}</td>
      <td>
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
  const teacher = document.getElementById("teacher").value.trim();
  const contactNumber = document.getElementById("contactNumber").value.trim();

  if (!studentName || !className || !teacher || !contactNumber) {
    alert("Please fill in all fields");
    return;
  }

  const rollNumber = editingIndex !== null 
    ? students[editingIndex].rollNumber 
    : generateRollNumber(className);

  const newStudent = { 
    name: studentName, 
    className: className, 
    rollNumber: rollNumber,
    teacher: teacher,
    contactNumber: contactNumber 
  };

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
    document.getElementById("teacher").value = student.teacher;
    document.getElementById("contactNumber").value = student.contactNumber;
    editingIndex = index;
    renderStudents();
  }

  if (e.target.classList.contains("update-btn")) {
    const updatedName = document.getElementById("name").value.trim();
    const updatedClass = document.getElementById("class").value.trim();
    const updatedId = studentIdInput.value.trim();
    const updatedTeacher = document.getElementById("teacher").value.trim();

    students[index] = { name: updatedName, className: updatedClass, id: updatedId, teacher: updatedTeacher };
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

// Initialize dropdowns when page loads
document.addEventListener('DOMContentLoaded', function() {
  populateTeacherDropdown();
  populateClassDropdown();
  renderStudents();
});

// Initial Render
renderStudents();