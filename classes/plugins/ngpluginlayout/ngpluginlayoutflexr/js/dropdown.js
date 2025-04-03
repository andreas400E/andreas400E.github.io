(function ($) {
    'use strict';

    $.fn.sqrNav = function () {
        $(this).each(function () {

            let nav = $(this),
                fixed = false,
                hidden = false,
                lastScrollTop = $(document).scrollTop(),
                container = $('#navcontainer'),
                containerheight = container.height(),
                hideTimeout = undefined,
                showNav = nav.find('.sqrnavshow'),
                hideNav = nav.find('.sqrnavhide'),
                allItems = nav.find('li:has(ul)'),
                placeholder = $('#navplaceholder'),
                lastitem,
                doubleClickTimeout,
                navIsOpen = false,
                doubleclick = false;


            function handleClick(e) {

                if (lastitem === this && doubleclick) return;

                if (doubleClickTimeout !== undefined) window.clearTimeout(doubleClickTimeout);

                doubleclick = true;

                doubleClickTimeout = window.setTimeout(() => {
                    doubleclick = false;
                }, 1000);

                if ($(this).parent().hasClass('sqrnavopen')) {
                    $(this).parent('li').removeClass('sqrnavopen');
                } else {
                    lastitem = this;
                    allItems.removeClass('sqrnavopen');
                    $(this).parents('li').addClass('sqrnavopen');
                    $(this).parent('li').find('input').focus();
                }

                e.preventDefault();
                e.stopPropagation();
            }

            function isMobile() {
                return nav.children('div').css('display') !== 'none';
            }

            function handleClose(e) {
                if (!isMobile()) {
                    if ($(e.target).parents('#nav').length === 0) {
                        allItems.removeClass('sqrnavopen');
                        nav.removeClass('sqrnavopen');
                        lastitem = undefined;
                        doubleclick = false;
                        if (doubleClickTimeout !== undefined) window.clearTimeout(doubleClickTimeout);
                    }
                }
            }

            function handleShowNav(e) {
                nav.addClass('sqrnavopen');
                navIsOpen = true;
                e.preventDefault();
            }

            function handleHideNav(e) {
                nav.removeClass('sqrnavopen');
                navIsOpen = false;
                e.preventDefault();
            }

            function handleScroll() {
                if (navIsOpen) return;

                let top = placeholder.offset().top,
                    scrollTop = $(document).scrollTop();

                if (top - scrollTop > 0) {
                    if (fixed) {
                        $('html').removeClass('flexrfixed');
                        fixed = false;
                    }
                } else {
                    if (!fixed) {
                        $('html').addClass('flexrfixed');
                        fixed = true;
                    }
                    if (scrollTop < lastScrollTop || scrollTop - top < containerheight) {
                        if (hidden) {
                            if (hideTimeout !== undefined) clearTimeout(hideTimeout);
                            container.removeClass('flexrhidden');
                            hideTimeout = undefined;
                            hidden = false;
                        }
                    } else {
                        if (!hidden && !allItems.hasClass('sqrnavopen')) {
                            if (hideTimeout !== undefined) clearTimeout(hideTimeout);
                            hideTimeout = setTimeout(() => {
                                container.addClass('flexrhidden');
                                hideTimeout = undefined;
                            }, 1000);
                            hidden = true;
                        }
                    }
                    lastScrollTop = scrollTop;
                }
            }

            nav.find('li.active').parents('li').addClass('active');
            allItems.addClass('sqrnavmore').children('a').on('click', handleClick);
            showNav.on('click', handleShowNav);
            hideNav.on('click', handleHideNav);
            $(document).on('click touchstart', handleClose);

            if (placeholder.length > 0) {
                $(document).on('scroll', handleScroll);
                handleScroll();
            }
        });
    };

    $.fn.sqrSuggest = function () {
        $(this).each(function () {
            let that = $(this),
                inputcriteria = that.find('input'),
                searchform = that.find('form'),
                restsuggest = searchform.attr('data-rest'),
                previewmode = searchform.attr('data-previewmode')==='true',
                maxbooster = parseInt(searchform.attr('data-maxbooster')),
                criteria = '',
                activesuggestion = -1,
                allsuggestions = [];

            function hideSuggest() {
                that.children('li:not(:first)').remove();
            }

            function handleSuggestKeyUp(e) {
                switch (e.keyCode) {
                    case 40:
                    case 38:
                        e.preventDefault();
                        return;
                    case 13:
                    case 27:
                        return;
                }

                activesuggestion = -1;
                criteria = inputcriteria.val();

                if (criteria !== '') {
                    $.ajax({
                        url: restsuggest,
                        data: {
                            criteria: criteria,
                            previewmode: previewmode,
                            maxbooster: maxbooster
                        },
                        dataType: 'json',
                        type: 'GET',
                        success: handleSuggestSuccess
                    });
                } else {
                    hideSuggest();
                }
            }

            function setActiveSuggestion() {
                for (let i = 0; i < allsuggestions.length; i++) {
                    if (activesuggestion === i) {
                        allsuggestions.eq(i).addClass('sqrnavsuggest');
                        if (allsuggestions.eq(i).children('a').attr('href') === '#') inputcriteria.val(allsuggestions.eq(i).children('a').text());
                    } else {
                        allsuggestions.eq(i).removeClass('sqrnavsuggest');
                    }
                }
            }

            function handleSuggestKeyDown(e) {
                switch (e.keyCode) {
                    case 40:
                        if (activesuggestion < allsuggestions.length - 1) {
                            activesuggestion++;
                            setActiveSuggestion();
                        }
                        e.preventDefault();
                        break;
                    case 38:
                        if (activesuggestion > 0) {
                            activesuggestion--;
                            setActiveSuggestion();
                        }
                        e.preventDefault();
                        break;
                    case 27:
                        hideSuggest();
                        e.preventDefault();
                        break;
                    case 13:
                        if (activesuggestion >= 0 && allsuggestions.eq(activesuggestion).children('a').attr('href') !== '#') {
                            e.preventDefault();
                            window.location.href = allsuggestions.eq(activesuggestion).children('a').attr('href');
                        } else {
                            hideSuggest();
                        }
                        break;
                }
            }

            function handleSuggestSuccess(data) {
                if (data.result.criteria === criteria) {
                    hideSuggest();
                    const svg = '<svg width="24" height="24" viewBox="0 0 24.00 24.00"><path fill="currentColor" d="M 7.69406,19.1143L 12.9996,16.518L 16.3059,19.149L 15.1779,14.2281L 18.9702,10.9477L 13.9819,10.5032L 11.9996,5.85588L 10.0174,10.4691L 5.02835,10.913L 8.82133,14.2281L 7.69406,19.1143 Z M 4.58452,23.4019L 6.54272,14.9696L -3.2472e-005,9.29913L 8.63243,8.55028L 11.9996,0.598557L 15.3661,8.55028L 24,9.29913L 17.4565,14.9696L 19.4147,23.4019L 11.9996,18.9281L 4.58452,23.4019 Z "/></svg>';
                    for (let i = 0; i < data.result.booster.length; i++) {
                        that.append($('<li>').append($('<a>').attr('href', data.result.booster[i].url).append(svg).append($('<span>').css('font-weight', 'bold').text(data.result.booster[i].caption))));
                    }
                    for (let i = 0; i < data.result.items.length; i++) {
                        that.append($('<li>').append($('<a>').attr('href', '#').on('click', handleSuggestClick).append('<span>').append($('<b>').text(data.result.items[i].substring(0, criteria.length))).append(data.result.items[i].substring(criteria.length))));
                    }
                    allsuggestions = that.children('li:not(:first)');
                }
            }

            function handleSuggestClick(e) {
                e.preventDefault();
                criteria = $(this).text()
                inputcriteria.val(criteria);
                hideSuggest();
                searchform.submit();
            }

            if (restsuggest !== undefined) {
                inputcriteria.on('keyup', handleSuggestKeyUp);
                inputcriteria.on('keydown', handleSuggestKeyDown);
            }

        });
    }

})(jQuery);

$(function () {
    $('#nav').sqrNav();
    $('.sqrnavsearch>ul').sqrSuggest();
});