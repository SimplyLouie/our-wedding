import React from 'react';
import { ScrollReveal, Countdown } from '../Shared';

const HeroSection = ({ config, onScrollClick }) => {
    return (
        <section id="home" className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src={config.heroImage} alt="Wedding Background" className="w-full h-full object-cover animate-slow-zoom" />
                <div className="absolute inset-0 bg-[#1F1815]/30 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
            </div>

            <div className="relative z-10 text-center px-4 flex flex-col justify-center h-full pt-10">
                <ScrollReveal variant="up" delay={200}>
                    <h3 className="text-xl md:text-3xl font-script mb-6 text-[#E6D2B5] opacity-90 drop-shadow-lg tracking-wider">The Wedding Of</h3>
                </ScrollReveal>

                <ScrollReveal variant="up" delay={400}>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#F2E8DC] to-[#DBC1A7]">
                        {config.names}
                    </h1>
                </ScrollReveal>

                <ScrollReveal variant="up" delay={600}>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-lg md:text-2xl font-light italic mb-8 md:mb-12 text-[#F2E8DC]">
                        <span>{config.dateString}</span>
                        <span className="hidden md:inline text-[10px] align-middle text-[#B08D55]">✦</span>
                        <span>{config.location}</span>
                    </div>
                </ScrollReveal>

                <ScrollReveal variant="up" delay={800}><Countdown targetDate={config.dateIso} /></ScrollReveal>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float opacity-80 hover:opacity-100 transition-opacity z-20 cursor-pointer pt-10">
                    <a href="#story" onClick={onScrollClick} className="text-[#F9F4EF] hover:text-[#C5A059] transition-colors flex flex-col items-center gap-2 group p-4 min-w-[60px]">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-light group-hover:tracking-[0.4em] transition-all">Scroll</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-[#F9F4EF] to-transparent"></div>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
