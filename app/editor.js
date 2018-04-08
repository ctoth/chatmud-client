console.log("Running javascript");
let code = "";
let sender = null;
window.addEventListener("message", data => {
	console.log("Received: " + data.message);
	sender = data.source;
	let area = document.getElementById("code-area");
	area.value = data.data;
});

function sendCode() {
	let code = document.getElementById("code-area").value;
	let lines = code.split("\n");
	let sendLines = new Array();
	let curLine = 0;
	let tempLine = "";
	while (curLine < lines.length) {
		tempLine += lines[curLine];
		if (!tempLine.startsWith("//")) {
				if (tempLine.endsWith(";")) {
				sendLines.push(tempLine);
				tempLine = "";
				} else {
					tempLine = tempLine.replace("\n", "");
				}
		} else {
			sendLines.push(tempLine);
		}
		
			curLine++;
				
			
			
	}
		
	
	code = "";
	for (let line of sendLines) {
		code += line + "\n";
	}
	
	window.opener.postMessage(code);
	window.close();
}