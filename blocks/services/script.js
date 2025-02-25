
const serviceItemHeroes = document.querySelectorAll('.service-item-hero');

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

    window.addEventListener('load', () => {
        const arrow = document.querySelector('.arrow-wrapper .arrow');
        if (!arrow) return;

        const arrowWrapper = document.querySelector('.block-services .arrow-wrapper');

        gsap.to(arrow,
            {
                x: arrowWrapper.clientWidth - arrow.clientWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.block-services',
                    start: 'top 20%',
                    end: '40% 40%',
                    scrub: 1.5,
                }
            }
        );
    });
}
