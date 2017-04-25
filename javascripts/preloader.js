function Preloader(arr_of_images, callback) {
	var self = this;
	this.count = arr_of_images.length;
	this.image_arr = [];
	this.done = false;
	this.finished_im_callback = function() {
		self.count = self.count - 1;
		if (self.count === 0) {
			self.done = true;
			callback(self.image_arr);
		}
	};
	for (var i=0; i < arr_of_images.length; i++) {
		var im = new Image();
		im.onload = this.finished_im_callback;
		im.src = arr_of_images[i];
		this.image_arr.push(im);
	}
}