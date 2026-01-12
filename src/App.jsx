import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Gift, Clock, Music, Menu, X, ChevronDown, Check, Loader, Settings, Upload, Link as LinkIcon, Image as ImageIcon, Edit2, Save, ZoomIn, Camera, RefreshCw, Trash2, Lock, ArrowRight, Plus, ArrowUp, ExternalLink, Users, ClipboardList, Search, AlertCircle, CheckCircle, Type, ShieldAlert, Download, MessageSquare, Utensils } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

/**
 * Modern Wedding Website - V7.3 (Animation & Layout Fixes)
 * Features: 
 * - Fixed Preloader Fade Out (Added unmount delay)
 * - Adjusted Scroll Indicator Position (Lowered)
 * - Refined Spacing for Mobile
 */

// --- 1. PASTE YOUR KEYS HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyC9LA_PFA6KZ7s8IlQdJuolA0gaBm8kgNI",
  authDomain: "simply-louie.firebaseapp.com",
  projectId: "simply-louie",
  storageBucket: "simply-louie.firebasestorage.app",
  messagingSenderId: "822487405638",
  appId: "1:822487405638:web:078f7f6b9e968f80266647"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Simple path for your data
const DATA_PATH = 'wedding/config';

// --- Components ---

const NoiseOverlay = () => (
  <div
    className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }}
  />
);

const AmbientGlow = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#B08D55] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse-slow"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#E6D2B5] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
  </div>
);

// NEW: Elegant Preloader Component
const Preloader = ({ fadeOut }) => (
  <div className={`fixed inset-0 z-[9999] bg-[#FAF9F6] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
    <div className="text-center relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E6D2B5]/20 to-transparent blur-xl animate-pulse"></div>
      <h1 className="font-script text-6xl md:text-8xl text-[#43342E] mb-6 animate-pulse-slow relative z-10">L & F</h1>
      <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B08D55] to-transparent mx-auto mb-6"></div>
      <p className="text-[10px] uppercase tracking-[0.5em] text-[#B08D55] animate-fade-in-up">Loading Love...</p>
    </div>
  </div>
);

const CircularScroll = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShow(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
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

const Confetti = () => {
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

const ScrollReveal = ({ children, className = "", variant = "up", delay = 0 }) => {
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

const Lightbox = ({ src, onClose }) => {
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
    <div className="flex flex-col items-center mx-3 sm:mx-6 group cursor-default">
      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#F9F4EF]/10 to-[#F9F4EF]/5 backdrop-blur-md rounded-full flex items-center justify-center border border-[#E6D2B5]/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:border-[#E6D2B5]/60">
        <span className="text-xl sm:text-4xl font-serif text-[#F9F4EF] drop-shadow-md tabular-nums">{String(value || '0').padStart(2, '0')}</span>
      </div>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#E6D2B5] font-light transition-colors group-hover:text-white">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center mt-8 md:mt-12 animate-fade-in-up">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

const Navigation = ({ coupleName, logoText, logoImage }) => {
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
  const logoContent = logoImage ? (
    <img src={logoImage} alt="Logo" className="h-12 w-auto object-contain" />
  ) : (
    logoText || initials
  );

  return (
    <nav className={`fixed w-full z-40 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-[#FDFBF7]/90 backdrop-blur-md shadow-sm py-3 border-b border-[#E6D2B5]/20' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className={`font-script text-3xl font-medium tracking-wide transition-all duration-500 hover:opacity-80 flex items-center ${isScrolled ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#B08D55] to-[#8A6E4B] scale-90 origin-left' : 'text-[#F9F4EF] scale-100'}`}>
              {logoContent}
            </a>
          </div>

          <div className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
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
              onClick={() => setIsOpen(false)}
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

const SectionHeading = ({ title, subtitle }) => (
  <div className="text-center mb-16 md:mb-24">
    <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#9A7B4A] font-bold tracking-[0.3em] uppercase text-[10px] mb-4">{subtitle}</h3>
    <h2 className="font-serif text-5xl md:text-7xl text-[#43342E] mb-8 font-normal">{title}</h2>
    <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#DBC1A7] to-transparent mx-auto"></div>
  </div>
);

const TimelineItem = ({ date, title, description, side }) => (
  <ScrollReveal variant="up" className="w-full">
    <div className={`flex flex-col md:flex-row items-center mb-12 md:mb-20 ${side === 'left' ? 'md:flex-row-reverse' : ''}`}>

      {/* Content Card */}
      <div className="w-full md:w-5/12 p-8 md:p-12 text-center md:text-left bg-white/60 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-sm hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group order-2 md:order-1 mt-6 md:mt-0">
        <span className="text-[#B08D55] font-bold tracking-[0.2em] text-[10px] uppercase block mb-3 group-hover:text-[#8A6E4B] transition-colors">{date}</span>
        <h3 className="font-serif text-2xl md:text-3xl text-[#43342E] mb-4">{title}</h3>
        <p className="text-[#786C61] leading-relaxed font-light text-sm">{description}</p>
      </div>

      {/* Central Marker */}
      <div className="w-full md:w-2/12 flex justify-center order-1 md:order-2">
        <div className="w-3 h-3 bg-gradient-to-b from-[#B08D55] to-[#8A6E4B] rounded-full ring-8 ring-[#F9F4EF] z-10 shadow-md"></div>
      </div>

      {/* Empty Space for alignment */}
      <div className="hidden md:block w-5/12 order-3"></div>
    </div>
  </ScrollReveal>
);

// --- Admin Panel ---

const AdminPanel = ({ config, updateConfig, resetConfig, closePanel, isSaving, onSave }) => {
  const [activeTab, setActiveTab] = useState('guests');
  const [saveStatus, setSaveStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleImageChange = (e, key, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result;
        // Basic check for size (approx 900KB) to respect Firestore document limits
        if (res.length > 900000) {
          alert("Image too large (Max ~1MB). Please compress or use an Image URL.");
          return;
        }
        if (index !== null) {
          const newGallery = [...config.galleryImages];
          newGallery[index] = res;
          updateConfig('galleryImages', newGallery);
        } else {
          updateConfig(key, res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (val, key, index = null) => {
    if (index !== null) {
      const newGallery = [...config.galleryImages];
      newGallery[index] = val;
      updateConfig('galleryImages', newGallery);
    } else {
      updateConfig(key, val);
    }
  }

  // --- Story Editing Helpers ---
  const updateStory = (index, field, value) => {
    const newStory = [...config.story];
    newStory[index][field] = value;
    updateConfig('story', newStory);
  };

  const addStoryItem = () => {
    const newStory = [...config.story, { date: "New Date", title: "New Milestone", description: "Description here..." }];
    updateConfig('story', newStory);
  };

  const removeStoryItem = (index) => {
    const newStory = config.story.filter((_, i) => i !== index);
    updateConfig('story', newStory);
  };

  // --- Events Editing Helpers ---
  const updateEvent = (index, field, value) => {
    const newEvents = [...config.events];
    newEvents[index][field] = value;
    updateConfig('events', newEvents);
  };

  // --- Guest List Helpers ---
  const deleteGuest = (guestToDelete) => {
    if (confirm('Remove this guest?')) {
      const newGuests = config.guestList.filter(g => g.timestamp !== guestToDelete.timestamp);
      updateConfig('guestList', newGuests);
    }
  };

  const downloadCSV = () => {
    if (!config.guestList || config.guestList.length === 0) return;

    const headers = ['Name', 'Attending', 'Guests', 'Email', 'Message', 'FollowUp Date', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...config.guestList.map(guest => [
        `"${guest.name}"`,
        guest.attending,
        guest.guests,
        guest.email || '',
        `"${(guest.message || '').replace(/"/g, '""')}"`,
        guest.followUpDate || '',
        guest.timestamp
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wedding_guests_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredGuests = config.guestList?.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.email && g.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const stats = {
    total: config.guestList?.length || 0,
    attending: config.guestList?.filter(g => g.attending === 'yes').length || 0,
    pending: config.guestList?.filter(g => g.attending === 'undecided').length || 0,
    declined: config.guestList?.filter(g => g.attending === 'no').length || 0,
  };

  // --- Planner Helpers ---
  const addNote = () => {
    const newNotes = [...(config.notes || []), { id: Date.now(), text: "New Note", completed: false, date: new Date().toISOString().split('T')[0] }];
    updateConfig('notes', newNotes);
  };

  const updateNote = (id, field, value) => {
    const newNotes = config.notes.map(n => n.id === id ? { ...n, [field]: value } : n);
    updateConfig('notes', newNotes);
  };

  const deleteNote = (id) => {
    const newNotes = config.notes.filter(n => n.id !== id);
    updateConfig('notes', newNotes);
  };

  const handleResetRequest = () => {
    if (resetConfirm) {
      resetConfig();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000); // Clear confirmation after 3s
    }
  };

  // Fixed Save Handler
  const handleSaveClick = () => {
    if (onSave) {
      onSave();
      setSaveStatus('Saving...');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#1F1815]/90 backdrop-blur-sm flex items-center justify-center p-0 md:p-4">
      <div className="bg-[#FAF9F6] w-full max-w-6xl h-full md:h-[90vh] rounded-none md:rounded-lg shadow-2xl flex flex-col overflow-hidden border border-[#E6D2B5]/20 animate-in zoom-in-95 duration-300">
        {/* Header - Optimized for Mobile */}
        <div className="bg-white px-4 md:px-8 py-3 md:py-6 border-b border-[#E6D2B5]/30 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-[#B08D55]" />
            <h2 className="font-serif text-lg md:text-2xl text-[#43342E]">Configuration</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Save Button moved to Header for Mobile Optimization */}
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all shadow-md
                    ${isSaving
                  ? 'bg-[#E6D2B5] text-white cursor-wait'
                  : 'bg-[#43342E] text-[#F9F4EF] hover:bg-[#5D4B42]'
                }
                `}
            >
              {isSaving ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save Changes'}</span>
              <span className="md:hidden">{isSaving ? '...' : 'Save'}</span>
            </button>

            {/* Status Indicator inside header to save space */}
            {saveStatus && <span className="hidden md:flex items-center gap-1 text-green-600 text-[10px] uppercase font-bold animate-in fade-in"><CheckCircle size={12} /> Saved</span>}

            <button onClick={closePanel} className="text-[#8C7C72] hover:text-[#43342E] transition-colors p-2 hover:bg-gray-100 rounded-full bg-gray-50 md:bg-transparent">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Responsive Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

          {/* Responsive Sidebar (Horizontal Scroll on Mobile) */}
          <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#E6D2B5]/30 flex flex-row md:flex-col overflow-x-auto md:overflow-visible shrink-0 no-scrollbar">
            {[
              { id: 'guests', label: 'Guest List', shortLabel: 'Guests', icon: Users },
              { id: 'planner', label: 'Planner', shortLabel: 'Plan', icon: ClipboardList },
              { id: 'general', label: 'General', shortLabel: 'Gen', icon: Settings },
              { id: 'story', label: 'Our Story', shortLabel: 'Story', icon: Heart },
              { id: 'events', label: 'Events', shortLabel: 'Events', icon: Calendar },
              { id: 'rsvp', label: 'RSVP Config', shortLabel: 'RSVP', icon: Gift },
              { id: 'images', label: 'Images', shortLabel: 'Imgs', icon: ImageIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 md:px-8 py-3 md:py-4 text-left text-xs font-bold uppercase tracking-widest transition-all 
                  whitespace-nowrap flex items-center gap-2 md:gap-3
                  border-b-4 md:border-b-0 md:border-l-4
                  ${activeTab === tab.id
                    ? 'border-[#B08D55] bg-[#F9F4EF] text-[#43342E]'
                    : 'border-transparent text-[#8C7C72] hover:bg-gray-50'}
                `}
              >
                <tab.icon size={14} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
              </button>
            ))}

            <div className="p-4 md:mt-auto md:px-8 md:pb-4 min-w-[150px] md:min-w-0 flex items-center">
              <button
                onClick={handleResetRequest}
                className={`flex items-center gap-2 text-xs uppercase tracking-wider transition-all duration-300 w-full justify-center py-2 md:py-3 rounded-md ${resetConfirm
                    ? 'bg-red-50 text-red-600 font-bold border border-red-200'
                    : 'text-red-300 hover:text-red-500 hover:bg-red-50/50'
                  }`}
              >
                {resetConfirm ? <Trash2 size={14} className="animate-bounce" /> : <RefreshCw size={12} />}
                <span className="hidden md:inline">{resetConfirm ? "Confirm?" : "Reset Defaults"}</span>
                <span className="md:hidden">{resetConfirm ? "Confirm?" : "Reset"}</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#FAF9F6]">

            {/* --- GUEST LIST TAB --- */}
            {activeTab === 'guests' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#E6D2B5]/30 pb-4 gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#43342E] mb-2">Guest Management</h3>
                    <p className="text-xs text-[#8C7C72]">Track RSVPs and manage your guest list</p>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button onClick={downloadCSV} className="bg-[#43342E] text-white px-4 py-2 rounded-full text-xs uppercase font-bold flex items-center gap-2 hover:bg-[#5D4B42]">
                      <Download size={14} /> Export CSV
                    </button>
                    <div className="relative flex-1 md:w-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7C72]" size={14} />
                      <input
                        type="text"
                        placeholder="Search guests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] w-full md:w-64 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded border border-[#E6D2B5]/30 text-center">
                    <p className="text-[10px] uppercase font-bold text-[#8C7C72] mb-1">Total</p>
                    <p className="font-serif text-3xl text-[#43342E]">{stats.total}</p>
                  </div>
                  <div className="bg-white p-4 rounded border border-green-100 text-center">
                    <p className="text-[10px] uppercase font-bold text-green-600 mb-1">Attending</p>
                    <p className="font-serif text-3xl text-green-700">{stats.attending}</p>
                  </div>
                  <div className="bg-white p-4 rounded border border-amber-100 text-center">
                    <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">Pending</p>
                    <p className="font-serif text-3xl text-amber-700">{stats.pending}</p>
                  </div>
                  <div className="bg-white p-4 rounded border border-red-100 text-center">
                    <p className="text-[10px] uppercase font-bold text-red-600 mb-1">Declined</p>
                    <p className="font-serif text-3xl text-red-700">{stats.declined}</p>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded border border-[#E6D2B5]/30 overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-[#F9F4EF] text-[#B08D55] text-[10px] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Guests</th>
                        <th className="p-4">Info</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6D2B5]/20 text-sm text-[#43342E]">
                      {filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-[#8C7C72] italic">No guests found.</td>
                        </tr>
                      ) : (
                        filteredGuests.map((guest, idx) => (
                          <tr key={idx} className="hover:bg-[#FAF9F6]">
                            <td className="p-4 font-medium">{guest.name}</td>
                            <td className="p-4">
                              {guest.attending === 'yes' && <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold uppercase"><CheckCircle size={12} /> Attending</span>}
                              {guest.attending === 'no' && <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold uppercase"><X size={12} /> Declined</span>}
                              {guest.attending === 'undecided' && <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold uppercase"><AlertCircle size={12} /> Pending</span>}
                            </td>
                            <td className="p-4">{guest.guests}</td>
                            <td className="p-4 text-[#8C7C72]">
                              {guest.email && <div className="text-xs">{guest.email}</div>}
                              {guest.followUpDate && (
                                <div className="text-xs font-bold text-amber-600 mt-1">Follow Up: {guest.followUpDate}</div>
                              )}
                              <div className="flex gap-2 mt-1">
                                {guest.message && <span title={guest.message} className="text-blue-500 flex items-center gap-1"><MessageSquare size={12} /> Msg</span>}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <button onClick={() => deleteGuest(guest)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- PLANNER TAB --- */}
            {activeTab === 'planner' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-end border-b border-[#E6D2B5]/30 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#43342E] mb-2">Meeting Notes & Checklist</h3>
                    <p className="text-xs text-[#8C7C72]">Keep track of your planning to-dos</p>
                  </div>
                  <button onClick={addNote} className="bg-[#43342E] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#5D4B42]">
                    <Plus size={14} /> <span className="hidden md:inline">Add Note</span>
                  </button>
                </div>

                <div className="grid gap-4">
                  {config.notes?.map((note) => (
                    <div key={note.id} className={`bg-white p-4 rounded border flex items-start gap-4 transition-all ${note.completed ? 'opacity-60 border-green-100' : 'border-[#E6D2B5]/50'}`}>
                      <button
                        onClick={() => updateNote(note.id, 'completed', !note.completed)}
                        className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${note.completed ? 'bg-green-500 border-green-500 text-white' : 'border-[#E6D2B5] text-transparent hover:border-[#B08D55]'}`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </button>
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                          <input
                            type="text"
                            value={note.text}
                            onChange={(e) => updateNote(note.id, 'text', e.target.value)}
                            className={`w-full bg-transparent border-b border-transparent focus:border-[#B08D55] outline-none font-medium text-[#43342E] ${note.completed ? 'line-through text-[#8C7C72]' : ''}`}
                          />
                          <input
                            type="date"
                            value={note.date}
                            onChange={(e) => updateNote(note.id, 'date', e.target.value)}
                            className="text-xs text-[#8C7C72] bg-transparent outline-none md:text-right"
                          />
                        </div>
                        <textarea
                          placeholder="Add details..."
                          value={note.details || ''}
                          onChange={(e) => updateNote(note.id, 'details', e.target.value)}
                          className="w-full text-sm text-[#8C7C72] bg-transparent resize-none outline-none"
                          rows={1}
                        />
                      </div>
                      <button onClick={() => deleteNote(note.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0"><X size={16} /></button>
                    </div>
                  ))}
                  {(!config.notes || config.notes.length === 0) && (
                    <div className="text-center py-10 text-[#8C7C72] italic border border-dashed border-[#E6D2B5] rounded">
                      No notes yet. Click "Add Note" to start planning.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-8 animate-fade-in">
                <h3 className="font-serif text-lg text-[#43342E] border-b border-[#E6D2B5]/30 pb-2">Core Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Couple Names</label>
                    <input type="text" value={config.names} onChange={(e) => updateConfig('names', e.target.value)} className="admin-input" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Display Date</label>
                    <input type="text" value={config.dateString} onChange={(e) => updateConfig('dateString', e.target.value)} className="admin-input" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Countdown Date</label>
                    <input type="datetime-local" value={config.dateIso.substring(0, 16)} onChange={(e) => updateConfig('dateIso', e.target.value)} className="admin-input" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Location</label>
                    <input type="text" value={config.location} onChange={(e) => updateConfig('location', e.target.value)} className="admin-input" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Admin Passcode</label>
                    <input
                      type="password"
                      value={config.passcode}
                      onChange={(e) => updateConfig('passcode', e.target.value)}
                      className="admin-input font-mono"
                      placeholder="default: admin"
                    />
                  </div>
                </div>

                {/* Branding Section */}
                <div className="border-t border-[#E6D2B5]/30 pt-8 mt-4">
                  <h3 className="font-serif text-lg text-[#43342E] mb-6 flex items-center gap-2"><Type size={18} /> Branding & Logo</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Website Title (Browser Tab)</label>
                      <input type="text" value={config.websiteTitle || ''} onChange={(e) => updateConfig('websiteTitle', e.target.value)} className="admin-input" placeholder="e.g. Louie & Florie's Wedding" />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Logo Text (Nav Bar)</label>
                      <input type="text" value={config.logoText || ''} onChange={(e) => updateConfig('logoText', e.target.value)} className="admin-input" placeholder="Auto-generated if empty" />
                    </div>
                    <div className="group md:col-span-2">
                      <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Logo Image (Optional - overrides text)</label>
                      <div className="flex gap-4 items-center">
                        {config.logoImage && <img src={config.logoImage} alt="Logo Preview" className="h-10 w-auto border border-[#E6D2B5] p-1" />}
                        <div className="flex-1">
                          <label className="cursor-pointer bg-white border border-[#E6D2B5] text-[#43342E] px-4 py-2 text-xs uppercase font-bold hover:bg-[#FAF9F6] flex items-center justify-center gap-2">
                            <Upload size={14} /> Upload Logo Image
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'logoImage')} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E6D2B5]/30 pt-8 mt-4">
                  <h3 className="font-serif text-lg text-[#43342E] mb-6">Social & Contact Links</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Instagram URL</label>
                      <input type="text" value={config.instagram} onChange={(e) => updateConfig('instagram', e.target.value)} className="admin-input" placeholder="#" />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Facebook URL</label>
                      <input type="text" value={config.facebook} onChange={(e) => updateConfig('facebook', e.target.value)} className="admin-input" placeholder="#" />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Contact URL / Mailto</label>
                      <input type="text" value={config.contact} onChange={(e) => updateConfig('contact', e.target.value)} className="admin-input" placeholder="mailto:us@example.com" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'story' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center border-b border-[#E6D2B5]/30 pb-2">
                  <h3 className="font-serif text-lg text-[#43342E]">Our Journey Timeline</h3>
                  <div className="flex gap-4">
                    <div className="group">
                      <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Title</label>
                      <input type="text" value={config.storyTitle} onChange={(e) => updateConfig('storyTitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" />
                    </div>
                    <div className="group">
                      <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Subtitle</label>
                      <input type="text" value={config.storySubtitle} onChange={(e) => updateConfig('storySubtitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" />
                    </div>
                  </div>
                </div>

                {config.story?.map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative group transition-all hover:shadow-md">
                    <button
                      onClick={() => removeStoryItem(idx)}
                      className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid md:grid-cols-12 gap-4">
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Date</label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={(e) => updateStory(idx, 'date', e.target.value)}
                          className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                        />
                      </div>
                      <div className="md:col-span-9 pr-8">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateStory(idx, 'title', e.target.value)}
                          className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 font-serif text-lg mb-2"
                        />
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateStory(idx, 'description', e.target.value)}
                          className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm h-20"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addStoryItem} className="w-full py-4 border-2 border-dashed border-[#E6D2B5] text-[#B08D55] uppercase text-xs font-bold tracking-widest hover:bg-[#E6D2B5]/10 transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Timeline Milestone
                </button>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center border-b border-[#E6D2B5]/30 pb-2">
                  <h3 className="font-serif text-lg text-[#43342E]">Wedding Events</h3>
                  <div className="flex gap-4">
                    <div className="group">
                      <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Title</label>
                      <input type="text" value={config.eventsTitle} onChange={(e) => updateConfig('eventsTitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" />
                    </div>
                    <div className="group">
                      <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Subtitle</label>
                      <input type="text" value={config.eventsSubtitle} onChange={(e) => updateConfig('eventsSubtitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {config.events?.map((event, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50">
                      <div className="flex items-center gap-3 mb-4 text-[#B08D55]">
                        {idx === 0 && <Music size={20} />}
                        {idx === 1 && <Heart size={20} />}
                        {idx === 2 && <Clock size={20} />}
                        <span className="text-xs uppercase font-bold tracking-wider">Event {idx + 1}</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Event Title</label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => updateEvent(idx, 'title', e.target.value)}
                            className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 font-serif text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Time / Date</label>
                          <input
                            type="text"
                            value={event.time}
                            onChange={(e) => updateEvent(idx, 'time', e.target.value)}
                            className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm font-bold text-[#B08D55]"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Description</label>
                        <textarea
                          value={event.description}
                          onChange={(e) => updateEvent(idx, 'description', e.target.value)}
                          className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm h-16"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Location Name</label>
                          <input
                            type="text"
                            value={event.location}
                            onChange={(e) => updateEvent(idx, 'location', e.target.value)}
                            className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Map Link (URL)</label>
                          <input
                            type="text"
                            value={event.mapLink || ''}
                            onChange={(e) => updateEvent(idx, 'mapLink', e.target.value)}
                            placeholder="https://maps.google.com/..."
                            className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm text-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rsvp' && (
              <div className="space-y-10 animate-fade-in max-w-2xl">
                <h3 className="font-serif text-lg text-[#43342E] border-b border-[#E6D2B5]/30 pb-2">RSVP Settings</h3>
                <div>
                  <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-4">RSVP Mode Selection</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="admin-input"
                    />
                    <p className="text-xs text-[#8C7C72] mt-4 italic">Visitors will be redirected to this URL when clicking "RSVP".</p>
                  </div>
                )}

                <div className="border-t border-[#E6D2B5]/30 pt-8 mt-8">
                  <h4 className="font-serif text-md text-[#43342E] mb-4">Deadline Configuration</h4>
                  <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">RSVP Deadline Text</label>
                    <input
                      type="text"
                      value={config.rsvpDeadline}
                      onChange={(e) => updateConfig('rsvpDeadline', e.target.value)}
                      className="admin-input"
                      placeholder="e.g. May 1st, 2026"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-12 animate-fade-in">

                {/* Hero Section */}
                <div>
                  <h3 className="font-serif text-xl text-[#43342E] mb-6">Hero Background</h3>
                  <div className="relative group w-full h-64 overflow-hidden bg-gray-100 border border-[#E6D2B5] mb-4">
                    <img src={config.heroImage} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <label className="cursor-pointer bg-white/90 text-[#43342E] px-6 py-3 rounded-none uppercase tracking-widest text-xs font-bold hover:bg-white flex items-center gap-3 transition-transform transform group-hover:-translate-y-1">
                        <Upload size={16} /> Upload New
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'heroImage')} />
                      </label>
                    </div>
                  </div>
                  <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Or Paste URL (Persists on refresh)</label>
                  <input
                    type="text"
                    value={config.heroImage}
                    onChange={(e) => handleUrlChange(e.target.value, 'heroImage')}
                    className="admin-input"
                  />
                </div>

                {/* RSVP Image Section */}
                <div>
                  <h3 className="font-serif text-xl text-[#43342E] mb-6">RSVP Side Image</h3>
                  <div className="relative group w-full h-64 overflow-hidden bg-gray-100 border border-[#E6D2B5] mb-4">
                    <img src={config.rsvpImage} className="w-full h-full object-cover transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <label className="cursor-pointer bg-white/90 text-[#43342E] px-6 py-3 rounded-none uppercase tracking-widest text-xs font-bold hover:bg-white flex items-center gap-3 transition-transform transform group-hover:-translate-y-1">
                        <Upload size={16} /> Upload New
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'rsvpImage')} />
                      </label>
                    </div>
                  </div>
                  <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Or Paste URL</label>
                  <input
                    type="text"
                    value={config.rsvpImage}
                    onChange={(e) => handleUrlChange(e.target.value, 'rsvpImage')}
                    className="admin-input"
                  />
                </div>

                {/* Gallery Section */}
                <div>
                  <h3 className="font-serif text-xl text-[#43342E] mb-6">Gallery Collection</h3>
                  <p className="text-xs text-[#8C7C72] mb-6">Click image to upload, or paste URL below.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {config.galleryImages?.map((src, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="relative group cursor-pointer aspect-square bg-[#E6D2B5]/20 overflow-hidden border border-[#E6D2B5]/50">
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
                        <input
                          type="text"
                          value={src}
                          onChange={(e) => handleUrlChange(e.target.value, null, idx)}
                          className="admin-input p-2 text-[10px]"
                          placeholder="Image URL..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Removed Footer, logic moved to Header */}
      </div>
    </div>
  );
};


// --- Main App Component ---

// Default Configuration to fall back to
const defaultConfig = {
  names: "Louie & Florie",
  dateString: "July 4th, 2026",
  dateIso: "2026-07-04T00:00:00",
  location: "Cebu, Philippines",
  heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  rsvpMode: 'form',
  rsvpExternalLink: "https://forms.google.com/",
  rsvpDeadline: "May 1st, 2026",
  rsvpImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  instagram: "#",
  facebook: "#",
  contact: "#",
  logoText: "",
  websiteTitle: "",
  passcode: "admin",
  guestList: [],
  notes: [],
  storyTitle: "Our Journey",
  storySubtitle: "Since 2018",
  story: [
    { date: "June 15, 2018", title: "The Encounter", description: "We met at a coffee shop in downtown. It started with a spilled latte and ended with a conversation that lasted for hours." },
    { date: "December 24, 2022", title: "Building a Home", description: "After a year and a half of adventures, we moved in together. Our first apartment was small, but full of love (and plants)." },
    { date: "August 10, 2024", title: "The Promise", description: "On a sunset hike overlooking the ocean, Louie got down on one knee. It was the easiest question Florie ever had to answer." }
  ],
  eventsTitle: "The Celebration",
  eventsSubtitle: "Itinerary",
  events: [
    { title: "Welcome Party", time: "Friday, July 3 • 6:00 PM", description: "Join us for cocktails and hors d'oeuvres to kick off the celebration.", location: "The Gardens", mapLink: "https://maps.google.com" },
    { title: "The Ceremony", time: "Saturday, July 4 • 2:00 PM", description: "We exchange vows followed by dinner and dancing under the stars.", location: "St. Thérèse", mapLink: "https://maps.google.com" },
    { title: "Reception", time: "Saturday, July 4 • 6:00 PM", description: "Dinner, dancing, and drinks to celebrate the newlyweds.", location: "Reception Hall", mapLink: "https://maps.google.com" }
  ],
  galleryImages: [
    "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?auto=format&fit=crop&w=600&q=90",
    "https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&w=600&q=90",
    "https://images.unsplash.com/photo-1520854221256-17451cc330e7?auto=format&fit=crop&w=600&q=90",
    "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=90",
    "https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&w=600&q=90",
    "https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&w=600&q=90",
    "https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=90",
    "https://images.unsplash.com/photo-1607193384230-25e635834331?auto=format&fit=crop&w=600&q=90"
  ]
};

export default function App() {
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  const [rsvpForm, setRsvpForm] = useState({ name: '', email: '', guests: '1', attending: 'yes', followUpDate: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [loginError, setLoginError] = useState(false);

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPass, setAdminPass] = useState("");

  // 1. Auth Setup
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          // If a token is provided by environment, use it.
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
        if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
          alert("Setup Error: Please enable 'Anonymous' sign-in in your Firebase Console (Authentication > Sign-in method).");
        }
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Data Fetching
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'wedding', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig({ ...defaultConfig, ...docSnap.data() }); // Merge with defaults to handle new schema updates
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching config:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // Safety Timeout for loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
    }, 5000); // 5s timeout fallback
    return () => clearTimeout(timer);
  }, [loading]);

  // Preloader Timer
  useEffect(() => {
    setTimeout(() => setShowPreloader(false), 2500);
  }, []);

  // 3. Document Title
  useEffect(() => {
    if (config.websiteTitle) {
      document.title = config.websiteTitle;
    } else {
      document.title = `${config.names} - Wedding`;
    }
  }, [config.websiteTitle, config.names]);


  // Update local state (Admin Panel)
  const handleConfigUpdate = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Save Config to Firebase (Admin Panel)
  const handleSaveToDb = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'wedding', 'config'), config);
      // Simulate a small delay for UI feedback
      setTimeout(() => setIsSaving(false), 500);
    } catch (e) {
      console.error("Error saving config:", e);
      setIsSaving(false);
      alert("Failed to save. Please try again.");
    }
  };

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPass === config.passcode) {
      setShowAdminLogin(false);
      setShowAdminPanel(true);
      setAdminPass("");
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 500);
    }
  };

  // RSVP Submit (Direct DB Write)
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      // Append new guest to the config's guest list and save immediately
      const newGuest = { ...rsvpForm, timestamp: new Date().toISOString() };

      // Optimistic UI update
      const updatedGuestList = [...(config.guestList || []), newGuest];
      const newConfig = { ...config, guestList: updatedGuestList };
      setConfig(newConfig);

      await updateDoc(doc(db, 'wedding', 'config'), {
        guestList: arrayUnion(newGuest)
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      setRsvpForm({ name: '', email: '', guests: '1', attending: 'yes', followUpDate: '', message: '' });
    } catch (err) {
      console.error("RSVP Error:", err);
      // Fallback to setDoc if updateDoc fails (e.g. if doc doesn't exist yet)
      try {
        const newGuest = { ...rsvpForm, timestamp: new Date().toISOString() };
        const updatedGuestList = [...(config.guestList || []), newGuest];
        const newConfig = { ...config, guestList: updatedGuestList };
        await setDoc(doc(db, 'wedding', 'config'), newConfig);
        setIsSubmitting(false);
        setIsSubmitted(true);
        setRsvpForm({ name: '', email: '', guests: '1', attending: 'yes', followUpDate: '', message: '' });
      } catch (retryErr) {
        alert("Something went wrong. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#43342E] font-sans selection:bg-[#C5A059] selection:text-white relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@200;300;400;500&family=Great+Vibes&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Montserrat', sans-serif; }
        h1, h2, h3, h4, .font-serif { font-family: 'Playfair Display', serif; }
        .font-script { font-family: 'Great Vibes', cursive; }
        .admin-input { width: 100%; padding: 0.75rem; background: white; border: 1px solid #E6D2B5; color: #43342E; outline: none; transition: all 0.2s; }
        .admin-input:focus { border-color: #B08D55; ring: 2px solid #B08D55; }
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-slow-zoom { animation: slow-zoom 20s infinite alternate ease-in-out; }
        .animate-float { animation: float 3s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
        .confetti-piece { position: absolute; width: 8px; height: 16px; background: #ffd300; top: 0; opacity: 0; animation: confetti-fall 3s linear infinite; }
        @keyframes confetti-fall {
          0% { top: -10%; transform: rotate(0deg) translateX(0); opacity: 1; }
          100% { top: 100%; transform: rotate(360deg) translateX(50px); opacity: 0; }
        }
        .confetti-0 { animation-delay: 0s; animation-duration: 2.5s; }
        .confetti-1 { animation-delay: 1s; animation-duration: 3s; }
        .confetti-2 { animation-delay: 0.5s; animation-duration: 2.8s; }
        .confetti-3 { animation-delay: 1.5s; animation-duration: 3.2s; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Preloader */}
      {(loading || showPreloader) && <Preloader fadeOut={!loading && !showPreloader} />}

      <NoiseOverlay />
      <AmbientGlow />
      <CircularScroll />
      <Lightbox src={lightboxImg} onClose={() => setLightboxImg(null)} />

      {/* Admin Modals */}
      {showAdminPanel && (
        <AdminPanel
          config={config}
          updateConfig={handleConfigUpdate}
          onSave={handleSaveToDb}
          resetConfig={() => {
            if (confirm("Are you sure? This will overwrite the live database with defaults.")) {
              setConfig(defaultConfig);
              handleSaveToDb(); // Save defaults to DB
            }
          }}
          closePanel={() => setShowAdminPanel(false)}
          isSaving={isSaving}
        />
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[70] bg-[#1F1815]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white p-10 max-w-sm w-full text-center shadow-2xl border-t-4 border-[#B08D55] animate-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-4">
              <ShieldAlert size={48} className="text-[#B08D55]" strokeWidth={1} />
            </div>
            <h3 className="font-serif text-3xl mb-2 text-[#43342E]">Planner Access</h3>
            <p className="text-[#8C7C72] text-xs uppercase tracking-widest mb-8">Restricted Area</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="••••••"
                className={`w-full border-b p-3 text-center tracking-[0.5em] text-xl focus:outline-none mb-8 transition-colors ${loginError ? 'border-red-500 text-red-500 animate-shake placeholder-red-300' : 'border-[#E6D2B5] focus:border-[#43342E] text-[#43342E]'}`}
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                autoFocus
              />
              {loginError && <p className="text-red-500 text-xs mb-4 font-bold uppercase tracking-wide">Access Denied</p>}
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-[#43342E] text-white py-3 uppercase text-xs font-bold tracking-widest hover:bg-[#5D4B42] transition-colors">Enter</button>
                <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 bg-transparent text-[#8C7C72] py-3 uppercase text-xs font-bold tracking-widest hover:text-[#43342E] transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navigation coupleName={config.names} logoText={config.logoText} logoImage={config.logoImage} />

      {/* Hero Section */}
      <section id="home" className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={config.heroImage}
            alt="Wedding Background"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-[#1F1815]/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <ScrollReveal variant="up" delay={200}>
            <h3 className="text-xl md:text-3xl font-script mb-6 text-[#E6D2B5] opacity-90 drop-shadow-lg tracking-wider">The Wedding Of</h3>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={400}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] via-[#F2E8DC] to-[#DBC1A7]">
              {config.names}
            </h1>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={600}>
            <div className="flex items-center justify-center gap-6 text-lg md:text-2xl font-light italic mb-12 text-[#F2E8DC]">
              <span>{config.dateString}</span>
              <span className="text-[10px] align-middle text-[#B08D55]">✦</span>
              <span>{config.location}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={800}>
            <Countdown targetDate={config.dateIso} />
          </ScrollReveal>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float opacity-80 hover:opacity-100 transition-opacity">
            <a href="#story" className="text-[#F9F4EF] hover:text-[#C5A059] transition-colors flex flex-col items-center gap-2 group">
              <span className="text-[10px] uppercase tracking-[0.3em] font-light group-hover:tracking-[0.4em] transition-all">Scroll</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#F9F4EF] to-transparent"></div>
            </a>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-20 md:py-32 px-4 bg-transparent relative z-10">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <SectionHeading title={config.storyTitle} subtitle={config.storySubtitle} />
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-transparent via-[#E6D2B5]/50 to-transparent hidden md:block"></div>

            {config.story?.map((item, index) => (
              <TimelineItem
                key={index}
                date={item.date}
                title={item.title}
                description={item.description}
                side={index % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Divider */}
      <div className="h-[60vh] relative bg-fixed bg-center bg-cover flex items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511285560982-1356c11d4606?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-[#43342E]/60 mix-blend-multiply"></div>
        <div className="relative z-10 text-center text-[#F9F4EF] px-6 max-w-5xl mx-auto py-16 backdrop-blur-[2px] border-y border-[#F9F4EF]/20">
          <ScrollReveal variant="zoom">
            <h2 className="font-serif text-4xl md:text-6xl italic font-light tracking-wide leading-tight">"And so the adventure begins"</h2>
          </ScrollReveal>
        </div>
      </div>

      {/* Events Section */}
      <section id="events" className="py-20 md:py-32 px-4 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <SectionHeading title={config.eventsTitle} subtitle={config.eventsSubtitle} />
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-10">
            {config.events?.map((event, idx) => (
              <ScrollReveal key={idx} delay={200 * (idx + 1)} variant="up" className="h-full">
                <div className="bg-white/80 backdrop-blur-sm p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 text-center h-full group border-b-4 border-transparent hover:border-[#DBC1A7] hover:-translate-y-2 rounded-sm">
                  <div className="mb-8">
                    <span className="inline-block p-4 bg-[#F5F0E6] rounded-full text-[#B08D55] group-hover:bg-[#43342E] group-hover:text-[#F9F4EF] transition-colors duration-500 shadow-md">
                      {idx === 0 && <Music size={24} strokeWidth={1.5} />}
                      {idx === 1 && <Heart size={24} strokeWidth={1.5} />}
                      {idx === 2 && <Clock size={24} strokeWidth={1.5} />}
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl text-[#43342E] mb-3">{event.title}</h3>
                  <p className="text-[#B08D55] font-bold text-[11px] tracking-[0.2em] mb-6 uppercase">{event.time}</p>
                  <p className="text-[#786C61] mb-10 font-light text-sm leading-relaxed">{event.description}</p>

                  <a
                    href={event.mapLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-[#8C7C72] text-[10px] uppercase tracking-[0.2em] border border-[#E6D2B5] px-6 py-2 rounded-full hover:bg-[#E6D2B5] hover:text-white transition-all duration-300 gap-2 group/link"
                  >
                    <MapPin size={12} className="group-hover/link:animate-bounce" />
                    <span>{event.location}</span>
                    <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity -ml-1" />
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section id="gallery" className="py-20 md:py-32 bg-white relative z-10">
        <ScrollReveal>
          <SectionHeading title="Captured Moments" subtitle="Gallery" />
        </ScrollReveal>

        <div className="columns-2 md:columns-4 gap-4 px-4 max-w-[1600px] mx-auto space-y-4">
          {config.galleryImages?.map((src, i) => (
            <ScrollReveal key={i} delay={i * 50} variant="up">
              <div
                className="overflow-hidden group cursor-pointer relative bg-gray-100 rounded-sm break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-500"
                onClick={() => setLightboxImg(src)}
              >
                <img
                  src={src}
                  alt={`Gallery ${i}`}
                  className="w-full h-auto object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110 filter grayscale-[10%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-[#1F1815]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[1px]">
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
      <section id="rsvp" className="py-20 md:py-32 px-4 bg-[#F5F0E6] relative z-10">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in-up">

          {/* Left Side Image */}
          <div className="hidden md:block w-5/12 relative bg-[#1F1815]">
            <img
              src={config.rsvpImage}
              className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[20s]"
              alt="Flowers"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              <div className="border border-[#DBC1A7]/30 p-8 w-full h-full flex flex-col items-center justify-center text-center backdrop-blur-md bg-black/20">
                <h3 className="text-[#DBC1A7] font-serif text-5xl mb-6 drop-shadow-md">R S V P</h3>
                <div className="w-8 h-[1px] bg-[#DBC1A7]/80 mb-6 mx-auto"></div>
                <p className="text-[#E6D2B5] text-[10px] uppercase tracking-[0.3em] leading-loose drop-shadow-sm">Kindly Respond By<br /><span className="text-white text-sm font-semibold mt-2 block">{config.rsvpDeadline}</span></p>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="w-full md:w-7/12 p-8 md:p-20 bg-[#FDFBF7] flex flex-col justify-center relative">

            {/* Decorative corners */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#DBC1A7]"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#DBC1A7]"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#DBC1A7]"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#DBC1A7]"></div>

            {config.rsvpMode === 'link' ? (
              <div className="text-center animate-fade-in py-10">
                <div className="w-20 h-20 bg-[#F5F0E6] rounded-full flex items-center justify-center mx-auto mb-8 text-[#B08D55] shadow-inner">
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
                  className="group inline-flex items-center gap-3 min-w-[200px] bg-[#43342E] text-[#F9F4EF] py-4 px-8 text-xs font-bold tracking-[0.25em] hover:bg-[#5D4B42] transition-all duration-300 shadow-lg hover:shadow-xl uppercase cursor-pointer decoration-0 justify-center"
                >
                  <span>RSVP Now</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <p className="text-[10px] text-[#B08D55] mt-8 uppercase tracking-widest opacity-60">Opens in a new tab</p>
              </div>
            ) : (
              !isSubmitted ? (
                <>
                  <h2 className="font-serif text-3xl md:text-4xl mb-3 text-[#43342E] text-center md:text-left">Will you join us?</h2>
                  <p className="text-[#8C7C72] mb-8 md:mb-12 font-light text-sm italic text-center md:text-left">We would be honored by your presence.</p>

                  <form onSubmit={handleRsvpSubmit} className="space-y-6 md:space-y-8">
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

                    {/* Conditionally Render Email and Follow Up Date if 'undecided' */}
                    <div className={`transition-all duration-500 overflow-hidden ${rsvpForm.attending === 'undecided' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="group relative mb-8">
                        <input
                          type="email"
                          name="email"
                          className="w-full border-b border-[#DBC1A7] py-3 focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer"
                          placeholder="Email Address"
                          value={rsvpForm.email}
                          required={rsvpForm.attending === 'undecided'}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                        />
                        <label className="absolute left-0 -top-3 text-[10px] text-[#B08D55] uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#B08D55]">Email Address</label>
                      </div>

                      <div className="group relative">
                        <input
                          type="date"
                          name="followUpDate"
                          className="w-full border-b border-[#DBC1A7] py-3 focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer"
                          placeholder="Follow Up Date"
                          value={rsvpForm.followUpDate}
                          required={rsvpForm.attending === 'undecided'}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, followUpDate: e.target.value })}
                        />
                        <label className="absolute left-0 -top-3 text-[10px] text-[#B08D55] uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#B08D55]">Follow-up Date</label>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 pt-2">
                      <div className="w-full md:w-1/2">
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
                      <div className="w-full md:w-1/2">
                        <label className="block text-[10px] font-bold text-[#B08D55] mb-2 uppercase tracking-widest">Attending</label>
                        <select
                          name="attending"
                          className="w-full border-b border-[#DBC1A7] py-2 focus:outline-none focus:border-[#43342E] bg-transparent text-[#43342E]"
                          value={rsvpForm.attending}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}
                        >
                          <option value="yes">Joyfully Accept</option>
                          <option value="undecided">Still Deciding</option>
                          <option value="no">Regretfully Decline</option>
                        </select>
                      </div>
                    </div>

                    <div className="group relative mt-6">
                      <textarea
                        name="message"
                        className="w-full border-b border-[#DBC1A7] py-3 focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer resize-none"
                        placeholder="Message to the Couple"
                        rows="2"
                        value={rsvpForm.message}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                      />
                      <label className="absolute left-0 -top-3 text-[10px] text-[#B08D55] uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#B08D55]">Message to the Couple</label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#43342E] text-[#F9F4EF] py-4 mt-8 text-xs font-bold tracking-[0.25em] hover:bg-[#5D4B42] transition-all duration-300 shadow-md hover:shadow-lg uppercase disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={16} className="animate-spin mr-3" />
                          Processing
                        </>
                      ) : <span className="flex items-center gap-2">Confirm Attendance <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>}
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-10 relative overflow-hidden">
                  {/* Confetti Animation */}
                  <Confetti />
                  <div className="w-20 h-20 border border-[#B08D55] rounded-full flex items-center justify-center text-[#B08D55] mb-8 relative z-10 bg-white">
                    <Check size={40} strokeWidth={1} />
                  </div>
                  <h2 className="font-serif text-4xl mb-4 text-[#43342E] relative z-10">Thank You</h2>
                  <p className="text-[#8C7C72] mb-8 font-light italic relative z-10">Your response has been successfully recorded.</p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-[#B08D55] text-[10px] uppercase tracking-[0.2em] border-b border-[#B08D55] pb-1 hover:text-[#43342E] hover:border-[#43342E] transition-colors relative z-10"
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
            <a href={config.instagram} className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors">Instagram</a>
            <a href={config.facebook} className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors">Facebook</a>
            <a href={config.contact} className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors">Contact</a>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 border-t border-[#43342E]/50 pt-10 mt-6 max-w-xs mx-auto">
            <p className="text-[10px] font-light tracking-widest text-[#5D4B42]">
              EST. 2026 • CEBU PHILIPPINES
            </p>
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-[9px] text-[#43342E] hover:text-[#B08D55] transition-colors uppercase tracking-widest font-bold flex items-center gap-1 opacity-50 hover:opacity-100"
            >
              <Lock size={10} /> Admin Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}