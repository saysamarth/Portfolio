document.addEventListener('DOMContentLoaded', function() {
    Navigation.init();
    SmoothScroll.init();
    SkillsAnimation.init();
    HeaderEffects.init();
    ProjectEffects.init();
    ContactFormEffects.init();
    ActiveNavHighlight.init();

    initLibraries();
});

// Navigation Module
const Navigation = {
    init: function() {
        document.querySelector('.hamburg').addEventListener('click', this.openMenu);
        document.querySelector('.cancel').addEventListener('click', this.closeMenu);

        document.querySelectorAll('.mobile-links a').forEach(link => {
            link.addEventListener('click', this.closeMenu);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.hamburg') && !e.target.closest('.dropdown')) {
                this.closeMenu();
            }
        });
    },
    openMenu: function() {
        document.querySelector(".dropdown").style.transform = "translateY(0)";
        document.body.style.overflow = "hidden";
    },
    closeMenu: function() {
        document.querySelector(".dropdown").style.transform = "translateY(-100%)";
        document.body.style.overflow = "auto";
    }
};

// Smooth Scrolling Module
const SmoothScroll = {
    init: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (!target) return;
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
};

// Skills Animation Module
const SkillsAnimation = {
    init: function() {
        document.querySelectorAll('.circle').forEach(circle => {
            const percent = circle.dataset.percent;
            circle.style.setProperty('--percent', percent);
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) {
                        circle.style.animation = 'circleGrowth 1.5s cubic-bezier(0.26, 0.86, 0.44, 0.985) forwards';
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(circle);
        });
    }
};

// Header Scroll Effects Module
const HeaderEffects = {
    init: function() {
        const nav = document.querySelector('nav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.style.padding = '0.7rem 5%';
                nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            } else {
                nav.style.padding = '1rem 5%';
                nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
            }
        });
    }
};

// Project Hover Effects Module
const ProjectEffects = {
    init: function() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
};

// Contact Form Effects Module
const ContactFormEffects = {
    init: function() {
        const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--accent-color)';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.style.borderColor = 'var(--card-border)';
                }
            });
        });
        const form = document.getElementById('myForm');
        if (form) {
            form.addEventListener('submit', this.handleSubmit);
        }
    },
    handleSubmit: async function(event) {
        event.preventDefault();
        const submitButton = event.target.querySelector('button[type="submit"]');
        try {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            const formData = new FormData(event.target);
            const response = await fetch(event.target.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                event.target.reset();
                alert('Message sent successfully!');
            } else {
                alert('Submission failed. Please try again.');
            }
        } catch (error) {
            alert('Network error. Please check your connection.');
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }
};

// Active Navigation Highlight Module
const ActiveNavHighlight = {
    init: function() {
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.links .link a');
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
};

// Initialize external libraries
function initLibraries() {

    AOS.init({
        offset: 120,
        duration: 800,
        easing: 'ease-out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom'
    });
    
    const typed = new Typed('.auto-type', {
        strings: ['Software Developer', 'Full Stack Developer', 'GenAI Enthusiast'],
        typeSpeed: 60,
        backSpeed: 36,
        backDelay: 1100,
        startDelay: 500,
        loop: true,
        smartBackspace: true
    });
}