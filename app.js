document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initScrollEffects();
    initContactForm();
    initRevealAnimations();
    updateFooterYear();
});

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const closeMenu = () => {
        if (!hamburger || !navMenu) return;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation');
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            closeMenu();
        });
    });

    let ticking = false;
    const updateNavigation = () => {
        navbar?.classList.toggle('is-scrolled', window.scrollY > 18);
        const current = sections.find(section => {
            const bounds = section.getBoundingClientRect();
            return bounds.top <= 135 && bounds.bottom > 135;
        });
        navLinks.forEach(link => {
            const active = current && link.getAttribute('href') === `#${current.id}`;
            link.classList.toggle('active', Boolean(active));
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateNavigation);
    }, { passive: true });
    updateNavigation();

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
    });
}

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const icon = toggle.querySelector('i');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const getSavedTheme = () => {
        try {
            return window.localStorage.getItem('theme');
        } catch {
            return null;
        }
    };
    const applyTheme = theme => {
        document.documentElement.setAttribute('data-color-scheme', theme);
        document.documentElement.style.colorScheme = theme;
        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    };
    const storedTheme = getSavedTheme();
    applyTheme(storedTheme || (systemTheme.matches ? 'dark' : 'light'));

    toggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-color-scheme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        try {
            window.localStorage.setItem('theme', nextTheme);
        } catch {
            showNotification('Theme changed for this visit. Browser storage is unavailable.', 'info');
        }
    });

    systemTheme.addEventListener('change', event => {
        if (!getSavedTheme()) applyTheme(event.matches ? 'dark' : 'light');
    });
}

function initScrollEffects() {
    const scrollToTop = document.getElementById('scroll-to-top');
    if (!scrollToTop) return;

    let ticking = false;
    const updateButton = () => {
        scrollToTop.classList.toggle('visible', window.scrollY > 450);
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateButton);
    }, { passive: true });
    updateButton();
    scrollToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const subject = String(formData.get('subject') || '').trim();
        const message = String(formData.get('message') || '').trim();
        if (!name || !email || !subject || !message) {
            showNotification('Please complete each field before preparing your email.', 'error');
            return;
        }

        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailto = `mailto:aniketbgs07@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        showNotification('Your email app should open with the message ready to send.', 'success');
    });
}

function initRevealAnimations() {
    const elements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        elements.forEach(element => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    elements.forEach(element => observer.observe(element));
}

function updateFooterYear() {
    const year = document.getElementById('current-year');
    if (year) year.textContent = String(new Date().getFullYear());
}

function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(notification => notification.remove());
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'status');

    const text = document.createElement('span');
    text.textContent = message;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'notification-close';
    close.setAttribute('aria-label', 'Dismiss notification');
    close.textContent = '×';
    notification.append(text, close);
    document.body.appendChild(notification);

    window.requestAnimationFrame(() => notification.classList.add('visible'));
    const remove = () => {
        notification.classList.remove('visible');
        window.setTimeout(() => notification.remove(), 260);
    };
    const timeout = window.setTimeout(remove, 5000);
    close.addEventListener('click', () => {
        window.clearTimeout(timeout);
        remove();
    });
}
