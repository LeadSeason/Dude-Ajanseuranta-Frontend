import * as bootstrap from 'bootstrap';
import { logout } from "/js/logout"
import { alert, success, warning, danger } from "/js/message"
import { makeRequest } from "/js/utils"
import * as config from "/config"

/**
 * Show errorMessage When input is invalid or server problems
 * @param {string} errorMessage 
 */
function invalidDataShowError(errorMessage) {
    document.getElementById("alert").innerHTML = `
      <div class="alert alert-danger fade" role="alert">
        <p class="alert-heading">` + errorMessage + `</p>
      </div>
        `
}

/**
 * Changes password when called
 * Takes given password from pass fields
 * and checks if new pass matches new pass again
 * 
 * Only return if error
 * @returns None
 */
async function changePassword() {
    let inputPass1 = document.getElementById("pass1").value;
    let inputPass2 = document.getElementById("pass2").value;
    let inputPass3 = document.getElementById("pass3").value;

    if (inputPass2 != inputPass3) {
        invalidDataShowError("Passwords dont match")
        return
    }

    var data = await makeRequest('POST', config.CHANGE_PASSWORD_URL, JSON.stringify({
        "currentpass": inputPass1,
        "newpass": inputPass2,
    }));

    if (data.status == 200) {
        window.location.replace('/index.html');
    } else if (data.status == 401) {
        // 401 Invalid password
        inputPass1 = "";
        inputPass2 = "";
        inputPass3 = "";
        invalidDataShowError("Invalid username or passworld.");
    } else {
        // any other show error
        inputPass1 = "";
        inputPass2 = "";
        inputPass3 = "";
        invalidDataShowError("Server error, contact administrator.");
    }

}

async function addAdministrator() {
    let mail = document.getElementById("add-email").value;
    let pass = document.getElementById("add-pass").value;

    var data = await makeRequest('POST', config.ADMIN.ADD_URL, JSON.stringify({
        "username": mail,
        "password": pass
    }));

    if (data.status == 200) {
        new success("Success", "Added new user: " + mail + ".").show();
        mail = "";
        pass = "";
    } else {
        new danger("Fail", "Unable to add new administrator account. Status Code: " + data.status + ". Body: " + data.body + "")
    }
}

async function getAdministrators() {
    var data = await makeRequest('GET', config.ADMIN.GET_ALL_URL);
    
    if (data.status != 200) {
        new danger("Fail", "Failed to get administrators");
        return;
    }
    var administraots = JSON.parse(data.body);

    renderAdministrator(administraots);
}

async function renderAdministrator(admins) {
    var adminList = document.getElementById("adminList");
    console.log(admins);
    for (let i = 0; i < admins.length; i++) {
        const admin = admins[i];

        var idBadge = document.createElement("span");
        idBadge.setAttribute("class", "me-2")
        idBadge.textContent = admin.id + ".";
       
        var listItem = document.createElement("li");
        listItem.setAttribute("class", "list-group-item d-flex align-items-start")
        listItem.textContent = admin.name;
        listItem.prepend(idBadge);

        adminList.append(listItem);
    }
}

/**
 * Ran on page loads
 * Sets up EventListeners when change password button is pressed
 */
document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById("changePassword").addEventListener("click", changePassword)
    document.getElementById("addAccount").addEventListener("click", addAdministrator)

    getAdministrators();


    // when enter is pressed call login() function.
    /* 
    * @TODO Make CLicking on current 
    * 
    * @CODE
    * var input = document.getElementById("root");
    * 
    * input.addEventListener("keypress", function (event) {
    *     if (event.key === "Enter") {
    *         event.preventDefault();
    *         changePassword();
    *     }
    * });
    * 
    * function clickPress(event) {
    *     if (event.key == "Enter") {
    *         // do something
    *     }
    * }
    * @ENDCODE
    */
});