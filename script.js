const apiKey = "ff3f4cab60d167e921d20f4c64692765"; // ✅ FIXED

const btn = document.getElementById("btn");
const input = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");

const card = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

const historyList = document.getElementById("historyList");

//Correct icon paths
const weatherIcons = {
  clear: "Icons/sun.jpg",
  clouds: "Icons/clouds.jpg",
  rain: "Icons/rain.jpg",
  drizzle: "Icons/drizzle.jpg",
  thunderstorm: "Icons/storm.jpg",
  haze: "Icons/haze.png"
};

//Button click
btn.addEventListener("click", getWeather);

//Enter key support
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});

function getWeather() {
  const city = input.value.trim();
  if (city === "") return;

  loading.classList.remove("hidden");
  card.classList.add("hidden");
  error.classList.add("hidden");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      loading.classList.add("hidden");

      if (data.cod != 200) {
        error.classList.remove("hidden");
        return;
      }

      card.classList.remove("hidden");

      cityName.innerText = data.name;
      temp.innerText = "Temp: " + data.main.temp + " °C";
      condition.innerText = data.weather[0].main;
      humidity.innerText = "Humidity: " + data.main.humidity + "%";
      wind.innerText = "Wind: " + data.wind.speed + " km/h";

      // icon logic
      const weatherMain = data.weather[0].main.toLowerCase();
      icon.src = weatherIcons[weatherMain] || weatherIcons.clear;

      saveHistory(city);
    })
    .catch(() => {
      loading.classList.add("hidden");
      error.classList.remove("hidden");
    });
}

//Toggle mode
document.getElementById("toggleMode").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

//Save history
function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("history", JSON.stringify(history));
  }

  showHistory();
}

//Show history
function showHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  historyList.innerHTML = "";

  history.forEach(city => {
    const li = document.createElement("li");
    li.innerText = city;

    li.onclick = () => {
      input.value = city;
      getWeather();
    };

    historyList.appendChild(li);
  });
}

// 🧹 Clear history
function clearHistory() {
  localStorage.removeItem("history");
  showHistory();
}

// Load history on start
showHistory();