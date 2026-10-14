(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  var backdrop = document.getElementById("navBackdrop");
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__link[href^="#"]')
  );
  var mobileQuery = window.matchMedia("(max-width: 860px)");

  function setMenu(open) {
    if (!nav || !menu) return;
    nav.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    if (backdrop) backdrop.hidden = !open;
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    if (toggle) toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
  }
  if (backdrop) {
    backdrop.addEventListener("click", function () {
      setMenu(false);
    });
  }

  menu.addEventListener("click", function (e) {
    if (e.target.closest("a") && mobileQuery.matches) setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  mobileQuery.addEventListener("change", function (e) {
    if (!e.matches) setMenu(false);
  });

  window.addEventListener(
    "scroll",
    function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

  var sections = links
    .map(function (a) {
      var id = a.getAttribute("href");
      return id && id.length > 1 ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function syncActive() {
    var offset = nav.offsetHeight + 90;
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= offset) current = section;
    });
    links.forEach(function (a) {
      a.classList.toggle("is-active", current && a.getAttribute("href") === "#" + current.id);
    });
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        syncActive();
        ticking = false;
      });
    },
    { passive: true }
  );

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var delay = Math.min(i * 70, 280);
          setTimeout(function () {
            entry.target.classList.add("is-visible");
          }, delay);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  syncActive();
})();
