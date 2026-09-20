// ===== PRELOADER & SLIDE REVEAL ANIMATION =====
//
// Q18: this sequence used to hold .main-content hidden for ~1.9s after
// window load (500ms settle + 600 + 800), on top of a 2.5s progress fill,
// which put the whole preloader inside the LCP measurement. The phases are
// kept -- they are the site's identity -- but the budget is now ~340ms to
// content reveal. CSS durations in style.css were shortened to match; if
// you change one, change the other or the classes will outlive their
// transitions.
const TIMING = {
    progress: 700,   // cosmetic fill; the real trigger is window load
    settle: 60,      // hold at 100% before the reveal starts
    slideUp: 120,
    slideAway: 160,
    cleanup: 400,    // after this the elements are display:none
};

// Q7 / WCAG 2.3.3: if the visitor has asked for reduced motion, skip the
// choreography and show the page. Checked once -- a mid-load change of the
// OS setting is not worth the complexity.
const PREFERS_REDUCED_MOTION =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

class LoaderAnimation {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.slidePanel = document.querySelector('.slide-reveal-panel');
        this.mainContent = document.querySelector('.main-content');
        this.progressBar = document.querySelector('.loader-progress');
        this.percentage = document.querySelector('.loader-percentage');
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.animationId = null;

        this.init();
    }

    init() {
        if (PREFERS_REDUCED_MOTION) {
            this.revealImmediately();
            return;
        }

        this.startLoading();

        if (document.readyState === 'complete') {
            this.completeLoading();
        } else {
            window.addEventListener('load', () => this.completeLoading());
        }
    }

    // No transitions, no timers: the content is simply there.
    revealImmediately() {
        this.mainContent?.classList.add('fade-in');
        if (this.preloader) this.preloader.style.display = 'none';
        if (this.slidePanel) this.slidePanel.style.display = 'none';
    }

    startLoading() {
        this.simulateProgress();
    }

    simulateProgress() {
        const startTime = Date.now();

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / TIMING.progress) * 100, 95);

            this.updateProgressBar(progress);

            if (progress < 95) {
                this.animationId = requestAnimationFrame(updateProgress);
            }
        };

        this.animationId = requestAnimationFrame(updateProgress);
    }

    updateProgressBar(progress) {
        this.targetProgress = progress;
        this.animateProgressBar();
    }

    animateProgressBar() {
        const diff = this.targetProgress - this.currentProgress;
        this.currentProgress += diff * 0.1;

        if (this.progressBar) this.progressBar.style.width = `${this.currentProgress}%`;
        if (this.percentage) this.percentage.textContent = `${Math.round(this.currentProgress)}%`;

        if (Math.abs(diff) > 0.1) {
            requestAnimationFrame(() => this.animateProgressBar());
        }
    }

    completeLoading() {
        this.updateProgressBar(100);
        setTimeout(() => this.startRevealAnimation(), TIMING.settle);
    }

    startRevealAnimation() {
        // Phase 1: fade out the preloader
        this.preloader.classList.add('fade-out');

        // Phase 2: bring the slide panel up over it
        setTimeout(() => {
            this.slidePanel.classList.add('slide-up');

            // Phase 3: sweep the panel away and reveal the content
            setTimeout(() => {
                this.slidePanel.classList.add('slide-away');
                this.mainContent.classList.add('fade-in');

                // Phase 4: take both out of the layer tree
                setTimeout(() => {
                    this.preloader.style.display = 'none';
                    this.slidePanel.style.display = 'none';
                }, TIMING.cleanup);
            }, TIMING.slideAway);
        }, TIMING.slideUp);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoaderAnimation();
});
