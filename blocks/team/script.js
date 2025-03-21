
document.addEventListener('DOMContentLoaded', function () {
    const teamBlock = document.querySelector('.block-team');

    if (teamBlock) {

        // Get all images and put them inside a new imageContainer
        const imageContainerWrapper = document.createElement('div');
        const imageContainer = document.createElement('div');
        const imageContainerInner = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageContainerInner.classList.add('inner');
        imageContainerWrapper.classList.add('image-container-wrapper');
        imageContainerWrapper.classList.add('-hidden');

        const teamItems = teamBlock.querySelectorAll('.team-item');
        const teamImages = teamBlock.querySelectorAll('.team-item-image img');
        const teamImagesArray = Array.from(teamImages).reverse();

        teamImagesArray.forEach((image) => {
            imageContainerInner.prepend(image);
        });

        imageContainer.prepend(imageContainerInner);
        teamBlock.prepend(imageContainerWrapper);
        imageContainerWrapper.prepend(imageContainer);


        // const cursor = new MouseFollower({
        //     container: '.team-wrapper',
        //     el: imageContainerWrapper,
        // });

        let offset;
        let currentIndex = 0;
        teamItems.forEach((item, index) => {
            item.dataset.index = index; // Assign index to each item

            const height = parseFloat(getComputedStyle(imageContainer).getPropertyValue('--_height'));

            item.addEventListener("mouseover", () => {
                let newIndex = parseInt(item.dataset.index, 10);

                if (newIndex === currentIndex) return;

                lastIndex = currentIndex;
                currentIndex = newIndex;

                let indexDifference = Math.abs(currentIndex - lastIndex);
                let animationSpeed = Math.min(0.3 + indexDifference * .5, 20);

                offset = currentIndex * height * -1;
                gsap.to(imageContainerInner, {
                    y: offset + "rem",
                    duration: animationSpeed,
                    ease: "power2.out",
                });
            });
        });
    }
});

