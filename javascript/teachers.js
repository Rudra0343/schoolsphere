const teacherForm = document.getElementById("teacherForm");
const teacherTableBody = document.querySelector("#teacherTable tbody");
const subject = document.getElementById("subject").value;
const teacherIdInput = document.getElementById("teacherId");

teacherIdInput.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, '');
});

let teachers = JSON.parse(localStorage.getItem("teachers")) || [];
let editingIndex = null;

// Render saved teachers
function renderTeachers() {
  teacherTableBody.innerHTML = "";
  teachers.forEach((teacher, index) => {
    const isEditing = editingIndex === index;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${teacher.name}</td>
      <td>${teacher.subject}</td>
      <td>${teacher.id}</td>
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
    teacherTableBody.appendChild(row);
  });
}

// Save data
function saveTeachers() {
  localStorage.setItem("teachers", JSON.stringify(teachers));
}

// Form submit
teacherForm?.addEventListener("submit", function (e) {
  e.preventDefault();

  const teacherName = document.getElementById("teacherName").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const teacherId = document.getElementById("teacherId").value.trim();

  if (!teacherName || !subject || !teacherId) return;

  const newTeacher = { name: teacherName, subject: subject, id: teacherId };

  if (editingIndex !== null) {
    teachers[editingIndex] = newTeacher;
    editingIndex = null;
    teacherForm.querySelector("button[type='submit']").textContent = "Add Teacher";
  } else {
    teachers.push(newTeacher);
  }

  saveTeachers();
  renderTeachers();
  teacherForm.reset();
});

// Handle edit/delete buttons
teacherTableBody?.addEventListener("click", function (e) {
  const index = parseInt(e.target.getAttribute("data-index"));

  if (e.target.classList.contains("delete-btn")) {
    const confirmed = confirm("Are you sure you want to delete this teacher?");
    if (confirmed) {
      teachers.splice(index, 1);
      saveTeachers();
      renderTeachers();
      editingIndex = null;
      teacherForm.reset();
      renderTeachers();
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const teacher = teachers[index];
    document.getElementById("teacherName").value = teacher.name;
    document.getElementById("subject").value = teacher.subject;
    document.getElementById("teacherId").value = teacher.id;
    editingIndex = index;
    renderTeachers();
  }

  if (e.target.classList.contains("update-btn")) {
    const teacherName = document.getElementById("teacherName").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const teacherId = document.getElementById("teacherId").value.trim();


    teachers[index] = { teacherName, subject, teacherId };
    saveTeachers();
    editingIndex = null;
    teacherForm.reset();
    renderTeachers();
  }

  if (e.target.classList.contains("cancel-btn")) {
    editingIndex = null;
    teacherForm.reset();
    renderTeachers();
  }
});

// Dark mode toggle
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

// First render
renderTeachers();