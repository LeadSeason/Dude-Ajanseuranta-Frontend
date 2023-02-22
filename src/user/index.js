import '@popperjs/core';
import * as bootstrap from 'bootstrap';
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeeksInYears from 'dayjs/plugin/isoWeeksInYear';
import isLeepYear from 'dayjs/plugin/isLeapYear';
dayjs.extend(weekOfYear)
dayjs.extend(isoWeeksInYears)
dayjs.extend(isLeepYear)

import { logout } from "/js/logout";
import { alert, success, warning, danger } from "/js/message";
import { makeRequest } from "/js/utils";
import * as config from "/config";
import { UPDATE_INTERVAL_ms } from '../config';


var selectedWeek = dayjs().week()
var selectedYear = dayjs().year()
var selectedYearWeeks = dayjs().isoWeeksInYear();
const currentYear  = dayjs().year()

var selectedUser;

/**
 * Gets user id from url param and return requested data from backend
 * @returns JSON userdata
 */
async function getUserData() {
    const CURENT_URL = new URL(window.location.toLocaleString());
    const URL_PARAMS = CURENT_URL.searchParams;
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
 * @param {JSON} dataArray 
 */
async function fillWeekCal(dataArray) {

    // Initilize all timeArrays
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

        // Check if week is currerly selected
        if (begin_time.week() == selectedWeek) {
            const weekList = document.getElementById(["Week-null", "Week-ma", "Week-ti", "Week-ke", "Week-to", "Week-pe", "Week-null"][begin_time.day()])
            const startOfDay = Number(begin_time.startOf("day"));

            const dayBegin = (Number(begin_time) - startOfDay - 21600000) / (68400000 - 21600000 ) * 100
            const dayEnd   = (Number(end_time) - startOfDay - 21600000) / (68400000 - 21600000)  * 100
            
            // add times to array to be refrenced later
            weekList.timeArray.push([dayBegin, dayEnd]);
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
                style += begin_time + "% , rgba(0,212,255,1) "+ begin_time + "% " + end_time + "%, rgba(0,0,0,0) " + end_time + "% "
            }
            style += "100%);"
            element.style = style;
        } else {
            // If no time clear style
            element.style = "";
        }
    }
}

async function timedetailed(dataArray) {
    const doc =  document.getElementById("detailedTimeWeek");
    doc.innerHTML = "";
    let currentWeekTimeDoneTime = 0;

    // Loop through all requested data
    for (let dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
        const obj = dataArray[dataIndex];

        const begin_time_unix = Number(obj["begin_time"]);
        let end_time_unix = Number(obj["end_time"]);
        let inRoom = false;

        if (end_time_unix == 0) {
            inRoom = true;
            end_time_unix = dayjs().unix();
        }

        const begin_time = dayjs(begin_time_unix * 1000);
        const end_time = dayjs(end_time_unix * 1000);

        // Check if week is currerly selected
        if (begin_time.week() == selectedWeek) {
            let workdoneNow = (Number(end_time) - Number(begin_time)) / 1000

            let hours = Math.floor(workdoneNow / 3600);
            let minutes = Math.floor((workdoneNow - hours * 3600) / 60);
            if (String(minutes).length == 1) {
                minutes = "0" + String(minutes);
            }
            doc.innerHTML += `<i class="alert alert-light fa fa-clock"></i> ${hours}:${minutes}<br>`
            if (inRoom)  {
                doc.innerHTML += `<i class="alert alert-primary fa fa-check"></i> ${end_time.format('ddd HH:mm DD/MM/YYYY')} (NOW)<br>`
            } else {
                doc.innerHTML += `<i class="alert alert-danger fa fa-arrow-left"></i> ${end_time.format('ddd HH:mm DD/MM/YYYY')}<br>`
            }

            doc.innerHTML += `
            <i class="alert alert-success fa fa-arrow-right"></i>
             ${begin_time.format('ddd HH:mm DD/MM/YYYY')}<br>`;
        }
    }
}


async function updateWeek() {
    document.getElementById("weekDisplay").innerHTML = "Week: " + selectedWeek;
    let data = await makeRequest("GET", config.USER.GET_TIMES_URL + selectedUser.id);
    if (data.status == 200) {
        let parsedData = JSON.parse(data.body);
        fillWeekCal(parsedData, selectedWeek);
        timedetailed(parsedData);
    } else {
        return false;
    }
}

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

async function weekPrev() {
    selectedWeek--;
    updateWeekDisplay();
    updateWeek();
}

async function weekNext() {
    selectedWeek++;
    updateWeekDisplay();
    updateWeek();
}

async function refressLoop() {
    setTimeout(function() { 
        updateWeek();
        refressLoop();
    }, config.UPDATE_INTERVAL_ms);
}

document.addEventListener("DOMContentLoaded", async function () {
    // Init all tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Add rective buttons
    document.getElementById("weekBack").addEventListener("click", weekPrev);
    document.getElementById("weekForward").addEventListener("click", weekNext);
    document.getElementById("weekRefresh").addEventListener("click", updateWeek);

    updateWeekDisplay();

    selectedUser = await getUserData();
    addUserName("username: " + selectedUser.name + " Cardname: " + selectedUser.cardname);
    updateWeek();
    refressLoop();
});