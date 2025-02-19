// Configuration object
const SLIDER_CONFIG = {
    autoPlay: true,    // Toggle auto-advance functionality
    duration: 5,       // Duration in seconds for each slide
    ease: 'none',      // Progress bar easing
    animationDuration: 0.8, // Longer, smoother duration
    stagger: 0.08,      // Slightly increased stagger
    customEase: 'cubic-bezier(0.104,0.204,0.492,1)' // Changed to CSS cubic-bezier
};

function initQuoteSlider() {
    const sliders = document.querySelectorAll('.block-quote:not(.single)');

    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.quote-image');
        const authors = slider.querySelectorAll('.quote-author');
        const quotes = slider.querySelectorAll('.quote-text');
        const progressBar = slider.querySelector('.progress-bar');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');

        if (!images.length || !authors.length || !quotes.length) return;

        let current = 0;
        const total = quotes.length;
        let isAnimating = false;
        let progressTween;

        // Create timeline for transitions
        const createTransition = (next, direction) => {
            if (isAnimating) return;
            isAnimating = true;

            if (progressTween) progressTween.kill();

            const tl = gsap.timeline({
                onComplete: () => {
                    isAnimating = false;
                    current = next;
                    if (SLIDER_CONFIG.autoPlay) {
                        startProgressAnimation();
                    }
                }
            });

            const yOffset = direction === 'next' ? 100 : -100;
            const duration = SLIDER_CONFIG.animationDuration;
            const stagger = SLIDER_CONFIG.stagger;

            // Separate animations for images and text elements
            const textElements = [quotes[next], authors[next]];
            const nextImage = images[next];

            // Set initial states
            gsap.set(textElements, {
                opacity: 0,
                y: yOffset,
                immediateRender: true
            });
            gsap.set(nextImage, {
                opacity: 0,
                y: yOffset * 0.5, // Reduced movement for image
                immediateRender: true
            });

            // Animate out current elements
            tl.to([quotes[current], authors[current]], {
                opacity: 0,
                y: -yOffset,
                duration: duration * 0.8,
                stagger: {
                    each: stagger,
                    from: "start"
                },
                ease: SLIDER_CONFIG.customEase
            })
            .to(images[current], {
                opacity: 0,
                y: -yOffset * 0.5, // Reduced movement for image
                duration: duration * 0.9, // Longer duration for smoother fade
                ease: SLIDER_CONFIG.customEase
            }, "<"); // Start at same time as text

            // Animate in next elements
            tl.to(textElements, {
                opacity: 1,
                y: 0,
                duration: duration * 0.7,
                stagger: {
                    each: stagger,
                    from: "start"
                },
                ease: SLIDER_CONFIG.customEase
            }, `<${duration * 0.3}`)
            .to(nextImage, {
                opacity: 1,
                y: 0,
                duration: duration * 0.9, // Longer duration for smoother fade
                ease: SLIDER_CONFIG.customEase
            }, "<"); // Start with text elements

            // Update active classes mid-transition
            tl.call(() => {
                [current, next].forEach(index => {
                    const isNext = index === next;
                    images[index].classList.toggle('active', isNext);
                    authors[index].classList.toggle('active', isNext);
                    quotes[index].classList.toggle('active', isNext);
                });
            }, null, duration * 0.5);

            // Cleanup after transition
            tl.set([quotes[current], authors[current], images[current]], {
                clearProps: "all"
            });
        };

        // Progress bar animation
        const startProgressAnimation = () => {
            if (!SLIDER_CONFIG.autoPlay) return;
            
            if (progressTween) progressTween.kill();

            // Create a timeline for progress bar
            const progressTl = gsap.timeline({
                onComplete: () => {
                    const next = current === total - 1 ? 0 : current + 1;
                    createTransition(next, 'next');
                }
            });

            // First fade in the progress bar while starting the scale
            progressTl.fromTo(progressBar, 
                {
                    opacity: 0,
                    scaleX: 0
                },
                {
                    opacity: 1,
                    scaleX: 0,
                    duration: 0.3,
                    ease: SLIDER_CONFIG.customEase
                }
            )
            // Then animate the progress
            .to(progressBar, {
                scaleX: 1,
                duration: SLIDER_CONFIG.duration,
                ease: SLIDER_CONFIG.ease
            })
            // Finally fade out
            .to(progressBar, {
                opacity: 0,
                duration: 0.3,
                ease: SLIDER_CONFIG.customEase
            });

            progressTween = progressTl;
        };

        // Initialize progress bar
        gsap.set(progressBar, {
            scaleX: 0,
            opacity: 0,
            transformOrigin: 'left center'
        });

        // Event listeners with debounce for smoother interaction
        let clickTimeout;
        const handleClick = (direction) => {
            if (clickTimeout) return;
            
            // Kill current progress animation when manually navigating
            if (progressTween) {
                progressTween.kill();
            }

            // Fade out progress bar before transition
            gsap.to(progressBar, {
                opacity: 0,
                duration: 0.3,
                ease: SLIDER_CONFIG.customEase,
                onComplete: () => {
                    clickTimeout = setTimeout(() => {
                        clickTimeout = null;
                    }, SLIDER_CONFIG.animationDuration * 1000);

                    const next = direction === 'next' 
                        ? (current === total - 1 ? 0 : current + 1)
                        : (current === 0 ? total - 1 : current - 1);
                    
                    createTransition(next, direction);
                }
            });
        };

        prevBtn?.addEventListener('click', () => handleClick('prev'));
        nextBtn?.addEventListener('click', () => handleClick('next'));

        // Pause/Resume functions
        const pauseSlider = () => {
            if (progressTween) progressTween.pause();
        };

        const resumeSlider = () => {
            if (SLIDER_CONFIG.autoPlay && progressTween) {
                progressTween.play();
            }
        };

        // Pause on hover
        slider.addEventListener('mouseenter', pauseSlider);
        slider.addEventListener('mouseleave', resumeSlider);

        // Start the initial progress animation if autoPlay is enabled
        if (SLIDER_CONFIG.autoPlay) {
            startProgressAnimation();
        }
    });
}

// Initialize when GSAP is available
if (typeof gsap !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initQuoteSlider);
} 