const sidebarToggle = document.querySelector("#sidebar-toggle");
const sidebar = document.querySelector("#sidebar");

sidebarToggle.addEventListener("click", function() {
    sidebar.classList.toggle("collapsed");
});