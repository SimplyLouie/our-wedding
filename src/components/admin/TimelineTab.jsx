import React from 'react';
import {
    Plus, Trash2, Heart, Calendar, Gift,
    Settings, Upload, RefreshCw, Users, ClipboardList,
    Search, AlertCircle, CheckCircle, Type, Download,
    X, Loader, Music, Clock, Smartphone, Globe,
    Star, Palette, Coffee, Camera, Utensils,
    Wine, Car, Gem, Eye, Slash
} from 'lucide-react';

const ICON_OPTIONS = [
    { id: 'clock', icon: Clock, label: 'Clock' },
    { id: 'coffee', icon: Coffee, label: 'Coffee' },
    { id: 'heart', icon: Heart, label: 'Heart' },
    { id: 'camera', icon: Camera, label: 'Camera' },
    { id: 'music', icon: Music, label: 'Music' },
    { id: 'utensils', icon: Utensils, label: 'Food' },
    { id: 'wine', icon: Wine, label: 'Drinks' },
    { id: 'car', icon: Car, label: 'Travel' },
    { id: 'ring', icon: Gem, label: 'Ring' }
];

const TimelineTab = ({ config, updateConfig }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#E6D2B5]/30 pb-4">
                <div>
                    <h3 className="font-serif text-2xl text-[#43342E] mb-2">Wedding Day Timeline</h3>
                    <p className="text-xs text-[#8C7C72]">Manage the flow of your wedding day program</p>
                </div>
                <button
                    onClick={() => {
                        const newItem = { time: "00:00 AM", title: "New Event", description: "Event description" };
                        updateConfig('timeline', [...(config.timeline || []), newItem]);
                    }}
                    className="bg-[#B08D55] text-white px-4 py-2 rounded-full text-xs uppercase font-bold flex items-center gap-2 hover:bg-[#8C6B3F] transition-colors"
                >
                    <Plus size={14} /> Add Event
                </button>
            </div>

            <div className="space-y-4">
                {config.timeline?.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 shadow-sm relative group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    const newTimeline = config.timeline.filter((_, i) => i !== idx);
                                    updateConfig('timeline', newTimeline);
                                }}
                                className="text-red-300 hover:text-red-500 p-1"
                                title="Remove Event"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-12 gap-4">
                            <div className="md:col-span-3">
                                <label className="block text-[10px] uppercase font-bold text-[#B08D55] mb-1">Time</label>
                                <input
                                    type="text"
                                    value={item.time}
                                    onChange={(e) => {
                                        const newTimeline = [...config.timeline];
                                        newTimeline[idx] = { ...item, time: e.target.value };
                                        updateConfig('timeline', newTimeline);
                                    }}
                                    className="w-full bg-[#FAF9F6] border border-[#E6D2B5]/30 p-2 rounded text-[#43342E] font-medium"
                                    placeholder="e.g. 3:00 PM"
                                />
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-[10px] uppercase font-bold text-[#B08D55] mb-1">Title</label>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                        const newTimeline = [...config.timeline];
                                        newTimeline[idx] = { ...item, title: e.target.value };
                                        updateConfig('timeline', newTimeline);
                                    }}
                                    className="w-full bg-[#FAF9F6] border border-[#E6D2B5]/30 p-2 rounded text-[#43342E] font-serif"
                                    placeholder="Event Title"
                                />
                            </div>
                            <div className="md:col-span-12 mt-2">
                                <label className="block text-[10px] uppercase font-bold text-[#B08D55] mb-2">Event Icon</label>
                                <div className="flex flex-wrap gap-2">
                                    {ICON_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => {
                                                const newTimeline = [...config.timeline];
                                                newTimeline[idx] = { ...item, icon: opt.id };
                                                updateConfig('timeline', newTimeline);
                                            }}
                                            className={`p-2 rounded border flex items-center gap-2 text-xs transition-all ${item.icon === opt.id ? 'bg-[#B08D55] text-white border-[#B08D55]' : 'bg-white border-[#E6D2B5]/50 text-[#8C7C72] hover:border-[#B08D55]'}`}
                                            title={opt.label}
                                        >
                                            <opt.icon size={14} />
                                            <span className="hidden sm:inline">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-5">
                                <label className="block text-[10px] uppercase font-bold text-[#B08D55] mb-1">Description</label>
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => {
                                        const newTimeline = [...config.timeline];
                                        newTimeline[idx] = { ...item, description: e.target.value };
                                        updateConfig('timeline', newTimeline);
                                    }}
                                    className="w-full bg-[#FAF9F6] border border-[#E6D2B5]/30 p-2 rounded text-[#43342E] text-sm"
                                    placeholder="Short description"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineTab;
