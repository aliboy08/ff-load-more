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
		}, options );
		
		if( $this.data('load-on-init') ) {
			settings.load_on_init = parseInt($this.data('load-on-init'));
		}
		
		if( $this.data('load-more') ) {
			settings.load_more = parseInt($this.data('load-more'));
		}
		
		var i,
			load_more_btn = '',
			total_items,
			current_index = 0,
			target;
		
		if( settings.target ) {
			target = $this.find(settings.target);
		} else {
			target = $this.children();
		}
		
		total_items = target.length;
		
		// hide items initially
		target.hide();
		
		// show initial items
		for ( i = current_index; i < settings.load_on_init; i++ ) {
			$(target[i]).fadeIn();
		}
		current_index = i;

		if( i < total_items ) {
			
			load_more_btn = $('<a href="#" class="'+ settings.load_more_btn_class +'">'+ settings.load_more_btn_text +'</a>');
			
			$this.append(load_more_btn);
			
			// button wrapper
			if( settings.load_more_btn_wrapper ) {
				load_more_btn = load_more_btn.wrap(settings.load_more_btn_wrapper);
			}
			
			// show more items
			load_more_btn.click(function(e){
				e.preventDefault();
				for ( i = current_index; i < current_index + settings.load_more; i++ ) {
					$(target[i]).fadeIn();
				}
				current_index = i;
				
				// no more items
				if( i >= total_items ) {
					// remove load more button
					load_more_btn.remove();
				}
			});
			
		}
		
		return this;
	}
	
})(jQuery)