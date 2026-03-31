const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element) => observer.observe(element));

const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

function setActiveLink(targetId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${targetId}`;
    link.classList.toggle("active", isActive);
  });
}

function getHeaderHeight() {
  const header = document.querySelector(".site-header");
  return header ? header.getBoundingClientRect().height : 0;
}

function scrollToSection(targetSection) {
  const headerHeight = getHeaderHeight();
  const viewportHeight = window.innerHeight;
  const sectionRect = targetSection.getBoundingClientRect();
  const sectionTop = sectionRect.top + window.scrollY;
  const visibleAreaHeight = viewportHeight - headerHeight;
  const centeredTop = sectionTop - headerHeight - (visibleAreaHeight - sectionRect.height) / 2;
  const maxScroll = document.documentElement.scrollHeight - viewportHeight;
  const targetTop = Math.max(0, Math.min(centeredTop, maxScroll));

  window.scrollTo({
    top: targetTop,
    behavior: "smooth",
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href")?.replace("#", "");
    if (!targetId) return;

    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    setActiveLink(targetId);
    scrollToSection(targetSection);
  });
});

function updateActiveByViewport() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const centerY = scrollY + viewportHeight / 2;
  const nearBottom = scrollY + viewportHeight >= document.documentElement.scrollHeight - 4;

  if (nearBottom && sections.length > 0) {
    setActiveLink(sections[sections.length - 1].id);
    return;
  }

  let activeId = "";

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (centerY >= top && centerY < bottom) {
      activeId = section.id;
    }
  });

  if (activeId) {
    setActiveLink(activeId);
  }
}

window.addEventListener("scroll", updateActiveByViewport, { passive: true });
window.addEventListener("resize", updateActiveByViewport);
updateActiveByViewport();
