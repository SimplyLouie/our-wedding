import React from 'react';
import { ScrollReveal, SectionHeading, TimelineItem } from '../Shared';

const StorySection = ({ config }) => {
    return (
        <>
            <section id="story" className="py-20 md:py-32 px-4 bg-transparent relative z-10">
                <div className="max-w-5xl mx-auto">
                    <ScrollReveal><SectionHeading title={config.storyTitle} subtitle={config.storySubtitle} /></ScrollReveal>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-transparent via-[#E6D2B5]/50 to-transparent hidden md:block"></div>
                        {config.story?.map((item, index) => (
                            <TimelineItem key={index} date={item.date} title={item.title} description={item.description} side={index % 2 === 0 ? 'left' : 'right'} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Parallax Divider - kept with Story as it marks the end of it, or could be separate. Keeping here for now to match flow. */}
            <div className="h-[60vh] relative bg-fixed bg-center bg-cover flex items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511285560982-1356c11d4606?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
                <div className="absolute inset-0 bg-[#43342E]/60 mix-blend-multiply"></div>
                <div className="relative z-10 text-center text-[#F9F4EF] px-6 max-w-5xl mx-auto py-16 backdrop-blur-[2px] border-y border-[#F9F4EF]/20">
                    <ScrollReveal variant="zoom"><h2 className="font-serif text-3xl md:text-6xl italic font-light tracking-wide leading-tight">"And so the adventure begins"</h2></ScrollReveal>
                </div>
            </div>
        </>
    );
};

export default StorySection;
