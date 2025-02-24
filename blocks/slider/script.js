// import { gsap } from "gsap";
// import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

class Slider {
    constructor(element) {
        this.slider = element;
        this.wrapper = element.querySelector('.slider-wrapper');
        this.slides = element.querySelectorAll('.slide');
        this.prevBtn = element.querySelector('.slider-nav.prev');
        this.nextBtn = element.querySelector('.slider-nav.next');
        
        this.pressed = false;
        this.slideWidth = 0;
        this.wrapperWidth = 0;
        this.maxScroll = 0;
        
        this.init();
    }
    
    init() {
        // Calculate dimensions
        this.calculateDimensions();
        window.addEventListener('resize', () => this.calculateDimensions());
        
        // Initialize GSAP Draggable
        this.draggable = Draggable.create(this.wrapper, {
            type: "x",
            inertia: true,
            bounds: {
                minX: -this.maxScroll,
                maxX: 0
            },
            edgeResistance: 0.85,
            dragResistance: 0.2,
            onDragStart: () => {
                gsap.killTweensOf(this.wrapper);
                this.pressed = true;
            },
            onDrag: this.checkBounds.bind(this),
            onThrowUpdate: this.checkBounds.bind(this)
        })[0];
        
        // Add button listeners
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.navigate('prev'));
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.navigate('next'));
    }
    
    calculateDimensions() {
        if (this.slides.length === 0) return;
        
        // Get dimensions
        this.slideWidth = this.slides[0].offsetWidth;
        this.wrapperWidth = this.wrapper.scrollWidth;
        this.maxScroll = this.wrapperWidth - this.slider.offsetWidth;
        
        // Update draggable bounds
        if (this.draggable) {
            this.draggable.applyBounds({
                minX: -this.maxScroll,
                maxX: 0
            });
        }
    }
    
    checkBounds() {
        const x = this.draggable.x;
        
        if (x > 0) {
            gsap.to(this.wrapper, {
                x: 0,
                duration: 0.3,
                ease: "power3.out"
            });
        } else if (x < -this.maxScroll) {
            gsap.to(this.wrapper, {
                x: -this.maxScroll,
                duration: 0.3,
                ease: "power3.out"
            });
        }
    }
    
    navigate(direction) {
        const slideWidth = this.slideWidth + 23; // Adding the gap
        const current = Math.round(Math.abs(gsap.getProperty(this.wrapper, "x")) / slideWidth);
        
        let target;
        if (direction === 'next') {
            target = (current + 1) * slideWidth * -1;
        } else {
            target = (current - 1) * slideWidth * -1;
        }
        
        gsap.to(this.wrapper, {
            x: gsap.utils.clamp(-this.maxScroll, 0, target),
            duration: 0.5,
            ease: "power2.out"
        });
    }
}

// Initialize all sliders on the page
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.block-slider');
    sliders.forEach(slider => new Slider(slider));
});
