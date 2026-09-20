
// Mobile-only "pulse as it passes the middle of the screen" effect. On a
// phone there is no hover, so each card briefly borrows the desktop hover
// styling as it crosses the viewport centre.
//
// M2: this used to run getBoundingClientRect() over every card on every
// scroll frame. That is a layout read per element per frame, on the main
// thread, on the device least able to afford it. An IntersectionObserver
// whose root is collapsed to a zero-height line at the viewport centre
// (rootMargin -50% top and bottom) gets the browser to report the same
// crossings off the main thread. The only scroll handler left is the one
// that feeds the progress bar, which needs a continuous value.
class ScrollCardAnimations {
    // Selectors whose elements pulse as they cross the centre line.
    static TARGETS = ['.primary-card', '.primary-card2', '.home__social-link'];

    constructor() {
        this.animatedElements = new Map();
        this.observer = null;
        this.onScroll = null;
        this.onRendered = null;
        this.init();
    }

    get enabled() {
        return window.innerWidth <= 768
            // Q7 / WCAG 2.3.3: decorative, so respect the OS setting.
            && !(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    }

    init() {
        if (!this.enabled) return;
        this.setupObserver();
        this.observeTargets();
        this.trackScrollProgress();

        // Cards, skill icons and the footer tech row are built from the sheet
        // after this script runs, so anything rendered later has to be picked
        // up when the renderer announces itself.
        this.onRendered = () => this.observeTargets();
        document.addEventListener('content:rendered', this.onRendered);
    }

    setupObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    this.triggerElementAnimation(
                        el,
                        el.classList.contains('primary-card') ? 'primaryCard' : 'other'
                    );
                });
            },
            {
                // Collapse the root to a line across the middle of the screen:
                // an element "intersects" it exactly while it covers the centre.
                rootMargin: '-50% 0px -50% 0px',
                threshold: 0,
            }
        );
    }

    // Safe to call repeatedly: observing an element twice is a no-op.
    observeTargets() {
        if (!this.observer) return;
        document
            .querySelectorAll(ScrollCardAnimations.TARGETS.join(', '))
            .forEach((el) => this.observer.observe(el));
    }

    getElementId(element) {
        if (!element.dataset.animationId) {
            element.dataset.animationId = `element-${Math.random().toString(36).slice(2, 11)}`;
        }
        return element.dataset.animationId;
    }

    triggerElementAnimation(element, type) {
        const elementId = this.getElementId(element);
        const now = Date.now();

        // Scrolling back and forth over one card should not strobe it.
        const lastAnimated = this.animatedElements.get(elementId);
        if (lastAnimated && now - lastAnimated < 2000) return;

        const children = type === 'primaryCard' ? this.childTargets(element) : [];

        element.classList.add('scroll-animated');
        children.forEach((c) => c.classList.add('scroll-animated'));

        this.animatedElements.set(elementId, now);

        setTimeout(() => {
            element.classList.remove('scroll-animated');
            children.forEach((c) => c.classList.remove('scroll-animated'));
        }, 800);
    }

    childTargets(element) {
        return [
            ...element.querySelectorAll('.client-card, .social-card'),
            ...[element.querySelector('.about-btn'), element.querySelector('.star-icon')].filter(Boolean),
        ];
    }

    // body::before draws a progress bar from this custom property, so it needs
    // a real scroll position rather than a crossing event.
    trackScrollProgress() {
        let ticking = false;
        this.onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollable = document.body.scrollHeight - window.innerHeight;
                const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
                document.documentElement.style.setProperty('--scroll-progress', `${pct}%`);
                ticking = false;
            });
        };
        window.addEventListener('scroll', this.onScroll, { passive: true });
    }

    destroy() {
        this.observer?.disconnect();
        this.observer = null;
        if (this.onScroll) window.removeEventListener('scroll', this.onScroll);
        if (this.onRendered) document.removeEventListener('content:rendered', this.onRendered);
        this.onScroll = this.onRendered = null;
    }

    debugAnimation(selector, index = 0) {
        const el = document.querySelectorAll(selector)[index];
        if (el) this.triggerElementAnimation(el, 'primaryCard');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollCardAnimations();
});

// Crossing the mobile breakpoint tears the old instance down first. The
// previous version constructed a new one on every resize event and left the
// old scroll listener attached.
let resizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        window.scrollAnimations?.destroy();
        window.scrollAnimations = new ScrollCardAnimations();
    }, 200);
});
