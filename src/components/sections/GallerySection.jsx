import React from 'react';
import { ZoomIn } from 'lucide-react';
import { ScrollReveal, SectionHeading } from '../Shared';

const GallerySection = ({ config, onImageClick }) => {
    return (
        <section id="gallery" className="py-20 md:py-32 bg-white relative z-10">
            <ScrollReveal><SectionHeading title="Captured Moments" subtitle="Gallery" /></ScrollReveal>
            <div className="columns-2 md:columns-4 gap-4 px-4 max-w-[1600px] mx-auto space-y-4">
                {config.galleryImages?.map((src, i) => (
                    <div key={i} className="overflow-hidden group cursor-pointer relative bg-gray-100 rounded-sm break-inside-avoid shadow-sm mb-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }} onClick={() => onImageClick(src)}>
                        <img
                            src={src}
                            loading="lazy"
                            decoding="async"
                            alt={`Gallery ${i}`}
                            className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-white flex flex-col items-center">
                                <ZoomIn size={24} strokeWidth={1.5} className="mb-1" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">View</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GallerySection;
