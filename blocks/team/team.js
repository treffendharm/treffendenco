document.addEventListener('DOMContentLoaded', function () {
    const teamBlock = document.querySelector('.block-team');
    const mq = window.matchMedia('(min-width: 768px)');

    if (teamBlock) {
        let imageContainerWrapper, imageContainer, imageContainerInner;
        let currentIndex = 0;
        let lastIndex = 0;

        const initializeEffect = () => {
            // Store original image containers
            const teamItems = teamBlock.querySelectorAll('.team-item');

            // Create new container structure
            imageContainerWrapper = document.createElement('div');
            imageContainer = document.createElement('div');
            imageContainerInner = document.createElement('div');
            imageContainer.classList.add('image-container');
            imageContainerInner.classList.add('inner');
            imageContainerWrapper.classList.add('image-container-wrapper');

            // Move images to new container
            const teamImages = teamBlock.querySelectorAll('.team-item-image img');
            const teamImagesArray = Array.from(teamImages).reverse();

            teamImagesArray.forEach((image) => {
                imageContainerInner.prepend(image);
            });

            imageContainer.prepend(imageContainerInner);
            teamBlock.prepend(imageContainerWrapper);
            imageContainerWrapper.prepend(imageContainer);

            const updateContainerPosition = (targetItem) => {
                if (!imageContainerWrapper) return;
                
                const targetRect = targetItem.getBoundingClientRect();
                const teamBlockRect = teamBlock.getBoundingClientRect();
                
                gsap.killTweensOf(imageContainerWrapper);
                
                gsap.to(imageContainerWrapper, {
                    top: `${targetRect.top - teamBlockRect.top}px`,
                    duration: 0.4,
                    ease: "power2.out"
                });
            };

            teamItems.forEach((item, index) => {
                item.dataset.index = index;

                item.addEventListener("mouseenter", () => {
                    const newIndex = parseInt(item.dataset.index, 10);
                    if (newIndex === currentIndex) return;

                    lastIndex = currentIndex;
                    currentIndex = newIndex;

                    const indexDifference = Math.abs(currentIndex - lastIndex);
                    const animationSpeed = Math.min(0.3 + indexDifference * 0.1, 1.5);

                    gsap.killTweensOf(imageContainerInner);

                    updateContainerPosition(item);

                    const height = parseFloat(getComputedStyle(imageContainer).getPropertyValue('--_height'));
                    const offset = currentIndex * height * -1;

                    gsap.to(imageContainerInner, {
                        y: offset + "rem",
                        duration: animationSpeed,
                        ease: "power2.out"
                    });
                });
            });

            // Set initial position
            const firstItem = teamItems[0];
            if (firstItem) {
                updateContainerPosition(firstItem);
            }
        };

        const removeEffect = () => {
            if (imageContainerWrapper) {
                // Move images back to their original containers
                const teamItems = teamBlock.querySelectorAll('.team-item');
                const images = imageContainerWrapper.querySelectorAll('img');
                
                images.forEach((img, index) => {
                    const originalContainer = teamItems[index]?.querySelector('.team-item-image');
                    if (originalContainer) {
                        originalContainer.appendChild(img);
                    }
                });

                imageContainerWrapper.remove();
                imageContainerWrapper = null;
            }
            currentIndex = 0;
            lastIndex = 0;
        };

        // Handle media query changes
        const handleMediaQuery = (e) => {
            if (e.matches) {
                initializeEffect();
            } else {
                removeEffect();
            }
        };

        // Initial check
        handleMediaQuery(mq);

        // Listen for changes
        mq.addEventListener('change', handleMediaQuery);
    }
});

