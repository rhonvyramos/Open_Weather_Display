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

// elements that represent the city search function
let city_search_input = document.getElementById("city_search_input");
let city_search_button = document.getElementById("city_search_button");

// elements that represent the main weather display
let display_main_title = document.getElementById("display_main_title");
let display_main_temp = document.getElementById("display_main_temp");
let display_main_wind = document.getElementById("display_main_wind");
let display_main_humidity = document.getElementById("display_main_humidity");

// elements that represent the five day forecast display
let five_day_list = document.getElementById("five_day_list");

city_search_button.addEventListener("click", search_city);

async function search_city() {
    let search_input = (city_search_input.value).toLowerCase();

    let city_location_data = await fetch("https://api.openweathermap.org/geo/1.0/direct?q=" 
                    + search_input 
                    + "&limit=5&appid=" + api_key);
    
    let json_city_location_data = await city_location_data.json();

    let city_lat = json_city_location_data[0]["lat"];
    let city_lon = json_city_location_data[0]["lon"];
    
    let city_weather_data = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="
                          + city_lat 
                          + "&lon=" 
                          + city_lon 
                          + "&appid=" 
                          + api_key 
                          + "&units=imperial");
    
    let json_city_weather_data = await city_weather_data.json();

    let city_five_day_forecast_data = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat="
                               + city_lat
                               + "&lon="
                               + city_lon 
                               + "&appid="
                               + api_key 
                               + "&units=imperial");

    let json_city_five_day_forecast_data = await city_five_day_forecast_data.json();

    var city_five_day_forecast_list = [];
    for(var x = 0; x < 5; x++) {
        city_five_day_forecast_list.push(json_city_five_day_forecast_data.list[x]);
    };

    console.log(city_five_day_forecast_list[0].main.temp);
    console.log(city_five_day_forecast_list[0].weather[0].main);
    console.log(city_five_day_forecast_list[0].wind.speed);
    console.log(city_five_day_forecast_list[0].main.humidity);

    for(var y = 0; y < 5; y++) {
        $(five_day_list).append("<div id=\"five_day_forecast_element_" + y + "\"></div>")
        $("[id=five_day_forecast_element_" + y + "]").append("<p id=\"temp_" + y + "\"></p>");
        $("[id=temp_" + y + "]").text("Temperature: " + city_five_day_forecast_list[y].main.temp); 
    };

    display_main_title.innerHTML = json_city_weather_data.name;
    display_main_temp.innerHTML = "Temperature(°F): " + json_city_weather_data.main.temp + "°F";
    display_main_wind.innerHTML = "Wind Speed: " + json_city_weather_data.wind.speed + " MPH";
    display_main_humidity.innerHTML = "Humidity: " + json_city_weather_data.main.humidity + "%";
};