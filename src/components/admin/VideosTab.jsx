import React from 'react';
import { Youtube, ExternalLink, Plus, Trash2, Video } from 'lucide-react';

const VideosTab = ({ config, updateConfig }) => {
    const videos = config.videos || [
        { id: 'prenup', title: "Prenup Video", url: "", type: 'youtube' },
        { id: 'sde', title: "Same Day Edit (SDE)", url: "", type: 'youtube' }
    ];

    const handleUpdateVideo = (index, field, value) => {
        const newVideos = [...videos];
        newVideos[index] = { ...newVideos[index], [field]: value };
        updateConfig('videos', newVideos);
    };

    const handleAddVideo = () => {
        const newVideos = [...videos, { id: `video-${Date.now()}`, title: "New Video", url: "", type: 'youtube' }];
        updateConfig('videos', newVideos);
    };

    const handleRemoveVideo = (index) => {
        if (confirm("Remove this video?")) {
            const newVideos = videos.filter((_, i) => i !== index);
            updateConfig('videos', newVideos);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="border-b border-[#E6D2B5]/30 pb-4">
                <h3 className="font-serif text-2xl text-[#43342E] mb-1">Video Gallery</h3>
                <p className="text-xs text-[#8C7C72]">Manage your Prenup and SDE videos (YouTube links supported)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#B08D55] uppercase tracking-widest">Section Title</label>
                    <input
                        type="text"
                        value={config.videosTitle || ""}
                        onChange={(e) => updateConfig('videosTitle', e.target.value)}
                        placeholder="Our Memories"
                        className="w-full bg-white border border-[#E6D2B5]/30 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#B08D55] focus:border-[#B08D55] outline-none transition-all font-serif"
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-[#B08D55] uppercase tracking-widest">Section Subtitle</label>
                    <input
                        type="text"
                        value={config.videosSubtitle || ""}
                        onChange={(e) => updateConfig('videosSubtitle', e.target.value)}
                        placeholder="SDE & Prenup Videos"
                        className="w-full bg-white border border-[#E6D2B5]/30 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#B08D55] focus:border-[#B08D55] outline-none transition-all uppercase tracking-widest"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {videos.map((video, idx) => (
                    <div key={video.id || idx} className="bg-white p-6 rounded-xl border border-[#E6D2B5]/30 shadow-sm space-y-4 relative group">
                        <button
                            onClick={() => handleRemoveVideo(idx)}
                            className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#B08D55] uppercase tracking-widest flex items-center gap-2">
                                    <Video size={12} /> Video Title
                                </label>
                                <input
                                    type="text"
                                    value={video.title}
                                    onChange={(e) => handleUpdateVideo(idx, 'title', e.target.value)}
                                    className="w-full bg-[#FAF9F6] border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#B08D55] outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#B08D55] uppercase tracking-widest flex items-center gap-2">
                                    <Youtube size={12} /> YouTube URL
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={video.url}
                                        onChange={(e) => handleUpdateVideo(idx, 'url', e.target.value)}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full bg-[#FAF9F6] border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#B08D55] outline-none pr-10"
                                    />
                                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B08D55] hover:scale-110 transition-transform">
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAddVideo}
                    className="w-full py-4 border-2 border-dashed border-[#E6D2B5]/50 rounded-xl text-[#B08D55] hover:bg-[#F9F4EF]/50 transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"
                >
                    <Plus size={16} /> Add Video
                </button>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-lg flex gap-3 border border-[#E6D2B5]/20">
                <Youtube size={20} className="text-[#B08D55] shrink-0" />
                <p className="text-[11px] text-[#8C7C72] leading-relaxed">
                    <strong>Tip:</strong> Copy the full URL from your browser's address bar. We'll automatically handle formatting it for the website.
                </p>
            </div>
        </div>
    );
};

export default VideosTab;
