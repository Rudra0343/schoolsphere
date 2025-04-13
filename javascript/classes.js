// Initialize MDL components
function upgradeMDL() {
  componentHandler.upgradeAllRegistered();
}

const classForm = document.getElementById("classForm");
const classTableBody = document.querySelector("#classTable");
const roomNumberInput = document.getElementById("roomNumber");

let classes = JSON.parse(localStorage.getItem("classes")) || [];
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

  // Only allow numbers in Room Number
  roomNumberInput?.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, '');
  });

  renderClasses();
});

// Render class rows
function renderClasses() {
  classTableBody.innerHTML = "";
  classes.forEach((cls, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="mdl-data-table__cell--non-numeric">${cls.className}</td>
      <td class="mdl-data-table__cell--non-numeric">${cls.section}</td>
      <td>${cls.roomNumber}</td>
      <td class="mdl-data-table__cell--non-numeric">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored edit-btn" data-index="${index}">
          <i class="material-icons">edit</i> Edit
        </button>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent delete-btn" data-index="${index}">
          <i class="material-icons">delete</i> Delete
        </button>
      </td>
    `;
    classTableBody.appendChild(row);
  });
  upgradeMDL();
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

  if (!className || !section || !roomNumber) {
    const data = { message: 'Please fill in all fields' };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    return;
  }

  const newClass = { className, section, roomNumber };

  // Check for duplicate room number
  const isDuplicateRoom = editingIndex === null && 
    classes.some(c => c.roomNumber === roomNumber);
  
  if (isDuplicateRoom) {
    const data = { message: 'This room number is already assigned to another class' };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    return;
  }

  if (editingIndex !== null) {
    classes[editingIndex] = newClass;
    editingIndex = null;
    classForm.querySelector("button[type='submit']").innerHTML = '<i class="material-icons">add</i> Add Class';
  } else {
    classes.push(newClass);
  }

  saveClasses();
  renderClasses();
  classForm.reset();
  
  // Reset MDL textfields
  const textFields = document.querySelectorAll('.mdl-textfield');
  textFields.forEach(field => {
    field.classList.remove('is-dirty');
    field.MaterialTextfield.boundUpdateClassesHandler();
  });

  const data = {
    message: editingIndex !== null ? 'Class updated successfully' : 'Class added successfully',
    timeout: 2000
  };
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
});

// Handle edit/delete buttons
classTableBody?.addEventListener("click", function (e) {
  const button = e.target.closest('button');
  if (!button) return;
  
  const index = parseInt(button.getAttribute("data-index"));
  if (isNaN(index)) return;

  if (button.classList.contains('edit-btn')) {
    const cls = classes[index];
    document.getElementById("class").value = cls.className;
    document.getElementById("section").value = cls.section;
    document.getElementById("roomNumber").value = cls.roomNumber;
    
    // Update MDL text fields
    const textFields = document.querySelectorAll('.mdl-textfield');
    textFields.forEach(field => {
      field.classList.add('is-dirty');
      field.MaterialTextfield.boundUpdateClassesHandler();
    });

    editingIndex = index;
    classForm.querySelector("button[type='submit']").innerHTML = '<i class="material-icons">save</i> Update Class';
  }

  if (button.classList.contains('delete-btn')) {
    const dialog = document.createElement('dialog');
    dialog.classList.add('mdl-dialog');
    dialog.innerHTML = `
      <h4 class="mdl-dialog__title">Delete Class</h4>
      <div class="mdl-dialog__content">
        <p>Are you sure you want to delete this class?</p>
      </div>
      <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button confirm">Delete</button>
        <button type="button" class="mdl-button close">Cancel</button>
      </div>
    `;
    document.body.appendChild(dialog);
    dialogPolyfill.registerDialog(dialog);
    
    dialog.querySelector('.confirm').addEventListener('click', function() {
      classes.splice(index, 1);
      saveClasses();
      editingIndex = null;
      classForm.reset();
      renderClasses();
      dialog.close();
      
      const data = {
        message: 'Class deleted successfully',
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
