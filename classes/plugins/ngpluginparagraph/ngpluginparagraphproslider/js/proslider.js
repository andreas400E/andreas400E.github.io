(function ($) {
    'use strict';
    $.fn.sqwPluginProslider = function () {
        $(this).each(function () {
                var that = $(this),
                    container = that.children('ul'),
                    items = container.children('li'),
                    images = container.find('img'),
                    prevlink = that.children('.ngparaprosliderprev'),
                    previmage = prevlink.children('img'),
                    nextlink = that.children('.ngparaproslidernext'),
                    nextimage = nextlink.children('img'),
                    bulletcontainer = that.children('.ngparaprosliderbullets'),
                    ratio = parseFloat(that.attr('data-ratio')),
                    touch = that.attr('data-touch') === 'true',
                    bullets,
                    current = 0,
                    drag = false,
                    lastx = 0,
                    newx = 0;

                function offset(change) {
                    var value = current + change;

                    if (value < 0) value = value + items.length;
                    if (value > items.length - 1) value = value - items.length;

                    return value;
                }

                function animateNext(e) {
                    if (e !== undefined) e.preventDefault();
                    current = offset(1);
                    placeContainers('next');

                }

                function animatePrev(e) {
                    if (e !== undefined) e.preventDefault();
                    current = offset(-1);
                    placeContainers('prev');
                }

                function placeContainers(animation) {
                    var containerWidth = that.width(),
                        mainWidth = Math.min(990, Math.floor(containerWidth * 0.8)),
                        teaserWidth = Math.floor((containerWidth - mainWidth) / 2),
                        height = 0,
                        linkWidth = Math.max(30, Math.min(60, Math.floor(containerWidth * 0.05))),
                        i;

                    items.css({
                        'width': mainWidth - linkWidth + 'px'
                    });

                    bullets.removeClass('ngparaprosliderbulletcurrent');
                    bullets.eq(current).addClass('ngparaprosliderbulletcurrent');


                    nextlink.css({
                        'width': teaserWidth + Math.floor(linkWidth / 2) + 'px',
                        'height': Math.floor((mainWidth - linkWidth) / ratio) + 'px',
                    });

                    prevlink.css({
                        'width': teaserWidth + Math.floor(linkWidth / 2) + 'px',
                        'height': Math.floor((mainWidth - linkWidth) / ratio) + 'px'
                    });

                    nextimage.css({
                        'top': Math.floor(((mainWidth - linkWidth) / ratio / 2) - linkWidth / 2) + 'px',
                        'width': linkWidth + 'px',
                        'height': linkWidth + 'px'
                    });

                    previmage.css({
                        'top': Math.floor(((mainWidth - linkWidth) / ratio / 2) - linkWidth / 2) + 'px',
                        'width': linkWidth + 'px',
                        'height': linkWidth + 'px'
                    });


                    for (i = 0; i < items.length; i++) {
                        if (i === offset(-2) || i === offset(-1) || i === current || i === offset(1) || i === offset(2)) {
                            items.eq(i).css('display', 'block');
                        } else {
                            items.eq(i).css('display', 'none');
                        }
                    }

                    for (i = -2; i <= 2; i++) {

                        var item = items.eq(offset(i));

                        if ((animation === 'next' && i !== 2) || (animation === 'prev' && i !== -2)) {
                            item.css('transition', 'transform 0.6s ease');
                            item.children().css('transition', 'opacity 0.6s ease');
                        } else {
                            item.css('transition', 'transform 0s');
                            item.children().css('transition', 'opacity 0s');
                        }

                        item.css('transform', 'translate3d(' + (teaserWidth + i * mainWidth + linkWidth / 2) + 'px,0,0)');
                        item.data('offset', (teaserWidth + i * mainWidth + linkWidth / 2));

                        if (i === 0) {
                            item.children(('div')).css('opacity', '1');
                            item.children(('img')).css('opacity', '1');
                        } else {
                            item.children(('div')).css('opacity', '0');
                            item.children(('img')).css('opacity', '0.5');
                        }
                    }

                    if (animation === '') {
                        for (i = 0; i < items.length; i++) {
                            height = Math.max(height, items.eq(i).height());
                        }

                        container.css('height', height + 'px');
                    }
                }

                function handleStart(x) {
                    drag = true;
                    lastx = x;
                    newx = lastx;

                    nextlink.css('opacity', '0');
                    prevlink.css('opacity', '0');

                }

                function handleEnd() {
                    drag = false;

                    var i;

                    if (Math.abs(newx - lastx) > 50) {
                        if (newx < lastx) {
                            animateNext();
                        } else {
                            animatePrev();
                        }
                    } else {
                        for (i = -2; i <= 2; i++) {
                            var item = items.eq(offset(i));

                            item.css({
                                'transition': 'transform 0.2s',
                                'transform': 'translate3d(' + (item.data('offset')) + 'px,0,0)'
                            });
                        }
                    }

                    nextlink.css('opacity', '0.3');
                    prevlink.css('opacity', '0.3');
                }

                function handleMove(x) {
                    if (drag) {

                        newx = x;

                        var translate = newx - lastx, i;

                        if (translate < -container.width()) translate = -container.width();
                        if (translate > container.width()) translate = container.width();

                        for (i = -2; i <= 2; i++) {
                            var item = items.eq(offset(i));

                            item.css({
                                'transition': 'transform 0s',
                                'transform': 'translate3d(' + (item.data('offset') + translate) + 'px,0,0)'
                            });
                        }

                    }
                }

                function createBullets() {
                    var i;

                    for (i = 0; i < items.length; i++) {
                        bulletcontainer.append($('<div>'));
                    }

                    bullets = bulletcontainer.children();
                }

                createBullets();

                placeContainers('');

                $(window).on('resize', function () {
                    placeContainers('');
                    placeContainers('');
                });

                nextlink.on('click', animateNext);
                prevlink.on('click', animatePrev);

                nextlink.on('keypress', function (e) {
                    if (e.key === 'Enter') {
                        e.handled = true;
                        animateNext();
                    }
                });

                prevlink.on('keypress', function (e) {
                    if (e.key === 'Enter') {
                        e.handled = true;
                        animatePrev();
                    }
                });


                if (touch) {
                    images.on('touchstart', function (e) {
                        if (e.originalEvent.touches.length === 1) {
                            handleStart(e.originalEvent.touches[0].pageX);
                            if (navigator.userAgent.indexOf('Android 4') !== -1) e.preventDefault();
                        }
                    });

                    images.on('touchmove', function (e) {
                        if (e.originalEvent.touches.length === 1) {
                            handleMove(e.originalEvent.touches[0].pageX);
                            if (e.cancelable) e.preventDefault();
                        }
                    });
                }


                images.on('touchend', function () {
                    handleEnd();
                });
            }
        );
    };
})(jQuery);

$(function () {
    $('.ngparaproslider').sqwPluginProslider();
});
