import { alert, success, warning, danger } from "/js/message"
import { makeRequest } from "/js/utils"
import * as config from "/config"

export async function logout() {
    var data = await makeRequest('POST', config.LOGOUT_URL);
    if (data.status == 200) {
        new success("Success", "Logged out.").show();
        window.location.replace(config.PAGE.LOGIN);
    } else {
        new danger("Warning", "Unable to logout, Error: " + data.status);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var logoutButtons = document.getElementsByClassName("logout-button-functionality")
    for (let index = 0; index < logoutButtons.length; index++) {
        const element = logoutButtons[index];
        element.addEventListener('click', logout);
    }
});