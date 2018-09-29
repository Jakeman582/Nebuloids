function Screen(x = 0, y = 0, width = 0, height = 0, color = "#000000") {
	/* Needed variables */
	this.x		= x;
	this.y		= y;
	this.width	= width;
	this.height	= height;
	this.color	= color;
	
	// The screen needs to draw itself
	this.draw = function(graphics) {
		
		graphics.fillStyle = this.color;
		graphics.fillRect(this.x, this.y, this.width, this.height);
		
	}
	
}