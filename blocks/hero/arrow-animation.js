document.addEventListener("DOMContentLoaded", () => {
    const arrow = document.querySelector(".hero__arrow svg");
    if (!arrow) return;

    let constrain = 500;
    let scrub = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let isAnimating = false;
    let isArrowVisible = true;
    let isStaticMode = window.innerWidth < 1161;

    function resetEffects() {
        gsap.set(arrow, { transform: "none" });
        target = { x: 0, y: 0 };
        scrub = { x: 0, y: 0 };
        isAnimating = false;
    }

    function transforms(x, y, el) {
        let box = el.getBoundingClientRect();
        let centerX = box.left + box.width / 2;
        let centerY = box.top + box.height / 2;
        let deltaX = x - centerX;
        let deltaY = y - centerY;
        return {
            x: (-deltaY / constrain) * 1.5,
            y: (deltaX / constrain) * 1.5,
        };
    }

    function animate() {
        if (!isArrowVisible || isStaticMode) return;
        gsap.to(scrub, {
            x: target.x,
            y: target.y,
            duration: 7,
            ease: "power3.out",
            onUpdate: () => {
                arrow.style.transform = `perspective(150px) rotateX(${scrub.x}deg) rotateY(${scrub.y}deg)`;
            }
        });
        requestAnimationFrame(animate);
    }

    function checkVisibility(entries) {
        isArrowVisible = entries[0].isIntersecting;
        if (!isArrowVisible || isStaticMode) resetEffects();
    }

    const observer = new IntersectionObserver(checkVisibility, { threshold: 0.1 });
    observer.observe(arrow);

    window.addEventListener("resize", () => {
        isStaticMode = window.innerWidth < 1161;
        if (isStaticMode) resetEffects();
    });

    document.body.onmousemove = function (e) {
        if (!isArrowVisible || isStaticMode) return;
        target = transforms(e.clientX, e.clientY, arrow);
        if (!isAnimating) {
            isAnimating = true;
            animate();
        }
    };
});