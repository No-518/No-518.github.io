(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const recentPosts = document.getElementById("recent-posts");
  if (recentPosts) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);
    const dateFormat = new Intl.DateTimeFormat("en", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    });

    const loadRecentPosts = async () => {
      try {
        const response = await fetch(recentPosts.dataset.feedUrl, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Blog feed unavailable");
        const feed = new DOMParser().parseFromString(await response.text(), "application/xml");
        if (feed.querySelector("parsererror")) throw new Error("Invalid blog feed");

        const posts = Array.from(feed.querySelectorAll("channel > item"))
          .map((item) => ({
            title: item.querySelector("title")?.textContent?.trim(),
            link: item.querySelector("link")?.textContent?.trim(),
            description: item.querySelector("description")?.textContent?.trim(),
            date: new Date(item.querySelector("pubDate")?.textContent || ""),
            translations: Array.from(item.getElementsByTagNameNS("http://www.w3.org/2005/Atom", "link"))
              .filter((link) => link.getAttribute("rel") === "alternate")
              .map((link) => ({
                lang: link.getAttribute("hreflang"),
                href: link.getAttribute("href"),
              }))
              .filter((link) => link.href && ["en", "zh-CN"].includes(link.lang)),
          }))
          .filter((post) => post.title && post.link && !Number.isNaN(post.date.getTime()))
          .sort((a, b) => b.date - a.date)
          .slice(0, 3);

        for (const post of posts) {
          const entry = document.createElement("li");
          entry.className = "writing-entry";
          const date = document.createElement("time");
          date.className = "writing-date";
          date.dateTime = post.date.toISOString();
          date.textContent = dateFormat.format(post.date);
          const copy = document.createElement("div");
          copy.className = "writing-copy";
          const heading = document.createElement("h3");
          const link = document.createElement("a");
          link.href = new URL(post.link, response.url).href;
          link.textContent = post.title;
          heading.append(link);
          copy.append(heading);
          if (post.description) {
            const description = document.createElement("p");
            description.textContent = post.description;
            copy.append(description);
          }
          if (post.translations.length > 1) {
            const languages = document.createElement("nav");
            languages.className = "writing-languages";
            languages.setAttribute("aria-label", "Article language");
            for (const translation of post.translations) {
              const languageLink = document.createElement("a");
              languageLink.href = new URL(translation.href, response.url).href;
              languageLink.hreflang = translation.lang;
              languageLink.lang = translation.lang;
              languageLink.textContent = translation.lang === "en" ? "English" : "中文";
              languages.append(languageLink);
            }
            copy.append(languages);
          }
          entry.append(date, copy);
          recentPosts.append(entry);
        }
        if (posts.length) {
          recentPosts.hidden = false;
          const status = document.getElementById("writing-status");
          if (status) status.hidden = true;
        }
      } catch {
        // Keep the direct blog link usable if the feed is offline or unavailable.
      } finally {
        window.clearTimeout(timeout);
      }
    };
    loadRecentPosts();
  }

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
