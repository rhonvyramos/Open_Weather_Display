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
        city_five_day_forecast_list.push(json_city_five_day_forecast_data.list[x * 8]);
    };

    for(var y = 0; y < 5; y++) {
        $(five_day_list).append("<div id=\"five_day_forecast_element_" + y + "\"></div>")

        $("[id=five_day_forecast_element_" + y + "]")
            .css("border-style","groove")
            .css("margin", "5px");

        $("[id=five_day_forecast_element_" + y + "]").append("<p id=\"date_" + y + "\"></p>");
        $("[id=five_day_forecast_element_" + y + "]").append("<p id=\"icon_" + y + "\"></p>");
        $("[id=five_day_forecast_element_" + y + "]").append("<p id=\"temp_" + y + "\"></p>");
        $("[id=five_day_forecast_element_" + y + "]").append("<p id=\"wind_" + y + "\"></p>");
        $("[id=five_day_forecast_element_" + y + "]").append("<p id=\"humidity_" + y + "\"></p>");

        // city_five_day_forecast_list[y].weather[0].icon + ".png"
        $("[id=date_" + y + "]").text(city_five_day_forecast_list[y].dt_txt)
            .css("font-size", "75%"); 
        $("[id=icon_" + y + "]")
            .append("<img src=\"https://openweathermap.org/img/wn/" + city_five_day_forecast_list[y].weather[0].icon + ".png\"/>");
        $("[id=temp_" + y + "]").text("Temperature(°F): " + city_five_day_forecast_list[y].main.temp + "°F")
            .css("font-size", "75%"); 
        $("[id=wind_" + y + "]").text("Wind: " + city_five_day_forecast_list[y].wind.speed + " MPH")
            .css("font-size", "75%"); ; 
        $("[id=humidity_" + y + "]").text("Humidity: " + city_five_day_forecast_list[y].main.humidity + "%")
            .css("font-size", "75%"); ; 
    };

    //display_main_title.innerHTML = json_city_weather_data.name;
    $(display_main_title).text(json_city_weather_data.name);
    $(display_main_title).append("<img src=\"https://openweathermap.org/img/wn/" + json_city_weather_data.weather[0].icon + ".png\"/>");

    display_main_temp.innerHTML = "Temperature(°F): " + json_city_weather_data.main.temp + "°F";
    display_main_wind.innerHTML = "Wind Speed: " + json_city_weather_data.wind.speed + " MPH";
    display_main_humidity.innerHTML = "Humidity: " + json_city_weather_data.main.humidity + "%";
};

city_search_button.addEventListener("click", search_city);