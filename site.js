const fallbackPosts = [
  {
    title: "Understanding Phishing Before You Click",
    excerpt: "Phishing attacks remain one of the most common cyber threats. Learn the red flags to watch for and how to respond safely when you receive suspicious emails or messages.",
    url: "news.html",
    source: "BeMight Security",
    category: "Learning Notes",
    published: "2026-04-28",
    external: false
  },
  {
    title: "Why Software Updates Matter",
    excerpt: "Outdated software is one of the easiest ways attackers gain access to systems. Regular updates patch known vulnerabilities and strengthen your security posture.",
    url: "news.html",
    source: "BeMight Security",
    category: "Cybersecurity",
    published: "2026-04-25",
    external: false
  },
  {
    title: "How Public Wi-Fi Can Expose Your Data",
    excerpt: "Using public Wi-Fi without precautions can expose your personal data to interception. Understand the risks and learn practical steps to stay safer on open networks.",
    url: "news.html",
    source: "BeMight Security",
    category: "Cybersecurity",
    published: "2026-04-20",
    external: false
  },
  {
    title: "Ghana Tech Watch: Digital Skills Matter",
    excerpt: "Ghana's growing tech ecosystem needs skilled cybersecurity professionals. How young learners can position themselves for opportunities in the digital economy.",
    url: "news.html",
    source: "BeMight Security",
    category: "Ghana Tech News",
    published: "2026-04-18",
    external: false
  },
  {
    title: "AI Safety Basics for Everyday Users",
    excerpt: "As AI tools become more common, understanding basic safety practices helps users make better decisions about the technology they interact with daily.",
    url: "news.html",
    source: "BeMight Security",
    category: "AI",
    published: "2026-04-15",
    external: false
  },
  {
    title: "Building a Security Mindset as a Beginner",
    excerpt: "Cybersecurity starts with how you think about digital safety. Developing a security-first mindset is the foundation for any defensive security career.",
    url: "news.html",
    source: "BeMight Security",
    category: "Learning Notes",
    published: "2026-04-12",
    external: false
  }
];

function initNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const dropdowns = Array.from(document.querySelectorAll("[data-dropdown]"));
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const hrefPage = href.split("?")[0].split("#")[0];
    if (hrefPage === currentPage || (currentPage === "" && hrefPage === "index.html")) {
      link.classList.add("active");
    }
  });

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector("[data-dropdown-trigger]");
    const menu = dropdown.querySelector(".dropdown-menu");
    if (!trigger || !menu) return;

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const shouldOpen = !dropdown.classList.contains("open");
      closeDropdowns(dropdowns);
      dropdown.classList.toggle("open", shouldOpen);
      trigger.setAttribute("aria-expanded", String(shouldOpen));
    });
  });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      document.body.classList.toggle("nav-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-dropdown]")) closeDropdowns(dropdowns);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdowns(dropdowns);
      if (nav && toggle) {
        nav.classList.remove("open");
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    }
  });
}

function closeDropdowns(dropdowns) {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("open");
    const trigger = dropdown.querySelector("[data-dropdown-trigger]");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  });
}

function initFooterYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function formatDate(value) {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function postCard(post, featured = false) {
  const externalIcon = post.external ? "↗" : "";
  return `
    <article class="news-card${featured ? " featured" : ""}">
      <div class="card-topline">
        <span class="badge">${post.category || "Update"}</span>
        <span>${formatDate(post.published)}</span>
      </div>
      <h3>${escapeHTML(post.title)}</h3>
      <p class="muted">${escapeHTML(post.excerpt || "")}</p>
      <div class="meta-line">
        <span>${escapeHTML(post.source || "BeMight Security")}</span>
      </div>
      <div class="card-actions">
        <a class="btn btn-ghost" href="${post.url || "#"}"${post.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>Read More ${externalIcon}</a>
      </div>
    </article>
  `;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadNewsPosts() {
  try {
    const response = await fetch("data/news.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load news data");
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("News data is empty");
    return data;
  } catch (error) {
    const notice = document.querySelector("[data-news-notice]");
    if (notice) {
      notice.hidden = false;
      notice.textContent = "Live updates could not be loaded right now. Here are selected BeMight Security learning notes.";
    }
    return fallbackPosts;
  }
}

function sortPosts(posts) {
  return [...posts].sort((a, b) => new Date(b.published || 0) - new Date(a.published || 0));
}

function filterPosts(posts, category, search) {
  const normalizedCategory = (category || "All").toLowerCase();
  const query = (search || "").trim().toLowerCase();
  return posts.filter((post) => {
    const categoryMatch = normalizedCategory === "all" || String(post.category || "").toLowerCase() === normalizedCategory;
    const haystack = `${post.title || ""} ${post.excerpt || ""} ${post.source || ""} ${post.category || ""}`.toLowerCase();
    return categoryMatch && (!query || haystack.includes(query));
  });
}

async function initNewsPage() {
  const grid = document.querySelector("[data-news-grid]");
  const featured = document.querySelector("[data-news-featured]");
  if (!grid && !featured) return;

  const allPosts = sortPosts(await loadNewsPosts());
  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get("category") || "All";
  let searchValue = "";
  const searchInput = document.querySelector("[data-news-search]");
  const filterButtons = Array.from(document.querySelectorAll("[data-news-filter]"));

  function render() {
    const filtered = filterPosts(allPosts, activeCategory, searchValue);

    filterButtons.forEach((button) => {
      const isActive = button.dataset.newsFilter === activeCategory || (activeCategory === "All" && button.dataset.newsFilter === "All");
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (featured) {
      const top = filtered.slice(0, 3);
      featured.innerHTML = top.length
        ? `
          ${postCard(top[0], true)}
          <div class="news-side">${top.slice(1).map((post) => postCard(post)).join("")}</div>
        `
        : `<div class="empty-state">No featured updates match your filters.</div>`;
    }

    if (grid) {
      grid.innerHTML = filtered.length
        ? filtered.map((post) => postCard(post)).join("")
        : `<div class="empty-state">No matching updates found. Try another category or search term.</div>`;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.newsFilter || "All";
      const next = new URL(window.location.href);
      if (activeCategory === "All") next.searchParams.delete("category");
      else next.searchParams.set("category", activeCategory);
      window.history.replaceState({}, "", next);
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchValue = searchInput.value;
      render();
    });
  }

  render();
}

async function initHomeNews() {
  const homeNews = document.querySelector("[data-home-news]");
  if (!homeNews) return;
  homeNews.innerHTML = fallbackPosts.slice(0, 3).map((post) => postCard(post)).join("");
  const posts = sortPosts(await loadNewsPosts()).slice(0, 3);
  homeNews.innerHTML = posts.map((post) => postCard(post)).join("");
}

function initProjectFilters() {
  const filters = Array.from(document.querySelectorAll("[data-project-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-project-card]"));
  if (!filters.length || !cards.length) return;

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.projectFilter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      cards.forEach((card) => {
        const show = category === "All" || card.dataset.projectCategory === category;
        card.hidden = !show;
      });
    });
  });
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const reason = formData.get("reason") || "Portfolio contact";
    const message = formData.get("message") || "";
    const subject = encodeURIComponent(`BeMight Security: ${reason}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nReason: ${reason}\n\n${message}`);
    window.location.href = `mailto:bemightsec@gmail.com?subject=${subject}&body=${body}`;
  });
}

function initReveal() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initFooterYear();
  initNewsPage();
  initHomeNews();
  initProjectFilters();
  initContactForm();
  initReveal();
});
