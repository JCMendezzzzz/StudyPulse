// Elements
const addClassBtn = document.getElementById('addClassBtn');
const addClassModal = document.getElementById('addClassModal');
const closeAddClass = document.getElementById('closeAddClass');
const addClassForm = document.getElementById('addClassForm');
const timetableBody = document.querySelector('#timetable tbody');

// Show the modal when Add Class button clicked
addClassBtn.addEventListener('click', () => {
  addClassModal.classList.add('active');
});

// Close modal when clicking close icon
closeAddClass.addEventListener('click', () => {
  addClassModal.classList.remove('active');
});

// Close modal when clicking outside modal content
window.addEventListener('click', (e) => {
  if (e.target === addClassModal) {
    addClassModal.classList.remove('active');
  }
});

// Load saved classes from localStorage and display them
function loadClasses() {
  const classes = JSON.parse(localStorage.getItem('user_classes')) || [];
  timetableBody.innerHTML = ''; // Clear current table rows

  classes.forEach((cls, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cls.time}</td>
      <td>${cls.room}</td>
      <td>${cls.course}</td>
      <td>${cls.type}</td>
    `;
    timetableBody.appendChild(tr);
  });
}

// Save a new class schedule to localStorage
function saveClass(newClass) {
  const classes = JSON.parse(localStorage.getItem('user_classes')) || [];
  classes.push(newClass);
  localStorage.setItem('user_classes', JSON.stringify(classes));
}

// Handle form submission
addClassForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get values from form inputs
  const time = document.getElementById('classTime').value.trim();
  const room = document.getElementById('classRoom').value.trim();
  const course = document.getElementById('classCourse').value.trim();
  const type = document.getElementById('classType').value;

  // Validate input (basic)
  if (!time || !room || !course || !type) {
    alert('Please fill all fields!');
    return;
  }

  // Create class object
  const newClass = { time, room, course, type };

  // Save and reload timetable
  saveClass(newClass);
  loadClasses();

  // Reset form and close modal
  addClassForm.reset();
  addClassModal.classList.remove('active');
});

// Initialize display on page load
window.addEventListener('DOMContentLoaded', loadClasses);
