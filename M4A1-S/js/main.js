var app = angular.module('m4A1', []);
app.directive('playBoard',['$interval','$window', function($interval, $window)
{
	return{
		templateUrl: 'playBoard.html',
		controller: ['$window', '$scope','$timeout', function($window, $scope, $timeout){
			$scope.matrix = generatePlayGround(80, 80);
			$scope.snake = initializeSnake(80,80);
			$scope.movement = 'right';
			$scope.speed = 30;
			placeSnakeOnBoard($scope.matrix, $scope.snake);
			placeBait($scope.matrix);
			
		}],
		
		link: function(scope, elem, attr){
			// move
			var matrix = scope.matrix;
			var snake = scope.snake;
			var movement = scope.movement;
			scope.speedChange = function(){
				
				$interval.cancel(currentGame);
				console.log($interval);
				currentGame = $interval(function(){
				var movement = scope.movement;
				var gameStatus = moveSnake(matrix, movement, snake);
				if(gameStatus === 'Game Over'){
					console.log('Game Over');
					alert('Game over');
					$window.location.reload();
				}
			},100 - scope.speed);
			}
			//Refreshing whole table.
			var currentGame = $interval(function(){
				var movement = scope.movement;
				var gameStatus = moveSnake(matrix, movement, snake);
				if(gameStatus === 'Game Over'){
					console.log('Game Over');
					alert('Game over');
					$window.location.reload();
				}
			}, 30);
			window.addEventListener('keydown', function(e)
			{
				
				if(e.key === 'w' || e.key ==='W' || e.key ==='ArrowUp'){
					scope.movement = 'up';
				}
				else if(e.key === 's'  || e.key ==='S' || e.key ==='ArrowDown'){
					scope.movement = 'down';
				}
				else if(e.key === 'a'  || e.key ==='A' || e.key ==='ArrowLeft'){
					scope.movement = 'left';
				}
				else if(e.key === 'd'  || e.key ==='D' || e.key ==='ArrowRight'){
					scope.movement = 'right';
				}
			}
			);
		}
	}
	
}]);

// Datatypes which may need.
var snake = function(head, body, tail, speed){
	this.head = head;
	this.tail = tail;
	this.body = body;
	this.speed = speed;
	this.direction = 'right';
	
};

//body of snake/
var body = function(head, tail){
	this.parts = {};
	this.parts.head = head;
	this.parts.head.next = tail;
	this.parts.tail = tail;
	this.parts.tail.prev = head;
	self = this;
	this.addPart = function(singlePart){
		//ataches part at tail end.
		singlePart.prev = self.parts.tail.prev;
		singlePart.next = self.parts.tail;
		self.parts.tail.prev.next = singlePart;
		self.parts.tail.prev = singlePart;
	};
};

// snake parts.
var parts = function(x, y, type = 'body'){
	this.x = x;
	this.y = y;
	this.cssClass = 'bodyParts';
	this.type = type;
	this.next = null;
	this.prev = null;
	this.value = 0;
	
};

// each block is pixel in play area.
var pixels = function(x, y,snakePart = null){
	this.x = x;
	this.y = y;
	this.snakePart = snakePart;
	self =this;
	this.cssClass =(function(){
		if(self.snakePart === null){
			self.cssClass = 'blankBox';
		}
		else if (snakePart.cssClass !==undefined){
			self.cssClass = snakePart.cssClass;	//snake type.
		}
		else{
			self.cssClass = snakePart;			// string type.
		}
		return self.cssClass;
	})();
};

// generate playground.
function generatePlayGround(x, y){
	var mat =  [];
	for(let i =0; i < x; i++){
		mat[i] =[];
		for(let j =0; j<y;j++){
			mat[i][j] = new pixels(i, j);
		}
	}
	// place border;
	for(let i =0; i < y;i++){
		mat[0][i].cssClass = 'border';		// top.
		mat[0][i].value = 'B';
		
		mat[x-1][i].cssClass = 'border';		// bottom.
		mat[x-1][i].value = 'B';
		
	}
	for(let i =0; i < x;i++){
		mat[i][0].cssClass = 'border';		// left.
		mat[i][0].value = 'B';
		
		mat[i][y-1].cssClass = 'border';		// right.
		mat[i][y-1].value = 'B';
		
	}
	// for(let i = 0; i < 50; ){
		// var x = Math.floor(Math.random() * mat.length);
		// var y = Math.floor(Math.random() * mat[0].length);
		// if(mat[x][y].cssClass !== 'border' && mat[x][y].cssClass !== 'borderNotOnEdge'){
			// mat[x][y].cssClass = 'borderNotOnEdge';
			// mat[x][y].value = 'B';
			// i++;
		// }
	// }
	
	//Initialize s;
	return mat;
}

// Build snake where x and y are dimensions of playground.
function initializeSnake(x, y){
	var shead = new parts(parseInt(x/2), parseInt(y/2),'head');
	shead.cssClass = 'head';
	shead.value = 'H';
	var stail = new parts(parseInt(x/2), parseInt(y/2) - 10, 'tail');	// 10 is default size.
	stail.cssClass = 'tail';
	stail.value = 'T';
	var sbody = new body(shead, stail);
	for(let i =0; i < 10; i++){
		let p = new parts(parseInt(x/2), parseInt(y/2) -i -1);
		p.value = i;
		sbody.addPart(p);
		
	}
	var ssnake = new snake(shead, sbody, stail, 10);
	return ssnake;
}

//matrix is playground and snake is to be placed.
function placeSnakeOnBoard(matrix, snake){
	//reset.
	for(var i =0; i < matrix.length;i++){
		for(var j =0;j < matrix[i].length; j++){
			if(matrix[i][j].cssClass !=='border'  && matrix[i][j].cssClass !=='bait' && matrix[i][j].cssClass !== 'borderNotOnEdge')
				matrix[i][j].cssClass = 'blankBox';
				matrix[i][j].snakePart = null;
		}
	}
	
	for(let i = snake.head;i !==null; i = i.next){
			if(matrix[i.x][i.y].cssClass!=='border'){
				matrix[i.x][i.y].snakePart = i;
				matrix[i.x][i.y].cssClass = i.cssClass;
			}
				
		}
	}

//move snake based on movement.
// Movement can be 'left', 'right', 'up', 'down'
function moveSnake(matrix, movement, snake){
	
	snake.direction = movement;
	var gameStatus = '';
	switch(movement){
		case 'right':
			if(snake.head.direction !='left'){
				gameStatus = rightMove(matrix, snake);
			}
			else{
				gameStatus = leftMove(matrix, snake);
			}
			break;
		case 'left':
			if(snake.head.direction !='right'){
				gameStatus = leftMove(matrix, snake);
			}
			else{
				gameStatus = rightMove(matrix, snake);
			}
			break;
		case 'up':
			if(snake.head.direction !='down'){
				gameStatus = upMove(matrix, snake);
			}
			else{
				gameStatus = downMove(matrix, snake);
			}
			break;
		case 'down':
			if(snake.head.direction !='up'){
				gameStatus = downMove(matrix, snake)		
			}
			else{
				gameStatus = upMove(matrix, snake);
			}
			break;
			
	}
	if(gameStatus === ''){
		return undefined;
	}
	else{
		return gameStatus;
	}
}

function moveBodyOfSnake(matrix, snake){
	var head = snake.head;
	var tail = snake.tail;
	var body = snake.body;
	for(var i =tail; i != head; i = i.prev){
		i.x = i.prev.x;
		i.y = i.prev.y;
		
	}
	
}

function leftMove(matrix, snake){
	moveBodyOfSnake(matrix, snake);
	if(matrix[snake.head.x][snake.head.y -1 ].cssClass === 'bait'){
		var part = new parts(snake.tail.x, snake.tail.y);
		part.value = snake.tail.prev.value + 1;
		snake.tail.y++;
		snake.body.addPart(part);
		placeBait(matrix);
		matrix[snake.head.x][snake.head.y - 1].cssClass = 'blankBox';
	}
	// when head is 1 pixel away from border.
	else if(matrix[snake.head.x][snake.head.y - 1].cssClass ==='border'){
		setTimeout(function(){snake.head.y = matrix[0].length - 1}, 1);
	}
	
	
	// check for interaction of head with body.
	else if(matrix[snake.head.x][snake.head.y - 1].cssClass ==='bodyParts' ||matrix[snake.head.x][snake.head.y - 1].cssClass ==='tail' || matrix[snake.head.x][snake.head.y - 1].cssClass === 'borderNotOnEdge' ){
		return 'Game Over';
	}
	snake.head.y--;
	placeSnakeOnBoard(matrix, snake);
	snake.head.direction = 'left';
}

function rightMove(matrix, snake){
	if(matrix[snake.head.x][snake.head.y + 1 ].cssClass === 'bait'){
		var part = new parts(snake.tail.x, snake.tail.y);
		snake.tail.y--;
		snake.body.addPart(part);
		placeBait(matrix);
		matrix[snake.head.x][snake.head.y + 1].cssClass = 'blankBox';
	}
	// when head is 1 pixel away from border.
	else if(matrix[snake.head.x][snake.head.y + 1].cssClass ==='border'){
		setTimeout(function(){snake.head.y = 0;}, 1);
	}
	
	// check for interaction of head with body.
	else if(matrix[snake.head.x][snake.head.y + 1].cssClass ==='bodyParts' ||matrix[snake.head.x][snake.head.y + 1].cssClass ==='tail' || matrix[snake.head.x][snake.head.y + 1].cssClass === 'borderNotOnEdge' ){
		return 'Game Over';
	}
	moveBodyOfSnake(matrix, snake);
	snake.head.y++;
	placeSnakeOnBoard(matrix, snake);
	snake.head.direction = 'right';
}

function upMove(matrix, snake){
	if(matrix[snake.head.x - 1][snake.head.y].cssClass === 'bait'){
		var part = new parts(snake.tail.x, snake.tail.y);
		snake.tail.x++;
		snake.body.addPart(part);
		placeBait(matrix);
		matrix[snake.head.x - 1][snake.head.y].cssClass = 'blankBox';
	}
	// when head is 1 pixel away from border.
	else if(matrix[snake.head.x - 1][snake.head.y].cssClass ==='border'){
		setTimeout(function(){snake.head.x = matrix.length - 1;}, 1)
	}
	
	// check for interaction of head with body.
	else if(matrix[snake.head.x - 1][snake.head.y].cssClass ==='bodyParts' || matrix[snake.head.x - 1][snake.head.y].cssClass ==='tail' || matrix[snake.head.x - 1][snake.head.y].cssClass === 'borderNotOnEdge'){
		return 'Game Over';
	}
	moveBodyOfSnake(matrix, snake);
	snake.head.x--;
	placeSnakeOnBoard(matrix, snake);
	snake.head.direction = 'up';
}

function downMove(matrix, snake){
	if(matrix[snake.head.x + 1][snake.head.y].cssClass === 'bait'){
		var part = new parts(snake.tail.x, snake.tail.y);
		snake.tail.x--;
		snake.body.addPart(part);
		placeBait(matrix);
		matrix[snake.head.x + 1][snake.head.y].cssClass = 'blankBox';
	}
	// when head is 1 pixel away from border.
	else if(matrix[snake.head.x + 1][snake.head.y].cssClass ==='border'){
		setTimeout(function(){snake.head.x = 0;}, 1);
	}
	
	// check for interaction of head with body.
	else if(matrix[snake.head.x + 1][snake.head.y].cssClass ==='bodyParts' ||matrix[snake.head.x + 1][snake.head.y].cssClass ==='tail' || matrix[snake.head.x + 1][snake.head.y].cssClass === 'borderNotOnEdge' ){
		return 'Game Over';
	}
	moveBodyOfSnake(matrix, snake);
	snake.head.x++;
	placeSnakeOnBoard(matrix, snake);
	snake.head.direction = 'down';
}

function placeBait(matrix){
	while(true){
		var x = Math.floor((Math.random()) * matrix.length);
		var y = Math.floor((Math.random()) * matrix[0].length);
		if(matrix[x][y].cssClass === 'blankBox'){
			//place bait.
			matrix[x][y].cssClass = 'bait';
			return;
		}
	}
}
