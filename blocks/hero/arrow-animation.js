document.addEventListener("DOMContentLoaded", () => {
    const arrow = document.querySelector(".hero__arrow svg");
    if (!arrow) return;

    let constrain = 500;
    let scrub = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let isAnimating = false;
    let isArrowVisible = true;
    let isStaticMode = window.innerWidth < 1161;
    let animationFrameId = null;
    let observer = null;

    function resetEffects() {
        gsap.set(arrow, { transform: "none" });
        target = { x: 0, y: 0 };
        scrub = { x: 0, y: 0 };
        isAnimating = false;

        // Cancel any ongoing animation frame
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
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
        if (!isArrowVisible || isStaticMode) {
            isAnimating = false;
            return;
        }

        gsap.to(scrub, {
            x: target.x,
            y: target.y,
            duration: 7,
            ease: "power3.out",
            onUpdate: () => {
                arrow.style.transform = `perspective(150px) rotateX(${scrub.x}deg) rotateY(${scrub.y}deg)`;
            }
        });

        // Store the animation frame ID so we can cancel it if needed
        animationFrameId = requestAnimationFrame(animate);
    }

    function checkVisibility(entries) {
        isArrowVisible = entries[0].isIntersecting;
        if (!isArrowVisible || isStaticMode) resetEffects();
    }

    // Setup or teardown the observer based on screen size
    function setupObserver() {
        // Disconnect any existing observer first
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        // Only create observer if not in static mode
        if (!isStaticMode) {
            // Use rootMargin to reduce the precision needed and improve performance
            observer = new IntersectionObserver(checkVisibility, {
                threshold: 0.1,
                rootMargin: '50px',
            });
            observer.observe(arrow);
        } else {
            // In static mode, just assume the arrow is visible
            isArrowVisible = true;
        }
    }

    // Initial setup
    setupObserver();

    // Debounce function to limit resize event handling
    function debounce(func, wait) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    // Debounced resize handler
    const handleResize = debounce(() => {
        const wasStaticMode = isStaticMode;
        isStaticMode = window.innerWidth < 1161;

        // If mode changed, reset effects and update observer
        if (wasStaticMode !== isStaticMode) {
            resetEffects();
            setupObserver();
        }
    }, 250); // Increased debounce time for better performance

    window.addEventListener("resize", handleResize);

    // Only attach mousemove handler if not in static mode
    if (!isStaticMode) {
        document.body.addEventListener("mousemove", function (e) {
            if (!isArrowVisible || isStaticMode) return;
            target = transforms(e.clientX, e.clientY, arrow);
            if (!isAnimating) {
                isAnimating = true;
                animate();
            }
        });
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (observer) {
            observer.disconnect();
        }
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
});