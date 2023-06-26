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

// element that represents the button to clear recently searched cities
let clear_recent_button = document.getElementById("clear_recent_button");

async function search_city(recently_searched) {

    // ends function if input is empty
    if(recently_searched == "") {
        return;
    };

    var search_input = (recently_searched).toLowerCase();

    // retrieves city geographical information
    let city_location_data = await fetch("https://api.openweathermap.org/geo/1.0/direct?q=" 
                           + search_input 
                           + "&limit=5&appid=" 
                           + api_key);

    let json_city_location_data = await city_location_data.json();

    // ends the function if neither city or data is found
    // api calls retrieves from url successfully but may return an empty response if user inputs an unrecognized city
    if(!Object.keys(json_city_location_data).length) {
        return;
    };

    let city_lat = json_city_location_data[0]["lat"];
    let city_lon = json_city_location_data[0]["lon"];

    // empties five day forecast elements
    // ensures duplicate elements cannot be created when button is pressed
    $("[id=five_day_list]").empty();

    let city_weather_data = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="
                          + city_lat 
                          + "&lon=" 
                          + city_lon 
                          + "&appid=" 
                          + api_key 
                          + "&units=imperial");
    
    // retrieves city weather data
    let json_city_weather_data = await city_weather_data.json();

    // retrieves five day forecast for the city
    let city_five_day_forecast_data = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat="
                               + city_lat
                               + "&lon="
                               + city_lon 
                               + "&appid="
                               + api_key 
                               + "&units=imperial");

    let json_city_five_day_forecast_data = await city_five_day_forecast_data.json();

    // assigns the first five days as objects in a list
    var city_five_day_forecast_list = [];
    for(var x = 0; x < 5; x++) {
        city_five_day_forecast_list.push(json_city_five_day_forecast_data.list[x * 8]);
    };

    // creates the five day forecast elements
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

        // splits the date away from the time 
        let date_text = city_five_day_forecast_list[y].dt_txt;
        let date_only = date_text.split(" ");
        let date_split = date_only[0].split("-");
        let date_reformat = date_split[1] + "/" + date_split[2] + "/" + date_split[0];

        $("[id=date_" + y + "]").text(date_reformat)
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

    // creates the main display elements
    $(display_main_title).text(json_city_weather_data.name);

    // splits date text and reformats text into mm/dd/yyyy
    let date_from_dt = new Date(json_city_weather_data.dt * 1000);
    let date_year = date_from_dt.getFullYear();
    let date_month = date_from_dt.getMonth();
    let date_day = date_from_dt.getDate();
    let date_full = date_month + "/" + date_day + "/" + date_year;

    $(display_main_title).append("<div>" + date_full + "</div>")
    $(display_main_title).append("<img src=\"https://openweathermap.org/img/wn/" + json_city_weather_data.weather[0].icon + ".png\"/>");

    display_main_temp.innerHTML = "Temperature(°F): " + json_city_weather_data.main.temp + "°F";
    display_main_wind.innerHTML = "Wind Speed: " + json_city_weather_data.wind.speed + " MPH";
    display_main_humidity.innerHTML = "Humidity: " + json_city_weather_data.main.humidity + "%";

    // returns the name of the city 
    return json_city_weather_data.name;
};

// function that clears all elements inside the recently searched city section
function clear_recently_searched() {
    $("[id=city_search_recent]").empty();
};

// function to add a recently searched city as a new button 
function create_recently_searched(city_name) {

    // if the city_name variable is empty or null, simply end program execution here
    if(city_name == "" || city_name == null) {
        return;
    };

    // creates a new button with the city_name variable as its label
    $("[id=city_search_recent]").append("<button id=\"" + city_name + "\" class=\"searched\">" + city_name + "</button>")
        .click(function() {
            city_search_input = city_name;
        });
};

// button to search input city
city_search_button.addEventListener("click", async function() {
    create_recently_searched(await search_city(city_search_input.value));
});

// button to clear recently searched cities list
clear_recent_button.addEventListener("click", clear_recently_searched);


