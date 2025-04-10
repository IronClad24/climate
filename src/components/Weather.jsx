import { BackgroundCircles, Gradient } from './design/Hero';
import React, { useEffect, useRef, useState } from 'react';

import Button from './Button';
import Section from './Section';
import { motion } from 'framer-motion';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const suggestionsRef = useRef(null);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    await fetchWeather(latitude, longitude);
                    const cityName = await getCityFromCoordinates(latitude, longitude);
                    setCity(cityName);
                    setSearchQuery(cityName);
                },
                (err) => {
                    setError('Unable to retrieve your location. Please search manually.');
                    console.error('Geolocation error:', err);
                }
            );
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getCityFromCoordinates = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
            );
            if (!response.ok) throw new Error(`Geocoding failed with status: ${response.status}`);
            const data = await response.json();
            const cityName = data.address.city || data.address.town || data.address.village || 'Unknown Location';
            const countryName = data.address.country || '';
            return countryName ? `${cityName}, ${countryName}` : cityName;
        } catch (err) {
            console.error('Geocoding error:', err);
            return 'Unknown Location';
        }
    };

    const fetchCoordinates = async (cityName) => {
        try {
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5`
            );
            if (!response.ok) throw new Error(`Failed to fetch coordinates: ${response.status}`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                setSuggestions(data.results.map((result) => ({
                    name: `${result.name}, ${result.country}`,
                    latitude: result.latitude,
                    longitude: result.longitude,
                })));
                return {
                    latitude: data.results[0].latitude,
                    longitude: data.results[0].longitude,
                    name: `${data.results[0].name}, ${data.results[0].country}`,
                };
            }
            throw new Error('City not found');
        } catch (err) {
            throw new Error(`Failed to fetch coordinates: ${err.message}`);
        }
    };

    const fetchWeather = async (lat, lon) => {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,winddirection_10m_dominant,sunrise,sunset&current_weather=true&timezone=auto&forecast_days=5`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch weather: ${response.status}`);
            const data = await response.json();
            if (!data.daily || !data.current_weather) throw new Error('Incomplete weather data');
            setWeatherData(data);
        } catch (err) {
            throw new Error(`Failed to fetch weather data: ${err.message}`);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        setLoading(true);
        setError(null);
        try {
            const { latitude, longitude, name } = await fetchCoordinates(searchQuery);
            await fetchWeather(latitude, longitude);
            setCity(name);
            setSearchQuery('');
        } catch (err) {
            setError(err.message);
            if (err.message.includes('400')) {
                setError('Invalid request. Please check your input and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = async (suggestion) => {
        setLoading(true);
        setError(null);
        try {
            await fetchWeather(suggestion.latitude, suggestion.longitude);
            setCity(suggestion.name);
            setSearchQuery('');
        } catch (err) {
            setError(err.message);
            if (err.message.includes('400')) {
                setError('Invalid request. Please check your input and try again.');
            }
        } finally {
            setLoading(false);
            setSuggestions([]);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.3 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const formatTime = (isoString) => new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const buttonClasses = `relative inline-flex items-center justify-center h-11 px-7 text-n-8`;
    const spanClasses = "relative z-10";

    return (
        <Section className="min-h-screen pt-[10rem] -mt-[5.25] overflow-hidden" crosses crossesOffset="lg:translate-y-[5.25rem]" customPaddings="pt-[12rem] -mt-[5.25rem]" id="weather">
            <motion.div className="container relative flex flex-col min-h-[calc(100vh-12rem)]" variants={containerVariants} initial="hidden" animate="visible">
                <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
                    <h1 className="h1 mb-6">Weather Insights{city && ` for ${city}`}</h1>
                    <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
                        {userLocation ? 'Your location-based weather is displayed below. Search for another city if desired.' : 'Search for your city to see today’s weather and a 5-day forecast'}
                    </p>
                    <div ref={searchContainerRef}>
                        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 relative mb-12">
                            <div className="relative z-1 p-0.5 rounded-xl w-full bg-conic-gradient">
                                <input
                                    type="text"
                                    placeholder="Enter city name"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value.length > 2) fetchCoordinates(e.target.value).catch(() => setSuggestions([]));
                                    }}
                                    className={`${buttonClasses} w-full rounded-xl outline-none focus:ring-0`}
                                />
                                
                            </div>
                            {suggestions.length > 0 && (
                                <ul ref={suggestionsRef} className="absolute top-full left-0 right-0 p-0.5 bg-conic-gradient rounded-xl mt-2 max-h-40 overflow-y-auto z-10">
                                    <div className="bg-n-9/40 backdrop-blur rounded-xl">
                                        {suggestions.map((suggestion, idx) => (
                                            <li
                                                key={idx}
                                                className={`${buttonClasses} px-4 py-2 hover:bg-n-9/20 cursor-pointer text-n-2`}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                <span className={spanClasses}>{suggestion.name}</span>
                                            </li>
                                            
                                        ))}
                                    </div>
                                </ul>
                            )}

                            <Button white type="submit" disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </form>
                    </div>
                    {error && (
                        <motion.div
                            className="mt-4 p-4 bg-white rounded-xl text-red-500 max-w-md mx-auto shadow-md"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {error}
                        </motion.div>
                    )}
                </div>

                {/* Current Weather with fixed spacing */}
                <motion.div 
                    className="relative max-w-[30rem] mx-auto mb-12 mt-12" 
                    variants={itemVariants}
                >
                    <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                        <div className="relative bg-n-8 rounded-[1rem] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">{`Today in ${city || 'Loading...'}`}</h2>
                                {/* WeatherAnimation component would go here */}
                            </div>
                            {weatherData?.current_weather && !loading ? (
                                <div className="grid grid-cols-2 gap-4 text-n-2">
                                    <div>Max Temp: {weatherData.daily.temperature_2m_max[0]}°C</div>
                                    <div>Min Temp: {weatherData.daily.temperature_2m_min[0]}°C</div>
                                    <div>Wind Speed: {weatherData.current_weather.windspeed} km/h</div>
                                    <div>Wind Direction: {weatherData.current_weather.winddirection}°</div>
                                    <div>Sunrise: {formatTime(weatherData.daily.sunrise[0])}</div>
                                    <div>Sunset: {formatTime(weatherData.daily.sunset[0])}</div>
                                </div>
                            ) : (
                                <p className="text-n-2">{loading ? 'Loading...' : 'Search for a city to see weather data'}</p>
                            )}
                        </div>
                        <div className="relative z-1 h-6 mx-2.5 bg-n-11 shadow-xl rounded-b-[1.25rem] lg:h-6 lg:mx-8"></div>
                        <div className="relative z-1 h-6 mx-6 bg-n-11/70 shadow-xl rounded-b-[1.25rem] lg:h-6 lg:mx-20"></div>
                    </div>
                </motion.div>

                {/* 5-Day Forecast */}
                <motion.div className="relative max-w-[72rem] mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-5 mb-16" variants={itemVariants}>
                    {weatherData?.daily && !loading ? (
                        weatherData.daily.time.slice(0, 5).map((day, index) => {
                            const forecastDate = new Date('2025-03-31');
                            forecastDate.setDate(forecastDate.getDate() + index + 1);
                            return (
                                <motion.div key={day} className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient" variants={itemVariants}>
                                    <div className="relative bg-n-8 rounded-[1rem] p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold">
                                                {forecastDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </h3>
                                            {/* WeatherAnimation component would go here */}
                                        </div>
                                        <div className="text-n-2 space-y-2">
                                            <p>Max: {weatherData.daily.temperature_2m_max[index]}°C</p>
                                            <p>Min: {weatherData.daily.temperature_2m_min[index]}°C</p>
                                            <p>Wind: {weatherData.daily.windspeed_10m_max[index]} km/h</p>
                                            <p>Dir: {weatherData.daily.winddirection_10m_dominant[index]}°</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <p className="text-n-2 text-center col-span-full">{loading ? 'Loading forecast...' : 'Search for a city to see the forecast'}</p>
                    )}
                </motion.div>

                <BackgroundCircles />
            </motion.div>
        </Section>
    );
};

export default Weather;