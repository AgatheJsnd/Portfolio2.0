const body = document.body;
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

// Rotating Text Animation
const rotatingTextEl = document.querySelector('.rotating-text');
const rotatingTitles = [
    'Analyse de données',
    'Automatisation de processus',
    'Conception de dashboards',
    'Création d\'outils no-code',
    'Gestion de projets digitaux'
];

if (rotatingTextEl) {
    let currentIndex = 0;
    
    function updateRotatingText() {
        rotatingTextEl.classList.add('fade-out');
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % rotatingTitles.length;
            rotatingTextEl.textContent = rotatingTitles[currentIndex];
            rotatingTextEl.classList.remove('fade-out');
        }, 300);
    }
    
    // Set initial text
    rotatingTextEl.textContent = rotatingTitles[0];
    
    // Start rotation every 3 seconds
    setInterval(updateRotatingText, 3000);
}

// Pill Navigation Logic
const pillNav = document.getElementById('pillNav');
const pillContainer = pillNav?.querySelector('.pill-nav-container');
const pillItems = pillNav?.querySelectorAll('.pill-nav-item');
const activeLabel = document.getElementById('activeLabel');

let isExpanded = false;
let isTransitioning = false;
let hoverTimeout = null;
let activeSection = 'home';
const HOME_EXPAND_THRESHOLD = 50;
let isMouseInsideNav = false;

// Section labels mapping
const sectionLabels = {
    'home': 'Accueil',
    'projects': 'Projets',
    'skills': 'Compétences',
    'contact': 'Contact',
    'about': 'À propos'
};

// Update active section based on scroll or initial state
function updateActiveSection(sectionId) {
    activeSection = sectionId;
    const label = sectionLabels[sectionId] || 'Accueil';
    
    if (activeLabel) {
        // Animate text change
        activeLabel.classList.remove('fade-in');
        activeLabel.classList.add('fade-out');
        
        setTimeout(() => {
            activeLabel.textContent = label;
            activeLabel.classList.remove('fade-out');
            activeLabel.classList.add('fade-in');
            
            setTimeout(() => {
                activeLabel.classList.remove('fade-in');
            }, 350);
        }, 175);
    }
    
    if (pillItems) {
        pillItems.forEach(item => {
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

function setNavExpanded(state) {
    isExpanded = state;
    if (pillContainer) {
        pillContainer.classList.toggle('expanded', state);
    }
}

if (pillContainer && window.scrollY <= HOME_EXPAND_THRESHOLD) {
    setNavExpanded(true);
}

// Handle hover expansion
function handleMouseEnter() {
    if (hoverTimeout) {
        clearTimeout(hoverTimeout);
    }
    isMouseInsideNav = true;
    setNavExpanded(true);
}

function handleMouseLeave() {
    isMouseInsideNav = false;
    hoverTimeout = setTimeout(() => {
        if (window.scrollY > HOME_EXPAND_THRESHOLD) {
            setNavExpanded(false);
        }
    }, 600);
}

// Handle section click
function handleSectionClick(sectionId) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    if (pillContainer) {
        pillContainer.classList.add('transitioning');
    }
    
    updateActiveSection(sectionId);
    
    // Scroll to section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Collapse the pill
    setNavExpanded(false);
    
    // Reset transition state
    setTimeout(() => {
        isTransitioning = false;
        if (pillContainer) {
            pillContainer.classList.remove('transitioning');
        }
    }, 400);
}

// Initialize pill navigation
if (pillContainer && pillItems) {
    pillContainer.addEventListener('mouseenter', handleMouseEnter);
    pillContainer.addEventListener('mouseleave', handleMouseLeave);
    
    pillItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const sectionId = item.getAttribute('data-section');
            if (sectionId) {
                handleSectionClick(sectionId);
            }
        });
    });
    
    // Set initial active section
    if (activeLabel) {
        activeLabel.classList.add('fade-in');
    }
    updateActiveSection(activeSection);
    
    // Optional: Update active section on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const sections = ['home', 'projects', 'skills', 'contact', 'about'];
            const scrollPosition = window.scrollY + 100;
            
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section && section.offsetTop <= scrollPosition) {
                    if (activeSection !== sections[i] && !isExpanded) {
                        updateActiveSection(sections[i]);
                    }
                    break;
                }
            }

            if (!isMouseInsideNav && !isTransitioning) {
                if (window.scrollY <= HOME_EXPAND_THRESHOLD) {
                    setNavExpanded(true);
                } else {
                    setNavExpanded(false);
                }
            }
        }, 100);
    });
}

// Skills Tabs
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Tech Stack Carousel
const techCarouselWrapper = document.querySelector('.tech-carousel-wrapper');
if (techCarouselWrapper) {
    const techCarousel = techCarouselWrapper.querySelector('.tech-stack-carousel');
    const prevBtn = techCarouselWrapper.querySelector('.carousel-prev');
    const nextBtn = techCarouselWrapper.querySelector('.carousel-next');

    const getScrollAmount = () => {
        if (!techCarousel) return 200;
        const card = techCarousel.querySelector('.tech-card');
        if (!card) return 200;
        const cardWidth = card.getBoundingClientRect().width;
        const styles = window.getComputedStyle(techCarousel);
        const gap = parseFloat(styles.columnGap || styles.gap || '16');
        return cardWidth + gap;
    };

    const scrollCarousel = (direction) => {
        if (!techCarousel) return;
        techCarousel.scrollBy({
            left: direction * getScrollAmount(),
            behavior: 'smooth'
        });
    };

    prevBtn?.addEventListener('click', () => scrollCarousel(-1));
    nextBtn?.addEventListener('click', () => scrollCarousel(1));
}
// Certification Modal
const certModal = document.getElementById('certModal');
const certCards = document.querySelectorAll('.certification-card');
const certModalImage = document.getElementById('certModalImage');
const certModalTitle = document.getElementById('certModalTitle');
const certModalDate = document.getElementById('certModalDate');
const certModalDescription = document.getElementById('certModalDescription');
const certCloseButtons = document.querySelectorAll('[data-close-cert]');

function openCertModal(card) {
    const imageElement = card.querySelector('.cert-image img');
    const title = card.querySelector('h3').textContent;
    const date = card.querySelector('.cert-date').textContent;
    const fullDescription = card.getAttribute('data-cert-full-desc');
    const shortDescription = card.querySelector('.cert-description').textContent;
    const description = fullDescription || shortDescription;
    
    // Clear and set image
    certModalImage.innerHTML = '';
    if (imageElement) {
        const modalImg = document.createElement('img');
        modalImg.src = imageElement.src;
        modalImg.alt = imageElement.alt;
        modalImg.style.width = '350px';
        modalImg.style.height = '350px';
        modalImg.style.objectFit = 'contain';
        modalImg.style.borderRadius = '28px';
        certModalImage.appendChild(modalImg);
    } else {
        certModalImage.textContent = card.querySelector('.cert-image').textContent;
    }
    
    certModalTitle.textContent = title;
    certModalDate.textContent = date;
    certModalDescription.textContent = description;
    
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

certCards.forEach(card => {
    card.addEventListener('click', () => {
        openCertModal(card);
    });
});

certCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        closeCertModal();
    });
});

certModal.addEventListener('click', (e) => {
    if (e.target === certModal || e.target.classList.contains('cert-modal-backdrop')) {
        closeCertModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.getAttribute('aria-hidden') === 'false') {
        closeCertModal();
    }
});

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

// Quote API from API Ninjas
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const quoteCard = document.getElementById('quoteCard');
const API_KEY = 'ZmCeK/58EuWXy4i/u1jh5g==OZJT5ZCs1oDY2SpC';

async function fetchQuote() {
    try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
            headers: {
                'X-Api-Key': API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const quote = data[0];
            quoteText.textContent = quote.quote;
            quoteAuthor.textContent = quote.author;
            console.log('✅ Citation chargée:', quote.quote);
        }
    } catch (error) {
        console.error('❌ Error fetching quote:', error);
        quoteText.textContent = 'La créativité, c\'est l\'intelligence qui s\'amuse.';
        quoteAuthor.textContent = 'Albert Einstein';
    }
}

// Load quote when page loads
if (quoteCard) {
    fetchQuote();
}

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        // Hide previous status
        formStatus.className = 'form-status';
        formStatus.textContent = '';
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                formStatus.className = 'form-status success';
                formStatus.textContent = '✓ Message envoyé avec succès ! Je vous répondrai bientôt.';
                contactForm.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.textContent = '✗ Une erreur est survenue. Veuillez réessayer ou m\'envoyer un email directement.';
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer';
        }
    });
}

// Media Modals (Video & Image)
const videoModal = document.getElementById('videoModal');
const imageModal = document.getElementById('imageModal');
const videoFrame = document.getElementById('videoFrame');
const imagePreview = document.getElementById('imagePreview');
const mediaCloseButtons = document.querySelectorAll('[data-close-media]');

// Open Video Modal
document.querySelectorAll('[data-video]').forEach(button => {
    button.addEventListener('click', () => {
        const videoUrl = button.getAttribute('data-video');
        if (videoUrl && videoModal && videoFrame) {
            videoFrame.src = videoUrl;
            videoModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Open Image Modal
document.querySelectorAll('[data-image]').forEach(button => {
    button.addEventListener('click', () => {
        const imageUrl = button.getAttribute('data-image');
        if (imageUrl && imageModal && imagePreview) {
            imagePreview.src = imageUrl;
            imageModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close Media Modals
function closeMediaModal(modal, frame) {
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Clear the iframe/image src to stop playback
        if (frame) {
            frame.src = '';
        }
    }
}

mediaCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        closeMediaModal(videoModal, videoFrame);
        closeMediaModal(imageModal, imagePreview);
    });
});

// Close on backdrop click
[videoModal, imageModal].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('media-modal-backdrop')) {
                if (modal === videoModal) {
                    closeMediaModal(videoModal, videoFrame);
                } else {
                    closeMediaModal(imageModal, imagePreview);
                }
            }
        });
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (videoModal && videoModal.getAttribute('aria-hidden') === 'false') {
            closeMediaModal(videoModal, videoFrame);
        }
        if (imageModal && imageModal.getAttribute('aria-hidden') === 'false') {
            closeMediaModal(imageModal, imagePreview);
        }
    }
});
