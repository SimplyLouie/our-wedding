import React from 'react';
import { Edit2, Link as LinkIcon } from 'lucide-react';

const RsvpConfigTab = ({ config, updateConfig }) => {
    return (
        <div className="space-y-10 animate-fade-in max-w-2xl">
            <h3 className="font-serif text-lg text-[#43342E] border-b border-[#E6D2B5]/30 pb-2">RSVP Settings</h3>
            <div>
                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-4">RSVP Mode Selection</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => updateConfig('rsvpMode', 'form')}
                        className={`py-8 px-6 border flex flex-col items-center justify-center gap-4 transition-all ${config.rsvpMode === 'form'
                            ? 'border-[#43342E] bg-white text-[#43342E] shadow-lg scale-105'
                            : 'border-[#E6D2B5] bg-transparent text-[#8C7C72] hover:bg-white'
                            }`}
                    >
                        <Edit2 size={28} strokeWidth={1.5} />
                        <span className="font-serif text-lg">Built-in Form</span>
                    </button>
                    <button
                        onClick={() => updateConfig('rsvpMode', 'link')}
                        className={`py-8 px-6 border flex flex-col items-center justify-center gap-4 transition-all ${config.rsvpMode === 'link'
                            ? 'border-[#43342E] bg-white text-[#43342E] shadow-lg scale-105'
                            : 'border-[#E6D2B5] bg-transparent text-[#8C7C72] hover:bg-white'
                            }`}
                    >
                        <LinkIcon size={28} strokeWidth={1.5} />
                        <span className="font-serif text-lg">External Link</span>
                    </button>
                </div>
            </div>

            {config.rsvpMode === 'link' && (
                <div className="animate-fade-in bg-white p-8 border border-[#E6D2B5]">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">External Link URL</label>
                    <input
                        type="url"
                        placeholder="e.g. https://theknot.com/us/..."
                        value={config.rsvpExternalLink}
                        onChange={(e) => updateConfig('rsvpExternalLink', e.target.value)}
                        className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner"
                    />
                    <p className="text-xs text-[#8C7C72] mt-4 italic">Visitors will be redirected to this URL when clicking "RSVP".</p>
                </div>
            )}

            <div className="border-t border-[#E6D2B5]/30 pt-8 mt-8">
                <h4 className="font-serif text-md text-[#43342E] mb-4">Deadline Configuration</h4>
                <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">RSVP Deadline Text</label>
                    <input
                        type="text"
                        value={config.rsvpDeadline}
                        onChange={(e) => updateConfig('rsvpDeadline', e.target.value)}
                        className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner"
                        placeholder="e.g. May 1st, 2026"
                    />
                </div>
            </div>
        </div>
    );
};

export default RsvpConfigTab;
