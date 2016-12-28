window.navigator.vibrate([200, 100, 200]);
var clicked = false;
function show_image(src, target, width, height, alt, className, id) {
	var img = new Image();
	img.src = src;
	img.width = width;
	img.height = height;
	img.alt = alt;
	img.className = className;
	img.setAttribute("id", id);
	document[target].appendChild(img);
	return img;
	//document.body.insertBefore(img, document.getElementById(target).nextSibling);
	// document.write("<IMG + SRC=\"" + src + "\" width=" + width + " height=" + height + " alt=\"" + alt + "\">");
}
function change_hw(id, h, w) {
	document.getElementById(id).style.height = h;
	document.getElementById(id).style.width = w;
}

function show_pakdees() {
	var b = document.getElementById("pakbutton");
	if (!clicked) {
	clicked = true;
	show_image("imgs/pak1.jpg", "body", 100, 100, "A photo of Pakdee", "pakdee", "pakdee1");
	show_image("imgs/pak2.jpg", "body", 100, 100, "A photo of Pakdee", "pakdee", "pakdee2");
	show_image("imgs/pak3.jpg", "body", 100, 100, "A photo of Pakdee", "pakdee", "pakdee3");
	change_hw("pakdee1", 100,100);
	//b.parentNode.removeChild(b);
	//it works!
	b.setAttribute('value', "Less Pakdee");
	} else {
		clicked = false;
		var one = document.getElementById("pakdee1");
		var two = document.getElementById("pakdee2");
		var three = document.getElementById("pakdee3");
		one.parentNode.removeChild(one);
		two.parentNode.removeChild(two);
		three.parentNode.removeChild(three);
		b.setAttribute("value", "More Pakdee");
	}
};