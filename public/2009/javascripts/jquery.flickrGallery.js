/*
 * jQuery FlickrGallery - jQuery plug-in
 * Version 1.0.1, Released 
 *
 * Copyright (c) 2008 Steven Dugas
 * This work is licensed under a Creative Commons Attribution 3.0 Unported License.
 */
(function($) {
$.fn.flickrGallery = function(options) {

  var defaults = {
		galleryHeight : 'auto',  			// either [string] 'auto' or [integer]. If [integer] gallery will have a strict height to that number.
		userFlickr : 'false',  				// [string], 'true' or 'false'. Determines if gallery is local or flickr based.
		useFlickrLargeSize: 'false', 		// [string], 'true' or 'false'. Determines whether gallery is Large or Small.
		flickrAPIKey: '',   				// [string], required for Flickr gallery.
		photosetID: '',    					// [string], required for Flickr gallery.
		per_page: 30,       				// [integer], amount of thumbnails per 'page'.
		useHoverIntent: 'false',			// [string], 'true' or 'false'. Uses HoverIntent plugin for better Hovers.
		useLightBox: 'false'				// [string], 'true' or 'false. Uses jQuery Lightbox plugin for Small Images
  };
  var options = $.extend(defaults, options);
 	//options.galleryHeight = 'auto';
  return this.each(function() {
	obj = $(this);

	// Massive function to create the Image Gallery and register all event handlers. Must be a function to recreate gallery on Next/Prev Page.
	function makeGallery(){
		
		// Create Variables
		var flickrLargeImg;
		var theCaption;
		var container;
		var stepCount;
		var count = 1;
		var totalImageCount = 0;
		var currentImageCount = 1;	
		thumbs = obj.find('ul');
		thumbs.addClass('galleryUL');
		
		// If useFlickr is true, create Flickr-only buttons.
		if ( options.useFlickr == 'true' ) {
			obj.prepend('<div class="largeImageWrap"><div class="largeImage_nextPage"></div><div class="largeImage_prevPage"></div><a href="" class="largeImage_flickrLink" target="_blank"><span>Flickr</span></a><div class="largeImage_prev"><span>Prev</span></div><div class="largeImage_next"><span>Next</span></div><div class="largeImage"></div><div class="caption"></div></div>');
		} else {
			obj.prepend('<div class="largeImageWrap"><div class="largeImage_prev"><span>Prev</span></div><div class="largeImage_next"><span>Next</span></div><div class="largeImage"></div><div class="caption"></div></div>');
		};
		
		var largeImageWrap = obj.find('.largeImageWrap');
		var nextPage = obj.find('.largeImage_nextPage');
		var prevPage = obj.find('.largeImage_prevPage');
		var nextImg = obj.find('.largeImage_next');
		var prevImg = obj.find('.largeImage_prev');
		var largeImageFlickrLink = obj.find('.largeImage_flickrLink');
		var largeImage = obj.find('.largeImage');
		var imgCaption = obj.find('.caption');

		
		
		// Determine if gallery is fixed or auto height. If Fixed, set height.
		if ( options.galleryHeight != 'auto' ) {
			var theHeight = parseFloat(options.galleryHeight);
			largeImageWrap.animate({ height: theHeight+'px' }, 600)	;
		}
		
		// If Flickr Gallery is on, disable links in Thumbnails.
		if ( options.useFlickr == 'true' ) {
			thumbs.children().click(function(){
				return false;
			});
		};
	
		// Add unique IDs to each thumbnail image

		thumbs.wrap('<div class="sliderGallery"></div>');		
		var sliderGallery = obj.find('.sliderGallery');
		sliderGallery.wrap('<div class="sliderGallery_Wrap"></div>');
		var sliderGalleryWrap = obj.find('.sliderGallery_Wrap');
		sliderGallery.append('<div class="slider"><div class="handle"></div></div>');
		var theSlider = obj.find('.slider');
		var theHandle = obj.find('.handle');
		count = 1;
		totalImageCount = 0;
		currentImageCount = 1;
		obj.find('.galleryUL img').each(function(){
			var IESRC = $(this).attr('src');
			$(this).attr('src',IESRC);
			$(this).attr('id','galleryThumb_'+count);
			count++;
			totalImageCount++;
		});

		// Function for clicking Next Page. This is a Flickr-only function.
		nextPage.click(function(){
			currentPage = parseFloat($(obj).find('input:eq(0)').val());
			totalPages = parseFloat($(obj).find('input:eq(1)').val());
			nextPage = currentPage + 1;
			if ( nextPage > totalPages ) {
				nextPage = 1;
			};
			$(theSlider, container).slider("destroy");
			sliderGalleryWrap.hide();
			$(obj).children().slideUp();
			obj.slideUp('slow',function(){
				obj.empty();
				obj.flickr({     
					api_key: options.flickrAPIKey,     
					type: 'photoset',
					photoset_id: options.photosetID,
					thumb_size: 'm',
					per_page: options.per_page,
					page: nextPage,
					callback: function(){ 
						makeGallery();
					}
				});	
				obj.slideDown();
			});
		});
		
		// Function for clicking Previous Page. This is a Flickr function.
		prevPage.click(function(){
			currentPage = parseFloat($(obj).find('input:eq(0)').val());
			totalPages = parseFloat($(obj).find('input:eq(1)').val());
			prevPage = currentPage - 1;
			if ( prevPage == 0 ) {
				prevPage = totalPages;
			};
			$(theSlider, container).slider("destroy");
			sliderGalleryWrap.hide();
			$(obj).children().slideUp();
			obj.slideUp('slow',function(){
				obj.empty();
				obj.flickr({     
					api_key: options.flickrAPIKey,     
					type: 'photoset',
					photoset_id: options.photosetID,
					thumb_size: 'm',
					per_page: options.per_page,
					page: prevPage,
					callback: function(){ 
						makeGallery();
					}
				});	
				obj.slideDown();
			});
		});
		
		// calcHeight function, used to process image changing on next, prev or click.

		function calcHeight() {				
			largeImage.fadeOut(function(){
				function doHeight(){
					largeImage.fadeIn(function(){ 
						var imgHeight = largeImage.find('img').height();
						var captionHeight = imgCaption.height();
						largeImage.find('img').css({
							position: '',
							visibility: 'visible',
							display: 'none'
						});
						if ( options.galleryHeight == 'auto' ) {
							largeImageWrap.animate({
								height: imgHeight+captionHeight+'px'
							}, function(){ largeImage.find('img').fadeIn(); imgCaption.fadeIn(); });
						} else {
							largeImage.find('img').fadeIn(); 
							imgCaption.fadeIn();
						};
						
					});
					slideValue = currentImageCount-1;
					slideValue = slideValue * stepCount;
					$(theSlider, container).slider("moveTo",slideValue);
				};
				$(this).find('img').remove();
				imgCaption.empty();
				var i = new Image();
				if ( options.useFlickr == 'true' ) {
					 if ( options.useFlickrLargeSize == 'true') {
						flickrLargeImg = thumbs.find('#galleryThumb_'+currentImageCount).parent().attr('href');
						flickrLink = thumbs.find('#galleryThumb_'+currentImageCount).parent().attr('title')
						theCaption = thumbs.find('#galleryThumb_'+currentImageCount).attr('alt');
						i.onload = doHeight;
						i.src = flickrLargeImg;
						largeImage.append(i);
					 } else {
						flickrLink = thumbs.find('#galleryThumb_'+currentImageCount).parent().attr('title');
						theCaption = thumbs.find('#galleryThumb_'+currentImageCount).attr('alt');
						i.onload = doHeight;
						i.src = thumbs.find('#galleryThumb_'+currentImageCount).attr('src');
						largeImage.append(i);
						flickrLargeImg = thumbs.find('#galleryThumb_'+currentImageCount).parent().attr('href');
						if ( options.useLightBox == 'true') {
							largeImage.find('img').wrap('<a href="'+flickrLargeImg+'" title="'+theCaption+'"></a>');
							largeImage.find('a').lightBox();
						};
					 }
					largeImageFlickrLink.attr('href',flickrLink);
					largeImage.find('img').addClass(''+currentImageCount+'');
				} else { 
					thumbs.find('#galleryThumb_'+currentImageCount).clone().css('opacity',1).appendTo(largeImage);
					theCaption = thumbs.find('#galleryThumb_'+currentImageCount).attr('title');
					doHeight();
				};	
				imgCaption.append(theCaption).hide();
				largeImage.find('img').css({
					position: 'absolute',
					visibility: 'hidden',
					display: 'block'
				}).addClass(''+currentImageCount+'').attr('title',theCaption);
			});	
		};
		


		// Create the slider
		obj.find('div.sliderGallery').each(function(){
			container = $(this);
			var ul = thumbs;
			var itemsWidth = ul.innerWidth() - container.outerWidth();	
			var totalCount = totalImageCount;
			totalCount = parseFloat(totalCount-1);
			stepCount = itemsWidth/totalCount;
			var division = itemsWidth / totalCount;
			var theValue = 0;
			$(theSlider, container).slider({
				min: 0,
				max: itemsWidth,
				handle: theHandle,
				steps:totalCount,
				stop: function (event, ui) {
					ul.animate({'left' : ui.value * -1}, 500);
					theValue = ui.value;
				},
				slide: function (event, ui) {
					ul.css('left', ui.value * -1);
				}
			});
			obj.find('.galleryUL img').click(function(){
				var clickThumb = $(this);
				var startCount = 0;
				var theCaption = $(this).attr('title');
				currentImageCount = $(this).attr('id');
				currentImageCount = parseFloat(currentImageCount.split("_",2)[1]);
				calcHeight();
			});
		});
		// End of SlideBar
	

		//  Fade in the first image with caption 
		function startHeight() {	
			imgCaption.append(theCaption).hide();
			largeImage.find('img').css({
				position: '',
				visibility: 'visible',
				display: 'none'
			});
			largeImage.find('img').addClass(''+currentImageCount+'').attr('title',theCaption);
			largeImage.show(function(){ 
				imgHeight = largeImage.find('img').height();
				captionHeight = imgCaption.height();
				if ( options.galleryHeight == 'auto' ) {
					largeImageWrap.animate({
						height: imgHeight+captionHeight+'px'
					},'slow','swing', 
					function(){ 	
						largeImage.css({ visibility: 'visible' });
						imgCaption.fadeIn();
						largeImage.find('img').fadeIn(300, function(){ 
							sliderGallery.hide().wrapInner('<div id="sliderGalleryInnerWrap"></div>');
							var sliderGalleryInnerWrap = obj.find('#sliderGalleryInnerWrap');
							sliderGalleryInnerWrap.hide();
							sliderGalleryWrap.show();
							sliderGallery.slideDown('slow', function(){ 
							sliderGalleryInnerWrap.fadeIn();
							});
						}); 
					});
				} else {
					largeImage.css({ visibility: 'visible' });
					largeImage.find('img').fadeIn('slow', function(){ 
							sliderGallery.hide().wrapInner('<div id="sliderGalleryInnerWrap"></div>');
							var sliderGalleryInnerWrap = obj.find('#sliderGalleryInnerWrap');
							sliderGalleryInnerWrap.hide();
							sliderGalleryWrap.show();
							sliderGallery.slideDown('slow', function(){ 
								sliderGalleryInnerWrap.fadeIn('slow');
							});
						});  
					imgCaption.fadeIn('slow');
				};
			});
		};
		sliderGalleryWrap.hide();
		largeImage.hide().css({visibility: 'hidden'});
		var i = new Image();
		if ( options.useFlickr == 'true' ) {
			 if ( options.useFlickrLargeSize == 'true') {
				flickrLargeImg = thumbs.find('#galleryThumb_'+currentImageCount).parent().attr('href');
				flickrLink = thumbs.find('#galleryThumb_'+currentImageCount).parent().attr('title')
				theCaption = thumbs.find('#galleryThumb_'+currentImageCount).attr('alt');
				i.onload = startHeight;
				i.src = flickrLargeImg;
				largeImage.append(i);
			 } else {
				flickrLargeImg = thumbs.find('#galleryThumb_'+currentImageCount).parent().attr('href');
				flickrLink = thumbs.find('#galleryThumb_'+currentImageCount).parent().attr('title')
				thumbs.find('#galleryThumb_'+currentImageCount).clone().appendTo(largeImage);
				theCaption = thumbs.find('#galleryThumb_'+currentImageCount).attr('alt');
				if ( options.useLightBox == 'true') {
					largeImage.find('img').wrap('<a href="'+flickrLargeImg+'" title="'+theCaption+'"></a>');
					largeImage.find('a').lightBox();
				}
				startHeight();
			 }
			largeImageFlickrLink.attr('href',flickrLink);
			largeImage.find('img').addClass(''+currentImageCount+'');
		} else { 
			thumbs.find('#galleryThumb_'+currentImageCount).clone().appendTo(largeImage);
			theCaption = thumbs.find('#galleryThumb_'+currentImageCount).attr('title');
			startHeight();
		};							
		// Function to fadeIn or fadeOut Next/Prev buttons on hover.
		if ( options.useHoverIntent == 'false' ) {
			largeImageWrap.hover(function(){
				prevImg.fadeIn();
				nextImg.fadeIn();
				largeImageFlickrLink.fadeIn();
				nextPage.fadeIn();
				prevPage.fadeIn();
			},function(){
				obj.find('.largeImage_prev').fadeOut();
				obj.find('.largeImage_next').fadeOut();
				obj.find('.largeImage_flickrLink').fadeOut();
				obj.find('.largeImage_prevPage').fadeOut();
				obj.find('.largeImage_nextPage').fadeOut();
			});
			$(thumbs).children().find('img').hover(function(){
				$(this).animate({ opacity: 1 }, 300);
			},function(){
				$(this).animate({ opacity: .7 }, 300);		
			});
		} else {
			function hoverOn() {
				prevImg.fadeIn();
				nextImg.fadeIn();
				largeImageFlickrLink.fadeIn();
				nextPage.fadeIn();
				prevPage.fadeIn();	
			};
			function hoverOff() {
				obj.find('.largeImage_prev').fadeOut();
				obj.find('.largeImage_next').fadeOut();
				obj.find('.largeImage_flickrLink').fadeOut();
				obj.find('.largeImage_prevPage').fadeOut();
				obj.find('.largeImage_nextPage').fadeOut();
			};
			var config = {    
				 sensitivity: 3, // number = sensitivity threshold (must be 1 or higher)    
				 interval: 50, // number = milliseconds for onMouseOver polling interval    
				 over: hoverOn, // function = onMouseOver callback (REQUIRED)    
				 timeout: 200, // number = milliseconds delay before onMouseOut    
				 out: hoverOff // function = onMouseOut callback (REQUIRED)    
			};
			largeImageWrap.hoverIntent(config);
			function thumbHoverOn() {
				$(this).animate({ opacity: 1 }, 300);
			};
			function thumbHoverOff() {
				$(this).animate({ opacity: .7 }, 300);
			};
			var config2 = {    
				 sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)    
				 interval: 25, // number = milliseconds for onMouseOver polling interval    
				 over: thumbHoverOn, // function = onMouseOver callback (REQUIRED)    
				 timeout: 50, // number = milliseconds delay before onMouseOut    
				 out: thumbHoverOff // function = onMouseOut callback (REQUIRED)    
			};
			$(thumbs).children().find('img').hoverIntent(config2);
		};
		// Change the opacity when hovering over thumbnails	
		// Function for Previous button onclick
		prevImg.click(function(){
			var theSRC = largeImage.find('img').attr('src');
			currentImageCount = largeImage.find('img').attr('class');
			var newSRC = "";
			var newImage = "";
			var fixIE = "";
			var prevImageCount = currentImageCount - 1;
			if ( prevImageCount < 1 ) {
				currentImageCount = totalImageCount;
			} else {
			 currentImageCount = prevImageCount;	
			};
			newSRC = thumbs.find('#galleryThumb_'+currentImageCount).attr('src');
			newImage = thumbs.find('#galleryThumb_'+currentImageCount).clone().css('opacity',1).addClass(''+currentImageCount+'');
			calcHeight();
		});
		
		// Function for Next button onclick
		nextImg.click(function(){
			var theSRC = largeImage.find('img').attr('src');
			currentImageCount = largeImage.find('img').attr('class');
			currentImageCount = parseFloat(currentImageCount);
			var newSRC = "";
			var theCaption = "";
			var newImage = "";
			var nextImageCount = currentImageCount + 1;
			if ( nextImageCount > totalImageCount ) {
				currentImageCount = 1;
			} else {
				currentImageCount = nextImageCount;	
			};
			newSRC = thumbs.find('#galleryThumb_'+currentImageCount).attr('src');
			newImage = thumbs.find('#galleryThumb_'+currentImageCount).clone().css('opacity',1).addClass(''+currentImageCount+'');
			calcHeight();
		});
	};
	
	// Finally, if useFlickr is true, download images and create UL structure before creating Gallery. Else, just create Gallery.
	if ( options.useFlickr == 'true' ) {
		obj.flickr({     
			api_key: options.flickrAPIKey,     
			type: 'photoset',
			photoset_id: options.photosetID,
			thumb_size: 'm',
			per_page: options.per_page,
			page: 1,
			callback: function(){ 
				makeGallery();
			}
		});	
	}else {
	makeGallery();	
	};
  });
 };
})(jQuery);