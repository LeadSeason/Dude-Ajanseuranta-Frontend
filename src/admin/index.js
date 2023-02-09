import * as bootstrap from 'bootstrap';
import * as token from "/js/token"
import {alert, success, warning, danger} from "/js/message"
import {makeRequest} from "/js/utils"
import * as config from "/config"

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logout").addEventListener("click", logout)
});