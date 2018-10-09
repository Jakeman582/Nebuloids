function Shield(x = 0, y = 0, width = 0, height = 0, health = 0, color = "#FFFFFF", sprite = null) {

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.health = health;
	this.color = color;
	this.sprite = sprite;
	
	this.update = function(deltaHealth) {
		this.health += deltaHealth;
	}
	
	this.draw = function(graphics) {
		if(sprite) {
			graphics.drawImage(sprite, this.x, this.y, this.width, this.height);
		} else {
			graphics.fillStyle = this.color;
			graphics.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	
}