const serviceItemHeroes = document.querySelectorAll('.service-item-hero');
const SCROLL_BASED = true; // Toggle between scroll-based (true) and view-based (false) animation

serviceItemHeroes.forEach(serviceItemHero => {
    serviceItemHero.addEventListener('click', () => {
        const service = serviceItemHero.closest('.service');
        service.dataset.open = service.dataset.open === 'true' ? 'false' : 'true';
        document.querySelectorAll('.service').forEach(otherService => {
            if (otherService !== service) {
                otherService.dataset.open = 'false';
            }
        });
    });
});

if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Wait for all content to load before initializing ScrollTrigger
    window.addEventListener('load', () => {
        // Refresh ScrollTrigger to recalculate positions
        ScrollTrigger.refresh();

        // Initialize the arrow animation
        const arrow = document.querySelector('.arrow-wrapper .arrow');
        if (!arrow) return;

        const customEase = 'CustomEase.create("custom", "0.104,0.204,0.492,1")'

        if (SCROLL_BASED) {
            // Scroll-based animation
            gsap.to(arrow, {
                x: '71.1%',
                scrollTrigger: {
                    trigger: '.block-services',
                    start: 'top 20%',
                    end: '40% 40%',
                    scrub: true,
                    markers: false,
                    // lets make the transition smoother
                    ease: customEase
                }
            });
        } else {
            // View-based animation
            gsap.to(arrow, {
                x: '71.1%',
                duration: 1,
                ease: customEase
            });
        }
    });
}