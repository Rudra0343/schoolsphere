// Initialize MDL components
function upgradeMDL() {
  componentHandler.upgradeAllRegistered();
}

const teacherForm = document.getElementById("teacherForm");
const teacherTableBody = document.querySelector("#teacherTable");
const teacherIdInput = document.getElementById("teacherId");

let teachers = JSON.parse(localStorage.getItem("teachers")) || [];
let editingIndex = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
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

  // Only allow numbers in Teacher ID
  teacherIdInput?.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '');
  });

  // Initial render
  renderTeachers();
});

// Render teacher rows
function renderTeachers() {
  teacherTableBody.innerHTML = "";
  teachers.forEach((teacher, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="mdl-data-table__cell--non-numeric">${teacher.name}</td>
      <td class="mdl-data-table__cell--non-numeric">${teacher.subject}</td>
      <td>${teacher.teacherId}</td>
      <td class="mdl-data-table__cell--non-numeric">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored edit-btn" data-index="${index}">
          <i class="material-icons">edit</i> Edit
        </button>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent delete-btn" data-index="${index}">
          <i class="material-icons">delete</i> Delete
        </button>
      </td>
    `;
    teacherTableBody.appendChild(row);
  });
  upgradeMDL();
}

// Save to LocalStorage
function saveTeachers() {
  localStorage.setItem("teachers", JSON.stringify(teachers));
}

// Handle form submit
teacherForm?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("teacherName").value.trim();
  const subject = document.getElementById("subject").value;
  const teacherId = document.getElementById("teacherId").value.trim();

  if (!name || !subject || !teacherId) {
    const data = { message: 'Please fill in all fields' };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    return;
  }

  const newTeacher = { name, subject, teacherId };

  if (editingIndex !== null) {
    teachers[editingIndex] = newTeacher;
    editingIndex = null;
    teacherForm.querySelector("button[type='submit']").innerHTML = '<i class="material-icons">add</i> Add Teacher';
  } else {
    teachers.push(newTeacher);
  }

  saveTeachers();
  renderTeachers();
  teacherForm.reset();

  // Reset MDL textfields
  const textFields = document.querySelectorAll('.mdl-textfield');
  textFields.forEach(field => {
    field.classList.remove('is-dirty');
    field.MaterialTextfield.boundUpdateClassesHandler();
  });

  const data = {
    message: editingIndex !== null ? 'Teacher updated successfully' : 'Teacher added successfully',
    timeout: 2000
  };
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
});

// Handle edit/delete buttons
teacherTableBody?.addEventListener("click", function (e) {
  const button = e.target.closest('button');
  if (!button) return;

  const index = parseInt(button.getAttribute("data-index"));
  if (isNaN(index)) return;

  if (button.classList.contains('edit-btn')) {
    const teacher = teachers[index];
    document.getElementById("teacherName").value = teacher.name;
    document.getElementById("subject").value = teacher.subject;
    document.getElementById("teacherId").value = teacher.teacherId;
    
    // Update MDL text fields
    const textFields = document.querySelectorAll('.mdl-textfield');
    textFields.forEach(field => {
      field.classList.add('is-dirty');
      field.MaterialTextfield.boundUpdateClassesHandler();
    });

    editingIndex = index;
    teacherForm.querySelector("button[type='submit']").innerHTML = '<i class="material-icons">save</i> Update Teacher';
  }

  if (button.classList.contains('delete-btn')) {
    const dialog = document.createElement('dialog');
    dialog.classList.add('mdl-dialog');
    dialog.innerHTML = `
      <h4 class="mdl-dialog__title">Delete Teacher</h4>
      <div class="mdl-dialog__content">
        <p>Are you sure you want to delete this teacher?</p>
      </div>
      <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button confirm">Delete</button>
        <button type="button" class="mdl-button close">Cancel</button>
      </div>
    `;
    document.body.appendChild(dialog);
    dialogPolyfill.registerDialog(dialog);
    
    dialog.querySelector('.confirm').addEventListener('click', function() {
      teachers.splice(index, 1);
      saveTeachers();
      renderTeachers();
      dialog.close();
      
      const data = {
        message: 'Teacher deleted successfully',
        timeout: 2000
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });

    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });

    dialog.showModal();
  }
});
