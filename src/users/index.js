import * as bootstrap from 'bootstrap';

const BACKEND_URL = "http://192.168.192.12:8081";
console.log('Backend URL: ', BACKEND_URL);
let token;


function logout() {
	getToken();
	var url = BACKEND_URL + "/logout"
	var http = new XMLHttpRequest();
	http.open('POST', url);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(JSON.stringify({
		"token": token
	}));

	var token = localStorage.removeItem("token");
	window.location.replace('/login/index.html');
}

function getToken() {
	var _token = localStorage.getItem("token");
	token = _token;

	// Dev
	// return token

	if (!_token) {
		window.location.replace('/login/index.html');
		return
	}

	var url = BACKEND_URL + "/validate"
	var http = new XMLHttpRequest();
	http.open('POST', url);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(JSON.stringify({
		"token": _token
	}));
	http.onload = function () {
		if (http.status != 200) {
			window.location.replace('/login/index.html');
		}
	}
}

function addUser() {
	var username = document.getElementById("usernameInput").value
	console.log(username)
	var url = BACKEND_URL + "/user/add"
	var http = new XMLHttpRequest();
	http.open('POST', url);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(JSON.stringify({
		"token": token
	}));
	http.onload = function () {
		location.reload();
	}
}

document.addEventListener("DOMContentLoaded", function () {
	console.log("BootStrap verion:", bootstrap.Tooltip.VERSION);
	var token = getToken();
	document.getElementById("logout").addEventListener("click", logout)
	// document.getElementById("adduserbutton").addEventListener("click", addUser);
});