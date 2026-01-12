import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Gift, Clock, Music, Menu, X, ChevronDown, Check, Loader, Settings, Upload, Link as LinkIcon, Image as ImageIcon, Edit2, Save, ZoomIn, Camera } from 'lucide-react';

/**
 * Modern Wedding Website - Luxury Edition with Admin Dashboard
 * Features: 
 * - High-Fidelity Image Upload (URL.createObjectURL)
 * - Gallery Lightbox
 * - Luxury Aesthetic (Champagne/Nude/Brown)
 */

// --- Components ---

const ScrollReveal = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    }, { threshold: 0.1 });

    const currentElement = domRef.current;
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        } ${className}`}
    >
      {children}
    </div>
  );
};

const Lightbox = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-[#1F1815]/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors" onClick={onClose}>
        <X size={40} strokeWidth={1} />
      </button>
      <img
        src={src}
        alt="Full screen"
        className="max-h-[90vh] max-w-[95vw] object-contain shadow-2xl rounded-sm"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center mx-2 sm:mx-4">
      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#F9F4EF]/5 backdrop-blur-md rounded-full flex items-center justify-center border border-[#E6D2B5]/30 shadow-lg mb-2">
        <span className="text-xl sm:text-4xl font-serif text-[#F9F4EF]">{value || '0'}</span>
      </div>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#E6D2B5]">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center mt-12 animate-fade-in-up">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

const Navigation = ({ coupleName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
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

  return (
    <nav className={`fixed w-full z-40 transition-all duration-700 ${isScrolled ? 'bg-[#FDFBF7]/90 backdrop-blur-xl shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className={`font-serif text-2xl font-medium tracking-wide transition-colors duration-300 ${isScrolled ? 'text-[#43342E]' : 'text-[#F9F4EF]'}`}>
              {initials}
            </a>
          </div>

          <div className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-[11px] uppercase tracking-[0.25em] font-medium hover:text-[#C5A059] transition-colors ${isScrolled ? 'text-[#5D4B42]' : 'text-[#F9F4EF]/90'}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isScrolled ? 'text-[#43342E]' : 'text-[#F9F4EF]'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden absolute w-full bg-[#FDFBF7] shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-4 pb-6 space-y-2 text-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 text-[#5D4B42] hover:text-[#C5A059] hover:bg-[#FAF9F6] rounded-sm font-serif text-xl italic"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

const SectionHeading = ({ title, subtitle }) => (
  <div className="text-center mb-20">
    <h3 className="text-[#B08D55] font-bold tracking-[0.3em] uppercase text-[10px] mb-6">{subtitle}</h3>
    <h2 className="font-serif text-4xl md:text-6xl text-[#43342E] mb-8 font-normal">{title}</h2>
    <div className="w-12 h-[1px] bg-[#DBC1A7] mx-auto"></div>
  </div>
);

const TimelineItem = ({ date, title, description, side }) => (
  <div className={`flex flex-col md:flex-row items-center mb-16 ${side === 'left' ? 'md:flex-row-reverse' : ''}`}>
    <div className="w-full md:w-5/12 p-10 text-center md:text-left bg-[#FDFBF7] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border-l-2 border-[#DBC1A7]">
      <span className="text-[#B08D55] font-bold tracking-[0.2em] text-[10px] uppercase block mb-2">{date}</span>
      <h3 className="font-serif text-3xl text-[#43342E] mb-4">{title}</h3>
      <p className="text-[#786C61] leading-relaxed font-light text-sm">{description}</p>
    </div>
    <div className="w-full md:w-2/12 flex justify-center my-6 md:my-0">
      <div className="w-3 h-3 bg-[#1F1815] rounded-full ring-8 ring-[#FAF9F6] z-10"></div>
    </div>
    <div className="w-full md:w-5/12"></div>
  </div>
);

// --- Admin Panel ---

const AdminPanel = ({ config, updateConfig, closePanel }) => {
  const [activeTab, setActiveTab] = useState('general');

  const handleImageChange = (e, key, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);

      if (index !== null) {
        const newGallery = [...config.galleryImages];
        newGallery[index] = objectUrl;
        updateConfig('galleryImages', newGallery);
      } else {
        updateConfig(key, objectUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#1F1815]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] w-full max-w-5xl h-[85vh] rounded-none shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-[#E6D2B5]/30 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-2xl text-[#43342E]">Website Configuration</h2>
            <p className="text-xs text-[#8C7C72] uppercase tracking-wider mt-1">Admin Dashboard</p>
          </div>
          <button onClick={closePanel} className="text-[#8C7C72] hover:text-[#43342E] transition-colors p-2">
            <X size={24} />
          </button>
        </div>

        {/* Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-[#E6D2B5]/30 flex flex-col py-6">
            {['general', 'rsvp', 'images'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-left text-xs font-bold uppercase tracking-widest transition-all border-l-4 ${activeTab === tab
                    ? 'border-[#B08D55] bg-[#F9F4EF] text-[#43342E]'
                    : 'border-transparent text-[#8C7C72] hover:bg-gray-50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-10 bg-[#FAF9F6]">

            {activeTab === 'general' && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Couple Names</label>
                    <input
                      type="text"
                      value={config.names}
                      onChange={(e) => updateConfig('names', e.target.value)}
                      className="w-full bg-white p-4 border border-[#E6D2B5] text-[#43342E] focus:outline-none focus:border-[#43342E] transition-colors"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Display Date</label>
                    <input
                      type="text"
                      value={config.dateString}
                      onChange={(e) => updateConfig('dateString', e.target.value)}
                      className="w-full bg-white p-4 border border-[#E6D2B5] text-[#43342E] focus:outline-none focus:border-[#43342E] transition-colors"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Countdown Date</label>
                    <input
                      type="datetime-local"
                      value={config.dateIso.substring(0, 16)}
                      onChange={(e) => updateConfig('dateIso', e.target.value)}
                      className="w-full bg-white p-4 border border-[#E6D2B5] text-[#43342E] focus:outline-none focus:border-[#43342E] transition-colors"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Location</label>
                    <input
                      type="text"
                      value={config.location}
                      onChange={(e) => updateConfig('location', e.target.value)}
                      className="w-full bg-white p-4 border border-[#E6D2B5] text-[#43342E] focus:outline-none focus:border-[#43342E] transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rsvp' && (
              <div className="space-y-10 animate-fade-in max-w-2xl">
                <div>
                  <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-4">RSVP Mode Selection</label>
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => updateConfig('rsvpMode', 'form')}
                      className={`py-8 px-6 border flex flex-col items-center justify-center gap-4 transition-all ${config.rsvpMode === 'form'
                          ? 'border-[#43342E] bg-white text-[#43342E] shadow-lg scale-105'
                          : 'border-[#E6D2B5] bg-transparent text-[#8C7C72] hover:bg-white'
                        }`}
                    >
                      <Edit2 size={28} strokeWidth={1.5} />
                      <span className="font-serif text-lg">Built-in Form</span>
                    </button>
                    <button
                      onClick={() => updateConfig('rsvpMode', 'link')}
                      className={`py-8 px-6 border flex flex-col items-center justify-center gap-4 transition-all ${config.rsvpMode === 'link'
                          ? 'border-[#43342E] bg-white text-[#43342E] shadow-lg scale-105'
                          : 'border-[#E6D2B5] bg-transparent text-[#8C7C72] hover:bg-white'
                        }`}
                    >
                      <LinkIcon size={28} strokeWidth={1.5} />
                      <span className="font-serif text-lg">External Link</span>
                    </button>
                  </div>
                </div>

                {config.rsvpMode === 'link' && (
                  <div className="animate-fade-in bg-white p-8 border border-[#E6D2B5]">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">External Link URL</label>
                    <input
                      type="url"
                      placeholder="e.g. https://theknot.com/us/..."
                      value={config.rsvpExternalLink}
                      onChange={(e) => updateConfig('rsvpExternalLink', e.target.value)}
                      className="w-full p-4 border-b-2 border-[#E6D2B5] bg-[#FAF9F6] text-[#43342E] focus:outline-none focus:border-[#43342E] transition-colors font-mono text-sm"
                    />
                    <p className="text-xs text-[#8C7C72] mt-4 italic">Visitors will be redirected to this URL when clicking "RSVP".</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-12 animate-fade-in">

                {/* Hero Section */}
                <div>
                  <h3 className="font-serif text-xl text-[#43342E] mb-6">Hero Background</h3>
                  <div className="relative group w-full h-64 overflow-hidden bg-gray-100 border border-[#E6D2B5]">
                    <img src={config.heroImage} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <label className="cursor-pointer bg-white/90 text-[#43342E] px-6 py-3 rounded-none uppercase tracking-widest text-xs font-bold hover:bg-white flex items-center gap-3 transition-transform transform group-hover:-translate-y-1">
                        <Upload size={16} /> Replace Image
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'heroImage')} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Gallery Section */}
                <div>
                  <h3 className="font-serif text-xl text-[#43342E] mb-6">Gallery Collection</h3>
                  <p className="text-xs text-[#8C7C72] mb-6">Click any image below to replace it instantly.</p>
                  <div className="grid grid-cols-4 gap-4">
                    {config.galleryImages.map((src, idx) => (
                      <div key={idx} className="relative group cursor-pointer aspect-square bg-[#E6D2B5]/20 overflow-hidden border border-[#E6D2B5]/50">
                        <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                        <div className="absolute inset-0 bg-[#43342E]/0 group-hover:bg-[#43342E]/40 transition-colors duration-300 flex items-center justify-center">
                          <Upload className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" size={24} />
                        </div>

                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, null, idx)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-6 border-t border-[#E6D2B5]/30 flex justify-end">
          <button onClick={closePanel} className="bg-[#43342E] text-[#F9F4EF] px-10 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#5D4B42] transition-all shadow-lg hover:shadow-xl">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

export default function App() {
  // State for Website Configuration
  const [config, setConfig] = useState({
    names: "Louie & Florie",
    dateString: "July 4th, 2026",
    dateIso: "2026-07-04T00:00:00",
    location: "Cebu, Philippines",
    heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    rsvpMode: 'form',
    rsvpExternalLink: "https://forms.google.com/",
    galleryImages: [
      "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?auto=format&fit=crop&w=600&q=90", // Ring/Hands
      "https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=600&q=90", // Table Setting
      "https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&w=600&q=90", // Artistic Bride
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=90", // Cake
      "https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&w=600&q=90", // Shoes
      "https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&w=600&q=90", // Flowers
      "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90", // Venue
      "https://images.unsplash.com/photo-1607193384230-25e635834331?auto=format&fit=crop&w=600&q=90"  // Stationery
    ]
  });

  const [rsvpForm, setRsvpForm] = useState({ name: '', email: '', guests: '1', attending: 'yes' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null); // Lightbox State

  // Admin State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPass, setAdminPass] = useState("");

  const handleConfigUpdate = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPass === "admin") {
      setShowAdminLogin(false);
      setShowAdminPanel(true);
      setAdminPass("");
    } else {
      alert("Incorrect Password");
    }
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#43342E] font-sans selection:bg-[#DBC1A7] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Montserrat', sans-serif; }
        h1, h2, h3, h4, .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>

      {/* Lightbox Overlay */}
      <Lightbox src={lightboxImg} onClose={() => setLightboxImg(null)} />

      {/* Admin Modals */}
      {showAdminPanel && (
        <AdminPanel
          config={config}
          updateConfig={handleConfigUpdate}
          closePanel={() => setShowAdminPanel(false)}
        />
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[70] bg-[#1F1815]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-10 max-w-sm w-full text-center shadow-2xl border-t-4 border-[#B08D55]">
            <h3 className="font-serif text-3xl mb-2 text-[#43342E]">Planner Access</h3>
            <p className="text-[#8C7C72] text-xs uppercase tracking-widest mb-8">Restricted Area</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="••••••"
                className="w-full border-b border-[#E6D2B5] p-3 text-center tracking-[0.5em] text-xl focus:outline-none focus:border-[#43342E] mb-8"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                autoFocus
              />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-[#43342E] text-white py-3 uppercase text-xs font-bold tracking-widest hover:bg-[#5D4B42]">Enter</button>
                <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 bg-transparent text-[#8C7C72] py-3 uppercase text-xs font-bold tracking-widest hover:text-[#43342E]">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navigation coupleName={config.names} />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={config.heroImage}
            alt="Wedding Background"
            className="w-full h-full object-cover transition-transform duration-[20s] ease-in-out transform scale-100 hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#1F1815]/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
        </div>

        <div className="relative z-10 text-center px-4 animate-fade-in text-[#F9F4EF]">
          <h3 className="text-xs md:text-sm tracking-[0.5em] uppercase mb-8 text-[#E6D2B5] opacity-90">The Wedding Of</h3>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 drop-shadow-2xl text-[#FDFBF7]">
            {config.names}
          </h1>
          <div className="flex items-center justify-center gap-6 text-lg md:text-2xl font-light italic mb-12 text-[#F2E8DC]">
            <span>{config.dateString}</span>
            <span className="text-[10px] align-middle">•</span>
            <span>{config.location}</span>
          </div>

          <Countdown targetDate={config.dateIso} />

          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce opacity-70">
            <a href="#story" className="text-[#F9F4EF] hover:text-[#C5A059] transition-colors">
              <ChevronDown size={40} strokeWidth={0.5} />
            </a>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-32 px-4 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <SectionHeading title="Our Journey" subtitle="Since 2021" />
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-[#E6D2B5]/30 hidden md:block"></div>

            <ScrollReveal>
              <TimelineItem
                date="June 15, 2021"
                title="The Encounter"
                description="We met at a coffee shop in downtown. It started with a spilled latte and ended with a conversation that lasted for hours."
                side="right"
              />
            </ScrollReveal>

            <ScrollReveal>
              <TimelineItem
                date="December 24, 2022"
                title="Building a Home"
                description="After a year and a half of adventures, we moved in together. Our first apartment was small, but full of love (and plants)."
                side="left"
              />
            </ScrollReveal>

            <ScrollReveal>
              <TimelineItem
                date="August 10, 2024"
                title="The Promise"
                description="On a sunset hike overlooking the ocean, Louie got down on one knee. It was the easiest question Florie ever had to answer."
                side="right"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Parallax Divider */}
      <div className="h-[60vh] relative bg-fixed bg-center bg-cover flex items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511285560982-1356c11d4606?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-[#43342E]/50 mix-blend-multiply"></div>
        <div className="relative z-10 text-center text-[#F9F4EF] px-6 max-w-5xl mx-auto py-16 backdrop-blur-[1px] border-y border-[#F9F4EF]/20">
          <h2 className="font-serif text-4xl md:text-6xl italic font-light tracking-wide leading-tight">"And so the adventure begins"</h2>
        </div>
      </div>

      {/* Events Section */}
      <section id="events" className="py-32 px-4 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <SectionHeading title="The Celebration" subtitle="Itinerary" />
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Event Card 1 */}
            <ScrollReveal className="delay-100">
              <div className="bg-white p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 text-center h-full group border-b-4 border-transparent hover:border-[#DBC1A7]">
                <div className="mb-8">
                  <span className="inline-block p-4 bg-[#F5F0E6] rounded-full text-[#B08D55] group-hover:bg-[#43342E] group-hover:text-[#F9F4EF] transition-colors duration-500">
                    <Music size={24} strokeWidth={1.5} />
                  </span>
                </div>
                <h3 className="font-serif text-3xl text-[#43342E] mb-3">Welcome Party</h3>
                <p className="text-[#B08D55] font-bold text-[11px] tracking-[0.2em] mb-6 uppercase">Friday, July 3 • 6:00 PM</p>
                <p className="text-[#786C61] mb-10 font-light text-sm leading-relaxed">Join us for cocktails and hors d'oeuvres to kick off the celebration.</p>
                <div className="inline-flex items-center justify-center text-[#8C7C72] text-[10px] uppercase tracking-[0.2em] border border-[#E6D2B5] px-6 py-2 rounded-full">
                  <MapPin size={12} className="mr-2" />
                  <span>The Gardens</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Event Card 2 */}
            <ScrollReveal className="delay-200">
              <div className="bg-white p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] transition-all duration-700 text-center transform md:-translate-y-8 h-full relative z-10 border-b-4 border-[#B08D55]">
                <div className="mb-8">
                  <span className="inline-block p-5 bg-[#F9F4EF] rounded-full text-[#B08D55] border border-[#B08D55] group-hover:scale-110 transition-transform">
                    <Heart size={32} strokeWidth={1} fill="#B08D55" fillOpacity={0.1} />
                  </span>
                </div>
                <h3 className="font-serif text-4xl text-[#43342E] mb-3">The Ceremony</h3>
                <p className="text-[#B08D55] font-bold text-[11px] tracking-[0.2em] mb-6 uppercase">Saturday, July 4 • 2:00 PM</p>
                <p className="text-[#786C61] mb-10 font-light text-sm leading-relaxed">We exchange vows followed by dinner and dancing.</p>
                <div className="flex flex-col items-center justify-center text-[#8C7C72] text-[10px] uppercase tracking-[0.2em]">
                  <span className="border-b border-[#E6D2B5] pb-1 mb-1">Archdiocesan Shrine of</span>
                  <span>St. Thérèse</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Event Card 3 */}
            <ScrollReveal className="delay-300">
              <div className="bg-white p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 text-center h-full group border-b-4 border-transparent hover:border-[#DBC1A7]">
                <div className="mb-8">
                  <span className="inline-block p-4 bg-[#F5F0E6] rounded-full text-[#B08D55] group-hover:bg-[#43342E] group-hover:text-[#F9F4EF] transition-colors duration-500">
                    <Clock size={24} strokeWidth={1.5} />
                  </span>
                </div>
                <h3 className="font-serif text-3xl text-[#43342E] mb-3">Reception</h3>
                <p className="text-[#B08D55] font-bold text-[11px] tracking-[0.2em] mb-6 uppercase">Saturday, July 4 • 6:00 PM</p>
                <p className="text-[#786C61] mb-10 font-light text-sm leading-relaxed">Dinner, dancing, and drinks to celebrate the newlyweds.</p>
                <div className="inline-flex items-center justify-center text-[#8C7C72] text-[10px] uppercase tracking-[0.2em] border border-[#E6D2B5] px-6 py-2 rounded-full">
                  <MapPin size={12} className="mr-2" />
                  <span>Reception Hall</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section id="gallery" className="py-32 bg-white">
        <ScrollReveal>
          <SectionHeading title="Captured Moments" subtitle="Gallery" />
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 px-1 max-w-[1600px] mx-auto">
          {config.galleryImages.map((src, i) => (
            <ScrollReveal key={i}>
              <div
                className="overflow-hidden group aspect-[3/4] cursor-pointer relative bg-gray-100"
                onClick={() => setLightboxImg(src)}
              >
                <img
                  src={src}
                  alt={`Gallery ${i}`}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110 filter grayscale-[10%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-[#1F1815]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-white flex flex-col items-center">
                    <ZoomIn size={32} strokeWidth={1} className="mb-2" />
                    <span className="text-[10px] uppercase tracking-[0.3em]">View</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-32 px-4 bg-[#F5F0E6] relative">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

          {/* Left Side Image */}
          <div className="hidden md:block w-5/12 relative bg-[#1F1815]">
            <img
              src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay grayscale"
              alt="Flowers"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              <div className="border border-[#DBC1A7]/30 p-8 w-full h-full flex flex-col items-center justify-center text-center">
                <h3 className="text-[#DBC1A7] font-serif text-5xl mb-6">R S V P</h3>
                <div className="w-8 h-[1px] bg-[#DBC1A7]/50 mb-6"></div>
                <p className="text-[#8C7C72] text-[10px] uppercase tracking-[0.3em] leading-loose">Kindly Respond By<br /><span className="text-[#DBC1A7] text-sm">May 1st, 2026</span></p>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="w-full md:w-7/12 p-12 md:p-20 bg-[#FDFBF7] flex flex-col justify-center relative">

            {/* Decorative corners */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#DBC1A7]"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#DBC1A7]"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#DBC1A7]"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#DBC1A7]"></div>

            {config.rsvpMode === 'link' ? (
              <div className="text-center animate-fade-in py-10">
                <div className="w-20 h-20 bg-[#F5F0E6] rounded-full flex items-center justify-center mx-auto mb-8 text-[#B08D55]">
                  <Gift size={32} strokeWidth={1} />
                </div>
                <h2 className="font-serif text-4xl mb-6 text-[#43342E]">Will You Join Us?</h2>
                <p className="text-[#8C7C72] mb-12 font-light text-sm leading-relaxed px-8">
                  We are managing our guest list through an external service. Please click the button below to confirm your attendance.
                </p>
                <a
                  href={config.rsvpExternalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block min-w-[200px] bg-[#43342E] text-[#F9F4EF] py-4 px-8 text-xs font-bold tracking-[0.25em] hover:bg-[#5D4B42] transition-all duration-300 shadow-lg hover:shadow-xl uppercase text-center cursor-pointer decoration-0"
                >
                  RSVP Now
                </a>
                <p className="text-[10px] text-[#B08D55] mt-8 uppercase tracking-widest opacity-60">Opens in a new tab</p>
              </div>
            ) : (
              !isSubmitted ? (
                <>
                  <h2 className="font-serif text-4xl mb-3 text-[#43342E]">Will you join us?</h2>
                  <p className="text-[#8C7C72] mb-12 font-light text-sm italic">We would be honored by your presence.</p>

                  <form onSubmit={handleRsvpSubmit} className="space-y-8">
                    <div className="group relative">
                      <input
                        required
                        type="text"
                        name="name"
                        className="w-full border-b border-[#DBC1A7] py-3 focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer"
                        placeholder="Full Name"
                        value={rsvpForm.name}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      />
                      <label className="absolute left-0 -top-3 text-[10px] text-[#B08D55] uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#B08D55]">Full Name</label>
                    </div>

                    <div className="group relative">
                      <input
                        required
                        type="email"
                        name="email"
                        className="w-full border-b border-[#DBC1A7] py-3 focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer"
                        placeholder="Email Address"
                        value={rsvpForm.email}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                      />
                      <label className="absolute left-0 -top-3 text-[10px] text-[#B08D55] uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#B08D55]">Email Address</label>
                    </div>

                    <div className="flex gap-8 pt-4">
                      <div className="w-1/2">
                        <label className="block text-[10px] font-bold text-[#B08D55] mb-2 uppercase tracking-widest">Guests</label>
                        <select
                          name="guests"
                          className="w-full border-b border-[#DBC1A7] py-2 focus:outline-none focus:border-[#43342E] bg-transparent text-[#43342E]"
                          value={rsvpForm.guests}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}
                        >
                          <option value="1">1 Person</option>
                          <option value="2">2 People</option>
                          <option value="3">3 People</option>
                          <option value="4">4 People</option>
                        </select>
                      </div>
                      <div className="w-1/2">
                        <label className="block text-[10px] font-bold text-[#B08D55] mb-2 uppercase tracking-widest">Attending</label>
                        <select
                          name="attending"
                          className="w-full border-b border-[#DBC1A7] py-2 focus:outline-none focus:border-[#43342E] bg-transparent text-[#43342E]"
                          value={rsvpForm.attending}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}
                        >
                          <option value="yes">Joyfully Accept</option>
                          <option value="no">Regretfully Decline</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#43342E] text-[#F9F4EF] py-4 mt-8 text-xs font-bold tracking-[0.25em] hover:bg-[#5D4B42] transition-all duration-300 shadow-md hover:shadow-lg uppercase disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={16} className="animate-spin mr-3" />
                          Processing
                        </>
                      ) : "Confirm Attendance"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-10">
                  <div className="w-20 h-20 border border-[#B08D55] rounded-full flex items-center justify-center text-[#B08D55] mb-8">
                    <Check size={40} strokeWidth={1} />
                  </div>
                  <h2 className="font-serif text-4xl mb-4 text-[#43342E]">Thank You</h2>
                  <p className="text-[#8C7C72] mb-8 font-light italic">Your response has been successfully recorded.</p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-[#B08D55] text-[10px] uppercase tracking-[0.2em] border-b border-[#B08D55] pb-1 hover:text-[#43342E] hover:border-[#43342E] transition-colors"
                  >
                    Submit another response
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F1815] text-[#8C7C72] py-20 text-center border-t-8 border-[#2E2622]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-4xl text-[#DBC1A7] mb-10 tracking-wide">{config.names}</h2>
          <div className="flex justify-center space-x-12 mb-12">
            <a href="#" className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors">Instagram</a>
            <a href="#" className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors">Registry</a>
            <a href="#" className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors">Contact</a>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 border-t border-[#43342E]/50 pt-10 mt-6 max-w-xs mx-auto">
            <p className="text-[10px] font-light tracking-widest text-[#5D4B42]">
              EST. 2026 • TUSCANY
            </p>
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-[9px] text-[#43342E] hover:text-[#B08D55] transition-colors uppercase tracking-widest font-bold flex items-center gap-1 opacity-50 hover:opacity-100"
            >
              <Settings size={10} /> Admin Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}