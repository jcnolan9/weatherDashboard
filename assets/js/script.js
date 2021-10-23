var lat 
var lon

var current
var current_icon_desc
var current_icon_link
var daily 

var city_returned
var date 
var temperature
var humidity
var windspeed
var uvi 

var textInput = document.querySelector("#city")
var todaySection = document.querySelector("#today")
var fiveDaySection = document.querySelector("#future")
var pastSection = document.querySelector("#past")

var pastSearch = []

function extractCurrentInfo(today) {
    date = moment(today.dt, "X").format("MMM Do YYYY") 
    console.log("Today: " + today.dt)
    console.log(date)
    temperature = today.temp
    console.log(temperature)
    humidity = today.humidity
    console.log(humidity)
    windspeed = today.wind_speed
    console.log(windspeed)
    uvi = today.uvi
    console.log(uvi)
    current_icon_desc = today.weather[0].icon
    current_icon_link = "http://openweathermap.org/img/wn/" + current_icon_desc + "@2x.png"
    console.log(current_icon_link)

    var currentHeader = document.createElement("h2")
    currentHeader.textContent = city_returned + " " + "(" + date + ")"
    todaySection.append(currentHeader)

    var imgToday = document.createElement("img")
    imgToday.setAttribute("src", current_icon_link) 
    todaySection.append(imgToday)

    var tempText = document.createElement("p")
    tempText.textContent = "Temp: " + temperature + "\xB0F"
    todaySection.append(tempText)

    var windText = document.createElement("p")
    windText.textContent = "Wind: " + windspeed + " MPH"
    todaySection.append(windText)

    var humidText = document.createElement("p")
    humidText.textContent = "Humidity: " + humidity + " %"
    todaySection.append(humidText)

    var uvText = document.createElement("p")
    uvText.textContent = "UV Index: " + uvi
    todaySection.append(uvText)

    todaySection.style.padding = "1%"
}

function extractFutureInfo(future) {
    var fiveDayArray = future.slice(1,6)
    
    var fiveDayHeader = document.createElement("h2")
    fiveDayHeader.textContent = "5 Day Forecast:"
    fiveDaySection.append(fiveDayHeader)

    
    var weatherDiv = document.createElement("div")
    weatherDiv.setAttribute("id", "five-day-div") 
    fiveDaySection.append(weatherDiv)

    var futureDate
    var tempMax 
    var tempMin
    var futureWindspeed
    var futureHumidity
    var futureIconDesc
    var daySection
    var futureDateText
    var imgFuture
    var tempMaxFutureText
    var tempMinFutureText
    var windFutureText
    var humidFutureText

    for(var i = 0; i < fiveDayArray.length; i++) {
        futureDate = moment(fiveDayArray[i].dt, "X").format("MMM Do YYYY")
        console.log(moment(fiveDayArray[i].dt, "X").format("MMM Do YYYY"))
        
        tempMax = fiveDayArray[i].temp.max
        console.log(fiveDayArray[i].temp.max)
        tempMin = fiveDayArray[i].temp.min
        console.log(fiveDayArray[i].temp.min)
        
        futureWindspeed = fiveDayArray[i].wind_speed
        console.log(fiveDayArray[i].wind_speed)
        
        futureHumidity = fiveDayArray[i].humidity
        console.log(fiveDayArray[i].humidity)

        console.log(fiveDayArray[i])
        futureIconDesc = fiveDayArray[i].weather[0].icon
        // console.log(futureIconDesc)
        futureIconLink = "http://openweathermap.org/img/wn/" + futureIconDesc + "@2x.png"
        
        daySection = document.createElement("section")
        daySection.setAttribute("id", "day-" + i)
        weatherDiv.append(daySection)

        futureDateText = document.createElement("h3")
        futureDateText.textContent = futureDate
        daySection.append(futureDateText)

        imgFuture = document.createElement("img")
        imgFuture.setAttribute("src", futureIconLink) 
        daySection.append(imgFuture)

        tempMaxFutureText = document.createElement("p")
        tempMaxFutureText.textContent = "Max Temp: " + tempMax + "\xB0F"
        daySection.append(tempMaxFutureText)

        tempMinFutureText = document.createElement("p")
        tempMinFutureText.textContent = "Max Temp: " + tempMin + "\xB0F"
        daySection.append(tempMinFutureText)

        windFutureText = document.createElement("p")
        windFutureText.textContent = "Wind: " + futureWindspeed + " MPH"
        daySection.append(windFutureText)

        humidFutureText = document.createElement("p")
        humidFutureText.textContent = "Humidity: " + futureHumidity + " %"
        daySection.append(humidFutureText)
        
        console.log("i = " + i)
    }
}

function getWeather() {
    var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=95ebbf75a9f3b9334688363d6e7930b7"
    fetch(weatherURL)
        .then(function (weatherResponse) {
            return weatherResponse.json()
        })
        .then(function (weatherData) {
            console.log(weatherData)
            current = weatherData.current
            console.log(current)
            daily = weatherData.daily
            console.log(daily)
            extractCurrentInfo(current)
            extractFutureInfo(daily)
         })
}


document.querySelector("#submit").addEventListener("click", function (e) {
    e.preventDefault()
    console.log("clicked")
    var cityInput = textInput.value
    var coordURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=95ebbf75a9f3b9334688363d6e7930b7"

    fetch(coordURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data)
        lat = data.coord.lat
        lon = data.coord.lon
        console.log("Lat: " + lat)
        console.log("Lon: " + lon)
        city_returned = data.name
        console.log(city_returned)
        getWeather()
        pastSearch.push(city_returned)
        localStorage.setItem("cities", JSON.stringify(pastSearch))
    })
})

var pastSearchArrayLocal = JSON.parse(localStorage.getItem("cities"))

if(pastSearchArrayLocal == null) {
    pastSearch = []
}
else {
    pastSearch = pastSearchArrayLocal
    console.log("Not null")

    for(var i = 0; i < pastSearchArrayLocal.length; i++) {
        var pastCity = document.createElement("p")
        pastCity.textContent = pastSearchArrayLocal[i]
        pastSection.append(pastCity)
    }
}







/*
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/