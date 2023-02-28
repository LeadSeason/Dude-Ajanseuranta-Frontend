/**
 * Additional utils file
 * Has tools that are used in may places
 */
import { alert, success, warning, danger } from "/js/message"
import * as config from "/config"

/**
 * Make An asynchronous Request
 * @param {string} method Method of request example: 'GET' 'POST' 'OPTIONS'
 * @param {string} url Url of requested data: 'https://leadseason.eu'
 * @param {JSON} data Data (Optional) {"userId": 123}
 * 
 * @example GET request example
 * var data = await makeRequest('GET', 'https://example.com');
 * console.log(data.status) 
 * console.log(data.statusText)
 * console.log(data.body)
 * 
 * @example POST request example
 * var data = await makeRequest('GET', 'https://example.com/update', JSON.stringify({
 *     "username": "admin",
 *     "password": "p455w02d"
 * }));
 * console.log(data.status) 
 * console.log(data.statusText)
 * console.log(data.body)
 * 
 * @returns Promise()
 */
export function makeRequest(method, url, data = null) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.withCredentials = true;
        xhr.onload = function () {
            if (this.status == 401) {
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

/**
 * Show Basic Confirm alert Indicator
 * @param {String} Text 
 * @returns Bool
 * @example
 * if (alertConfirm(`Are you sure you want to delete ${user}`))
 * {
 *      delete(user)
 * }
 */
export function alertConfirm(Text) {
    return confirm(Text)
}