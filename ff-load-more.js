/*! FF Load More Plugin v2.0 */
(function($){
	
	$.fn.ff_load_more = function(options){
		
		var $this = $(this);
		
		var settings = $.extend({
			load_on_init: 9,
			load_more: 9,
			target: '', // default to children()
			load_more_btn_text: 'Load more',
			load_more_btn_class: 'btn',
			load_more_btn_wrapper: '',
			lazyload: true,
			
			append_delay: 0,
			fade_speed: 400,
			slide_down_speed: 400,
			height_animation_speed: 250,
		}, options );
		
		var $container = $this;
		
		if( $this.data('load-on-init') ) {
			settings.load_on_init = parseInt($this.data('load-on-init'));
		}
		
		if( $this.data('load-more') ) {
			settings.load_more = parseInt($this.data('load-more'));
		}
		
		var $load_more_btn = $('<a href="#" class="'+ settings.load_more_btn_class +'">'+ settings.load_more_btn_text +'</a>'),
			 initial_btn_text = $load_more_btn.text(),
			 current_index = 0,
			 lazyload_index = 0,
			 target,
			 temp_loop_limit;
			 
		if( settings.target ) {
			target = $this.find(settings.target);
		} else {
			target = $this.children();
		}
		
		var total_items = target.length;
		
		var temp_items = [];
		
		function init(){
			// Hide initial items
			target.each(function(index){
				var this_item = $(this);
				if( index >= settings.load_on_init) {
					this_item.hide().css({'opacity': 0});
					if( settings.lazyload ) {
						var images = this_item.find('img');
						if( images.length ){
							// Prevent images from loading, for lazyloading
							prevent_images_load(images);
						}
					}
				}
			});
			
			// Show initial items
			$load_more_btn.text('loading').addClass('loading');
			showItems(settings.load_on_init);
		}
		
		init();
		
		if( current_index < total_items ) {
			// add load more button 
			$container.append($load_more_btn);
			// button wrapper
			if( settings.load_more_btn_wrapper ) {
				$load_more_btn = $load_more_btn.wrap(settings.load_more_btn_wrapper);
			}
			// Load more click
			$load_more_btn.click(function(e){
				e.preventDefault();
				if( $(this).hasClass('loading') ) return;
				loadMore(settings.load_more);
			});
		}
		
		function loadMore(limit){
			
			$load_more_btn.text('loading').addClass('loading');
			
			temp_loop_limit = current_index + limit;
			
			if( settings.lazyload ) {
				// Lazyload
				loopLazyLoadItems();
			} else {
				// No lazyload
				showItems(temp_loop_limit);
			}
			
			if( current_index >= total_items ) {
				// No more items
				$load_more_btn.remove();
			}
		}
		
		function showItems(limit){
			
			var $item,
				 isLastItem = false;
				 
			var j = current_index;
			for(var i = current_index; i < limit; ++i) {
				$item = $(target[i]);
				$item
					.slideDown(settings.slide_down_speed)
					.delay(i*settings.append_delay)
					.animate({'opacity': 1}, settings.fade_speed, function(){
						j++;
						// use j counter for the animate delay
						if( j === limit ) {
							isLastItem = true;
						}
						if(isLastItem) {
							// Last item, finish set
							current_index = j;
							lazyload_index = j;
							updateContainerHeight();
							$load_more_btn.text(initial_btn_text).removeClass('loading');
						}
					});
			}
		}
		
		var loopLazyLoadItems = function() {
			
			var images_count = 0;
			
			var child_images = $(target[lazyload_index]).find('img');
			if(child_images.length){
				
				// have images
				images_count = child_images.length;
				child_images.each(function(){
					
					var img_el = $(this);
					var img_el_src = img_el.data('src');
					var img = new Image();
					// load image
					img.src = img_el_src;
					img.onload = function() {
						// single image load complete
						img_el.attr('src', img_el_src);
						images_count--;
					}
				});
				
				// Watch images loaded
				var timer = setInterval(function(){
					if( images_count == 0 ) {
						// All images loaded on current item
						clearInterval(timer); // stop watch
						checkRecursiveFunction(lazyload_index, temp_loop_limit, loopLazyLoadItems);
					} 
				}, 100 );
				
			} else {
				// no images
				checkRecursiveFunction(lazyload_index, temp_loop_limit, loopLazyLoadItems);
			}
			
		}
		
		function checkRecursiveFunction(index, limit, callback){
			lazyload_index++;
			if (index == limit) {
				// Finish preloading images for set of items
				showItems(index);
				return;
			}
			if(index < limit) {
				// loop through same function
				callback();
			} else {
				return;
			}
		}
		
		// Adjust container when showing new items
		function updateContainerHeight(){
			var origH = $container.height();
			$container.height('auto');
			var newH = $container.height();
			if( newH < origH ) {
				$container.height(origH);
				if( settings.slide_down_speed === 0 ) {
					$container.height('auto');
				} else {
					$container.animate({'height': newH}, settings.height_animation_speed, function(){
						$container.height('auto');
					});
				}
			}
		}
		
		document.onreadystatechange = function(){
			if( document.readyState === 'complete' ) {
				// Document load complete
				// Load prevented images
				$(target).find('img[src=""]').each(function(){
					var this_img = $(this);
					var data_src = this_img.data('src');
					var img = new Image();
					// load image
					img.src = data_src;
					img.onload = function() {
						// load complete
						this_img.attr('src', data_src);
					}
				})
			}
		}
		
		function prevent_images_load(images){
			// Dont load images
			images.each(function(){
				var img_src = $(this).attr('src');
				$(this).attr('data-src', img_src);
				$(this).attr('src', '');
			});
		}
		
		return this;
	}
	
})(jQuery)