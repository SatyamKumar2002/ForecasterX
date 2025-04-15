import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});

  // Function to fetch weather based on latitude & longitude
  const getCurrentLocationWeather = useCallback((lat, lon) => {
    axios
      .get(`${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`)
      .then((response) => {
        setWeather(response.data);
        setError("");
      })
      .catch((err) => {
        console.error("API Error:", err.response ? err.response.data : err.message);
        setWeather({});
        setError({ message: "Unable to fetch location data" });
      });
  }, []);

  // Function to request user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location Access Granted!");
          getCurrentLocationWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation Error:", error.message);
          search("Delhi"); // Fallback location if denied
        }
      );
    } else {
      console.error("Geolocation not supported.");
      search("Delhi"); // Fallback to Delhi
    }
  }, [getCurrentLocationWeather]);

  // Function to search weather by city name
  const search = (city) => {
    axios
      .get(`${apiKeys.base}weather?q=${city}&units=metric&APPID=${apiKeys.key}`)
      .then((response) => {
        setWeather(response.data);
        setQuery("");
        setError("");
      })
      .catch((err) => {
        console.error("API Error:", err.response ? err.response.data : err.message);
        setWeather({});
        setError({ message: "Location Not Found", query: query });
      });
  };

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={props.icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{props.weather}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              alt="Search Icon"
              onClick={() => search(query)}
            />
          </div>
        </div>
        <ul>
          {weather.main ? (
            <div>
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">{Math.round(weather.main.humidity)}%</span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">{Math.round(weather.visibility)} mi</span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">{Math.round(weather.wind.speed)} Km/h</span>
              </li>
            </div>
          ) : (
            error.message && (
              <li>
                {error.query} {error.message}
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default Forecast;
