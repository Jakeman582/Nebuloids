function Ship(x = 0, y = 0, velocity = 0, width = 0, height = 0, 
	color = "#FFFFFF", sprite = null) {
	
	/* Needed variables */
	this.x 			= x;
	this.y 			= y;
	this.lastX = x;
	this.lastY = y;
	this.velocity 	= velocity;
	this.width 		= width;
	this.height 	= height;
	this.color 		= color;
	
	// Helper variables.
	this.direction = 0;
	
	// The ship needs to draw itself
	this.draw = function(graphics) {
		if(sprite) {
			graphics.drawImage(sprite, this.x, this.y, this.width, this.height);
		} else {
			graphics.fillStyle = this.color;
			graphics.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	
	this.setDirection = function(left, right) {
		
		if(left && !(right)) {
			this.direction = -1;
		} else if(!(left) && right) {
			this.direction = 1;
		} else {
			this.direction = 0;
		}
		
	}
	
	// The ships needs to move itself
	this.move = function(deltaTime) {
		this.lastX = this.x;
		this.lastY = this.y;
		this.x += this.velocity * deltaTime * this.direction;
		
	}
	
}