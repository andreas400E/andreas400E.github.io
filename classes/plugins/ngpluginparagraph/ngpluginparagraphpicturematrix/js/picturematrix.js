(function($) {
	$.fn.ngPictureMatrix = function() {
		this.each(function() {

			var pictures=$(this).find('li');
			var maxitems=parseInt($(this).attr('data-maxitems'));
			var links=$(this).next('ul.ngpicturematrixnav').find('a');
			
			links.click(function() {				
				var index=$(this).parent().index();
				var first = index*maxitems;
				var last = first+maxitems;

				for(var i=0;i<pictures.length;i++)
				{
					if (i>=first && i<last)
					{
						pictures.eq(i).removeClass('nghide');
					} else 
					{
						pictures.eq(i).addClass('nghide');

					}
				}

				for(var i=0;i<links.length;i++)
				{
					if (i==index)
					{
						links.eq(i).addClass('ngcurrent');
					} else 
					{
						links.eq(i).removeClass('ngcurrent');
					}
				}
				
				$(window).trigger('scroll');

				return false;

			});
			return this;
		});
	};
})(jQuery);

$(function() {
	$('ul.ngpicturematrix').ngPictureMatrix();
});
