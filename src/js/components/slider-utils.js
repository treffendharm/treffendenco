/**
 * Slider utilities for creating and managing Swiper sliders
 * Uses the globally available Swiper object
 */

/**
 * Creates a Swiper slider with configurable options
 * 
 * @param {HTMLElement} container - The container element for the slider
 * @param {Object} options - Configuration options for the slider
 * @returns {Swiper} The initialized Swiper instance
 */
function createSlider(container, options = {}) {
    // Default options
    const defaultOptions = {
        slidesPerView: 'auto',
        spaceBetween: 24,
        grabCursor: true,
        freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 0.8,
            momentumBounce: true,
            momentumBounceRatio: 0.8,
            minimumVelocity: 0.1
        },
        resistance: true,
        resistanceRatio: 0.5,
        slidesOffsetAfter: 0,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true
    };

    // Merge default options with provided options
    const swiperOptions = { ...defaultOptions, ...options };

    // Make sure container is valid before initializing
    if (!container || !(container instanceof Element)) {
        return null;
    }

    // Initialize and return Swiper
    try {
        const swiper = new Swiper(container, swiperOptions);
        refreshLoadAnimations();
        return swiper;
    } catch (error) {
        return null;
    }
}

/**
 * Creates a responsive slider that only appears on certain screen sizes
 * 
 * @param {HTMLElement} container - The container element for the slider
 * @param {string} mediaQuery - The media query string (e.g., '(max-width: 768px)')
 * @param {Object} options - Configuration options for the slider
 * @param {Function} beforeInit - Function to run before initializing the slider (optional)
 * @param {Function} afterDestroy - Function to run after destroying the slider (optional)
 * @returns {Object} Object with methods to control the slider
 */
function createResponsiveSlider(container, mediaQuery, options = {}, beforeInit = null, afterDestroy = null) {
    // Validate container
    if (!container || !(container instanceof Element)) {
        return {
            init: () => null,
            destroy: () => {},
            getSwiper: () => null,
            cleanup: () => {}
        };
    }

    // Create media query
    const mq = window.matchMedia(mediaQuery);
    let swiper = null;
    
    // Function to initialize the slider
    function initSlider() {
        try {
            // Run beforeInit function if provided
            if (typeof beforeInit === 'function') {
                beforeInit(container);
            }
            
            // Find the swiper container (it should be created by beforeInit)
            const swiperContainer = container.querySelector('.swiper');
            
            if (!swiperContainer) {
                return null;
            }
            
            // Create the slider
            swiper = createSlider(swiperContainer, options);
            return swiper;
        } catch (error) {
            return null;
        }
    }
    
    // Function to destroy the slider
    function destroySlider() {
        if (swiper) {
            try {
                swiper.destroy(true, true);
                swiper = null;
                
                // Run afterDestroy function if provided
                if (typeof afterDestroy === 'function') {
                    afterDestroy(container);
                }
                
                refreshLoadAnimations();
            } catch (error) {
                // Silent error handling
            }
        }
    }
    
    // Function to handle media query changes
    function handleMediaChange(e) {
        if (e.matches) {
            // Media query matches - initialize slider if not already initialized
            if (!swiper) {
                initSlider();
            }
        } else {
            // Media query doesn't match - destroy slider if initialized
            destroySlider();
        }
    }
    
    // Initial check
    handleMediaChange(mq);
    
    // Add listener for screen size changes
    mq.addEventListener('change', handleMediaChange);
    
    // Return methods to control the slider
    return {
        init: initSlider,
        destroy: destroySlider,
        getSwiper: () => swiper,
        cleanup: () => {
            destroySlider();
            mq.removeEventListener('change', handleMediaChange);
        }
    };
}

/**
 * Prepares a container for use as a slider by adding necessary Swiper structure
 * 
 * @param {HTMLElement} container - The container element to prepare
 * @param {Object} options - Configuration options
 * @returns {HTMLElement} The prepared Swiper container
 */
function prepareSliderContainer(container, options = {}) {
    try {
        // Validate container
        if (!container || !(container instanceof Element)) {
            return null;
        }

        const defaults = {
            itemSelector: '.slide, .image', // Selector for items to convert to slides
            wrapperClass: 'swiper-wrapper',
            slideClass: 'swiper-slide',
            containerClass: 'swiper',
            addSpacerElement: true
        };
        
        const config = { ...defaults, ...options };
        
        // Add slider-active class to container
        container.classList.add('slider-active');
        
        // Create swiper container
        const swiperContainer = document.createElement('div');
        swiperContainer.className = config.containerClass;
        
        // Create swiper wrapper
        const swiperWrapper = document.createElement('div');
        swiperWrapper.className = config.wrapperClass;
        
        // Get all items and move them to the wrapper as slides
        const items = container.querySelectorAll(config.itemSelector);
        
        // Check if we have items to convert to slides
        if (items.length === 0) {
            return null;
        }
        
        // Clone items and add them to the wrapper, preserving all classes and attributes
        items.forEach(item => {
            // Create a deep clone of the item
            const clone = item.cloneNode(true);
            
            // Add the slide class
            clone.classList.add(config.slideClass);
            
            // Preserve loading animation classes on images
            const originalImg = item.querySelector('img');
            const cloneImg = clone.querySelector('img');
            
            if (originalImg && cloneImg) {
                // Ensure the load-in class is preserved
                if (originalImg.classList.contains('load-in')) {
                    cloneImg.classList.add('load-in');
                }
                
                // Copy all classes from original image to clone
                originalImg.classList.forEach(className => {
                    cloneImg.classList.add(className);
                });
                
                // Copy all data attributes
                Array.from(originalImg.attributes).forEach(attr => {
                    if (attr.name.startsWith('data-')) {
                        cloneImg.setAttribute(attr.name, attr.value);
                    }
                });
            }
            
            // Add to wrapper
            swiperWrapper.appendChild(clone);
        });
        
        // Add wrapper to container
        swiperContainer.appendChild(swiperWrapper);
        
        // Add spacer element if needed
        if (config.addSpacerElement) {
            const spacer = document.createElement('div');
            spacer.className = 'swiper-slide-spacer';
            swiperContainer.appendChild(spacer);
        }
        
        // Clear the container before adding the swiper structure
        Array.from(items).forEach(item => item.remove());
        
        // Add the swiper container to the original container
        container.appendChild(swiperContainer);
        
        // Force a reflow to ensure the DOM is updated
        container.offsetHeight;
        
        return swiperContainer;
    } catch (error) {
        return null;
    }
}

/**
 * Restores a container to its original state by removing Swiper structure
 * 
 * @param {HTMLElement} container - The container element to restore
 * @param {Object} options - Configuration options
 */
function restoreContainer(container, options = {}) {
    try {
        // Validate container
        if (!container || !(container instanceof Element)) {
            return;
        }

        const defaults = {
            slideClass: 'swiper-slide',
            containerClass: 'swiper'
        };
        
        const config = { ...defaults, ...options };
        
        // Get all slides
        const slides = container.querySelectorAll(`.${config.slideClass}`);
        
        // Get the swiper container
        const swiperContainer = container.querySelector(`.${config.containerClass}`);
        
        // Remove swiper container if it exists
        if (swiperContainer) {
            // Move all slides back to the original container
            slides.forEach(slide => {
                const clone = slide.cloneNode(true);
                
                // Remove the slide class
                clone.classList.remove(config.slideClass);
                
                // Preserve loading animation classes on images
                const slideImg = slide.querySelector('img');
                const cloneImg = clone.querySelector('img');
                
                if (slideImg && cloneImg) {
                    // Ensure the load-in class is preserved
                    if (slideImg.classList.contains('load-in')) {
                        cloneImg.classList.add('load-in');
                    }
                }
                
                container.appendChild(clone);
            });
            
            // Remove the swiper container
            swiperContainer.remove();
        }
        
        // Remove slider-active class
        container.classList.remove('slider-active');
    } catch (error) {
        // Silent error handling
    }
}

/**
 * Refreshes the loading animations by re-initializing them
 */
function refreshLoadAnimations() {
    if (typeof window.loadInImages === 'function') {
        setTimeout(() => {
            window.loadInImages();
        }, 100);
    } else if (typeof loadInImages === 'function') {
        setTimeout(() => {
            loadInImages();
        }, 100);
    }
}

// Make functions available globally
window.SliderUtils = {
    createSlider,
    createResponsiveSlider,
    prepareSliderContainer,
    restoreContainer,
    refreshLoadAnimations
}; 