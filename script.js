// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const testimonialTrack = document.getElementById('testimonial-track');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dots = document.querySelectorAll('.dot');
const chatbotButton = document.getElementById('chatbot-button');
const chatbotBox = document.getElementById('chatbot-box');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendMessage = document.getElementById('send-message');
const chatbotMessages = document.getElementById('chatbot-messages');
const contactForm = document.getElementById('contact-form');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Testimonials Slider
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.testimonial-slide').length;

function updateSlider() {
    testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

// Event listeners for slider controls
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto-slide testimonials
setInterval(nextSlide, 5000);

// Enhanced Chatbot functionality
let isChatOpen = false;
let isTyping = false;

function toggleChat() {
    isChatOpen = !isChatOpen;
    chatbotBox.classList.toggle('active', isChatOpen);
    
    if (isChatOpen) {
        chatInput.focus();
        // Add welcome message if it's the first time
        if (chatbotMessages.children.length === 1) {
            setTimeout(() => {
                addTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    addMessage("Welcome to Luxe Interiors! I'm here to help you create your dream space. What would you like to know about our services?", false);
                }, 1500);
            }, 500);
        }
    }
}

function addTypingIndicator() {
    if (isTyping) return;
    isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user-tie"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = chatbotMessages.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

function addMessage(message, isUser = false, quickReplies = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    if (isUser) {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
    } else {
        let quickRepliesHTML = '';
        if (quickReplies && quickReplies.length > 0) {
            quickRepliesHTML = `
                <div class="quick-replies">
                    ${quickReplies.map(reply => `<button class="quick-reply" data-reply="${reply}">${reply}</button>`).join('')}
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user-tie"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
                ${quickRepliesHTML}
            </div>
        `;
    }
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    // Add event listeners to quick replies
    if (quickReplies) {
        const quickReplyButtons = messageDiv.querySelectorAll('.quick-reply');
        quickReplyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const reply = button.getAttribute('data-reply');
                addMessage(reply, true);
                setTimeout(() => {
                    const botResponse = getBotResponse(reply);
                    addTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator();
                        addMessage(botResponse.message, false, botResponse.quickReplies);
                    }, 1000 + Math.random() * 1000);
                }, 500);
            });
        });
    }
}

function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced response system with quick replies
    const responses = {
        'services': {
            message: "We offer a comprehensive range of interior design services: 🏠 Residential Design, 🏢 Commercial Design, 🎨 Color Consultation, 💡 Lighting Design, 🛋️ Furniture Selection, and 📋 Project Management. Which service interests you most?",
            quickReplies: ['Residential Design', 'Commercial Design', 'Color Consultation', 'Tell me about pricing']
        },
        'pricing': {
            message: "Our pricing is transparent and varies by project scope: 💰 Consultation: $299/session, 🏠 Room Design: $2,999/room, 🏘️ Full Home: $12,999/project. Would you like to schedule a consultation to get a personalized quote?",
            quickReplies: ['Book Consultation', 'Tell me about services', 'View portfolio']
        },
        'consultation': {
            message: "Great choice! Our consultations include a 2-hour design session, color palette recommendations, space planning advice, and a written design summary. When would you like to schedule?",
            quickReplies: ['This week', 'Next week', 'Contact me later']
        },
        'portfolio': {
            message: "Our portfolio showcases our finest work across residential and commercial projects. You can view it on our website, or I can tell you about specific project types. What interests you?",
            quickReplies: ['Residential projects', 'Commercial projects', 'Luxury designs', 'Modern styles']
        },
        'contact': {
            message: "You can reach us at: 📞 +1 (555) 123-4567, 📧 hello@luxeinteriors.com, or 📍 123 Design District, NY. We're available Mon-Fri 9AM-6PM EST. Would you like me to help you with anything specific?",
            quickReplies: ['Book appointment', 'Send email', 'Call now']
        },
        'team': {
            message: "Our expert team includes Sarah Johnson (Lead Designer), Michael Chen (Commercial Specialist), Emily Rodriguez (Color & Lighting Expert), and David Thompson (Project Manager). Each brings 10+ years of experience!",
            quickReplies: ['Tell me about services', 'View portfolio', 'Book consultation']
        },
        'experience': {
            message: "We have 15+ years of experience with 150+ projects completed and 100% client satisfaction. We've won 50+ awards for our exceptional work. Our expertise spans from luxury residential to commercial spaces.",
            quickReplies: ['View portfolio', 'Read testimonials', 'Book consultation']
        }
    };
    
    // Keyword matching
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('what do you do')) {
        return responses.services;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
        return responses.pricing;
    } else if (lowerMessage.includes('consultation') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
        return responses.consultation;
    } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('projects')) {
        return responses.portfolio;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
        return responses.contact;
    } else if (lowerMessage.includes('team') || lowerMessage.includes('designer') || lowerMessage.includes('who')) {
        return responses.team;
    } else if (lowerMessage.includes('experience') || lowerMessage.includes('years') || lowerMessage.includes('awards')) {
        return responses.experience;
    } else {
        // Default response with suggestions
        return {
            message: "I'd be happy to help you with your interior design needs! What would you like to know about?",
            quickReplies: ['Tell me about services', 'What are your prices?', 'View portfolio', 'Book consultation']
        };
    }
}

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (message && !isTyping) {
        addMessage(message, true);
        chatInput.value = '';
        
        // Simulate bot thinking
        setTimeout(() => {
            addTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                const botResponse = getBotResponse(message);
                addMessage(botResponse.message, false, botResponse.quickReplies);
            }, 1000 + Math.random() * 1000);
        }, 500);
    }
}

// Chatbot event listeners
chatbotButton.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);

sendMessage.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

// Portfolio filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter items
        portfolioItems.forEach(item => {
            const categories = item.getAttribute('data-category');
            if (filter === 'all' || categories.includes(filter)) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.6s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Contact form handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const budget = formData.get('budget');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !service || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.service-card, .portfolio-item, .about-content, .contact-content, .pricing-card, .team-member');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Newsletter form handling
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            newsletterForm.reset();
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
    });
}

// CTA button functionality
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.textContent.includes('Portfolio')) {
            const portfolioSection = document.querySelector('#portfolio');
            if (portfolioSection) {
                portfolioSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Portfolio item click handlers
portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const overlay = item.querySelector('.portfolio-overlay');
        const title = overlay.querySelector('h3').textContent;
        showNotification(`Viewing: ${title}`, 'info');
    });
});

// Service card click handlers
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        console.log(`Service selected: ${title}`);
    });
});

// Pricing card click handlers
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach(card => {
    const button = card.querySelector('.pricing-btn');
    if (button) {
        button.addEventListener('click', () => {
            const plan = card.querySelector('h3').textContent;
            showNotification(`Selected plan: ${plan}. Redirecting to contact form...`, 'success');
            setTimeout(() => {
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        });
    }
});

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to service cards
    const cards = document.querySelectorAll('.service-card, .portfolio-item, .pricing-card, .team-member');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add scroll progress indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--gradient-gold);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
};

// Initialize scroll progress
createScrollProgress();

// Add some performance optimizations
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Navbar scroll effect
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Parallax effect
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isChatOpen) {
        toggleChat();
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            prevSlide();
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Luxe Interiors website loaded successfully!');
    
    // Add some initial animations
    setTimeout(() => {
        document.body.classList.add('animate-in');
    }, 100);
    
    // Add CSS for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            padding: 1rem 1.5rem;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 10000;
            max-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid #28a745;
        }
        
        .notification.error {
            border-left: 4px solid #dc3545;
        }
        
        .notification.info {
            border-left: 4px solid #17a2b8;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification.success .notification-content i {
            color: #28a745;
        }
        
        .notification.error .notification-content i {
            color: #dc3545;
        }
        
        .notification.info .notification-content i {
            color: #17a2b8;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
            padding: 1rem;
        }
        
        .typing-dots span {
            width: 8px;
            height: 8px;
            background: var(--primary-gold);
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
            0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(notificationStyles);
});

