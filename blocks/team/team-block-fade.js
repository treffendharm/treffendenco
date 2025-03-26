document.addEventListener('DOMContentLoaded', function () {
    const teamBlock = document.querySelector('.block-team');

    if (teamBlock) {
        const teamItems = teamBlock.querySelectorAll('.team-item');
        
        const initializeGridEffects = () => {
            teamItems.forEach((item, index) => {
                const imageContainer = item.querySelector('.team-item-image');
                if (!imageContainer) return;

                const img = imageContainer.querySelector('img');
                if (!img) return;

                const existingWrapper = imageContainer.querySelector('.grid-reveal-wrapper');
                if (existingWrapper) existingWrapper.remove();

                const gridWrapper = document.createElement('div');
                gridWrapper.className = 'grid-reveal-wrapper';
                imageContainer.appendChild(gridWrapper);

                const gridSize = 8;
                const cells = [];

                for (let i = 0; i < gridSize * gridSize; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    gridWrapper.appendChild(cell);
                    cells.push(cell);
                }

                gsap.set(cells, {
                    opacity: 1,
                    scale: 1,
                    duration: 0,
                    backgroundColor: '#ffffff'
                });

                const tl = gsap.timeline({ paused: true });
                tl.to(cells, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.4,
                    stagger: {
                        amount: 0.5,
                        from: "random"
                    },
                    ease: "power2.out"
                });

                item.addEventListener('mouseenter', () => tl.play());
                item.addEventListener('mouseleave', () => tl.reverse());
            });
        };

        initializeGridEffects();

        const totalImages = teamItems.length;
        let loadedImages = 0;

        const checkAllImagesLoaded = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
                initializeGridEffects();
            }
        };

        teamItems.forEach((item) => {
            const img = item.querySelector('img');
            if (img) {
                if (img.complete) {
                    checkAllImagesLoaded();
                } else {
                    img.onload = checkAllImagesLoaded;
                }
            }
        });
    }
});

