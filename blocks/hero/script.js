// Lets make the svg look at the cursor its the .arrow thats inside the .block-hero
// Only make the arrow respond when its in view with some extra margin outside its view with like 20% extra

function initArrowAnimation() {
    const arrow = document.querySelector('.hero__arrow');
    if (!arrow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentAngle = 0; // Track current angle for smooth animation

    // Function to check if the arrow is in view
    function isArrowInView() {
        const arrowRect = arrow.getBoundingClientRect();
        const viewPortRect = {
            top: window.scrollY,
            left: window.scrollX,
            bottom: window.scrollY + window.innerHeight,
            right: window.scrollX + window.innerWidth
        };

        // Add 20% extra margin outside the arrow's view
        const extraMargin = 100; // in percentage
        const extraMarginPx = (arrowRect.width + arrowRect.height) * (extraMargin / 100);
        const extendedArrowRect = {
            top: arrowRect.top - extraMarginPx,
            left: arrowRect.left - extraMarginPx,
            bottom: arrowRect.bottom + extraMarginPx,
            right: arrowRect.right + extraMarginPx
        };

        // Check if the arrow is in view with the extra margin
        return (
            extendedArrowRect.bottom > viewPortRect.top &&
            extendedArrowRect.top < viewPortRect.bottom &&
            extendedArrowRect.right > viewPortRect.left &&
            extendedArrowRect.left < viewPortRect.right
        );
    }

    // Track mouse movement
    function updateArrow() {
        if (!mouseX || !mouseY || !isArrowInView()) return;

        const actualY = mouseY + window.scrollY;

        const arrowRect = arrow.getBoundingClientRect();
        const arrowX = arrowRect.left + (arrowRect.width / 2);
        const arrowY = arrowRect.top + (arrowRect.height / 2) + window.scrollY;

        const deltaX = mouseX - arrowX;
        const deltaY = actualY - arrowY;

        const angle = (Math.atan2(deltaY, deltaX) * (180 / Math.PI)) + 45;
        const targetAngle = angle * 0.05;

        currentAngle += (targetAngle - currentAngle) * 0.1;

        arrow.style.transform = `rotate(${currentAngle}deg) skewX(${currentAngle * 0.1}deg)`;
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateArrow();
    });

    document.addEventListener('scroll', updateArrow);

}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', initArrowAnimation);
