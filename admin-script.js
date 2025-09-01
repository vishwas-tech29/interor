// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.notifications = [];
        this.appointments = [];
        this.conversations = [];
        this.whatsappMessages = [];
        this.init();
    }

    init() {
        try {
            console.log('Initializing admin panel...');
            
            this.setupNavigation();
            this.loadDashboardData();
            this.loadNotifications();
            this.loadAppointments();
            this.loadConversations();
            this.loadWhatsAppMessages();
            this.setupEventListeners();
            this.updateNotificationBadge();
            
            // Refresh notifications every 5 seconds to catch new ones
            setInterval(() => {
                try {
                    this.loadNotifications();
                } catch (error) {
                    console.error('Error in notification refresh:', error);
                }
            }, 5000);
            
            console.log('Admin panel initialized successfully');
        } catch (error) {
            console.error('Error initializing admin panel:', error);
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const contentSections = document.querySelectorAll('.content-section');
        const pageTitle = document.getElementById('page-title');
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                
                // Update active nav link
                navLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
                
                // Update active content section
                contentSections.forEach(section => section.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
                
                // Update page title
                pageTitle.textContent = link.querySelector('span').textContent;
                
                // Close sidebar on mobile
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                }
                
                this.currentSection = targetSection;
            });
        });

        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    setupEventListeners() {
        // Notification form
        const notificationForm = document.getElementById('notification-form');
        if (notificationForm) {
            notificationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendNotification();
            });
        }

        // Appointment form
        const appointmentForm = document.getElementById('appointment-form');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addAppointment();
            });
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterItems(filter, button);
            });
        });

        // Settings forms
        const settingsForms = document.querySelectorAll('.settings-form');
        settingsForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings(form);
            });
        });

        // Add test notification button functionality
        const testNotificationBtn = document.getElementById('test-notification');
        if (testNotificationBtn) {
            testNotificationBtn.addEventListener('click', () => {
                this.createTestNotification();
            });
        }
    }

    loadDashboardData() {
        this.loadActivityList();
        this.updateStats();
    }

    loadActivityList() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;

        const activities = [
            {
                type: 'chatbot',
                title: 'New chatbot conversation',
                description: 'User asked about residential design services',
                time: '2 minutes ago',
                icon: 'fas fa-robot'
            },
            {
                type: 'appointment',
                title: 'Appointment scheduled',
                description: 'Sarah Johnson - Consultation on Friday 2PM',
                time: '15 minutes ago',
                icon: 'fas fa-calendar-check'
            },
            {
                type: 'contact',
                title: 'New contact form submission',
                description: 'John Smith - Commercial design inquiry',
                time: '1 hour ago',
                icon: 'fas fa-envelope'
            },
            {
                type: 'chatbot',
                title: 'Chatbot conversation completed',
                description: 'User booked consultation through chatbot',
                time: '2 hours ago',
                icon: 'fas fa-robot'
            }
        ];

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }

    updateStats() {
        // Update statistics with real-time data
        const stats = {
            visitors: 1247,
            conversations: 89,
            appointments: 23,
            messages: 7
        };

        // Animate numbers
        Object.keys(stats).forEach(key => {
            const element = document.querySelector(`[data-stat="${key}"]`);
            if (element) {
                this.animateNumber(element, stats[key]);
            }
        });
    }

    animateNumber(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 20);
    }

    loadNotifications() {
        try {
            // Load notifications from localStorage (from main website)
            const storedNotifications = localStorage.getItem('adminNotifications');
            if (storedNotifications) {
                try {
                    this.notifications = JSON.parse(storedNotifications);
                    console.log('Loaded notifications from localStorage:', this.notifications);
                } catch (error) {
                    console.error('Error parsing notifications from localStorage:', error);
                    this.notifications = [];
                }
            } else {
                console.log('No notifications found in localStorage');
                // Default notifications if none exist
                this.notifications = [
                    {
                        id: 1,
                        type: 'chatbot',
                        title: 'New Chatbot Conversation',
                        message: 'User inquired about residential design services and pricing.',
                        time: '2 minutes ago',
                        priority: 'medium'
                    },
                    {
                        id: 2,
                        type: 'appointment',
                        title: 'Appointment Confirmed',
                        message: 'Sarah Johnson confirmed consultation for Friday at 2PM.',
                        time: '15 minutes ago',
                        priority: 'high'
                    },
                    {
                        id: 3,
                        type: 'contact',
                        title: 'Contact Form Submission',
                        message: 'New inquiry from John Smith regarding commercial design.',
                        time: '1 hour ago',
                        priority: 'medium'
                    },
                    {
                        id: 4,
                        type: 'system',
                        title: 'System Update',
                        message: 'WhatsApp integration has been successfully connected.',
                        time: '2 hours ago',
                        priority: 'low'
                    }
                ];
            }

            this.renderNotifications();
        } catch (error) {
            console.error('Error in loadNotifications:', error);
            this.notifications = [];
            this.renderNotifications();
        }
    }

    renderNotifications() {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;

        notificationsList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.type}">
                <div class="notification-header">
                    <span class="notification-title">${notification.title}</span>
                    <span class="notification-time">${notification.time}</span>
                </div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-actions">
                    <button onclick="adminPanel.markAsRead(${notification.id})">Mark as Read</button>
                    <button onclick="adminPanel.deleteNotification(${notification.id})">Delete</button>
                    <button onclick="adminPanel.replyToNotification(${notification.id})">Reply</button>
                </div>
            </div>
        `).join('');
    }

    loadAppointments() {
        this.appointments = [
            {
                id: 1,
                client: 'Sarah Johnson',
                email: 'sarah@email.com',
                phone: '+1 (555) 123-4567',
                service: 'Consultation',
                date: '2024-01-15',
                time: '14:00',
                status: 'confirmed',
                source: 'Chatbot',
                notes: 'Interested in residential design'
            },
            {
                id: 2,
                client: 'Michael Chen',
                email: 'michael@email.com',
                phone: '+1 (555) 234-5678',
                service: 'Residential Design',
                date: '2024-01-16',
                time: '10:00',
                status: 'pending',
                source: 'Website',
                notes: 'Complete home renovation project'
            },
            {
                id: 3,
                client: 'Emily Rodriguez',
                email: 'emily@email.com',
                phone: '+1 (555) 345-6789',
                service: 'Color Consultation',
                date: '2024-01-17',
                time: '15:30',
                status: 'completed',
                source: 'WhatsApp',
                notes: 'Kitchen and living room colors'
            }
        ];

        this.renderAppointments();
    }

    renderAppointments() {
        const appointmentsTable = document.getElementById('appointments-table-body');
        if (!appointmentsTable) return;

        appointmentsTable.innerHTML = this.appointments.map(appointment => `
            <tr>
                <td>
                    <div>
                        <strong>${appointment.client}</strong><br>
                        <small>${appointment.email}</small>
                    </div>
                </td>
                <td>${appointment.service}</td>
                <td>${appointment.date} at ${appointment.time}</td>
                <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                <td>${appointment.source}</td>
                <td>
                    <button onclick="adminPanel.editAppointment(${appointment.id})" class="btn-secondary">Edit</button>
                    <button onclick="adminPanel.deleteAppointment(${appointment.id})" class="btn-secondary">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    loadConversations() {
        this.conversations = [
            {
                id: 1,
                user: 'Anonymous User',
                preview: 'Tell me about your services',
                time: '2 minutes ago',
                messages: 5
            },
            {
                id: 2,
                user: 'Sarah Johnson',
                preview: 'What are your prices?',
                time: '15 minutes ago',
                messages: 8
            },
            {
                id: 3,
                user: 'John Smith',
                preview: 'Book a consultation',
                time: '1 hour ago',
                messages: 12
            }
        ];

        this.renderConversations();
    }

    renderConversations() {
        const conversationList = document.getElementById('conversation-list');
        if (!conversationList) return;

        conversationList.innerHTML = this.conversations.map(conversation => `
            <div class="conversation-item">
                <div class="conversation-header">
                    <span class="conversation-user">${conversation.user}</span>
                    <span class="conversation-time">${conversation.time}</span>
                </div>
                <div class="conversation-preview">${conversation.preview}</div>
                <small>${conversation.messages} messages</small>
            </div>
        `).join('');
    }

    loadWhatsAppMessages() {
        this.whatsappMessages = [
            {
                id: 1,
                sender: 'Sarah Johnson',
                message: 'Hi, I'm interested in booking a consultation',
                time: '2 minutes ago',
                status: 'received'
            },
            {
                id: 2,
                sender: 'Michael Chen',
                message: 'Thank you for the appointment confirmation',
                time: '15 minutes ago',
                status: 'read'
            },
            {
                id: 3,
                sender: 'Emily Rodriguez',
                message: 'Can you send me the color palette options?',
                time: '1 hour ago',
                status: 'sent'
            }
        ];

        this.renderWhatsAppMessages();
    }

    renderWhatsAppMessages() {
        const whatsappMessages = document.getElementById('whatsapp-messages');
        if (!whatsappMessages) return;

        const messagesList = whatsappMessages.querySelector('.messages-list');
        if (!messagesList) return;

        messagesList.innerHTML = this.whatsappMessages.map(message => `
            <div class="message-item">
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="message-content">
                    <h4>${message.sender}</h4>
                    <p>${message.message}</p>
                </div>
                <div class="activity-time">${message.time}</div>
            </div>
        `).join('');
    }

    // Notification Management
    sendNotification() {
        const form = document.getElementById('notification-form');
        const formData = new FormData(form);
        
        const notification = {
            id: Date.now(),
            type: formData.get('notification-type'),
            title: formData.get('notification-title'),
            message: formData.get('notification-message'),
            priority: formData.get('notification-priority'),
            time: 'Just now',
            sendWhatsApp: formData.get('send-whatsapp') === 'on'
        };

        this.notifications.unshift(notification);
        this.renderNotifications();
        this.updateNotificationBadge();
        this.closeNotificationModal();

        // Send WhatsApp if selected
        if (notification.sendWhatsApp) {
            this.sendWhatsAppMessage(notification.message);
        }

        // Show success message
        this.showToast('Notification sent successfully!', 'success');
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.renderNotifications();
            this.updateNotificationBadge();
        }
    }

    deleteNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.renderNotifications();
        this.updateNotificationBadge();
        this.showToast('Notification deleted', 'info');
    }

    replyToNotification(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            // Open reply modal or redirect to appropriate section
            this.showToast('Reply functionality coming soon', 'info');
        }
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        if (badge) {
            const unreadCount = this.notifications.filter(n => !n.read).length;
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'inline' : 'none';
        }
    }

    // Appointment Management
    addAppointment() {
        const form = document.getElementById('appointment-form');
        const formData = new FormData(form);
        
        const appointment = {
            id: Date.now(),
            client: formData.get('client-name'),
            email: formData.get('client-email'),
            phone: formData.get('client-phone'),
            service: formData.get('appointment-service'),
            date: formData.get('appointment-date'),
            time: formData.get('appointment-time'),
            status: 'pending',
            source: 'Admin Panel',
            notes: formData.get('appointment-notes')
        };

        this.appointments.unshift(appointment);
        this.renderAppointments();
        this.closeAppointmentModal();

        // Send WhatsApp notification
        this.sendWhatsAppMessage(`New appointment scheduled: ${appointment.client} - ${appointment.service} on ${appointment.date} at ${appointment.time}`);

        this.showToast('Appointment added successfully!', 'success');
    }

    editAppointment(id) {
        const appointment = this.appointments.find(a => a.id === id);
        if (appointment) {
            // Populate form and open modal
            this.showToast('Edit functionality coming soon', 'info');
        }
    }

    deleteAppointment(id) {
        this.appointments = this.appointments.filter(a => a.id !== id);
        this.renderAppointments();
        this.showToast('Appointment deleted', 'info');
    }

    // WhatsApp Integration
    sendWhatsAppMessage(message) {
        // Simulate WhatsApp API call
        console.log('Sending WhatsApp message:', message);
        
        // Add to messages list
        const whatsappMessage = {
            id: Date.now(),
            sender: 'Admin',
            message: message,
            time: 'Just now',
            status: 'sent'
        };

        this.whatsappMessages.unshift(whatsappMessage);
        this.renderWhatsAppMessages();
        
        this.showToast('WhatsApp message sent!', 'success');
    }

    testWhatsApp() {
        this.sendWhatsAppMessage('Test message from admin panel');
    }

    // Filtering
    filterItems(filter, button) {
        // Update active filter button
        const filterButtons = button.parentElement.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter notifications
        if (this.currentSection === 'notifications') {
            const filteredNotifications = filter === 'all' 
                ? this.notifications 
                : this.notifications.filter(n => n.type === filter);
            this.renderFilteredNotifications(filteredNotifications);
        }

        // Filter appointments
        if (this.currentSection === 'appointments') {
            const filteredAppointments = filter === 'all'
                ? this.appointments
                : this.appointments.filter(a => a.status === filter);
            this.renderFilteredAppointments(filteredAppointments);
        }
    }

    renderFilteredNotifications(notifications) {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;

        notificationsList.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.type}">
                <div class="notification-header">
                    <span class="notification-title">${notification.title}</span>
                    <span class="notification-time">${notification.time}</span>
                </div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-actions">
                    <button onclick="adminPanel.markAsRead(${notification.id})">Mark as Read</button>
                    <button onclick="adminPanel.deleteNotification(${notification.id})">Delete</button>
                    <button onclick="adminPanel.replyToNotification(${notification.id})">Reply</button>
                </div>
            </div>
        `).join('');
    }

    renderFilteredAppointments(appointments) {
        const appointmentsTable = document.getElementById('appointments-table-body');
        if (!appointmentsTable) return;

        appointmentsTable.innerHTML = appointments.map(appointment => `
            <tr>
                <td>
                    <div>
                        <strong>${appointment.client}</strong><br>
                        <small>${appointment.email}</small>
                    </div>
                </td>
                <td>${appointment.service}</td>
                <td>${appointment.date} at ${appointment.time}</td>
                <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                <td>${appointment.source}</td>
                <td>
                    <button onclick="adminPanel.editAppointment(${appointment.id})" class="btn-secondary">Edit</button>
                    <button onclick="adminPanel.deleteAppointment(${appointment.id})" class="btn-secondary">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Settings Management
    saveSettings(form) {
        const formData = new FormData(form);
        const settings = {};
        
        for (let [key, value] of formData.entries()) {
            settings[key] = value;
        }

        // Save to localStorage (in real app, save to server)
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        
        this.showToast('Settings saved successfully!', 'success');
    }

    // Modal Management
    openNotificationModal() {
        const modal = document.getElementById('notification-modal');
        modal.classList.add('active');
    }

    closeNotificationModal() {
        const modal = document.getElementById('notification-modal');
        modal.classList.remove('active');
        document.getElementById('notification-form').reset();
    }

    openAppointmentModal() {
        const modal = document.getElementById('appointment-modal');
        modal.classList.add('active');
    }

    closeAppointmentModal() {
        const modal = document.getElementById('appointment-modal');
        modal.classList.remove('active');
        document.getElementById('appointment-form').reset();
    }

    // Utility Functions
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    exportData() {
        const data = {
            notifications: this.notifications,
            appointments: this.appointments,
            conversations: this.conversations,
            whatsappMessages: this.whatsappMessages
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `luxe-interiors-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Data exported successfully!', 'success');
    }

    generateReport() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (!startDate || !endDate) {
            this.showToast('Please select start and end dates', 'error');
            return;
        }

        // Generate report logic here
        this.showToast('Report generated successfully!', 'success');
    }

    createTestNotification() {
        const testNotification = {
            id: Date.now(),
            type: 'test',
            title: 'Test Notification',
            message: 'This is a test notification created from admin panel.',
            time: 'Just now',
            priority: 'medium',
            data: { source: 'admin-panel-test' }
        };

        // Add to current notifications
        this.notifications.unshift(testNotification);
        
        // Update localStorage
        localStorage.setItem('adminNotifications', JSON.stringify(this.notifications));
        
        // Re-render
        this.renderNotifications();
        this.updateNotificationBadge();
        
        this.showToast('Test notification created!', 'success');
        console.log('Test notification created:', testNotification);
    }

    clearAllNotifications() {
        this.notifications = [];
        localStorage.removeItem('adminNotifications');
        this.renderNotifications();
        this.updateNotificationBadge();
        this.showToast('All notifications cleared!', 'success');
        console.log('All notifications cleared');
    }

    debugNotifications() {
        console.log('=== Admin Panel Debug Info ===');
        console.log('Current notifications array:', this.notifications);
        console.log('localStorage adminNotifications:', localStorage.getItem('adminNotifications'));
        console.log('localStorage parsed:', JSON.parse(localStorage.getItem('adminNotifications') || '[]'));
        console.log('Notification count:', this.notifications.length);
        console.log('=============================');
    }

    refreshNotifications() {
        this.loadNotifications();
        this.showToast('Notifications refreshed!', 'success');
        console.log('Notifications refreshed manually');
    }

    testWhatsAppNotification() {
        const testMessage = `🔔 *ADMIN PANEL TEST*\n\nThis is a test WhatsApp notification from the admin panel.\n\n📅 *Time:* ${new Date().toLocaleString()}\n🔧 *Source:* Admin Panel\n\nThis confirms the WhatsApp integration is working properly.`;
        
        const adminWhatsAppNumber = '+15551234567'; // Replace with your actual WhatsApp number
        const encodedMessage = encodeURIComponent(testMessage);
        const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Create notification record
        this.createTestNotification();
        
        this.showToast('WhatsApp test notification sent!', 'success');
        console.log('WhatsApp test notification sent from admin panel');
    }
}

// Global functions for onclick handlers
function openNotificationModal() {
    adminPanel.openNotificationModal();
}

function closeNotificationModal() {
    adminPanel.closeNotificationModal();
}

function openAppointmentModal() {
    adminPanel.openAppointmentModal();
}

function closeAppointmentModal() {
    adminPanel.closeAppointmentModal();
}

function sendNotification() {
    adminPanel.openNotificationModal();
}

function openWhatsApp() {
    adminPanel.testWhatsApp();
}

function viewAppointments() {
    // Navigate to appointments section
    document.querySelector('[href="#appointments"]').click();
}

function exportData() {
    adminPanel.exportData();
}

function testWhatsApp() {
    adminPanel.testWhatsApp();
}

function addTemplate() {
    adminPanel.showToast('Template functionality coming soon', 'info');
}

function addWhatsAppTemplate() {
    adminPanel.showToast('WhatsApp template functionality coming soon', 'info');
}

function generateReport() {
    adminPanel.generateReport();
}

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
    
    // Add toast styles
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            padding: 1rem 1.5rem;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 10000;
            max-width: 300px;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-success {
            border-left: 4px solid #28a745;
        }
        
        .toast-error {
            border-left: 4px solid #dc3545;
        }
        
        .toast-info {
            border-left: 4px solid #17a2b8;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 0.8rem;
        }
        
        .toast-content i {
            font-size: 1.2rem;
        }
        
        .toast-success .toast-content i {
            color: #28a745;
        }
        
        .toast-error .toast-content i {
            color: #dc3545;
        }
        
        .toast-info .toast-content i {
            color: #17a2b8;
        }
    `;
    document.head.appendChild(toastStyles);
});

// Add real-time updates simulation
setInterval(() => {
    if (adminPanel) {
        // Simulate new notifications
        if (Math.random() < 0.1) {
            const newNotification = {
                id: Date.now(),
                type: ['chatbot', 'appointment', 'contact', 'system'][Math.floor(Math.random() * 4)],
                title: 'New Activity',
                message: 'New activity detected in the system',
                time: 'Just now',
                priority: 'medium'
            };
            adminPanel.notifications.unshift(newNotification);
            adminPanel.renderNotifications();
            adminPanel.updateNotificationBadge();
        }
    }
}, 30000); // Check every 30 seconds
