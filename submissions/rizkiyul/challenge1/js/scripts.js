jQuery(document).ready(function($) {


	//JQUERY
	$(window).scroll(function(){
		if($(this).scrollTop() >= 100){
			$('header').addClass('fixed');
		}else{
			$('header').removeClass('fixed');
		}
	});


	//NAV
	var lastId,
	topMenu = $("#headnav"),
	topMenuHeight = topMenu.outerHeight()+135,
	// All list items
	menuItems = topMenu.find("a"),
	// Anchors corresponding to menu items
	scrollItems = menuItems.map(function(){
	  var item = $($(this).attr("href"));
	  if (item.length) { return item; }
	});

	// Bind click handler to menu items
	// so we can get a fancy scroll animation
	menuItems.click(function(e){
	  var href = $(this).attr("href"), 
	      offsetTop = href === "#" ? 0 : $(href).offset().top-120;
	  $('html, body').stop().animate({ 
	      scrollTop: offsetTop
	  }, 1200);
	  e.preventDefault();
	});

	// Bind to scroll
	$(window).scroll(function(){
	   // Get container scroll position
	   var fromTop = $(this).scrollTop()+topMenuHeight+200;
	   
	   // Get id of current scroll item
	   var cur = scrollItems.map(function(){
	     if ($(this).offset().top < fromTop)
	       return this;
	   });
	   // Get the id of the current element
	   cur = cur[cur.length-1];
	   var id = cur && cur.length ? cur[0].id : "";
	   
	   if (lastId !== id) {
	       lastId = id;
	       // Set/remove active class
	       menuItems
	         .parent().removeClass("active")
	         .end().filter("[href='#"+id+"']").parent().addClass("active");
	   }                   
	});
	$(".showmenu").click(function() {
		$("nav").fadeIn();
		$(this).next(".hidemenu").show();
		$('body').addClass('disablescroll');
	});                               
	$(".hidemenu").click(function() {
		$("nav").fadeOut();
		$(this).hide();
		$(this).prev(".showmenu").show();
		$('body').removeClass('disablescroll');
	});
	var viewportWidth = $(window).width();
    if (viewportWidth < 1200) {
    	$("nav a").click(function() {
			$(this).parents("nav").fadeOut();
			$(".hidemenu").hide();
			$('body').removeClass('disablescroll');
		});
    }
});