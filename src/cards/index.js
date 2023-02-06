import * as bootstrap from 'bootstrap';

const BACKEND_URL = "http://192.168.192.12:8081";
console.log('Backend URL: ', BACKEND_URL);
let token;
let CardReadingCanceled = false;
let readCardButton, readCardButtonCancel;
let doneCanceling = true;
let countTime = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logout() {
    getToken();
    var url = BACKEND_URL + "/logout"
    var http = new XMLHttpRequest();
    http.open('POST', url);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(JSON.stringify({
        "token": token
    }));

    var token = localStorage.removeItem("token");
    window.location.replace('/login/index.html');
}

function getToken() {
    var _token = localStorage.getItem("token");
    token = _token;

    // Dev
    // return token

    if (!_token) {
        window.location.replace('/login/index.html');
        return
    }

    var url = BACKEND_URL + "/validate"
    var http = new XMLHttpRequest();
    http.open('POST', url);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(JSON.stringify({
        "token": _token
    }));
    http.onload = function () {
        if (http.status != 200) {
            window.location.replace('/login/index.html');
        }
    }
}

async function setReadingMode() {
    if (!doneCanceling) {
        return
    }
    CardReadingCanceled = false;
    var timer = document.getElementById("readCardTimer");
    var minutes, seconds;
    if (countTime != 0) {
        countTime = 300;
        minutes = Math.floor(countTime / 60);
        seconds = Math.round(countTime - minutes * 60);
        if (String(seconds).length == 1) {
            seconds = "0" + String(seconds);
        }

        timer.innerHTML = "Reading card for " + minutes + ":" + seconds;
        return
    }
    countTime = 300;
    while (countTime > 0 && !CardReadingCanceled) {
        minutes = Math.floor(countTime / 60);
        seconds = Math.round(countTime - minutes * 60);
        if (String(seconds).length == 1) {
            seconds = "0" + String(seconds);
        }

        timer.innerHTML = "Reading card for " + minutes + ":" + seconds;
        await sleep(1000);
        if (!doneCanceling) {
            doneCanceling = true;
            return
        }
        countTime--;
    }
    timer.innerHTML = ""
}

function cancelReadingMode() {
    CardReadingCanceled = true;
    doneCanceling = false;
    var timer = document.getElementById("readCardTimer");
    timer.innerHTML = ""
    countTime = 0;
}

function loadCards() {
    var url = BACKEND_URL + "/getcardlist"
    var http = new XMLHttpRequest();
    http.open('POST', url);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(JSON.stringify({
        "token": token
    }));
    http.onload = function () {
        
        if (http.status == 200) {
            var cardList = document.getElementById("cardList")
            var r = JSON.parse(http.responseText)
            cardList.innerHTML = ""; 
            var border = ""

            for(let i = 0; i < r.length; i++) {
                let obj = r[i];
                if (i == r.length - 1 ) {
                    var border = "border-bottom"
                }

            cardList.innerHTML += `
 		<div class="row text-light fs-5 justify-content-center border-2 border-secondary">
			<div class="col-1 border-start border-top `+ border +`">
                `+ obj.cardid +`
			</div>
			<div class="col-3 border-start border-top `+ border +`">
                <input id="newCardName`+ i +`" class="form-control-plaintext border-none text-light bg-body" placeholder="`+ obj.cardname +`" />
			</div>
			<div class="col-1 border-top `+ border +`">
				<button class="renameCardClass btn btn-link"><i class="fa fa-arrow-right"></i></button>
			</div>
			<div class="col-4 border-start border-top `+ border +`">
                `+ obj.assingedto +`
			</div>
			<div class="col-1 border-start border-top border-end `+ border +` ">
				<button class="removeCardClass btn btn-link"><i class="fa fa-close"></i></button>
			</div>
		</div>
            `
            }

            var removeCards = document.getElementsByClassName("removeCardClass")
            for (let i = 0; i < removeCards.length; i++) {
                removeCards[i].addEventListener('click', (self) => {
                    console.log("h", i + 1)
                });
            }
            var newCardNames = document.getElementsByClassName("renameCardClass")
            for (let i = 0; i < removeCards.length; i++) {
                newCardNames[i].addEventListener('click', (self) => {
                    console.log(document.getElementById("newCardName" + i).value)
                });
            }
        }
    }
}

function removeCard(evt)
{
    console.log("cardRemoved", evt.currentTarget.cardId)
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("BootStrap verion:", bootstrap.Tooltip.VERSION);
    getToken();
    console.log("Token: ", token)
    document.getElementById("logout").addEventListener("click", logout)

    loadCards(token);
    readCardButton = document.getElementById("readCardButton");
    readCardButton.addEventListener("click", setReadingMode);
    refresh = document.getElementById("refresh");
    refresh.addEventListener("click", loadCards);
    readCardButtonCancel = document.getElementById("readCardButtonCancel");
    readCardButtonCancel.addEventListener("click", cancelReadingMode);
});