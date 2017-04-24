$(document).ready(function(){
	//MINI SLIDER PART
	var miniItems=$('.miniSlider>div >span');
	// console.log(miniItems);
	var miniCurrentIndex=0;
	$('.miniSlider div span').eq(miniCurrentIndex).show();
	var minilength=$('.miniSlider div span').length;
	//MAIN FUNCTIONALITY OF THE CLICK
	function showCurrentItem(currentIndex){
		miniCurrentItem=$('.miniSlider>div>span').eq(miniCurrentIndex);
		miniItems.hide();
		miniCurrentItem.show();
		if(!(miniCurrentItem.hasClass('anim'))){
			miniCurrentItem.addClass('anim');
		}
	};
	$('.miniLeftBtn').on('click',function(){
		if(miniCurrentIndex<=0){
			miniCurrentIndex=minilength-1;
		}
		else{
			miniCurrentIndex-=1;
		}
		showCurrentItem(miniCurrentIndex);
	});
	$('.miniRightBtn').on('click',function(){
		if(miniCurrentIndex>=minilength-1){
			miniCurrentIndex=0;
		}
		else{
			miniCurrentIndex+=1;
		}
		showCurrentItem(miniCurrentIndex);
	});


	// PRIMARY SLIDER
	var items=$('.mainHolder div');
	console.log(items);
	var currentIndex=0;
	$('.leftBtn').on('click',function(){
		if(currentIndex<=0){
			return;
		}
		var currentItem=$('.mainHolder div').eq(currentIndex+5);
		console.log('sadsad',currentItem);
		
		// currentItem.addClass('mainAnimate');
		currentItem.hide();
		var showitem=$('.mainHolder div').eq(currentIndex-1).show();
		showitem.addClass('anim');
		console.log('sadsa1221212',showitem);

		currentIndex-=1;
	});

	$('.rightBtn').on('click',function(){
		if(currentIndex===items.length-5){
			return;
		}
		var currentItem=$('.mainHolder div').eq(currentIndex);
		console.log('sadsad',currentItem);
		currentItem.hide();
		var showitem=$('.mainHolder div').eq(currentIndex+5).show();
		showitem.addClass('anim');
		console.log('sadsa1221212',showitem);

		currentIndex+=1;

	});
	
	
	//JUST FOR THE TESTING OF ANOTHER LOGIC NOT RELATED HERE
	// var arr = [];
	// for( var i=0;i<1000000;i++){
		// arr[i]=parseInt(Math.random()*1000);
	// }
	// var t=(new Date()).getTime();
	// arr=arr.sort();
	
	
	// var realHolder=[];
	// for(var i=0;i<arr.length;i++){
		// // THIS IF CONDITION CHECKS ->IF THE CURRENT ELEMENT IS ALREADY PROCESSED IN THE GREP FUNCTION OR NOT
		// if(!(arr[i]===arr[i-1])){
			// var valueHolder=jQuery.grep(arr,function(a){
				// return a==arr[i];
			// });
			// realHolder.push(arr[i]);
			// realHolder.push(valueHolder.length);
		// }
	// }
	// console.log((new Date()).getTime()  - t);
});
