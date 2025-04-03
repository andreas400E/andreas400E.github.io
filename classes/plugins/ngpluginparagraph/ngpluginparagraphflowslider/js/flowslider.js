(function($) {
    'use strict';
    $.fn.ngFlowslider = function() {
        $(this).each(function() {
            var container = $(this),
                current = 0,
                previous = 0,
                directcontainer = $(this).find('.ngparaflowsliderdirect'),
                imgs = $(this).find('.ngparaflowslidercontainer>img'),
                containers = $(this).find('.ngparaflowslidercontainer'),
                next = $(this).find('.ngparaflowslidernext'),
                prev = $(this).find('.ngparaflowsliderprev'),
                direct,
                autoProgresstimer,
                autoProgress = parseInt(container.attr('data-autoprogress'), 10),
                scaleMode = container.attr('data-scalemode'),
                heightpercent = parseFloat(container.attr('data-height'))/100,
                ratio = parseFloat( imgs.eq(0).attr('width')) / parseFloat( imgs.eq(0).attr('height'));

            imgs.each(function() {
                $(this).data({
                    'width': $(this).attr('width'),
                    'height': $(this).attr('height')
                });

                var span = $('<span>').text($(this).attr('title'));

                $(this).after(span);

            });

            function isiPhone() {
                return ((navigator.platform.indexOf("iPhone") != -1));
            }

            function setContainers() {
                var i;

                for (i = 0; i < containers.length; i++) {
                    var transition = 'none';
                    var zindex = '0';
                    var transform = 'translate3d(0,0,0)';
                    var display = 'none';
                    var spantransform = 'translate3d(-100px,0,0)';

                    if (i == current) {
                        zindex = '1';
                        if (!isiPhone()) {
                            transition = 'transform 0.75s ease-in-out';
                        }
                        display = 'block';
                        spantransform = 'translate3d(0,0,0)';
                    }
                    if (i == previous) {
                        zindex = '2';
                        transition = 'transform 1s ease-in-out';
                        display = 'block';
                    }
                    if (i < current) {
                        transform = 'translate3d(-100%,0,0)';
                    }
                    if (i > current) {
                        transform = 'translate3d(100%,0,0)';
                    }

                    containers.eq(i).css({
                        'transition': transition,
                        'display': display
                    });
                    containers.eq(i).offset();
                    containers.eq(i).css({
                        'z-index': zindex,
                        'transform': transform
                    });
                    containers.eq(i).find('span').css({
                        'transform': spantransform
                    });
                }

                if (current === 0) {
                    prev.hide();
                } else {
                    prev.show();
                }

                if (current < containers.length - 1) {
                    next.show();
                } else {
                    next.hide();
                }

                direct.removeClass('ngparaflowsliderdirectcurrent').eq(current).addClass('ngparaflowsliderdirectcurrent');

                if (autoProgress > 0) {

                    direct.eq(current).find('div').css({
                        'transition': 'none',
                        'background-position': '-40px 0'
                    });
                    direct.eq(current).find('div').offset();
                    direct.eq(current).find('div').css({
                        'transition': 'background-position ' + autoProgress + 's linear',
                        'background-position': '0 0'
                    });

                    if (autoProgresstimer !== undefined) {
                        window.clearTimeout(autoProgresstimer);
                        autoProgresstimer = undefined;
                    }

                    autoProgresstimer = window.setTimeout(handleProgress, autoProgress * 1000);
                }

                previous = current;
            }

            function handleProgress() {
                current++;
                if (current >= containers.length) current = 0;
                setContainers();
            }

            function size() {

                if (scaleMode === 'fill') {
                    container.css('height', Math.round(window.innerHeight * heightpercent) + 'px');
                }

                if (scaleMode === 'fixed') {
                    container.css('height', Math.round(container.width() / ratio) + 'px');
                }


                var stageWidth = container.innerWidth();
                var stageHeight = container.innerHeight();

                var fontsize = Math.ceil(stageWidth / 20);

                if (fontsize > 48) fontsize = 48;
                if (fontsize < 20) fontsize = 20;

                container.find('span').css({
                    'font-size': fontsize + 'px',
                    'top': fontsize * 2 + 'px',
                    'left': fontsize * 2 + 'px'
                });


                imgs.each(function() {
                    var imgWidth = parseFloat($(this).data('width'));
                    var imgHeight = parseFloat($(this).data('height'));
                    var ratio = imgWidth / imgHeight;

                    var width = stageWidth;
                    var height = width / ratio;

                    if (height < stageHeight) {
                        height = stageHeight;
                        width = height * ratio;
                    }

                    var top = (stageHeight - height) / 3;
                    var left = (stageWidth - width) / 2;

                    $(this).css({
                        'width': Math.floor(width) + 'px',
                        'height': Math.floor(height) + 'px',
                        'left': Math.floor(left) + 'px',
                        'top': Math.floor(top) + 'px'
                    });
                });
            }

            function handleNext(e) {
                e.preventDefault();
                current++;
                setContainers();
            }

            function handlePrev(e) {
                e.preventDefault();
                current--;
                setContainers();
            }

            function handleDirect(e) {
                e.preventDefault();
                /*jshint validthis:true */
                current = $(this).index();
                setContainers();
            }

            function createDirect() {
                var i;

                for (i = 0; i < containers.length; i++) {
                    if (i === 0) {
                        directcontainer.append('<a href="" title="'+imgs.eq(i).attr('title')+'" class="ngparaflowsliderdirectcurrent"><div></div></a>');
                    } else {
                        directcontainer.append('<a href="" title="'+imgs.eq(i).attr('title')+'"><div></div></a>');
                    }
                }

                directcontainer.css({
                    'width': containers.length * 50 + 'px',
                    'margin-left': containers.length * -25 + 'px'
                });

                direct = directcontainer.find('a');
            }

            createDirect();

            size();

            setContainers();

            $(window).on('resize', size);
            next.on('click', handleNext);
            prev.on('click', handlePrev);
            direct.on('click', handleDirect);


        });
    };
})(jQuery);

$(function() {
    $('.ngparaflowsliderstage').ngFlowslider();
});
