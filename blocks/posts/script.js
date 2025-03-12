const blockPosts = document.querySelectorAll('.block-posts');

if (blockPosts.length) {
    const postCards = document.querySelectorAll('.card-post');

    postCards.forEach((item) => {
        const cardTitle = item.querySelector('h3');
        const categoryContainer = item.querySelector('.categories');
        const categories = categoryContainer ? [...categoryContainer.querySelectorAll('span')] : []; // Convert to array

        splitText(cardTitle); // Zorg ervoor dat splitText de tekst opsplitst in .char elementen

        item.addEventListener('mouseenter', function () {
            const chars = item.querySelectorAll(".char");


            if (!categories.length) return; // Skip category animation if there are no categories

            const tl = gsap.timeline();

            // **Title Animation: Move up and come back**
            tl.to(chars, {
                y: "-100%", // Move up to disappear
                stagger: 0.009,
                duration: 0.2,
                ease: "cubic-bezier(.6,.03,1,1)"
            })
            .set(chars, { y: "100%" }) // Instantly move below
            .to(chars, {
                y: "0%", // Move back into place
                stagger: 0.009,
                duration: 0.2,
                ease: "cubic-bezier(0,-0.01,.3,.98)"
            });

            // **Category Animation: Quick bounce effect**
            tl.to(categories, {
                y: "-100%", // Move up to disappear
                stagger: 0.05,
                duration: 0.15,
                ease: "cubic-bezier(.6,.03,1,1)"
            }, "-=0.4") // Start category animation before title finishes
            .set(categories, { y: "100%" }) // Instantly move below
            .to(categories, {
                y: "0%", // Move back into place
                opacity: 1,
                stagger: 0.05,
                duration: 0.15,
                ease: "cubic-bezier(0,-0.01,.3,.98)"
            });
        });
    });
}

// Helpers:
function splitText(elements) {
    const elementsArray = Array.isArray(elements) ? elements : [elements];

    elementsArray.forEach((element) => {
        const words = element.innerHTML.split(" ");
        element.innerHTML = "";
        element.classList.add("split-text");

        words.forEach((word) => {
            const wordWrapper = document.createElement("span");
            wordWrapper.classList.add("word");

            [...word].forEach((letter) => {
                const charWrapper = document.createElement("div");
                charWrapper.classList.add("char");
                charWrapper.textContent = letter;
                wordWrapper.appendChild(charWrapper);
            });

            element.appendChild(wordWrapper);
        });
    });
}
