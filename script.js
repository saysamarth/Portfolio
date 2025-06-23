// SEO-Optimized JavaScript with Performance Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Navigation.init();
    SmoothScroll.init();
    SkillsAnimation.init();
    HeaderEffects.init();
    ProjectEffects.init();
    ContactFormEffects.init();
    ActiveNavHighlight.init();
    SEOEnhancements.init(); // New SEO module
    
    // Initialize external libraries
    initLibraries();
});

// Navigation Module - Enhanced with accessibility
const Navigation = {
    init: function() {
        const hamburgButton = document.querySelector('.hamburg');
        const cancelButton = document.querySelector('.cancel');
        const dropdown = document.querySelector('.dropdown');
        
        if (hamburgButton) {
            hamburgButton.addEventListener('click', this.openMenu.bind(this));
        }
        
        if (cancelButton) {
            cancelButton.addEventListener('click', this.closeMenu.bind(this));
        }

        // Close menu when clicking nav links
        document.querySelectorAll('.mobile-links a').forEach(link => {
            link.addEventListener('click', this.closeMenu.bind(this));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.hamburg') && !e.target.closest('.dropdown')) {
                this.closeMenu();
            }
        });

        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    },
    
    openMenu: function() {
        const dropdown = document.querySelector(".dropdown");
        const hamburgButton = document.querySelector('.hamburg');
        
        if (dropdown) {
            dropdown.style.transform = "translateY(0)";
            document.body.style.overflow = "hidden";
            
            // Update ARIA attributes for accessibility
            if (hamburgButton) {
                hamburgButton.setAttribute('aria-expanded', 'true');
            }
        }
        document.documentElement.style.overflow = "hidden";
    },
    
    closeMenu: function() {
        const dropdown = document.querySelector(".dropdown");
        const hamburgButton = document.querySelector('.hamburg');
        
        if (dropdown) {
            dropdown.style.transform = "translateY(-100%)";
            document.body.style.overflow = "auto";
            
            // Update ARIA attributes for accessibility
            if (hamburgButton) {
                hamburgButton.setAttribute('aria-expanded', 'false');
            }
        }
        document.documentElement.style.overflow = "auto";
    }
};
// Smooth Scrolling Module - Enhanced with performance
const SmoothScroll = {
    // Animation state
    isAnimating: false,
    animationId: null,
    
    init: function() {
        // Get the actual nav height dynamically
        this.getNavHeight();
        
        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
        });
        
        // Update nav height on window resize (debounced)
        window.addEventListener('resize', this.debounce(this.getNavHeight.bind(this), 100), { passive: true });
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', this.handlePopState.bind(this), { passive: true });
    },
    
    getNavHeight: function() {
        const nav = document.querySelector('nav');
        if (nav) {
            // Use getBoundingClientRect for more accurate measurement
            this.navHeight = nav.getBoundingClientRect().height + 10;
        } else {
            this.navHeight = 90; // Fallback value
        }
    },
    
    // Debounce function to limit resize event calls
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    handleSmoothScroll: function(e) {
        e.preventDefault();
        
        // Prevent multiple animations
        if (this.isAnimating) {
            this.cancelAnimation();
        }
        
        const targetId = e.currentTarget.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (!target) return;
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            Navigation.closeMenu();
        }
        
        // Calculate positions once to avoid repeated DOM queries
        const startPosition = window.pageYOffset;
        const targetRect = target.getBoundingClientRect();
        const targetPosition = targetRect.top + startPosition - this.navHeight;
        const distance = targetPosition - startPosition;
        
        // Skip animation if already at target
        if (Math.abs(distance) < 1) {
            this.updateActiveNav(targetId);
            this.updateURL(targetId);
            return;
        }
        
        // Calculate duration based on distance - SUPER FAST like original
        const duration = Math.min(300, Math.max(150, Math.abs(distance) * 0.1));
        
        // Start custom smooth scroll animation
        this.animateScroll(startPosition, targetPosition, duration, targetId, target);
    },
    
    // Custom smooth scroll with easing
    animateScroll: function(startPos, targetPos, duration, targetId, targetElement) {
        const startTime = performance.now();
        this.isAnimating = true;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Linear easing for maximum speed - no slow start/end
            const linear = progress;
            
            // Calculate current position
            const currentPos = startPos + (targetPos - startPos) * linear;
            
            // Apply scroll position
            window.scrollTo(0, currentPos);
            
            // Continue animation if not complete
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                // Animation complete
                this.isAnimating = false;
                this.animationId = null;
                
                // Ensure exact final position
                window.scrollTo(0, targetPos);
                
                // Update URL and navigation
                this.updateURL(targetId);
                this.updateActiveNav(targetId);
                
                // Focus management for accessibility
                this.handleFocus(targetElement);
            }
        };
        
        // Start the animation
        this.animationId = requestAnimationFrame(animate);
    },
    
    // Cancel ongoing animation
    cancelAnimation: function() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isAnimating = false;
    },
    
    // Handle URL updates
    updateURL: function(targetId) {
        if (history.pushState) {
            history.pushState(null, null, targetId);
        }
    },
    
    // Handle focus for accessibility
    handleFocus: function(target) {
        // Use setTimeout to ensure scroll is complete
        setTimeout(() => {
            // Only set tabindex if element doesn't already have one
            const currentTabIndex = target.getAttribute('tabindex');
            if (!currentTabIndex) {
                target.setAttribute('tabindex', '-1');
            }
            
            // Focus with try-catch for safety
            try {
                target.focus({ preventScroll: true });
            } catch (e) {
                console.warn('Focus failed:', e);
            }
        }, 50); // Reduced timeout for better responsiveness
    },
    
    updateActiveNav: function(targetId) {
        // Cache selectors for better performance
        const navLinks = document.querySelectorAll('.links .link a, .mobile-links a');
        const targetLinks = document.querySelectorAll(`a[href="${targetId}"]`);
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        targetLinks.forEach(link => {
            link.classList.add('active');
        });
    },
    
    // Handle browser back/forward navigation
    handlePopState: function(e) {
        const hash = window.location.hash;
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                // Scroll without animation for back/forward
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - this.navHeight;
                window.scrollTo(0, targetPosition);
                this.updateActiveNav(hash);
            }
        }
    },
    
    // Public method to scroll to any element programmatically
    scrollToElement: function(selector, offset = 0) {
        const target = document.querySelector(selector);
        if (!target) return false;
        
        const startPosition = window.pageYOffset;
        const targetPosition = target.getBoundingClientRect().top + startPosition - this.navHeight - offset;
        const distance = targetPosition - startPosition;
        
        if (Math.abs(distance) < 1) return true;
        
        const duration = Math.min(300, Math.max(150, Math.abs(distance) * 0.1));
        this.animateScroll(startPosition, targetPosition, duration, '', target);
        
        return true;
    }
};
// Skills Animation Module - Optimized with Intersection Observer
const SkillsAnimation = {
    init: function() {
        const circles = document.querySelectorAll('.circle');
        if (circles.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const circle = entry.target;
                    const percent = circle.dataset.percent;
                    circle.style.setProperty('--percent', percent);
                    circle.style.animation = 'circleGrowth 1.5s cubic-bezier(0.26, 0.86, 0.44, 0.985) forwards';
                    observer.unobserve(circle); // Stop observing once animated
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });
        
        circles.forEach(circle => observer.observe(circle));
    }
};

// Header Scroll Effects Module - Throttled for performance
const HeaderEffects = {
    init: function() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        let ticking = false;
        
        const updateNav = () => {
            if (window.scrollY > 100) {
                nav.style.padding = '0.7rem 5%';
                nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
                nav.classList.add('nav-scrolled');
            } else {
                nav.style.padding = '1rem 5%';
                nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
                nav.classList.remove('nav-scrolled');
            }
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateNav);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
};

// Project Hover Effects Module - Enhanced with touch support
const ProjectEffects = {
    init: function() {
        document.querySelectorAll('.project-card').forEach(card => {
            // Mouse events
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
            
            // Touch events for mobile
            card.addEventListener('touchstart', () => {
        card.classList.add('active-touch');
      }, { passive: true });
      
      card.addEventListener('touchend', () => {
        card.classList.remove('active-touch');
      }, { passive: true });
    });
  }
};

// Contact Form Effects Module - Enhanced with validation and analytics
const ContactFormEffects = {
    init: function() {
        const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
        const form = document.getElementById('myForm');
        
        // Input focus effects
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--accent-color)';
                input.parentElement?.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.style.borderColor = 'var(--card-border)';
                    input.parentElement?.classList.remove('focused');
                }
            });
            
            // Real-time validation
            input.addEventListener('input', this.validateInput);
        });
        
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    },
    
    validateInput: function(event) {
        const input = event.target;
        const isValid = input.checkValidity();
        
        input.classList.toggle('invalid', !isValid);
        input.classList.toggle('valid', isValid && input.value.length > 0);
    },
    
    handleSubmit: async function(event) {
        event.preventDefault();
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Analytics tracking (if Google Analytics is setup)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Contact',
                'event_label': 'Contact Form Submission'
            });
        }
        
        try {
            submitButton.textContent = 'Sending...';
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                form.reset();
                this.showSuccessMessage('Message sent successfully! I\'ll get back to you soon.');
                
                // Analytics success event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit_success', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form Success'
                    });
                }
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Sorry, there was an error sending your message. Please try again or email me directly.');
            
            // Analytics error event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit_error', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form Error'
                });
            }
        } finally {
            submitButton.textContent = originalText;
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    },
    
    showSuccessMessage: function(message) {
        this.showNotification(message, 'success');
    },
    
    showErrorMessage: function(message) {
        this.showNotification(message, 'error');
    },
    
    showNotification: function(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 5000);
    }
};

// Active Navigation Highlight Module - Optimized with throttling
const ActiveNavHighlight = {
    init: function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.links .link a, .mobile-links a');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        let ticking = false;
        
        const updateActiveNav = () => {
            let current = '';
            const scrollPosition = window.pageYOffset + 150; // Offset for better detection
            
            // Find the current section
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            // If we're at the very top, highlight home
            if (window.pageYOffset < 100) {
                current = 'home';
            }
            
            // Update navigation highlights
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateActiveNav);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Set initial active state
        updateActiveNav();
    }
};

// New SEO Enhancements Module
const SEOEnhancements = {
    init: function() {
        this.addStructuredData();
        this.optimizeImages();
        this.addBreadcrumbs();
        this.trackPageViews();
        this.addPreloadHints();
    },
    
    addStructuredData: function() {
        // Additional structured data for projects
        const projects = document.querySelectorAll('.project-card');
        const projectsData = [];
        
        projects.forEach((project, index) => {
            const title = project.querySelector('h3')?.textContent;
            const description = project.querySelector('p')?.textContent;
            const githubLink = project.querySelector('.project-link')?.href;
            
            if (title && description) {
                projectsData.push({
                    "@type": "CreativeWork",
                    "name": title,
                    "description": description,
                    "url": githubLink,
                    "creator": {
                        "@type": "Person",
                        "name": "Samarth Sharma"
                    }
                });
            }
        });
        
        if (projectsData.length > 0) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": projectsData.map((project, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": project
                }))
            });
            document.head.appendChild(script);
        }
    },
    
    optimizeImages: function() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for images below the fold
            if (!img.hasAttribute('loading')) {
                const rect = img.getBoundingClientRect();
                if (rect.top > window.innerHeight) {
                    img.setAttribute('loading', 'lazy');
                }
            }
            
            // Add error handling
            img.addEventListener('error', function() {
                console.warn('Failed to load image:', this.src);
                this.style.display = 'none';
            });
        });
    },
    
    addBreadcrumbs: function() {
        // Simple breadcrumb structure for SEO
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": window.location.origin
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Samarth Sharma Portfolio",
                    "item": window.location.href
                }
            ]
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
    },
    
    trackPageViews: function() {
        // Page view tracking for analytics
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                'page_title': document.title,
                'page_location': window.location.href
            });
        }
        
        // Track time on page
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'page_view_duration',
                    'value': Math.round(timeOnPage / 1000)
                });
            }
        });
    },
    
    addPreloadHints: function() {
        // Add resource hints for better performance
        const link1 = document.createElement('link');
        link1.rel = 'dns-prefetch';
        link1.href = '//cdnjs.cloudflare.com';
        document.head.appendChild(link1);
        
        const link2 = document.createElement('link');
        link2.rel = 'dns-prefetch';
        link2.href = '//unpkg.com';
        document.head.appendChild(link2);
        
        const link3 = document.createElement('link');
        link3.rel = 'dns-prefetch';
        link3.href = '//formspree.io';
        document.head.appendChild(link3);
    }
};

// Initialize external libraries with error handling
function initLibraries() {
    try {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                offset: 120,
                duration: 800,
                easing: 'ease-out',
                once: true,
                mirror: false,
                anchorPlacement: 'top-bottom'
            });
        }
        
        // Initialize Typed.js
        if (typeof Typed !== 'undefined') {
            const typed = new Typed('.auto-type', {
                strings: [
                    'Flutter Developer', 
                    'Software Engineer', 
                    'Full Stack Developer',
                    'Mobile App Developer',
                    'GenAI Enthusiast'
                ],
                typeSpeed: 60,
                backSpeed: 36,
                backDelay: 1100,
                startDelay: 500,
                loop: true,
                smartBackspace: true
            });
        }
    } catch (error) {
        console.error('Error initializing libraries:', error);
    }
}

// Performance monitoring
const PerformanceMonitor = {
    init: function() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            import('web-vitals').then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
                getCLS(this.sendToAnalytics);
                getFID(this.sendToAnalytics);
                getFCP(this.sendToAnalytics);
                getLCP(this.sendToAnalytics);
                getTTFB(this.sendToAnalytics);
            });
        }
    },
    
    sendToAnalytics: function(metric) {
        if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
                'event_category': 'Web Vitals',
                'value': Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                'event_label': metric.id,
                'non_interaction': true,
            });
        }
    }
};

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    PerformanceMonitor.init();
});

// Global functions for backward compatibility
function hamburg() {
    Navigation.openMenu();
}

function cancel() {
    Navigation.closeMenu();
}