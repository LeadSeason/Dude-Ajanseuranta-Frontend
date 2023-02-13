/**
 * Aditional utils file
 * Has tools that are used in may places
 */
import { alert, success, warning, danger } from "/js/message"
import * as config from "/config"


/**
 * Make A async request
 * example ```js
 * var data = await makeRequest('GET' url, requestData);
 * console.log(data.status) 
 * console.log(data.statusText)
 * console.log(data.body)
 * ```
 */
export function makeRequest(method, url, data = null) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.withCredentials = true;
        xhr.onload = function () {
            if (this.status == 401) {
                console.log(config.PAGE.LOGIN)
                window.location.replace(config.PAGE.LOGIN);
            } else {
                resolve({
                    status: this.status,
                    statusText: xhr.statusText,
                    body: xhr.response
                });
            }
        };
        xhr.onerror = function () {
            if (xhr.status == 401) {
                console.log(config.PAGE.LOGIN)
                window.location.replace(config.PAGE.LOGIN);
            } else {
                resolve({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    body: xhr.response
                });
            }
        };
        if (data) {
            xhr.send(data);
        } else {
            xhr.send();
        }
    });
}

export function alertConfirm(Text) {
    return confirm(Text)
}