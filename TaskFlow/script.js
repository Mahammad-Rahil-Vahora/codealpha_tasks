const STORAGE_KEY = "taskflow_tasks_v2";

let tasks = [];
let currentFilter = "all";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const dueDateInput = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const emptyMessage = document.getElementById("emptyMessage");
const filterTabs = document.getElementById("filterTabs");
const clearCompletedBtn = document.getElementById("clearCompleted");

const todayDateEl = document.getElementById("todayDate");
const statTotal = document.getElementById("statTotal");
const statActive = document.getElementById("statActive");
const statDone = document.getElementById("statDone");
const statPercent = document.getElementById("statPercent");
const progressFill = document.getElementById("progressFill");

document.addEventListener("DOMContentLoaded", init);

function init() {
  showTodayDate();
  loadTasks();
  render();
  taskInput.focus();
}

function showTodayDate() {
  todayDateEl.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    tasks = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to load tasks:", error);
    tasks = [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    alert("Tasks could not be saved in this browser.");
    console.error("Unable to save tasks:", error);
  }
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    text,
    priority: prioritySelect.value,
    dueDate: dueDateInput.value || "",
    completed: false,
    createdAt: new Date().toISOString()
  });

  saveTasks();
  taskForm.reset();
  prioritySelect.value = "medium";
  render();
  taskInput.focus();
});

filterTabs.addEventListener("click", function (event) {
  const button = event.target.closest(".filter-tab");
  if (!button) return;

  currentFilter = button.dataset.filter;

  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.classList.toggle("active", tab === button);
  });

  render();
});

clearCompletedBtn.addEventListener("click", function () {
  const completedCount = tasks.filter(task => task.completed).length;

  if (!completedCount) {
    alert("There are no completed tasks to clear.");
    return;
  }

  if (confirm(`Remove ${completedCount} completed task(s)?`)) {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    render();
  }
});

function toggleComplete(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;

  if (confirm(`Delete "${task.text}"?`)) {
    tasks = tasks.filter(item => item.id !== id);
    saveTasks();
    render();
  }
}

function editTask(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;

  const newText = prompt("Edit task title:", task.text);
  if (newText === null) return;

  const cleanText = newText.trim();
  if (!cleanText) {
    alert("Task title cannot be empty.");
    return;
  }

  task.text = cleanText;
  saveTasks();
  render();
}

function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    return tasks.filter(task => task.completed);
  }

  return tasks;
}

function render() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    emptyState.classList.add("show");

    emptyMessage.textContent =
      currentFilter === "all"
        ? "Add your first task above."
        : `No ${currentFilter} tasks found.`;
  } else {
    emptyState.classList.remove("show");

    filteredTasks.forEach(task => {
      taskList.appendChild(createTaskElement(task));
    });
  }

  updateStats();
}

function createTaskElement(task) {
  const li = document.createElement("li");

  li.className =
    `task-item priority-${task.priority}` +
    (task.completed ? " completed" : "");

  const checkButton = document.createElement("button");
  checkButton.className =
    "task-check" + (task.completed ? " checked" : "");
  checkButton.type = "button";
  checkButton.setAttribute(
    "aria-label",
    task.completed ? "Mark task active" : "Mark task complete"
  );

  if (task.completed) {
    checkButton.innerHTML = '<i class="bi bi-check-lg"></i>';
  }

  checkButton.addEventListener("click", () => toggleComplete(task.id));

  const body = document.createElement("div");
  body.className = "task-body";

  const text = document.createElement("div");
  text.className = "task-text";
  text.textContent = task.text;

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const priority = document.createElement("span");
  priority.textContent = `${capitalize(task.priority)} priority`;
  meta.appendChild(priority);

  if (task.dueDate) {
    const due = document.createElement("span");
    due.textContent = `• Due ${formatDate(task.dueDate)}`;
    meta.appendChild(due);
  }

  body.appendChild(text);
  body.appendChild(meta);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "edit-btn";
  editButton.innerHTML = '<i class="bi bi-pencil"></i>';
  editButton.setAttribute("aria-label", "Edit task");
  editButton.addEventListener("click", () => editTask(task.id));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-btn";
  deleteButton.innerHTML = '<i class="bi bi-trash3"></i>';
  deleteButton.setAttribute("aria-label", "Delete task");
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  actions.append(editButton, deleteButton);
  li.append(checkButton, body, actions);

  return li;
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  statTotal.textContent = total;
  statActive.textContent = active;
  statDone.textContent = completed;
  statPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
}
