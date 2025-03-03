document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".btn, .button_menu a").forEach((button) => {
        const ball = Object.assign(document.createElement("div"), { className: "button__effect" });
        button.appendChild(ball);

        let [mouseX, mouseY, ballX, ballY] = [-100, -100, -100, -100];
        let [velocityX, velocityY] = [0, 0];
        let isLeaving = false;
        const speed = 0.2;

        function animate() {
            const [distX, distY] = [mouseX - ballX, mouseY - ballY];
            [velocityX, velocityY] = isLeaving ?
                [velocityX * 0.95, velocityY * 0.95] :
                [distX * speed, distY * speed];

            ballX += velocityX;
            ballY += velocityY;

            ball.style.transform = `translate(calc(${ballX}px - 50%), calc(${ballY}px - 50%))`;
            if (!isLeaving || Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
                requestAnimationFrame(animate);
            }
        }

        button.addEventListener("mouseenter", (e) => {
            isLeaving = false;
            [mouseX, mouseY, ballX, ballY] = [e.offsetX, e.offsetY, e.offsetX, e.offsetY];
            animate();
        });

        button.addEventListener("mousemove", (e) => ([mouseX, mouseY] = [e.offsetX, e.offsetY]));
        button.addEventListener("mouseleave", () => (isLeaving = true));
    });
});
