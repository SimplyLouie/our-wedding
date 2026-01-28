import React from 'react';
import {
    Users, ClipboardList, Settings, Heart, Clock,
    Calendar, Star, Palette, Gift, ImageIcon,
    Globe, RefreshCw, Trash2, Layout, Map, MessageSquare, CloudSun, HelpCircle, Video
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, resetConfirm, handleResetRequest, sectionOrder = [] }) => {
    // System tabs that should always be at the top and in this order
    const systemTabs = [
        { id: 'guests', label: 'Guest List', shortLabel: 'Guests', icon: Users },
        { id: 'planner', label: 'Planner', shortLabel: 'Plan', icon: ClipboardList },
        { id: 'organizer', label: 'Organizer', shortLabel: 'Org', icon: Layout },
        { id: 'general', label: 'General', shortLabel: 'Gen', icon: Settings },
    ];

    // Tabs that correspond to dynamic sections
    const sectionTabsMap = {
        'story': { label: 'Our Story', shortLabel: 'Story', icon: Heart },
        'timeline': { label: 'Timeline', shortLabel: 'Time', icon: Clock },
        'events': { label: 'Events', shortLabel: 'Events', icon: Calendar },
        'entourage': { label: 'Entourage', shortLabel: 'Ent', icon: Star },
        'palette': { label: 'Palette', shortLabel: 'Pal', icon: Palette },
        'rsvp': { label: 'RSVP Config', shortLabel: 'RSVP', icon: Gift },
        'gallery': { label: 'Images', shortLabel: 'Imgs', icon: ImageIcon },
        'registry': { label: 'Gift Registry', shortLabel: 'Gift', icon: Gift },
        'map': { label: 'Venue Map', shortLabel: 'Map', icon: Map },
        'weather': { label: 'Weather', shortLabel: 'Sun', icon: CloudSun },
        'faq': { label: 'FAQ', shortLabel: 'FAQ', icon: HelpCircle },
        'guestbook': { label: 'Guestbook', shortLabel: 'Book', icon: MessageSquare },
        'videos': { label: 'Videos', shortLabel: 'Vids', icon: Video },
    };

    // Other system tabs that should be at the bottom
    const bottomTabs = [
        { id: 'systems', label: 'Systems', shortLabel: 'Sys', icon: Globe }
    ];

    // Build the dynamic section tabs based on sectionOrder
    const dynamicSectionTabs = sectionOrder.map(section => {
        // Map section.id to tab.id if they differ
        let tabId = section.id;
        if (section.id === 'palette') tabId = 'colors';
        if (section.id === 'gallery') tabId = 'images';

        const baseTab = sectionTabsMap[section.id];
        if (!baseTab) return null;
        return {
            id: tabId,
            label: section.label, // Use the custom label from sectionOrder
            shortLabel: baseTab.shortLabel,
            icon: baseTab.icon
        };
    }).filter(Boolean);

    // Identify any sections that are NOT in sectionOrder but might need to be shown (fallback)
    const existingSectionIds = new Set(sectionOrder.map(s => s.id));
    const missingSectionTabs = Object.keys(sectionTabsMap)
        .filter(id => !existingSectionIds.has(id))
        .map(id => {
            let tabId = id;
            if (id === 'palette') tabId = 'colors';
            if (id === 'gallery') tabId = 'images';
            return { id: tabId, ...sectionTabsMap[id] };
        });

    const tabs = [...systemTabs, ...dynamicSectionTabs, ...missingSectionTabs, ...bottomTabs];

    return (
        <div className="relative w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#E6D2B5]/30 flex shrink-0 z-20">
            {/* Scroll indicator shades for mobile */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 md:hidden opacity-50" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden opacity-50" />

            <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto md:overflow-x-visible w-full no-scrollbar md:pb-20 snap-x">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex-none md:flex-none
                            snap-start
                            flex flex-col md:flex-row items-center justify-center md:justify-start 
                            gap-2 md:gap-3 
                            px-4 md:px-8 
                            py-2 md:py-4 
                            min-w-[80px] md:min-w-0
                            text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest 
                            transition-all whitespace-nowrap 
                            border-b-2 md:border-b-0 md:border-l-4 
                            ${activeTab === tab.id
                                ? 'border-[#B08D55] bg-[#F9F4EF]/50 text-[#43342E]'
                                : 'border-transparent text-[#8C7C72] hover:bg-gray-50'
                            }
                        `}
                    >
                        <tab.icon size={activeTab === tab.id ? 18 : 16} className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110 shrink-0' : 'shrink-0'}`} />
                        <span className="text-[9px] md:text-sm leading-tight text-center md:text-left">
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
