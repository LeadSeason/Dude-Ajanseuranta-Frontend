import * as bootstrap from 'bootstrap';
import * as token from "/js/token"
import {alert, success, warning, danger} from "/js/message"
import {makeRequest} from "/js/utils"
import * as config from "/config"

function addUser() {
	var inputfield = document.getElementById("usernameInput")
	var username = inputfield.value
	var http = new XMLHttpRequest();
	http.open('POST', config.USER.ADD_URL);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(JSON.stringify({
		"token": token.token,
		"username": username,
		"cardname": ""
	}));
	http.onload = function () {
		inputfield.value = "";
		getUsers();
	}
}



async function getUsers() {
	// request all users from database
	var http = new XMLHttpRequest();

	http.open('POST', config.USER.GET_URL);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	// request with token
	http.send(JSON.stringify({
		"token": token.token
	}));

	http.onload = async function () {
		if (http.status != 200) {
			return
		}

		var response = JSON.parse(http.responseText)

		var cards = await getCards();

		// change card dropdown events
		await renderUserData(response, cards)
		AddClickEventForDeleteButton()
		addClickEventForChangeCardDropdown(cards)
	}
}

async function renderUserData(r, cards) {
	// request done parsing data		
	var UserList = document.getElementById("UserList")

	// clear card list to be filled with new data
	UserList.innerHTML = ""; 
	var border = ""

	// if null is given exit
	if (r == null) {
		return
	}
	
	// get cards json

	// render website data
	for (let i = 0; i < r.length; i++) {
		let obj = r[i];

		var useractive = "";
		if  (obj.active) {
			useractive = "bg-success"
		}

		// when last render bottom border 
		if (i == r.length - 1) {
			var border = "border-bottom"
		}

		if (obj.cardname == "") {
			obj.cardname = "none"
		}

		// add dropdown data
		var cardsDropdown = "";
		if (cards) {
			cardsDropdown = await getCardListDropdown(cards, obj);
		}
		
		// generate main card list
		UserList.innerHTML += `
<div class="row text-light fs-5 justify-content-center border-2 border-secondary">
	<div class="col-3 border-start border-top `+ useractive + " " + border +`">
		`+ obj.name + `
	</div>
	<div class="col-4 border-start border-top `+ useractive + " " + border +`">
		<div class="btn-group">
			<button class="btn btn-dark dropdown-toggle `+ useractive +`" type="button" id="triggerId" data-bs-toggle="dropdown" aria-haspopup="true"
					aria-expanded="false">
				`+ obj.cardname + `
			</button>
			<div class="dropdown-menu dropdown-menu-start" aria-labelledby="triggerId">
				`+ cardsDropdown +`
			</div>
		</div>
	</div>
	<div class="col-1 border-start text-center border-top border-end `+ useractive + " " + border + ` ">
		<button id=`+ obj.id +` class="removeCardClass btn btn-link text-danger"><i class="fa fa-trash-can"></i></button>
	</div>
</div>
	`
	}
}


async function getCards() {
	var data = await makeRequest('POST', config.CARD.GET_URL, JSON.stringify({
		"token": token.token
	}));
	return JSON.parse(data);
}

async function getCardListDropdown(cards, user) {
	var cardsDropdown = "";
	for (let i2 = 0; i2 < cards.length; i2++) {
		var active = "";
		var card = cards[i2]

		// classname to be used later for change card functionaity
		var classname = "ChangecardDropdown-" + cards[i2].cardname;

		// show what card is active if user and card same
		if (card.cardname == user.cardname) {
			active = "active"
		}

		// add cards to drop down
		// set username into id to be used late to change cards
		cardsDropdown += `<a id="`+ user.name+`" class="`+ classname +` dropdown-item `+ active +`" href="#">`+ card.cardname +`</a>`
	}
	return cardsDropdown
}

async function addClickEventForChangeCardDropdown(cards) {
	for (let i = 0; i < cards.length; i++) {
		var classname = "ChangecardDropdown-" + cards[i].cardname;
		var changecard = document.getElementsByClassName(classname)
		for (let i = 0; i < changecard.length; i++) {
			// when cad is pressed change card
			changecard[i].addEventListener('click', changeCard)
		}
	}
}

async function changeCard(evn) {
	// get cardname from text
	let namecard = evn.explicitOriginalTarget.text;
	// get id from 
	let name = evn.explicitOriginalTarget.id;

	console.log("changing card Id: " + name + " cardname: " + namecard)

	var http = new XMLHttpRequest();

	http.open('POST', config.USER.UPDATE_URL);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(JSON.stringify({
		"token": token.token,
		"username": name,
		"cardname": namecard
	}));

	http.onload = function () {
		// Reload user data
		getUsers();
	}
	http.onerror = function () {
		warning("Fatal", "unable to remove user: " + id)
		console.log("unable to remove user:", id)
	}
}

async function AddClickEventForDeleteButton() {
	// generate event triggers for removeCardclassed buttons
	var removeCards = document.getElementsByClassName("removeCardClass")
	console.log(removeCards)
	for (let i = 0; i < removeCards.length; i++) {
		// when remove card is clicked run code
		removeCards[i].addEventListener('click', removeUser);
	}
}

async function removeUser(evn) {
	console.log(evn)
	let id = removeCards[i].id;
	console.log("removing id:", id);

	var http = new XMLHttpRequest();

	// send remove request
	http.open('POST', config.USER.REMOVE_URL);
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(JSON.stringify({
		"token": token.token,
		"id": Number(id)
	}));
	http.onload = function () {
		success("Success", "Removed user: " + id)
		getUsers();
	}
	http.onerror = function () {
		console.log("unable to remove user:", id)
		warning("failure")
	}
}

document.addEventListener("DOMContentLoaded", async function () {
	document.getElementById("logout").addEventListener("click", token.logout)
	document.getElementById("adduserbutton").addEventListener("click", addUser);

	getUsers()
});