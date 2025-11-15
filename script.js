/**
 * Dr. A. P. J. Abdul Kalam Tribute Page - Interactive Elements
 * This script handles all interactive features including:
 * - Smooth scrolling for anchor links
 * - Back to top button
 * - Scroll-based animations
 * - Lightbox for gallery images (if any)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to body to trigger initial animations
    document.body.classList.add('loaded');
    
    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    
    // Show/hide back to top button based on scroll position with smooth transition
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    }
    
    // Initial check
    toggleBackToTop();
    
    // Listen for scroll events
    window.addEventListener('scroll', toggleBackToTop);
    
    // Smooth scroll to top when button is clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Don't prevent default behavior for # links without a target
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate the offset to account for fixed header
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });
    
    // Initialize Intersection Observer for scroll animations
    function animateOnScroll() {
        const elements = document.querySelectorAll('.timeline-item, .fact-card, .quote-card, .achievement-card, .gallery-item');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            observer.observe(element);
            
            // Add animation class when element comes into view
            const animateElement = () => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    window.removeEventListener('scroll', animateElement);
                }
            };
            
            window.addEventListener('scroll', animateElement);
            animateElement(); // Run once on load
        });
    }
    
    // Run the animation function once the page is loaded
    setTimeout(animateOnScroll, 500);
    
    // Also run on window resize to handle any layout changes
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
    
    // Add print functionality
    const printButton = document.createElement('button');
    printButton.textContent = 'Print This Page';
    printButton.className = 'btn print-btn';
    printButton.style.margin = '2rem auto';
    printButton.style.display = 'block';
    printButton.onclick = () => window.print();
    
    const legacySection = document.querySelector('.legacy .container');
    if (legacySection) {
        legacySection.appendChild(printButton);
    }
    
    // Add loading animation for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            img.loading = 'lazy';
        });
    } else {
        // Fallback for browsers that don't support loading attribute
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
            imageObserver.observe(img);
        });
    }
    
    // Add keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        // Skip navigation for inputs and textareas
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }
        
        // Handle tab key for focus management
        if (e.key === 'Tab') {
            // Add focus styles to focused elements
            document.documentElement.classList.add('user-is-tabbing');
        }
    });
    
    // Click outside to close any open dropdowns/modals
    document.addEventListener('click', function(e) {
        // This is a placeholder for any future dropdown/modal functionality
    });
    
    // Add a small delay to ensure all resources are loaded
    window.addEventListener('load', function() {
        document.body.classList.add('fully-loaded');
        
        // Remove the loading class after a short delay
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 300);
    });
    
    // Add print styles dynamically
    const printStyles = `
        @media print {
            @page {
                margin: 1.5cm;
            }
            
            body {
                font-size: 12pt;
                line-height: 1.5;
                color: #000;
                background: #fff;
            }
            
            .header, .footer, .back-to-top, .btn, .print-btn {
                display: none !important;
            }
            
            .container {
                max-width: 100%;
                padding: 0;
            }
            
            .section {
                padding: 1.5cm 0;
                page-break-inside: avoid;
            }
            
            h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
            }
            
            a {
                text-decoration: none;
                color: #000;
            }
            
            .timeline::before {
                display: none;
            }
            
            .timeline-item {
                width: 100% !important;
                padding: 0 !important;
                margin-bottom: 1.5cm !important;
            }
            
            .timeline-item::after {
                display: none;
            }
            
            .timeline-year {
                background: #fff !important;
                color: #000 !important;
                border: 1px solid #000;
            }
            
            .timeline-content {
                box-shadow: none !important;
                border: 1px solid #eee !important;
            }
            
            .quotes {
                background: #fff !important;
                color: #000 !important;
            }
            
            .quote-card {
                background: #fff !important;
                border: 1px solid #eee !important;
                color: #000 !important;
            }
            
            .quote-card i {
                color: #666 !important;
            }
            
            .achievement-card {
                page-break-inside: avoid;
            }
            
            .gallery {
                display: none;
            }
            
            .footer {
                padding: 1cm 0;
            }
            
            .footer-section {
                margin-bottom: 1cm;
            }
            
            .social-links {
                display: none;
            }
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);
});

// Add a class to the body when the user is using a keyboard for navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
    }
});

// Add a class to the body when the user is using a mouse
// This helps with styling focus states appropriately
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-user');
});

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    // This ensures smooth scrolling works with browser navigation
    if (location.hash) {
        const targetElement = document.querySelector(location.hash);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
