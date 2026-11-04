// Sections 12–13 exercise: the "Add a course" form, built by hand with the DOM.
// Run it:  npm run web   → open http://localhost:5500/web/
// Finish src/s11-catalog.js (departments) and src/s13-forms.js first.
import { courses } from "../data/courses.js";
import { departments } from "../src/s11-catalog.js";
import { isComplete, toCourse } from "../src/s13-forms.js";

// Step 1 — select the elements you need (querySelector / querySelectorAll).
const form = document.querySelector("#add-course");
// TODO: fields — every input AND the select inside the form, as a real ARRAY
const fields = Array.from(form.querySelectorAll("input, select"));
// TODO: submit — the submit button
const submit = form.querySelector('button[type="submit"]');
// TODO: departmentSelect, list (#course-list), count (#count), status (#status)
const departmentSelect = form.querySelector('select[name="department"]');
const list = document.querySelector("#course-list");
const count = document.querySelector("#count");
const status = document.querySelector("#status");

// A closure that hands out ids after the catalogue's last one (20).
const nextId = (() => {
  let last = 20;
  return () => ++last;
})();

// Step 2 — fill the department dropdown from the data.
// Hint: departments(courses).map((name) => new Option(name, name))
departments(courses).map((name) => new Option(name, name)).forEach((option) => departmentSelect.add(option));

// Step 3 — read every field into one object: { code, title, department, credits }.
// Hint: reduce over fields with a computed key [field.name].
function readForm() {
  return fields.reduce((acc, field) => {
    if (field.name) {
      acc[field.name] = field.value;
    }
    return acc;
  }, {});
}

// Step 4 — enable the button only when the form is complete.
// Listen for "input" on the FORM (every field's event bubbles up to it).
form.addEventListener("input", () => {
  submit.disabled = !isComplete(readForm());
});

// Step 5 — on "submit": stop the page reload, build the course with
// toCourse(values, nextId), append renderItem(course) to the list,
// update the count and status, reset the form, disable the button again.
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const values = readForm();
  if (!isComplete(values)) return;

  const course = toCourse(values, nextId);
  list.append(renderItem(course));

  count.textContent = list.children.length;
  status.textContent = `Added ${course.code}.`;

  form.reset();
  submit.disabled = true;
});

// Step 6 — one list item per course. Clicking the item toggles the
// "selected" class; clicking Remove removes it WITHOUT also selecting it.
function renderItem(course) {
  // TODO: create <li class="item"><span>CS610 · Compilers · 4 cr</span><button>Remove</button></li>
  // TODO: item click → toggle "selected"; remove click → remove the item (watch the bubbling!)
  const li = document.createElement("li");
  li.className = "item";

  const span = document.createElement("span");
  span.textContent = `${course.code} · ${course.title} · ${course.credits} cr`;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";

  li.addEventListener("click", () => {
    li.classList.toggle("selected");
  });

  removeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    count.textContent = list.children.length;
    status.textContent = `Removed ${course.code}`;
  });

  li.append(span, removeBtn);
  return li;
}
