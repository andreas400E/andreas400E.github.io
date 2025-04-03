(function ($) {
    'use strict';
    $.fn.ngStickyButton = function () {
        this.each(function () {

            var that = $(this),
                position = that.attr('data-ngstickybuttonposition'),
                delay = that.attr('data-ngstickybuttondelay');

            function place() {
                var width = that.outerWidth(),
                    height = that.outerHeight(),
                    wwidth = $(window).width(),
                    wheight = $(window).height(),
                    left, top, right, bottom;

                switch (position) {
                    case 'topleft':
                        left = Math.floor(wwidth * 0.10);
                        that.css({
                            'top': 0,
                            'left': left + 'px'
                        });
                        break;
                    case 'topright':
                        right = Math.floor(wwidth * 0.10);
                        that.css({
                            'top': 0,
                            'right': right + 'px'
                        });
                        break;
                    case 'topcenter':
                        left = Math.floor((wwidth - width) / 2);
                        that.css({
                            'top': 0,
                            'left': left + 'px'
                        });
                        break;
                    case 'rightupper':
                        right = Math.floor((height - width) / 2);
                        top = Math.floor(wheight * 0.10 + (width - height) / 2);
                        that.css({
                            'top': top + 'px',
                            'right': right + 'px'
                        });
                        break;
                    case 'rightlower':
                        right = Math.floor((height - width) / 2);
                        bottom = Math.floor(wheight * 0.10 + (width - height) / 2);
                        that.css({
                            'bottom': bottom + 'px',
                            'right': right + 'px'
                        });
                        break;
                    case 'rightmiddle':
                        right = Math.floor((height - width) / 2);
                        top = Math.floor((wheight - height) / 2);
                        that.css({
                            'top': top + 'px',
                            'right': right + 'px'
                        });
                        break;
                    case 'leftupper':
                        left = Math.floor((height - width) / 2);
                        top = Math.floor(wheight * 0.10 + (width - height) / 2);
                        that.css({
                            'top': top + 'px',
                            'left': left + 'px'
                        });
                        break;
                    case 'leftmiddle':
                        left = Math.floor((height - width) / 2);
                        top = Math.floor((wheight - height) / 2);
                        that.css({
                            'top': top + 'px',
                            'left': left + 'px'
                        });
                        break;
                    case 'leftlower':
                        left = Math.floor((height - width) / 2);
                        bottom = Math.floor(wheight * 0.10 + (width - height) / 2);
                        that.css({
                            'bottom': bottom + 'px',
                            'left': left + 'px'
                        });
                        break;
                    case 'bottomcenter':
                        left = Math.floor((wwidth - width) / 2);
                        that.css({
                            'bottom': '0',
                            'left': left + 'px'
                        });
                        break;
                    case 'bottomright':
                        right = Math.floor($(window).width() * 0.10);
                        that.css({
                            'bottom': '0',
                            'right': right + 'px'
                        });
                        break;
                    case 'bottomleft':
                        left = Math.floor($(window).width() * 0.10);
                        that.css({
                            'bottom': '0',
                            'left': left + 'px'
                        });
                        break;
                }
            }

            place();

            $(window).on('resize load', place);

            if (delay > 0) {
                window.setTimeout(function () {
                    that.removeClass('ngparastickybuttonhidden');
                }, delay * 1000);
            }

            return this;
        });
    };
})(jQuery);

$(function() {
    $('.ngparastickybutton').ngStickyButton();
});
