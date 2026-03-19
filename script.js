const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const cursorGlow = document.querySelector(".cursor-glow");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sectionTargets = Array.from(document.querySelectorAll("main section[id], footer[id]"));

const closeMenu = () => {
    if (!header || !menuToggle) {
        return;
    }

    header.classList.remove("nav-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
};

// Mobile navigation
if (header && menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("nav-open");
        document.body.classList.toggle("menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    document.addEventListener("click", (event) => {
        const clickTarget = event.target;

        if (!(clickTarget instanceof Node)) {
            return;
        }

        if (!header.classList.contains("nav-open")) {
            return;
        }

        if (!header.contains(clickTarget)) {
            closeMenu();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
        closeMenu();
    }
});

// Header state on scroll
const syncHeaderState = () => {
    document.body.classList.toggle("nav-scrolled", window.scrollY > 18);
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

// Brand filtering
const filterButtons = document.querySelectorAll(".filter-button");
const brandCards = document.querySelectorAll(".brand-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");

        brandCards.forEach((card) => {
            const categories = card.dataset.category || "";
            const isMatch = selectedFilter === "all" || categories.includes(selectedFilter);
            card.classList.toggle("is-hidden", !isMatch);
        });
    });
});

// Expandable brand details
document.querySelectorAll(".read-more").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".brand-card");

        if (!card) {
            return;
        }

        const isExpanded = card.classList.toggle("expanded");
        button.setAttribute("aria-expanded", String(isExpanded));
        button.textContent = isExpanded ? "Read less" : "Read more";
    });
});

// Reveal animation with stagger
const revealElements = document.querySelectorAll(".reveal");

revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16
    });

    revealElements.forEach((element) => revealObserver.observe(element));
}
else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

// Active navigation highlighting
if ("IntersectionObserver" in window && navLinks.length && sectionTargets.length) {
    const visibleSections = new Map();

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                visibleSections.set(entry.target.id, entry.intersectionRatio);
            }
            else {
                visibleSections.delete(entry.target.id);
            }
        });

        let activeId = sectionTargets[0]?.id || "";

        visibleSections.forEach((ratio, id) => {
            if (!activeId || ratio > (visibleSections.get(activeId) || 0)) {
                activeId = id;
            }
        });

        navLinks.forEach((link) => {
            const target = link.getAttribute("href");
            link.classList.toggle("is-active", target === `#${activeId}`);
        });
    }, {
        threshold: [0.2, 0.35, 0.5, 0.7],
        rootMargin: "-10% 0px -40% 0px"
    });

    sectionTargets.forEach((section) => sectionObserver.observe(section));
}

// Cursor glow for desktop
if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("pointermove", (event) => {
        cursorGlow.style.opacity = "1";
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });

    document.addEventListener("pointerleave", () => {
        cursorGlow.style.opacity = "0";
    });
}

// Subtle tilt interaction
if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            const rotateY = ((offsetX / rect.width) - 0.5) * 8;
            const rotateX = ((offsetY / rect.height) - 0.5) * -8;

            card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });
}
