on = true;

var english = function() {

	var id = 3995;
	var myKey = "M)BVAu6uV98hHLXr4b2i*w((";
	var OAuthDomain = "http://nicholasburka.github.io";
	var local = "file:///Users/nburka/Desktop/programming/web/javascript/nicholasburka.github.io/index.html";

	var NUM_ANSWERS = 3;

	SE.init({
	    clientId: id,
	    key: myKey,
	    channelUrl: OAuthDomain,
	    complete: function (data) {  }
	});

	function httpRequest(operation, url, onload, arg) {
		var http = new XMLHttpRequest();
		http.open(operation, url, true);
		http.onload = function() {
			onload(http.responseText, arg);
		};
		http.send();
	}

	function cleanAppend(response) {
		var resp = JSON.parse(response);
		var items = resp["items"].sort(sorte);
		var tmp = document.createElement("DIV");
		var tmp2 = document.createElement("DIV");
		var len;
		var sorted;
		for (var i = 0; i < items.length - 1; i++) {
			if (items[i]["answer_count"] > 0) {
				//Add the question
				tmp.innerHTML = items[i]["body"];
				div2.innerHTML = div2.innerHTML + "<li>" + "////Q: " + tmp.textContent + "<br><br>";

				//Sort the answers by score
				sorted = items[i]["answers"].sort(sorte);
				//If there are a lot of answers, only add the top three, else add all
				if (NUM_ANSWERS < items[i]["answers"].length) {
					len = NUM_ANSWERS;
				} else {
					len = items[i]["answers"].length;
				}

				//Add the content to document
				for (var j = 0; j < len; j++) {
					tmp2.innerHTML = sorted[j]["body"];
					div2.innerHTML = div2.innerHTML + "A: " + tmp2.textContent + "<br><br>";
				} 
			}
			div2.innerHTML = div2.innerHTML + "</li><br>";
		}
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
		return map;
	}

	//sorts array of objs by field
	function sorte(a, b) {
		return (a["score"] < b["score"]);
	}

	var div2 = document.getElementById("interestingEnglish");
	var button = document.getElementById("englishButton");
	if (on) {
		httpRequest("GET", "http://api.stackexchange.com/2.2/questions?sort=activity&order=desc&pagesize=10&site=english&filter=!b0OfNJc4Ohv7uP", cleanAppend, undefined);
		button.value="Less discussion";
	} else {
		div2.innerHTML = "";
		button.value="More English language discussion";
	}
	on = !on;

}