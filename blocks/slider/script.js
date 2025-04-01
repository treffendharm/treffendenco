// Minimal slider with fluid, elastic dragging using Swiper.js
// No imports needed as Swiper is globally available

// Slider block using the global SliderUtils object
// No imports needed as SliderUtils is globally available

document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure all DOM elements are fully loaded and rendered
    setTimeout(() => {
        initializeSliderBlocks();
    }, 100);
});

function initializeSliderBlocks() {
    // Check if SliderUtils is available and find all slider blocks
    if (!window.SliderUtils) return;
    
    const sliderBlocks = document.querySelectorAll('.block-slider');
    if (!sliderBlocks.length) return;

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
        try {
            // Find the swiper container
            const swiperContainer = sliderBlock.querySelector('.swiper');
            if (!swiperContainer) return null;

            // Find navigation buttons
            const prevButton = sliderBlock.querySelector('.slider-nav.prev');
            const nextButton = sliderBlock.querySelector('.slider-nav.next');

            // Initialize Swiper using our utility function
            const swiper = SliderUtils.createSlider(swiperContainer, {
            });

            if (!swiper) return null;

            // Add resize handler to ensure proper slide visibility
            const resizeHandler = () => {
                if (swiper && typeof swiper.update === 'function') {
                    swiper.update();
                }
            };
            
            window.addEventListener('resize', resizeHandler);

            // Return the swiper instance in case we need it later
            return swiper;
        } catch (error) {
            return null;
        }
    }
}
