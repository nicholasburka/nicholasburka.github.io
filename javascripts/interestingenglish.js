on = true;

var english = function() {
	/*var api = document.createElement("script");
	api.type = "text/javascript";
	api.src = "https://api.stackexchange.com/js/2.0/all.js";
	document.getElementById("wrapper").appendChild(api);
*/
	var id = 3995;
	var myKey = "M)BVAu6uV98hHLXr4b2i*w((";
	var OAuthDomain = "nicholasburka.github.io";
	var local = "file:///Users/nburka/Desktop/programming/web/javascript/nicholasburka.github.io/index.html";

	SE.init({
	    clientId: id,
	    key: myKey,
	    channelUrl: local,
	    complete: function (data) {  }
	});

	function addStuff(data) {
		//console.log(data);
		div2.innerHTML = div2.innerHTML + "<ul>";
		var items = data["items"];
		var tmp = document.createElement("DIV");
		var ids = [];
		var str = "http://api.stackexchange.com/2.2/questions/";
		for (var i = 0; i < items.length - 1; i ++) {
			ids[i] = items["post_id"];
			str += data["items"][i]["question_id"] + ";";
		}
		str += data["items"][items.length-1]["question_id"] + "/answers";
		str += "?site=english&pagesize=10&sort=creation&filter=withbody";
		//console.log(str);
		http = new XMLHttpRequest();
		http.open("GET", str, true);
		http.onload = function() {
			//console.log("SECOND REQUEST: " + http.responseText);
			step2(items, JSON.parse(http.responseText));
		}
		http.send();

	}

	function step2(items, response) {
		//console.log(response);
		var map = match(items, response["items"]);
		var tmp = document.createElement("DIV");
		var tmp2 = document.createElement("DIV");
		/*for (var i = 0; i < items.length; i ++) {
			tmp.innerHTML = items[i]["body"];
			tmp2.innerHTML = response["items"][i]["body"];
			div2.innerHTML = div2.innerHTML + "<li>" + (i + 1) + ". " + tmp.textContent + "<br><br>" + tmp2.textContent + "</li><p></p><br>";
		}*/
		//console.log(map);
		for (var q in map) {

			/*for (f in q) {
				//console.log(f);
			}*/
			//console.log(q);
			tmp.innerHTML = map[q]["q"];
			tmp2.innerHTML = map[q]["a"];
			if (map[q]["a"]) {
				//console.log(tmp.innerHTML);
				div2.innerHTML = div2.innerHTML + "<li>" + "////Q: " + tmp.textContent + "<br><br>A: " + tmp2.textContent + "///" + "</li><br>";
			}
		}/*
		for (int i = 0; i < map.length; i++) {
			tmp.innerHTML = map[i].q;
			tmp2.innerHTML = map[i].a;
			//console.log(tmp.innerHTML);
			div2.innerHTML = div2.innerHTML + "<li>" + tmp.textContent + "<br><br>" + tmp2.textContent + "</li><br>";
		}*/
		div2.innerHTML = div2.innerHTML + "</ul>"
	}

	function match(questions, answers) {
		var map = {};
		for (var i = 0; i < questions.length; i++) {
			map["a" + questions[i]["question_id"]] = {}
			map["a" + questions[i]["question_id"]]["q"] = questions[i]["body"];
		}
		for (var j = 0; j < answers.length; j++) {
			map["a" + answers[j]["question_id"]]["a"] = answers[j]["body"];
		}
		//console.log(map);
		return map;
	}

	function convertHtmlToText(input) {
    var inputText = input
    var returnText = "" + inputText;

    //-- remove BR tags and replace them with line break
    returnText=returnText.replace(/<br>/gi, "\n");
    returnText=returnText.replace(/<br\s\/>/gi, "\n");
    returnText=returnText.replace(/<br\/>/gi, "\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText=returnText.replace(/<p.*>/gi, "\n");
    returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    returnText=returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g,'');

    //-- get rid of html-encoded characters:
    returnText=returnText.replace(/&nbsp;/gi," ");
    returnText=returnText.replace(/&amp;/gi,"&");
    returnText=returnText.replace(/&quot;/gi,'"');
    returnText=returnText.replace(/&lt;/gi,'<');
    returnText=returnText.replace(/&gt;/gi,'>');

    //-- return
    return returnText;
}

	var xmlHttp = null;
	var div2 = document.getElementById("interestingEnglish");
	if (on) {
		document.getElementById("interestingEnglish").style = "visibility = visible";
	} else {
		document.getElementById("interestingEnglish").style = "visibility = hidden";
	}
	on = !on;
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "http://api.stackexchange.com/2.2/questions?sort=votes&order=desc&pagesize=10&max=15&site=english&filter=withbody", true );
	xmlHttp.responseType = ""
	xmlHttp.onload = function () {
		addStuff(JSON.parse(xmlHttp.responseText));
	}
	xmlHttp.send();

}