(() => {
  const nav = document.getElementById("nav");
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach((el) => io.observe(el));

  // Active nav link
  const sections = [...document.querySelectorAll("section[id], header[id]")];
  const links = [...document.querySelectorAll('.navbar-nav .nav-link[href^="#"]')];
  const markActive = () => {
    const y = window.scrollY + 120;
    let current = "inicio";
    sections.forEach((sec) => {
      if (sec.offsetTop <= y) current = sec.id;
    });
    links.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", markActive, { passive: true });
  markActive();

  // Count-up stats
  const stats = document.querySelectorAll("[data-count]");
  const countIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute("data-count") || "0");
        const start = performance.now();
        const dur = 900;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIo.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  stats.forEach((el) => countIo.observe(el));

  // Close mobile menu on link click
  const collapse = document.getElementById("menu");
  if (collapse && window.bootstrap) {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse, {
      toggle: false,
    });
    links.forEach((a) => {
      a.addEventListener("click", () => {
        if (collapse.classList.contains("show")) bsCollapse.hide();
      });
    });
  }
})();
