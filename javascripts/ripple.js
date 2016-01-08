
var rippled = false;
function Rippler() {
	if (rippled) return;
	rippled = true;
	//console.log("Creating rippler");

	var bk_val = 40;
	this.WHITE = [255, 255, 255, 255]; //white is the ripple color
	this.BLACK = [bk_val, bk_val, bk_val, 255]; //black is the background color

	this.height = 200;
	this.width = 200;

	var div = document.getElementById("rippleWrapper");
	this.canvas = document.createElement("canvas");
	this.canvas.id = "ripple";
	this.canvas.height = this.height;
	this.canvas.width = this.width;
	div.appendChild(this.canvas);
	this.ctx = this.canvas.getContext("2d");

	
	//make sure all pixels are NOT transparent and black
	var imgdata = this.ctx.getImageData(0,0,this.width,this.height);
	for (var c = 0; c < imgdata.data.length; c+=1) { 
		//writing to the 4th field of each pixel, RGB_A_
		if ((c+1)%4 === 0) {
			imgdata.data[c] = 255;
		} else {
			imgdata.data[c] = bk_val;
		}
	}
	var res = this.ctx.putImageData(imgdata, 0, 0);

	self = this;
	res = window.addEventListener("mousedown",function(e){self.createRipple(e,self)},true);

	this.createRipple = function(e,self) {
		var x = e.layerX;
		var y = e.layerY;
		var imdata = self.ctx.createImageData(1, 1);
		self.setAs(imdata.data,self.WHITE);
		self.ctx.putImageData(imdata, x, y);
		console.log(imdata.data);
		console.log("Put image data at " + x + "," + y);
	}


	this.tick = function() {
		var orig = this.ctx.getImageData(0,0,this.width,this.height);
		var img = new ImageData(orig.data, this.width, this.height);
		var data = new Uint8ClampedArray(img.data);
		var arr = [];
		for (var i = 0; i < this.width*this.height*4; i += 4) {
			var currPix = [data[i], data[i+1], data[i+2], data[i+3]];
			if (this.pixEqual(currPix, this.WHITE)) {
				var imdata = this.ctx.createImageData(1,1);
				this.setAs(imdata.data, this.BLACK);
				this.ctx.putImageData(imdata, i/4%this.width, i/4/this.height);
				

				var imdata2 = this.ctx.createImageData(1,1);
				this.setAs(imdata2.data, this.WHITE);
				//right
				if (!(i/4%this.width >= this.width)) {
					this.ctx.putImageData(imdata2, (i/4%this.width)+1,i/4/this.height);
				}
				//left
				if (!(i/4%this.width <= 0)) {
					this.ctx.putImageData(imdata2, i/4%this.width-1,i/4/this.height);
				}
				//top
				if (!(i/4 <= this.width)) {
					this.ctx.putImageData(imdata2, i/4%this.width,i/4/this.height-1);
				}
				//bottom
				if (!(i/4/this.height >= this.height)) {
					this.ctx.putImageData(imdata2, i/4%this.width,i/4/this.height+1);
				}
			}
		}
		//console.log([data[0], data[1], data[2], data[3]]);
	}

	this.pixEqual = function(arr, arr2) {
		for (var i = 0; i < 3; i+= 1) {
			if (arr[i] !== arr2[i]) return false;
		}
		return true;
	}

	this.setAs = function(arr, arr2) {
		for (var i = 0; i < arr.length; i+=1) {
			arr[i] = arr2[i];
		}
	}

	this.loop = function(self) {
		//console.log("l");
		var FPS = 10;
		if (requestAnimationFrame) {
			setTimeout(function() {
	        	requestAnimationFrame(function(){self.loop(self)});
	   		}, 1000 / FPS);
		}
		else {
			//console.log("REQUEST ANIMATION FRAME NOT SUPPORTED");
			setTimeout(function(){self.loop(self);}, 1000 / FPS);
		}

		//console.log(self);
		self.tick();
	}

	this.loop(this);
}