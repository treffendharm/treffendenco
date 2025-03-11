/**
 * LogoAnimation Class
 * Handles the animation of the Treffend logo with motion blur effect
 */
class LogoAnimation {
    /**
     * Initialize the logo animation
     */
    constructor() {
        // DOM elements
        this.logo_wrapper = document.querySelector('.nav-logo-wrapper');
        this.logo = this.logo_wrapper?.querySelector('svg');
        this.encElement = this.logo_wrapper?.querySelector('.enc');
        this.body = document.body;
        
        // State
        this.active = false;
        this.headerFixed = false;
        this.clones = [];
        this.lastScrollY = 0;
        
        // Scroll thresholds with hysteresis to prevent jittering
        this.activateThreshold = 150; // Point at which logo animates
        this.deactivateThreshold = 50; // Point at which logo returns to normal
        this.headerFixThreshold = 200; // Point at which header becomes fixed
        this.headerUnfixThreshold = 100; // Point at which header returns to normal
        
        // Motion blur configuration
        this.numClones = 10;
        this.transitionDelayFactor = 0.0066; // seconds between each clone's animation
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the animation setup
     */
    init() {
        if (!this.logo_wrapper || !this.encElement) {
            console.error('Required DOM elements not found');
            return;
        }
        
        this.setupMotionBlur();
        this.setupTransitionListener();
    }

    /**
     * Create clones of the enc element for motion blur effect
     */
    setupMotionBlur() {
        const original = this.encElement;
        if (!original) return;

        // Clean up any existing clones
        this.cleanupClones();
        
        // Create new clones
        for (let i = 0; i < this.numClones; i++) {
            const clone = original.cloneNode(true);
            
            // Configure clone properties
            clone.classList.add('enc-clone');
            clone.style.position = 'absolute';
            clone.style.transitionDelay = `${i * this.transitionDelayFactor}s`;
            clone.style.pointerEvents = 'none';
            
            // Add to DOM and track
            original.parentNode.insertBefore(clone, original);
            this.clones.push(clone);
        }
        
        // Ensure original is on top
        original.style.position = 'relative';
        original.style.zIndex = '1';
    }
    
    /**
     * Remove all existing clones from the DOM
     */
    cleanupClones() {
        this.clones.forEach(clone => clone.remove());
        this.clones = [];
    }

    /**
     * Set up listener to detect when transition ends
     */
    setupTransitionListener() {
        this.encElement.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
    }
    
    /**
     * Handle the end of a transition
     * @param {TransitionEvent} e - The transition event
     */
    handleTransitionEnd(e) {
        // Only remove transitioning class when transform property finishes
        if (e.propertyName === 'transform') {
            this.logo_wrapper.classList.remove('transitioning');
        }
    }

    /**
     * Toggle the animation state and body class
     */
    toggleAnimation() {
        if (!this.logo_wrapper) return;
        
        // Add transitioning class to show blur effect
        this.logo_wrapper.classList.add('transitioning');
        
        // Toggle active state for logo
        this.active = !this.active;
        this.logo_wrapper.classList.toggle('active', this.active);
    }

    /**
     * Update header state
     * @param {boolean} fixed - Whether the header should be fixed
     */
    updateHeaderState(fixed) {
        if (this.headerFixed !== fixed) {
            this.headerFixed = fixed;
            this.body.classList.toggle('fixed__header', fixed);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const logoAnimation = new LogoAnimation();

    // Handle initial page load state
    const initialScroll = window.scrollY;
    if (initialScroll > logoAnimation.activateThreshold) {
        logoAnimation.toggleAnimation();
    }
    if (initialScroll > logoAnimation.headerFixThreshold) {
        logoAnimation.updateHeaderState(true);
    }

    // Set up scroll event to toggle animation based on scroll threshold
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Check logo animation thresholds
        if (currentScrollY > logoAnimation.activateThreshold && !logoAnimation.active) {
            // Scrolled past activation threshold and not active - activate
            logoAnimation.toggleAnimation();
        } else if (currentScrollY <= logoAnimation.deactivateThreshold && logoAnimation.active) {
            // Scrolled above deactivation threshold and active - deactivate
            logoAnimation.toggleAnimation();
        }

        // Check header fix thresholds
        if (currentScrollY > logoAnimation.headerFixThreshold && !logoAnimation.headerFixed) {
            // Scrolled past header fix threshold - fix header
            logoAnimation.updateHeaderState(true);
        } else if (currentScrollY <= logoAnimation.headerUnfixThreshold && logoAnimation.headerFixed) {
            // Scrolled above header unfix threshold - unfix header
            logoAnimation.updateHeaderState(false);
        }
        
        // Update last scroll position
        logoAnimation.lastScrollY = currentScrollY;
    });
});
