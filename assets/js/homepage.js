const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".nav");

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.setAttribute("aria-label", open ? "打开菜单" : "关闭菜单");
  menuButton.classList.toggle("is-open", !open);
  navigation.classList.toggle("is-open", !open);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.classList.remove("is-open");
    navigation.classList.remove("is-open");
  });
});

if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    observer.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

const tiltCard = document.querySelector("[data-tilt]");
if (tiltCard && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  tiltCard.addEventListener("pointermove", (event) => {
    const bounds = tiltCard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltCard.style.transform = `rotateY(${x * 7}deg) rotateX(${y * -7}deg) rotateZ(2.5deg)`;
  });
  tiltCard.addEventListener("pointerleave", () => {
    tiltCard.style.transform = "rotate(2.5deg)";
  });
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
window.addEventListener("scroll", () => {
  const current = sections.reduce((active, section) => {
    return window.scrollY >= section.offsetTop - 180 ? section.id : active;
  }, "home");
  navLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${current}`));
}, { passive: true });
