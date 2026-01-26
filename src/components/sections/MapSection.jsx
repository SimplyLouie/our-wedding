import React from 'react';
import { MapPin, Info, ExternalLink } from 'lucide-react';
import { ScrollReveal, SectionHeading } from '../Shared';

const MapSection = ({ config }) => {
    if (!config.mapEmbedUrl) return null;

    return (
        <section id="map" className="py-20 md:py-32 px-4 bg-white relative z-10 border-t border-[#E6D2B5]/30">
            <div className="max-w-5xl mx-auto">
                <ScrollReveal>
                    <SectionHeading
                        title={config.mapTitle || "Venue Map"}
                        subtitle={config.mapSubtitle || "Getting There"}
                    />
                </ScrollReveal>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Left Side: Info */}
                    <ScrollReveal variant="left" className="lg:col-span-1 space-y-6">
                        <div className="bg-[#FAF9F6] p-8 rounded-2xl border border-[#E6D2B5]/30 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 text-[#B08D55]">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <MapPin size={24} />
                                </div>
                                <h4 className="font-serif text-xl text-[#43342E]">Route Details</h4>
                            </div>

                            {config.mapInstructions && (
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 mt-1 text-[#B08D55]">
                                            <Info size={18} />
                                        </div>
                                        <p className="text-sm text-[#8C7C72] leading-relaxed italic">
                                            {config.mapInstructions}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-8 border-t border-[#E6D2B5]/20">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(config.mapDestination || config.location || 'Cebu')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#43342E] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#5D4B42] transition-all shadow-md active:scale-95"
                                >
                                    Get Directions <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>

                        {/* Aesthetic Divider */}
                        <div className="hidden lg:block h-[1px] w-full bg-gradient-to-r from-transparent via-[#E6D2B5]/30 to-transparent"></div>
                    </ScrollReveal>

                    {/* Right Side: Map */}
                    <ScrollReveal variant="right" className="lg:col-span-2">
                        <div className="relative aspect-video lg:aspect-auto lg:h-[500px] w-full bg-white rounded-2xl border-4 border-white shadow-xl overflow-hidden ring-1 ring-[#E6D2B5]/30 group">
                            <iframe
                                src={config.mapEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Wedding Venue Map"
                                className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            ></iframe>

                            {/* Decorative Corner Accents */}
                            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#B08D55]/30 m-4 pointer-events-none rounded-tl-xl"></div>
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#B08D55]/30 m-4 pointer-events-none rounded-br-xl"></div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
};

export default MapSection;
