// ===== PRELOADER & SLIDE REVEAL ANIMATION =====
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
        // Start the loading animation
        this.startLoading();

        // Check if page is fully loaded
        if (document.readyState === 'complete') {
            this.completeLoading();
        } else {
            window.addEventListener('load', () => this.completeLoading());
        }
    }

    startLoading() {
        // Simulate loading progress
        this.simulateProgress();
    }

    simulateProgress() {
        const duration = 2500; // 2.5 seconds
        const startTime = Date.now();

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 95); // Stop at 95%

            this.updateProgressBar(progress);

            if (progress < 95) {
                this.animationId = requestAnimationFrame(updateProgress);
            }
        };

        this.animationId = requestAnimationFrame(updateProgress);
    }

    updateProgressBar(progress) {
        // Smooth progress animation
        this.targetProgress = progress;
        this.animateProgressBar();
    }

    animateProgressBar() {
        const diff = this.targetProgress - this.currentProgress;
        this.currentProgress += diff * 0.1;

        this.progressBar.style.width = `${this.currentProgress}%`;
        this.percentage.textContent = `${Math.round(this.currentProgress)}%`;

        if (Math.abs(diff) > 0.1) {
            requestAnimationFrame(() => this.animateProgressBar());
        }
    }

    completeLoading() {
        // Complete the progress to 100%
        this.updateProgressBar(100);

        // Wait a moment, then start the reveal animation
        setTimeout(() => {
            this.startRevealAnimation();
        }, 500);
    }

    startRevealAnimation() {
        // Phase 1: Fade out preloader
        this.preloader.classList.add('fade-out');

        // Phase 2: Show slide panel after preloader fades
        setTimeout(() => {
            this.slidePanel.classList.add('slide-up');

            // Phase 3: Slide panel up and reveal content
            setTimeout(() => {
                this.slidePanel.classList.add('slide-away');
                this.mainContent.classList.add('fade-in');

                // Phase 4: Remove elements after animation
                setTimeout(() => {
                    this.preloader.style.display = 'none';
                    this.slidePanel.style.display = 'none';
                }, 1200);
            }, 800);
        }, 600);
    }
}

// Initialize the loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LoaderAnimation();
});
