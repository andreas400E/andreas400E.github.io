(function ($) {
    'use strict';

    $.fn.ngPhotostory = function () {
        $(this).each(function () {
            var container = $(this).children('.ngparaphotostorycenter'),
                containerWidth,
                containerHeight,
                bottomContainer = $(this).children('.ngparaphotostorybottom'),
                topContainer = $(this).children('.ngparaphotostorytop'),
                indexSpan = topContainer.children('div').children('span'),
                captionSpan = bottomContainer.children('span'),
                stage = container.children('ul'),
                lis = stage.children('li'),
                imgs = lis.children('img'),
                buttonNext = $(this).find('.ngparaphotostorynext'),
                buttonPrev = $(this).find('.ngparaphotostoryprev'),
                currentIndex = 0,
                currentTranslate = 0,
                swipeTranslate = 0,
                padding = 0,
                drag = false,
                flick = false,
                blockscroll = false,
                flicktimer,
                lastx = 0,
                totalwidth = 0,
                newx = 0;

            function isDesktop() {
                bottomContainer.height();
                return bottomContainer.css('display') === 'block';
            }

            function onSize() {
                if (isDesktop()) {
                    containerWidth = container.width();
                    containerHeight = container.height();
                    padding = Math.floor(containerWidth * 0.1);

                    totalwidth = 0;

                    for (var i = 0; i < lis.length; i++) {
                        var li = lis.eq(i),
                            img = li.children('img'),
                            imgWidth = parseInt(img.attr('width')),
                            imgHeight = parseInt(img.attr('height')),
                            imgRatio = imgWidth / imgHeight,
                            calcWidth = Math.floor(containerHeight * imgRatio);

                        if (totalwidth>0) totalwidth+=20;

                        li.css({
                            'left': totalwidth + 'px',
                            'height': containerHeight + 'px',
                            'width': calcWidth + 'px'
                        });

                        totalwidth += calcWidth;
                    }

                    stage.css({
                        'width': totalwidth + 'px',
                        'height': containerHeight + 'px'
                    });

                    setIndex(false);

                } else {
                    lis.removeAttr('style');
                    imgs.removeAttr('style');
                    stage.removeAttr('style');
                    buttonPrev.removeAttr('style');
                    buttonNext.removeAttr('style');
                }
            }

            function setIndex(animate) {
                var li = lis.eq(currentIndex),
                    img = li.children('img'),
                    span = li.children('span'),
                    left = parseInt(li.css('left').replace('px', ''));

                if (animate) {
                    stage.css({'transition': 'transform 0.5s ease'});
                    imgs.css({'transition': 'opacity 1s ease'});
                } else {
                    stage.css({'transition': 'none'});
                    imgs.css({'transition': 'none'});
                }

                currentTranslate = left - padding;
                stage.css({'transform': 'translate3d(' + (-currentTranslate) + 'px,0,0)'});

                imgs.css({'opacity': '0.3'});
                img.css({'opacity': '1'});

                buttonPrev.css({'display': (currentIndex === 0 ? 'none' : 'block')});
                buttonNext.css({'display': (currentIndex === lis.length - 1 ? 'none' : 'block')});

                indexSpan.text('(' + (currentIndex + 1) + '/' + (lis.length) + ')');
                captionSpan.text(span.text());
            }

            function onNext(e) {
                e.preventDefault();
                handleNext();
            }

            function onPrev(e) {
                e.preventDefault();
                handlePrev();
            }

            function handleStart(x) {
                drag = true;
                lastx = x;
                newx = lastx;
                swipeTranslate = currentTranslate;
                blockscroll = false;
                flick = true;

                if (flicktimer !== undefined) clearTimeout(releaseFlick);

                setTimeout(releaseFlick, 250);
            }

            function releaseFlick() {
                flick = false;
            }

            function handleEnd() {
                var bestDiff = 9999999;

                drag = false;

                if (flick && Math.abs(newx - lastx) > 50) {
                    if (newx > lastx) {
                        handlePrev();
                    } else {
                        handleNext();
                    }
                } else {
                    for (var i = 0; i < lis.length; i++) {
                        var li = lis.eq(i),
                            left = parseInt(li.css('left').replace('px', '')) - padding,
                            diff = Math.abs(swipeTranslate - left);

                        if (diff < bestDiff) {
                            bestDiff = diff;
                            currentIndex = i;
                        }
                    }
                    setIndex(true);
                }
            }

            function handleMove(x) {
                if (drag) {

                    var minTranslate = -padding,
                        maxTranslate = totalwidth - padding - lis.eq(lis.length - 1).width();

                    newx = x;

                    swipeTranslate = currentTranslate + lastx - newx;

                    if (swipeTranslate < minTranslate) swipeTranslate = minTranslate;
                    if (swipeTranslate > maxTranslate) swipeTranslate = maxTranslate;

                    stage.css({
                        'transition': 'none',
                        'transform': 'translate3d(' + (-swipeTranslate) + 'px,0,0)'
                    });

                    if (Math.abs(newx - lastx) > 50) blockscroll = true;
                }
            }

            function onTouchEnd(e) {
                if (isDesktop()) {
                    handleEnd();
                }
            }

            function onTouchMove(e) {
                if (isDesktop()) {
                    if (e.originalEvent.touches.length == 1) {
                        handleMove(e.originalEvent.touches[0].pageX);
                        if (e.cancelable) e.preventDefault();
                    }
                }
            }

            function onTouchStart(e) {
                if (isDesktop()) {
                    if (e.originalEvent.touches.length == 1) {
                        handleStart(e.originalEvent.touches[0].pageX);
                        if (navigator.userAgent.indexOf('Android 4') !== -1) e.preventDefault();
                    }
                }
            }

            function onMouseDown(e) {
                if (isDesktop()) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    handleStart(e.pageX);
                }
            }

            function onMouseMove(e) {
                if (isDesktop()) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    handleMove(e.pageX);
                }
            }

            function onMouseUp(e) {
                if (isDesktop()) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    handleEnd();
                }
            }

            function onKeyDown(e) {
                if (e.keyCode == 39) {
                    handleNext();
                }
                if (e.keyCode == 37) {
                    handlePrev();
                }
            }

            function handleNext() {
                if (currentIndex < lis.length - 1) {
                    currentIndex++;
                    setIndex(true);
                }
            }

            function handlePrev() {
                if (currentIndex > 0) {
                    currentIndex--;
                    setIndex(true);
                }
            }

            onSize();

            $(window).on('resize', onSize);
            $(window).on('keydown', onKeyDown)
            buttonNext.on('click', onNext);
            buttonPrev.on('click', onPrev);
            imgs.on('mousedown', onMouseDown);
            imgs.on('mouseup', onMouseUp);
            imgs.on('mousemove', onMouseMove);
            imgs.on('touchstart', onTouchStart);
            imgs.on('touchend', onTouchEnd);
            imgs.on('touchmove', onTouchMove);

        });
    }

})(jQuery);

$(function() {
    $('.ngparaphotostory').ngPhotostory();
});