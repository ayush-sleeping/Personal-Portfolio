
class ScrollCardAnimations {
    constructor() {
        this.animatedElements = new Map();
        this.isMobile = window.innerWidth <= 768;
        this.lastScrollTime = 0;
        this.init();
    }

    init() {
        if (!this.isMobile) return;

        this.setupCenterDetection();
        this.addScrollListener();
    }

    setupCenterDetection() {
        this.viewportCenter = window.innerHeight / 2;
        this.tolerance = 50;

        // Get all animatable elements
        this.elements = {
            primaryCards: document.querySelectorAll('.primary-card'),
            primaryCards2: document.querySelectorAll('.primary-card2'),
            clientCards: document.querySelectorAll('.client-card'),
            socialCards: document.querySelectorAll('.social-card'),
            skillIcons: document.querySelectorAll('.home__social-link'),
            aboutBtns: document.querySelectorAll('.about-btn'),
            starIcons: document.querySelectorAll('.star-icon'),
            iconBoxes: document.querySelectorAll('.icon-boxes i')
        };

        // console.log('Found elements to animate:', {
        //     primaryCards: this.elements.primaryCards.length,
        //     clientCards: this.elements.clientCards.length,
        //     socialCards: this.elements.socialCards.length,
        //     skillIcons: this.elements.skillIcons.length
        // });
    }

    isElementInCenter(element) {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + (rect.height / 2);
        const distanceFromCenter = Math.abs(elementCenter - this.viewportCenter);
        return distanceFromCenter <= this.tolerance;
    }

    getElementId(element) {
        if (!element.dataset.animationId) {
            element.dataset.animationId = `element-${Math.random().toString(36).substr(2, 9)}`;
        }
        return element.dataset.animationId;
    }

    triggerElementAnimation(element, type) {
        const elementId = this.getElementId(element);
        const now = Date.now();

        const lastAnimated = this.animatedElements.get(elementId);
        if (lastAnimated && (now - lastAnimated) < 2000) {
            return;
        }

        // console.log(`Animating ${type}:`, elementId);

        // Apply the exact desktop hover class
        element.classList.add('scroll-animated');

        // For client cards and social cards, also animate their children
        if (type === 'primaryCard') {
            const clientCards = element.querySelectorAll('.client-card');
            const socialCards = element.querySelectorAll('.social-card');
            const aboutBtn = element.querySelector('.about-btn');
            const starIcon = element.querySelector('.star-icon');

            clientCards.forEach(card => card.classList.add('scroll-animated'));
            socialCards.forEach(card => card.classList.add('scroll-animated'));
            if (aboutBtn) aboutBtn.classList.add('scroll-animated');
            if (starIcon) starIcon.classList.add('scroll-animated');
        }

        this.animatedElements.set(elementId, now);

        // Remove animation classes after animation completes
        setTimeout(() => {
            element.classList.remove('scroll-animated');

            if (type === 'primaryCard') {
                const clientCards = element.querySelectorAll('.client-card');
                const socialCards = element.querySelectorAll('.social-card');
                const aboutBtn = element.querySelector('.about-btn');
                const starIcon = element.querySelector('.star-icon');

                clientCards.forEach(card => card.classList.remove('scroll-animated'));
                socialCards.forEach(card => card.classList.remove('scroll-animated'));
                if (aboutBtn) aboutBtn.classList.remove('scroll-animated');
                if (starIcon) starIcon.classList.remove('scroll-animated');
            }
        }, 800);

        // Haptic feedback
        // if ('vibrate' in navigator) {
        //     navigator.vibrate(30);
        // }
    }

    checkElementsInCenter() {
        // Check primary cards
        this.elements.primaryCards.forEach(card => {
            if (this.isElementInCenter(card)) {
                this.triggerElementAnimation(card, 'primaryCard');
            }
        });

        // Check primary cards 2
        this.elements.primaryCards2.forEach(card => {
            if (this.isElementInCenter(card)) {
                this.triggerElementAnimation(card, 'primaryCard2');
            }
        });

        // Check individual skill icons
        this.elements.skillIcons.forEach(icon => {
            if (this.isElementInCenter(icon)) {
                this.triggerElementAnimation(icon, 'skillIcon');
            }
        });
    }

    addScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        setTimeout(() => {
            this.checkElementsInCenter();
        }, 500);
    }

    handleScroll() {
        const now = Date.now();

        if (now - this.lastScrollTime < 50) {
            return;
        }

        this.lastScrollTime = now;
        this.checkElementsInCenter();

        // Update scroll progress
        const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        document.documentElement.style.setProperty('--scroll-progress', `${scrollPercentage}%`);
    }

    // Debug method
    debugAnimation(type, index = 0) {
        const elements = this.elements[type];
        if (elements && elements[index]) {
            this.triggerElementAnimation(elements[index], type);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const scrollAnimations = new ScrollCardAnimations();
    window.scrollAnimations = scrollAnimations;
});

// Reinitialize on resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        new ScrollCardAnimations();
    }
});
