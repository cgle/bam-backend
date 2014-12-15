'use strict';

$(document).ready(function() {

    $(".login-button").click(function() {
        $("#login-container").addClass('overlay-open');
    });

    $(".search-button").click(function() {
        $("#search-flyout").addClass('overlay-open');
    });

    $('.settings-button').click(function(event){
        $("#settings-container").addClass('overlay-open');
    });

    $('.user-edit-button').click(function(event){
        $("#edit-container").addClass('overlay-open');
    });

    $('html').click(function(e) {

        // $("#settings-container").addClass('overlay-open');
        console.log(e.target.className);
        if (e.target.className == 'overlay overlay-open') {
            $(".overlay").removeClass("overlay-open");
        }
    });

    // $(".comic-block").mouseover(function(e) {
    //     if (e.target.className == 'comic-block') {
    //         $(this).css("opacity","0.50");
    //     }
    // }).mouseout(function() {
    //     $(this).css("opacity","1.0");
    // })

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    var today = new Date();
    var day = days[today.getDay()];
    var dd = today.getDate();
    var month = months[today.getMonth()];
    var yyyy = today.getFullYear();

    if (dd<10) {
        dd='0'+dd;
    }

    today = day + ", " + month + " " + dd + ", "+ yyyy;
    // console.log(today);

    $("#date").html(today);
});

function getUserData(userId) {
    $ajax({
        url: '/api/users/' + userId,
    });
}

function toggle_visibility(id) {
    var e = document.getElementById(id);
    if(e.style.display == 'block'){
        e.style.display = 'none';
    }
    else{
        e.style.display = 'block';
    }
}



