"use strict";

window.addEventListener("load", () => {
    updateView();
})

function updateView() {
    document.getElementById('app').innerHTML = /* html */ `
        ${getDateListHTML()}
    `;
}

function getDateListHTML() {
    const forecast = model.forecast.properties.timeseries;
    let daysHTML = '';

    const forecastByDay = groupForecastByDay(forecast);

    /* console.log(forecastByDay); */

    for (let day in forecastByDay) {
        daysHTML += /* html */ `
            <h1>${day}</h1>
            ${getDayForcastHTML(forecastByDay[day])}
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
        console.log(forecast);
        const localTime = new Date(forecast.time).toLocaleTimeString();

        let symbol_code = null;

        if (forecast.data.hasOwnProperty('next_1_hours')) {
            symbol_code = forecast.data.next_1_hours.summary.symbol_code;
        } else if (forecast.data.hasOwnProperty('next_6_hours')) {
            symbol_code = forecast.data.next_6_hours.summary.symbol_code;
        } else if (forecast.data.hasOwnProperty('next_12_hours')) {
            symbol_code = forecast.data.next_12_hours.summary.symbol_code;
        }
        
        dayHTML += /* html */ `
            <div style="display:flex;">
                <div>${localTime}</div>
                <div>${getSymbol(symbol_code)}</div>
            </div>
        `;
    }
    return /* html */ `
        <div>
            ${dayHTML}
        </div>
    `;
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