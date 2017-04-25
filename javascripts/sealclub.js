//SEALCLUBBIN' JON - THE GAME
//COPYRIGHT 2014-2016 NICHOLAS BURKA
//WITH HELP FROM PAKDEE, PAUL, THEO AND OTHERS

//TO DO:
//  make Jon able to crouch / make image of Jon crouching
//  make score visible
//  make seals die

//LOW PRIORITY TO DO:
//  make global variables not that anymore
//  add start screen (low priority)

//DONE:
//	change setInterval to requestanimationframe √
//  change collisions to reflect direction of collision and alter dx, dy accordingly √ sort  of
//  make Jon's face light up when he hits a seal √
//  multiple seals √
//  image preloading √

var canvas,
	ctx,
	player,
	entities,
	score = 0,
	FPS = 45,
	SCALE = 1,
	loaded = false,
	numImgs = 0,
	numLoaded = 0;
	IMG_FILEPATH = "imgs/seal-club-assets/",
	GAME_OVER = false; //const

if (!Math.sign) {
	var sign = function(x) {return x>0?1:x<0?-1:x;};
}
else {
	var sign = function(x) {return Math.sign(x);};
}

function load(imag) {
	numImgs++;
	imag.onload = function() {numLoaded++;};
};

function dist(x1, y1, x2, y2) {
	return Math.sqrt((x1 + x2)^2 + (y1 + y2)^2);
};

function Timer(spec) {
	this.date = undefined; //holds new Date() instances
	this.startTime = undefined; //holds seconds 
	this.currentTime = undefined; //holds seconds
	this.duration = spec.duration; //duration is amount of seconds desired, start time

	this.reset = function() {
		this.date = new Date();
		this.startTime = Date.now();//this.date.getHours()*360 + this.date.getMinutes()*60 + this.date.getSeconds() + this.date.get;
		this.currentTime = Date.now();//this.date.getHours()*360 + this.date.getMinutes()*60 + this.date.getSeconds();
	};

	this.timeIsUp = function() {
		this.date = new Date();
		this.currentTime = Date.now();//this.date.getHours()*360 + this.date.getMinutes()*60 + this.date.getSeconds();
		return (this.startTime <= (this.currentTime - this.duration));
	};
};

function ImageLoader(arr) {
	this.images = [];
	this.loadedImages = [];
	if (arr) {

	}
	//load an image from an arbitrary source and return it
	this.loadImageByRelativePath = function(path) {
		var img = new Image();
		img.src = IMG_FILEPATH + path;
		img.onload = this.moveImage;
	};
}


function Player(spec) {
	//IMAGES
	var img = new Image();
	img.src = IMG_FILEPATH + "jon-bod.png";
	this.body = spec.body;
	var army = new Image();
	army.src = IMG_FILEPATH + "jon-arm-club.png";
	this.arm = spec.arm;
	var img2 = new Image();
	img2.src = IMG_FILEPATH + "jon-bod-happy.png";
	this.bodyHappy = spec.bodyHappy;
	this.currentBody = "body";
	var img3 = new Image();
	img3.src = IMG_FILEPATH + "dot.png";
	this.dot = spec.dot;

	//MOVEMENT
	//amount x should change per tick
	this.MOVEPERTICK = 13;
	this.dx = 0;
	this.dy = 0;

	//BODY
	this.bodyX = 0;
	this.bodyY = 0;

	//ARM
	//amount arm must be displaced to be properly located on image of Jon
	this.ARMXBUFFER = 100;
	this.ARMYBUFFER = 230;
	this.armX = this.bodyX + this.ARMXBUFFER/SCALE;
	this.armY = this.bodyY + this.ARMYBUFFER/SCALE;
	this.armAngle = 0;
	//used in drawing rotated arm
	this.armXAdjustment = 30;
	this.armYAdjustment = 30;

	//COLLISION
	//collision stuff
	this.clubBufferX = 16*this.arm.width/10 / SCALE;
	this.clubBufferY = 200/SCALE;//7*this.arm.width/10 / SCALE;
	this.lastCollisionX;
	this.lastCollisionY;
	this.collisionX;
	this.collisionY;
	this.wasColliding = false;
	this.colliding = false;
	this.collideTimer = new Timer({duration: 50});
	this.faceTimer = new Timer({duration: 1000});
	this.collideTimer.reset();
	this.faceTimer.startTime = Date.now() - this.faceTimer.duration;

	//updates the body's position based on keypress input
	this.keyDown = function(e) {
		var keyCode = e.keyCode;

		switch (keyCode) {
			case 65: {
				player.dx = (-1)*player.MOVEPERTICK;
				break;
			}
			case 37: {
				player.dx = (-1)*player.MOVEPERTICK;
				break;
			}
			case 39: {
				player.dx = player.MOVEPERTICK;
				break;
			}
			case 68: {
				player.dx = player.MOVEPERTICK;
				break;
			}
			case 69: {
				player.currentBody = "bodyHappy";
				break;
			}
			case 81: {
				player.currentBody = "body";
				break;
			}
		}
	}

	this.keyUp = function(e) {
		var keyCode = e.keyCode;

		switch (keyCode) {
			case 65: {
				player.dx = 0;
				break;
			}
			case 37: {
				player.dx = 0;
				break;
			}
			case 39: {
				player.dx = 0;
				break;
			}
			case 68: {
				player.dx = 0;
				break;
			}
			case 69: {
				break;
			}
			case 81: {
				break;
			}
		}
	};


	this.updateBody = function() {
		this.bodyX = this.bodyX + this.dx;
		this.bodyY = this.bodyY + this.dy;
		if (this.colliding) {
			this.faceTimer.reset();
		}
		if (this.colliding || !(this.faceTimer.timeIsUp())) {
			this.currentBody = "bodyHappy";
		}
		else {
			this.currentBody = "body";
		}
	};

	this.update = function() {
		this.updateBody();
		this.updateArm();
	};

	function mat_mult(B, A) {
		var M = [[0,0,0],[0,0,0],[0,0,0]];
		for (var i = 0; i < 3; i ++) {
		for (var j = 0; j < 3; j ++) {
			var total = 0;
			for (var k = 0; k < 3; k ++) {
				total = total + A[i][k] * B[k][j];
			}
			M[i][j] = total;
		}
	}
		return M;
	};

	function vecmat_mult(B, A) {
		var Bp = [0,0,0];
		for (var i = 0; i < 3; i ++) {
			var total = 0;
			for (var k = 0; k < 3; k ++) {
				total = total + A[i][k] * B[k];
			}
			Bp[i] = total;
		}		
		return Bp;
	};

	function updateCollisionPoint() {

		//object: locations with respect to the Object
		var object_x = -140;
		var object_y = 5;
		// xxx immoral copying of code
		var new_origin_x = player.armX + player.arm.width/SCALE - player.armXAdjustment/SCALE;
		var new_origin_y = player.armY + player.armYAdjustment/SCALE;
		var theta = -player.armAngle;

		var object_vec = [object_x, object_y, 1];
		var translate_mat = [ [ 1, 0, new_origin_x ],
		                      [ 0, 1, new_origin_y ],
		                      [ 0, 0,            1 ]];
		var rotate_mat = [ [  Math.cos(theta), Math.sin(theta), 0 ],
		          	       [ -Math.sin(theta), Math.cos(theta), 0 ],
		            	   [                0,               0, 1 ]];
		var combined_mat = mat_mult(rotate_mat,translate_mat);
		var draw_vec = vecmat_mult(object_vec, combined_mat);
		
		//draw: locations with respect to the Canvas
		var draw_x = draw_vec[0];
		var draw_y = draw_vec[1];
		if (player.collideTimer.timeIsUp()) {
			player.lastCollisionX = player.collisionX;
			player.lastCollisionY = player.collisionY;
			player.collideTimer.reset();
		}
		player.collisionX = draw_x;
		player.collisionY = draw_y;
	};

	//updates the arms X and Y positions every timestep
	this.updateArm = function() {
		player.armX = player.bodyX + player.ARMXBUFFER/SCALE;
		player.armY = player.bodyY + player.ARMYBUFFER/SCALE;
		updateCollisionPoint();
	};

	//makes player.armAngle number of radians to rotate image on mousemove
	this.updateArmAngle = function(e) {
		var rect = document.getElementById("sealClubbinJon").getBoundingClientRect();
		var x = e.clientX - rect.left;
		var y = e.clientY - rect.top;
		var rad = Math.atan2((player.bodyY+player.ARMYBUFFER/SCALE-y),(player.bodyX+player.ARMXBUFFER/SCALE+player.arm.width/SCALE-x));
		player.armAngle = rad;
		updateCollisionPoint();
	};

	//draw the body
	this.drawBody = function() {
		ctx.drawImage(player[player.currentBody],
					player.bodyX,
					player.bodyY,
					player.body.width/SCALE,
					player.body.height/SCALE);
	};

	//draw the arm, rotated the correct number of radians and positioned on Jon's shoulder
	this.drawArmRot = function() {
		//save normal canvas context
		ctx.save();

		//translate canvas to the middle of jon's shoulder, 
		//with slight adjustment because of way the arm img is bounded
		ctx.translate(this.armX + player.arm.width/SCALE - this.armXAdjustment/SCALE,
					  this.armY + this.armYAdjustment/SCALE);

		//rotate by armAngle
		ctx.rotate(player.armAngle);

		//since img is drawn with 0,0 at top left corner, offset by width + adjustment
		//for x and offset by y adjustment for y, and draw to scaled width and height
		ctx.drawImage(player.arm,
						-player.arm.width/SCALE+this.armXAdjustment/SCALE,
						-this.armYAdjustment/SCALE,
						player.arm.width/SCALE,
						player.arm.height/SCALE);

		//normality restored
		ctx.restore();
	};

	//draw the collision dot at calculated location
	this.drawDot = function() {
		ctx.drawImage(player.dot, player.collisionX, player.collisionY);
		ctx.drawImage(player.dot, player.lastCollisionX, player.lastCollisionY);
	};

	this.draw = function() {
		this.drawBody();
		this.drawArmRot();
		//this.drawDot();
	};

};


function Seal(spec) {

	this.img = spec.seal;

	this.sealScale = 2;
	this.x = 0;
	this.y = canvas.height - this.img.height/this.sealScale/SCALE;
	this.dx = 0;
	this.dy = 0;

	//constants
	this.XDECAY = .2;
	this.YDECAY = .5;
	this.DECAY = .2;
	this.RANDOMMOVEMENTBOUNDX = 15;
	this.RANDOMMOVEMENTBOUNDY = 30;
	this.RANDOMMOVEMENTBOUND = 10;

	//states
	this.RANDOM = 0;
	this.ESCAPE = 1;
	this.state = this.RANDOM;

	//collision stuff
	this.colliding = false;
	var dxdy;
	this.update = function() {
		if (this.colliding) {
			//this.dx = this.getCollisionDx();
			//this.dy = this.getCollisionDy();
			//console.log("COLLIDING");
			//dxdy = this.calculateCollisionBounce();
			//this.dx = -this.dx//this.getRandomMovement(this.RANDOMMOVEMENTBOUNDX);
			//this.dy = -this.dy//this.getRandomMovement(this.RANDOMMOVEMENTBOUNDY);
			this.bounce();
		}
		else if (this.isStationary()) {
			this.dx = this.getRandomMovement(this.RANDOMMOVEMENTBOUNDX);
			this.dy = this.getRandomMovement(this.RANDOMMOVEMENTBOUNDY);
		}
		////////
		if (this.dx + this.x > canvas.width - this.img.width/this.sealScale/SCALE) {
			this.x = canvas.width - this.img.width/this.sealScale/SCALE;
			this.dx = 0;
		} 
		else if (this.dx + this.x < 0) {
			this.x = 0;
			this.dx = 0;
		}
		/////////
		if (this.dy + this.y < 0) {
			this.y = 0;
			this.dy = 0;
		}
		else if (this.dy + this.y > canvas.height - this.img.height/this.sealScale/SCALE) {
			//console.log("happening");
			this.y = canvas.height - this.img.height/this.sealScale/SCALE;
			this.dy = 0;
		}

		this.x += this.dx;
		this.y += this.dy;

		//decay vals
		this.decayMovement();
	};

	this.draw = function() {
		ctx.drawImage(this.img,this.x,this.y,this.img.width/this.sealScale/SCALE,this.img.height/this.sealScale/SCALE);
	};

	this.calculateCollisionBounce = function() {

		var result = [];
	}
	this.bounce = function() {
		this.dx = player.collisionX - player.lastCollisionX;
		this.dy = player.collisionY - player.lastCollisionY;
	}
    //unused
	this.isOnGround = function() {
		var result = (this.y >= (canvas.height - this.img.height/SCALE - this.DECAY/SCALE));
		return result;
	};

	this.decayMovement = function() {
		if (this.state === this.RANDOM) {
			this.dx = sign(this.dx)*(Math.abs(this.dx-this.DECAY/SCALE));
			this.dy = this.dy + this.YDECAY; //always + YDECAY because gravity
		}
		else {

		}
	};

	this.getRandomMovement = function(bound) {
		var theSign = Math.random() < .5 ? -1 : 1;
		return theSign*Math.floor(Math.random()*bound);
	};

	this.isStationary = function() {
		var result = ( (Math.abs(this.dx) - .2 < 0) && (Math.abs(this.dy) - .7 < 0) && 
							(this.y >= (canvas.height - this.img.height/SCALE - this.YDECAY)) );
		return result;
	};

	this.contains = function(ex, why) {
		var x = this.x;
		var y = this.y;
		var width = this.img.width/this.sealScale/SCALE;
		var height = this.img.height/this.sealScale/SCALE;
		return (((ex >= x) && (ex <= x+width))
				&&
				((why >= y) && (why <= y+height)));
	};
};

function init() {
	var div = document.getElementById("sealWrapper");
	canvas = document.createElement("canvas");
	canvas.id = "sealClubbinJon";
	canvas.height = 600;
	canvas.width = 1000;
	div.appendChild(canvas);
	ctx = canvas.getContext("2d");

	var images = ["jon-bod.png", "jon-arm-club.png", "jon-bod-happy.png", "dot.png", "seal.png",]
	images = images.map(function(x) {return IMG_FILEPATH + x;})
	var loader = new Preloader(images, init_done);
};

function init_done(image_arr) {
	var image_spec = {}
	image_spec["body"] = image_arr[0];
	image_spec["arm"] = image_arr[1];
	image_spec["bodyHappy"] = image_arr[2];
	image_spec["dot"] = image_arr[3];
	image_spec["seal"] = image_arr[4];

	player = new Player(image_spec);
	var testSeal = new Seal(image_spec);
	var seal2 = new Seal(image_spec);

	entities = [player, testSeal, seal2];

	window.addEventListener("keydown",player.keyDown, false);
	window.addEventListener("keyup",player.keyUp, false);
	window.addEventListener("mousemove",player.updateArmAngle,false);


	
	//begin game loop
	gameLoop();
};

function draw(entities, canvas, ctx) {
	//erase
	ctx.clearRect(0,0,canvas.width,canvas.height);

	//then draw all
	for (var i = 0; i < entities.length; i++) {
		entities[i].draw();
	}
};

function update() {

	for (var i = 0; i < entities.length; i++) {
		entities[i].update();
	}

	//gameController.update();
	//-->would decide whether to add new seals or not, randomly and based on counter
};

function collisionCheck() {
	var PLAYER = 0;

	var COLLISION_CLUB_X = player.collisionX;
	var COLLISION_CLUB_Y = player.collisionY;
	var counter = 0;

	entities[PLAYER].wasColliding = entities[PLAYER].colliding;

	//assumes that all entities of entities[1] or greater have .contains(x, y)
	for (var i = 1; i < entities.length; i++) {
		if (entities[i].contains(COLLISION_CLUB_X, COLLISION_CLUB_Y)) {
			entities[i].colliding = true;
			counter++;
		} else entities[i].colliding = false;
	}
	if (counter > 0) {
		entities[PLAYER].colliding = true;
	} else entities[PLAYER].colliding = false;

	if (entities[PLAYER].wasColliding && !(entities[PLAYER].colliding)) {
		score++;
		console.log(score);
	}
};

function gameLoop() {
	if (GAME_OVER) {
		return;
	}
	else if (requestAnimationFrame) {
		setTimeout(function() {
        	requestAnimationFrame(gameLoop);
   		}, 1000 / FPS);
	}
	else {
		console.log("REQUEST ANIMATION FRAME NOT SUPPORTED");
		setTimeout(gameLoop, 1000 / FPS);
	}

	collisionCheck();
    update();
    draw(entities, canvas, ctx);
};

//init();