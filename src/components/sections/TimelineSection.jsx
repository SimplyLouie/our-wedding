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
            <div className="max-w-4xl mx-auto">
                <ScrollReveal>
                    <SectionHeading
                        title="Program of Events"
                        subtitle={`Schedule for ${config.dateString}`}
                    />
                </ScrollReveal>

                <div className="mt-16 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[28px] top-0 bottom-0 w-[2px] bg-[#E6D2B5]/50"></div>

                    <div className="space-y-12">
                        {config.timeline.map((item, idx) => {
                            const IconComponent = ICON_MAP[item.icon] || Clock;
                            return (
                                <ScrollReveal key={idx} variant="up" delay={idx * 100}>
                                    <div className="flex items-start relative group">
                                        {/* Center Icon */}
                                        <div className="shrink-0 w-14 h-14 bg-white border-2 border-[#E6D2B5] rounded-full flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            <IconComponent size={20} className="text-[#B08D55]" />
                                        </div>

                                        {/* Content Side */}
                                        <div className="pl-6 md:pl-10">
                                            <div className="font-serif text-xl text-[#B08D55] mb-1">{item.time}</div>
                                            <h3 className="font-serif text-2xl text-[#43342E] mb-2">{item.title}</h3>
                                            {item.description && (
                                                <p className="text-sm text-[#8C7C72] leading-relaxed italic">{item.description}</p>
                                            )}
                                        </div>
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
