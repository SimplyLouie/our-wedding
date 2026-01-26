import React from 'react';
import {
    Users, ClipboardList, Settings, Heart, Clock,
    Calendar, Star, Palette, Gift, ImageIcon,
    Globe, RefreshCw, Trash2
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, resetConfirm, handleResetRequest }) => {
    const tabs = [
        { id: 'guests', label: 'Guest List', shortLabel: 'Guests', icon: Users },
        { id: 'planner', label: 'Planner', shortLabel: 'Plan', icon: ClipboardList },
        { id: 'general', label: 'General', shortLabel: 'Gen', icon: Settings },
        { id: 'story', label: 'Our Story', shortLabel: 'Story', icon: Heart },
        { id: 'timeline', label: 'Timeline', shortLabel: 'Time', icon: Clock },
        { id: 'events', label: 'Events', shortLabel: 'Events', icon: Calendar },
        { id: 'entourage', label: 'Entourage', shortLabel: 'Entourage', icon: Star },
        { id: 'colors', label: 'Palette', shortLabel: 'Palette', icon: Palette },
        { id: 'rsvp', label: 'RSVP Config', shortLabel: 'RSVP', icon: Gift },
        { id: 'images', label: 'Images', shortLabel: 'Imgs', icon: ImageIcon },
        { id: 'systems', label: 'Systems', shortLabel: 'Sys', icon: Globe }
    ];

    return (
        <div className="relative w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#E6D2B5]/30 flex shrink-0 z-20">
            {/* Scroll indicator shades for mobile */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 md:hidden opacity-50" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden opacity-50" />

            <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto md:overflow-x-visible w-full no-scrollbar md:pb-20">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex-1 md:flex-none
                            flex flex-col md:flex-row items-center justify-center md:justify-start 
                            gap-1 md:gap-3 
                            px-3 md:px-8 
                            py-2 md:py-4 
                            min-w-[70px] md:min-w-0
                            text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest 
                            transition-all whitespace-nowrap 
                            border-b-2 md:border-b-0 md:border-l-4 
                            ${activeTab === tab.id
                                ? 'border-[#B08D55] bg-[#F9F4EF]/50 text-[#43342E]'
                                : 'border-transparent text-[#8C7C72] hover:bg-gray-50'
                            }
                        `}
                    >
                        <tab.icon size={activeTab === tab.id ? 18 : 16} className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`} />
                        <span className="text-[9px] md:text-xs">
                            <span className="hidden md:inline">{tab.label}</span>
                            <span className="md:hidden">{tab.shortLabel}</span>
                        </span>
                    </button>
                ))}

                <div className="p-2 md:p-4 md:mt-auto md:px-8 md:pb-4 min-w-[100px] md:min-w-0 flex items-center shrink-0">
                    <button
                        onClick={handleResetRequest}
                        className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 text-[9px] md:text-xs uppercase tracking-wider transition-all duration-300 w-full justify-center py-2 md:py-3 rounded-md min-w-[60px] ${resetConfirm ? 'bg-red-50 text-red-600 font-bold border border-red-200' : 'text-red-300 hover:text-red-500 hover:bg-red-50/50'}`}
                    >
                        {resetConfirm ? <Trash2 size={14} className="animate-bounce" /> : <RefreshCw size={14} />}
                        <span className="text-[8px] md:text-xs">{resetConfirm ? "Sure?" : "Reset"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
