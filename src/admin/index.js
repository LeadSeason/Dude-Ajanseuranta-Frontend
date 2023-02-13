import * as bootstrap from 'bootstrap';
import { logout } from "/js/logout"
import { alert, success, warning, danger } from "/js/message"
import { makeRequest } from "/js/utils"
import * as config from "/config"

function invalidDataShowError(errorMessage) {
    document.getElementById("alert").innerHTML = `
      <div class="alert alert-danger" role="alert">
        <p class="alert-heading">` + errorMessage + `</p>
      </div>
        `
}

async function addUser() {
    let inputPass1 = document.getElementById("pass1").value;
    let inputPass2 = document.getElementById("pass2").value;
    let inputPass3 = document.getElementById("pass3").value;

    if (inputPass2 != inputPass3) {
        invalidDataShowError("Passwords dont match")
        return
    }

    var data = await makeRequest('POST', config.LOGIN_URL, JSON.stringify({
        "currentpass": inputPass1,
        "newpass": inputPass2,
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