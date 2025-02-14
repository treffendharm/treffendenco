// Lets make the svg look at the cursor its the .arrow thats inside the .block-hero

function initArrowAnimation() {
    const arrow = document.querySelector('.hero__arrow');
    if (!arrow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentAngle = 0; // Track current angle for smooth animation

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        // Get mouse position relative to viewport
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Add scroll offset to get position relative to document
        const actualY = mouseY + window.scrollY;

        // Calculate angle between arrow and mouse position
        const arrowRect = arrow.getBoundingClientRect();
        const arrowX = arrowRect.left + (arrowRect.width / 2);
        const arrowY = arrowRect.top + (arrowRect.height / 2) + window.scrollY;

        const deltaX = mouseX - arrowX;
        const deltaY = actualY - arrowY;
        
        // Calculate angle and add 45 degree offset
        const angle = (Math.atan2(deltaY, deltaX) * (180 / Math.PI)) + 45;
        
        // Limit rotation to 5% of the calculated angle
        const targetAngle = angle * 0.05;
        
        // Smooth transition
        currentAngle += (targetAngle - currentAngle) * 0.1;

        // Apply transform with both rotation and skew
        arrow.style.transform = `rotate(${currentAngle}deg) skewX(${currentAngle * 0.1}deg)`;
    });

    // Update position when scrolling
    document.addEventListener('scroll', () => {
        if (!mouseX || !mouseY) return; // Skip if no mouse movement yet

        const actualY = mouseY + window.scrollY;

        // Recalculate angle with new scroll position
        const arrowRect = arrow.getBoundingClientRect();
        const arrowX = arrowRect.left + (arrowRect.width / 2);
        const arrowY = arrowRect.top + (arrowRect.height / 2) + window.scrollY;

        const deltaX = mouseX - arrowX;
        const deltaY = actualY - arrowY;
        
        // Calculate angle and add 45 degree offset
        const angle = (Math.atan2(deltaY, deltaX) * (180 / Math.PI)) + 45;
        
        // Limit rotation to 5% of the calculated angle
        const targetAngle = angle * 0.05;
        
        // Smooth transition
        currentAngle += (targetAngle - currentAngle) * 0.1;

        // Apply transform with both rotation and skew
        arrow.style.transform = `rotate(${currentAngle}deg) skewX(${currentAngle * 0.1}deg)`;
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', initArrowAnimation);
