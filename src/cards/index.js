import * as bootstrap from 'bootstrap';
import * as token from "/js/token"
import {alert, success, warning, danger} from "/js/message"
import {makeRequest} from "/js/utils"
import * as config from "/config"

let CardReadingCanceled = false;
let readCardButton, readCardButtonCancel;
let doneCanceling = true;
let countTime = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setReadingMode() {
    if (!doneCanceling) {
        return
    }
    CardReadingCanceled = false;

	var http = new XMLHttpRequest();

	http.open('POST', config.CARD.SET_READING_MODE_URL);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(JSON.stringify({
		"token": token.token,
	}));

	http.onload = cardReadingModeTimer;

    http.onerror = function () {
        console.log("Unable to set reading mode");
        new danger("Warning", "Unable to set reading mode").show();
	}
}

async function cardReadingModeTimer() {
    if (countTime != 0) {
        displayTime(countTime)
        return
    }
    countTime = 300;
    while (countTime > 0 && !CardReadingCanceled) {
        displayTime(countTime)

        await sleep(1000);
        if (!doneCanceling) {
            doneCanceling = true;
            return
        }
        countTime--;
    }

    var timer = document.getElementById("readCardTimer");
    timer.innerHTML = ""
}

async function displayTime(seconds) {
    var timer = document.getElementById("readCardTimer");
    var minutes;

    minutes = Math.floor(countTime / 60);
    seconds = Math.round(countTime - minutes * 60);
    if (String(seconds).length == 1) {
        seconds = "0" + String(seconds);
    }

    timer.innerHTML = "Reading card for " + minutes + ":" + seconds;
}

function cancelReadingMode() {
	var http = new XMLHttpRequest();

	http.open('POST', config.CARD.CANCEL_READING_MODE_URL);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(JSON.stringify({
		"token": token.token,
	}));

	http.onload = function () {
        CardReadingCanceled = true;
        doneCanceling = false;
        var timer = document.getElementById("readCardTimer");
        timer.innerHTML = ""
        countTime = 0;
    }

    http.onerror = function () {
        console.log("Unable to stop Reading mode");
        new danger("Warning", "Unable to stop Reading mode").show();
	}
}

function loadCards() {
    var http = new XMLHttpRequest();
    http.open('POST', config.CARD.GET_URL);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(JSON.stringify({
        "token": token.token
    }));
    http.onload = function () {
        
        if (http.status == 200) {
            var cardList = document.getElementById("cardList")
            var r = JSON.parse(http.responseText)
            cardList.innerHTML = ""; 
            var border = ""

			if (r == null) {
				return
			}

            for(let i = 0; i < r.length; i++) {
                let obj = r[i];
                if (i == r.length - 1 ) {
                    var border = "border-bottom"
                }

            cardList.innerHTML += `
 		<div class="row text-light fs-5 justify-content-center border-2 border-secondary">
			<div class="col-3 border-start border-top `+ border +`">
                <input id="newCardName`+ i +`" class="form-control-plaintext border-none text-light bg-body" placeholder="`+ obj.cardname +`" />
			</div>
			<div class="col-1 border-top `+ border +`">
				<button id="`+ obj.cardid +`" class="renameCardClass btn btn-link"><i class="fa fa-arrow-right"></i></button>
			</div>
			<div class="col-4 border-start border-top `+ border +`">
                `+ obj.assingedto +`
			</div>
			<div class="col-1 border-start text-center border-top border-end `+ border + ` ">
				<button id=`+ obj.cardid +` class="removeCardClass btn btn-link text-danger"><i class="fa fa-trash-can"></i></button>
			</div>
		</div>
            `
            }

            var removeCards = document.getElementsByClassName("removeCardClass")
            for (let i = 0; i < removeCards.length; i++) {
                removeCards[i].addEventListener('click', (self) => {
					let id = removeCards[i].id;
					console.log("removing id:", id);

					var http = new XMLHttpRequest();

					// send remove request
					http.open('POST', config.CARD.REMOVE_URL);
					http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					http.send(JSON.stringify({
						"token": token.token,
						"id": Number(id)
					}));
					http.onload = function () {
						loadCards();
					}
					http.onerror = function () {
						console.log("unable to remove user:", id)
					}
                });
            }
            var newCardNames = document.getElementsByClassName("renameCardClass")
            for (let i = 0; i < removeCards.length; i++) {
                newCardNames[i].addEventListener('click', (self) => {
                    let newname = document.getElementById("newCardName" + i).value;
					let id = newCardNames[i].id;
                    var http = new XMLHttpRequest();

                    http.open('POST', config.CARD.RENAME_URL);
                    http.setRequestHeader("token", token.token);
                    http.setRequestHeader("cardid", id);
                    http.setRequestHeader("cardname", newname);

                    http.send();
                    http.onload = function () {
                        if (http.status == 200) {
                            loadCards();
                        } else {
                            new danger("Fail", "Unable to rename user: " + id).show()
                            console.log("Unable to rename card: ", id)
                        }
                    }
                    http.onerror = function () {
                        new danger("Fail", "Unable to rename user: " + id).show()
                        console.log("Unable to rename card: ", id)
                    }
                    http.onabort = function () {
                        new danger("Fail", "Unable to rename user: " + id).show()
                        console.log("Unable to rename card: ", id)
                    }
                });
            }
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logout").addEventListener("click", logout)

    loadCards(token);

    readCardButton = document.getElementById("readCardButton");
    readCardButton.addEventListener("click", setReadingMode);
    refresh = document.getElementById("refresh");
    refresh.addEventListener("click", loadCards);
    readCardButtonCancel = document.getElementById("readCardButtonCancel");
    readCardButtonCancel.addEventListener("click", cancelReadingMode);
});