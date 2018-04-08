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
	window.opener.postMessage(code);
	window.close();
}