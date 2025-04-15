import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [locationFetched, setLocationFetched] = useState(false); // Tracks whether location was fetched

  // Function to fetch weather based on latitude & longitude
  const getCurrentLocationWeather = useCallback((lat, lon) => {
    console.log("Fetching weather for current location...");
    axios.get(`${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`)
      .then((response) => {
        console.log("Weather Data for Current Location:", response.data);
        setWeather(response.data);
        setError("");
        setLocationFetched(true); // Mark location as fetched
      })
      .catch((err) => {
        console.error("API Error:", err.response ? err.response.data : err.message);
        setWeather({});
        setError({ message: "Unable to fetch location data" });
      });
  }, []);

  // Function to search weather by city name
  const search = useCallback(() => {
    if (!query.trim()) {
      setError({ message: "Please enter a valid city name" });
      return;
    }
    console.log("Searching for:", query);

    axios.get(`${apiKeys.base}weather?q=${query}&units=metric&APPID=${apiKeys.key}`)
      .then((response) => {
        console.log("Weather Data for Searched Location:", response.data);
        setWeather(response.data);
        setError("");
      })
      .catch((err) => {
        console.error("API Error:", err.response ? err.response.data : err.message);
        setWeather({});
        setError({ message: "Location Not Found", query });
      });
  }, [query]);

  // Automatically request user's location on startup
  useEffect(() => {
    if (!locationFetched && "geolocation" in navigator) {
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
    }
  }, [getCurrentLocationWeather, search, locationFetched]); // Ensure it runs only once

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
              onClick={search} // Trigger search dynamically
            />
          </div>
        </div>
        <ul>
          {weather.main ? (
            <div>
              <li className="cityHead">
                <p>{weather.name}, {weather.sys.country}</p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather Icon"
                />
              </li>
              <li>
                Temperature <span className="temp">{Math.round(weather.main.temp)}°c ({weather.weather[0].main})</span>
              </li>
              <li>
                Humidity <span className="temp">{Math.round(weather.main.humidity)}%</span>
              </li>
              <li>
                Visibility <span className="temp">{Math.round(weather.visibility)} mi</span>
              </li>
              <li>
                Wind Speed <span className="temp">{Math.round(weather.wind.speed)} Km/h</span>
              </li>
            </div>
          ) : (
            error.message && (
              <li>{error.query ? `${error.query}: ${error.message}` : error.message}</li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default Forecast;











// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import apiKeys from "./apiKeys";
// import ReactAnimatedWeather from "react-animated-weather";

// function Forecast(props) {
//   const [query, setQuery] = useState("");
//   const [error, setError] = useState("");
//   const [weather, setWeather] = useState({});

//   // Function to fetch weather based on latitude & longitude
//   const getCurrentLocationWeather = useCallback((lat, lon) => {
//     axios
//       .get(`${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`)
//       .then((response) => {
//         setWeather(response.data);
//         setError("");
//       })
//       .catch((err) => {
//         console.error("API Error:", err.response ? err.response.data : err.message);
//         setWeather({});
//         setError({ message: "Unable to fetch location data" });
//       });
//   }, []);

//   // Function to search weather by city name
//   const search = useCallback((city) => {
//     axios
//       .get(`${apiKeys.base}weather?q=${city}&units=metric&APPID=${apiKeys.key}`)
//       .then((response) => {
//         setWeather(response.data);
//         setQuery("");
//         setError("");
//       })
//       .catch((err) => {
//         console.error("API Error:", err.response ? err.response.data : err.message);
//         setWeather({});
//         setError({ message: "Location Not Found", query: query });
//       });
//   }, []);

//   // Function to request user's location
//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           console.log("Location Access Granted!");
//           getCurrentLocationWeather(position.coords.latitude, position.coords.longitude);
//         },
//         (error) => {
//           console.error("Geolocation Error:", error.message);
//           search("Delhi"); // Fallback location if denied
//         }
//       );
//     } else {
//       console.error("Geolocation not supported.");
//       search("Delhi"); // Fallback to Delhi
//     }
//   }, [getCurrentLocationWeather, search]); // Added 'search' to dependencies

//   const defaults = {
//     color: "white",
//     size: 112,
//     animate: true,
//   };

//   return (
//     <div className="forecast">
//       <div className="forecast-icon">
//         <ReactAnimatedWeather
//           icon={props.icon}
//           color={defaults.color}
//           size={defaults.size}
//           animate={defaults.animate}
//         />
//       </div>
//       <div className="today-weather">
//         <h3>{props.weather}</h3>
//         <div className="search-box">
//           <input
//             type="text"
//             className="search-bar"
//             placeholder="Search any city"
//             onChange={(e) => setQuery(e.target.value)}
//             value={query}
//           />
//           <div className="img-box">
//             <img
//               src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
//               alt="Search Icon"
//               onClick={() => search(query)}
//             />
//           </div>
//         </div>
//         <ul>
//           {weather.main ? (
//             <div>
//               <li className="cityHead">
//                 <p>
//                   {weather.name}, {weather.sys.country}
//                 </p>
//                 <img
//                   className="temp"
//                   src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
//                   alt="Weather Icon"
//                 />
//               </li>
//               <li>
//                 Temperature{" "}
//                 <span className="temp">
//                   {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
//                 </span>
//               </li>
//               <li>
//                 Humidity{" "}
//                 <span className="temp">{Math.round(weather.main.humidity)}%</span>
//               </li>
//               <li>
//                 Visibility{" "}
//                 <span className="temp">{Math.round(weather.visibility)} mi</span>
//               </li>
//               <li>
//                 Wind Speed{" "}
//                 <span className="temp">{Math.round(weather.wind.speed)} Km/h</span>
//               </li>
//             </div>
//           ) : (
//             error.message && (
//               <li>
//                 {error.query} {error.message}
//               </li>
//             )
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Forecast;
