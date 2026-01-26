import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Thermometer, MapPin, AlertCircle } from 'lucide-react';
import { ScrollReveal, SectionHeading } from '../Shared';

const WeatherSection = ({ config }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { weatherEnabled, weatherCity, weatherApiKey } = config;

    useEffect(() => {
        if (!weatherEnabled || !weatherApiKey) {
            setLoading(false);
            return;
        }

        const fetchWeather = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(weatherCity)}&appid=${weatherApiKey}&units=metric`
                );

                if (!response.ok) {
                    throw new Error(response.status === 401 ? "Invalid API Key" : "City not found");
                }

                const data = await response.json();
                setWeather(data);
                setError(null);
            } catch (err) {
                console.error("Weather fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [weatherEnabled, weatherCity, weatherApiKey]);

    if (!weatherEnabled || !weatherApiKey) return null;

    const getWeatherIcon = (main) => {
        switch (main?.toLowerCase()) {
            case 'clouds': return <Cloud className="text-[#8C7C72]" size={40} />;
            case 'clear': return <Sun className="text-[#B08D55] animate-pulse-slow" size={40} />;
            case 'rain': case 'drizzle': return <CloudRain className="text-[#5D4B42]" size={40} />;
            case 'thunderstorm': return <CloudLightning className="text-[#43342E]" size={40} />;
            default: return <Cloud className="text-[#8C7C72]" size={40} />;
        }
    };

    return (
        <section id="weather" className="hidden lg:block py-20 bg-[#FDFBF7] relative z-10 border-t border-[#E6D2B5]/20 overflow-hidden">
            <div className="max-w-4xl mx-auto px-6">
                <ScrollReveal>
                    <SectionHeading
                        title="Wedding Weather"
                        subtitle={`Forecast for ${weatherCity}`}
                    />
                </ScrollReveal>

                <div className="flex justify-center">
                    <ScrollReveal variant="up" delay={200} className="w-full max-w-md">
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-[#E6D2B5]/30 shadow-sm relative group overflow-hidden">
                            {/* Glassmorphism Background Decoration */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#B08D55]/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#E6D2B5]/10 rounded-full blur-3xl pointer-events-none" />

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                    <div className="w-10 h-10 border-2 border-[#B08D55]/30 border-t-[#B08D55] rounded-full animate-spin" />
                                    <p className="text-[10px] uppercase tracking-widest text-[#8C7C72]">Fetching Forecast...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                                    <AlertCircle className="text-red-300" size={32} />
                                    <p className="text-sm text-[#8C7C72] italic">
                                        {weatherApiKey ? error : "Please provide an API Key in settings"}
                                    </p>
                                </div>
                            ) : weather ? (
                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {getWeatherIcon(weather.weather[0].main)}
                                            <div>
                                                <h4 className="text-3xl font-serif text-[#43342E]">
                                                    {Math.round(weather.main.temp)}°C
                                                </h4>
                                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B08D55]">
                                                    {weather.weather[0].description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-1 text-[#8C7C72] mb-1">
                                                <MapPin size={12} />
                                                <span className="text-[10px] uppercase tracking-widest font-bold">{weather.name}</span>
                                            </div>
                                            <p className="text-[9px] text-[#8C7C72] uppercase tracking-[0.1em]">Philippines</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E6D2B5]/20">
                                        <div className="text-center">
                                            <div className="flex justify-center mb-2 text-[#B08D55]"><Thermometer size={16} /></div>
                                            <p className="text-[8px] uppercase tracking-widest text-[#8C7C72] mb-1">Feels Like</p>
                                            <p className="font-serif text-[#43342E]">{Math.round(weather.main.feels_like)}°C</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex justify-center mb-2 text-[#B08D55]"><Wind size={16} /></div>
                                            <p className="text-[8px] uppercase tracking-widest text-[#8C7C72] mb-1">Humidity</p>
                                            <p className="font-serif text-[#43342E]">{weather.main.humidity}%</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex justify-center mb-2 text-[#B08D55]"><Wind size={16} className="rotate-45" /></div>
                                            <p className="text-[8px] uppercase tracking-widest text-[#8C7C72] mb-1">Wind Speed</p>
                                            <p className="font-serif text-[#43342E]">{Math.round(weather.wind.speed * 3.6)} km/h</p>
                                        </div>
                                    </div>

                                    <div className="text-center pt-4">
                                        <p className="text-[8px] italic text-[#8C7C72]/50">Outdoor wedding vibes: {weather.weather[0].main === 'Clear' ? 'Perfect!' : 'Stay Cozy'}</p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
};

export default WeatherSection;
