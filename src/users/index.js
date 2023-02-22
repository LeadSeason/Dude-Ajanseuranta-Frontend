import * as bootstrap from 'bootstrap'
import { logout } from "/js/logout"
import { alert, success, warning, danger } from "/js/message"
import { makeRequest, alertConfirm } from "/js/utils"
import * as config from "/config"

/**
 * AddUser callback Adds user with name given from usernameInput field
 */
async function addUser() {
	var inputfield = document.getElementById("usernameInput")
	var username = inputfield.value

    var data = await makeRequest('POST', config.USER.ADD_URL, JSON.stringify({
		"username": username,
    }));

	if (data.status == 200) {
        new success("Success", "User "+ username +" added").show()
		inputfield.value = "";
		getUsers();
	} else {
        new danger("Warning", "Failed to add user").show()
	}
}

/**
 * Generates User list and adds it to the id="Userlist" div
 * run at page load
 */
async function getUsers() {
	// Request list of users
    var users = await makeRequest('GET', config.USER.GET_ALL_URL);

	if (users.status != 200) {
		console.log("Failed to get users");
        new danger("Warning", "Failed to get users").show()
		return false
	}

	var cards = await makeRequest('GET', config.CARD.GET_URL);

	if (cards.status != 200) {
		console.log("Failed to get cards");
        new danger("Warning", "Failed to get cards").show()
		return false
	}

	users = JSON.parse(users.body);
	cards = JSON.parse(cards.body);

	await renderUserData(users, cards)
	AddClickEventForDeleteButton()
	addClickEventForChangeCardDropdown(cards)

	// return True to start refresh loop.
	return true;
}


/**
 * Crates user list when page is loaded
 * and when user list needs to be updated 
 * also fills in dropdown info with card list data
 * 
 * @TODO never
 * This is overly complicatedly done code could be improved by using selection
 * and options, then just lisening to change event, Im not going to change this
 * at this time as it currently works but is terrebly implemented. 👍
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
 * 
 * 
 * @param {JSON} users List of users
 * @param {JSON} cards List of cards
 * 
 * @returns Return if error occur 
 */
async function renderUserData(users, cards) {
	// request done parsing data		
	var UserList = document.getElementById("UserList")

	// clear card list to be filled with new data
	UserList.innerHTML = ""; 
	var border = ""

	// if null is given exit
	if (users == null) {
		return
	}
	
	// get cards json

	// render website data
	for (let i = 0; i < users.length; i++) {
		let obj = users[i];

		var useractive = "";
		if  (obj.present) {
			useractive = "bg-success"
		}

		// when last render bottom border 
		if (i == users.length - 1) {
			var border = "border-bottom"
		}

		if (obj.cardname == "") {
			obj.cardname = "none"
		}

		// add dropdown data
		var cardsDropdown = "";
		if (cards) {
			cardsDropdown = await getCardListDropdown(cards, obj, users);
		}
		
		// generate main card list
		UserList.innerHTML += `
<div class="row text-light fs-5 justify-content-lg-center border-2 border-secondary">
	<div class="col-lg-3 col border-start border-top `+ useractive + " " + border +`">
		<a class="link-light" href="/user/index.html?user=`+ obj.id +`">`+ obj.name +`</a>
	</div>
	<div class="col-lg-4 col border-start border-top `+ useractive + " " + border +`">
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

/**
 * Generates Card dropdown data
 * Sets active if card is used by user
 * @param {JSON} cards 
 * @param {JSON} user 
 * @returns 
 */
async function getCardListDropdown(cards, user, users) {
	var cardsDropdown = "";
	for (let i2 = 0; i2 < cards.length; i2++) {
		var active = "";
		var card = cards[i2]

		// classname to be used later for change card functionaity
		var classname = "ChangecardDropdown-" + cards[i2].cardname;

		for (let index = 0; index < users.length; index++) {
			const element = users[index];
			if (element.cardname == card.cardname) {
				active = "bg-danger-subtle"
			}
		}

		// show what card is active if user and card same
		if (card.cardname == user.cardname) {
			active = "bg-success"
		}

		// add cards to drop down
		// set username into id to be used late to change cards
		cardsDropdown += `<a id="`+ user.id+`" class="`+ classname +` dropdown-item `+ active +`" href="#">`+ card.cardname +`</a>`
	}
	return cardsDropdown
}

/**
 * Adds ClickEvents to card dropdowns
 * Clicking a card will call the changeCard function 
 * @param {JSON} cards 
 */
async function addClickEventForChangeCardDropdown(cards) {
	// Make list of active cards Used by changeCard to confirm card change
	var activeCards = [];
	for (let i = 0; i < cards.length; i++) {
		var card = cards[i];
		if (card.assingedto != "") {
			activeCards.push(card);
		}
	}

	for (let i = 0; i < cards.length; i++) {
		var classname = "ChangecardDropdown-" + cards[i].cardname;
		var changecard = document.getElementsByClassName(classname)
		for (let i = 0; i < changecard.length; i++) {
			// when cad is pressed change card
			var card = changecard[i]
			card.addEventListener('click', changeCard);
			card.ActiveCards = activeCards;
		}
	}
}

/**
 * Change card to Clicked card; 
 * @param {EventTarget} evn event must contain ActiveCards
 */
async function changeCard(evn) {
	let activeCards = evn.currentTarget.ActiveCards;
	let namecard = evn.currentTarget.text;
	let userid = evn.currentTarget.id;

	console.log("changing card Id: " + userid + " cardname: " + namecard);

	// Check if card is used by some one
	for (let i = 0; i < activeCards.length; i++) {
		const aCard = activeCards[i];
		if (aCard.cardname == namecard)  {
			// if used ask user to confirm
			if (!alertConfirm("Card In use by " + aCard.assingedto)) {
				// cancel Exit function
				return
			}
		}
	}

	// Make request to change card
	var data = await makeRequest('POST', config.USER.UPDATE_CARD_URL, JSON.stringify({
		"userid": Number(userid),
		"cardname": namecard
	}))

	if (data.status == 200) {
        new success("Success", "Updated user card").show()
		getUsers();
	} else {
        new danger("Warning", "Failed to update card").show()
	}
}

async function AddClickEventForDeleteButton() {
	// generate event triggers for removeCardclassed buttons
	var removeCards = document.getElementsByClassName("removeCardClass")
	for (let i = 0; i < removeCards.length; i++) {
		// when remove card is clicked run code
		var event = removeCards[i];
		event.addEventListener('click', removeUser);
		event.UserID = removeCards[i].id;
	}
}

async function removeUser(evt) {
	var id = evt.currentTarget.id

	// send remove request
	var data = await makeRequest('POST', config.USER.REMOVE_URL, JSON.stringify({
		"id": Number(id)
	}));

	if (data.status == 200) {
		getUsers();
		new success("Success", "Removed user: " + id).show()
	} else {
		console.log("unable to remove user:", id)
		new danger("Fatal", "unable to remove user:" + id).show()
		warning("failure")
	}
}

/*
async function refressLoop() {
    setTimeout(function() { 
		getUsers()
        refressLoop();
    }, config.UPDATE_INTERVAL_ms);
}
*/

document.addEventListener("DOMContentLoaded", async function () {
	document.getElementById("adduserbutton").addEventListener("click", addUser);
    let refresh = document.getElementById("refresh");
    refresh.addEventListener("click", getUsers);

	getUsers();
	/*
	if (await getUsers()) {
		refressLoop();
	}
	*/
});