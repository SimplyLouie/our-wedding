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

const SortableItem = ({ section, onToggleVisibility }) => {
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

            <div className="flex-1">
                <h4 className="font-serif text-[#43342E]">{section.label}</h4>
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
    const sections = config.sectionOrder || [];

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

    return (
        <div className="space-y-8 animate-fade-in max-w-2xl">
            <div className="border-b border-[#E6D2B5]/30 pb-4">
                <h3 className="font-serif text-2xl text-[#43342E] mb-1">Section Organizer</h3>
                <p className="text-xs text-[#8C7C72]">Drag to reorder sections or toggle visibility for guests</p>
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
                        <li><strong>Toggle</strong> the eye icon on the right to show or hide a section.</li>
                        <li>Changes are saved temporarily. Click "Save Changes" on the sidebar to persist to the database.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OrganizerTab;
