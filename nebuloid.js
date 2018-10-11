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
	this.explodingDuration = 1;
	this.splatterSize = 25;
	this.shrapnelSize = 5;
	this.direction = direction;
	
	this.shrapnel = [];
	
	this.draw = function(graphics, interpolation) {
		var tempX = (this.lastX + (this.x - this.lastX) * interpolation);
		var tempY = (this.lastY + (this.y - this.lastY) * interpolation);
		if(this.alive) {
			if(sprite) {
				graphics.drawImage(sprite, tempX, tempY, this.width, this.height);
			} else {
				graphics.fillStyle = this.color;
				graphics.fillRect(tempX, tempY, this.width, this.height);
			}
		} else if(this.exploding) {
			var index;
			for(index = 0; index < this.splatterSize; index++) {
				this.shrapnel[index].draw(graphics, interpolation);
			}
		}
	}
	
	this.update = function(deltaTime) {
		if(this.alive) {
			this.lastX = this.x;
			this.lastY = this.y;
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
				-50 + 100 * Math.random(),
				-50 + 100 * Math.random(),
				this.color
			);
		}
	}
	
	this.explode = function(deltaTime) {
		var index;
		if(this.explodingTime < this.explodingDuration) {
			this.explodingTime += deltaTime;
			for(index = 0; index < this.splatterSize; index++) {
				this.shrapnel[index].lastX = this.shrapnel[index].x;
				this.shrapnel[index].lastY = this.shrapnel[index].y;
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