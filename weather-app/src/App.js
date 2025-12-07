import React, { useState } from "react";
import { Wind, Sunrise, Sunset, Search, MapPin, Sun } from "lucide-react";

function App() {
  const [city, setCity] = useState("Mysore");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const popularCities = [
    "Mysore", "Bangalore", "Mumbai", "Delhi", "Chennai",
    "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur",
    "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore",
    "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna"
  ];

  const fetchWeather = React.useCallback(async (cityName = city) => {
    if (!cityName.trim()) {
      setError("Please select a city");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results) {
        setError("City not found. Please try another city.");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country, admin1 } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=sunrise,sunset&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        temperature: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        weatherCode: weatherData.current_weather.weathercode,
        city: name,
        country: country,
        state: admin1,
        sunrise: weatherData.daily.sunrise[0],
        sunset: weatherData.daily.sunset[0]
      });

    } catch (error) {
      setError("Unable to fetch weather data. Please try again.");
    }
    setLoading(false);
  }, [city]);


  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    if (selectedCity) {
      fetchWeather(selectedCity);
    }
  };

  // Load Mysore weather on initial mount
  React.useEffect(() => {
    fetchWeather("Mysore");
  }, [fetchWeather]);



  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Foggy",
      51: "Light drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Light snow",
      73: "Moderate snow",
      75: "Heavy snow",
      95: "Thunderstorm"
    };
    return weatherCodes[code] || "Unknown";
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        paddingTop: '40px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              animation: 'rotate 8s linear infinite',
              position: 'relative',
              filter: 'drop-shadow(0 0 20px rgba(252, 211, 77, 0.8))'
            }}>
              <Sun size={40} style={{
                color: '#FCD34D'
              }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '600' }}>Weather Forecast updated</h1>
          </div>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>Real-time weather information for any city worldwide</p>
        </div>

        {/* Search Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: error ? '16px' : '0',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <MapPin style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none',
                zIndex: 1
              }} size={20} />
              <select
                value={city}
                onChange={handleCityChange}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  fontSize: '16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  background: 'white',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                  paddingRight: '40px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              >
                {popularCities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => fetchWeather()}
              disabled={loading}
              style={{
                padding: '16px 32px',
                background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Search size={20} />
              {loading ? 'Loading...' : 'Get Weather'}
            </button>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#FEE2E2',
              color: '#DC2626',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Weather Data Card */}
        {weather && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            {/* Location */}
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '32px',
                fontWeight: '600',
                color: '#1F2937'
              }}>
                {weather.city}
              </h2>
              <p style={{
                margin: 0,
                fontSize: '16px',
                color: '#6B7280'
              }}>
                {weather.state && `${weather.state}, `}{weather.country}
              </p>
            </div>

            {/* Main Temperature */}
            <div style={{
              textAlign: 'center',
              padding: '32px',
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontSize: '72px',
                fontWeight: '700',
                color: '#667eea',
                marginBottom: '8px'
              }}>
                {Math.round(weather.temperature)}°C
              </div>
              <div style={{
                fontSize: '20px',
                color: '#6B7280',
                fontWeight: '500'
              }}>
                {getWeatherDescription(weather.weatherCode)}
              </div>
            </div>

            {/* Weather Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {/* Wind Speed */}
              <div style={{
                padding: '20px',
                background: '#F9FAFB',
                borderRadius: '12px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Wind size={24} color="#667eea" />
                  <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>Wind Speed</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937' }}>
                  {weather.wind} m/s
                </div>
              </div>

              {/* Sunrise */}
              <div style={{
                padding: '20px',
                background: '#F9FAFB',
                borderRadius: '12px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Sunrise size={24} color="#F59E0B" />
                  <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>Sunrise</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937' }}>
                  {formatTime(weather.sunrise)}
                </div>
              </div>

              {/* Sunset */}
              <div style={{
                padding: '20px',
                background: '#F9FAFB',
                borderRadius: '12px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Sunset size={24} color="#F97316" />
                  <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>Sunset</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937' }}>
                  {formatTime(weather.sunset)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          color: 'white',
          opacity: 0.8,
          fontSize: '14px'
        }}>
          Powered by Open-Meteo API
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default App;