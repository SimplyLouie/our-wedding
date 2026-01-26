import React from 'react';
import { Globe, Smartphone, Type, Upload, Trash2 } from 'lucide-react';

const DetailsTab = ({ config, updateConfig, handleImageChange }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <h3 className="font-serif text-lg text-[#43342E] border-b border-[#E6D2B5]/30 pb-2">Core Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Couple Names</label>
                    <input type="text" value={config.names} onChange={(e) => updateConfig('names', e.target.value)} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" />
                </div>
                <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Display Date</label>
                    <input type="text" value={config.dateString} onChange={(e) => updateConfig('dateString', e.target.value)} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" />
                </div>
                <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Countdown Date</label>
                    <input type="datetime-local" value={config.dateIso?.substring(0, 16)} onChange={(e) => updateConfig('dateIso', e.target.value)} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" />
                </div>
                <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Location</label>
                    <input type="text" value={config.location} onChange={(e) => updateConfig('location', e.target.value)} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" />
                </div>
            </div>

            {/* Browser & Device Styling Section */}
            <div className="border-t border-[#E6D2B5]/30 pt-8 mt-4">
                <h3 className="font-serif text-lg text-[#43342E] mb-6 flex items-center gap-2"><Globe size={18} /> Browser & Device Styling</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Favicon Input */}
                    <div className="group">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Favicon Icon (Tab Icon)</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 border border-[#E6D2B5] p-1 flex items-center justify-center bg-gray-50 shrink-0">
                                {config.faviconUrl ? <img src={config.faviconUrl} className="max-w-full max-h-full" alt="Favicon" /> : <span className="text-[8px] text-gray-400">None</span>}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                    <label className="cursor-pointer bg-white border border-[#E6D2B5] px-3 py-2 text-[10px] uppercase font-bold hover:bg-[#FAF9F6] flex items-center justify-center gap-2 w-full md:w-fit transition-colors">
                                        <Upload size={12} /> Upload Icon
                                        <input type="file" className="hidden" accept="image/png,image/x-icon,image/jpeg" onChange={(e) => handleImageChange(e, 'faviconUrl')} />
                                    </label>
                                    {config.faviconUrl && (
                                        <button
                                            onClick={() => updateConfig('faviconUrl', '')}
                                            className="px-3 py-2 border border-red-200 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Remove Favicon"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <input type="text" value={config.faviconUrl || ''} onChange={(e) => updateConfig('faviconUrl', e.target.value)} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner mt-2 text-xs" placeholder="Or paste image URL..." />
                    </div>

                    {/* Theme Color Input */}
                    <div className="group">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2 flex items-center gap-2"><Smartphone size={12} /> Mobile Theme Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={config.themeColor || '#FAF9F6'}
                                onChange={(e) => updateConfig('themeColor', e.target.value)}
                                className="w-10 h-10 p-1 bg-white border border-[#E6D2B5] cursor-pointer"
                            />
                            <input
                                type="text"
                                value={config.themeColor || '#FAF9F6'}
                                onChange={(e) => updateConfig('themeColor', e.target.value)}
                                className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner uppercase font-mono"
                                maxLength={7}
                            />
                        </div>
                        <p className="text-[9px] text-[#8C7C72] mt-2 leading-tight">Controls the color of the browser address bar on mobile devices.</p>
                    </div>
                </div>
            </div>

            {/* Branding Section */}
            <div className="border-t border-[#E6D2B5]/30 pt-8 mt-4">
                <h3 className="font-serif text-lg text-[#43342E] mb-6 flex items-center gap-2"><Type size={18} /> Branding & Logo</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="group">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Website Title</label>
                        <input type="text" value={config.websiteTitle || ''} onChange={(e) => updateConfig('websiteTitle', e.target.value)} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" placeholder="e.g. Louie & Florie's Wedding" />
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Logo Text</label>
                        <input type="text" value={config.logoText || ''} onChange={(e) => updateConfig('logoText', e.target.value)} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" placeholder="Auto-generated if empty" />
                    </div>
                    <div className="group md:col-span-2">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Logo Image (Optional)</label>
                        <div className="flex gap-4 items-center">
                            {config.logoImage && <img src={config.logoImage} alt="Logo Preview" className="h-10 w-auto border border-[#E6D2B5] p-1" />}
                            <div className="flex-1">
                                <div className="flex gap-2">
                                    <label className="cursor-pointer bg-white border border-[#E6D2B5] text-[#43342E] px-4 py-2 text-xs uppercase font-bold hover:bg-[#FAF9F6] flex items-center justify-center gap-2 w-fit">
                                        <Upload size={14} /> Upload Logo Image
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'logoImage')} />
                                    </label>
                                    {config.logoImage && (
                                        <button
                                            onClick={() => updateConfig('logoImage', '')}
                                            className="px-3 py-2 border border-red-200 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Remove Logo"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-[#E6D2B5]/30 pt-8 mt-4">
                <h3 className="font-serif text-lg text-[#43342E] mb-6">Social & Contact Links</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="group">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Instagram URL</label>
                        <input type="text" value={config.instagram} onChange={(e) => updateConfig('instagram', e.target.value)} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" placeholder="#" />
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Facebook URL</label>
                        <input type="text" value={config.facebook} onChange={(e) => updateConfig('facebook', e.target.value)} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" placeholder="#" />
                    </div>
                    <div className="group">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Contact URL</label>
                        <input type="text" value={config.contact} onChange={(e) => updateConfig('contact', e.target.value)} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" placeholder="mailto:us@example.com" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsTab;
