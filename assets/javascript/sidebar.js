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
          <a href="#"><i data-lucide="map"></i> Strategic Map</a>
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
