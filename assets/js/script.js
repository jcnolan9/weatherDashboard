var lat 
var lon

var current
var current_icon_desc
var current_icon_link
var daily 

var cityInput
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
var fetchCount = 0

//grab today's forecast
function extractCurrentInfo(today) {
    //extract all the data from the object 
    date = moment(today.dt, "X").format("MMM Do YYYY") 
    
    temperature = today.temp
    
    humidity = today.humidity
    
    windspeed = today.wind_speed
    
    uvi = today.uvi
    
    current_icon_desc = today.weather[0].icon
    current_icon_link = "http://openweathermap.org/img/wn/" + current_icon_desc + "@2x.png"
    

    removeOldInfo()

    //create necessary page elements for the today section 
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

    var uvSpan = document.createElement("span")
    var uvText = document.createElement("p")
    uvText.textContent = "UV Index: " + uvi
    todaySection.append(uvSpan)
    uvSpan.append(uvText)
    if(uvi <= 2) {
        uvSpan.setAttribute("class", "low-uvi")
    }
    else if(uvi > 2 && uvi <= 5) {
        uvSpan.setAttribute("class", "med-uvi")
    }
    else {
        uvSpan.setAttribute("class", "high-uvi")
    }

    todaySection.style.padding = "1%"
}

//grab the future 5 day forecast
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

    //loop through the objects for each of the 5 days of the future forecast
    for(var i = 0; i < fiveDayArray.length; i++) {
        futureDate = moment(fiveDayArray[i].dt, "X").format("MMM Do YYYY")
       
        
        tempMax = fiveDayArray[i].temp.max
    
        tempMin = fiveDayArray[i].temp.min
        
        
        futureWindspeed = fiveDayArray[i].wind_speed
        
        
        futureHumidity = fiveDayArray[i].humidity
        

       
        futureIconDesc = fiveDayArray[i].weather[0].icon
        futureIconLink = "http://openweathermap.org/img/wn/" + futureIconDesc + "@2x.png"
        
        //create all the needed elements 
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
    }
}

//use the long and lat coordinates to get the forecasts 
function getWeather() {
    var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=95ebbf75a9f3b9334688363d6e7930b7"
    fetch(weatherURL)
        .then(function (weatherResponse) {
            return weatherResponse.json()
        })
        .then(function (weatherData) {
            current = weatherData.current
            daily = weatherData.daily
            extractCurrentInfo(current)
            extractFutureInfo(daily)
            fetchCount++
         })
    
}

//if it's not the first fetch then remove the old content in the section 
function removeOldInfo () {
    if(fetchCount > 0) {
        while(todaySection.firstChild) {
            todaySection.removeChild(todaySection.firstChild)
        }
        while(fiveDaySection.firstChild) {
            fiveDaySection.removeChild(fiveDaySection.firstChild)
        }
    }
}

//make the actual API call to grab the coordinates of the city and use those to make another call to get the multi-day forecast
//if the city has not already been searched add it to the pastSearches array and create an element for it on screen 
function apiFetch () {
    var coordURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=95ebbf75a9f3b9334688363d6e7930b7"

    fetch(coordURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        lat = data.coord.lat
        lon = data.coord.lon
        city_returned = data.name
        getWeather()
        if(!pastSearch.includes(city_returned)) {
            pastSearch.push(city_returned)
            localStorage.setItem("cities", JSON.stringify(pastSearch))
            var newCity = document.createElement("p")
            newCity.textContent = city_returned
            pastSection.append(newCity)
            newCity.setAttribute("class", "past-searches")
        }
    })
}

//Adding an event listener to the submit button and kicking of the api requests when submit button pressed
document.querySelector("#submit").addEventListener("click", function (e) {
    e.preventDefault()
    cityInput = textInput.value
    apiFetch() 
})

//grabbing anything in local storage
var pastSearchArrayLocal = JSON.parse(localStorage.getItem("cities"))

if(pastSearchArrayLocal == null) {
    pastSearch = []
}
//if there is stuff in local storage loop through the array and set the pastCity array equal to what's in local storage
//create elements on the page with the names of the local sotrage items and add event listeners to them 
else {
    pastSearch = pastSearchArrayLocal

    for(var i = 0; i < pastSearchArrayLocal.length; i++) {
        var pastCity = document.createElement("p")
        pastCity.textContent = pastSearchArrayLocal[i]
        pastSection.append(pastCity)
        pastCity.setAttribute("class", "past-searches")
    }

    document.querySelector("#past").addEventListener("click", function (event) {
        var oldCity = event.target
        if(event.target != pastSection) {
            cityInput = oldCity.textContent
        apiFetch()
        }
    })
}
