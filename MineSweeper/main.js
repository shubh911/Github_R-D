function box(value,x,y,type='invalid'){
	// -1 MEANS MINES, 0 means blank, 1-9 means numbers, -100 means not yet checked.
	this.value = value;
	this.x = x;
	this.y = y;
	this.buttonValue = '';
	this.type = type;
	this.cssClass = '';
	this.disable = false;
}

(function(){
	'use strict'
	var app = angular.module('myApp', []);
	
	app.constant('minesCount', {inital: 0, remaining: 0});
	
	app.controller('myController', ['minesCount', 'gameFilter', '$scope','$interval', function(minesCount, gameFilter, $scope, $interval)
	{
		$scope.time = {};
		$scope.cheatcode = false;
		$scope.remainingMines = minesCount;
		$scope.time.mm =0;
		$scope.time.sec = 0;
		var userInput = {
			rows: 10,
			cols: 16,
			minesCount: 45
		};
		
		$scope.userInput = userInput;
		$scope.generatePlayArea = function(){
			var interval = $interval(function(){
			if($scope.time.sec >=59){
				
				$scope.time.mm++;
				$scope.time.sec =0;
			}
			$scope.time.sec++;
			}, 1000);
			minesCount.initial = userInput.minesCount;
			minesCount.remaining = userInput.minesCount;
			$scope.matrix = generateMatrix(userInput);
		}
		//$scope.generatePlayArea();
	}]);
	
	// PLAY AREA DIRECTIVE.
	app.directive('playArea', function()
	{
		return{
			templateUrl: 'playArea.html',
			scope: {
				matrix: '=',
				remainingMines : '='
			},
		};
	}
	)
	app.directive('registry',['minesCount', function(minesCount)
	{
		return {
			restrict: 'EA',
			scope:{
				value : '=',
				matrix: '=',
				remainingMines: '='
			},
			
			template:'{{value.buttonValue | game}}',
			link: function(scope, elem, attr){
				
				// Making sure current element is block.
				elem.css({display:'block', width: '100%', height: '100%'});
				
				// Functionality for right click.
				elem.on('contextmenu', function(e){
					e.preventDefault();
					if(scope.value.disable === true){
						return;
					}
					elem.toggleClass('mines');
					if(elem.hasClass('mines') === true){
						minesCount.remaining--;
					}else{
						minesCount.remaining++;
					}
					
					scope.value.buttonValue = scope.value.buttonValue ==='M'?'':'M';
					
					if(checkGameStatus(scope.matrix)){
						alert('You won');
						location.reload();
					}
				});
				// functionality for left click.
				elem.on('click', function(e){
					if(elem.hasClass('mines')){
						elem.toggleClass('mines');
						return;
					}
					if(scope.value.disable === true){
						console.log("disabled");
						return;
					}
					if(scope.value.type ==='bomb'){
						//Add bomb effect.
						alert('Game over');
						location.reload();
					}
					else if(scope.value.type === 'number'){
						scope.value.buttonValue = scope.value.value;
						scope.value.disable = true;
						scope.value.cssClass = 'buttonsdisabled';
						elem.addClass('buttonsdisabled');
						elem.attr('disabled', 'true');
					}
					else if(scope.value.type === 'blank'){
						checkForAdjacentElement(scope.value, scope.matrix);
					}
					if(checkGameStatus(scope.matrix)){
						alert('You won');
						location.reload();
					}				
				});
			}
		}
	}]);
	
	// filter to hide M and B values.
	app.filter('game', function()
	{
		return function(data){
			if(data === 'M' || data === 'B'){
				return '';
			}
			return data;
		}
	}
	)
})();


// LOGIC FOR GAME.
function generateMatrix(userInput){
	var mat = [];
	for(let i =0; i < userInput.rows; i++){
		mat[i] = [];
		for(let j = 0; j < userInput.cols; j++){
			mat[i][j] = new box(-100,i,j,'invalid');
		}
	}
	putMines(userInput, mat);
	generateNumbers(userInput, mat);
	return mat;
}

//put mines in argument.
function putMines(userInput, mat){
	for( let i = 0; i < userInput.minesCount;){
		let x = Math.floor(Math.random() * userInput.rows);
		let y = Math.floor(Math.random() * userInput.cols);
		if(mat[x][y].type ==='invalid'){
			mat[x][y].value = -1;	
			mat[x][y].type = 'MINE';					
			i++;
		}
	}
}

// genearteNumbers.
function generateNumbers(userInput, mat){
	for(let i = 0; i < mat.length; i++){
		for(let j =0; j< mat[i].length;j++){
			if(mat[i][j].value === -1){
				// its mine increment neighbours by 1.
				try{
					try{
						if(mat[i-1][j-1].value !== -1){
							if(mat[i-1][j-1].value === -100){
								mat[i-1][j-1].value = 1;
							}
							else{
								mat[i-1][j-1].value++;
							}
								
						}
					}catch(e){}
					try{
						if(mat[i-1][j].value !== -1){
							if(mat[i-1][j].value === -100){
								mat[i-1][j].value = 1;
							}
							else{
								mat[i-1][j].value++;
							}
								
						}
					}catch(e){}
					try{
						if(mat[i-1][j+1].value !== -1){
							if(mat[i-1][j+1].value === -100){
								mat[i-1][j+1].value = 1;
							}
							else{
								mat[i-1][j+1].value++;
							}
								
						}
							// top right.
					}catch(e){}
					try{
						if(mat[i][j-1].value !== -1){
							if(mat[i][j-1].value === -100){
								mat[i][j-1].value = 1;
							}
							else{
								mat[i][j-1].value++;
							}
								
						}
						// center left.
					}catch(e){}
					try{
						if(mat[i][j+1].value !== -1){
							if(mat[i][j+1].value === -100){
								mat[i][j+1].value = 1;
							}
							else{
								mat[i][j+1].value++;
							}
								
						}
						// center right.
					}catch(e){}
					try{
						if(mat[i+1][j-1].value !== -1){
							if(mat[i+1][j-1].value === -100){
								mat[i+1][j-1].value = 1;
							}
							else{
								mat[i+1][j-1].value++;
							}
								
						}
					// bottom left.
					}catch(e){}
					try{
						if(mat[i+1][j].value !== -1){
							if(mat[i+1][j].value === -100){
								mat[i+1][j].value = 1;
							}
							else{
								mat[i+1][j].value++;
							}
								
						}
						// bottom center.
					}catch(e){}
					try{
						if(mat[i+1][j+1].value !== -1){
							if(mat[i+1][j+1].value === -100){
								mat[i+1][j+1].value = 1;
							}
							else{
								mat[i+1][j+1].value++;
							}
								
						}
					}catch(e){}
				}catch(e){}
				
				
			}
		}
	}
	// all -100 are blanks now.
	for(let i = 0; i < mat.length; i++){
		for(let j =0; j< mat[i].length;j++){
			if(mat[i][j].value === -100){
				mat[i][j].value = 0;
				mat[i][j].type = 'blank';
			}
			else if (mat[i][j].value === -1){
				mat[i][j].type = 'bomb';
			}
			else{
				mat[i][j].type = 'number';
			}
				
		}
	}
}

// check for neigbouring emty blocks and numbered blocks.
function checkForAdjacentElement(box, mat){	
	if(box.value === 0 && box.buttonValue !== 'B'){
		box.buttonValue = 'B';
		
		box.cssClass = 'blank';
		box.disable = true;
		try{
			
				checkForAdjacentElement(mat[box.x + 1][box.y],mat);
		}catch(e){}
		try{
				checkForAdjacentElement(mat[box.x][box.y + 1],mat);
		}catch(e){}
		try{
				checkForAdjacentElement(mat[box.x -1][box.y],mat);
		}catch(e){}
		try{
				checkForAdjacentElement(mat[box.x][box.y - 1],mat);
		}catch(e){}
		try{
				checkForAdjacentElement(mat[box.x + 1][box.y +1],mat);
		}catch(e){}
		try{
				checkForAdjacentElement(mat[box.x -1][box.y -1],mat);
		}catch(e){}
		try{
				checkForAdjacentElement(mat[box.x +1][box.y -1],mat);
		}catch(e){}
		try{
				checkForAdjacentElement(mat[box.x - 1][box.y + 1],mat);
		}catch(e){}
		
	}
	else if(box.value !== 0 && box.value !==-1){
		box.buttonValue = box.value;
		box.cssClass = 'buttonsdisabled';
		box.disable = true;
	}
	else{
		return;
	}
}

function checkGameStatus(mat){
	for(let i = 0; i < mat.length; i++){
		for(let j =0; j < mat[i].length;j++){
			if(mat[i][j].buttonValue === ''){
				return false;
			}
			else if (mat[i][j].buttonValue === 'M'){
				if(mat[i][j].value !== -1){
					return false;
				}
			}
		}
	}
	return true;
}