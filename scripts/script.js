// this key defaults to a hidden file not pushed into GitHub
// please provide your own Open Weather API key to use the website fully
import { api_key_openweather } from "../keys/api_key_open_weather.js";
let api_key = api_key_openweather;

// this function always executes first to ensure that the api key variable is present
// if it is empty, simply discontinue the use of the webpage
$(function () {
    if (api_key == null || api_key == "") {
        api_key = "";
    };
});

/*
 * main website functionality body
 */

let city_search_input = document.getElementById("city_search_input");
let city_search_button = document.getElementById("city_search_button");

let display_main_title = document.getElementById("display_main_title");

city_search_button.addEventListener("click", search_city);

async function search_city() {
    let search_input = (city_search_input.value).toLowerCase();;

    let city_location_data = await fetch("https://api.openweathermap.org/geo/1.0/direct?q=" 
                    + search_input 
                    + "&limit=5&appid=" + api_key);
    
    let json_city_location_data = await city_location_data.json();

    let city_name = json_city_location_data[0]["name"];
    let city_lat = json_city_location_data[0]["lat"];
    let city_lon = json_city_location_data[0]["lon"];
    
    let city_weather_data = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="
                          + city_lat 
                          + "&lon=" 
                          + city_lon 
                          + "&appid=" 
                          + api_key);
    
    let json_city_weather_data = await city_weather_data.json();

    display_main_title.innerHTML = json_city_weather_data.name;
};