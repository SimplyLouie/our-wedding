import React from 'react';
import { Trash2, Plus } from 'lucide-react';

const StoryTab = ({
    config,
    updateConfig,
    updateStory,
    addStoryItem,
    removeStoryItem
}) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#E6D2B5]/30 pb-2">
                <h3 className="font-serif text-lg text-[#43342E]">Our Journey Timeline</h3>
                <div className="flex gap-4">
                    <div className="group">
                        <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Title</label>
                        <input type="text" value={config.storyTitle} onChange={(e) => updateConfig('storyTitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" />
                    </div>
                    <div className="group">
                        <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Subtitle</label>
                        <input type="text" value={config.storySubtitle} onChange={(e) => updateConfig('storySubtitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" />
                    </div>
                </div>
            </div>

            {config.story?.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative group transition-all hover:shadow-md">
                    <button
                        onClick={() => removeStoryItem(idx)}
                        className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors p-1"
                        title="Remove Item"
                    >
                        <Trash2 size={16} />
                    </button>
                    <div className="grid md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Date</label>
                            <input
                                type="text"
                                value={item.date}
                                onChange={(e) => updateStory(idx, 'date', e.target.value)}
                                className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                            />
                        </div>
                        <div className="md:col-span-9 pr-8">
                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Title</label>
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateStory(idx, 'title', e.target.value)}
                                className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 font-serif text-lg mb-2"
                            />
                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Description</label>
                            <textarea
                                value={item.description}
                                onChange={(e) => updateStory(idx, 'description', e.target.value)}
                                className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm h-20"
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addStoryItem} className="w-full py-4 border-2 border-dashed border-[#E6D2B5] text-[#B08D55] uppercase text-xs font-bold tracking-widest hover:bg-[#E6D2B5]/10 transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> Add Timeline Milestone
            </button>
        </div>
    );
};

export default StoryTab;
