(() => {
  "use strict";

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const applyTheme = (theme) => {
    root.setAttribute("data-bs-theme", theme);
    themeToggle.innerHTML = theme === "dark"
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-stars-fill"></i>';
  };

  applyTheme(storedTheme || (prefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });

  // Typing effect
  const roles = ["React", "Next.js", "Angular", "TypeScript", "PHP", "Full-stack"];
  const typed = document.querySelector(".typed");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const word = roles[roleIndex];
    typed.textContent = word.slice(0, charIndex);
    if (!deleting && charIndex < word.length) {
      charIndex++;
      setTimeout(type, 110);
    } else if (deleting && charIndex > 0) {
      charIndex--;
      setTimeout(type, 60);
    } else {
      deleting = !deleting;
      if (!deleting) roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, deleting ? 1400 : 300);
    }
  };
  type();

  // Project filter
  const filterButtons = document.querySelectorAll("#projectFilter [data-filter]");
  const projects = document.querySelectorAll(".project-item");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      projects.forEach((item) => {
        const match = filter === "all" || item.dataset.category.split(" ").includes(filter);
        item.classList.toggle("hidden", !match);
      });
    });
  });

  // Collapse navbar on link click (mobile)
  const navCollapse = document.getElementById("navMenu");
  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });
  navCollapse.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navCollapse.classList.contains("show")) bsCollapse.hide();
    });
  });

  // Back to top
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 400);
  });

  // Contact form validation
  const form = document.getElementById("contactForm");
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("formToast"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    toast.show();
    form.reset();
    form.classList.remove("was-validated");
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
