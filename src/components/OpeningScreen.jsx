import React, { useState, useEffect } from 'react';

export const OpeningScreen = ({ config, onEnter, show, loading }) => {
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-transition logic: If the Opening Screen is DISABLED, 
    // we still show this premium UI as a preloader, 
    // then automatically fade out once the app is ready.
    useEffect(() => {
        if (!show && !loading && !isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(true);
                setTimeout(onEnter, 1200); // Duration matches transition-all
            }, 300); // Faster reveal when invitation is disabled
            return () => clearTimeout(timer);
        }
    }, [show, loading, onEnter, isTransitioning]);

    const handleEnter = () => {
        setIsTransitioning(true);
        setTimeout(onEnter, 1200);
    };

    return (
        <div className={`fixed inset-0 z-[10000] bg-[#FAF9F6] flex items-center justify-center transition-all duration-[1200ms] cubic-bezier(0.7, 0, 0.3, 1) ${isTransitioning ? 'opacity-0 pointer-events-none scale-110 blur-sm' : 'opacity-100 scale-100'}`}>
            {/* Background Aesthetics */}
            <div className="absolute inset-0 bg-[#FDFBF7]">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#B08D55]/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#E6D2B5]/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative text-center px-6 max-w-lg mx-auto">

                {/* Content Section */}
                <div className="min-h-[260px] flex flex-col justify-center">
                    {loading ? (
                        <div className="animate-fade-in space-y-6">
                            <h3 className="text-[#B08D55] text-[10px] uppercase tracking-[0.5em] font-medium opacity-70">Setting The Scene...</h3>
                            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#B08D55] to-transparent mx-auto opacity-30" />
                            <p className="text-[#8C7C72] text-[9px] uppercase tracking-[0.4em] italic animate-pulse">Loading Love</p>
                        </div>
                    ) : show ? (
                        <div className="animate-fade-in space-y-6">
                            <div className="space-y-6 mb-12">
                                <h3 className="text-[#B08D55] text-[10px] md:text-xs uppercase tracking-[0.5em] font-medium opacity-70">Together with their families</h3>
                                <h2 className="font-serif text-4xl md:text-6xl text-[#43342E] leading-tight tracking-tight">
                                    An Invitation <br /> to Love
                                </h2>
                                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#B08D55] to-transparent mx-auto opacity-50" />
                                <p className="text-[#8C7C72] text-[10px] md:text-xs uppercase tracking-[0.4em] italic">
                                    {config.dateString} • {config.location}
                                </p>
                            </div>

                            <button
                                onClick={handleEnter}
                                className="group relative inline-flex items-center justify-center px-12 py-5 bg-[#43342E] text-white rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-15px_rgba(67,52,46,0.3)]"
                            >
                                <div className="absolute inset-0 w-0 bg-[#B08D55] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
                                <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                                    Enter Celebration
                                    <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-6 opacity-30">
                            <p className="text-[#8C7C72] text-[10px] uppercase tracking-[0.4em] italic animate-pulse">Welcome</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Fine Print */}
            <div className="absolute bottom-12 left-0 right-0 text-center animate-fade-in opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-[9px] text-[#B08D55] uppercase tracking-[0.3em] italic">Made with love for Louie & Florie</p>
            </div>
        </div>
    );
};

export default OpeningScreen;
