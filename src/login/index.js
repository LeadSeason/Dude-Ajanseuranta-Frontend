import * as bootstrap from 'bootstrap';
import {alert, success, warning, danger} from "/js/message"
import {makeRequest} from "/js/utils"
import * as config from "/config"


/**
 * Show errorMessage When input is invalid or server problems
 * @param {string} errorMessage 
 */
function invalidDataShowError(errorMessage) {
    document.getElementById("alert").innerHTML = `
      <div class="alert alert-danger" role="alert">
        <p class="alert-heading">` + errorMessage + `</p>
      </div>
        `
}

/**
 * Will log in to database using credentials in the fields
 */
async function login() {
    let inputUser = document.getElementById("username");
    let inputPass = document.getElementById("password");
    let inputRemb = document.getElementById("remember");

    var data = await makeRequest('POST', config.LOGIN_URL, JSON.stringify({
        "username": inputUser.value,
        "password": inputPass.value,
        "remember": inputRemb.checked
    }));

    if (data.status == 200) {
        window.location.replace('/index.html');
    } else if (data.status == 401) {
        // 401 Invalid password
        inputPass.value = "";
        invalidDataShowError("Invalid username or passworld.");
    } else {
        // any other show error
        inputPass.value = "";
        invalidDataShowError("Server error, contact administrator.");
    }
}


/**
 * Ran on page loads
 * Sets up EventListeners when change password button is pressed
 */
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login").addEventListener("click", login)
    // when enter is pressed call login() function.
    var input = document.getElementById("root");

    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            login();
        }
    });
});