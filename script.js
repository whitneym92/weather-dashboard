$(document).ready(function () {
    var APIKey = "cc3550ca747909c191efae6397fdaa94";
    var citiesDisplayEl = document.querySelector(".cities-holder");
    var inputEl = document.getElementById("city-input");
    var searchEl = document.getElementById("search");
    var currentCityEl = document.getElementById("current-city");
    var currentDateEl = document.getElementById("current-date");
    var tempEl = document.getElementById("temp");
    var humidityEl = document.getElementById("humidity");
    var windEl = document.getElementById("wind");
    var uvEl = document.getElementById("uv-index");
    var iconEl = document.getElementById("weather-icon");
    var forecastDivs = document.querySelectorAll(".forecast");
    var title = document.querySelector("title");
  
    function getWeatherInfo(cityName) {
      //URL pattern to query the database
      var queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName +
        "&appid=" +
        APIKey;
  
      //AJAX request for current weather conditions
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
  
        var city = response.city.name + ", " + response.city.country;
        var currentDate = new Date(response.list[0].dt * 1000);
        var date = currentDate.getDate();
        var month = currentDate.getMonth();
        var year = currentDate.getFullYear();
        var currentTemp = response.list[0].main.temp;
        var humidityLevel = response.list[0].main.humidity;
        var windSpeed = response.list[0].wind.speed;
        var iconURL = response.list[0].weather[0].icon;
        var weatherIcon = $("<img>");
  
        //Change the page title to reflect city
        $(title).html("Weather Forecast - " + city);
  
        $(weatherIcon).attr({
          src: "https://openweathermap.org/img/wn/" + iconURL + "@2x.png",
          id: "weather-icon",
        });
  
        $(currentCityEl).html(city);
        $(currentDateEl).html(" (" + month + "/" + date + "/" + year + ")");
        $(tempEl).html("Temperature: " + k2f(currentTemp) + " &#8457;");
        $(humidityEl).html("Humidity: " + humidityLevel + " &#37;");
        $(windEl).html("Wind Speed: " + +mps2mph(windSpeed) + " MPH");
        $(iconEl).html(weatherIcon);
  
        for (var i = 0; i < forecastDivs.length; i++) {
          $(forecastDivs[i]).html("");
  
          var futureDateEl = $("<h6>");
          var futureDate = new Date(response.list[i + 1].dt * 1000);
          var dateF = futureDate.getDate() + i;
          var monthF = futureDate.getMonth();
  
          var futureIcon = $("<img>");
          var iconURL = "https://openweathermap.org/img/wn/";
          var weatherIcon =
            iconURL + response.list[i + 1].weather[0].icon + ".png";
          var futureDescEl = $("<h6>");
          var futureDesc = response.list[i + 1].weather[0].description;
          var futureTempEl = $("<h6>");
          var futureTemp = Math.ceil(
            (response.list[i + 1].main.temp - 273.15) * 1.8 + 32
          );
          var futureHumEl = $("<h6>");
          var futureHum = response.list[i].main.humidity;
          console.log(futureDate);
  
          $(futureDateEl).html(monthF + "/" + dateF);
          $(futureIcon).attr({ src: weatherIcon, class: "future-weather-icon" });
          $(futureDescEl).html(futureDesc);
          $(futureTempEl).html("Temp: " + futureTemp + " &#8457;");
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
  
        //UV Index API URL pattern
        var uvQueryURL =
          "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" +
          APIKey +
          "&lat=" +
          lat +
          "&lon=" +
          lon;
  
        //AJAX request to retrieve UV index data
        $.ajax({
          url: uvQueryURL,
          method: "GET",
        }).then(function (response) {
          console.log(response);
          //Store UV index data
          var uvIndex = response[0].value;
          var uvBtn = $("<button>");
          $(uvBtn).addClass("uv-button btn");
          $(uvBtn).html(uvIndex);
          $(uvEl).html("UV Index: ");
          $(uvEl).append(uvBtn);
  
          //Color code uv index
          if (uvIndex < 3) {
            $(uvBtn).addClass("uv-index-low");
          } else if (uvIndex >= 3 && uvIndex <= 6) {
            $(uvBtn).addClass("uv-index-moderate");
          } else if (uvIndex > 6 && uvIndex <= 9) {
            $(uvBtn).addClass("uv-index-high");
          } else if (uvIndex > 9 || uvIndex <= 11) {
            $(uvBtn).addClass("uv-index-v-high");
          } else {
            $(uvBtn).addClass("uv-index-extreme");
          }
        });
      });
    }
  
    //Converts meters per second to miles per hour
    function mps2mph(MPS) {
      return Math.floor(MPS * 2.236936);
    }
  
    //Converts Kelvin to Fahrenheit
    function k2f(K) {
      return Math.floor((K - 273.15) * 1.8 + 32);
    }
  
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    renderSearchHistory();
  
    //Function to display current weather data
    function renderSearchHistory() {
      //Devare existing list items before adding new ones
      $(citiesDisplayEl).empty();
  
      //Loop through list of cities
      var recentCities = cities;
  
      for (var i = 0; i < recentCities.length; i++) {
        var c = $("<li>");
        c.addClass("list-group-item prev-search");
        c.attr("city-name", recentCities[i]);
        c.text(recentCities[i].toUpperCase());
  
        //Prepends search input to search history list
        $(citiesDisplayEl).prepend(c);
      }
    }
  
    //Click event function to display city from renderList and display
    $(searchEl).on("click", function (event) {
      //Prevent the form from trying
      event.preventDefault();
  
      //Grab the text from the input box and remove excess spaces before/after string
      var city = $(inputEl).val().trim();
      console.log(city);
      if (city !== "") {
        //Omits adding duplicate searches to search history
        if (cities.indexOf(city) === -1) {
          cities.push(city);
  
          localStorage.setItem("cities", JSON.stringify(cities));
  
          //call renderList function to display array of searched cities
          renderSearchHistory();
        }
  
        getWeatherInfo(city);
      }
    });
  
    function searchBySavedCity() {
      var cityName = $(this).attr("city-name");
  
      getWeatherInfo(cityName);
    }
  
    //Add click event listener to .current-search elements to display the current and 5day forecast
    $(document).on("click", ".prev-search", searchBySavedCity);
  });