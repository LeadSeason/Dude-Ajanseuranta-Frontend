import * as bootstrap from 'bootstrap';

const BACKEND_URL = "http://192.168.192.12:8081";
console.log('Backend URL: ', BACKEND_URL);
let token;

function logout() {
    var token = getToken();
    var url = BACKEND_URL + "/logout"
    var http = new XMLHttpRequest();
    http.open('POST', url, false);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(JSON.stringify({
        "token": token
    }));

    var token = localStorage.removeItem("token");
    window.location.replace('/login/index.html');
}

function getToken() {
    var token = localStorage.getItem("token");
    
    // Dev
    // return token

    if (!token) {
        window.location.replace('/login/index.html');
        return
    }

    var url = BACKEND_URL + "/validate"
    var http = new XMLHttpRequest();
    http.open('POST', url, false);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(JSON.stringify({
        "token": token
    }));

    if (http.status == 200) {
        return token
    }
    window.location.replace('/login/index.html');
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("BootStrap verion:", bootstrap.Tooltip.VERSION);
    var token = getToken();
    document.getElementById("logout").addEventListener("click", logout)
});