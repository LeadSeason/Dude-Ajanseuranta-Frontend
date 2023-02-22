import * as bootstrap from 'bootstrap';
import { alert, success, warning, danger } from "/js/message"
import { makeRequest } from "/js/utils"
import * as config from "/config"

var disableInput = false;

/**
 * Show errorMessage When input is invalid or server problems
 * @param {string} errorMessage 
 */
function invalidDataShowError(errorMessage) {
    const alert = document.getElementById("alert")
    document.getElementById("alertHeading").innerHTML = errorMessage

    alert.setAttribute("class", "fade show")

    setTimeout(function () {
        alert.setAttribute("class", "fade")
    }, 5000)
}

/**
 * Will log in to database using credentials in the fields
 */
async function login() {
    let loginbutton = document.getElementById("login");

    // save HTML to be changed back when login is done
    let loginButtonInnerHTML = loginbutton.innerHTML;

    let spinner = document.createElement("span");
    spinner.setAttribute("class", "spinner-border spinner-border-sm");
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-hidden", "true");

    loginbutton.innerHTML = "";
    loginbutton.append(spinner);
    loginbutton.disabled = true;
    disableInput = true;

    // Get values
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
        invalidDataShowError("A server error occurred.<br>Please contact the administrator.");
    }

    // Restore original data
    loginbutton.innerHTML = loginButtonInnerHTML;
    setTimeout(function () {
        loginbutton.disabled = false;
        disableInput = false;
    }, 200)
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
            if (!disableInput) {
                login();
            }
        }
    });
});