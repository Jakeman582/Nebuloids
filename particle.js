function Particle(x = 0, y = 0, width = 0, height = 0, velocityX = 0, velocityY = 0, color = "#000000") {
	
	this.x = x;
	this.y = y;
	this.lastX = x;
	this.lastY = y;
	this.width = width;
	this.height = height;
	this.velocityX = velocityX;
	this.velocityY = velocityY;
	this.color = color;
	
	this.draw = function(graphics) {
		graphics.beginPath();
		graphics.fillStyle = this.color;
		graphics.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
		graphics.fill();
	}
	
	this.update = function(deltaTime) {
		this.lastX = this.x;
		this.lastY = this.y;
		this.x += this.velocityX * deltaTime;
		this.y += this.velocityY * deltaTime;
	}
	
}