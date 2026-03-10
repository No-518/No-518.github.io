(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) {
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => el.classList.add("is-revealed"));
  } else {
    // Apply stagger delays automatically for lists/grids.
    const setStagger = (selector, stepMs, startMs = 0) => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el, i) => {
        const existing = el.style.getPropertyValue("--d");
        if (!existing) el.style.setProperty("--d", `${startMs + i * stepMs}ms`);
      });
    };

    setStagger(".cards .card[data-reveal]", 70, 0);
    setStagger(".timeline .timeline-item[data-reveal]", 60, 0);

    // Make the header feel like a "page load" animation rather than a scroll reveal.
    document
      .querySelectorAll(".site-header[data-reveal]")
      .forEach((el) => el.classList.add("is-revealed"));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      if (el.classList.contains("is-revealed")) return;
      observer.observe(el);
    });
  }

  const figureDialog = document.getElementById("researchenvbench-figure-dialog");
  if (!figureDialog) return;

  const figureImage = figureDialog.querySelector(".figure-dialog-image");
  const openButtons = document.querySelectorAll(
    '[data-figure-open="researchenvbench-figure-dialog"]',
  );
  const resetButton = figureDialog.querySelector('[data-figure-zoom="reset"]');
  const closeButton = figureDialog.querySelector("[data-figure-close]");
  let scale = 1;

  const clampScale = (value) => Math.max(1, Math.min(2.5, value));
  const applyScale = () => {
    const percent = Math.round(scale * 100);
    if (figureImage) figureImage.style.width = `${percent}%`;
    if (resetButton) resetButton.textContent = `${percent}%`;
  };
  const resetScale = () => {
    scale = 1;
    applyScale();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      resetScale();
      if (typeof figureDialog.showModal === "function") {
        figureDialog.showModal();
      } else if (figureImage?.src) {
        window.open(figureImage.src, "_blank", "noopener");
      }
    });
  });

  figureDialog.querySelectorAll("[data-figure-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-figure-zoom");
      if (action === "in") scale = clampScale(scale + 0.25);
      if (action === "out") scale = clampScale(scale - 0.25);
      if (action === "reset") scale = 1;
      applyScale();
    });
  });

  closeButton?.addEventListener("click", () => figureDialog.close());
  figureDialog.addEventListener("close", resetScale);
  figureDialog.addEventListener("click", (event) => {
    if (event.target === figureDialog) figureDialog.close();
  });

  resetScale();
})();
