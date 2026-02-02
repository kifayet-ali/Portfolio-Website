// ==========================================
// RESPONSIVE PORTFOLIO WEBSITE - JAVASCRIPT
// WITH EMAILJS EMAIL FUNCTIONALITY
// ==========================================

// Hamburger Menu Toggle for Mobile
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Progress bar animation with Intersection Observer
function animateProgressBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const targetWidth = progressBar.getAttribute('data-width');
                
                // Set CSS custom property for animation
                progressBar.style.setProperty('--target-width', targetWidth);
                
                // Trigger animation
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 200);
                
                // Add animation class
                entry.target.classList.add('animate');
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillCards.forEach(card => {
        observer.observe(card);
    });
}

// ==========================================
// ENHANCED CONTACT FORM WITH EMAILJS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    
    if (contactForm) {
        // Form submission with EmailJS
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields before submission
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!validateField({ target: input })) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Submit form via EmailJS
                sendEmailViaEmailJS(data);
            } else {
                showNotification('Please fill in all required fields correctly', 'error');
            }
        });
        
        // Form validation on blur and input
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
    }
    
    // Send email using EmailJS
    function sendEmailViaEmailJS(formData) {
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
        submitBtn.disabled = true;
        
        // Hide any previous messages
        formSuccess.classList.remove('show');
        formSuccess.style.display = 'none';
        formError.classList.remove('show');
        formError.style.display = 'none';
        
        // EmailJS template parameters
        // Make sure these match your EmailJS template variable names
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone || 'Not provided',
            subject: formData.subject,
            message: formData.message,
            to_email: 'dev.kifayet.ali@gmail.com' // Your email
        };
        
        // Send email using EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs from EmailJS
        emailjs.send('service_gy4ircv', 'template_brpggx5', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                submitBtn.classList.remove('loading');
                contactForm.style.display = 'none';
                formSuccess.classList.add('show');
                formSuccess.style.display = 'block';
                
                // Show success notification
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'block';
                    formSuccess.classList.remove('show');
                    formSuccess.style.display = 'none';
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 5000);
                
            }, function(error) {
                console.error('FAILED...', error);
                
                // Show error message
                submitBtn.classList.remove('loading');
                formError.classList.add('show');
                formError.style.display = 'block';
                
                // Set error message
                const errorMessage = document.getElementById('error-message');
                errorMessage.textContent = 'Failed to send message. Please try again or contact me directly at dev.kifayet.ali@gmail.com';
                
                // Show error notification
                showNotification('Failed to send message. Please try again.', 'error');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Hide error after 8 seconds
                setTimeout(() => {
                    formError.classList.remove('show');
                    formError.style.display = 'none';
                }, 8000);
            });
    }
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error
        clearError(e);
        
        // Validate based on field type
        if (field.hasAttribute('required') && !value) {
            showError(field, 'This field is required');
            field.classList.add('error');
            field.classList.remove('success');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(field, 'Please enter a valid email address');
                field.classList.add('error');
                field.classList.remove('success');
                return false;
            }
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                showError(field, 'Please enter a valid phone number');
                field.classList.add('error');
                field.classList.remove('success');
                return false;
            }
        }
        
        // Mark as success if valid
        field.classList.remove('error');
        field.classList.add('success');
        return true;
    }
    
    function showError(field, message) {
        field.style.borderColor = '#ff4757';
        field.style.background = 'rgba(255, 71, 87, 0.1)';
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff4757';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.3rem';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearError(e) {
        const field = e.target;
        field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        field.style.background = 'rgba(255, 255, 255, 0.1)';
        field.classList.remove('error');
        field.classList.remove('success');
        
        // Remove error message
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        // Smooth scroll to top when button is clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scrolling for footer navigation links
    const footerLinks = document.querySelectorAll('.footer a[href^="#"]');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Footer animation on scroll
    const footerColumns = document.querySelectorAll('.footer-column');
    
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });
    
    footerColumns.forEach(column => {
        footerObserver.observe(column);
    });
    
    // Dynamic year update
    const currentYear = new Date().getFullYear();
    const copyrightText = document.querySelector('.copyright p');
    if (copyrightText) {
        copyrightText.innerHTML = copyrightText.innerHTML.replace(/\d{4}/, currentYear);
    }
});

// Portfolio Functionality
document.addEventListener('DOMContentLoaded', function() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Portfolio filtering (if filter buttons exist)
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                portfolioItems.forEach((item, index) => {
                    if (filterValue === 'all') {
                        item.classList.remove('hide');
                        item.classList.add('show');
                        // Stagger animation
                        item.style.animationDelay = `${(index % 2) * 0.1}s`;
                    } else {
                        const categories = item.getAttribute('data-category').split(' ');
                        if (categories.includes(filterValue)) {
                            item.classList.remove('hide');
                            item.classList.add('show');
                            item.style.animationDelay = `${(index % 2) * 0.1}s`;
                        } else {
                            item.classList.add('hide');
                            item.classList.remove('show');
                        }
                    }
                });
            });
        });
    }
    
    // Animate portfolio items on scroll
    const portfolioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    portfolioItems.forEach((item, index) => {
        // Add stagger delay
        item.style.animationDelay = `${(index % 2) * 0.1}s`;
        portfolioObserver.observe(item);
    });
    
    // Animate summary stats
    const summaryNumbers = document.querySelectorAll('.summary-number');
    
    const summaryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                
                if (text.includes('%')) {
                    animateNumber(target, 0, 100, '%');
                } else if (!isNaN(text)) {
                    animateNumber(target, 0, parseInt(text), '');
                }
                
                summaryObserver.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    summaryNumbers.forEach(number => {
        summaryObserver.observe(number);
    });
});

// Number animation function
function animateNumber(element, start, end, suffix) {
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// FIXED: Documentation download function that works with local files
function downloadDocumentation(filename) {
    const button = event.target.closest('.download-btn');
    if (!button) return;
    
    const originalContent = button.innerHTML;
    
    // Add downloading state
    button.classList.add('downloading');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Downloading...</span>';
    button.disabled = true;
    
    // Try different path variations based on your folder structure
    const possiblePaths = [
        `portfolio/${filename}`,           // If running from root
        `./portfolio/${filename}`,         // Relative path
        `../portfolio/${filename}`,        // One level up
        filename                           // Same directory
    ];
    
    // Function to try downloading from multiple paths
    async function tryDownload() {
        let downloaded = false;
        
        for (let path of possiblePaths) {
            try {
                const response = await fetch(path, { 
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                
                if (response.ok) {
                    // File found! Download it
                    const link = document.createElement('a');
                    link.href = path;
                    link.download = filename;
                    link.style.display = 'none';
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    downloaded = true;
                    
                    // Success state
                    button.classList.remove('downloading');
                    button.classList.add('success');
                    button.innerHTML = '<i class="fas fa-check"></i><span>Downloaded!</span>';
                    
                    showNotification(`${filename} downloaded successfully!`, 'success');
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        button.classList.remove('success');
                        button.innerHTML = originalContent;
                        button.disabled = false;
                    }, 2000);
                    
                    break;
                }
            } catch (error) {
                // Try next path
                continue;
            }
        }
        
        if (!downloaded) {
            // All paths failed
            button.classList.remove('downloading');
            button.classList.add('error');
            button.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>File Not Found</span>';
            
            showNotification(
                `File doesn't exists`, 
                'error'
            );
            
            // Reset button after 4 seconds
            setTimeout(() => {
                button.classList.remove('error');
                button.innerHTML = originalContent;
                button.disabled = false;
            }, 4000);
            
            console.error('Download failed. Tried paths:', possiblePaths);
            console.error('Make sure you are running a local server (not file://)');
        }
    }
    
    tryDownload();
}

// Enhanced notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon;
    if (type === 'success') {
        icon = 'fas fa-check-circle';
    } else if (type === 'error') {
        icon = 'fas fa-exclamation-circle';
    } else {
        icon = 'fas fa-info-circle';
    }
    
    // Handle multi-line messages
    const formattedMessage = message.replace(/\n/g, '<br>');
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${formattedMessage}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, type === 'error' ? 6000 : 4000);
}

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .skill-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Floating elements animation
const floatingElements = document.querySelectorAll('.floating-element');

floatingElements.forEach(element => {
    const speed = element.getAttribute('data-speed') || 1;
    
    // Animate on mouse move (optional, for desktop only)
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            element.style.transform = `translate(${x * 20 * speed}px, ${y * 20 * speed}px)`;
        });
    }
});

// Handle resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
        
        // Re-enable/disable mouse move effect for floating elements
        floatingElements.forEach(element => {
            if (window.innerWidth <= 768) {
                element.style.transform = '';
            }
        });
    }, 250);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Touch swipe support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndY - touchStartY;
    
    // You can add swipe functionality here if needed
}

// Performance optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use debounced scroll handler for better performance
const debouncedScroll = debounce(() => {
    animateOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScroll, { passive: true });

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress bars
    animateProgressBars();
    
    // Initial animation check
    animateOnScroll();
    
    // Check if running on local server
    if (window.location.protocol === 'file:') {
        console.warn('%c⚠️ Warning: Running from file:// protocol', 'color: #ff4444; font-size: 14px; font-weight: bold;');
        console.warn('%c📌 For downloads to work, please use a local server:', 'color: #ff4444; font-size: 12px;');
        console.warn('%c   - Install "Live Server" VS Code extension', 'color: #ffaa00; font-size: 12px;');
        console.warn('%c   - Right-click index.html → "Open with Live Server"', 'color: #ffaa00; font-size: 12px;');
        console.warn('%c   - Or use: python -m http.server 8000', 'color: #ffaa00; font-size: 12px;');
    }
    
    // Console message
    console.log('%c👋 Hi there! Welcome to my portfolio!', 'color: #00ffff; font-size: 20px; font-weight: bold;');
    console.log('%c🚀 Looking for developers? Let\'s connect!', 'color: #ff00ff; font-size: 16px;');
    console.log('%c📧 dev.kifayet.ali@gmail.com', 'color: #ffffff; font-size: 14px;');
});

// Prevent layout shift on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Service cards animation
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        serviceObserver.observe(card);
    });
});

// About section stats animation
document.addEventListener('DOMContentLoaded', function() {
    const aboutStats = document.querySelectorAll('.about-stats .stat h4');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                
                if (text.includes('∞')) {
                    // Infinity symbol animation
                    target.style.animation = 'pulse 2s infinite';
                } else if (!isNaN(parseInt(text))) {
                    // Number animation
                    const endValue = parseInt(text);
                    animateNumber(target, 0, endValue, text.replace(/[0-9]/g, ''));
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    aboutStats.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Add CSS for pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);