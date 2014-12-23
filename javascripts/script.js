//Well hello, mobile broswers :)
window.navigator.vibrate([200, 100, 200]);

//TO DO:
//generalize code:
//  by making a remove element function
//  by cleaning up booleans


var pakdee = false;
var theo = false;
var resumeThere = false;

function show_image(src, target, width, height, alt, className, id) {
	var img = new Image();
	img.src = src;
	img.width = width;
	img.height = height;
	img.alt = alt;
	img.className = className;
	img.setAttribute("id", id);
	document.getElementById(target).appendChild(img);
	return img;
}

function resume() {/*
	var resId = "resumeImg";
	if (!resumeThere) {
		show_image("imgs/resume.pdf", "resume", 100, 100, "My sparkly clean resume, for your appraisal", "Here is where my resume will appear", resId);
	}
	else {
		var res = document.getElementById(resId);
		res.parentNode.removeChild(res);
	}
	resumeThere = !resumeThere;*/
	window.open("imgs/resume.pdf","_blank");
}

function change_hw(id, h, w) {
	document.getElementById(id).style.height = h;
	document.getElementById(id).style.width = w;
}

function show_pakdees() {
	var b = document.getElementById("pakbutton");
	var IMG_SIZE = 100;
	if (!pakdee) {
	show_image("imgs/pak1.jpg", "pakdeeWrapper", IMG_SIZE, IMG_SIZE, "A photo of Pakdee", "pakdee", "pakdee1");
	show_image("imgs/pak2.jpg", "pakdeeWrapper", IMG_SIZE, IMG_SIZE, "A photo of Pakdee", "pakdee", "pakdee2");
	show_image("imgs/pak3.jpg", "pakdeeWrapper", IMG_SIZE, IMG_SIZE, "A photo of Pakdee", "pakdee", "pakdee3");
	change_hw("pakdee1", 100,100);
	b.setAttribute('value', "Less Pakdee");
	} else {
		var one = document.getElementById("pakdee1");
		var two = document.getElementById("pakdee2");
		var three = document.getElementById("pakdee3");
		one.parentNode.removeChild(one);
		two.parentNode.removeChild(two);
		three.parentNode.removeChild(three);
		b.setAttribute("value", "More Pakdee");
	}
	pakdee = !pakdee;
};

function theotime() {
	if (theo) {
		deleteTheoCanvas();
	} else {makeTheoCanvas();}
	theo = !theo;
}

function makeTheoCanvas() {
	var theoDiv = document.getElementById("theoWrapper");
	var canvas = document.createElement('canvas');

	canvas.setAttribute("id", "theoCanvas");
	canvas.id = "theoCanvas";
	canvas.width = 600;
	canvas.height = 600;
	canvas.style.zIndex="1";
	canvas.style.left="0px";
	canvas.style.top="0px";

	var desiredHeight = 600;
	theoDiv.appendChild(canvas);
	var ctx = canvas.getContext("2d");
	var img = new Image();
	img.src = "imgs/theoHead.jpg";

	img.onload = function() {
		ctx.drawImage(img, (canvas.width-img.width)/2, (canvas.height-img.height)/2);
	}

	canvas.addEventListener('mouseenter', theoMouseOver, false);
	canvas.addEventListener('mouseleave', theoMouseOut, false);
	canvas.addEventListener('click', theoClick, false);
}

function theoMouseOver() {
	var canvas = document.getElementById("theoCanvas");
	var ctx = canvas.getContext("2d");
	//ctx.clearRect(0,0,canvas.width,canvas.height);
	var img = new Image();
	img.src = "imgs/theoHeadOpen.png";
	img.onload = function() {
		ctx.drawImage(img, (canvas.width-img.width)/2, (canvas.height-img.height)/2);
	}
	ctx.font = "20px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("click", 10, canvas.height-140);
	ctx.fillText("me", 10, canvas.height-110);
}

function theoMouseOut() {
	var canvas = document.getElementById("theoCanvas");
	var ctx = canvas.getContext("2d");
	//ctx.clearRect(0,0,canvas.width,canvas.height);
	//ctx.clearRect(10,canvas.height-180,100,100);
	var img = new Image();
	img.src = "imgs/theoHead.png";
	img.onload = function() {
		ctx.drawImage(img, (canvas.width-img.width)/2, (canvas.height-img.height)/2);
	}
	ctx.clearRect(0, canvas.height-200, 60, 120);
}

function theoClick(event) {
	var canvas = document.getElementById("theoCanvas");
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;
	var ctx = canvas.getContext("2d");
	var img = new Image();
	img.src = "imgs/birthdayflowers1.png";
	var IMGBOUND = 100
	img.onload = function() {
		ctx.drawImage(img, x-(IMGBOUND/2), y-(IMGBOUND/2), IMGBOUND, IMGBOUND);
	}
}

function deleteTheoCanvas() {
	var theoDiv = document.getElementById("theoWrapper");
	theoDiv.removeChild(document.getElementById("theoCanvas"));
	// theoDiv.removeChild(document.getElementById("theoCanvas2"));
}