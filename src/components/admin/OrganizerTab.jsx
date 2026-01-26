import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';

import { defaultConfig } from '../../config/defaultConfig';

const SortableItem = ({ section, onToggleVisibility, onUpdateLabel }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-4 bg-white p-4 rounded-lg border ${isDragging ? 'border-[#B08D55] shadow-lg' : 'border-[#E6D2B5]/50'} mb-3 transition-shadow`}
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-[#B08D55] hover:bg-[#F9F4EF] p-1 rounded"
            >
                <GripVertical size={20} />
            </button>

            <div className="flex-1 flex flex-col gap-1">
                <input
                    type="text"
                    value={section.label}
                    onChange={(e) => onUpdateLabel(section.id, e.target.value)}
                    className="font-serif text-[#43342E] bg-transparent border-none focus:ring-0 p-0 text-lg w-full hover:bg-gray-50 focus:bg-white transition-colors cursor-text"
                    placeholder="Enter Label"
                    onClick={(e) => e.stopPropagation()}
                />
                <p className="text-[10px] text-[#8C7C72] uppercase tracking-widest">Section ID: {section.id}</p>
            </div>

            <button
                onClick={() => onToggleVisibility(section.id)}
                className={`p-2 rounded-full transition-colors ${section.visible !== false ? 'text-[#B08D55] hover:bg-[#F9F4EF]' : 'text-gray-300 hover:bg-gray-100'}`}
                title={section.visible !== false ? "Hide Section" : "Show Section"}
            >
                {section.visible !== false ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
        </div>
    );
};

const OrganizerTab = ({ config, updateConfig }) => {
    // Sync logic: start with current order, but add any missing default sections
    const currentOrder = config.sectionOrder || [];
    const defaultOrder = defaultConfig.sectionOrder || [];
    const missing = defaultOrder.filter(d => !currentOrder.find(c => c.id === d.id));
    const sections = [...currentOrder, ...missing];

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = sections.findIndex((item) => item.id === active.id);
            const newIndex = sections.findIndex((item) => item.id === over.id);

            const newOrder = arrayMove(sections, oldIndex, newIndex);
            updateConfig('sectionOrder', newOrder);
        }
    };

    const toggleVisibility = (id) => {
        const newOrder = sections.map(section =>
            section.id === id ? { ...section, visible: section.visible === false ? true : false } : section
        );
        updateConfig('sectionOrder', newOrder);
    };

    const updateLabel = (id, newLabel) => {
        const newOrder = sections.map(section =>
            section.id === id ? { ...section, label: newLabel } : section
        );
        updateConfig('sectionOrder', newOrder);
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-2xl">
            <div className="border-b border-[#E6D2B5]/30 pb-4">
                <h3 className="font-serif text-2xl text-[#43342E] mb-1">Section Organizer</h3>
                <p className="text-xs text-[#8C7C72]">Drag to reorder sections, edit labels, or toggle visibility</p>
            </div>

            <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E6D2B5]/30">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sections.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {sections.map((section) => (
                            <SortableItem
                                key={section.id}
                                section={section}
                                onToggleVisibility={toggleVisibility}
                                onUpdateLabel={updateLabel}
                            />
                        ))}
                    </SortableContext>
                </DndContext>

                {sections.length === 0 && (
                    <div className="text-center py-10 text-[#8C7C72]">
                        <p>No sections found. Try resetting the database.</p>
                    </div>
                )}
            </div>

            <div className="bg-[#FFF9F2] p-4 rounded-lg border border-[#E6D2B5]/50 flex gap-3">
                <div className="text-[#B08D55] mt-0.5">
                    <Eye size={18} />
                </div>
                <div className="text-xs text-[#8C7C72] leading-relaxed">
                    <p className="font-bold text-[#43342E] mb-1">How it works:</p>
                    <ul className="list-disc ml-4 space-y-1">
                        <li><strong>Drag</strong> the handle on the left to change section order.</li>
                        <li><strong>Click</strong> on a section label to rename it (this updates the Navigation Bar).</li>
                        <li><strong>Toggle</strong> the eye icon on the right to show or hide a section.</li>
                        <li>Changes are saved temporarily. Click "Save Changes" on the sidebar to persist to the database.</li>
                    </ul>
                </div>
            </div>

            {/* Navigation Bar Design Customization */}
            <div className="border-t border-[#E6D2B5]/30 pt-10 mt-10">
                <h3 className="font-serif text-2xl text-[#43342E] mb-1">Navigation Design</h3>
                <p className="text-xs text-[#8C7C72] mb-8">Customize how your menu and logo appear to guests</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Max Visible Links */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-[#B08D55] uppercase tracking-widest">Max Visible Links</label>
                            <span className="text-xs font-serif text-[#43342E]">{config.navMaxLinks || 6} Items</span>
                        </div>
                        <input
                            type="range"
                            min="2"
                            max="10"
                            value={config.navMaxLinks || 6}
                            onChange={(e) => updateConfig('navMaxLinks', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-[#E6D2B5]/30 rounded-lg appearance-none cursor-pointer accent-[#B08D55]"
                        />
                        <p className="text-[9px] text-[#8C7C72] italic">Extra links will automatically move to a "More" dropdown.</p>
                    </div>

                    {/* Logo Height */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-[#B08D55] uppercase tracking-widest">Logo Size</label>
                            <span className="text-xs font-serif text-[#43342E]">{config.navLogoHeight || 48}px</span>
                        </div>
                        <input
                            type="range"
                            min="24"
                            max="80"
                            value={config.navLogoHeight || 48}
                            onChange={(e) => updateConfig('navLogoHeight', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-[#E6D2B5]/30 rounded-lg appearance-none cursor-pointer accent-[#B08D55]"
                        />
                        <p className="text-[9px] text-[#8C7C72] italic">Adjust the vertical height of your logo in the header.</p>
                    </div>

                    {/* Glassmorphism Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E6D2B5]/30 group">
                        <div>
                            <p className="text-[10px] font-bold text-[#B08D55] uppercase tracking-widest mb-0.5">Glass Effect</p>
                            <p className="text-[9px] text-[#8C7C72] italic">Enable background blur on scroll</p>
                        </div>
                        <button
                            onClick={() => updateConfig('navGlassmorphism', !config.navGlassmorphism)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${config.navGlassmorphism !== false ? 'bg-[#B08D55]' : 'bg-gray-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.navGlassmorphism !== false ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Transparency Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E6D2B5]/30 group">
                        <div>
                            <p className="text-[10px] font-bold text-[#B08D55] uppercase tracking-widest mb-0.5">Transparent on Load</p>
                            <p className="text-[9px] text-[#8C7C72] italic">Header starts clear then fades in</p>
                        </div>
                        <button
                            onClick={() => updateConfig('navTransparentInitial', !config.navTransparentInitial)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${config.navTransparentInitial !== false ? 'bg-[#B08D55]' : 'bg-gray-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.navTransparentInitial !== false ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerTab;
