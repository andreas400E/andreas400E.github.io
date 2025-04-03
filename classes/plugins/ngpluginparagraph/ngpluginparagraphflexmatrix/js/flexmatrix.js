(function($) {
	$.fn.ngFlexmatrix = function() {

		this.each(function() {

			var stage = $(this);
			var stageWidth = parseInt(stage.attr('data-width'));
			var stageHeight = parseInt(stage.attr('data-height'));
			var lis = stage.find('li');
			var imgs = stage.find('img');
			var ratio = stageWidth / stageHeight;

			function storeData()
			{
				lis.each(function() {
					$(this).data('left', parseInt($(this).css('left').replace('px','')));
					$(this).data('top', parseInt($(this).css('top').replace('px','')));
					$(this).data('width', parseInt($(this).css('width').replace('px','')));
					$(this).data('height', parseInt($(this).css('height').replace('px','')));
				});
				imgs.each(function() {
					$(this).data('left', parseInt($(this).css('left').replace('px','')));
					$(this).data('width', parseInt($(this).css('width').replace('px','')));
					$(this).data('height', parseInt($(this).css('height').replace('px','')));
				});
			}

			function reposition()
			{
				var width = stage.width();
				var height = width/ratio;
				var factorX = width / stageWidth;
				var factorY = height / stageHeight;

				stage.css('height',height+'px');

				lis.each(function() {
					$(this).css({
						'left' : ($(this).data('left')*factorX)+'px',
						'top' : ($(this).data('top')*factorY)+'px',
						'width' : ($(this).data('width')*factorX)+'px',
						'height' : ($(this).data('height')*factorY)+'px'
					});
				});
				imgs.each(function() {
					$(this).css({
						'left' : ($(this).data('left')*factorX)+'px',
						'width' : ($(this).data('width')*factorX)+'px',
						'height' : ($(this).data('height')*factorY)+'px'
					});
				});

			}

			if (stage.hasClass('ngflexmatrixresponsive')) {
				storeData();
				reposition();
				$(window).on('resize', reposition);
			}


			lis.hover(function() {
				$(this).find('em').animate({
					bottom: 0
				},250);
			}, function() {
				$(this).find('em').animate({
					bottom: -40
				}, 250);
			});

		});

	};
})(jQuery);


$(function() {
	$('ul.ngflexmatrix').ngFlexmatrix();
});
