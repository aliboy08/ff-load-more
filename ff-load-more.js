/*! FF Load More Plugin v.1 */
(function($){
	
	$.fn.ff_load_more = function(options){
		
		var $this = this;
		
		var settings = $.extend({
			load_on_init: 9,
			load_more: 9,
			target: '', // default to children()
			load_more_btn_text: 'Load more',
			load_more_btn_class: 'btn',
			load_more_btn_wrapper: '',
			lazyload: true,
		}, options );
		
		if( $this.data('load-on-init') ) {
			settings.load_on_init = parseInt($this.data('load-on-init'));
		}
		
		if( $this.data('load-more') ) {
			settings.load_more = parseInt($this.data('load-more'));
		}
		
		var load_more_btn = '',
			total_items,
			current_index = settings.load_on_init,
			target,
			temp_loop_limit;
		
		if( settings.target ) {
			target = $this.find(settings.target);
		} else {
			target = $this.children();
		}
		
		total_items = target.length;
		
		// hide items
		target.each(function(index){
			if( index >= settings.load_on_init) {
				var this_item = $(this);
				this_item.hide();
				
				if( settings.lazyload ) {
					var images = this_item.find('img');
					if( images.length ){
						// Have images, prevent load
						prevent_images_load(images);
					}
				}
				
			}
		});
		
		if( current_index < total_items ) {
			
			// add load more button
			load_more_btn = $('<a href="#" class="'+ settings.load_more_btn_class +'">'+ settings.load_more_btn_text +'</a>');
			$this.append(load_more_btn);
			
			// button wrapper
			if( settings.load_more_btn_wrapper ) {
				load_more_btn = load_more_btn.wrap(settings.load_more_btn_wrapper);
			}
			
			// show more items
			load_more_btn.click(function(e){
				e.preventDefault();
				
				temp_loop_limit = current_index + settings.load_more;
				
				if( settings.lazyload ) {
					
					// Lazyload
					loopLazyLoadItems();
					
				} else {
					
					// No lazyload
					for ( var i = current_index; i < temp_loop_limit; i++ ) {
						$(target[i]).fadeIn();
						current_index++;
					}
						
				}
				
				// no more items
				if( current_index >= total_items ) {
					// remove load more button
					load_more_btn.remove();
				}
				
			});
			
		}
		
		document.onreadystatechange = function(){
			if( document.readyState === 'complete' ) {
				// Document load complete
				// Load prevented images
				$(target).find('img[src=""]').each(function(){
					var this_img = $(this);
					var data_src = this_img.data('src');
					this_img.attr('src', data_src);
				})
			}
		}
		
		var loopItemCounter = 0;
		var loopLazyLoadItems = function(index) {
			
			loopItemCounter = current_index;
			var images_count = 0;
			
			var child_images = $(target[loopItemCounter]).find('img');
			if(child_images.length){
				// have images
				images_count = child_images.length;
				child_images.each(function(){
					var img_el = $(this);
					var img_el_src = img_el.data('src');
					var img = new Image();
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
						checkRecursiveFunction(loopItemCounter, temp_loop_limit - 1, loopLazyLoadItems);
					} 
				}, 100 );
				
			} else {
				// no images
				checkRecursiveFunction(loopItemCounter, temp_loop_limit - 1, loopLazyLoadItems);
			}
		}
		
		function checkRecursiveFunction(index, limit, callback){
			$(target[index]).fadeIn();
			current_index++;
			if(index < limit) {
				callback();
			} else {
				return;
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