$(document).ready(function() {
	$("#contactform").submit(function(e) {
		e.preventDefault();
	    var form = $(this);
	    var url = form.attr("action");
	    $("#submit").html('Please wait... <span class="fas fa-circle-notch fa-spin"></span>');
	    setTimeout(
			  function() 
			  {
				$.ajax({          
			        	type: "post",
			        	url: url,
			        	data: form.serialize(),
			        	dataType: "json",
			        	cache: false,
			        	success: function(data){
			        		if(data.status == 'ok'){
						        $("#submit").html('Submit <span class="fa-solid fa-angle-right"></span>');
						    	alert(data.msg);
						        form.trigger("reset");
						    }else{
						    	$("#submit").html('Submit <span class="fa-solid fa-angle-right"></span>');
						    	alert(data.msg);
						    	grecaptcha.reset();
						    }
			        	}
				});
			}, 2000);
	});
});