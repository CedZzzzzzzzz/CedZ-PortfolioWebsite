/* Theme toggle */
(function () {
    const STORAGE_KEY = 'portfolio-theme';
    const root = document.documentElement;

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    applyTheme(saved || (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.theme-toggle').forEach(button => {
            button.addEventListener('click', () => {
                applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
            });
        });
    });

    window.matchMedia?.('(prefers-color-scheme: light)').addEventListener('change', event => {
        if (!localStorage.getItem(STORAGE_KEY)) applyTheme(event.matches ? 'light' : 'dark');
    });
})();

/* Certifications panel */
(function () {
    const toggle = document.getElementById('certsToggle');
    const panel = document.getElementById('certsPanel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        toggle.classList.toggle('open', open);
        panel.classList.toggle('open', open);
        panel.hidden = !open;
    });
})();

/* Navigation and sticky navigation share one scroll update */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const stickyNav = document.getElementById('stickyNav');
const stickyLinks = stickyNav?.querySelectorAll('.sticky-nav-link') || [];
const sections = [...document.querySelectorAll('section[id]')];

function isMobileMenuView() { return window.innerWidth <= 768; }

function setMenuState(open) {
    if (!hamburger || !navMenu) return;
    const mobileOpen = open && isMobileMenuView();
    hamburger.classList.toggle('active', open);
    navMenu.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', mobileOpen);
    hamburger.setAttribute('aria-expanded', String(open));
    navMenu.setAttribute('aria-hidden', String(!open));
}

function closeMenu(restoreFocus = false) {
    setMenuState(false);
    if (restoreFocus) hamburger?.focus();
}

if (hamburger && navMenu) {
    setMenuState(false);
    hamburger.addEventListener('click', () => setMenuState(!navMenu.classList.contains('active')));
    navLinks.forEach(link => link.addEventListener('click', () => closeMenu()));

    document.addEventListener('click', event => {
        if (!isMobileMenuView() || !navMenu.classList.contains('active')) return;
        if (event.target instanceof Node && !navMenu.contains(event.target) && !hamburger.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) closeMenu(true);
    });

    window.addEventListener('resize', () => {
        if (!isMobileMenuView()) {
            setMenuState(false);
            navMenu.removeAttribute('aria-hidden');
        } else if (!navMenu.classList.contains('active')) {
            navMenu.setAttribute('aria-hidden', 'true');
        }
    });
}

function updateNavigation() {
    const hero = document.getElementById('home');
    if (stickyNav) stickyNav.classList.toggle('visible', (hero?.getBoundingClientRect().bottom || 0) < 60);

    let current = 'home';
    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= 100) current = section.id;
    });

    stickyLinks.forEach(link => link.classList.toggle('active', link.dataset.section === current));
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}

window.addEventListener('scroll', updateNavigation, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();

/* Project filters */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.category;
    filterBtns.forEach(filter => {
        const selected = filter === button;
        filter.classList.toggle('active', selected);
        filter.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach(card => {
        card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category);
    });
}));

/* Project image fallbacks */
document.querySelectorAll('.project-screenshot').forEach(image => {
    const showPlaceholder = () => image.closest('.project-media')?.classList.add('is-placeholder');
    image.addEventListener('error', showPlaceholder);
    if (image.complete && image.naturalWidth === 0) showPlaceholder();
});

/* Reveal cards as they enter the viewport */
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.project-card, .skill-category').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}
