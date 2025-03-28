const arrow = document.querySelector('.hero__arrow');
const hero_wrapper = document.querySelector('.hero-wrapper');

let currentRotation = 0;
let targetRotation = 0;

const maxRotation = 10;
const lerpSpeed = 0.1;

// AANPASSING: de pijl staat standaard 45 graden naar rechts onder
const rotationOffset = 0; // graden

gsap.ticker.add(() => {
    currentRotation += (targetRotation - currentRotation) * lerpSpeed;
    gsap.set(arrow, {
        rotate: currentRotation
    });
});

document.addEventListener('mousemove', (e) => {
    const bounds = arrow.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const percentX = dx / (window.innerWidth / 2);
    const percentY = dy / (window.innerHeight / 2);

    const combinedInfluence = (percentX + percentY) / 2;
    const clamped = Math.max(-1, Math.min(1, combinedInfluence));

    // AANPASSING: voeg offset toe zodat de pijl-punt naar de muis kijkt
    targetRotation = clamped * maxRotation + rotationOffset;
});

let isAnimating = false;

hero_wrapper.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    const rotationDeg = currentRotation;
    const distance = 1000;

    // LET OP: hoek in radialen + offset van -45 graden
    const angle = (rotationDeg - 45) * (Math.PI / 180);

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    // Fase 1: schieten en verdwijnen
    gsap.to(arrow, {
        x: dx,
        y: dy,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            // Fase 2: wacht even voordat hij terugkomt
            gsap.delayedCall(0.5, () => {
                // Instantly terugzetten buiten beeld en onzichtbaar
                gsap.set(arrow, {
                    x: 0,
                    y: 0,
                    scale: 0.3,
                    opacity: 0
                });

                // Fase 3: spawn-animatie
                gsap.to(arrow, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                });
                
                // wait like 200ms before setting isAnimating to false
                setTimeout(() => {
                    isAnimating = false;
                }, 200);
            });
        }
    });
});

