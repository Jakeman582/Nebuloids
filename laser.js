function Laser(x = 0, y = 0, velocity = 0.0, width = 0, height = 0, color = "#FF0000", direction = 1) {
	
	this.x = x;
	this.y = y;
	this.lastX = x;
	this.lastY = y;
	this.velocity = velocity;
	this.width = width;
	this.height = height;
	this.color = color;
	this.direction = direction;
	
	this.draw = function(graphics) {
		
		graphics.fillStyle = this.color;
		graphics.fillRect(this.x, this.y, this.width, this.height);
		
	}
	
	this.move = function(deltaTime) {
		this.lastX = this.x;
		this.lastY = this.y;
		this.y += this.velocity * this.direction * deltaTime;
		
	}
	
}