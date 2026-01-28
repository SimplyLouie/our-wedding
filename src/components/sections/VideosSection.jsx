import React from 'react';
import { ScrollReveal, SectionHeading } from '../Shared';
import { Play } from 'lucide-react';

const VideosSection = ({ config }) => {
    const { videosTitle, videosSubtitle, videos = [] } = config;

    if (!videos || videos.length === 0) return null;

    const getEmbedUrl = (video) => {
        if (!video.url) return null;
        if (video.type === 'youtube') {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = video.url.match(regExp);
            if (match && match[2].length === 11) {
                return `https://www.youtube.com/embed/${match[2]}`;
            }
        }
        return video.url;
    };

    return (
        <section id="videos" className="py-20 md:py-32 px-4 bg-[#FAF9F6] relative z-10 border-t border-[#E6D2B5]/20">
            <div className="max-w-6xl mx-auto">
                <ScrollReveal>
                    <SectionHeading
                        title={videosTitle || "Our Memories"}
                        subtitle={videosSubtitle || "SDE & Prenup Videos"}
                    />
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12">
                    {videos.map((video, idx) => {
                        const embedUrl = getEmbedUrl(video);
                        if (!embedUrl) return null;

                        return (
                            <ScrollReveal key={video.id || idx} variant={idx % 2 === 0 ? 'left' : 'right'} delay={idx * 200}>
                                <div className="space-y-6">
                                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group border border-[#E6D2B5]/30">
                                        <iframe
                                            src={embedUrl}
                                            title={video.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full border-0"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-serif text-2xl text-[#43342E] italic">{video.title}</h3>
                                        <div className="w-12 h-[1px] bg-[#B08D55]/30 mx-auto mt-4" />
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default VideosSection;
