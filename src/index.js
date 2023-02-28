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
import { UPDATE_INTERVAL_ms } from '/config';


var selectedWeek = dayjs().week()
var selectedYear = dayjs().year()
var selectedYearWeeks = dayjs().isoWeeksInYear();
const currentYear = dayjs().year()

var selectedUser;

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

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

async function updateWeek() {
    let data = await makeRequest("GET", config.USER.GET_ALL_URL);
    document.getElementById("UserList").innerHTML = "";

    if (data.status == 200) {
        let parsedData = JSON.parse(data.body);
        for (let i = 0; i < parsedData.length; i++) {
            const user = parsedData[i];
            await appendUser(user);
        }
    } else {
        return false;
    }
}

async function appendUser(userData) {
    const userList = document.getElementById("UserList");

    let active = ""
    let activePill = `<i class="fa fa-circle-dot text-danger"></i>`
    if (userData.present == 1) {
        activePill = `<i class="fa fa-circle-dot text-success"></i>`
        active = "bg-success-subtle"
    }

    let times = await getUserWeekTimes(userData.id);
    let weekTotal = times[0];
    let dayTotalArray = times[1];
    let daysList = "";

    for (let i = 0; i < dayTotalArray.length; i++) {
        const dayTimeUnix = dayTotalArray[i];
        const dayNameShort = weekDays[i];
        if (dayTimeUnix != 0) {
            let hours = Math.floor(dayTimeUnix / 3600);
            let minutes = Math.round((dayTimeUnix - hours * 3600) / 60);
            // Add 0 to minutes if under 10
            if (String(minutes).length == 1) {
                minutes = "0" + String(minutes);
            }
            daysList += `${dayNameShort}: ${hours}:${minutes}<br>`;
        }
    }

    let hours = Math.floor(weekTotal / 3600);
    let minutes = Math.round((weekTotal - hours * 3600) / 60);

    // Add 0 to minutes if under 10
    if (String(minutes).length == 1) {
        minutes = "0" + String(minutes);
    }

    userList.innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-start fs-4 ${active}">
        <div class="ms-2 me-auto">
                <div class="fw-bold">${userData.name} ${activePill}</div>
            <div class="bold">WeekTotal: ${hours}:${minutes}<br></div>
            ${daysList}
            <a href="${config.PAGE.USER}?user=${userData.id}&selectedWeek=${selectedWeek}" class="stretched-link" ></a>
        </div>
    </li>`
}

async function getUserWeekTimes(userId) {
    let data = await makeRequest("GET", config.USER.GET_TIMES_URL + userId);

    let dataArray = JSON.parse(data.body);

    let currentWeekTimeDoneTime = 0;
    let daysData = [0, 0, 0, 0, 0, 0, 0]
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
            currentWeekTimeDoneTime += workdoneNow;
            daysData[begin_time.day()] += workdoneNow;
        }
    }
    return [currentWeekTimeDoneTime, daysData];
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


document.addEventListener("DOMContentLoaded", function () {
    // Init all tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Add rective buttons
    document.getElementById("weekBack").addEventListener("click", weekPrev);
    document.getElementById("weekForward").addEventListener("click", weekNext);
    document.getElementById("weekRefresh").addEventListener("click", updateWeek);

    document.getElementById("weekDisplay").innerHTML = "Week: " + selectedWeek;
    updateWeek();
});