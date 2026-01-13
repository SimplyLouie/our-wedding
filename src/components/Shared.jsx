import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUp } from 'lucide-react';

export const NoiseOverlay = () => (
    <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
    />
);

export const AmbientGlow = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#B08D55] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#E6D2B5] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    </div>
);

export const Preloader = ({ fadeOut }) => (
    <div className={`fixed inset-0 z-[9999] bg-[#FAF9F6] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <div className="text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E6D2B5]/20 to-transparent blur-xl animate-pulse"></div>
            <h1 className="font-script text-6xl md:text-8xl text-[#43342E] mb-6 animate-pulse-slow relative z-10">L & F</h1>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B08D55] to-transparent mx-auto mb-6"></div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#B08D55] animate-fade-in-up">Loading Love...</p>
        </div>
    </div>
);

export const CircularScroll = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
            setShow(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 flex items-center justify-center transition-all duration-500 hover:scale-110 ${show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        >
            <div className="relative w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center">
                <svg className="absolute top-0 left-0 w-full h-full -rotate-90 transform" viewBox="0 0 48 48">
                    <circle className="text-[#E6D2B5]/30" strokeWidth="3" stroke="currentColor" fill="transparent" r={radius} cx="24" cy="24" />
                    <circle className="text-[#B08D55] transition-all duration-100 ease-out" strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="24" cy="24" />
                </svg>
                <ArrowUp size={18} className="text-[#43342E]" />
            </div>
        </button>
    );
};

export const Confetti = () => {
    const particles = Array.from({ length: 50 });
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center">
            {particles.map((_, i) => (
                <div key={i} className={`confetti-piece confetti-${i % 4}`} style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    backgroundColor: ['#B08D55', '#E6D2B5', '#43342E', '#F9F4EF'][i % 4]
                }} />
            ))}
        </div>
    );
};

export const ScrollReveal = ({ children, className = "", variant = "up", delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const currentElement = domRef.current;
        if (currentElement) observer.observe(currentElement);

        return () => {
            if (currentElement) observer.unobserve(currentElement);
        };
    }, []);

    const getTransform = () => {
        switch (variant) {
            case 'left': return isVisible ? 'translate-x-0' : '-translate-x-20';
            case 'right': return isVisible ? 'translate-x-0' : 'translate-x-20';
            case 'zoom': return isVisible ? 'scale-100' : 'scale-90';
            default: return isVisible ? 'translate-y-0' : 'translate-y-20';
        }
    };

    return (
        <div
            ref={domRef}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${isVisible ? 'opacity-100' : 'opacity-0'
                } ${getTransform()} ${className}`}
        >
            {children}
        </div>
    );
};

export const Lightbox = ({ src, onClose }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    if (!src) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#1F1815]/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2 hover:bg-white/10 rounded-full" onClick={onClose}>
                <X size={32} strokeWidth={1.5} />
            </button>
            <div
                className={`relative transition-all duration-500 ease-out transform ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={src}
                    onLoad={() => setIsLoaded(true)}
                    alt="Full screen"
                    className="max-h-[85vh] max-w-[95vw] object-contain shadow-2xl rounded-sm ring-1 ring-white/10"
                />
            </div>
        </div>
    );
};

export const Countdown = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    function calculateTimeLeft() {
        const difference = +new Date(targetDate) - +new Date();
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    useEffect(() => {
        // Initial calc
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]); // Added dependency

    const TimeUnit = ({ value, label }) => (
        <div className="flex flex-col items-center mx-2 sm:mx-6 group cursor-default">
            <div className="w-14 h-14 sm:w-24 sm:h-24 bg-gradient-to-br from-[#F9F4EF]/10 to-[#F9F4EF]/5 backdrop-blur-md rounded-full flex items-center justify-center border border-[#E6D2B5]/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] mb-2 sm:mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:border-[#E6D2B5]/60">
                <span className="text-lg sm:text-4xl font-serif text-[#F9F4EF] drop-shadow-md tabular-nums">{String(value || '0').padStart(2, '0')}</span>
            </div>
            <span className="text-[8px] sm:text-xs uppercase tracking-[0.3em] text-[#E6D2B5] font-light transition-colors group-hover:text-white">{label}</span>
        </div>
    );

    return (
        <div className="flex flex-wrap justify-center mt-6 md:mt-12 animate-fade-in-up">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <TimeUnit value={timeLeft.seconds} label="Secs" />
        </div>
    );
};

export const Navigation = ({ coupleName, logoText, logoImage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Our Story', href: '#story' },
        { name: 'Events', href: '#events' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'RSVP', href: '#rsvp' },
    ];

    const initials = coupleName ? coupleName.split('&').map(n => n.trim()[0]).join(' & ') : "L & F";
    const logoContent = logoImage ? (
        <img src={logoImage} alt="Logo" className="h-12 w-auto object-contain" />
    ) : (
        logoText || initials
    );

    const handleNavClick = (e, href) => {
        e.preventDefault();
        setIsOpen(false);
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed w-full z-40 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-[#FDFBF7]/90 backdrop-blur-md shadow-sm py-3 border-b border-[#E6D2B5]/20' : 'bg-transparent py-4 md:py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-12">
                    <div className="flex-shrink-0 flex items-center">
                        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className={`font-script text-3xl font-medium tracking-wide transition-all duration-500 hover:opacity-80 flex items-center ${isScrolled ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#B08D55] to-[#8A6E4B] scale-90 origin-left' : 'text-[#F9F4EF] scale-100'}`}>
                            {logoContent}
                        </a>
                    </div>

                    <div className="hidden md:flex space-x-10">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`text-[11px] uppercase tracking-[0.25em] font-medium hover:text-[#C5A059] transition-colors relative group ${isScrolled ? 'text-[#5D4B42]' : 'text-[#F9F4EF]/90'}`}
                            >
                                {link.name}
                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#C5A059] transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-md transition-colors ${isScrolled ? 'text-[#43342E]' : 'text-[#F9F4EF]'}`}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`md:hidden absolute w-full bg-[#FDFBF7]/95 backdrop-blur-xl shadow-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pt-4 pb-6 space-y-2 text-center">
                    {navLinks.map((link, idx) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            style={{ transitionDelay: `${idx * 50}ms` }}
                            className={`block px-3 py-3 text-[#5D4B42] hover:text-[#C5A059] hover:bg-[#FAF9F6] rounded-sm font-serif text-xl italic transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export const SectionHeading = ({ title, subtitle }) => (
    <div className="text-center mb-16 md:mb-24">
        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#9A7B4A] font-bold tracking-[0.3em] uppercase text-[10px] mb-4">{subtitle}</h3>
        <h2 className="font-serif text-5xl md:text-7xl text-[#43342E] mb-8 font-normal">{title}</h2>
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#DBC1A7] to-transparent mx-auto"></div>
    </div>
);

export const TimelineItem = ({ date, title, description, side }) => (
    <ScrollReveal variant="up" className="w-full">
        <div className={`flex flex-col md:flex-row items-center mb-12 md:mb-20 ${side === 'left' ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-full md:w-5/12 p-8 md:p-12 text-center md:text-left bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-sm hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group order-2 md:order-1 mt-6 md:mt-0">
                <span className="text-[#B08D55] font-bold tracking-[0.2em] text-[10px] uppercase block mb-3 group-hover:text-[#8A6E4B] transition-colors">{date}</span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#43342E] mb-4">{title}</h3>
                <p className="text-[#786C61] leading-relaxed font-light text-sm">{description}</p>
            </div>
            <div className="w-full md:w-2/12 flex justify-center order-1 md:order-2">
                <div className="w-3 h-3 bg-gradient-to-b from-[#B08D55] to-[#8A6E4B] rounded-full ring-8 ring-[#F9F4EF] z-10 shadow-md"></div>
            </div>
            <div className="hidden md:block w-5/12 order-3"></div>
        </div>
    </ScrollReveal>
);