// Minimal slider with fluid, elastic dragging using Swiper.js
// No imports needed as Swiper is globally available

document.addEventListener('DOMContentLoaded', () => {
    // Find all slider blocks
    const sliderBlocks = document.querySelectorAll('.block-slider');

    // Set up intersection observer to initialize sliders when they come into view
    const sliderObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stop observing once initialized
                observer.unobserve(entry.target);

                // Initialize the slider
                initializeSlider(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px 300px 0px' // Load slider when it's 300px from entering the viewport
    });

    // Observe each slider block
    sliderBlocks.forEach(slider => {
        sliderObserver.observe(slider);
    });

    // Function to initialize a single slider
    function initializeSlider(sliderBlock) {
        // Find the swiper container
        const swiperContainer = sliderBlock.querySelector('.swiper');

        if (!swiperContainer) return;

        // Find navigation buttons
        const prevButton = sliderBlock.querySelector('.slider-nav.prev');
        const nextButton = sliderBlock.querySelector('.slider-nav.next');

        // Initialize Swiper
        const swiper = new Swiper(swiperContainer, {
            slidesPerView: 'auto',
            spaceBetween: 24,
            grabCursor: true,

            // Enable free mode for fluid dragging with momentum
            freeMode: {
                enabled: true,
                momentum: true,
                momentumRatio: 0.8,
                momentumBounce: true,
                momentumBounceRatio: 0.8,
                minimumVelocity: 0.1
            },

            // Resistance when reaching the end
            resistance: true,
            resistanceRatio: 0.5,

            // Navigation
            navigation: {
                nextEl: nextButton,
                prevEl: prevButton
            },

            // Add extra space at the end to ensure last slide is fully visible
            slidesOffsetAfter: 0,

            // Update swiper when window resizes or slides change
            observer: true,
            observeParents: true,

            // Ensure we can scroll to the end
            watchSlidesProgress: true
        });

        // Add resize handler to ensure proper slide visibility
        window.addEventListener('resize', () => {
            swiper.update();
        });

        // Return the swiper instance in case we need it later
        return swiper;
    }
});
