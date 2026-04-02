// User's first name and dashboard stats
document.addEventListener("DOMContentLoaded", function () {
  function loadUser() {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    const userElement = document.getElementById("username");

    if (userData) {
      userElement.textContent = userData.firstName;
    } else {
      userElement.textContent = "Guest";
    }
  }

  function loadDashboardStats() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = tasks.filter((t) => {
      if (t.completed || !t.date) return false;
      const taskDate = new Date(t.date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate < today;
    }).length;

    const totalEl = document.getElementById("total-tasks");
    const completedEl = document.getElementById("completed-tasks");
    const pendingEl = document.getElementById("pending-tasks");
    const overdueEl = document.getElementById("overdue-tasks");

    if (totalEl) totalEl.textContent = total;
    if (completedEl) completedEl.textContent = completed;
    if (pendingEl) pendingEl.textContent = pending;
    if (overdueEl) overdueEl.textContent = overdue;
  }

  loadUser();
  loadDashboardStats();
});

// Create new task
const taskForm = document.getElementById("task-form");

// Modal toggle logic
const newTaskBtn = document.querySelector("#new-task-button button");
const closeModalBtn = document.getElementById("close-modal");

if (newTaskBtn && closeModalBtn) {
  newTaskBtn.addEventListener("click", () => {
    taskForm.classList.add("show-modal");
  });
  closeModalBtn.addEventListener("click", () => {
    taskForm.classList.remove("show-modal");
  });
}

const taskDateInput = document.getElementById("task-date");
const taskStartTimeInput = document.getElementById("task-start-time");
const taskEndTimeInput = document.getElementById("task-end-time");
const taskDailyInput = document.getElementById("task-daily");

if (taskDailyInput && taskDateInput) {
  taskDailyInput.addEventListener("change", (e) => {
    if (e.target.checked) {
      taskDateInput.disabled = true;
      taskDateInput.required = false;
      taskDateInput.value = "";
      taskDateInput.style.opacity = "0.5";
      taskDateInput.style.cursor = "not-allowed";
    } else {
      taskDateInput.disabled = false;
      taskDateInput.required = true;
      taskDateInput.style.opacity = "1";
      taskDateInput.style.cursor = "text";
    }
  });
}

if (typeof flatpickr !== 'undefined') {
  if (taskDateInput) {
    flatpickr(taskDateInput, {
      dateFormat: "Y-m-d",
      disableMobile: "true"
    });
  }
  if (taskStartTimeInput) {
    flatpickr(taskStartTimeInput, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true,
      disableMobile: "true"
    });
  }
  if (taskEndTimeInput) {
    flatpickr(taskEndTimeInput, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true,
      disableMobile: "true"
    });
  }
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const taskTitle = document.getElementById("task-title").value;
  const taskDesc = document.getElementById("task-desc").value;
  const taskPriority = document.getElementById("task-priority").value;
  const taskDate = document.getElementById("task-date").value;
  const taskStartTime = document.getElementById("task-start-time").value;
  const taskEndTime = document.getElementById("task-end-time").value;
  const taskDaily = document.getElementById("task-daily").checked;

  const newTask = {
    id: Date.now(),
    title: taskTitle,
    desc: taskDesc,
    priority: taskPriority,
    date: taskDate,
    startTime: taskStartTime,
    endTime: taskEndTime,
    isDaily: taskDaily,
    completed: false,
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  alert("Task saved ✅");

  taskForm.reset();
  taskForm.classList.remove("show-modal");
  window.location.reload(); // Refresh the list
});

// Get all critical tasks only
document.addEventListener("DOMContentLoaded", function () {
  function loadTasks() {
    const getTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskContainer = document.getElementById("task-container");

    taskContainer.innerHTML = "";

    getTasks.forEach((task) => {
      if (task.priority !== "critical") return;

      const taskDiv = document.createElement("div");
      taskDiv.classList.add("task-card");

      const headerDiv = document.createElement("div");
      headerDiv.classList.add("card-header");

      const taskH3 = document.createElement("h3");
      taskH3.classList.add("task-title");
      taskH3.textContent = task.title;

      const actionsDiv = document.createElement("div");
      actionsDiv.classList.add("task-actions");

      const taskSpan = document.createElement("span");
      taskSpan.classList.add("task-priority");
      taskSpan.textContent = task.priority;

      const menuContainer = document.createElement("div");
      menuContainer.style.position = "relative";
      const menuBtn = document.createElement("button");
      menuBtn.classList.add("menu-btn");
      menuBtn.innerHTML = "<span class='material-symbols-outlined'>more_vert</span>";

      const dropdown = document.createElement("div");
      dropdown.classList.add("menu-dropdown");

      const toggleStatusBtn = document.createElement("button");
      toggleStatusBtn.textContent = task.completed ? "Mark Incomplete" : "Mark Complete";
      toggleStatusBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        const updateTasks = tasks.map((t) => t.id === task.id ? { ...t, completed: !t.completed } : t);
        localStorage.setItem("tasks", JSON.stringify(updateTasks));
        location.reload();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete Task";
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        const updateTasks = tasks.filter((t) => t.id !== task.id);
        localStorage.setItem("tasks", JSON.stringify(updateTasks));
        location.reload();
      });

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit Task";
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.remove("show");
        openEditModal(task);
      });

      dropdown.append(toggleStatusBtn, editBtn, deleteBtn);
      menuContainer.append(menuBtn, dropdown);

      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll('.menu-dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('show');
        });
        dropdown.classList.toggle("show");
      });

      actionsDiv.append(taskSpan, menuContainer);
      headerDiv.append(taskH3, actionsDiv);

      const taskP = document.createElement("p");
      taskP.classList.add("task-desc");
      taskP.textContent = task.desc;

      const taskSmall = document.createElement("small");
      taskSmall.classList.add("task-date");
      let timeText = "";
      if (task.startTime && task.endTime) {
        timeText = `${task.startTime} - ${task.endTime}`;
      }
      
      if (task.isDaily || !task.date) {
        taskSmall.textContent = timeText;
      } else {
        taskSmall.textContent = timeText ? `${task.date} | ${timeText}` : task.date;
      }

      taskDiv.append(headerDiv, taskP, taskSmall);

      const completeBtn = document.createElement("button");
      completeBtn.textContent = "Mark Complete";
      completeBtn.classList.add("complete-btn");
      completeBtn.addEventListener("click", () => {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        const updateTasks = tasks.map((t) => {
          if (t.id === task.id) {
            return { ...t, completed: true };
          }
          return t;
        });
        localStorage.setItem("tasks", JSON.stringify(updateTasks));
        location.reload();
      });

      if (task.completed) {
        const completedText = document.createElement("span");
        completedText.textContent = "✅ Completed";
        completedText.classList.add("completed");
        taskDiv.appendChild(completedText);
      } else {
        taskDiv.appendChild(completeBtn);
      }

      taskContainer.appendChild(taskDiv);
    });

    const criticalCount = getTasks.filter(t => t.priority === "critical").length;
    if (criticalCount === 0) {
      const addCard = document.createElement("div");
      addCard.classList.add("task-card", "add-task-card");
      addCard.innerHTML = `<span class="add-task-icon">+</span><p>Add New Task</p>`;
      addCard.addEventListener("click", () => {
        const taskForm = document.getElementById("task-form");
        if (taskForm) taskForm.classList.add("show-modal");
      });
      taskContainer.appendChild(addCard);
    }
  }
  
  document.addEventListener("click", () => {
    document.querySelectorAll('.menu-dropdown').forEach(d => d.classList.remove('show'));
  });

  loadTasks();

  // ── Edit Task Modal Logic ──
  const editForm = document.getElementById("edit-task-form");
  const closeEditModalBtn = document.getElementById("close-edit-modal");
  const editDateInput = document.getElementById("edit-task-date");
  const editStartTimeInput = document.getElementById("edit-task-start-time");
  const editEndTimeInput = document.getElementById("edit-task-end-time");
  const editDailyInput = document.getElementById("edit-task-daily");

  if (editDailyInput && editDateInput) {
    editDailyInput.addEventListener("change", (e) => {
      if (e.target.checked) {
        editDateInput.disabled = true;
        editDateInput.required = false;
        editDateInput.value = "";
        editDateInput.style.opacity = "0.5";
        editDateInput.style.cursor = "not-allowed";
      } else {
        editDateInput.disabled = false;
        editDateInput.required = true;
        editDateInput.style.opacity = "1";
        editDateInput.style.cursor = "text";
      }
    });
  }

  let editDatePicker, editStartPicker, editEndPicker;
  if (typeof flatpickr !== 'undefined') {
    if (editDateInput) editDatePicker = flatpickr(editDateInput, { dateFormat: "Y-m-d", disableMobile: "true" });
    if (editStartTimeInput) editStartPicker = flatpickr(editStartTimeInput, { enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, disableMobile: "true" });
    if (editEndTimeInput) editEndPicker = flatpickr(editEndTimeInput, { enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, disableMobile: "true" });
  }

  if (closeEditModalBtn && editForm) {
    closeEditModalBtn.addEventListener("click", () => editForm.classList.remove("show-modal"));
  }

  function openEditModal(task) {
    document.getElementById("edit-task-id").value = task.id;
    document.getElementById("edit-task-title").value = task.title;
    document.getElementById("edit-task-desc").value = task.desc;
    document.getElementById("edit-task-priority").value = task.priority;

    if (editStartPicker) editStartPicker.setDate(task.startTime || "", true);
    else if (editStartTimeInput) editStartTimeInput.value = task.startTime || "";

    if (editEndPicker) editEndPicker.setDate(task.endTime || "", true);
    else if (editEndTimeInput) editEndTimeInput.value = task.endTime || "";

    if (editDailyInput) editDailyInput.checked = !!task.isDaily;

    if (task.isDaily) {
      editDateInput.disabled = true;
      editDateInput.required = false;
      editDateInput.value = "";
      editDateInput.style.opacity = "0.5";
      editDateInput.style.cursor = "not-allowed";
    } else {
      editDateInput.disabled = false;
      editDateInput.required = true;
      editDateInput.style.opacity = "1";
      editDateInput.style.cursor = "text";
      if (editDatePicker) editDatePicker.setDate(task.date || "", true);
      else editDateInput.value = task.date || "";
    }

    editForm.classList.add("show-modal");
  }

  if (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const taskId = Number(document.getElementById("edit-task-id").value);
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const updated = tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            title: document.getElementById("edit-task-title").value,
            desc: document.getElementById("edit-task-desc").value,
            priority: document.getElementById("edit-task-priority").value,
            date: document.getElementById("edit-task-date").value,
            startTime: document.getElementById("edit-task-start-time").value,
            endTime: document.getElementById("edit-task-end-time").value,
            isDaily: document.getElementById("edit-task-daily").checked,
          };
        }
        return t;
      });
      localStorage.setItem("tasks", JSON.stringify(updated));
      alert("Task updated ✅");
      editForm.classList.remove("show-modal");
      loadTasks();
      loadDashboardStats();
    });
  }
});
