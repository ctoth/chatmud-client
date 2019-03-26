
console.log("Running javascript");
let code = "";
let sender = null;
window.addEventListener("message", data => {
	console.log("Received: " + data.message);
	sender = data.source;
	let area = document.getElementById("code-area");
	// area.innerHTML = data.data;
let codeHTML = "";
let lines = data.data.split("\n");
for (const line of lines) {
codeHTML = codeHTML + line + "<br>";
}
area.innerHTML = codeHTML;
	area.focus();
});

function sendCode() {
	let code = document.getElementById("code-area").innerHTML;
	let lines = code.split("<br>");
	let sendLines = new Array();
	let curLine = 0;
	let tempLine = "";
	let checkLine = "";
	while (curLine < lines.length) {
		tempLine += lines[curLine];

						sendLines.push(tempLine);

		tempLine = "";
			curLine++;
				
			
			
	}
		
	
	code = "";
	for (let line of sendLines) {
		code += line + "\n";
	}
	
	window.opener.postMessage(code);
	window.close();
}
