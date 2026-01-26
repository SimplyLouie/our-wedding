import React from 'react';
import { Clock, Coffee, Heart, Camera, Music, Utensils, Wine, Car, Gem } from 'lucide-react';
import { ScrollReveal, SectionHeading } from '../Shared';

// Icon Mapping
const ICON_MAP = {
    clock: Clock,
    coffee: Coffee,
    heart: Heart,
    camera: Camera,
    music: Music,
    utensils: Utensils,
    wine: Wine,
    car: Car,
    ring: Gem
};

const TimelineSection = ({ config }) => {
    if (!config.timeline || config.timeline.length === 0) return null;

    return (
        <section id="timeline" className="py-20 md:py-32 px-4 bg-[#FAF9F6] relative z-10 border-t border-[#E6D2B5]/30">
            <div className="max-w-3xl mx-auto">
                <ScrollReveal>
                    <SectionHeading
                        title="Wedding Day"
                        subtitle="Program of Events"
                    />
                </ScrollReveal>

                <div className="mt-16 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#E6D2B5]/50 transform md:-translate-x-1/2"></div>

                    <div className="space-y-12">
                        {config.timeline.map((item, idx) => {
                            const IconComponent = ICON_MAP[item.icon] || Clock;
                            return (
                                <ScrollReveal key={idx} variant="up" delay={idx * 100}>
                                    <div className={`flex flex-col md:flex-row items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''} relative group`}>

                                        {/* Content Side */}
                                        <div className={`pl-16 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                                            <div className="font-serif text-xl text-[#B08D55] mb-1">{item.time}</div>
                                            <h3 className="font-serif text-2xl text-[#43342E] mb-2">{item.title}</h3>
                                            {item.description && (
                                                <p className="text-sm text-[#8C7C72] leading-relaxed italic">{item.description}</p>
                                            )}
                                        </div>

                                        {/* Center Icon */}
                                        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-14 h-14 bg-white border-2 border-[#E6D2B5] rounded-full flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            <IconComponent size={20} className="text-[#B08D55]" />
                                        </div>

                                        {/* Empty Side (Desktop only) */}
                                        <div className="hidden md:block md:w-1/2"></div>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TimelineSection;
