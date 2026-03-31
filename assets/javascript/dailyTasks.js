document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.getElementById("task-container");
  const filterButtons = document.querySelectorAll(".task-filters button");

  function loadTasks(filter = "all") {
    const getTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    taskContainer.innerHTML = "";

    let filteredTasks = getTasks.filter(task => task.isDaily);

    if (filter !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.priority === filter);
    }

    filteredTasks.forEach((task) => {
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

      dropdown.append(toggleStatusBtn, deleteBtn);
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
  }

  document.addEventListener("click", () => {
    document.querySelectorAll('.menu-dropdown').forEach(d => d.classList.remove('show'));
  });

  // Load all tasks initially
  loadTasks();

  // Filter button click events
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.dataset.filter;
      loadTasks(filterValue);
    });
  });

  // Modal toggle and flatpickr logic
  const taskForm = document.getElementById("task-form");
  const newTaskBtn = document.querySelector("#new-task-button button");
  const closeModalBtn = document.getElementById("close-modal");
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
      flatpickr(taskDateInput, { dateFormat: "Y-m-d", disableMobile: "true" });
    }
    if (taskStartTimeInput) {
      flatpickr(taskStartTimeInput, { enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, disableMobile: "true" });
    }
    if (taskEndTimeInput) {
      flatpickr(taskEndTimeInput, { enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true, disableMobile: "true" });
    }
  }

  if (newTaskBtn && closeModalBtn && taskForm) {
    newTaskBtn.addEventListener("click", () => {
      taskForm.classList.add("show-modal");
      if (taskDailyInput) {
        taskDailyInput.checked = true;
        taskDailyInput.dispatchEvent(new Event('change'));
      }
    });
    closeModalBtn.addEventListener("click", () => taskForm.classList.remove("show-modal"));
  }

  if (taskForm) {
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
      loadTasks(); // Dynamically reload tasks without full page refresh!
    });
  }
});
