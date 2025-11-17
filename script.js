const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
const yearEl = document.getElementById('year');
const backdrop = document.querySelector('.modal-backdrop');
const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
];

if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
        });
    });
}

const modals = document.querySelectorAll('.modal');

function openModal(modal) {
    modals.forEach(existing => {
        if (existing !== modal && existing.getAttribute('aria-hidden') === 'false') {
            closeModal(existing);
        }
    });
    modal.setAttribute('aria-hidden', 'false');
    if (backdrop) {
        backdrop.setAttribute('aria-hidden', 'false');
    }
    const focusables = modal.querySelectorAll(focusableSelectors.join(','));
    const firstFocusable = focusables[0];
    const closeBtn = modal.querySelector('.modal-close');
    (firstFocusable || closeBtn || modal).focus({ preventScroll: true });

    modal.addEventListener('keydown', trapFocus);
}

function closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    if (backdrop) {
        backdrop.setAttribute('aria-hidden', 'true');
    }
    modal.removeEventListener('keydown', trapFocus);
}

function trapFocus(event) {
    if (event.key !== 'Tab') {
        return;
    }
    const modal = event.currentTarget;
    const focusables = modal.querySelectorAll(focusableSelectors.join(','));
    if (focusables.length === 0) {
        return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

document.querySelectorAll('[data-modal]').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-modal');
        const modal = document.getElementById(targetId);
        if (modal) {
            openModal(modal);
        }
    });
});

document.querySelectorAll('[data-close]').forEach(element => {
    element.addEventListener('click', () => {
        modals.forEach(modal => {
            if (modal.getAttribute('aria-hidden') === 'false') {
                closeModal(modal);
            }
        });
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', event => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.getAttribute('aria-hidden') === 'false') {
                closeModal(modal);
            }
        });
    }
});

