const apiKey = "ff3f4cab60d167e921d20f4c64692765";

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

// Event
btn.addEventListener("click", getWeather);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});

function getWeather() {
  const city = input.value.trim();

  if (!city) {
    alert("Enter city name");
    return;
  }

  loading.classList.remove("hidden");
  card.classList.add("hidden");
  error.classList.add("hidden");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {

      loading.classList.add("hidden");

      if (data.cod !== 200) {
        error.classList.remove("hidden");
        return;
      }

      card.classList.remove("hidden");

      // UI Update
      cityName.innerText = data.name.toUpperCase();
      temp.innerText = `Temp: ${data.main.temp} °C`;
      condition.innerText = `Condition: ${data.weather[0].main}`;
      humidity.innerText = `Humidity: ${data.main.humidity}%`;
      wind.innerText = `Wind: ${data.wind.speed} m/s`;

      // Icon
      const iconCode = data.weather[0].icon;
      icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      // Background change
      changeBackground(data.weather[0].main);

      saveHistory(city);
    })
    .catch(() => {
      loading.classList.add("hidden");
      error.classList.remove("hidden");
    });
}

//Dynamic Background
function changeBackground(weather) {
  if (weather === "Clear") {
    card.style.background = "#ffeaa7";
  } else if (weather === "Rain") {
    card.style.background = "#74b9ff";
  } else if (weather === "Clouds") {
    card.style.background = "#dfe6e9";
  } else {
    card.style.background = "#fab1a0";
  }
}

//Dark Mode
document.getElementById("toggleMode").onclick = () => {
  document.body.classList.toggle("dark");
};

//History
function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (!history.includes(city)) {
    history.push(city);
    if (history.length > 5) history.shift();
    localStorage.setItem("history", JSON.stringify(history));
  }

  showHistory();
}

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

function clearHistory() {
  localStorage.removeItem("history");
  showHistory();
}

showHistory();