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

        var city = response.city.name + "," + response.city.country;
        var currentDate = new Date(respsonse.list[0].dt * 1000);
        var date = currentDate.getDate();
        var month = currentDate.getMonth();
        var year = currentDate.getFullYear();
        var currentTemp = response.list[0].main.temp;
        var humidityLevel = response.list[0].main.humidity;
        var windSpeed = response.list[0].wind.speed;
        var iconURL = response.list[0].weather[0].icon;
        var weatherIcon = $("<img>");

        //Changes the title to reflect the city
        $(title).html("Weather Forecast: " + city);

        $(weatherIcon).attr({
            src: "https://openweathermap.org/img/wn/" + iconURL + "@2x.png",
            id: "weather-icon",
        });
        
        $(currentCityEl).html(city);
        $(currentDateEl).html("(" + month + "/" + date + "/" + year + ")");
        $(tempEl).html("Temperature: " + k2f(currentTemp) + "&#8457;");
        $(humidityEl).html("Humidity: " + humidityLevel + "&#37;");
        $(windEl).html("Wind Speed: " + +mps2mph(windSpeed) + "MPH");
        $(iconEl).html(weatherIcon);

        //for loop for forecast divs
        for (var i = 0; i < forecastDivs.length; i++) {
            $(forecastDivs[i]).html("");

            var futureDateEl = $("<h6>");
            var futureDate = new Date(response.list[i + 1].dt * 1000);
            var dateF = futureDate.getDate() + i;
            var monthF = futureDate.getMonth();

            var futureIcon = $("<img>");
            var iconURL = "https://openweathermap.org/img/wn";
            var weatherIcon = iconURL + response.list[i + 1].weather[0].icon + ".png";
            var futureDescEl = $("<h6>");
            var futureDesc = response.list[i + 1].weather[0].description;
            let futureTempEl = $("<h6>");
            let futureTemp = Math.ceil((response.list[i + 1].main.temp - 273.15) * 1.8 + 32);
            let futureHumEl = $("<h6>");
            let futureHum = response.list[i].main.humidity;
            console.log(futureDate);

            $(futureDateEl).html(monthF + "/" +dateF);
            $(futureIcon).attr({ src: weatherIcon, class: "future-weather-icon" });
            $(futureDescEl).html(futureDesc);
            $(futureTempEl).html("Temp: " + futureTemp + "&#8457;");
            $(futureHumEl).html("Humidity: " + futureHum);

            $(forecastDivs[i]).append(
                futureDateEl,
                futureIcon,
                futureDescEl,
                futureTempEl,
                futureHumEl
            );

        }

        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;

        //UV Index Api URL 
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        //Ajax for UV index
    }

    }

    


}