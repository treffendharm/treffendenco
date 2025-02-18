import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

// Register the plugin
gsap.registerPlugin(CustomEase);

document.addEventListener("DOMContentLoaded", () => {
    // Enable/disable logo animation
    const ENABLE_LOGO_ANIMATION = false;

    const threshold = 100; // Adjust for when to add the fixed__header class
    const scrollThreshold = 10; // Adjust for how sensitive the scroll hide behavior should be

    let lastScrollY = window.scrollY;
    let isFullLogo = true; // Track logo state
    let isAnimating = false; // Prevent animation overlap

    // Skip all animation setup if disabled
    if (!ENABLE_LOGO_ANIMATION) {
        const handleBasicScroll = () => {
            const currentScrollY = window.scrollY;

            if (window.scrollY > threshold) {
                document.body.classList.add("fixed__header");
            } else {
                document.body.classList.remove("fixed__header");
            }

            if (currentScrollY > lastScrollY + scrollThreshold) {
                document.body.classList.add("hidden__header");
            } else if (currentScrollY < lastScrollY - scrollThreshold || currentScrollY <= threshold) {
                document.body.classList.remove("hidden__header");
            }

            lastScrollY = currentScrollY;
        };

        handleBasicScroll();
        window.addEventListener("scroll", handleBasicScroll);
        return;
    }

    // Get the custom bezier from CSS variables
    const customBezier = getComputedStyle(document.documentElement)
        .getPropertyValue('--cubic')
        .trim()
        .replace('cubic-bezier(', '')
        .replace(')', '')
        .split(',')
        .map(Number);

    // Animation configuration
    const animationConfig = {
        duration: 0.3,
        stagger: 0.28,
        slideDistance: 290,
        encDistance: 251,
        ease: "cubic-bezier(0.6, 0.03, 0.28, 0.98)" // Your custom cubic bezier
    };

    // Letter configuration
    const letters = [
        { class: 'r' },
        { class: 'e1' },
        { class: 'f1' },
        { class: 'f2' },
        { class: 'e2' },
        { class: 'n' },
        { class: 'd' },
        { class: 'enc', special: true },
        { class: 'o' }
    ];

    // Initialize GSAP states
    gsap.set(letters.map(l => `.${l.class}`), { x: 0, opacity: 1 });

    const animateLogo = () => {
        if (isAnimating) return; // Prevent multiple animations
        isAnimating = true;

        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
            }
        });
        
        const { duration, stagger, slideDistance, encDistance, ease } = animationConfig;
        const sequence = isFullLogo ? letters : [...letters].reverse();

        // Animate each letter
        sequence.forEach((letter, index) => {
            const target = `.${letter.class}`;
            const config = {
                duration,
                x: isFullLogo ?
                    (letter.special ? -encDistance : -slideDistance) :
                    0,
                ease,
                ...(!letter.special && { opacity: isFullLogo ? 0 : 1 })
            };

            tl.to(target, config, index === 0 ? 0 : `-=${stagger}`);
        });

        isFullLogo = !isFullLogo;
    };

    // Debounce scroll handler
    let scrollTimeout;
    const handleScroll = () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;

            // Handle header visibility
            if (window.scrollY > threshold) {
                document.body.classList.add("fixed__header");
                if (isFullLogo) {
                    animateLogo();
                }
            } else {
                document.body.classList.remove("fixed__header");
                if (!isFullLogo) {
                    animateLogo();
                }
            }

            // Handle header hiding on scroll
            if (currentScrollY > lastScrollY + scrollThreshold) {
                document.body.classList.add("hidden__header");
            } else if (currentScrollY < lastScrollY - scrollThreshold || currentScrollY <= threshold) {
                document.body.classList.remove("hidden__header");
            }

            lastScrollY = currentScrollY;
        });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
});
