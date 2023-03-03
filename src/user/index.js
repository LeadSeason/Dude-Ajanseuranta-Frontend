import '@popperjs/core';
import * as bootstrap from 'bootstrap';
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeeksInYears from 'dayjs/plugin/isoWeeksInYear';
import isLeapYear from 'dayjs/plugin/isLeapYear';
dayjs.extend(weekOfYear)
dayjs.extend(isoWeeksInYears)
dayjs.extend(isLeapYear)

import { logout } from "/js/logout";
import { alert, success, warning, danger } from "/js/message";
import { makeRequest } from "/js/utils";
import * as config from "/config";
import { UPDATE_INTERVAL_ms } from '../config';


// Get week from url param
const CURRENT_URL = new URL(window.location.toLocaleString());
const URL_PARAMS = CURRENT_URL.searchParams;
var selectedWeek = URL_PARAMS.get("selectedWeek");

if (selectedWeek == null) {
    // If url param doesn't contain a week set week to current week
    selectedWeek = dayjs().week()
}

var selectedYear = dayjs().year()
var selectedYearWeeks = dayjs().isoWeeksInYear();
const currentYear = dayjs().year()

var selectedUser;

/**
 * Gets user id from url param and return requested data from backend
 * @returns JSON userData
 */
async function getUserData() {
    const CURRENT_URL = new URL(window.location.toLocaleString());
    const URL_PARAMS = CURRENT_URL.searchParams;
    const userId = URL_PARAMS.get("user");

    if (userId == null) {
        window.location.replace(config.PAGE.USERS);
        return;
    }

    var data = await makeRequest('GET', config.USER.GET_URL + userId);
    if (data.status == 200) {
        return JSON.parse(data.body)[0];
    } else {
        console.log("Failed to get User data");
        new danger("Warning", "Failed to get user data.").show();
    }
}

async function addUserName(name) {
    var textField = document.getElementById("textData");
    textField.innerHTML = name;
}

/**
 * Fills the currently selected week with correct styling
 * Uses background: linear-gradient() for displaying week times
 * @param {JSON} dataArray 
 */
async function fillWeekCal(dataArray) {

    // Initialize all timeArrays
    const WeekFields = ["Week-null", "Week-ma", "Week-ti", "Week-ke", "Week-to", "Week-pe", "Week-null"]
    for (let index = 0; index < WeekFields.length; index++) {
        const element = document.getElementById(WeekFields[index]);
        element.timeArray = []
    }

    // Loop through all requested data
    for (let dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
        const obj = dataArray[dataIndex];

        const begin_time_unix = Number(obj["begin_time"])
        let end_time_unix = Number(obj["end_time"]);


        if (end_time_unix == 0) {
            end_time_unix = dayjs().unix();
        }

        const begin_time = dayjs(begin_time_unix * 1000);
        const end_time = dayjs(end_time_unix * 1000);

        // Check if week is currently selected
        if (begin_time.week() == selectedWeek) {
            const weekList = document.getElementById(["Week-null", "Week-ma", "Week-ti", "Week-ke", "Week-to", "Week-pe", "Week-null"][begin_time.day()])
            const startOfDay = Number(begin_time.startOf("day"));

            const dayBegin = (Number(begin_time) - startOfDay - 21600000) / (68400000 - 21600000) * 100
            const dayEnd = (Number(end_time) - startOfDay - 21600000) / (68400000 - 21600000) * 100

            // add times to array to be referenced later
            weekList.timeArray.unshift([dayBegin, dayEnd]);
        }
    }

    for (let index = 0; index < WeekFields.length; index++) {
        const element = document.getElementById(WeekFields[index]);
        // Using linear gradient background to display time 
        let style = "background: linear-gradient(180deg, rgba(0,0,0,0) 0% "

        if (element.timeArray.length != 0) {
            // loop through all items in timeArray and add to style
            for (let index2 = 0; index2 < element.timeArray.length; index2++) {
                const begin_time = element.timeArray[index2][0];
                const end_time = element.timeArray[index2][1];
                style += `${begin_time}% , rgba(0,212,255,1) ${begin_time}% ${end_time}%, rgba(0,0,0,0) ${end_time}%`
            }
            style += "100%);"
            element.style = style;
        } else {
            // If no time clear style
            element.style = "";
        }
    }
}


/**
 * Loop through all data and give detailed time
 * @param {JSON} dataArray List of begin times and end.
 */
async function timeDetailed(dataArray) {
    const doc = document.getElementById("detailedTimeWeek");
    doc.innerHTML = "";

    // Have current week total time done
    let currentWeekTotal = 0;

    // Loop through all requested data
    for (let dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
        const obj = dataArray[dataIndex];

        const begin_time_unix = Number(obj["begin_time"]);
        let end_time_unix = Number(obj["end_time"]);
        let inRoom = false;

        if (end_time_unix == 0) {
            // if end_time is null. Set endTime to current time
            inRoom = true;
            end_time_unix = dayjs().unix();
        }

        const begin_time = dayjs(begin_time_unix * 1000);
        const end_time = dayjs(end_time_unix * 1000);

        // Check if week is currently selected
        if (begin_time.week() == selectedWeek) {
            let workDoneNow = (Number(end_time) - Number(begin_time)) / 1000;
            // add workDoneNow to weekTotal
            currentWeekTotal += workDoneNow;

            let hours = Math.floor(workDoneNow / 3600);
            let minutes = Math.round((workDoneNow - hours * 3600) / 60);
            // if minutes is one digit number add a zero to beginning of it
            if (String(minutes).length == 1) {
                minutes = "0" + String(minutes);
            }

            // use different styling if end time is null
            let endTimeHTML
            if (inRoom) {
                endTimeHTML = `<i class="alert alert-primary fa fa-check"></i> ${end_time.format('ddd HH:mm DD/MM/YYYY')} (NOW)<br>`
            } else {
                endTimeHTML = `<i class="alert alert-danger fa fa-arrow-left"></i> ${end_time.format('ddd HH:mm DD/MM/YYYY')}<br>`
            }

            doc.innerHTML += `
		<div class="row">
			<div class="col-lg-2">
				<i class="alert alert-light fa fa-clock"></i> ${hours}:${minutes}<br>
			</div>
			<div class="col-lg">
				<i class="alert alert-success fa fa-arrow-right"></i>
                ${begin_time.format('ddd HH:mm DD/MM/YYYY')}<br>
			</div>
			<div class="col-lg">
				${endTimeHTML}
			</div>
		</div>
            `
        }
    }

    let hours = Math.floor(currentWeekTotal / 3600);
    let minutes = Math.round((currentWeekTotal - hours * 3600) / 60);
    // Add 0 to minutes if under 10
    if (String(minutes).length == 1) {
        minutes = "0" + String(minutes);
    }
    // Calculate week total and add that to the beginning of the list
    doc.innerHTML = `<i class="alert alert-success fa fa-clock"></i> Current Week Total: ${hours}:${minutes}<br>
                     <div class="border-top border-2 pb-3"></div>
                    ` + doc.innerHTML
}

/**
 * Updates week if changed week or refresh called
 * @returns false if failed
 */
async function updateWeek() {
    let data = await makeRequest("GET", config.USER.GET_TIMES_URL + selectedUser.id);
    if (data.status == 200) {
        let parsedData = JSON.parse(data.body);
        fillWeekCal(parsedData, selectedWeek);
        timeDetailed(parsedData);
    } else {
        return false;
    }
}

/**
 * Update the week display and handel if year changes
 */
async function updateWeekDisplay() {
    // Change years
    if (selectedWeek > selectedYearWeeks) {
        selectedYear++;
        selectedYearWeeks = dayjs().year(selectedYear).isoWeeksInYear();
        selectedWeek = 1;
    } else if (selectedWeek < 1) {
        selectedYear--;
        selectedYearWeeks = dayjs().year(selectedYear).isoWeeksInYear();
        selectedWeek = selectedYearWeeks;
    }

    // show years in ( ) if not current year
    if (selectedYear != currentYear) {
        document.getElementById("weekDisplay").innerHTML = `Week: ${selectedWeek} (${selectedYear})`;
    } else {
        document.getElementById("weekDisplay").innerHTML = "Week: " + selectedWeek;
    }
}

/**
 * Increment selected week down and refresh data.
 * Called when pressing Previous week button
 */
async function weekPrev() {
    selectedWeek--;
    updateWeekDisplay();
    updateWeek();
}

/**
 * Increment selected week and refresh data
 * Called when  pressing Next week button.
 */
async function weekNext() {
    selectedWeek++;
    updateWeekDisplay();
    updateWeek();
}

/**
 * Automatically update userData every 10 seconds
 */
async function refreshLoop() {
    setTimeout(function () {
        updateWeek();
        refreshLoop();
    }, config.UPDATE_INTERVAL_ms);
}

document.addEventListener("DOMContentLoaded", async function () {
    // Init all tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Add reactive buttons
    document.getElementById("weekBack").addEventListener("click", weekPrev);
    document.getElementById("weekForward").addEventListener("click", weekNext);
    document.getElementById("weekRefresh").addEventListener("click", updateWeek);

    // Update weekDisplay with selected week
    document.getElementById("weekDisplay").innerHTML = "Week: " + selectedWeek;
    updateWeekDisplay();

    selectedUser = await getUserData();
    document.title = "DudeLeimaus | " + selectedUser.name;
    // @TODO Make better display
    addUserName(selectedUser.name + "<br>Card: " + selectedUser.cardname);
    updateWeek();
    refreshLoop();
});