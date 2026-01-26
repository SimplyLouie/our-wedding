import React from 'react';
import { Map, Info, Globe, AlertCircle, HelpCircle } from 'lucide-react';

const MapTab = ({ config, updateConfig }) => {
    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="border-b border-[#E6D2B5]/30 pb-4">
                <h3 className="font-serif text-2xl text-[#43342E] mb-1">Venue Map</h3>
                <p className="text-xs text-[#8C7C72]">Configure the map display to guide your guests to the venue.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Header Settings */}
                <div className="md:col-span-2 bg-[#FAF9F6] p-6 rounded-xl border border-[#E6D2B5]/30 space-y-4">
                    <h4 className="text-sm font-bold text-[#43342E] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Map className="text-[#B08D55]" size={18} /> Section Header
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Title</label>
                            <input
                                type="text"
                                value={config.mapTitle || ''}
                                onChange={(e) => updateConfig('mapTitle', e.target.value)}
                                className="admin-input rounded-lg"
                                placeholder="Venue Map"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Subtitle</label>
                            <input
                                type="text"
                                value={config.mapSubtitle || ''}
                                onChange={(e) => updateConfig('mapSubtitle', e.target.value)}
                                className="admin-input rounded-lg"
                                placeholder="Getting There"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Destination Address (for "Get Directions" button)</label>
                            <input
                                type="text"
                                value={config.mapDestination || ''}
                                onChange={(e) => updateConfig('mapDestination', e.target.value)}
                                className="admin-input rounded-lg"
                                placeholder="e.g. Chateau de Busay, Cebu City"
                            />
                        </div>
                    </div>
                </div>

                {/* Map Settings */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl border border-[#E6D2B5]/30 space-y-6 shadow-sm">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1 flex items-center gap-2">
                                <Globe size={14} /> Google Maps Embed URL
                            </label>
                            <a
                                href="https://support.google.com/maps/answer/144361"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#B08D55] hover:underline flex items-center gap-1"
                            >
                                <HelpCircle size={10} /> How to get this link?
                            </a>
                        </div>
                        <textarea
                            value={config.mapEmbedUrl || ''}
                            onChange={(e) => updateConfig('mapEmbedUrl', e.target.value)}
                            className="admin-input rounded-lg h-32 font-mono text-xs leading-relaxed"
                            placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                        />
                        <div className="bg-[#FFF9F2] p-4 rounded-lg flex gap-3 text-xs text-[#8C7C72] border border-[#E6D2B5]/30">
                            <AlertCircle className="text-[#B08D55] shrink-0" size={16} />
                            <div>
                                <p className="font-bold text-[#43342E] mb-1">Important:</p>
                                <p>Paste the <strong>URL only</strong> (the part starting with https inside the src="..." attribute) from the Google Maps Share {"->"} Embed a map code.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1 flex items-center gap-2">
                            <Info size={14} /> Journey Instructions
                        </label>
                        <textarea
                            value={config.mapInstructions || ''}
                            onChange={(e) => updateConfig('mapInstructions', e.target.value)}
                            className="admin-input rounded-lg h-24 resize-none"
                            placeholder="e.g. The reception is 15 mins away from the church..."
                        />
                    </div>
                </div>

                {/* Preview Placeholder */}
                {config.mapEmbedUrl && (
                    <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Live Preview</label>
                        <div className="aspect-video w-full rounded-xl border-4 border-white shadow-lg overflow-hidden ring-1 ring-[#E6D2B5]/30 bg-gray-50 flex items-center justify-center">
                            <iframe
                                src={config.mapEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                title="Map Preview"
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapTab;
