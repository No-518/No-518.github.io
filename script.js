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

})();
