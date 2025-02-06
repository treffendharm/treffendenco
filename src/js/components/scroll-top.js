document.addEventListener("DOMContentLoaded", () => {
    const threshold = 100; // Adjust for when to add the fixed__header class
    const scrollThreshold = 10; // Adjust for how sensitive the scroll hide behavior should be

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (window.scrollY > threshold) {
            document.body.classList.add("fixed__header");
        } else {
            document.body.classList.remove("fixed__header");
        }

        // Add 'hide' when scrolling down and remove it when scrolling up
        if (currentScrollY > lastScrollY + scrollThreshold) {
            document.body.classList.add("hidden__header");
        } else if (currentScrollY < lastScrollY - scrollThreshold || currentScrollY <= threshold) {
            document.body.classList.remove("hidden__header");
        }

        lastScrollY = currentScrollY;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
});
