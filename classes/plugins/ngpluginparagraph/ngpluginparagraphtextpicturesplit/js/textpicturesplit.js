(function($) {
    $.fn.sqpTextPictureSplit = function() {
        $(this).each(function() {
            var container = $(this),
                textcontainer = container.children('.ngparatextpicturesplittext'),
                text = textcontainer.children('div'),
                picturecontainer = container.children('.ngparatextpicturesplitpicture'),
                picture = picturecontainer.find('img'),
                heightmode = container.attr('data-heightmode'),
                parallax = parseInt(container.attr('data-parallax')),
                maxOffset = 0,
                fade = true,
                pictureRatio = parseFloat(picture.attr('width')) / parseFloat(picture.attr('height'));

            function placePicture() {
                if (picture.css('position') === 'absolute') {
                    var width = picturecontainer.width(),
                        pictureHeight = Math.floor(width / pictureRatio),
                        height = Math.floor(pictureHeight * (1 - parallax / 100)),
                        textHeight = Math.ceil(text.outerHeight());

                    if (height < textHeight) {
                        height = textHeight;
                        pictureHeight = Math.floor(height * (1 + parallax / 100));
                        width = Math.floor(height * pictureRatio);
                    }

                    if (heightmode === 'window' && height < $(window).height()) {
                        height = $(window).height();
                        pictureHeight = Math.floor(height * (1 + parallax / 100));
                        width = Math.floor(height * pictureRatio);
                    }

                    picturecontainer.css({
                        'height': height + 'px'
                    });
                    textcontainer.css({
                        'height': height + 'px'
                    });

                    var pictureWidth = Math.ceil(pictureHeight * pictureRatio),
                        pictureLeft = Math.floor((picturecontainer.width() - pictureWidth) / 2);

                    picture.css({
                        'height': pictureHeight + 'px',
                        'width': pictureWidth + 'px',
                        'left': pictureLeft + 'px'
                    });

                    maxOffset = pictureHeight - height;
                } else {
                    picturecontainer.css({
                        'height': 'inherit'
                    });
                    textcontainer.css({
                        'height': 'inherit'
                    });
                    picture.css({
                        'height': 'auto',
                        'width': '100%'
                    });
                    maxOffset = 0;
                }
            }

            function setPictureOffset() {

                var containerTop = picturecontainer.offset().top,
                    containerHeight = picturecontainer.height(),
                    windowheight = $(window).height(),
                    scrolltop = $(window).scrollTop();

                if (parallax > 0) {
                    var top = scrolltop + windowheight - containerTop,
                        range = windowheight + containerHeight,
                        offset = -Math.floor((1 - (top / range)) * maxOffset);
                    picture.css('transform', 'translateY(' + offset + 'px)');
                }

                if (fade) {
                    if (containerTop + containerHeight / 3 < scrolltop + windowheight) {
                        container.addClass('ngparatextpicturesplitfxshow');
                        fade = false;
                    }
                }
            }

            placePicture();
            placePicture();
            setPictureOffset();

            $(window).on('resize', function() {
                placePicture();
                placePicture();
                setPictureOffset();
            });

            $(window).on('scroll', setPictureOffset);
        });
    };
})(jQuery);

$(function() {
    $('.ngparatextpicturesplit').sqpTextPictureSplit();
});
