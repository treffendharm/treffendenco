document.addEventListener('DOMContentLoaded', function () {
    const pacmanButton = document.querySelector('.button_pacman');
    const pacmanButtonLink = document.querySelector('.button_pacman a');
    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const pacmanPage = document.querySelector('.page-template-pacman-template');

    if (pacmanButton) {
        pacmanButton.addEventListener('click', function (e) {
            e.preventDefault();
            const href = pacmanButtonLink.href;

            main.style.opacity = 0;
            // Add transition to every li elemenrt inside the header that does not have the class .button_pacman
            header.querySelectorAll('li:not(.button_pacman)').forEach(li => {
                li.style.transition = 'opacity 0.3s ease-in-out';
            });
            header.querySelectorAll('li:not(.button_pacman)').forEach(li => {
                li.style.opacity = 0;
            });


            // I wanna make this animation, when we click the button, the inset property of the before element of the pacmanButton changes to -150svw
            pacmanButton.style.setProperty('--_inset', '-110svw');

            // After .5s go to the href page
            setTimeout(() => {
                window.location.href = href;
            }, 200);
        });
    }

    if (pacmanPage) {
        const app = document.querySelector('#app');
        main.style.setProperty('--_opacity', 1);
        header.style.setProperty('--_opacity', 1);
        setTimeout(() => {
            app.style.opacity = 1;

        }, 200);
    }
});