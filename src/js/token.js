import * as config from "/config"

export var token;

export function logout() {
    var http = new XMLHttpRequest();
    http.open('POST', config.LOGOUT);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(JSON.stringify({
        "token": token
    }));

    var token = localStorage.removeItem("token");
    window.location.replace(config.LOGIN_PAGE_URL);
}

export function getToken() {
    var localToken = localStorage.getItem("token");
    token = localToken;

    if (!localToken) {
        window.location.replace(config.PAGE.LOGIN);
        return
    }

    var http = new XMLHttpRequest();
    http.open('POST', config.VALIDATE_URL);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(JSON.stringify({
        "token": localToken 
    }));
    
    http.onload = function () {
        if (http.status != 200) {
            window.location.replace(config.PAGE.LOGIN);
        }
    }

    http.onerror = function () {
        window.location.replace(config.PAGE.LOGIN);
    }

    http.onabort = function () {
        window.location.replace(config.PAGE.LOGIN);
    }
}

getToken()