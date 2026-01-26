import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, MessageCircleQuestion, Cloud, Sun, CloudRain, CloudLightning, Wind, Thermometer, MapPin, AlertCircle } from 'lucide-react';
import { ScrollReveal, SectionHeading } from '../Shared';

const WeatherCard = ({ weather, loading, error, city, apiKey }) => {
    if (loading) return (
        <div className="bg-white/40 backdrop-blur-sm p-8 rounded-3xl border border-[#E6D2B5]/20 flex flex-col items-center justify-center min-h-[160px]">
            <div className="w-8 h-8 border-2 border-[#B08D55]/30 border-t-[#B08D55] rounded-full animate-spin mb-4" />
            <p className="text-[10px] uppercase tracking-widest text-[#8C7C72]">Loading Forecast...</p>
        </div>
    );

    if (error || !apiKey) return null;

    const getWeatherIcon = (main) => {
        switch (main?.toLowerCase()) {
            case 'clouds': return <Cloud className="text-[#8C7C72]" size={32} />;
            case 'clear': return <Sun className="text-[#B08D55] animate-pulse-slow" size={32} />;
            case 'rain': case 'drizzle': return <CloudRain className="text-[#5D4B42]" size={32} />;
            case 'thunderstorm': return <CloudLightning className="text-[#43342E]" size={32} />;
            default: return <Cloud className="text-[#8C7C72]" size={32} />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-white to-[#F9F4EF]/50 p-6 md:p-8 rounded-3xl border border-[#B08D55]/20 shadow-sm relative overflow-hidden group mb-12">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Cloud size={80} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#E6D2B5]/30">
                        {getWeatherIcon(weather?.weather[0].main)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-[#8C7C72] mb-1">
                            <MapPin size={12} />
                            <span className="text-[10px] uppercase tracking-widest font-bold font-serif">{city || 'Venue'}</span>
                        </div>
                        <h4 className="text-3xl font-serif text-[#43342E]">
                            {weather ? `${Math.round(weather.main.temp)}°C` : '--°C'}
                        </h4>
                        <p className="text-[10px] uppercase tracking-[0.1em] font-medium text-[#B08D55]">
                            {weather?.weather[0].description || 'Weather update'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 md:gap-10 border-t md:border-t-0 md:border-l border-[#E6D2B5]/30 pt-6 md:pt-0 md:pl-10">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-1 text-[#B08D55] mb-1"><Thermometer size={14} /></div>
                        <p className="text-[8px] uppercase tracking-widest text-[#8C7C72] mb-0.5">Feels Like</p>
                        <p className="font-serif text-[#43342E] text-sm">{weather ? Math.round(weather.main.feels_like) : '--'}°C</p>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-1 text-[#B08D55] mb-1"><Wind size={14} /></div>
                        <p className="text-[8px] uppercase tracking-widest text-[#8C7C72] mb-0.5">Humidity</p>
                        <p className="font-serif text-[#43342E] text-sm">{weather ? weather.main.humidity : '--'}%</p>
                    </div>
                    <div className="text-center md:text-left text-neutral-400">
                        <div className="flex items-center justify-center md:justify-start gap-1 mb-1"><Sun size={14} /></div>
                        <p className="text-[8px] uppercase tracking-widest mb-0.5">Vibe</p>
                        <p className="font-serif text-xs italic">Outdoor Ready</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FaqItem = ({ faq, isOpen, onToggle, index }) => {
    return (
        <ScrollReveal variant="up" delay={index * 100}>
            <div className="mb-4">
                <button
                    onClick={onToggle}
                    className={`w-full flex items-center justify-between p-6 text-left transition-all duration-300 rounded-2xl border ${isOpen
                        ? 'bg-white border-[#B08D55] shadow-lg translate-y-[-2px]'
                        : 'bg-white/50 border-[#E6D2B5]/30 hover:border-[#B08D55]/50'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#B08D55] text-white' : 'bg-[#F9F4EF] text-[#B08D55]'}`}>
                            <HelpCircle size={16} />
                        </div>
                        <span className={`font-serif text-lg ${isOpen ? 'text-[#43342E]' : 'text-[#5D4B42]'}`}>{faq.question}</span>
                    </div>
                    <ChevronDown
                        size={20}
                        className={`text-[#B08D55] transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-8 pt-4 text-[#8C7C72] leading-relaxed italic bg-white/30 rounded-b-2xl border-x border-b border-[#E6D2B5]/20 -mt-2">
                        {faq.answer}
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
};

const FaqSection = ({ config }) => {
    const [openIndex, setOpenIndex] = useState(0);
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

    if (!config.faqs || config.faqs.length === 0) return null;

    return (
        <section id="faq" className="py-20 md:py-32 px-4 bg-[#FDFBF7] relative z-10 border-t border-[#E6D2B5]/20">
            <div className="max-w-3xl mx-auto">
                <ScrollReveal>
                    <SectionHeading
                        title={config.faqsTitle || "Frequently Asked Questions"}
                        subtitle={config.faqsSubtitle || "Everything You Need to Know"}
                    />
                </ScrollReveal>

                <div className="mt-16">
                    {weatherEnabled && weatherApiKey && (
                        <ScrollReveal variant="up">
                            <WeatherCard
                                weather={weather}
                                loading={loading}
                                error={error}
                                city={weatherCity}
                                apiKey={weatherApiKey}
                            />
                        </ScrollReveal>
                    )}

                    <div className="space-y-4">
                        {config.faqs.map((faq, idx) => (
                            <FaqItem
                                key={idx}
                                index={idx}
                                faq={faq}
                                isOpen={openIndex === idx}
                                onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FaqSection;
