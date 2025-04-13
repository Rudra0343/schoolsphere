const classForm = document.getElementById("classForm");
const classTableBody = document.querySelector("#classTable tbody");
const roomNumberInput = document.getElementById("roomNumber");

roomNumberInput?.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, '');
});

let classes = JSON.parse(localStorage.getItem("classes")) || [];
let editingIndex = null;

// Render class rows
function renderClasses() {
  classTableBody.innerHTML = "";
  classes.forEach((cls, index) => {
    const isEditing = editingIndex === index;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${cls.className}</td>
      <td>${cls.section}</td>
      <td>${cls.roomNumber}</td>
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
    classTableBody.appendChild(row);
  });
}

// Save to LocalStorage
function saveClasses() {
  localStorage.setItem("classes", JSON.stringify(classes));
}

// Handle form submit
classForm?.addEventListener("submit", function (e) {
  e.preventDefault();

  const className = document.getElementById("class").value.trim();
  const section = document.getElementById("section").value.trim();
  const roomNumber = document.getElementById("roomNumber").value.trim();

  if (!className || !section || !roomNumber) return;

  const newClass = { className, section, roomNumber };

  if (editingIndex !== null) {
    classes[editingIndex] = newClass;
    editingIndex = null;
    classForm.querySelector("button[type='submit']").textContent = "Add Class";
  } else {
    classes.push(newClass);
  }

  saveClasses();
  renderClasses();
  classForm.reset();
});

// Handle edit / update / cancel / delete
classTableBody?.addEventListener("click", function (e) {
  const index = parseInt(e.target.getAttribute("data-index"));

  if (e.target.classList.contains("edit-btn")) {
    const cls = classes[index];
    document.getElementById("class").value = cls.className;
    document.getElementById("section").value = cls.section;
    document.getElementById("roomNumber").value = cls.roomNumber;

    editingIndex = index;
    classForm.querySelector("button[type='submit']").textContent = "Update Class";
    renderClasses();
  }

  if (e.target.classList.contains("update-btn")) {
    const updatedClass = document.getElementById("class").value.trim();
    const updatedSection = document.getElementById("section").value.trim();
    const updatedRoom = document.getElementById("roomNumber").value.trim();

    classes[index] = {
      className: updatedClass,
      section: updatedSection,
      roomNumber: updatedRoom,
    };

    saveClasses();
    editingIndex = null;
    classForm.reset();
    renderClasses();
  }

  if (e.target.classList.contains("cancel-btn")) {
    editingIndex = null;
    classForm.reset();
    classForm.querySelector("button[type='submit']").textContent = "Add Class";
    renderClasses();
  }

  if (e.target.classList.contains("delete-btn")) {
    const confirmed = confirm("Are you sure you want to delete this class?");
    if (confirmed) {
      classes.splice(index, 1);
      saveClasses();
      editingIndex = null;
      classForm.reset();
      renderClasses();
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
renderClasses();