import * as config from "/config"

/**
 * Token Module get and updates the token on page load
 * 
 */

export var token;

export function logout() {
    /**
     * Logout is used when logging out
     * This function is used as a callback for click event
     * document.getElementById("logout").addEventListener("click", token.logout);
     * Sends Request to remove token to backend and removes token from
     * localstorage regardless of outcome.
     */

    var http = new XMLHttpRequest();

    http.open('POST', config.LOGOUT);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(JSON.stringify({
        "token": token
    }));

    var token = localStorage.removeItem("token");

    // return to login page when token is removed
    window.location.replace(config.LOGIN_PAGE_URL);
}

export function getToken() {
    /**
     * Gets token from local storage and validates the token
     * Return to login page if token not present
     * Return to login page if token is not valid
     */

    var localToken = localStorage.getItem("token");

    if (!localToken) {
        window.location.replace(config.PAGE.LOGIN);
        return
    }

    token = localToken;

    var http = new XMLHttpRequest();
    http.open('POST', config.VALIDATE_URL);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.send(JSON.stringify({
        "token": localToken 
    }));
    
    http.onload = function () {
        if (http.status != 200) {
            if (location.pathname != config.PAGE.LOGIN) {
                window.location.replace(config.PAGE.LOGIN);
            }
        }
    }

    http.onerror = function () {
        if (location.pathname != config.PAGE.LOGIN) {
            window.location.replace(config.PAGE.LOGIN);
        }
    }

    http.onabort = function () {
        if (location.pathname != config.PAGE.LOGIN) {
            window.location.replace(config.PAGE.LOGIN);
        }
    }
}

getToken()