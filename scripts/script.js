// this key defaults to a hidden file not pushed into GitHub
// please provide your own Open Weather API key to use the website fully
import { api_key_openweather } from "../keys/api_key_open_weather.js";
let api_key = "";

// this function always executes first to ensure that the api key variable is present
// if it is empty, simply discontinue the use of the webpage
$(function () {
    if (api_key == null || api_key == "") {
        api_key = "";
    };
});

let city_search_input = document.getElementById("city_search_input");
let city_search_button = document.getElementById("city_search_button");

city_search_button.addEventListener("click", search_city);

function search_city() {
    console.log(city_search_input.value);
};