'use strict';

jQuery(document).ready(function ($) {

    //home_url
    //theme_url

    //++++++++++++++++++++++++++++++++++++++++++
    //init Foundation
    //++++++++++++++++++++++++++++++++++++++++++

    var $body = $('body');
    var $nav = $('.main-nav');

    $(document).on('click', '.hoverLink', function (event) {
        if (!Foundation.MediaQuery.atLeast('medium')) {
            event.preventDefault();
        }
    }).on('touchend', '.area', function (event) {
        var $this = $(this);
        var toggleClick = $this.data('toggleClick');

        if (toggleClick) {
            window.location = $this.find('.hoverLink')[0].href;
        }

        toggleClick = !toggleClick;
        $this.data('toggleClick', toggleClick);
    }).on('click', '.menu-icon', function (event) {
        $body.toggleClass('modal-open');
        $nav.toggleClass('active');
        event.preventDefault();
    }).on('click', '.modal .close', function (event) {
        $(this).closest('.modal').removeClass('in');
        event.preventDefault();
    }).on('click', '.read-more', function (event) {
        var $this = $(this);
        var open = $this.parent().is('.open');

        $this.text($this.data(open ? 'more' : 'less')).parent().toggleClass('open');

        event.preventDefault();
    }).foundation();

    $('.v-spacer').each(function () {
        var $this = $(this);
        var spacing = $this.data('spacing');

        if (spacing < 0) {
            $this.next().css('marginTop', function (mt) {
                return mt + spacing;
            });
        }
    });

    $('.hoverText').flowtype({
        minimum: 300,
        maximum: 600,
        minFont: 14,
        maxFont: 48,
        fontRatio: Foundation.MediaQuery.atLeast('large') ? 18 : 30
    });

    //++++++++++++++++++++++++++++++++++++++++++
    //Scroll to top/down
    //++++++++++++++++++++++++++++++++++++++++++

    $('.scrollTop').on('click', function (event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });

    $('.scrollDown').on('click', function (event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: $(window).height() }, 'slow');
    });

    $('.scrollto').on('click', function (event) {
        event.preventDefault();
        var top = $($(this).attr("href")).offset().top;
        $('html, body').animate({ scrollTop: top }, 'slow');
    });

    $('.scrollToMap').on('click', function (event) {
        event.preventDefault();
        var top = $(document).height() - $(window).height();
        var $this = $(this);
        $('html, body').animate({ scrollTop: top }, 800, null, function () {

            if ($this.is('[id^="link"]')) {
                var id = $this.attr('id').split('link')[1] - 1;
                console.log(id);
                google.maps.event.trigger(markers[id], 'click');
            } else {
                console.log("nope");
            }
        });
    });

    //++++++++++++++++++++++++++++++++++++++++++
    // Go to url
    //++++++++++++++++++++++++++++++++++++++++++

    $('.gotourl').on('click', function (event) {
        event.preventDefault();

        if (typeof $(this).data('newwindow') == "undefined") {
            window.location.href = $(this).data('url');
        } else {
            window.open($(this).data('url'));
        }
    });

    //++++++++++++++++++++++++++++++++++++++++++
    //on Resize
    //++++++++++++++++++++++++++++++++++++++++++

    $(window).on('resize', function (event) {
        var width = $(window).width(),
            height = $(window).height();
    }).trigger('resize');
});