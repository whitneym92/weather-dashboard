//Creating my variables
$(document).ready(function() {
    var APIKey= "cc3550ca747909c191efae6397fdaa94";
    var cityDisplayEl = document.querySelector(".city-holder");
    var inputEl = document.getElementById("city-input");
    var searchEl = document.getElementById("search");
    var currentCityEl = document.getElementById("current-city");
    var currentDateEl = document.getElementById("current-date");
    var tempEl= document.getElementById("temp");
    var humidityEl= document.getElementById("humidity");
    var windEl= document.getElementById("wind");
    var uvEl= document.getElementById("uv-index");
    var iconEl= document.getElementById("weather.icon");
    var forecastDivs = document.querySelectorAll(".forecast");
    var title = document.querySelector("title");

    //function to queryUrl
    function getWeatherInfo(cityName){
        var queryURl= "https://api.openweather.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;

    //Ajax request for current weather
    $.ajax({
        url: queryURl,
        method: "GET",
    }).then(function (response) {
        console.log(response);
    }

    }

    


}