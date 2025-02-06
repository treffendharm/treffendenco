jQuery($ => {
  $(".menu-toggle").click(function () {
    $("header, .menu-toggle").attr("data-open", (_, attr) => attr == "true" ? "false" : "true");
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
});