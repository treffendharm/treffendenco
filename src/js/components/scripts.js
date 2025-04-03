document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('data-open') === 'true';
            const newState = isOpen ? 'false' : 'true';
            
            menuToggle.setAttribute('data-open', newState);
            mobileMenu.setAttribute('data-open', newState);
        });
    }
});


// $('.open-sub-menu').on('click', function () {
//   $(this).parent().siblings('.sub-menu-wrapper').attr("data-open", function (index, attr) {
//     return attr == "true" ? "false" : "true";
//   });
// })

// $(".back-button").click(function () {
//   $(this).parent().parent().attr("data-open", function (index, attr) {
//     return attr == "true" ? "false" : "true";
//   });
// });