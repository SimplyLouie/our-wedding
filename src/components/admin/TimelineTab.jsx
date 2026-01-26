import React, { useState } from 'react';
import {
    Plus, Trash2, Heart, Calendar, Gift,
    Settings, Upload, RefreshCw, Users, ClipboardList,
    Search, AlertCircle, CheckCircle, Type, Download,
    X, Loader, Music, Clock, Smartphone, Globe,
    Star, Palette, Coffee, Camera, Utensils,
    Wine, Car, Gem, Eye, Slash, Edit2, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import GenericItemModal from './GenericItemModal';

const ICON_OPTIONS = [
    { value: 'clock', icon: Clock, label: 'Clock' },
    { value: 'coffee', icon: Coffee, label: 'Coffee' },
    { value: 'heart', icon: Heart, label: 'Heart' },
    { value: 'camera', icon: Camera, label: 'Camera' },
    { value: 'music', icon: Music, label: 'Music' },
    { value: 'utensils', icon: Utensils, label: 'Food' },
    { value: 'wine', icon: Wine, label: 'Drinks' },
    { value: 'car', icon: Car, label: 'Travel' },
    { value: 'ring', icon: Gem, label: 'Ring' }
];

const TimelineTab = ({ config, updateConfig }) => {
    const timeline = config.timeline || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const openModal = (index = null) => {
        if (index !== null) {
            setEditingIndex(index);
            setCurrentData(timeline[index]);
        } else {
            setEditingIndex(null);
            setCurrentData({ time: "00:00 AM", title: "New Event", description: "", icon: "clock" });
        }
        setIsModalOpen(true);
    };

    const handleSave = (formData) => {
        let newTimeline;
        if (editingIndex !== null) {
            newTimeline = timeline.map((item, i) => i === editingIndex ? formData : item);
        } else {
            newTimeline = [...timeline, formData];
        }
        updateConfig('timeline', newTimeline);
        setIsModalOpen(false);
        toast.success(editingIndex !== null ? "Event updated!" : "New event added to program!");
    };

    const handleRemove = (index) => {
        if (confirm("Remove this event from the timeline?")) {
            const newTimeline = timeline.filter((_, i) => i !== index);
            updateConfig('timeline', newTimeline);
            toast.success("Event removed.");
        }
    };

    const timelineFields = [
        { name: 'time', label: 'Time', type: 'text', placeholder: 'e.g. 3:00 PM', icon: <Clock size={18} /> },
        { name: 'title', label: 'Event Title', type: 'text', placeholder: 'e.g. Ceremony' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Short details about this event...' },
        { name: 'icon', label: 'Choose Icon', type: 'icon_grid', options: ICON_OPTIONS }
    ];

    const getIcon = (iconId) => {
        const opt = ICON_OPTIONS.find(o => o.value === iconId);
        const IconComp = opt ? opt.icon : Clock;
        return <IconComp size={18} />;
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="flex justify-between items-center border-b border-[#E6D2B5]/30 pb-4">
                <div>
                    <h3 className="font-serif text-2xl text-[#43342E] mb-1">Wedding Day Timeline</h3>
                    <p className="text-xs text-[#8C7C72]">Manage the flow of your wedding day program</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#43342E] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#5D4B42] transition-all shadow-md active:scale-95"
                >
                    <Plus size={16} /> Add Event
                </button>
            </div>

            <div className="relative pl-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#E6D2B5]/50 before:via-[#B08D55]/30 before:to-[#E6D2B5]/50">
                {timeline.map((item, idx) => (
                    <div key={idx} className="relative mb-6 group">
                        {/* Timeline Point */}
                        <div className="absolute -left-8 top-1.5 w-10 h-10 rounded-full bg-white border-2 border-[#E6D2B5] flex items-center justify-center text-[#B08D55] shadow-sm z-10 group-hover:border-[#B08D55] transition-colors">
                            {getIcon(item.icon)}
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-[#E6D2B5]/30 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4 ml-4">
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold text-[#B08D55] uppercase tracking-widest mb-1 block">
                                    {item.time}
                                </span>
                                <h4 className="font-serif text-lg text-[#43342E] leading-tight truncate">
                                    {item.title}
                                </h4>
                                {item.description && (
                                    <p className="text-[10px] text-[#8C7C72] italic truncate mt-1">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModal(idx)}
                                    className="p-2 text-[#B08D55] hover:bg-[#F9F4EF] rounded-lg transition-colors"
                                    title="Edit Event"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleRemove(idx)}
                                    className="p-2 text-red-300 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove Event"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {timeline.length === 0 && (
                    <div className="ml-4 py-16 text-center border-2 border-dashed border-[#E6D2B5]/30 rounded-2xl bg-[#FAF9F6]/50">
                        <Clock className="mx-auto text-[#E6D2B5] mb-4" size={40} />
                        <p className="text-[#8C7C72] text-sm italic">No events scheduled. Click "Add Event" to build your program.</p>
                    </div>
                )}
            </div>

            <GenericItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={currentData}
                fields={timelineFields}
                title={editingIndex !== null ? 'Edit Event' : 'New Event'}
                description={editingIndex !== null ? 'Update program details' : 'Add a new moment to your wedding day'}
            />
        </div>
    );
};

export default TimelineTab;
