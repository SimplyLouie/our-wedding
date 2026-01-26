import React from 'react';
import { Upload, ImageIcon } from 'lucide-react';

const ImagesTab = ({ config, handleImageChange, handleUrlChange }) => {
    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div>
                <h3 className="font-serif text-xl text-[#43342E] mb-6">Hero Background</h3>
                <div className="relative group w-full h-64 overflow-hidden bg-gray-100 border border-[#E6D2B5] mb-4">
                    <img src={config.heroImage} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <label className="cursor-pointer bg-white/90 text-[#43342E] px-6 py-3 rounded-none uppercase tracking-widest text-xs font-bold hover:bg-white flex items-center gap-3 transition-transform transform group-hover:-translate-y-1">
                            <Upload size={16} /> Upload New
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'heroImage')} />
                        </label>
                    </div>
                </div>
                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Or Paste URL</label>
                <input
                    type="text"
                    value={config.heroImage}
                    onChange={(e) => handleUrlChange(e.target.value, 'heroImage')}
                    className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner"
                />
            </div>

            {/* RSVP Image Section */}
            <div>
                <h3 className="font-serif text-xl text-[#43342E] mb-6">RSVP Side Image</h3>
                <div className="relative group w-full h-64 overflow-hidden bg-gray-100 border border-[#E6D2B5] mb-4">
                    <img src={config.rsvpImage} className="w-full h-full object-cover transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <label className="cursor-pointer bg-white/90 text-[#43342E] px-6 py-3 rounded-none uppercase tracking-widest text-xs font-bold hover:bg-white flex items-center gap-3 transition-transform transform group-hover:-translate-y-1">
                            <Upload size={16} /> Upload New
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'rsvpImage')} />
                        </label>
                    </div>
                </div>
                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Or Paste URL</label>
                <input
                    type="text"
                    value={config.rsvpImage}
                    onChange={(e) => handleUrlChange(e.target.value, 'rsvpImage')}
                    className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner"
                />
            </div>

            {/* Gallery Section */}
            <div>
                <h3 className="font-serif text-xl text-[#43342E] mb-6">Gallery Collection</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {config.galleryImages?.map((src, idx) => (
                        <div key={idx} className="space-y-2">
                            <div className="relative group cursor-pointer aspect-square bg-[#E6D2B5]/20 overflow-hidden border border-[#E6D2B5]/50">
                                <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-[#43342E]/0 group-hover:bg-[#43342E]/40 transition-colors duration-300 flex items-center justify-center">
                                    <Upload className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" size={24} />
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, null, idx)}
                                />
                            </div>
                            <input
                                type="text"
                                value={src}
                                onChange={(e) => handleUrlChange(e.target.value, null, idx)}
                                className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner p-2 text-[10px]"
                                placeholder="Image URL..."
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImagesTab;
