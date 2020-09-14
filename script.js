//var for a new search
var search = $("#new-info");
// creates a history of the user search
if (localStorage.getItem("userSearch") === null) {
  searchesSaved = [];
} else {
  var searchesSaved = localStorage
    .getItem("userSearch")
    .split(",")
    .map((x) => {
      return x;
    });

  // list of the history
  for (var i = 0; i < searchesSaved.length; i++) {
    $(search).prepend(
      "<li class= 'list-group-item border' type= 'button'  id=newCity" +
        [i] +
        ">" +
        searchesSaved[i] +
        "</li>"
    );
  }
}

$("li").on("click", function () {
  userSearch = $("#" + this.id).text();
  weatherInfo(userSearch);
});

//my api key
var apiKey = "bc6f7f89369cd98e5a9e6dc5f825912d";

//created the header using java to test my skills
var title = $("header").text("⚡Weather Dashboard⚡");
title.attr(
  "style",
  "background-color: rgb(69, 177, 227),#45b1e3 ; text-align: center; height: 70px; font-size: xxx-large; padding-top: .10%"
);
$("body").prepend(title);

$(document).ready(function () {
  //Adding event listener to my search button
  $("#button").on("click", function () {
    event.preventDefault();

    //make sure event listener is working
    console.log("Test");

    //Create a var that holds what is typed into the search area
    var userSearch = $("#search").val();

    //make sure it works
    console.log(userSearch);

    //This function is just adding the cities being searched to the list
    searchesSaved.push(userSearch);

    //When entering new city im checking the searchesSaved var to see if city has already been searched
    //If not then push it into the searchesSaved var
    window.localStorage.setItem("userSearch", searchesSaved);
    //calling a function
    weatherInfo(userSearch);

    //appending new search to html
    $(search).prepend(
      "<li class= 'list-group-item border' id=newCity" +
        searchesSaved.length +
        ">" +
        userSearch +
        "</li>"
    );
    $(search).attr("type", "button");
    $(search).addClass("type", "card-body");
  });
});

function weatherInfo(userSearch) {
  var nameTime = $("#main");
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userSearch +
    "&units=imperial&APPID=" +
    apiKey;
  var currentTemp = $("#temp");
  var humidity = $("#humidity");
  var wind = $("#wind");
  var uvIndex = $("#uvIndex");
  var imageUrl = "http://openweathermap.org/img/wn/";
  var weekWeather = $("#forcast");
  var span = $("#span2");

  //ajax call to get the weather details
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var windSpeed = Math.floor(response.wind.speed);
    var Temperature = Math.floor(response.main.temp);

    //displays the city name along with current date
    $(nameTime).text(response.name + moment().format(" (MM/DD/YYYY)"));

    //tagging on the weather icon
    $(nameTime).append(
      $("<img>").attr("src", imageUrl + response.weather[0].icon + "@2x.png")
    );
    console.log(imageUrl + response.weather[3]);

    //current temp being added
    $(currentTemp).html(
      "Temperature: " + JSON.stringify(Temperature) + " &#8457;"
    );

    //showing humidity levels
    $(humidity).text(
      "Humidity: " + JSON.stringify(response.main.humidity) + "%"
    );
    console.log(response);

    //shows wind speed
    $(wind).text("Wind Speed: " + JSON.stringify(windSpeed) + " MPH");
    console.log(response);

    var lat = response.coord.lat;
    var lon = response.coord.lon;

    //calling for uv index readings
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey,
      method: "GET",
    }).then(function (uvIndexResponse) {
      var uvNumber = uvIndexResponse.value;
      var uvColor;
      //adding color to the uv div depending on uv levels
      if (uvNumber <= 3) {
        uvColor = "green";
      } else {
        uvColor = "red";
      }
      $(uvIndex).text("UV Index: ");
      $(span).text(JSON.stringify(uvNumber));
      $(span).attr("style", "background-color:" + uvColor);
    });

    // five day forcast call
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        userSearch +
        "&units=imperial&appid=" +
        apiKey,
      method: "GET",
    }).then(function (fiveDayResponse) {
      console.log(fiveDayResponse);
      weekWeather.text("");
      for (var i = 0; i < fiveDayResponse.list.length; i++) {
        if (fiveDayResponse.list[i].dt_txt.indexOf("12:00:00") !== -1) {
          var newCol = $("<div>").attr("class", "fivecards");
          weekWeather.append(newCol);

          var newCard = $("<div>").attr("class", "card text-white bg-primary");
          newCol.append(newCard);

          var cardHead = $("<div>")
            .attr("class", "card-header")
            .text(moment(fiveDayResponse.list[i].dt, "X").format("MMM Do"));
          newCard.append(cardHead);

          var cardImg = $("<img>")
            .attr("class", "card-img-top")
            .attr(
              "src",
              "https://openweathermap.org/img/wn/" +
                fiveDayResponse.list[i].weather[0].icon +
                "@2x.png"
            );
          newCard.append(cardImg);

          var bodyDiv = $("<div>").attr("class", "card-body");
          newCard.append(bodyDiv);

          bodyDiv.append(
            $("<p>")
              .attr("class", "card-text")
              .html(
                "Temp: " +
                  Math.floor(fiveDayResponse.list[i].main.temp) +
                  " &#8457;"
              )
          );
          bodyDiv.append(
            $("<p>")
              .attr("class", "card-text")
              .text("Humidity: " + fiveDayResponse.list[i].main.humidity + "%")
          );
          newCard.attr("style", "margin-left: 8px");
        }
      }
    });
  });
}
