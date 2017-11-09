//between function for changing timeline colors based on scroll position
function between(value, min, max) {
    if (value < max && value >= min) return true;
    else return false;
}

function scroll(x) {
    $(focus).scrollTop(x);
}

//tab selector value for anchor points
isSelected = 0;

var viewportWidth, divWidth, tb;
$(function() {
    viewport = $('#container').innerWidth();
    tb = $('#thumbs');
    divWidth = tb.outerWidth();

    //set first option in all timelines to filled by default
    $('ul li:nth-child(1)').toggleClass('changed');

    //collapsing and expanding of history blocks on click
    $('.history-block').on('click', function() {

        //collapse other tabs
        $('.history-block').not(this).find('.timeline').hide(500);
        $('.history-block').not(this).find('.timePeriod').css({
            'width': '7vw',
            'padding-left': '5vw',
            'padding-top': '0',
            '-webkit-transform': 'rotate(90deg)',
            'transition-duration': '0.1s',
            'font-size': 'medium',
            'font-weight': '500'
        });
        $('.history-block').not(this).find('.yearRange').css({
            'width': '7vw',
            'padding-top': '52vh',
        });
        $('.history-block').not(this).find('.historyContent').css({
            'width': '7vw',
            'visibility': 'hidden'
        });
        $('.history-block').not(this).css({
            'width': '7vw',
            'opacity': '0.6',
        });

        //expand clicked tab
        $(this).find('.timeline').show(200);
        $(this).find('.yearRange').css({
            'width': '59vw',
            'padding-top': '1vh'
        });
        $(this).find('.historyContent').css({
            'width': '59vw',
            'visibility': 'visible',
        });
        $(this).find('.timePeriod').css({
            'width': '59vw',
            'padding-top': '1vh',
            '-webkit-transform': 'rotate(0deg)',
            'transition-duration': '0.1s',
            'padding-left': '0',
            'font-size': 'x-large',
            'font-weight': 'bold'
        });
        $(this).css({
            'width': '59vw',
            'opacity': '1',
        });

        //sets focus for the scroll function and anchor point population
        focus = $(this).find('.historyContent');

        //populate values of anchor points depending on tab opened
        if (focus[0] == $('#historyContent1')[0] && isSelected != 1) {
            isSelected = 1;
            setTimeout(function() {
                anchor1 = $("#historyContent1Anchor1").position().top + $('#historyContent1').scrollTop();
                anchor2 = $("#historyContent1Anchor2").position().top + $('#historyContent1').scrollTop();
                anchor3 = $("#historyContent1Anchor3").position().top + $('#historyContent1').scrollTop();
                anchor4 = $("#historyContent1Anchor4").position().top + $('#historyContent1').scrollTop();
                anchor5 = $("#historyContent1Anchor5").position().top + $('#historyContent1').scrollTop();
            }, 200);
        } else if (focus[0] == $('#historyContent2')[0] && isSelected != 2) {
            isSelected = 2;
            setTimeout(function() {
                anchor1 = $("#historyContent2Anchor1").position().top + $('#historyContent2').scrollTop();
                anchor2 = $("#historyContent2Anchor2").position().top + $('#historyContent2').scrollTop();
                anchor3 = $("#historyContent2Anchor3").position().top + $('#historyContent2').scrollTop();
                anchor4 = $("#historyContent2Anchor4").position().top + $('#historyContent2').scrollTop();
                anchor5 = $("#historyContent2Anchor5").position().top + $('#historyContent2').scrollTop();
            }, 200);
        } else if (focus[0] == $('#historyContent3')[0] && isSelected != 3) {
            isSelected = 3;
            setTimeout(function() {
                anchor1 = $("#historyContent3Anchor1").position().top + $('#historyContent3').scrollTop();
                anchor2 = $("#historyContent3Anchor2").position().top + $('#historyContent3').scrollTop();
                anchor3 = $("#historyContent3Anchor3").position().top + $('#historyContent3').scrollTop();
                anchor4 = $("#historyContent3Anchor4").position().top + $('#historyContent3').scrollTop();
                anchor5 = $("#historyContent3Anchor5").position().top + $('#historyContent3').scrollTop();
            }, 200);
        } else if (focus[0] == $('#historyContent4')[0] && isSelected != 4) {
            isSelected = 4;
            setTimeout(function() {
                anchor1 = $("#historyContent4Anchor1").position().top + $('#historyContent4').scrollTop();
                anchor2 = $("#historyContent4Anchor2").position().top + $('#historyContent4').scrollTop();
                anchor3 = $("#historyContent4Anchor3").position().top + $('#historyContent4').scrollTop();
                anchor4 = $("#historyContent4Anchor4").position().top + $('#historyContent4').scrollTop();
                anchor5 = $("#historyContent4Anchor5").position().top + $('#historyContent4').scrollTop();
            }, 200);
        } else if (focus[0] == $('#historyContent5')[0] && isSelected != 5) {
            isSelected = 5;
            setTimeout(function() {
                anchor1 = $("#historyContent5Anchor1").position().top + $('#historyContent5').scrollTop();
                anchor2 = $("#historyContent5Anchor2").position().top + $('#historyContent5').scrollTop();
                anchor3 = $("#historyContent5Anchor3").position().top + $('#historyContent5').scrollTop();
                anchor4 = $("#historyContent5Anchor4").position().top + $('#historyContent5').scrollTop();
                anchor5 = $("#historyContent5Anchor5").position().top + $('#historyContent5').scrollTop();
            }, 200);
        } else if (focus[0] == $('#historyContent6')[0] && isSelected != 6) {
            isSelected = 6;
            setTimeout(function() {
                anchor1 = $("#historyContent6Anchor1").position().top + $('#historyContent6').scrollTop();
                anchor2 = $("#historyContent6Anchor2").position().top + $('#historyContent6').scrollTop();
                anchor3 = $("#historyContent6Anchor3").position().top + $('#historyContent6').scrollTop();
                anchor4 = $("#historyContent6Anchor4").position().top + $('#historyContent6').scrollTop();
                anchor5 = $("#historyContent6Anchor5").position().top + $('#historyContent6').scrollTop();
            }, 200);
        }
    });

    //set timer delay on scroll executing the handleScroll function so it doesnt fire 10 trillion times     
    // add "scrollTimer = null;" to beginning of handlescroll function if you want to use this again
    //use if the scroll function gets bloated and needs to calm down
    // var scrollTimer = null;
    // $('.historyContent').scroll(function () {
    //   if (scrollTimer) {
    //       clearTimeout(scrollTimer);   // clear any previous pending timer
    //   }
    //   scrollTimer = setTimeout(handleScroll, 100);   // set new timer
    // });

    //change color of timeline based on scroll position
    $('.historyContent').scroll(function() {
        // console.log(this);
        if (between($(this).scrollTop(), anchor1, anchor2)) {
            $(this).parent().find('.timeline li').removeClass('changed');
            $(this).parent().find('ul li:nth-child(1)').toggleClass('changed');
        } else if (between($(this).scrollTop(), anchor2, anchor3)) {
            $(this).parent().find('.timeline li').removeClass('changed');
            $(this).parent().find('ul li:nth-child(2)').toggleClass('changed');
        } else if (between($(this).scrollTop(), anchor3, anchor4)) {
            $(this).parent().find('.timeline li').removeClass('changed');
            $(this).parent().find('ul li:nth-child(3)').toggleClass('changed');
        } else if (between($(this).scrollTop(), anchor4, anchor5)) {
            $(this).parent().find('.timeline li').removeClass('changed');
            $(this).parent().find('ul li:nth-child(4)').toggleClass('changed');
        } else if (between($(this).scrollTop(), anchor5, 232323)) {
            $(this).parent().find('.timeline li').removeClass('changed');
            $(this).parent().find('ul li:nth-child(5)').toggleClass('changed');
        }
    });

});