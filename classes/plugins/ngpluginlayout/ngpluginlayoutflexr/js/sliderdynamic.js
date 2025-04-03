(function ($) {
    'use strict';

    $.fn.sqrFlexRSliderDynamic = function () {
        var header = $(this),
            container = $('#eyecatcherstage'),
            bullets = $('#eyecatcherbullets').children('a'),
            offset = 0,
            mainEyecatcher = container.children('img,video').eq(0),
            secEyecatcher,
            autoProgress = parseInt(header.attr('data-autoprogress')),
            autoProgessTimer = null,
            size = parseInt(header.attr('data-size'));


        function performAutoProgress() {
            offset++;

            if (offset > bullets.length - 1) {
                offset = 0;
            }

            setOffset(false);
        }

        function start() {
            if (autoProgress > 0) {
                if (autoProgessTimer !== null) {
                    stop();
                }
                autoProgessTimer = window.setTimeout(performAutoProgress, autoProgress * 1000);
            }
        }

        function stop() {
            if (autoProgessTimer !== null) {
                window.clearTimeout(autoProgessTimer);
                autoProgessTimer = null;
            }
        }

        function sizeHeader() {

            var width = header.width(),
                height = Math.floor(($(window).height() - header.offset().top) * size / 100);


            header.css('height', height + 'px');

            var picturewidth = width,
                pictureheight = Math.ceil(picturewidth * 9 / 16);

            if (pictureheight < height) {
                pictureheight = height;
                picturewidth = Math.floor(pictureheight * 16 / 9);
            }

            var left = -Math.floor((picturewidth - width) / 2),
                top = -Math.floor((pictureheight - height) / 4);

            container.css({
                'width': picturewidth + 'px',
                'height': pictureheight + 'px',
                'left': left + 'px',
                'top': top + 'px'
            });
        }

        function setOffset(loading) {
            var url = bullets.eq(offset).attr('href'),
                alt = bullets.eq(offset).attr('aria-label');

            bullets.removeClass('active').eq(offset).addClass('active');

            if (typeof secEyecatcher === 'undefined') {
                secEyecatcher = $('<img>', {
                    class: 'headerslidersecin'
                });
                mainEyecatcher.after(secEyecatcher);
            }

            var image = new Image();

            mainEyecatcher.removeClass('headerslidersec headerslidersecout');
            mainEyecatcher.addClass('headersliderpri');
            secEyecatcher.removeClass('headersliderpri headerslidersecout');
            secEyecatcher.addClass('headerslidersec');

            secEyecatcher[0].offsetHeight;
            mainEyecatcher[0].offsetHeight;


            $(image).on('load', function () {
                secEyecatcher.attr({'src': url, 'alt': alt});
                secEyecatcher[0].offsetHeight;
                secEyecatcher.addClass('headerslidersecout');

                var swap = mainEyecatcher;
                mainEyecatcher = secEyecatcher;
                secEyecatcher = swap;
                start();
            });
            $(image).attr('src', url);
        }

        if (bullets.length > 0) {
            bullets.eq(0).addClass('active');
            mainEyecatcher.after(secEyecatcher);

            bullets.bind('click', function (e) {
                stop();
                e.preventDefault();
                offset = $(this).index();
                setOffset(true);
            });

            start();

        }

        if (header.length > 0) {
            sizeHeader();
            sizeHeader();
            $(window).on('resize', sizeHeader);
        }
    };


})(jQuery);

$(function () {
    $('#eyecatcher').sqrFlexRSliderDynamic();
});
