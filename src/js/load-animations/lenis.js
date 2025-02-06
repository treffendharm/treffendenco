const lenis = new Lenis({
    lerp: 0.1, // Adjust this value for faster scrolling. 
    // You can also add other options here if needed
});

// Optional: Log scroll events for debugging
// lenis.on("scroll", (e) => {
//     console.log(e);
// });

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// Optional: Lag smoothing can be adjusted as needed
gsap.ticker.lagSmoothing(0);
