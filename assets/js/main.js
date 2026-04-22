function respectsReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initPathDraw(reduceMotion) {
  var drawTargets = document.querySelectorAll("[data-draw-path]");
  if (!drawTargets.length) {
    return;
  }

  drawTargets.forEach(function (svg) {
    var paths = svg.querySelectorAll("path");
    paths.forEach(function (path) {
      try {
        var length = path.getTotalLength();
        path.style.setProperty("--path-length", String(length));
      } catch (error) {
        path.style.setProperty("--path-length", "1000");
      }
    });

    if (reduceMotion) {
      svg.classList.add("is-drawn");
    }
  });

  if (reduceMotion) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    drawTargets.forEach(function (svg) {
      svg.classList.add("is-drawn");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-drawn");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.28,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  drawTargets.forEach(function (svg) {
    observer.observe(svg);
  });
}

function initMobileNav() {
  var toggle = document.querySelector(".nav-toggle");
  if (!toggle) {
    return;
  }

  var navId = toggle.getAttribute("aria-controls");
  var nav = navId ? document.getElementById(navId) : null;
  if (!nav) {
    return;
  }

  function setExpanded(isOpen) {
    toggle.setAttribute("aria-expanded", String(isOpen));
    nav.classList.toggle("is-open", isOpen);
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    setExpanded(!isOpen);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setExpanded(false);
      toggle.focus();
    }
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) {
      setExpanded(false);
    }
  });
}

function initScrollProgress() {
  var progressBar = document.querySelector(".scroll-progress");
  if (!progressBar) {
    return;
  }

  var isTicking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    var scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    var percent = scrollRange > 0 ? (scrollTop / scrollRange) * 100 : 0;
    progressBar.style.width = clamp(percent, 0, 100).toFixed(2) + "%";
    isTicking = false;
  }

  function requestTick() {
    if (isTicking) {
      return;
    }
    window.requestAnimationFrame(updateProgress);
    isTicking = true;
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  updateProgress();
}

function initCurrentYear() {
  var yearText = document.querySelector("[data-current-year]");
  if (!yearText) {
    return;
  }
  yearText.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", function () {
  var reduced = respectsReducedMotion();
  initPathDraw(reduced);
  initMobileNav();
  initScrollProgress();
  initCurrentYear();
});
