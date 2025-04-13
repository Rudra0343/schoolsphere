// Initialize MDL components
function upgradeMDL() {
  componentHandler.upgradeAllRegistered();
}

const studentForm = document.getElementById("studentForm");
const studentTableBody = document.querySelector("#studentTable");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editingIndex = null;

// Populate dropdowns
function populateDropdowns() {
  const classes = JSON.parse(localStorage.getItem("classes")) || [];
  const teachers = JSON.parse(localStorage.getItem("teachers")) || [];
  
  const classSelect = document.getElementById("class");
  const teacherSelect = document.getElementById("teacher");
  
  classSelect.innerHTML = '<option value="">Select Class</option>';
  teacherSelect.innerHTML = '<option value="">Select Teacher</option>';
  
  classes.forEach(cls => {
    classSelect.innerHTML += `
      <option value="${cls.className}-${cls.section}">${cls.className}-${cls.section}</option>
    `;
  });
  
  teachers.forEach(teacher => {
    teacherSelect.innerHTML += `
      <option value="${teacher.name}">${teacher.name} (${teacher.subject})</option>
    `;
  });

  upgradeMDL();
}

// Generate roll number for new students
function generateRollNumber(className) {
  const classStudents = students.filter(student => student.className === className);
  return (classStudents.length + 1).toString().padStart(2, '0');
}

// Render students table
function renderStudents() {
  studentTableBody.innerHTML = "";
  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="mdl-data-table__cell--non-numeric">${student.name}</td>
      <td class="mdl-data-table__cell--non-numeric">${student.className}</td>
      <td>${student.rollNumber}</td>
      <td class="mdl-data-table__cell--non-numeric">${student.teacher}</td>
      <td>${student.contactNumber}</td>
      <td class="mdl-data-table__cell--non-numeric">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored edit-btn" data-index="${index}">
          <i class="material-icons">edit</i> Edit
        </button>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent delete-btn" data-index="${index}">
          <i class="material-icons">delete</i> Delete
        </button>
      </td>
    `;
    studentTableBody.appendChild(row);
  });
  upgradeMDL();
}

// Save to LocalStorage
function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Handle form submission
studentForm?.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const className = document.getElementById("class").value;
  const teacher = document.getElementById("teacher").value;
  const contactNumber = document.getElementById("contactNumber").value.trim();

  if (!name || !className || !teacher || !contactNumber) {
    const data = { message: 'Please fill in all fields' };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    return;
  }

  const rollNumber = editingIndex !== null 
    ? students[editingIndex].rollNumber 
    : generateRollNumber(className);

  const newStudent = { 
    name, 
    className, 
    rollNumber,
    teacher,
    contactNumber 
  };

  if (editingIndex !== null) {
    students[editingIndex] = newStudent;
    editingIndex = null;
    studentForm.querySelector("button[type='submit']").innerHTML = '<i class="material-icons">add</i> Add Student';
  } else {
    students.push(newStudent);
  }

  saveStudents();
  renderStudents();
  studentForm.reset();
  
  // Reset MDL textfields
  const textFields = document.querySelectorAll('.mdl-textfield');
  textFields.forEach(field => {
    field.classList.remove('is-dirty');
    field.MaterialTextfield.boundUpdateClassesHandler();
  });

  const data = {
    message: editingIndex !== null ? 'Student updated successfully' : 'Student added successfully',
    timeout: 2000
  };
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
});

// Handle edit/delete buttons
studentTableBody?.addEventListener("click", function (e) {
  const button = e.target.closest('button');
  if (!button) return;
  
  const index = parseInt(button.getAttribute("data-index"));
  if (isNaN(index)) return;

  if (button.classList.contains('edit-btn')) {
    const student = students[index];
    document.getElementById("name").value = student.name;
    document.getElementById("class").value = student.className;
    document.getElementById("teacher").value = student.teacher;
    document.getElementById("contactNumber").value = student.contactNumber;
    
    // Update MDL text fields
    const textFields = document.querySelectorAll('.mdl-textfield');
    textFields.forEach(field => {
      field.classList.add('is-dirty');
      field.MaterialTextfield.boundUpdateClassesHandler();
    });

    editingIndex = index;
    studentForm.querySelector("button[type='submit']").innerHTML = '<i class="material-icons">save</i> Update Student';
    renderStudents();
  }

  if (button.classList.contains('delete-btn')) {
    const dialog = document.createElement('dialog');
    dialog.classList.add('mdl-dialog');
    dialog.innerHTML = `
      <h4 class="mdl-dialog__title">Delete Student</h4>
      <div class="mdl-dialog__content">
        <p>Are you sure you want to delete this student?</p>
      </div>
      <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button confirm">Delete</button>
        <button type="button" class="mdl-button close">Cancel</button>
      </div>
    `;
    document.body.appendChild(dialog);
    dialogPolyfill.registerDialog(dialog);
    
    dialog.querySelector('.confirm').addEventListener('click', function() {
      students.splice(index, 1);
      saveStudents();
      editingIndex = null;
      studentForm.reset();
      renderStudents();
      dialog.close();
      
      const data = {
        message: 'Student deleted successfully',
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
  
  populateDropdowns();
  renderStudents();
  upgradeMDL();
});