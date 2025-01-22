// @codekit-prepend "/vendor/TweenLite.min.js";
// @codekit-prepend "/vendor/TimelineLite.min.js";
// @codekit-prepend "/vendor/CSSPlugin.min.js";
// @codekit-prepend "/vendor/CSSRulePlugin.min.js";
// @codekit-prepend "/vendor/ScrollToPlugin.min.js";
// @codekit-prepend "/vendor/jquery.gsap.min.js";
// @codekit-prepend "/vendor/ScrollMagic.min.js";
// @codekit-prepend "/vendor/animation.gsap.min.js";
// @codekit-prepend "/vendor/jquery.ScrollMagic.min.js";

$(document).ready(function() {
	
	/***************** Splashscreen ******************/
	
	$(window).load(function() {
		
		$('.splashscreen').addClass('splashscreen--is-hidden');
		
		setTimeout(function() {
			$('.splashscreen').css( {'display': 'none'} );
			
			/* Introduction Animation */
			var $name = $('.introduction__content-el--name'),
	  			$job = $('.introduction__content-el--job');
			TweenLite.to([$name, $job], 0.8, {x: 0, opacity: 1, ease: Power1.easeOut});
		}, 800);
		
	});
	
	/***************** Responsive Nav ******************/

  $('.navigation__burger').click(function() {
	  
	  navigationToggle();
	  
  });
  
  function navigationToggle() {
	  
	  $('.navigation__burger').toggleClass('navigation__burger--is-open');
	  $('.navigation__container').toggleClass('navigation__container--is-open');
	  $('html, body').toggleClass('scroll-lock');
	  
  }
  
  /***************** Smooth Scroll ******************/
  
  $('a[href*="#"]:not([href="#0"])').click(function(ev) {
	  
	  ev.preventDefault();
		
		if ($('.navigation__container').hasClass('navigation__container--is-open')) {
			navigationToggle();
		}
			
		var target = $(this).attr('href');
		
		TweenLite.to(window, 1, {scrollTo: target});
		
	});
	
	/***************** Animations ******************/
	
	/* Restrict to large devices */
	if ($(window).width() > 991) {  
	
	  var controller = new ScrollMagic.Controller();
	
	  /* About */
	  var $aboutTrigger = $('.about'),
	  		$aboutBlurb = $('.about__content-blurb'),
	  		$aboutVisual = $('.about__visual'),
	  		$aboutSignature = $('.about__content-signature'),
	  		$aboutFrame = CSSRulePlugin.getRule('.about__wrapper:before'),
	  		aboutTl = new TimelineLite();
	  		
	  aboutTl
	  	.from($aboutBlurb, 0.8, {x: 50, opacity: 0, ease: Power1.easeOut})
	  	.from($aboutVisual, 0.8, {x: -50, opacity: 0, ease: Power1.easeOut}, 0)
	  	.from($aboutFrame, 0.8, {cssRule:{opacity: 0}, ease: Power1.easeOut})
	  	.from($aboutSignature, 0.8, {opacity: 0}, '-=0.4');
	  	
	  var aboutScene = new ScrollMagic.Scene({
		  triggerElement: $aboutTrigger,
		  reverse: false
	  })
	  	.setTween(aboutTl)
	  	.addTo(controller);
	  
	  /* Fix for about__visual positioning due to
		 * JS tweening overwriting CSS translateX
		 * value when loaded on a larger display
		 * that is then resized below 991
		 * (e.g. landscape => portrait) */
	  $(window).resize(function() {
		  
		  if ($(window).width() <= 991) {
			  $('.about__visual').css({ 'transform': 'translateX(-50%)' });
		  }
		  else {
			  $('.about__visual').css({ 'transform': 'translateX(0)' });
		  }
		  
	  });
	  	
	  /* App Design */
	  var $appDesignTrigger = $('.app-design'),
	  		$appDesignVisual = $('.app-design__visual');
	  	
	  var appDesignScene = new ScrollMagic.Scene({
		  triggerElement: $appDesignTrigger,
		  reverse: false
	  })
	  	.setTween(TweenLite.from($appDesignVisual, 0.8, {x: 100, opacity: 0, ease: Power1.easeOut}))
	  	.addTo(controller);
	  	
	  /* Web Design */
	  var $webDesignTrigger = $('.web-design'),
	  		$webDesignVisual = $('.web-design__visual');
	  	
	  var webDesignScene = new ScrollMagic.Scene({
		  triggerElement: $webDesignTrigger,
		  reverse: false
	  })
	  	.setTween(TweenLite.from($webDesignVisual, 0.8, {x: -100, opacity: 0, ease: Power1.easeOut}))
	  	.addTo(controller);
	  	
	  /* Work */
	  var $workTrigger = $('.work'),
	  		$workContent = $('.work__content'),
	  		$workVisual = $('.work__visual'),
	  		$workFrame = CSSRulePlugin.getRule('.work__list:before'),
	  		workTl = new TimelineLite();
	  		
	  workTl
	  	.set($workVisual, {scale: 1})
	  	.from($workContent, 0.8, {x: -50, opacity: 0, ease: Power1.easeOut})
	  	.from($workVisual, 0.8, {x: 50, opacity: 0, ease: Power1.easeOut}, 0)
	  	.from($workFrame, 0.8, {cssRule:{opacity: 0}, ease: Power1.easeOut});
	  	
	  var workScene = new ScrollMagic.Scene({
		  triggerElement: $workTrigger,
		  offset: 60,
		  reverse: false
	  })
	  	.setTween(workTl)
	  	.addTo(controller);
	  	
	  /* Blog */
	  var $blogTrigger = $('.blog'),
	  		$blogPost = $('.blog__post'),
	  		$blogButton = $('.blog__view-more--el'),
	  		blogTl = new TimelineLite();
	  		
	  blogTl
	  	.staggerFrom($blogPost, 0.8, {opacity: 0, ease: Power1.easeOut}, 0.4)
	  	.from($blogButton, 0.8, {opacity: 0, ease: Power1.easeOut}, '-=0.2');
	  	
	  var blogScene = new ScrollMagic.Scene({
		  triggerElement: $blogTrigger,
		  reverse: false
	  })
	  	.setTween(blogTl)
	  	.addTo(controller);
	  	
	  /* Contact */
	  var $contactTrigger = $('.contact'),
	  		$contactForm = $('.contact__form'),
	  		$contactVisual = $('.contact__visual'),
	  		$contactFrame = CSSRulePlugin.getRule('.contact__wrapper:before'),
	  		contactTl = new TimelineLite();
	  		
	  contactTl
	  	.from($contactForm, 0.8, {x: 50, opacity: 0, ease: Power1.easeOut})
	  	.from($contactVisual, 0.8, {x: -50, opacity: 0, ease: Power1.easeOut}, 0)
	  	.from($contactFrame, 0.8, {cssRule:{opacity: 0}, ease: Power1.easeOut});
	  	
	  var contactScene = new ScrollMagic.Scene({
		  triggerElement: $contactTrigger,
		  reverse: false
	  })
	  	.setTween(contactTl)
	  	.addTo(controller);
	  	
	}
  
  /***************** Work Carousel ******************/
  
  $('.work__navigation-el').click(function() {
	  
	  var $this = $(this),
	  		position = $this.parent().children().index($this);
	  		
	  $this.parent().children().removeClass('work__navigation-el--is-active');
	  $this.addClass('work__navigation-el--is-active');
	  $('.work__list').children().removeClass('work__list-el--is-active');
	  $('.work__list').children().eq(position).addClass('work__list-el--is-active');
	  
  });

});
