'use strict';

$(document).ready(function() {

    $(".login-button").click(function() {
        $("#login-container").addClass('overlay-open');
    });

    $(".search-button").click(function() {
        $("#search-flyout").addClass('overlay-open');
    });

    $(".sections-button").click(function() {
        $(".dropdown-container").toggle();
    });

    $('.sections-button').click(function(event){
        event.stopPropagation();
    });

    $('.settings-button').click(function(event){
        $("#settings-container").addClass('overlay-open');
    });

    $('.edit-button').click(function(event){
        $("#edit-container").addClass('overlay-open');
    });

    // $('.close-button').click(function(event){
        // $("#search-flyout").addClass('overlay')
        // $("#settings-container").addClass('overlay')
        // $("#edit-container").addClass('overlay')
    // })

    $('html').click(function(e) {
        $('.dropdown-container').hide();
        if (e.target.className == 'overlay overlay-open') {
            $(".overlay").removeClass("overlay-open");
        }
    });

    $(".comic-block").mouseover(function(e) {
        if (e.target.className == 'comic-block') {
            $(this).css("opacity","0.50");
        }
    }).mouseout(function() {
        $(this).css("opacity","1.0");
    })

    console.log('js loaded');
});

function getUserData(userId) {
    $ajax({
        url: '/api/users/' + userId,
    });
}