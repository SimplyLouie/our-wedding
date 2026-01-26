import React from 'react';
import { CloudSun, Key, MapPin, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

const WeatherTab = ({ config, updateConfig }) => {
    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="border-b border-[#E6D2B5]/30 pb-4">
                <h3 className="font-serif text-2xl text-[#43342E] mb-1">Weather Widget Settings</h3>
                <p className="text-xs text-[#8C7C72]">Configure the real-time weather display for your guests.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Configuration Panel */}
                <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E6D2B5]/30 space-y-6">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <div
                                onClick={() => updateConfig('weatherEnabled', !config.weatherEnabled)}
                                className={`w-12 h-6 rounded-full transition-all relative ${config.weatherEnabled ? 'bg-[#B08D55]' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.weatherEnabled ? 'left-7' : 'left-1'}`} />
                            </div>
                            <span className="text-xs font-bold text-[#43342E] uppercase tracking-widest">Enable Weather Widget</span>
                        </label>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#E6D2B5]/20">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1 flex items-center gap-2">
                                <MapPin size={12} /> Wedding Location (City)
                            </label>
                            <input
                                type="text"
                                value={config.weatherCity || ''}
                                onChange={(e) => updateConfig('weatherCity', e.target.value)}
                                className="admin-input rounded-lg"
                                placeholder="e.g. Cebu City"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1 flex items-center gap-2">
                                <Key size={12} /> OpenWeatherMap API Key
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={config.weatherApiKey || ''}
                                    onChange={(e) => updateConfig('weatherApiKey', e.target.value)}
                                    className="admin-input rounded-lg pl-10"
                                    placeholder="Paste your API key here"
                                />
                                <ShieldCheck className="absolute left-3 top-2.5 text-[#B08D55]" size={18} />
                            </div>
                            <p className="text-[10px] text-[#8C7C72] italic pl-1">Your key is stored securely in your database.</p>
                        </div>
                    </div>
                </div>

                {/* Instructions Panel */}
                <div className="bg-[#FFF9F2] p-6 rounded-xl border border-[#E6D2B5]/50 space-y-4">
                    <h4 className="text-xs font-bold text-[#43342E] uppercase tracking-widest flex items-center gap-2">
                        <CloudSun className="text-[#B08D55]" size={18} /> How to get an API Key
                    </h4>

                    <div className="space-y-4 text-xs text-[#8C7C72] leading-relaxed">
                        <p>To display real-time weather, we use **OpenWeatherMap**. Follow these steps to get your free key:</p>
                        <ol className="list-decimal ml-4 space-y-3">
                            <li>Go to <a href="https://home.openweathermap.org/users/sign_up" target="_blank" rel="noopener noreferrer" className="text-[#B08D55] font-bold hover:underline inline-flex items-center gap-1">OpenWeatherMap Signup <ExternalLink size={10} /></a> and create a free account.</li>
                            <li>Confirm your email address (this is **required** to activate your API key).</li>
                            <li>Once logged in, click on your username in the top right and select **"My API Keys"**.</li>
                            <li>Copy the default API key generated for you (it looks like a long string of letters and numbers).</li>
                            <li>Paste the key into the field on the left and click **Save Changes**.</li>
                        </ol>

                        <div className="p-3 bg-white/50 rounded-lg border border-[#E6D2B5]/30 flex gap-2">
                            <AlertCircle className="text-[#B08D55] shrink-0" size={16} />
                            <p className="text-[10px]"><strong>Note:</strong> It may take up to **2 hours** for your API key to become fully active after confirmation.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Hint */}
            <div className="bg-[#FAF9F6] p-4 rounded-lg border border-[#E6D2B5]/30 flex items-center justify-between">
                <p className="text-xs text-[#8C7C72]">
                    The weather widget will automatically appear in your section order.
                    Manage its position in the <strong>Organizer</strong> tab.
                </p>
            </div>
        </div>
    );
};

export default WeatherTab;
