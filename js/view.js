"use strict";

window.addEventListener("load", () => {
    updateView();
})

function updateView() {
    const currentLocation = model.fields.currentLocation;
    const headerText = !currentLocation.error && currentLocation.lon && currentLocation.lat ? `Weather for location: lat: ${currentLocation.lat}, lon: ${currentLocation.lon}` : currentLocation.error;
    document.getElementById('app').innerHTML = /* html */ `
        <h1 class="main-header">${headerText || ''}</h1>
        ${(model.forecast != null) ? getDateListHTML() : "Loading..."}
    `;
}

function getDateListHTML() {
    const forecast = model.forecast.properties.timeseries;
    const forecastByDay = groupForecastByDay(forecast);
    const currentDate = new Date();
    let daysHTML = '';

    for (let day in forecastByDay) {
        daysHTML += /* html */ `
        <div>
            <h1>${getDisplayDate(day, currentDate)}</h1>
            ${getDayForcastHTML(forecastByDay[day])}

        </div>
        `;
    }

    return /* html */`
        <div class="forecast">
            ${daysHTML}
        </div>
    `
}

function getDisplayDate(day, currentDate) {
    const forecastDate = new Date(day);
    let displayDate = '';
    if (forecastDate.getTime() < currentDate.getTime() + 604800000) {
        displayDate = model.weekdays[forecastDate.getDay()];
    } else {
        displayDate = forecastDate.toLocaleDateString();
    }
    return displayDate;
}

function getDayForcastHTML(day) {
    let dayHTML = '';
    for (let forecast of day) {
        const localTime = new Date(forecast.time).toLocaleTimeString('nb-NO', {timeStyle: "short",});
        const shortestSummary = getShortestSummary(forecast);
        const details = forecast.data.instant.details;
        
        dayHTML += /* html */ `
            <div class="forecast-hour">
                <span>${localTime}</span>
                ${shortestSummary ? getSymbol(shortestSummary.summary.symbol_code) : ''}
                <span class="air-temperature">${details.air_temperature}°</span>
                <span class="precipitation-amount">${shortestSummary ? shortestSummary.details.precipitation_amount : 0}&nbsp;mm</span>
                <img class="wind-direction" style="transform: rotate(${details.wind_from_direction}deg);" src="symbols/darkmode/svg/arrow.svg" alt="">
                <span class="wind-speed">${details.wind_speed}&nbsp;m/s</span>
            </div>
        `;
    }
    return /* html */ `
        <div class="forecast-day">
            ${dayHTML}
        </div>
    `;
}

function getShortestSummary(forecast) {
    let summary = null;

    if (forecast.data.hasOwnProperty('next_1_hours')) {
        summary = forecast.data.next_1_hours;
    } else if (forecast.data.hasOwnProperty('next_6_hours')) {
        summary = forecast.data.next_6_hours;
    } else if (forecast.data.hasOwnProperty('next_12_hours')) {
        summary = forecast.data.next_12_hours;
    }
    return summary;
}

function getSymbol(symbol_code) {
    if (symbol_code == null) return '';
    const symbolKey = model.weatherSymbolKeys[symbol_code];

    return /* html */ `
        <img class="weather-symbol" src="symbols/darkmode/svg/${symbolKey}.svg" alt="">
    `;
}

function groupForecastByDay(forecast) {
    const forecastByDay = {};
    for (let single of forecast) {
        let currentDate = new Date(single.time).toLocaleDateString();
        if (currentDate in forecastByDay) {
            forecastByDay[currentDate].push(single);
        } else {
            forecastByDay[currentDate] = [single];
        }
    }
    return forecastByDay;
}