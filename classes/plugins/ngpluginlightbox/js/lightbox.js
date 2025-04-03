(function ($) {
    "use strict";

    var fader,
        current,
        lightbox,
        lightboxImage,
        lightboxElement,
        lightboxCaption,
        lightboxIframe,
        closer,
        closerIframe,
        lightboxmode,
        elementWidth,
        elementHeight,
        autoplay,
        audio,
        lightboxTitle = '',
        nextitem,
        previtem,
        lightboxPopup,
        alllinksingroup;

    function prepare() {
        if (fader === undefined) {
            fader = $('<div class="fader"></div>');
            lightbox = $('<div class="lightbox"></div>');
            lightboxPopup = $('<div class="lightboxpopup"></div>');
            $("body").append(fader);
            $("body").append(lightbox);
            $("body").append(lightboxPopup);
            fader.click(hideLightBox);
        }

        nextitem = undefined;
        previtem = undefined;

    }

    $.fn.ngGallery = function () {
        $(this).click(function (e) {
            if ($(this).data('nolightbox') === true) return false;
            if ($(this).attr('href') === '') return false;
            prepare();

            e.preventDefault();

            lightboxImage = $('<img />');
            lightboxCaption = $('<em></em>');
            lightboxTitle = $(this).attr('title');
            closer = $('<div class="closer"></div>');

            lightboxmode = 'img';
            fadeInFader();
            lightbox.children().remove();

            lightbox.append(lightboxImage);

            lightboxCaption.html(lightboxTitle);
            lightbox.append(lightboxCaption);

            lightbox.append(closer);

            var group = $(this).attr('data-nggroup');

            if (group !== undefined) {
                alllinksingroup = $('a[data-nggroup="' + group + '"]');
                if (alllinksingroup.length > 1) {
                    nextitem = $('<div class="nextitem"></div>');
                    previtem = $('<div class="previtem"></div>');
                    lightbox.append(nextitem);
                    lightbox.append(previtem);
                    nextitem.on('mousedown', showNextItem);
                    previtem.on('mousedown', showPrevItem);
                }
                current = alllinksingroup.index($(this));
            }


            lightboxImage.click(hideLightBox);
            closer.click(hideLightBox);


            $(window).on('keydown', handleKeyboard);
            $(window).on('resize', positionLightBox);

            var image = new Image();
            $(image).on('load', function () {
                lightboxImage.attr('src', image.src);
                lightboxImage.data('width', image.width);
                lightboxImage.data('height', image.height);
                positionLightBox();
                lightbox.css({
                    'transition': 'none',
                    'opacity': 0,
                    'transform': 'scale(0.9)',
                    'display': 'block'
                });
                lightbox.height();
                lightbox.css({
                    'transition': 'opacity 0.2s, transform 0.2s',
                    'opacity': 1,
                    'transform': 'none'
                });
            });

            image.src = $(this).attr('href');
        });
    };

    $.fn.ngGalleryIframe = function () {
        $(this).click(function (e) {
            e.preventDefault();

            if ($(this).data('nolightbox') === true) return false;
            prepare();

            lightboxIframe = $('<iframe frameborder="0"></iframe>');
            closerIframe = $('<div class="closeriframe"></div>');

            lightboxmode = 'iframe';
            fadeInFader();
            lightboxIframe.attr('src', $(this).attr('href'));

            var width = $(this).attr('data-width');
            if (width === undefined) width = '900';
            var height = $(this).attr('data-height');
            if (height === undefined) height = '700';

            lightboxIframe.data('width', width);
            lightboxIframe.data('height', height);
            lightbox.children().remove();
            lightbox.append(lightboxIframe);
            lightbox.append(closerIframe);
            closerIframe.click(hideLightBox);

            positionLightBox();

            $(window).on('keydown', handleKeyboard);
            $(window).on('resize', positionLightBox);


        });
    };

    $.fn.ngGalleryElement = function () {
        $(this).click(function (e) {
            e.preventDefault();
            if ($(this).data('nolightbox') === true) return false;
            prepare();

            lightboxmode = 'element';
            fadeInFader();
            lightboxElement = $(this).attr('data-element');
            elementWidth = parseInt($(this).attr('data-width'));
            elementHeight = parseInt($(this).attr('data-height'));
            autoplay = ($(this).attr('data-autoplay') == 'on');
            closer = $('<div class="closer"></div>');
            closer.click(hideLightBox);

            var mp3 = $(this).attr('data-mp3'),
                ogg = $(this).attr('data-ogg');

            if (mp3 !== undefined || ogg !== undefined) {
                audio = $('<audio>').appendTo($("body")).css('display', 'none');

                if (mp3 !== undefined) $('<source>').attr({'src': mp3, 'type': 'audio/mpeg'}).appendTo(audio);
                if (ogg !== undefined) $('<source>').attr({'src': ogg, 'type': 'audio/ogg'}).appendTo(audio);

                audio[0].play();

            }

            lightbox.children().remove();
            lightbox.html(lightboxElement);
            lightbox.append(closer);
            positionLightBox();

            lightbox.children().first().focus();

            $(window).on('keydown', handleKeyboard);
            $(window).on('resize', positionLightBox);
        });
    };

    function showNextItem(e) {
        if (e !== undefined) e.preventDefault();
        current++;
        if (current > alllinksingroup.length - 1) current = 0;
        showItem(alllinksingroup[current], 20);
    }

    function showPrevItem(e) {
        if (e !== undefined) e.preventDefault();
        current--;
        if (current < 0) current = alllinksingroup.length - 1;
        showItem(alllinksingroup[current], -20);
    }


    function showItem(link, shift) {
        var image = new Image();
        $(image).on('load', function () {
            lightboxImage.attr('src', image.src);
            lightboxImage.data('width', image.width);
            lightboxImage.data('height', image.height);
            lightbox.css({
                'transition': 'none',
                'opacity': 0,
                'transform': 'translateX(' + shift + 'px)'
            });

            lightboxTitle = $(link).attr('title');
            if ((lightboxTitle !== undefined) && (lightboxTitle !== '')) {
                lightboxCaption.html(lightboxTitle);
            } else {
                lightboxCaption.html('');
            }


            positionLightBox();
            lightbox.height();
            lightbox.css({
                'transition': 'opacity 0.4s, transform 0.4s',
                'opacity': 1,
                'transform': 'none'
            });
            lightboxCaption.css({
                'transition': 'opacity 0.2s',
                'opacity': 1,
                'display': 'block'
            });
        });

        image.src = link.href;


    }

    function handleKeyboard(e) {
        if (e.keyCode === 27 || e.keyCode === 13) {
            e.preventDefault();
            hideLightBox();
        }


        if (nextitem !== undefined) {
            if (e.keyCode === 39) {
                showNextItem();
            }
            if (e.keyCode === 37) {
                showPrevItem();
            }
        }
    }

    function positionLightBox() {
        switch (lightboxmode) {
            case 'img':
                positionLightBoxImage();
                break;
            case 'iframe':
                positionLightBoxIFrame();
                break;
            case 'element':
                positionLightBoxElement();
                break;
        }
    }

    function positionLightBoxImage() {

        var lbWidth = $(lightboxImage).data('width'),
            lbHeight = $(lightboxImage).data('height'),
            lbRatio = lbWidth / lbHeight,
            offset = 16;

        if (lightboxTitle !== undefined && lightboxTitle !== '') offset = 46;

        if (lbWidth > $(window).width() - 64) {
            lbWidth = Math.floor($(window).width() - 64);
            lbHeight = Math.floor(lbWidth / lbRatio);
        }
        if (lbHeight > $(window).height() - 96) {
            lbHeight = Math.floor($(window).height() - 96);
            lbWidth = Math.floor(lbHeight * lbRatio);
        }

        var lbLeft = Math.floor(($(window).width() - lbWidth - 16) / 2),
            lbTop = Math.floor(($(window).height() - lbHeight - offset) / 2);

        lightbox.css({
            'width': lbWidth + 16,
            'height': lbHeight + offset,
            'left': lbLeft,
            'top': lbTop
        });
        lightboxImage.css({
            'width': lbWidth,
            'height': lbHeight
        });

        if (nextitem !== undefined) {
            var half = Math.floor(lbWidth / 2);
            nextitem.css('width', half);
            previtem.css('width', half);
        }
    }

    function positionLightBoxElement() {
        var lbRatio = elementWidth / elementHeight,
            lbWidth = Math.floor($(window).width() - 128),
            lbHeight = Math.floor(lbWidth / lbRatio);

        if (lbHeight > $(window).height() - 128) {
            lbHeight = Math.floor($(window).height() - 128);
            lbWidth = Math.floor(lbHeight * lbRatio);
        }

        var lbLeft = Math.floor(($(window).width() - lbWidth) / 2),
            lbTop = Math.floor(($(window).height() - lbHeight) / 2);

        lightbox.css({
            'width': lbWidth,
            'height': lbHeight,
            'left': lbLeft,
            'top': lbTop
        });
        lightbox.children().eq(0).attr({
            width: lbWidth,
            height: lbHeight
        });
        lightbox.css('opacity','1').show();
    }

    function positionLightBoxIFrame() {
        var lbWidth = lightboxIframe.data('width'),
            lbHeight = lightboxIframe.data('height');


        if (lbWidth > $(window).width() - 68) {
            lbWidth = Math.floor($(window).width() - 68);
        }
        if (lbHeight > $(window).height() - 68) {
            lbHeight = Math.floor($(window).height() - 68);
        }

        var lbLeft = Math.floor(($(window).width() - lbWidth) / 2),
            lbTop = Math.floor(($(window).height() - lbHeight) / 2);

        lightbox.css({
            'width': lbWidth,
            'height': lbHeight,
            'left': lbLeft,
            'top': lbTop
        });

        lightboxIframe.css({
            'width': lbWidth,
            'height': lbHeight
        });


        lightbox.css('opacity','1').show();
    }

    function hideLightBox() {
        switch (lightboxmode) {
            case 'img':
                fadeOutLightbox();
                fadeOutFader();
                break;
            case 'iframe':
                lightbox.hide();
                fader.hide();
                lightbox.children().remove();
                break;
            case 'element':
                lightbox.hide();
                fader.hide();
                lightbox.children().remove();
                if (audio !== undefined) audio.remove();
                break;
            case 'popup':
                lightboxPopup.hide();
                fader.hide();
                lightboxPopup.children().remove();
                break;
        }

        $(window).off('keydown', handleKeyboard);
        $(window).off('resize', positionLightBox);

        return false;
    }

    function fadeInFader() {
        fader.css({
            display: 'block',
            opacity: 0,
            transition: 'none'
        });
        fader.height();
        fader.css({
            transition: 'opacity 0.3s',
            opacity: 0.8
        });
    }


    function fadeOutFader() {
        fader.css({
            transition: 'opacity 0.3s',
            opacity: 0
        });
        setTimeout(function () {
            fader.css({
                display: 'none'
            });
        }, 300);
    }

    function fadeOutLightbox() {
        lightbox.css({
            'transition': 'opacity 0.2s, transform 0.2s',
            'opacity': 0,
            'transform': 'scale(0.9)'
        });
        setTimeout(function () {
            lightbox.css({
                display: 'none',
                transform: 'none'
            });
        }, 300);
    }

    $.fn.ngHandleScrollUp = function () {
        $(this).click(function (e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        });
    };


    $.fn.ngPopup = function (params) {
        prepare();

        var container = $('<div>'),
            callback = params.callback;

        if (params.picture !== undefined && params.picture !== '') {
            var pictureImg = $('<img>');
            pictureImg.attr({src: params.picture, alt: '', role: 'presentation'});
            container.append(pictureImg);
            container.addClass('lightboxpopupwithpicture');
        } else if (params.icon) {
            var svg = $('<svg width="48" height="48" viewBox="0 0 48.00 48.00" enable-background="new 0 0 48.00 48.00"><path fill="currentColor" d="M 40.8,1.99993L 7.19999,1.99993C 4.8795,1.99993 3.02098,3.96894 3.02098,6.39993L 2.99999,45.9999L 11.4,37.1999L 40.8,37.1999C 43.1205,37.1999 45,35.2309 45,32.7999L 45,6.39993C 45,3.96894 43.1205,1.99993 40.8,1.99993 Z M 26.1,28.3999L 21.9,28.3999L 21.9,23.9999L 26.1,23.9999L 26.1,28.3999 Z M 26.1,19.5999L 21.9,19.5999L 21.9,10.7999L 26.1,10.7999L 26.1,19.5999 Z "/></svg>');
            container.append(svg);
            container.addClass('lightboxpopupwithicon');

        }

        if (params.message !== undefined) {
            var messageDiv = $('<div>');
            messageDiv.addClass('lightboxpopupmessage');
            messageDiv.html(params.message);
            container.append(messageDiv);

            if (params.trace !== undefined) {
                var tracePre = $('<pre>');
                tracePre.text(params.trace);
                messageDiv.append(tracePre);
            }
        }


        var panel = $('<div>');

        panel.addClass('lightboxpopupbuttons').attr('tabindex', '-1');

        if (params.accept !== undefined) {
            var closerbutton = $('<button>');

            closerbutton.text(params.accept);
            closerbutton.on('click', function () {
                if (params.callback !== undefined) params.callback();
                $(window).off('keydown', handleKeyboardPopup);
                hideLightBox();
            });

            panel.append(closerbutton);
        }

        if (params.buttons !== undefined) {
            for (var i = 0; i < params.buttons.length; i++) {
                var link = $('<a>');
                link.text(params.buttons[i].caption);
                link.attr('href', params.buttons[i].url);
                panel.append(link);
            }
        }

        container.append(panel);
        lightboxPopup.empty();
        lightboxPopup.append(container);

        fadeInFader();

        lightboxmode = 'popup';

        lightboxPopup.css({
            'transform': 'translate3d(0,-20px,0)',
            'display': 'block'
        });
        lightboxPopup.height();
        lightboxPopup.css({
            'transform': 'translate3d(0,0,0)',
        });

        panel.focus();


        function handleKeyboardPopup(e) {
            if (e.keyCode === 27) {
                e.preventDefault();
                hideLightBox();
                $(window).off('keydown', handleKeyboardPopup);
                if (callback != null) callback();
            }

        }

        $(window).on('keydown', handleKeyboardPopup);

        return false;
    };

    $.fn.ngLinkPreview = function () {
        let previewDiv;
        $(this).each(function () {
            let that = $(this),
                html = that.attr('data-linkpreview'),
                src = that.attr('data-linkpreviewimg'),
                alt = that.attr('data-linkpreviewimgalt');

            function placePreview() {

                let left = that.offset().left + that.width() / 2 - 160,
                    top = that.offset().top - previewDiv.outerHeight() - 10;

                if (left < 10) left = 10;
                if (left > $(document).width() - previewDiv.outerWidth() - 10) left = $(document).width() - previewDiv.outerWidth() - 10;

                if (top > 10) {
                    previewDiv.removeClass('sqrlinkpreviewbottom').addClass('sqrlinkpreviewtop');
                } else {
                    top = that.offset().top + that.outerHeight() + 10;
                    previewDiv.removeClass('sqrlinkpreviewtop').addClass('sqrlinkpreviewbottom');
                }

                previewDiv.css({
                    'left': left + 'px',
                    'top': top + 'px'
                })

                previewDiv.css({
                    'transition': 'opacity 0.3s',
                    'opacity': '1'
                });
            }

            function handleMouseOver(e) {
                if (previewDiv === undefined) {
                    previewDiv = $('<div>').addClass('sqrlinkpreview');
                    $("body").append(previewDiv);
                }

                previewDiv.css({
                    'opacity': '0',
                    'transition': 'opacity 0s',
                    'display': 'block'
                }).html(html);

                if (src !== undefined) {
                    let image = new Image();
                    $(image).on('load', function () {
                        $('<img>').attr({
                            'src': src,
                            'alt': alt
                        }).prependTo(previewDiv);
                        previewDiv.height();
                        placePreview();
                    });
                    image.src = src;
                } else {
                    placePreview();
                }
            }

            function handleMouseOut(e) {
                previewDiv.css('display', 'none');
            }

            that.on('mouseover focus', handleMouseOver);
            that.on('mouseout blur', handleMouseOut);


        });
    }

})(jQuery);

$(function () {
    $('a.gallery').ngGallery();
    $('a.galleryiframe').ngGalleryIframe();
    $('a.galleryelement').ngGalleryElement();
    $('a[href="#filltop"]').ngHandleScrollUp();
    $('a[data-linkpreview]').ngLinkPreview();
});
