// Mobile Menu Functionality
function hamburg() {
    document.querySelector(".dropdown").style.transform = "translateY(0)";
    document.body.style.overflow = "hidden";
}

function cancel() {
    document.querySelector(".dropdown").style.transform = "translateY(-100%)";
    document.body.style.overflow = "auto";
}

// Close menu when clicking on a link or outside the menu
document.querySelectorAll('.mobile-links a').forEach(link => {
    link.addEventListener('click', () => {
        cancel();
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.hamburg') && !e.target.closest('.dropdown')) {
        cancel();
    }
});

// Smooth Scroll with improved offset for header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Animate Skill Circles with enhanced effect
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

// Header scroll effect
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

// Project hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Contact form animations
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

// Initialize AOS with optimized settings
AOS.init({
    offset: 120,
    duration: 800,
    easing: 'ease-out',
    once: true,
    mirror: false,
    anchorPlacement: 'top-bottom'
});

// Initialize TypedJS with expanded options
const typed = new Typed('.auto-type', {
    strings: ['Software Developer', 'Full Stack Developer', 'GenAI Enthusiast'],
    typeSpeed: 50,
    backSpeed: 33,
    backDelay: 1000,
    startDelay: 500,
    loop: true,
    smartBackspace: true
});

// Active link highlighting based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.links .link a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
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