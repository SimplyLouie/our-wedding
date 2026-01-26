import React from 'react';
import { Music, Heart, Clock, MapPin, ExternalLink, Wine, Utensils, Camera, PartyPopper } from 'lucide-react';
import { ScrollReveal, SectionHeading } from '../Shared';

// Icon Mapping
const ICON_MAP = {
    music: Music,
    heart: Heart,
    clock: Clock,
    location: MapPin,
    wine: Wine,
    utensils: Utensils,
    camera: Camera,
    party: PartyPopper
};

const EventsSection = ({ config }) => {
    return (
        <section id="events" className="py-20 md:py-32 px-4 bg-transparent relative z-10">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal><SectionHeading title={config.eventsTitle} subtitle={config.eventsSubtitle} /></ScrollReveal>
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {config.events?.map((event, idx) => {
                        const IconComponent = ICON_MAP[event.icon] || MapPin;
                        return (
                            <ScrollReveal key={idx} delay={200 * (idx + 1)} variant="up" className="h-full w-full md:w-[380px]">
                                <div className="bg-white/80 backdrop-blur-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] text-center h-full group border-b-4 border-transparent hover:border-[#DBC1A7] transition-all duration-300 rounded-lg overflow-hidden flex flex-col active:bg-[#F5F0E6]">

                                    {/* Event Image */}
                                    <div className="h-48 w-full relative overflow-hidden">
                                        {event.image ? (
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#E6D2B5]/20 flex items-center justify-center">
                                                <MapPin className="text-[#B08D55]/50" size={48} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-[#43342E]/20 group-hover:bg-transparent transition-colors duration-500"></div>

                                        {/* Floating Icon */}
                                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                            <span className="inline-block p-4 bg-[#F5F0E6] rounded-full text-[#B08D55] group-hover:bg-[#43342E] group-hover:text-[#F9F4EF] transition-colors duration-500 shadow-md border-4 border-white">
                                                <IconComponent size={20} strokeWidth={1.5} />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 pt-10 flex-1 flex flex-col items-center">
                                        <h3 className="font-serif text-2xl md:text-3xl text-[#43342E] mb-2">{event.title}</h3>
                                        <p className="text-[#B08D55] font-bold text-[11px] tracking-[0.2em] mb-4 uppercase">{event.time}</p>
                                        <p className="text-[#786C61] mb-8 font-light text-sm leading-relaxed flex-1">{event.description}</p>
                                        <a href={event.mapLink || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-[#8C7C72] text-[10px] uppercase tracking-[0.2em] border border-[#E6D2B5] px-6 py-3 rounded-full hover:bg-[#E6D2B5] hover:text-white transition-all duration-300 gap-2 group/link min-h-[44px]">
                                            <MapPin size={12} className="group-hover/link:animate-bounce" />
                                            <span>{event.location}</span>
                                            <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity -ml-1" />
                                        </a>
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

export default EventsSection;
