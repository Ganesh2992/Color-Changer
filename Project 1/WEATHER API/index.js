const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "480e12cffda170fc2261bbdb0cfa2b88";

weatherForm.addEventListener("submit", async event => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    showLoading();
    try {
      const weatherData = await getWeatherDate(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error.message);
    }
  } else {
    displayError("Please enter a Place");
  }
});

async function getWeatherDate(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }
  return await response.json();
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
    timezone,
    sys: { country }
  } = data;

  card.textContent = "";
  card.style.display = "flex";

  
  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");
  const timeDisplay = document.createElement("p");
  const toggleBtn = document.createElement("button");

  
  let isCelsius = true;
  const tempC = (temp - 273.15).toFixed(1);
  const tempF = ((tempC * 9) / 5 + 32).toFixed(1);

  
  cityDisplay.textContent = `${city}, ${country}`;
  tempDisplay.textContent = `${tempC}°C`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = description;
  weatherEmoji.textContent = getWeatherEmoji(id);
  timeDisplay.classList.add("timeDisplay");
  toggleBtn.textContent = "Switch to °F";

  
  toggleBtn.classList.add("toggleBtn");
  toggleBtn.addEventListener("click", () => {
    isCelsius = !isCelsius;
    tempDisplay.textContent = isCelsius ? `${tempC}°C` : `${tempF}°F`;
    toggleBtn.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
  });

  
  setInterval(() => {
    timeDisplay.textContent = getCityTimeString(timezone);
  }, 1000);

  
  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidtyDisplay");
  descDisplay.classList.add("descDisplay");
  weatherEmoji.classList.add("weatherEmoji");

  
  card.appendChild(cityDisplay);
  card.appendChild(timeDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(toggleBtn);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(weatherEmoji);
  
  
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️";
    case weatherId >= 300 && weatherId < 400:
      return "☔";
    case weatherId >= 500 && weatherId < 600:
      return "🌧️";
    case weatherId >= 600 && weatherId < 700:
      return "❄️";
    case weatherId >= 700 && weatherId < 800:
      return "🌫️";
    case weatherId === 800:
      return "☀️";
    case weatherId >= 801 && weatherId < 810:
      return "☁️";
    default:
      return "❓";
  }
}

function getCityTimeString(offsetInSeconds) {
  const localTime = new Date(Date.now() + offsetInSeconds * 1000);

  let hours = localTime.getUTCHours();
  let minutes = localTime.getUTCMinutes();
  let seconds = localTime.getUTCSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

function displayError(message) {
  card.textContent = "";
  card.style.display = "flex";

  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");
  card.appendChild(errorDisplay);
}

function showLoading() {
  card.textContent = "";
  card.style.display = "flex";

  const loading = document.createElement("p");
  loading.textContent = "Loading weather...";
  loading.style.fontSize = "2rem";
  loading.style.fontWeight = "bold";
  loading.style.color = "#fff";

  card.appendChild(loading);
}
