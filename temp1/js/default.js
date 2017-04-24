$(document).ready(function(){
	$('#nav-icon1').click(function(){
		$(this).toggleClass('open');
		// FOR HAMBURGER MENU
	
		if($('.lowerNav').hasClass('hiding')){
			$( ".lowerNav,.upperNav" ).slideUp( "slow", function(){
				// Animation complete.Nothing to do here.
			});
		}
		else{
			$( ".lowerNav,.upperNav" ).slideDown( "slow", function() {
				// Animation complete.Nothing to do here.
				});
			}
		$('.lowerNav').toggleClass('hiding');
		$('.upperNav').toggleClass('hiding');
		
	});
});