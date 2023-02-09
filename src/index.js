import * as bootstrap from 'bootstrap';
import * as token from "/js/token"
import * as message from "/js/message"
import * as config from "/config"

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logout").addEventListener("click", token.logout)
});