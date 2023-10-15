"use strict";

window.addEventListener("load", async () => {
    setCurrentLocation();
})

function setCurrentLocation() {

    const currentLocation = model.fields.currentLocation;

    function success(position) {
        currentLocation.lat = position.coords.latitude;
        currentLocation.lon = position.coords.longitude;
        getForecast();
    }

    function error() {
        currentLocation.error = "Unable to retrieve your location";
    }

    if (!navigator.geolocation) {
        currentLocation.error = "Geolocation is not supported by your browser";
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }

}

async function getForecast() {
    const lat = model.fields.currentLocation.lat;
    const lon = model.fields.currentLocation.lon;
    const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`);
    model.forecast = await response.json();
    updateView();
}