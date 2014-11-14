'use strict';

$(document).ready(function() {

    $(".login-button").click(function() {
        $(".overlay").addClass('overlay-open');
    });

    $(".overlay-close").click(function() {
        $(".overlay").removeClass("overlay-open");
    });

    $(".search-button").click(function() {
        $(".search-flyout").addClass('search-open');
    });

    $(".sections-button").click(function() {
        $(".dropdown").addClass('dropdown-open');
    });

    // if(!$(event.target).is('.search-container')) {
    //     $(".search-flyout").removeClass("search-open");
    // }
});