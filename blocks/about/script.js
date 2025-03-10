// About block slider functionality for small screens
// Uses the global SliderUtils object

document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure all DOM elements are fully loaded and rendered
    setTimeout(() => {
        initializeAboutBlockSliders();
    }, 100);
});

function initializeAboutBlockSliders() {
    // Find all about blocks
    const aboutBlocks = document.querySelectorAll('.block-about');
    
    if (!aboutBlocks.length || !window.SliderUtils) {
        return;
    }
    
    // Process each about block
    aboutBlocks.forEach(block => {
        const imageWrapper = block.querySelector('.image-wrapper');
        if (!imageWrapper) return;
        
        // Check if there are images to convert to slides
        const images = imageWrapper.querySelectorAll('.image');
        if (!images.length) return;
        
        // Create a responsive slider that only appears on small screens
        SliderUtils.createResponsiveSlider(
            imageWrapper,                // Container element
            '(max-width: 1160px)',        // Media query for small screens
            {},                          // Use default options
            // Before initialization function
            (container) => {
                return SliderUtils.prepareSliderContainer(container, {
                    itemSelector: '.image',  // Select images to convert to slides
                });
            },
            // After destroy function
            (container) => {
                SliderUtils.restoreContainer(container);
            }
        );
    });
} 