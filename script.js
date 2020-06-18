$(document).ready(function () {
    const APIKey = "cc3550ca747909c191efae6397fdaa94";
    const citiesDisplayEl = document.querySelector(".cities-holder");
    let inputEl = document.getElementById("city-input");
    const searchEl = document.getElementById("search");
    const currentCityEl = document.getElementById("current-city");
    const currentDateEl = document.getElementById("current-date");
    const tempEl = document.getElementById("temp");
    const humidityEl = document.getElementById("humidity");
    const windEl = document.getElementById("wind");
    const uvEl = document.getElementById("uv-index");
    const iconEl = document.getElementById("weather-icon");
    const forecastDivs = document.querySelectorAll(".forecast");
    const title = document.querySelector("title");
  
    function getWeatherInfo(cityName) {
      //URL pattern to query the database
      let queryURL =
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
  
        let city = response.city.name + ", " + response.city.country;
        const currentDate = new Date(response.list[0].dt * 1000);
        const date = currentDate.getDate();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        let currentTemp = response.list[0].main.temp;
        let humidityLevel = response.list[0].main.humidity;
        let windSpeed = response.list[0].wind.speed;
        let iconURL = response.list[0].weather[0].icon;
        let weatherIcon = $("<img>");
  
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
  
        for (let i = 0; i < forecastDivs.length; i++) {
          $(forecastDivs[i]).html("");
  
          let futureDateEl = $("<h6>");
          const futureDate = new Date(response.list[i + 1].dt * 1000);
          const dateF = futureDate.getDate() + i;
          const monthF = futureDate.getMonth();
  
          let futureIcon = $("<img>");
          let iconURL = "https://openweathermap.org/img/wn/";
          let weatherIcon =
            iconURL + response.list[i + 1].weather[0].icon + ".png";
          let futureDescEl = $("<h6>");
          let futureDesc = response.list[i + 1].weather[0].description;
          let futureTempEl = $("<h6>");
          let futureTemp = Math.ceil(
            (response.list[i + 1].main.temp - 273.15) * 1.8 + 32
          );
          let futureHumEl = $("<h6>");
          let futureHum = response.list[i].main.humidity;
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
  
        let lat = response.city.coord.lat;
        let lon = response.city.coord.lon;
  
        //UV Index API URL pattern
        let uvQueryURL =
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
          let uvIndex = response[0].value;
          let uvBtn = $("<button>");
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
  
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    renderSearchHistory();
  
    //Function to display current weather data
    function renderSearchHistory() {
      //Delete existing list items before adding new ones
      $(citiesDisplayEl).empty();
  
      //Loop through list of cities
      let recentCities = cities;
  
      for (let i = 0; i < recentCities.length; i++) {
        let c = $("<li>");
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
      let city = $(inputEl).val().trim();
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
      let cityName = $(this).attr("city-name");
  
      getWeatherInfo(cityName);
    }
  
    //Add click event listener to .current-search elements to display the current and 5day forecast
    $(document).on("click", ".prev-search", searchBySavedCity);
  });