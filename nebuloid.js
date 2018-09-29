function Nebuloid(x = 0, y = 0, velocity = 0, width = 0, height = 0, color = "#00FF00", sprite = null, alive = true, direction = 1) {
	
	this.x = x;
	this.y = y;
	this.velocity = velocity;
	this.width = width;
	this.height = height;
	this.color = color;
	this.alive = alive;
	this.exploding = false;
	this.explodingTime = 0.0;
	this.explodingDuration = 100;
	this.splatterSize = 20;
	this.shrapnelSize = 5;
	this.direction = direction;
	
	this.shrapnel = [];
	
	this.draw = function(graphics) {
		if(this.alive) {
			if(sprite) {
				graphics.drawImage(sprite, this.x, this.y, this.width, this.height);
			} else {
				graphics.fillStyle = this.color;
				graphics.fillRect(this.x, this.y, this.width, this.height);
			}
		} else if(this.exploding) {
			var index;
			for(index = 0; index < this.splatterSize; index++) {
				this.shrapnel[index].draw(graphics);
			}
		}
	}
	
	this.update = function(deltaTime) {
		if(this.alive) {
			this.x += this.direction * this.velocity * deltaTime;
		} else if(this.exploding) {
			this.explode(deltaTime);
		}
		
	}
	
	this.initializeShrapnel = function() {
		var index;
		for(index = 0; index < this.splatterSize; index++) {
			this.shrapnel[index] = new Particle(
				this.x + this.width / 2, 
				this.y + this.height / 2, 
				this.shrapnelSize, 
				this.shrapnelSize, 
				-3 + 6 * Math.random(),
				-3 + 6 * Math.random(),
				this.color
			);
		}
	}
	
	this.explode = function(deltaTime) {
		var index;
		if(this.explodingTime < this.explodingDuration) {
			this.explodingTime += deltaTime;
			for(index = 0; index < this.splatterSize; index++) {
				this.shrapnel[index].x += this.shrapnel[index].velocityX * deltaTime;
				this.shrapnel[index].y += this.shrapnel[index].velocityY * deltaTime;
			}
		} else {
			this.explodingTime = 0.0;
			this.exploding = false;
			this.shrapnel.splice(0, this.splatterSize);
		}
	}
	
}