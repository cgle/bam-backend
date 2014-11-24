$(function() {
    $('.mini-navigation-menu > li').click(function(){
        var speed = 400;
        var i = $(this).index();
        $('.page.current').animate({opacity: 0, marginTop:80},speed,function(){
            $(this).removeClass('current');
            $('.page').eq(i).css('marginTop',30).animate({opacity:1,marginTop: 50},speed).addClass('current');
        });
    });
});

function toggle_visibility(id) {
    var e = document.getElementById(id);
    if(e.style.display == 'block'){
        e.style.display = 'none';
    }
    else{
        e.style.display = 'block';
    }
}