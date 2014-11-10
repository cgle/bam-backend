'use strict';

$(document).ready(function() {
    $(".login-button").on("click", function() {
        $(".overlay").addClass('overlay-open');
    });

    $(".overlay-close").click(function() {
        $(".overlay").removeClass("overlay-open");
    });
});