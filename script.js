// DOM Elements with error handling
let navbar, hamburger, navMenu, navLinks, testimonialTrack, prevBtn, nextBtn, dots;
let chatbotButton, chatbotBox, closeChat, chatInput, sendMessage, chatbotMessages, contactForm;

// Initialize DOM elements with error handling
function initializeDOMElements() {
    try {
        navbar = document.getElementById('navbar');
        hamburger = document.getElementById('hamburger');
        navMenu = document.getElementById('nav-menu');
        navLinks = document.querySelectorAll('.nav-link');
        testimonialTrack = document.getElementById('testimonial-track');
        prevBtn = document.getElementById('prev-btn');
        nextBtn = document.getElementById('next-btn');
        dots = document.querySelectorAll('.dot');
        chatbotButton = document.getElementById('chatbot-button');
        chatbotBox = document.getElementById('chatbot-box');
        closeChat = document.getElementById('close-chat');
        chatInput = document.getElementById('chat-input');
        sendMessage = document.getElementById('send-message');
        chatbotMessages = document.getElementById('chatbot-messages');
        contactForm = document.getElementById('contact-form');
        
        console.log('DOM elements initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing DOM elements:', error);
        return false;
    }
}

// Navbar scroll effect with error handling
function setupNavbarScroll() {
    if (!navbar) {
        console.warn('Navbar element not found');
        return;
    }
    
    window.addEventListener('scroll', () => {
        try {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        } catch (error) {
            console.error('Error in navbar scroll effect:', error);
        }
    });
}

// Mobile menu toggle with error handling
function setupMobileMenu() {
    if (!hamburger || !navMenu) {
        console.warn('Hamburger or nav menu elements not found');
        return;
    }
    
    hamburger.addEventListener('click', () => {
        try {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        } catch (error) {
            console.error('Error toggling mobile menu:', error);
        }
    });
}

// Close mobile menu when clicking on a link
function setupNavLinks() {
    if (!navLinks || navLinks.length === 0) {
        console.warn('No nav links found');
        return;
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            try {
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
            } catch (error) {
                console.error('Error closing mobile menu:', error);
            }
        });
    });
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    if (!navLinks || navLinks.length === 0) {
        console.warn('No nav links found for smooth scrolling');
        return;
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            try {
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
            } catch (error) {
                console.error('Error in smooth scrolling:', error);
            }
        });
    });
}

// Testimonials Slider
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.testimonial-slide').length;

function updateSlider() {
    try {
        if (testimonialTrack) {
            testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        // Update dots
        if (dots && dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
    } catch (error) {
        console.error('Error updating slider:', error);
    }
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
if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
}
if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
}

// Dot navigation
if (dots && dots.length > 0) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            try {
                currentSlide = index;
                updateSlider();
            } catch (error) {
                console.error('Error in dot navigation:', error);
            }
        });
    });
}

// Auto-slide testimonials
setInterval(nextSlide, 5000);

// Enhanced Chatbot functionality
let isChatOpen = false;
let isTyping = false;
let conversationHistory = [];
let adminNotifications = [];

// Admin panel integration
function notifyAdmin(type, title, message, data = {}) {
    const notification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        time: 'Just now',
        priority: 'medium',
        data: data
    };
    
    // Store in localStorage for admin panel access
    adminNotifications.push(notification);
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
    
    // In a real app, this would send to server
    console.log('Admin notification created:', notification);
    console.log('Total notifications in localStorage:', adminNotifications.length);
    console.log('localStorage content:', localStorage.getItem('adminNotifications'));
}

function toggleChat() {
    try {
        isChatOpen = !isChatOpen;
        if (chatbotBox) {
            chatbotBox.classList.toggle('active', isChatOpen);
        }
        
        if (isChatOpen) {
            if (chatInput) chatInput.focus();
            // Add welcome message if it's the first time
            if (chatbotMessages && chatbotMessages.children.length === 1) {
                setTimeout(() => {
                    addTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator();
                        addMessage("Welcome to Luxe Interiors! I'm here to help you create your dream space. What would you like to know about our services?", false, ['Tell me about your services', 'What are your prices?', 'Book a consultation']);
                    }, 1500);
                }, 500);
            }
        }
    } catch (error) {
        console.error('Error toggling chat:', error);
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
                <p>${escapeHtml(message)}</p>
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
                    ${quickReplies.map(reply => `<button class="quick-reply" data-reply="${escapeHtml(reply)}">${escapeHtml(reply)}</button>`).join('')}
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
    if (quickReplies && quickReplies.length > 0) {
        const quickReplyButtons = messageDiv.querySelectorAll('.quick-reply');
        quickReplyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const reply = button.getAttribute('data-reply');
                
                // Disable all quick reply buttons to prevent multiple clicks
                quickReplyButtons.forEach(btn => btn.disabled = true);
                
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
    
    // Store conversation history
    conversationHistory.push({
        message: message,
        isUser: isUser,
        timestamp: new Date()
    });
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
        },
        'residential': {
            message: "🏠 Our residential design services include: Complete home makeovers, Room-by-room design, Kitchen & bathroom renovations, Custom furniture design, and Smart home integration. We work with all budgets and styles!",
            quickReplies: ['Get a quote', 'View residential portfolio', 'Book consultation']
        },
        'commercial': {
            message: "🏢 Our commercial design services cover: Office spaces, Retail stores, Restaurants & cafes, Hotels & hospitality, and Healthcare facilities. We focus on functionality, brand identity, and employee satisfaction.",
            quickReplies: ['Get a quote', 'View commercial portfolio', 'Book consultation']
        },
        'color': {
            message: "🎨 Our color consultation includes: Color psychology analysis, Custom color palettes, Paint selection, Material coordination, and Lighting considerations. We help create the perfect mood for your space!",
            quickReplies: ['Book consultation', 'Tell me about services', 'View portfolio']
        },
        'this week': {
            message: "Perfect! I can help you schedule a consultation this week. We have availability on Tuesday (2PM), Thursday (10AM), and Friday (3PM). Which time works best for you?",
            quickReplies: ['Tuesday 2PM', 'Thursday 10AM', 'Friday 3PM', 'Call me to arrange']
        },
        'next week': {
            message: "Great! Next week we have openings on Monday (11AM), Wednesday (1PM), and Saturday (10AM). Would you like to book one of these slots?",
            quickReplies: ['Monday 11AM', 'Wednesday 1PM', 'Saturday 10AM', 'Call me to arrange']
        },
        'residential projects': {
            message: "🏠 Our residential projects include: Modern apartments, Luxury homes, Family residences, and Vacation properties. Each project is tailored to the client's lifestyle and preferences.",
            quickReplies: ['View more projects', 'Get a quote', 'Book consultation']
        },
        'commercial projects': {
            message: "🏢 Our commercial projects include: Corporate offices, Boutique hotels, Retail spaces, and Healthcare facilities. We focus on creating functional, beautiful spaces that enhance business success.",
            quickReplies: ['View more projects', 'Get a quote', 'Book consultation']
        },
        'luxury designs': {
            message: "✨ Our luxury designs feature: Premium materials, Custom furniture, Smart home technology, and Attention to every detail. We create spaces that reflect sophistication and elegance.",
            quickReplies: ['View luxury portfolio', 'Get a quote', 'Book consultation']
        },
        'modern styles': {
            message: "🔄 Our modern designs emphasize: Clean lines, Minimalist aesthetics, Functional spaces, and Sustainable materials. We create contemporary spaces that are both beautiful and practical.",
            quickReplies: ['View modern portfolio', 'Get a quote', 'Book consultation']
        }
    };
    
    // Enhanced keyword matching with better context
    if (lowerMessage.includes('residential') || lowerMessage.includes('home') || lowerMessage.includes('house')) {
        return responses.residential;
    } else if (lowerMessage.includes('commercial') || lowerMessage.includes('office') || lowerMessage.includes('business')) {
        return responses.commercial;
    } else if (lowerMessage.includes('color') || lowerMessage.includes('palette') || lowerMessage.includes('paint')) {
        return responses.color;
    } else if (lowerMessage.includes('this week') || lowerMessage.includes('today') || lowerMessage.includes('soon')) {
        return responses['this week'];
    } else if (lowerMessage.includes('next week') || lowerMessage.includes('later')) {
        return responses['next week'];
    } else if (lowerMessage.includes('residential projects') || lowerMessage.includes('home projects')) {
        return responses['residential projects'];
    } else if (lowerMessage.includes('commercial projects') || lowerMessage.includes('business projects')) {
        return responses['commercial projects'];
    } else if (lowerMessage.includes('luxury') || lowerMessage.includes('premium') || lowerMessage.includes('high-end')) {
        return responses['luxury designs'];
    } else if (lowerMessage.includes('modern') || lowerMessage.includes('contemporary') || lowerMessage.includes('minimalist')) {
        return responses['modern styles'];
    } else if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('what do you do')) {
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
    
    // Validate input
    if (!message) {
        return;
    }
    
    if (isTyping) {
        return; // Prevent sending while bot is typing
    }
    
    // Check for spam (same message repeated)
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    if (lastMessage && lastMessage.message === message && !lastMessage.isUser) {
        addMessage("I've already responded to that. Is there something else I can help you with?", false, ['Tell me about services', 'What are your prices?', 'Book consultation']);
        return;
    }
    
    // Add user message
    addMessage(message, true);
    chatInput.value = '';
    
    // Notify admin about new conversation
    if (conversationHistory.length === 0) {
        notifyAdmin('chatbot', 'New Chatbot Conversation', `User started a conversation with message: "${message}"`, {
            userMessage: message,
            timestamp: new Date().toISOString()
        });
    }
    
    // Disable input while bot is responding
    chatInput.disabled = true;
    sendMessage.disabled = true;
    
    // Simulate bot thinking
    setTimeout(() => {
        addTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const botResponse = getBotResponse(message);
            addMessage(botResponse.message, false, botResponse.quickReplies);
            
            // Check if user wants to book appointment
            if (message.toLowerCase().includes('book') || message.toLowerCase().includes('appointment') || message.toLowerCase().includes('consultation')) {
                notifyAdmin('appointment', 'Appointment Request via Chatbot', `User requested appointment: "${message}"`, {
                    userMessage: message,
                    botResponse: botResponse.message,
                    timestamp: new Date().toISOString()
                });
            }
            
            // Re-enable input
            chatInput.disabled = false;
            sendMessage.disabled = false;
            chatInput.focus();
        }, 1000 + Math.random() * 1000);
    }, 500);
}

// Chatbot event listeners
if (chatbotButton) {
    chatbotButton.addEventListener('click', toggleChat);
}
if (closeChat) {
    closeChat.addEventListener('click', toggleChat);
}

if (sendMessage) {
    sendMessage.addEventListener('click', sendChatMessage);
}
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// Add event listeners to initial quick reply buttons
document.addEventListener('DOMContentLoaded', () => {
    const initialQuickReplies = document.querySelectorAll('.quick-reply');
    initialQuickReplies.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const reply = button.getAttribute('data-reply');
            
            // Disable all initial quick reply buttons
            initialQuickReplies.forEach(btn => btn.disabled = true);
            
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

// Callback request functionality
const callbackCheckbox = document.getElementById('callback-request');
const preferredTimeGroup = document.getElementById('preferred-time-group');

if (callbackCheckbox && preferredTimeGroup) {
    callbackCheckbox.addEventListener('change', () => {
        if (callbackCheckbox.checked) {
            preferredTimeGroup.style.display = 'block';
        } else {
            preferredTimeGroup.style.display = 'none';
        }
    });
}

// WhatsApp notification function
function sendWhatsAppNotification(message) {
    const adminWhatsAppNumber = '+15551234567'; // Replace with your actual WhatsApp number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Also notify admin panel
    notifyAdmin('whatsapp', 'WhatsApp Notification Sent', message, {
        timestamp: new Date().toISOString(),
        type: 'callback_request'
    });
}

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const budget = formData.get('budget');
    const message = formData.get('message');
    const callbackRequest = formData.get('callback-request') === 'on';
    const preferredTime = formData.get('preferred-time');
    
    // Simple validation
    if (!name || !email || !service || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Check if callback is requested
    if (callbackRequest) {
        if (!phone) {
            showNotification('Phone number is required for callback requests.', 'error');
            return;
        }
        
        // Send WhatsApp notification for callback request
        const callbackMessage = `🔔 *NEW CALLBACK REQUEST*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n📧 *Email:* ${email}\n🏠 *Service:* ${service}\n💰 *Budget:* ${budget || 'Not specified'}\n⏰ *Preferred Time:* ${preferredTime || 'Not specified'}\n\n💬 *Message:* ${message}\n\nPlease call back within 24 hours!`;
        
        sendWhatsAppNotification(callbackMessage);
        
        // Notify admin about callback request
        notifyAdmin('callback', 'New Callback Request', `Callback requested by ${name} for ${service}`, {
            name: name,
            email: email,
            phone: phone,
            service: service,
            budget: budget,
            message: message,
            preferredTime: preferredTime,
            timestamp: new Date().toISOString()
        });
    } else {
        // Regular contact form submission
        notifyAdmin('contact', 'New Contact Form Submission', `New inquiry from ${name} regarding ${service}`, {
            name: name,
            email: email,
            phone: phone,
            service: service,
            budget: budget,
            message: message,
            timestamp: new Date().toISOString()
        });
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const successMessage = callbackRequest 
            ? 'Thank you for your message! We will call you back within 24 hours. A WhatsApp notification has been sent to our team.'
            : 'Thank you for your message! We will get back to you within 24 hours.';
        
        showNotification(successMessage, 'success');
        contactForm.reset();
        
        // Hide preferred time group after form reset
        if (preferredTimeGroup) {
            preferredTimeGroup.style.display = 'none';
        }
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
    });
}

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
        try {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            newsletterForm.reset();
            
            // Notify admin about newsletter subscription
            notifyAdmin('system', 'Newsletter Subscription', `New newsletter subscription: ${email}`, {
                email: email,
                timestamp: new Date().toISOString()
            });
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
        } catch (error) {
            console.error('Error in newsletter form:', error);
            showNotification('An error occurred. Please try again.', 'error');
        }
    });
}

// WhatsApp Integration
function openWhatsApp(message = '') {
    const phoneNumber = '+15551234567'; // Replace with actual WhatsApp number
    const defaultMessage = 'Hi! I\'m interested in your interior design services. Can you help me?';
    const whatsappMessage = message || defaultMessage;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Notify admin about WhatsApp contact
    notifyAdmin('contact', 'WhatsApp Contact', `User initiated WhatsApp contact with message: "${whatsappMessage}"`, {
        message: whatsappMessage,
        timestamp: new Date().toISOString()
    });
    
    window.open(whatsappUrl, '_blank');
}

// Test notification function
function testNotification() {
    notifyAdmin('test', 'Test Notification from Main Site', 'This is a test notification triggered from the main website footer button.', {
        source: 'main-website-test',
        timestamp: new Date().toISOString()
    });
    
    showNotification('Test notification sent to admin panel!', 'success');
    console.log('Test notification sent from main website');
}

function testCallbackRequest() {
    const testMessage = `🔔 *TEST CALLBACK REQUEST*\n\n👤 *Name:* Test User\n📞 *Phone:* +1 (555) 123-4567\n📧 *Email:* test@example.com\n🏠 *Service:* Residential Design\n💰 *Budget:* $10,000\n⏰ *Preferred Time:* Morning (9AM - 12PM)\n\n💬 *Message:* This is a test callback request to verify WhatsApp notification functionality.\n\nPlease call back within 24 hours!`;
    
    sendWhatsAppNotification(testMessage);
    
    notifyAdmin('callback', 'Test Callback Request', 'Test callback request triggered from main website', {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1 (555) 123-4567',
        service: 'Residential Design',
        budget: '$10,000',
        message: 'This is a test callback request to verify WhatsApp notification functionality.',
        preferredTime: 'Morning (9AM - 12PM)',
        timestamp: new Date().toISOString()
    });
    
    showNotification('Test callback request sent! WhatsApp notification opened.', 'success');
    console.log('Test callback request sent from main website');
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
    
    // Initialize all DOM elements first
    if (!initializeDOMElements()) {
        console.error('Failed to initialize DOM elements');
        return;
    }
    
    // Setup all functionality
    setupNavbarScroll();
    setupMobileMenu();
    setupNavLinks();
    setupSmoothScrolling();
    
    // Setup callback request functionality
    const callbackCheckbox = document.getElementById('callback-request');
    const preferredTimeGroup = document.getElementById('preferred-time-group');
    
    if (callbackCheckbox && preferredTimeGroup) {
        callbackCheckbox.addEventListener('change', () => {
            try {
                if (callbackCheckbox.checked) {
                    preferredTimeGroup.style.display = 'block';
                } else {
                    preferredTimeGroup.style.display = 'none';
                }
            } catch (error) {
                console.error('Error toggling preferred time group:', error);
            }
        });
    }
    
    // Setup portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            try {
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
            } catch (error) {
                console.error('Error in portfolio filtering:', error);
            }
        });
    });
    
    // Add some initial animations
    setTimeout(() => {
        document.body.classList.add('animate-in');
    }, 100);
    
    // Add CSS for notifications and chatbot improvements
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
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
        
        .chatbot-messages {
            scrollbar-width: thin;
            scrollbar-color: var(--primary-gold) var(--beige-light);
        }
        
        .chatbot-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        .chatbot-messages::-webkit-scrollbar-track {
            background: var(--beige-light);
            border-radius: 3px;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb {
            background: var(--primary-gold);
            border-radius: 3px;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb:hover {
            background: var(--secondary-gold);
        }
        
        .message {
            animation: messageSlideIn 0.3s ease;
        }
        
        @keyframes messageSlideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(additionalStyles);
    
    // Initialize chatbot with error handling
    try {
        // Check if chatbot elements exist
        if (!chatbotButton || !chatbotBox || !chatbotMessages || !chatInput || !sendMessage) {
            console.warn('Some chatbot elements are missing');
        } else {
            console.log('Chatbot initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing chatbot:', error);
    }
    
    console.log('Website initialization completed successfully!');
});

