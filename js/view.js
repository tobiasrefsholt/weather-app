"use strict";

window.addEventListener("load", () => {
    updateView();
})

function updateView() {
    const currentLocation = model.fields.currentLocation;
    const headerText = !currentLocation.error && currentLocation.lon && currentLocation.lat ? `Weather for location: lat: ${currentLocation.lat}, lon: ${currentLocation.lon}` : currentLocation.error;
    document.getElementById('app').innerHTML = /* html */ `
        <h1>${headerText || ''}</h1>
        ${(model.forecast != null) ? getDateListHTML() : "Loading..."}
    `;
}

function getDateListHTML() {
    const forecast = model.forecast.properties.timeseries;
    let daysHTML = '';

    const forecastByDay = groupForecastByDay(forecast);

    /* console.log(forecastByDay); */

    for (let day in forecastByDay) {
        daysHTML += /* html */ `
        <div>
            <h1>${day}</h1>
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

function getDayForcastHTML(day) {
    let dayHTML = '';
    for (let forecast of day) {
        const localTime = new Date(forecast.time).toLocaleTimeString('nb-NO', {timeStyle: "short",});
        const symbol_code = getSymbalCode(forecast);
        const details = forecast.data.instant.details;
        
        dayHTML += /* html */ `
            <div class="forecast-hour">
                <span>${localTime}</span>
                ${getSymbol(symbol_code)}
                <span class="air-temperature">${details.air_temperature}°C</span>
            </div>
        `;
    }
    return /* html */ `
        <div class="forecast-day">
            ${dayHTML}
        </div>
    `;
}

function getSymbalCode(forecast) {
    let symbol_code = null;

    if (forecast.data.hasOwnProperty('next_1_hours')) {
        symbol_code = forecast.data.next_1_hours.summary.symbol_code;
    } else if (forecast.data.hasOwnProperty('next_6_hours')) {
        symbol_code = forecast.data.next_6_hours.summary.symbol_code;
    } else if (forecast.data.hasOwnProperty('next_12_hours')) {
        symbol_code = forecast.data.next_12_hours.summary.symbol_code;
    }
    return symbol_code;
}

function getSymbol(symbol_code) {
    if (symbol_code == null) return '';
    const symbolKey = model.weatherSymbolKeys[symbol_code];

    return /* html */ `
        <img src="../symbols/darkmode/svg/${symbolKey}.svg" alt="">
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