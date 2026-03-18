(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const copyEmailButton = document.getElementById("copy-email-button");
  if (copyEmailButton) {
    const email = copyEmailButton.dataset.email || "";
    const originalText = copyEmailButton.textContent;
    let resetTimer = null;

    const restoreLabel = () => {
      copyEmailButton.textContent = originalText;
      copyEmailButton.dataset.state = "";
    };

    const copyText = async (value) => {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
      }

      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "absolute";
      input.style.left = "-9999px";
      document.body.append(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    };

    copyEmailButton.addEventListener("click", async () => {
      try {
        await copyText(email);
        copyEmailButton.textContent = "Copied email";
        copyEmailButton.dataset.state = "done";
      } catch {
        copyEmailButton.textContent = "Copy failed";
        copyEmailButton.dataset.state = "";
      }

      if (resetTimer) window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(restoreLabel, 1600);
    });
  }

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
})();
