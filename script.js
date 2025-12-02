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
        // Close AI chat on Escape
        const aiChatContainer = document.getElementById('aiChatContainer');
        if (aiChatContainer && aiChatContainer.classList.contains('active')) {
            aiChatContainer.classList.remove('active');
            aiChatContainer.setAttribute('aria-hidden', 'true');
        }
    }
});

// ===== AI Chat Widget =====
const aiChatToggle = document.getElementById('aiChatToggle');
const aiChatContainer = document.getElementById('aiChatContainer');
const aiChatClose = document.getElementById('aiChatClose');
const aiChatInput = document.getElementById('aiChatInput');
const aiChatSend = document.getElementById('aiChatSend');
const aiChatMessages = document.getElementById('aiChatMessages');

// Portfolio data for AI responses
const portfolioData = {
    projets: [
        { 
            nom: "Coloc Match", 
            type: "Innovation produit", 
            description: "Application de matching pour aider les étudiants à trouver des colocataires compatibles selon leurs habitudes de vie, préférences et budget.",
            outils: ["Tally", "Figma"],
            objectif: "Faciliter la recherche de colocation avec un système de matching inspiré de Tinder."
        },
        { 
            nom: "Carrefour", 
            type: "Data Intelligence", 
            description: "Dashboard d'analyse pour identifier les fournisseurs stratégiques et prioriser les négociations internationales.",
            outils: ["Google Sheets", "Looker Studio"],
            objectif: "Identifier les écarts de prix entre pays et maximiser les gains économiques."
        },
        { 
            nom: "Her Third Place", 
            type: "Automatisation & IA", 
            description: "Expérience automatisée et gamifiée pour le suivi des participantes, de l'inscription au retour post-activité.",
            outils: ["Airtable", "Notion", "Make", "Typeform"],
            objectif: "Fluidifier le suivi et renforcer l'engagement via la gamification."
        }
    ],
    outils: {
        "v0": { nom: "V0", desc: "Construit interfaces instantanément" },
        "airtable": { nom: "Airtable", desc: "Structure données facilement" },
        "canva": { nom: "Canva", desc: "Crée visuels facilement" },
        "hubspot": { nom: "HubSpot", desc: "Automatise relation client" },
        "mistral": { nom: "Mistral", desc: "Génère texte intelligemment" },
        "looker": { nom: "Looker Studio", desc: "Visualise tes données" },
        "webflow": { nom: "Webflow", desc: "Conçois sites web" },
        "google sheets": { nom: "Google Sheets", desc: "Collabore sur données" },
        "notion": { nom: "Notion", desc: "Centralise ton organisation" },
        "openai": { nom: "OpenAI", desc: "Alimente intelligence artificielle" },
        "sql": { nom: "SQL", desc: "Gère tes bases" },
        "make": { nom: "Make", desc: "Automatise tes tâches" },
        "python": { nom: "Python", desc: "Automatise avec code" },
        "bubble": { nom: "Bubble", desc: "Crée application facilement" },
        "brevo": { nom: "Brevo", desc: "Gère campagnes email" },
        "n8n": { nom: "n8n", desc: "Connecte outils librement" },
        "dust": { nom: "Dust", desc: "Personnalise agents IA" },
        "cursor": { nom: "Cursor", desc: "Code assisté intelligemment" },
        "github": { nom: "GitHub", desc: "Héberge version code" },
        "tableau": { nom: "Tableau", desc: "Analyse visuellement données" },
        "jupyter": { nom: "Jupyter Notebook", desc: "Expérimente code interactif" }
    },
    specialisations: [
        "Analyse de données", "Automatisation de processus", "Conception de dashboards", 
        "Création d'outils no-code", "Gestion de projets digitaux"
    ],
    certifications: [
        { nom: "Certification Hackathon", date: "Mai 2025", description: "Développement de solutions innovantes en analyse de données" }
    ],
    contact: {
        email: "agathejosserand04@gmail.com",
        linkedin: "linkedin.com/in/agathe-josserand-",
        github: "github.com/AgatheJsnd"
    },
    apropos: {
        age: 19,
        ville: "Paris",
        origine: "la campagne",
        passions: ["voyager", "le soleil", "les amis", "les sorties", "les bons restos", "les concerts", "la mer"]
    }
};

function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Salutations
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('hello')) {
        return "Bonjour ! 👋 Ravie de vous rencontrer ! Je suis l'assistant d'Agathe. Comment puis-je vous aider ?";
    }
    if (lowerMessage.includes('salut') || lowerMessage.includes('hey') || lowerMessage.includes('coucou')) {
        return "Salut ! 👋 Que souhaitez-vous savoir sur Agathe et son travail ?";
    }
    
    // Ça va ?
    if (lowerMessage.includes('ça va') || lowerMessage.includes('ca va') || lowerMessage.includes('comment vas') || lowerMessage.includes('comment tu vas') || lowerMessage.includes('comment allez')) {
        return "Très bien et vous ? 😊 Je peux vous aider à découvrir le portfolio d'Agathe !";
    }
    
    // Projets
    if (lowerMessage.includes('projet')) {
        const projets = portfolioData.projets.map(p => `• <strong>${p.nom}</strong> (${p.type})`).join('<br>');
        return `Agathe a travaillé sur 3 projets principaux :<br><br>${projets}<br><br>Vous voulez en savoir plus sur l'un d'eux ? 🚀`;
    }
    
    // Projet spécifique - Coloc Match
    if (lowerMessage.includes('coloc')) {
        const projet = portfolioData.projets[0];
        return `🏠 <strong>${projet.nom}</strong> (${projet.type})<br><br>${projet.description}<br><br>🎯 Objectif : ${projet.objectif}<br><br>🔧 Outils utilisés : <strong>${projet.outils.join(', ')}</strong>`;
    }
    
    // Projet spécifique - Carrefour
    if (lowerMessage.includes('carrefour')) {
        const projet = portfolioData.projets[1];
        return `📊 <strong>${projet.nom}</strong> (${projet.type})<br><br>${projet.description}<br><br>🎯 Objectif : ${projet.objectif}<br><br>🔧 Outils utilisés : <strong>${projet.outils.join(', ')}</strong>`;
    }
    
    // Projet spécifique - Her Third Place
    if (lowerMessage.includes('her third') || lowerMessage.includes('third place') || lowerMessage.includes('htp')) {
        const projet = portfolioData.projets[2];
        return `🤖 <strong>${projet.nom}</strong> (${projet.type})<br><br>${projet.description}<br><br>🎯 Objectif : ${projet.objectif}<br><br>🔧 Outils utilisés : <strong>${projet.outils.join(', ')}</strong>`;
    }
    
    // Question sur les outils des projets
    if ((lowerMessage.includes('outil') && lowerMessage.includes('projet')) || lowerMessage.includes('quels outils') || lowerMessage.includes('utilisé pour')) {
        let reponse = "🔧 Voici les outils utilisés dans chaque projet :<br><br>";
        for (const projet of portfolioData.projets) {
            reponse += `• <strong>${projet.nom}</strong> : ${projet.outils.join(', ')}<br>`;
        }
        return reponse;
    }
    
    // Outils/Compétences générales
    if (lowerMessage.includes('outil') || lowerMessage.includes('compétence') || lowerMessage.includes('skill') || lowerMessage.includes('tech')) {
        const outilsNoms = Object.values(portfolioData.outils).slice(0, 10).map(o => o.nom).join(', ');
        return `💪 Agathe maîtrise plus de 20 outils, dont : ${outilsNoms}... et bien d'autres ! Elle est spécialisée en no-code, automatisation et data. Demande-moi plus d'infos sur un outil en particulier !`;
    }
    
    // Recherche d'outil spécifique
    for (const [key, outil] of Object.entries(portfolioData.outils)) {
        if (lowerMessage.includes(key) || lowerMessage.includes(outil.nom.toLowerCase())) {
            return `🔧 <strong>${outil.nom}</strong> : ${outil.desc}. Agathe maîtrise cet outil et l'utilise dans ses projets !`;
        }
    }
    
    // Automatisation (cas spécial)
    if (lowerMessage.includes('automatisation')) {
        return "⚙️ <strong>Automatisation</strong> : Agathe utilise Make et n8n pour automatiser des tâches et connecter différents outils entre eux !";
    }
    
    // Spécialisations
    if (lowerMessage.includes('spécialis') || lowerMessage.includes('domaine') || lowerMessage.includes('expertise')) {
        const specs = portfolioData.specialisations.join(', ');
        return `🎯 Agathe est spécialisée en : ${specs}. Elle crée des solutions digitales utiles qui répondent vraiment aux attentes des utilisateurs !`;
    }
    
    // Contact
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('mail') || lowerMessage.includes('joindre')) {
        return `📧 Vous pouvez contacter Agathe via :<br>• Email : <strong>${portfolioData.contact.email}</strong><br>• LinkedIn : ${portfolioData.contact.linkedin}<br>• GitHub : ${portfolioData.contact.github}<br><br>Ou utilisez le formulaire de contact sur le site !`;
    }
    
    // LinkedIn
    if (lowerMessage.includes('linkedin')) {
        return `💼 Le LinkedIn d'Agathe : <strong>${portfolioData.contact.linkedin}</strong> - N'hésitez pas à la contacter !`;
    }
    
    // GitHub
    if (lowerMessage.includes('github')) {
        return `💻 Le GitHub d'Agathe : <strong>${portfolioData.contact.github}</strong> - Vous y trouverez ses projets de code !`;
    }
    
    // Certifications
    if (lowerMessage.includes('certif') || lowerMessage.includes('diplom') || lowerMessage.includes('hackathon')) {
        const cert = portfolioData.certifications[0];
        return `🏆 Agathe a obtenu la <strong>${cert.nom}</strong> en ${cert.date}. Elle a développé des solutions innovantes en analyse de données lors d'un hackathon intensif !`;
    }
    
    // À propos / Qui est Agathe
    if (lowerMessage.includes('qui') || lowerMessage.includes('agathe') || lowerMessage.includes('propos') || lowerMessage.includes('présent')) {
        return `👋 Agathe a ${portfolioData.apropos.age} ans et vient de ${portfolioData.apropos.origine}. Elle est maintenant à ${portfolioData.apropos.ville} pour ses études ! Elle adore ${portfolioData.apropos.passions.slice(0, 4).join(', ')} et plein d'autres choses. C'est une passionnée du digital et de la data !`;
    }
    
    // Formation/Études
    if (lowerMessage.includes('formation') || lowerMessage.includes('étude') || lowerMessage.includes('parcours') || lowerMessage.includes('école')) {
        return "🎓 Agathe est étudiante à Paris, passionnée par l'analyse de données, l'automatisation et la gestion de projets digitaux. Elle apprend constamment de nouveaux outils !";
    }
    
    // Passions/Hobbies
    if (lowerMessage.includes('passion') || lowerMessage.includes('hobby') || lowerMessage.includes('aime') || lowerMessage.includes('loisir')) {
        const passions = portfolioData.apropos.passions.join(', ');
        return `❤️ En dehors du travail, Agathe adore : ${passions}. Elle est team été à vie et un mix entre chill et aventure selon l'humeur du jour ! 🌞`;
    }
    
    // Remerciements
    if (lowerMessage.includes('merci') || lowerMessage.includes('thanks')) {
        return "Avec plaisir ! 🙏 N'hésitez pas si vous avez d'autres questions sur Agathe ou son portfolio !";
    }
    
    // Aide
    if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('quoi')) {
        return "Je peux vous renseigner sur :<br>• Les <strong>projets</strong> d'Agathe (Coloc Match, Carrefour, Her Third Place)<br>• Ses <strong>compétences</strong> et outils<br>• Comment la <strong>contacter</strong><br>• <strong>Qui</strong> elle est<br><br>Posez-moi votre question ! 😊";
    }
    
    // Détection de sujets hors-sujet (recettes, météo, etc.)
    const horssSujet = ['recette', 'cuisine', 'manger', 'météo', 'temps qu\'il fait', 'sport', 'foot', 'musique', 'film', 'série', 'jeu', 'actualité', 'news', 'politique'];
    for (const sujet of horssSujet) {
        if (lowerMessage.includes(sujet)) {
            return "Oups, je ne peux pas répondre à ça ! 😅 Je suis l'assistant d'Agathe et je suis spécialisé uniquement sur son portfolio.<br><br>Je peux vous parler de :<br>• Ses <strong>projets</strong> (Coloc Match, Carrefour, Her Third Place)<br>• Ses <strong>compétences</strong> et outils<br>• Comment la <strong>contacter</strong><br>• <strong>Qui</strong> elle est";
        }
    }
    
    // Réponse par défaut
    return "Je suis là pour vous aider ! 😊 Posez-moi des questions sur :<br>• Les <strong>projets</strong> d'Agathe<br>• Ses <strong>compétences</strong> et outils<br>• Comment la <strong>contacter</strong><br>• <strong>Qui</strong> elle est";
}

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${isUser ? 'ai-message-user' : 'ai-message-bot'}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    aiChatMessages.appendChild(messageDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-typing';
    typingDiv.id = 'aiTyping';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    aiChatMessages.appendChild(typingDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('aiTyping');
    if (typing) typing.remove();
}

function handleSendMessage() {
    const message = aiChatInput.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    aiChatInput.value = '';
    
    showTypingIndicator();
    
    setTimeout(() => {
        removeTypingIndicator();
        const response = getAIResponse(message);
        addMessage(response, false);
    }, 1000 + Math.random() * 500);
}

if (aiChatToggle && aiChatContainer) {
    aiChatToggle.addEventListener('click', () => {
        const isActive = aiChatContainer.classList.toggle('active');
        aiChatContainer.setAttribute('aria-hidden', !isActive);
        if (isActive) {
            aiChatInput.focus();
        }
    });
    
    aiChatClose.addEventListener('click', () => {
        aiChatContainer.classList.remove('active');
        aiChatContainer.setAttribute('aria-hidden', 'true');
    });
    
    aiChatSend.addEventListener('click', handleSendMessage);
    
    aiChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
}
