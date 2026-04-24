const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.getElementById("site-menu");
const navLinks = [...document.querySelectorAll(".top-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const brandMarks = [...document.querySelectorAll(".brand-mark")];

function setMenuState(isOpen) {
  if (!menuToggle || !siteMenu) return;
  siteMenu.classList.toggle("show", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

if (menuToggle && siteMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 760) {
        setMenuState(false);
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      setMenuState(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });
}

if ("IntersectionObserver" in window && navLinks.length && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isMatch = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isMatch);
        });
      });
    },
    {
      rootMargin: "-35% 0px -50% 0px",
      threshold: 0.12
    }
  );

  sections.forEach((section) => observer.observe(section));
}

brandMarks.forEach((mark) => {
  const logo = mark.querySelector(".brand-logo");
  if (!logo) return;

  if (logo.complete && logo.naturalWidth > 0) {
    mark.classList.add("has-logo");
    return;
  }

  logo.addEventListener("load", () => {
    if (logo.naturalWidth > 0) {
      mark.classList.add("has-logo");
    }
  });

  logo.addEventListener("error", () => {
    mark.classList.remove("has-logo");
  });
});
