

document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.querySelector(".menu-toggle");
    const submenu = document.querySelector("nav");

    toggle.addEventListener("click", function() {
        submenu.classList.toggle("active");
    });
});

