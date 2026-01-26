import React from 'react';
import { Plus, Trash2, Music, Heart, Clock, ImageIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const EventsTab = ({ config, updateConfig, updateEvent, processImage }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#E6D2B5]/30 pb-2">
                <h3 className="font-serif text-lg text-[#43342E]">Wedding Events</h3>
                <div className="flex gap-4">
                    <div className="group">
                        <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Title</label>
                        <input type="text" value={config.eventsTitle} onChange={(e) => updateConfig('eventsTitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" />
                    </div>
                    <div className="group">
                        <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Subtitle</label>
                        <input type="text" value={config.eventsSubtitle} onChange={(e) => updateConfig('eventsSubtitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" />
                    </div>
                    <button
                        onClick={() => {
                            const newEvents = [...(config.events || []), {
                                title: "New Event",
                                time: "Date & Time",
                                description: "Event description.",
                                location: "Location Name",
                                mapLink: "https://maps.google.com"
                            }];
                            updateConfig('events', newEvents);
                        }}
                        className="bg-[#B08D55] text-white px-3 md:px-4 py-2 rounded-full text-[10px] md:text-xs uppercase font-bold flex items-center gap-2 hover:bg-[#8C6B3F] transition-colors"
                    >
                        <Plus size={14} /> <span className="hidden md:inline">Add Event</span>
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {config.events?.map((event, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative group">
                        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => {
                                    if (confirm('Delete this event?')) {
                                        const newEvents = config.events.filter((_, i) => i !== idx);
                                        updateConfig('events', newEvents);
                                    }
                                }}
                                className="bg-white text-red-300 hover:text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                                title="Delete Event"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mb-4 text-[#B08D55] justify-between">
                            <div className="flex items-center gap-3">
                                {idx === 0 && <Music size={20} />}
                                {idx === 1 && <Heart size={20} />}
                                {idx === 2 && <Clock size={20} />}
                                <span className="text-xs uppercase font-bold tracking-wider">Event {idx + 1}</span>
                            </div>
                            <label className="cursor-pointer text-xs text-[#8C7C72] hover:text-[#B08D55] flex items-center gap-2">
                                <ImageIcon size={14} /> Change Image
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const processed = await processImage(file);
                                            if (processed.length > 1000000) {
                                                toast.error("Image is too large for the database.");
                                                return;
                                            }
                                            const newEvents = [...config.events];
                                            newEvents[idx] = { ...event, image: processed };
                                            updateConfig('events', newEvents);
                                            toast.success("Event image updated!");
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {/* Image Preview */}
                        <div className="w-full h-32 bg-[#FAF9F6] border border-[#E6D2B5]/30 rounded mb-4 overflow-hidden relative group/img">
                            {event.image ? (
                                <img src={event.image} alt="Event Context" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#E6D2B5]">
                                    <ImageIcon size={32} opacity={0.5} />
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold cursor-pointer uppercase tracking-widest gap-2">
                                <Upload size={14} /> Upload Details Photo
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const processed = await processImage(file);
                                            const newEvents = [...config.events];
                                            newEvents[idx] = { ...event, image: processed };
                                            updateConfig('events', newEvents);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Event Title</label>
                                <input
                                    type="text"
                                    value={event.title}
                                    onChange={(e) => updateEvent(idx, 'title', e.target.value)}
                                    className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 font-serif text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Time / Date</label>
                                <input
                                    type="text"
                                    value={event.time}
                                    onChange={(e) => updateEvent(idx, 'time', e.target.value)}
                                    className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm font-bold text-[#B08D55]"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Description</label>
                            <textarea
                                value={event.description}
                                onChange={(e) => updateEvent(idx, 'description', e.target.value)}
                                className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm h-16"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Location Name</label>
                                <input
                                    type="text"
                                    value={event.location}
                                    onChange={(e) => updateEvent(idx, 'location', e.target.value)}
                                    className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Map Link (URL)</label>
                                <input
                                    type="text"
                                    value={event.mapLink || ''}
                                    onChange={(e) => updateEvent(idx, 'mapLink', e.target.value)}
                                    placeholder="https://maps.google.com/..."
                                    className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm text-blue-600"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsTab;
