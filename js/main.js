(() => {
  "use strict";

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");

  const applyTheme = (theme) => {
    root.setAttribute("data-bs-theme", theme);
    themeToggle.innerHTML = theme === "dark"
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-stars-fill"></i>';
  };

  applyTheme(storedTheme || "dark");

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
  const toastEl = document.getElementById("formToast");
  const toastBody = document.getElementById("formToastBody");
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  const submitBtn = document.getElementById("submitBtn");
  const submitHtml = submitBtn.innerHTML;

  const showToast = (message, ok) => {
    toastBody.textContent = message;
    toastEl.classList.toggle("text-bg-success", ok);
    toastEl.classList.toggle("text-bg-danger", !ok);
    toast.show();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await res.json();
      if (!res.ok || data.success === "false") throw new Error(data.message || "Request failed");
      showToast("Thanks! Your message has been sent.", true);
      form.reset();
      form.classList.remove("was-validated");
    } catch (err) {
      const fd = new FormData(form);
      const subject = encodeURIComponent(`Portfolio message from ${fd.get("name")}`);
      const body = encodeURIComponent(`${fd.get("message")}\n\nFrom: ${fd.get("name")} <${fd.get("email")}>`);
      window.location.href = `mailto:pavithraakannann@gmail.com?subject=${subject}&body=${body}`;
      showToast("Opening your email app to send the message.", true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitHtml;
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // Reveal on scroll
  const revealTargets = document.querySelectorAll("section .card, .timeline-item, .section-title");
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => observer.observe(el));

  // Stagger siblings within a row
  document.querySelectorAll("section .row").forEach((row) => {
    row.querySelectorAll(":scope > * > .card").forEach((card, i) => {
      card.style.setProperty("--i", i % 6);
    });
  });

  // Scroll progress + active nav link
  const progress = document.getElementById("scrollProgress");
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".navbar .nav-link[href^='#']");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Count-up stats
  const counters = document.querySelectorAll(".counter");
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => countObserver.observe(el));

  // 3D tilt + spotlight on cards and hero avatar
  const fineepointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fineepointer) {
    document.querySelectorAll(".skill-card, .project-card, .stat-card, .edu-card, .contact-card")
      .forEach((card) => card.setAttribute("data-tilt", ""));
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${x * 100}%`);
        el.style.setProperty("--my", `${y * 100}%`);
        el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
        el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
        if (el.classList.contains("hero-avatar-wrap")) {
          el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 14}deg) rotateY(${(x - 0.5) * 14}deg)`;
        }
      });
      el.addEventListener("mouseleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
        if (el.classList.contains("hero-avatar-wrap")) el.style.transform = "";
      });
    });
  }
})();
