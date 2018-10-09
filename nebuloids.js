/* Ship variables */
shipWidth = 60;
shipHeight = 60;
shipYOffset = 10;
shipColor = "#777777";
shipVelocity = 8;

/* Nebuloid variables */
nebuloidWidth = 30;
nebuloidHeight = 30;
nebuloidVelocity = 1;
nebuloidRows = 5;
nebuloidColumns = 10;
nebuloidShotFrequency = 0.001;
nebuloidLaserVelocity = 6;

/* Cybernator variables */
cybernatorWidth = 90;
cybernatorHeight = 30;
cybernatorVelocity = 3;
cybernatorColor = "#AAFFAA";
cybernatorYOffset = 5;

/* Shield variables */
shieldNumber = 9;
shieldWidth = 60;
shieldHeight = 60;
shieldHealth = 3;
shieldColor = "#00FFFF";
shieldGap = 40;
shieldYOffset = 100;

/* Grid spacing variables */
gridX = 30;
gridY = 30;
rowSpace = 10;
columnSpace = 30;

/* Laser variables */
laserWidth = 4;
laserHeight = 20;
laserVelocity = 15;
laserColor = "#FF0000";

/* Gameplay variables */
playingGame = true;
nebuloidScore = 1;
cybernatorScore = 5;
score = 0;
starCount = 75;
minimumStarSize = 1;
maximumStarSize = 5;
minimumStarVelocity = 2;
maximumStarVelocity = 10;
parallaxLayers = 5;

/* Performance variables */
framesPerSecond = 60;
framesThisSecond = 0;
timeStep = 1000 / framesPerSecond;
lastUpdate = 0;
lastFrameTime = 0;
deltaTime = 0;

var Keyboard = {
   RIGHT:	39,
   LEFT:		37,
   DOWN:		40,
   UP:		38,
   SPACE:	32,
   Q:			81,
   W:			87,
   P:			80
};

var Pressed = {
	RIGHT: false,
	LEFT: false
};

var Color = {
	RED:		"#FF0000",
	ORANGE:	"#FFA500",
	YELLOW:	"#FFFF00",
	GREEN:	"#00FF00",
	BLUE:		"#0000FF",
	INDIGO:	"#4B0082",
	VIOLET:	"#EE82EE",
};

var Direction = {
	LEFT:		-1,
	RIGHT:	1
};

/* Needed global variables */
var screen;
var scoreLabel;
var graphics;
var ship;
var cybernator;
var lasers = [];
var nebuloids = [];
var nebuloidLasers = [];
var shields = [];
var stars = [];
var date;
var index;
var subIndex;
var row;
var column;

// Loading images
var loadCount = 0;
var loadTotal = 0;
var preloaded = false;
var sprites = [];
var imagesToLoad = [
	"images/Destroyer.png",
	"images/Virus.png",
	"images/Invader(Red).png",
	"images/Invader(Yellow).png",
	"images/Invader(Green).png",
	"images/Invader(Blue).png",
	"images/Cybernater.png",
	"images/BlastShield.png"
];

var enemyOffset = 1;

function main() {
	
	// Setup the screen and the ship
	setup();
	
	// Handle key down events
   document.onkeydown = function(e) {
      keyDown(e);
   }
	
	document.onkeyup = function(e) {
		keyUp(e);
	}
	
   // Start the animation
   requestAnimationFrame(playGame);
}

function resetGame() {
	
	playingGame = true;
	score = 0;
	
	scoreLabel.innerHTML = "" + Game.score;
	
	nextGameTick = date.getTime();
	
	ship.x = (screen.width - shipWidth) / 2;
	ship.y = screen.height - shipHeight - shipYOffset;
	
	for(row = 0; row < nebuloidRows; row++) {
		for(column = 0; column < nebuloidColumns; column++) {
			nebuloids[row][column].alive = true;
			nebuloids[row][column].x = gridX + (nebuloidWidth + columnSpace) * column;
			nebuloids[row][column].y = gridY + (nebuloidHeight + rowSpace) * row;
			nebuloids[row][column].color = randomColor();
			nebuloids[row][column].direction = Direction.RIGHT;
		}
	}
	
	for(index = 0; index < shields.length; index++) {
		shields[index].health = shieldHealth;
	}
}

function setup() {
	
	//Load images before doing anything else;
	sprites = loadImages(imagesToLoad);
	
	// Get the canvas element
	var canvas = document.getElementById("canvas");
	graphics = canvas.getContext("2d");
	
	// Get the score label
	scoreLabel = document.getElementById("scoreLabel");
	scoreLabel.innerHTML = "" + score;
	
	// Initialize the global time object
	date = new Date();
	nextGameTick = date.getTime();
	
	// Initialize the screen and draw
	screen = new Screen(0, 0, canvas.width, canvas.height, "#000000");
	
	// Ship should start at the bottom, and centered horizontally
	ship = new Ship(
		(screen.width - shipWidth) / 2, 
		screen.height - shipHeight - shipYOffset,
		shipVelocity,
		shipWidth,
		shipHeight,
		shipColor,
		sprites[0]
	);
	
	// The cybernator
	cybernator = new Nebuloid(
		-cybernatorWidth,
		cybernatorYOffset,
		cybernatorVelocity,
		cybernatorWidth,
		cybernatorHeight,
		cybernatorColor,
		sprites[6],
		false,
		1
	);
	
	// 5 rows of nebuloids, each a different type
	// Row 0 -> virus, Row 1 -> red, Row 2 -> yellow, Row 3 -> green, 
	// Row 4 -> blue
	for(row = 0; row < nebuloidRows; row++) {
		nebuloids[row] = [];
		var rowColor = null;
		if(row == 0) {
			rowColor = Color.INDIGO;
		} else if(row == 1){
			rowColor = Color.RED;
		} else if(row == 2){
			rowColor = Color.YELLOW;
		} else if(row == 3){
			rowColor = Color.GREEN;
		} else {
			rowColor = Color.BLUE;
		}
		for(column = 0; column < nebuloidColumns; column++) {
			nebuloids[row].push(new Nebuloid(
				gridX + (nebuloidWidth + columnSpace) * column,
				gridY + (nebuloidHeight + rowSpace) * row,
				nebuloidVelocity,
				nebuloidWidth,
				nebuloidHeight,
				rowColor,
				sprites[row + enemyOffset]
			));
		}
	}
	
	// Shields should be centered horizontally
	var shieldScreenWidth = shieldNumber * shieldWidth + (shieldNumber - 1) * shieldGap;
	var shieldXOffset = (screen.width - shieldScreenWidth) / 2;
	for(index = 0; index < shieldNumber; index++) {
		shields[index] = new Shield(
			shieldXOffset + index * (shieldGap + shieldWidth),
			screen.height - shieldHeight - shieldYOffset,
			shieldWidth,
			shieldHeight,
			shieldHealth,
			shieldColor,
			sprites[7]
		);
	}
	
	// Make sure when setting up, we are playing the game and the score is reset
	playingGame = true;
	score = 0;
	
	// Initialize the stars array
	for(index = 0; index < starCount; index++) {
		var z = getParallaxLayer(parallaxLayers);
		var size = getParallaxSize(z);
		var velocity = getParallaxVelocity(z);
		stars[index] = new Particle(
			randomInt(0, screen.width - size), 
			randomInt(0, screen.height), 
			size, 
			size, 
			0, 
			velocity, 
			"#FFFFFF"
		);
	}
	
}

function playGame(timeStamp) {
	
	if(timeStamp < lastUpdate + (1000 / framesPerSecond)) {
		requestAnimationFrame(playGame);
		return;
	}
	deltaTime += timeStamp - lastUpdate;
	lastUpdate = timeStamp;
	
	if(timeStamp > lastUpdate + 1000) {
		framesPerSecond = 0.25 * framesThisSecond + (1 - 0.25) * framesPerSecond;
		lastUpdate = timeStamp;
		framesThisSecond = 0;
	}
	framesThisSecond++;
	
	var updateSteps = 0;
	while(deltaTime >= timeStep) {
		update(timeStep / 1000);
		deltaTime -= timeStep;
		if(++updateSteps >= 100) {
			deltaTime = 0;
			break;
		}
	}
	
	render((deltaTime / timeStep) / 1000);
   requestAnimationFrame(playGame);
}

function makeLaser() {
	lasers.push(new Laser(
		ship.x + (ship.width - laserWidth) / 2,
		ship.y,
		laserVelocity,
		laserWidth,
		laserHeight,
		laserColor,
		-1
	));
}

function keyDown(e) {
	if(e.keyCode === Keyboard.LEFT) {
		Pressed.LEFT = true;
	} else if(e.keyCode === Keyboard.RIGHT) {
		Pressed.RIGHT = true;
	} else if(e.keyCode === Keyboard.SPACE) {
		makeLaser();
	}
}

function keyUp(e) {
	if(e.keyCode === Keyboard.LEFT) {
		Pressed.LEFT = false;
	} else if(e.keyCode === Keyboard.RIGHT) {
		Pressed.RIGHT = false;
	}
}

function update(deltaTime) {
	var shiftedDown = false;
	
	if(!cybernator.alive && !cybernator.exploding) {
		if(randomInt(1, 750) == 1) {
			makeCybernator()
		}
	} else {
		cybernator.update(deltaTime);
	}
	
	for(index = 0; index < starCount; index++) {
		stars[index].update(deltaTime);
		if(stars[index].y > screen.height) {
			stars[index].y = -stars[index].height;
			stars[index].x = randomInt(0, screen.width - stars[index].width);
		}
	}
	
	for(row = 0; row < nebuloidRows; row++) {
		for(column = 0; column < nebuloidColumns; column++) {
			if(!shiftedDown) {
				var leftBoundaryHit = (nebuloids[row][column].x < 0) && nebuloids[row][column].alive;
				var rightBoundaryHit = (nebuloids[row][column].x + nebuloidWidth > screen.width) && nebuloids[row][column].alive;
				if(leftBoundaryHit || rightBoundaryHit) {
					shiftNebuloidsDown();
					shiftedDown = true;
				}
			}
		}
	}
	
	for(row = 0; row < nebuloidRows; row++) {
		for(column = 0; column < nebuloidColumns; column++) {
			nebuloids[row][column].update(deltaTime);
			if(nebuloids[row][column].alive) {
				if(Math.random() < nebuloidShotFrequency) {
					nebuloidLasers.push(new Laser(
						nebuloids[row][column].x + (nebuloids[row][column].width - laserWidth) / 2,
						nebuloids[row][column].y,
						nebuloidLaserVelocity,
						laserWidth,
						laserHeight,
						nebuloids[row][column].color,
						1
					));
				}
			}
		}
	}
	
	for(index = 0; index < lasers.length; index++) {
		lasers[index].move(deltaTime);
		lasers[index].color = cycleColor(lasers[index].color);
	}
	
	for(index = 0; index < nebuloidLasers.length; index++) {
		nebuloidLasers[index].move(deltaTime);
	}
	
	ship.setDirection(Pressed.LEFT, Pressed.RIGHT);
	ship.move(deltaTime);
	
	shot();
	cybernatorShot();
	detectShieldHit();
	detectPlayerHit();
	
	deleteLasers();
	
}

function render(interpolation) {
	
	screen.draw(graphics);
	
	for(index = 0; index < starCount; index++) {
		stars[index].draw(graphics);
	}
	
	cybernator.draw(graphics);
	
	for(index = 0; index < shields.length; index++) {
		if(shields[index].health > 0) {
			shields[index].draw(graphics);
		}
	}
	
	for(index = 0; index < nebuloidLasers.length; index++) {
		nebuloidLasers[index].draw(graphics);
	}
	
	for(row = 0; row < nebuloidRows; row++) {
		for(column = 0; column < nebuloidColumns; column++) {
			nebuloids[row][column].draw(graphics);
		}
	}
	
	for(index = 0; index < lasers.length; index++) {
		lasers[index].draw(graphics);
	}
	
	ship.draw(graphics);
}

function randomColor() {
	var number = Math.floor((7 * Math.random()));
	switch(number) {
		case 0:
			return Color.RED;
		case 1:
			return Color.ORANGE;
		case 2:
			return Color.YELLOW;
		case 3:
			return Color.GREEN;
		case 4:
			return Color.BLUE;
		case 5:
			return Color.INDIGO;
		default:
			return Color.VIOLET;
	}
}

function cycleColor(currentColor) {
	if(currentColor === Color.RED) {
		return Color.ORANGE;
	} else if(currentColor === Color.ORANGE) {
		return Color.YELLOW;
	} else if(currentColor === Color.YELLOW) {
		return Color.GREEN;
	} else if(currentColor === Color.GREEN) {
		return Color.BLUE;
	} else if(currentColor === Color.BLUE) {
		return Color.INDIGO;
	} else if(currentColor === Color.INDIGO) {
		return Color.VIOLET;
	} else {
		return Color.RED;
	}
}

function deleteLasers() {
	for(index = lasers.length - 1; index >= 0; index--) {
		var aboveScreen = lasers[index].y + laserHeight < 0;
		var belowScreen = lasers[index].y > screen.height;
		if(aboveScreen || belowScreen) {
			lasers.splice(index, 1);
		}
	}
	for(index = nebuloidLasers.length - 1; index >= 0; index--) {
		var aboveScreen = nebuloidLasers[index].y + laserHeight < 0;
		var belowScreen = nebuloidLasers[index].y > screen.height;
		if(aboveScreen || belowScreen) {
			nebuloidLasers.splice(index, 1);
		}
	}
}

function shot() {
	if(lasers.length > 0) {
		for(row = 0; row < nebuloidRows; row++) {
			for(column = 0; column < nebuloidColumns; column++) {
				if(nebuloids[row][column].alive) {
					for(index = 0; index < lasers.length; index++) {
						if(detectCollision(nebuloids[row][column], lasers[index])) {
							nebuloids[row][column].alive = false;
							nebuloids[row][column].initializeShrapnel();
							nebuloids[row][column].exploding = true;
							lasers.splice(index, 1);
							incrementScore(nebuloidScore);
							index--;
						}
					}
				}
			}
		}
	}
}

function cybernatorShot() {
	if(lasers.length > 0) {
		if(cybernator.alive) {
			for(index = 0; index < lasers.length; index++) {
				if(detectCollision(cybernator, lasers[index])) {
					cybernator.alive = false;
					cybernator.initializeShrapnel();
					cybernator.exploding = true;
					lasers.splice(index, 1);
					incrementScore(cybernatorScore);
					index--;
				}
			}
		}
	}
}

function detectShieldHit() {
	if(nebuloidLasers.length > 0) {
		for(index = 0; index < shields.length; index++) {
			if(shields[index].health > 0) {
				for(subIndex = 0; subIndex < nebuloidLasers.length; subIndex++) {
					if(detectCollision(shields[index], nebuloidLasers[subIndex])) {
						nebuloidLasers.splice(subIndex, 1);
						subIndex--;
						shields[index].health--;
					}
				}
			}
		}
	}
}

function shiftNebuloidsDown() {
	for(row = 0; row < nebuloidRows; row++) {
		for(column = 0; column < nebuloidColumns; column++) {
			nebuloids[row][column].y += nebuloidHeight;
			nebuloids[row][column].direction *= -1;
		}
	}
}

function incrementScore(deltaScore) {
	score += deltaScore;
	scoreLabel.innerHTML = "" + score;
}

function detectPlayerHit() {
	for(row = 0; row < nebuloidRows; row++) {
		for(column = 0; column < nebuloidColumns; column++) {
			if(nebuloids[row][column].alive) {
				if(detectCollision(ship, nebuloids[row][column])) {
					playingGame = false;
				}
			}
		}
	}
}

function detectCollision(mainObject, incomingObject) {
	// Get the bounding box of the main object
	var boundX = mainObject.x - incomingObject.width;
	var boundY = mainObject.y - incomingObject.height;
	var boundWidth = mainObject.width + 2 * incomingObject.width;
	var boundHeight = mainObject.height + 2 * incomingObject.height;
	var up = incomingObject.y < boundY;
	var down = incomingObject.y + incomingObject.height > boundY + boundHeight;
	var left = incomingObject.x < boundX;
	var right = incomingObject.x + incomingObject.width > boundX + boundWidth;
	return !up && !down && !left && !right;
}

function randomInt(minimum, maximum) {
	return Math.floor(((maximum - minimum)* Math.random())) + minimum;
}

function getParallaxLayer(parallaxLayers = 1) {
	var p = Math.random();
	var sum = 0;
	var threshold = 0;
	var n = 1;
	
	/*
		x + 2x + 3x + ... + parallaxLayers*x = 1
		x(1 + 2 + 3 + ... + parallaxLayers) = 1
		x = 1 / (1 + 2 + 3 + ... parallaxLayers)
	*/
	for(n = 1; n <= parallaxLayers; n++) {
		sum += n;
	}
	threshold = 1.0 / sum;
	
	sum = 0;
	for(n = 1; n <= parallaxLayers; n++) {
		sum += n * threshold;
		if(p < sum) {
			return n;
		}
	}
	
	return parallaxLayers;
	
}

function getParallaxWidth(z = 1) {
	return maximumStarWidth - z + 1;
}

function getParallaxHeight(z = 1) {
	return maximumStarHeight - z + 1;
}

function getParallaxSize(z = 1) {
	return map(z, 1, parallaxLayers, maximumStarSize, minimumStarSize);
}

function getParallaxVelocity(z = 1) {
	return map(z, 1, parallaxLayers, maximumStarVelocity, minimumStarVelocity);
}

function map(x, fromMin, fromMax, toMin, toMax) {
	var ratio = (toMax - toMin) / (fromMax - fromMin);
	var shift = toMin - fromMin * ratio;
	return x * ratio + shift;
}

function loadImages(imageFiles) {
	
	loadCount = 0;
	loadTotal = imageFiles.length;
	preloaded = false;
	
	var loadedImages = [];
	for(index = 0; index < loadTotal; index++) {
		var newImage = new Image();
		newImage.onload = function() {
			loadCount++;
			if(loadCount >= loadTotal) {
				preloaded = true;
			}
		}
		newImage.src = imageFiles[index];
		loadedImages[index] = newImage;
	}
	return loadedImages;
}

function makeCybernator() {
	index = Math.random();
	if(index < 0.5) {
		cybernator.x = -cybernator.width;
		cybernator.direction = 1;
	} else {
		cybernator.x = screen.width;
		cybernator.direction = -1;
	}
	cybernator.alive = true;
}