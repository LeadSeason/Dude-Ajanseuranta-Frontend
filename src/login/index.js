import * as bootstrap from 'bootstrap';
import {alert, success, warning, danger} from "/js/message"
import {makeRequest} from "/js/utils"
import * as config from "/config"


function invalidDataShowError(errorMessage) {
    document.getElementById("alert").innerHTML = `
      <div class="alert alert-danger" role="alert">
        <p class="alert-heading">` + errorMessage + `</p>
      </div>
        `
}

function login() {
    console.log("Login in ... ")
    let inputUser = document.getElementById("username");
    let inputPass = document.getElementById("password");
    let inputRemb = document.getElementById("remember");

    var http = new XMLHttpRequest();

    http.open('POST', config.LOGIN_URL, true)
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.send(JSON.stringify({
        "username": inputUser.value,
        "password": inputPass.value,
        "remember": inputRemb.checked
    }));

    http.onload = function () {

        console.log(http.status);
        console.log(http.status == 200);
        console.log(http.responseText);
        if (http.status == 200) {
            var r = JSON.parse(http.responseText)
            localStorage.setItem("token", r.token);
            window.location.replace('/index.html');
        } else if (http.status == 401) {
            inputPass.value = "";
            invalidDataShowError("Invalid username or passworld.");
        } else {
            inputPass.value = "";
            invalidDataShowError("Server error, contact administrator.");
        }
    }

    http.onerror = function () {
        inputPass.value = "";
        invalidDataShowError("Server error, contact administrator.");
    }
}



document.addEventListener("DOMContentLoaded", function () {
    console.log("BootStrap verion:", bootstrap.Tooltip.VERSION);
    document.getElementById("login").addEventListener("click", login)
    var input = document.getElementById("root");

    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            login();
        }
    });
});