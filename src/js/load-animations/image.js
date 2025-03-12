// I wanna make a function that detects every image with the class ".load-in" to have a clip path animaiton with GSAP and load in when its in the viewport

function loadInImages() {
    const images = document.querySelectorAll(".load-in");
    if (images) {
        // Set initial state for all images
        gsap.set(images, {
            clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
            // opacity: 0
        });

        // Group images that are next to each other for staggering
        const imageGroups = [];
        let currentGroup = [];

        images.forEach((image, index) => {
            const rect = image.getBoundingClientRect();

            if (index === 0) {
                currentGroup.push(image);
            } else {
                const prevRect = images[index - 1].getBoundingClientRect();
                const isNextTo = Math.abs(rect.top - prevRect.top) < 100; // Adjust threshold as needed

                if (isNextTo) {
                    currentGroup.push(image);
                } else {
                    if (currentGroup.length > 0) {
                        imageGroups.push([...currentGroup]);
                    }
                    currentGroup = [image];
                }
            }

            if (index === images.length - 1 && currentGroup.length > 0) {
                imageGroups.push([...currentGroup]);
            }
        });

        // Create ScrollTrigger for each group
        imageGroups.forEach(group => {
            ScrollTrigger.create({
                trigger: group[0],
                start: "top 100%", // Start animation when image is 85% from the top of viewport
                once: true, // Only trigger once
                onEnter: () => {
                    gsap.to(group, {
                        clipPath: "polygon(100% 0, 0 0, 0 100%, 100% 100%)",
                        opacity: 1,
                        duration: 1.5,
                        stagger: {
                            each: 0.2,
                            ease: "power4.inOut"
                        },
                        ease: "power4.inOut", // Match your site's cubic bezier
                    });
                }
            });
        });
    }
}

// Make the function globally available
window.loadInImages = loadInImages;

// Initialize on document ready
document.addEventListener("DOMContentLoaded", loadInImages);

// Refresh ScrollTrigger when all content is loaded
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});
