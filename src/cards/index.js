import * as bootstrap from 'bootstrap';
import { logout } from "/js/logout"
import { alert, success, warning, danger } from "/js/message"
import { makeRequest } from "/js/utils"
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

    var data = await makeRequest('POST', config.CARD.SET_READING_MODE_URL);

    if (data.status == 200) {
        cardReadingModeTimer();
    } else {
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

async function cancelReadingMode() {
    var data = await makeRequest('POST', config.CARD.CANCEL_READING_MODE_URL);

    if (data.status == 200) {
        CardReadingCanceled = true;
        doneCanceling = false;
        var timer = document.getElementById("readCardTimer");
        timer.innerHTML = ""
        countTime = 0;
    } else {
        console.log("Unable to stop Reading mode");
        new danger("Warning", "Unable to stop Reading mode").show();
    }
}

async function loadCards() {
    var data = await makeRequest('GET', config.CARD.GET_URL);
    console.log(data)
    if (data.status == 200) {
        var cardList = document.getElementById("cardList")
        var r = JSON.parse(data.body)
        cardList.innerHTML = "";
        var border = ""

        if (r == null) {
            return
        }

        for (let i = 0; i < r.length; i++) {
            let obj = r[i];
            if (i == r.length - 1) {
                var border = "border-bottom"
            }

            cardList.innerHTML += `
    <div class="row text-light fs-5 justify-content-center border-2 border-secondary">
        <div class="col-3 border-start border-top `+ border + `">
            <input id="newCardName`+ i + `" class="form-control-plaintext border-none text-light bg-body" placeholder="` + obj.cardname + `" />
        </div>
        <div class="col-1 border-top `+ border + `">
            <button id="`+ obj.cardid + `" class="renameCardClass btn btn-link"><i class="fa fa-arrow-right"></i></button>
        </div>
        <div class="col-4 border-start border-top `+ border + `">
            `+ obj.assingedto + `
        </div>
        <div class="col-1 border-start text-center border-top border-end `+ border + ` ">
            <button id=`+ obj.cardid + ` class="removeCardClass btn btn-link text-danger"><i class="fa fa-trash-can"></i></button>
        </div>
    </div>
        `
        }

        var removeCards = document.getElementsByClassName("removeCardClass")
        for (let i = 0; i < removeCards.length; i++) {
            let event = removeCards[i];
            event.addEventListener('click', deleteCard);
            event.CardID = event.id;
        }
        var newCardNames = document.getElementsByClassName("renameCardClass")
        for (let i = 0; i < removeCards.length; i++) {
            var event = newCardNames[i];
            let id = newCardNames[i].id;
            event.addEventListener('click', renameCard);
            event.CardIndex = i;
            event.CardID = id;
        }
    }
}

async function deleteCard(evn) {
    let id = evn.currentTarget.CardID

    var data = await makeRequest('POST', config.CARD.REMOVE_URL, JSON.stringify({
        "id": Number(id)
    }));

    if (data.status == 200) {
        new success("Success", "Successfully Deleted Card: " + id + ".").show()
        loadCards();
    } else {
        new danger("Fail", "Unable to rename user: " + id).show()
        console.log("unable to remove user:", id)
    }
}

async function renameCard(evn) {
    let index = evn.currentTarget.CardIndex
    let newname = document.getElementById("newCardName" + index).value;
    let id = evn.currentTarget.CardID

    var data = await makeRequest('POST', config.CARD.RENAME_URL, JSON.stringify({
        "cardid": id,
        "cardname": newname
    }));

    if (data.status == 200) {
        new success("Success", "Successfully changed cardname to " + newname + ".").show()
        loadCards();
    } else {
        new danger("Fail", "Unable to rename user: " + id).show()
        console.log("Unable to rename card: ", id)
    }
}



document.addEventListener("DOMContentLoaded", function () {
    loadCards();

    readCardButton = document.getElementById("readCardButton");
    readCardButton.addEventListener("click", setReadingMode);
    refresh = document.getElementById("refresh");
    refresh.addEventListener("click", loadCards);
    readCardButtonCancel = document.getElementById("readCardButtonCancel");
    readCardButtonCancel.addEventListener("click", cancelReadingMode);
});