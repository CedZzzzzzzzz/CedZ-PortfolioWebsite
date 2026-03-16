(function () {
    const toggle = document.getElementById('certsToggle');
    const list   = document.getElementById('certList');
    if (!toggle || !list) return;

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !expanded);
        list.classList.toggle('open', !expanded);
    });
})();

(function () {
    const stickyNav = document.getElementById('stickyNav');
    if (!stickyNav) return;

    const hero = document.getElementById('home');
    const sections = ['home','about','experience','projects','skills','contact']
        .map(id => document.getElementById(id))
        .filter(Boolean);
    const stickyLinks = stickyNav.querySelectorAll('.sticky-nav-link');

    function updateStickyNav() {
        const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;

        // Show/hide
        if (heroBottom < 60) {
            stickyNav.classList.add('visible');
        } else {
            stickyNav.classList.remove('visible');
        }

        // Highlight active section
        let current = 'home';
        sections.forEach(sec => {
            if (sec.getBoundingClientRect().top <= 100) {
                current = sec.id;
            }
        });

        stickyLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    }

    window.addEventListener('scroll', updateStickyNav, { passive: true });
    updateStickyNav();
})();


(function () {
    const box = document.querySelector('.hero-visual-box');
    if (!box) return;

    // Glowing cursor element
    const cursor = document.createElement('div');
    cursor.classList.add('visual-cursor');
    box.appendChild(cursor);

    // Trail dots
    const TRAIL_COUNT = 10;
    const trail = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const dot = document.createElement('div');
        dot.classList.add('visual-trail');
        box.appendChild(dot);
        trail.push({ el: dot });
    }

    const orbs = [
        document.querySelector('.orb-1'),
        document.querySelector('.orb-2'),
        document.querySelector('.orb-3'),
        document.querySelector('.orb-4'),
    ].filter(Boolean);

    let mouseX = 0.5, mouseY = 0.5;
    let curX = 0, curY = 0;
    let inside = false;
    const trailHistory = Array(TRAIL_COUNT * 2).fill(null).map(() => ({ x: 0, y: 0 }));

    box.addEventListener('mouseenter', () => {
        inside = true;
        cursor.style.opacity = '1';
    });

    box.addEventListener('mouseleave', () => {
        inside = false;
        cursor.style.opacity = '0';
        trail.forEach(t => { t.el.style.opacity = '0'; });
        orbs.forEach(orb => {
            orb.style.transition = 'transform 0.6s ease';
            orb.style.transform  = 'translate(0px, 0px)';
        });
    });

    box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top)  / rect.height;
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        if (inside) {
            const rect    = box.getBoundingClientRect();
            const targetX = mouseX * rect.width;
            const targetY = mouseY * rect.height;

            curX = lerp(curX, targetX, 0.12);
            curY = lerp(curY, targetY, 0.12);

            cursor.style.left = curX + 'px';
            cursor.style.top  = curY + 'px';

            trailHistory.unshift({ x: curX, y: curY });
            trailHistory.pop();

            trail.forEach((t, i) => {
                const pos = trailHistory[Math.min(i * 2, trailHistory.length - 1)];
                t.el.style.left    = pos.x + 'px';
                t.el.style.top     = pos.y + 'px';
                t.el.style.opacity = ((1 - i / TRAIL_COUNT) * 0.45).toString();
            });

            const cx = mouseX - 0.5;
            const cy = mouseY - 0.5;
            orbs.forEach((orb, idx) => {
                const depth = 0.5 + idx * 0.25;
                orb.style.transition = 'transform 0.25s ease';
                orb.style.transform  = `translate(${-cx * 18 * depth}px, ${-cy * 18 * depth}px)`;
            });
        }
        requestAnimationFrame(tick);
    }
    tick();
})();

const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const navLinks  = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


window.addEventListener('scroll', updateActiveLink);

function updateActiveLink() {
    const sections       = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop    = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId     = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', updateActiveLink);


const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach(card => {
            const match = category === 'all' || card.getAttribute('data-category') === category;
            card.classList.toggle('hidden', !match);
        });
    });
});

function refreshCarousel() {}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const submitBtn    = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled    = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification("Message sent! I'll get back to you soon.", 'success');
            contactForm.reset();
        } catch {
            showNotification('Failed to send. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled    = false;
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position:        'fixed',
        bottom:          '20px',
        right:           '20px',
        padding:         '15px 20px',
        borderRadius:    '8px',
        fontWeight:      '500',
        zIndex:          '1000',
        animation:       'slideIn 0.3s ease',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4f6ef7',
        color:           'white',
        maxWidth:        '300px',
        boxShadow:       '0 4px 20px rgba(0,0,0,0.4)',
        fontFamily:      "'DM Sans', sans-serif",
    });

    if (!document.head.querySelector('style[data-notification]')) {
        const s = document.createElement('style');
        s.setAttribute('data-notification', 'true');
        s.textContent = `
            @keyframes slideIn  { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
        `;
        document.head.appendChild(s);
    }

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

document.querySelectorAll('.skill-category').forEach(cat => {
    cat.style.opacity    = '0';
    cat.style.transform  = 'translateY(20px)';
    cat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(cat);
});


if (!document.head.querySelector('style[data-ripple]')) {
    const s = document.createElement('style');
    s.setAttribute('data-ripple', 'true');
    s.textContent = `
        @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }
        .btn { position: relative; overflow: hidden; }
    `;
    document.head.appendChild(s);
}

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect   = this.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height);
        Object.assign(ripple.style, {
            position:     'absolute',
            width:        size + 'px',
            height:       size + 'px',
            left:         (e.clientX - rect.left - size / 2) + 'px',
            top:          (e.clientY - rect.top  - size / 2) + 'px',
            borderRadius: '50%',
            background:   'rgba(255,255,255,0.25)',
            transform:    'scale(0)',
            animation:    'ripple-animation 0.6s ease-out',
            pointerEvents:'none',
        });
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});


console.log('Portfolio initialized ✓');