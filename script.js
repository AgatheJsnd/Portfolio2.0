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
    const image = card.querySelector('.cert-image').textContent;
    const title = card.querySelector('h3').textContent;
    const date = card.querySelector('.cert-date').textContent;
    const description = card.querySelector('.cert-description').textContent;
    
    certModalImage.textContent = image;
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

// News from RSS Feed via RSS2JSON
const newsGrid = document.getElementById('newsGrid');

async function fetchNews() {
    try {
        // Using RSS2JSON to convert RSS feed to JSON (works in frontend)
        const rssUrl = 'https://www.01net.com/feed/';
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        
        if (data && data.items && data.items.length > 0) {
            // Clear loading message
            newsGrid.innerHTML = '';
            
            // Display first 3 articles
            data.items.slice(0, 3).forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                
                const title = document.createElement('h4');
                title.className = 'news-item-title';
                title.textContent = article.title;
                
                const description = document.createElement('p');
                description.className = 'news-item-description';
                // Remove HTML tags from description
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = article.description || article.content || '';
                const cleanText = tempDiv.textContent || tempDiv.innerText || 'Pas de description disponible.';
                description.textContent = cleanText.substring(0, 150) + '...';
                
                const meta = document.createElement('div');
                meta.className = 'news-item-meta';
                
                const source = document.createElement('span');
                source.className = 'news-item-source';
                source.textContent = '01net';
                
                const link = document.createElement('a');
                link.className = 'news-item-link';
                link.href = article.link;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = 'Lire l\'article →';
                
                meta.appendChild(source);
                meta.appendChild(link);
                
                newsItem.appendChild(title);
                newsItem.appendChild(description);
                newsItem.appendChild(meta);
                
                newsGrid.appendChild(newsItem);
            });
            console.log('✅ Actualités chargées:', data.items.length, 'articles');
        } else {
            newsGrid.innerHTML = '<div class="news-loading">Aucune actualité disponible pour le moment.</div>';
        }
    } catch (error) {
        console.error('❌ Error fetching news:', error);
        newsGrid.innerHTML = '<div class="news-loading">Impossible de charger les actualités.</div>';
    }
}

// Load news when page loads
if (newsGrid) {
    fetchNews();
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

