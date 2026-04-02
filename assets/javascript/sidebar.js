// ── Auto-reset daily tasks at midnight ──
// Runs on every page load (sidebar is on all pages).
// Compares today's date with the last reset date in localStorage.
// Only tasks with isDaily === true get marked incomplete.
(function resetDailyTasks() {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const lastReset = localStorage.getItem("lastDailyReset");

  if (lastReset !== today) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let changed = false;

    const updated = tasks.map((task) => {
      if (task.isDaily && task.completed) {
        changed = true;
        return { ...task, completed: false };
      }
      return task;
    });

    if (changed) {
      localStorage.setItem("tasks", JSON.stringify(updated));
    }

    localStorage.setItem("lastDailyReset", today);
  }
})();

class TaskSidebar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="nav-bar">
        <h1>Task Master</h1>

        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-btns">
          <a href="/assets/pages/dashboard.html"><i data-lucide="layout-dashboard"></i> Dashboard</a>
          <a href="/assets/pages/allTasks.html"><i data-lucide="calendar"></i> All Tasks</a>
          <a href="/assets/pages/dailyTasks.html"><i data-lucide="sun"></i> Daily Tasks</a>
          <a href="#"><i data-lucide="bar-chart"></i> Performance</a>
          <a href="#"><i data-lucide="settings"></i> Governance</a>
        </div>
      </div>

      <div class="overlay"></div>
    `;

    const hamburger = this.querySelector(".hamburger");
    const sidebar = this.querySelector(".sidebar");
    const overlay = this.querySelector(".overlay");

    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      sidebar.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
      hamburger.classList.remove("active");
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });

    if (window.lucide) {
      lucide.createIcons();
    }
    const links = this.querySelectorAll(".sidebar-btns a");

    links.forEach((link) => {
      if (link.href === window.location.href) {
        link.classList.add("active");
      }

      link.addEventListener("click", () => {
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }
}

customElements.define("task-sidebar", TaskSidebar);
