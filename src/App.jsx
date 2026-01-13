import React, { useState, useEffect } from 'react';
// 1. Toast & Icons
import { Toaster, toast } from 'react-hot-toast';
import { Heart, Clock, Music, Check, Loader, Lock, ArrowRight, ExternalLink, ZoomIn, ShieldAlert, MapPin, Gift, CalendarPlus } from 'lucide-react';

// 2. Firebase Imports
import { signInWithEmailAndPassword, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// 3. Local Imports
import { auth, db } from './config/firebase';
import { defaultConfig } from './config/defaultConfig';
import AdminPanel from './components/AdminPanel';
import {
  NoiseOverlay, AmbientGlow, Preloader, CircularScroll, Confetti,
  ScrollReveal, Lightbox, Countdown, Navigation, SectionHeading, TimelineItem
} from './components/Shared';

export default function App() {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // RSVP State
  const [rsvpForm, setRsvpForm] = useState({ name: '', email: '', guests: '1', attending: 'yes', followUpDate: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI State
  const [lightboxImg, setLightboxImg] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPass, setAdminPass] = useState("");

  // --- EFFECTS ---

  // 1. Auth Init
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Data Sync
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'wedding', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig({ ...defaultConfig, ...docSnap.data() });
      }
      setLoading(false);
    }, (error) => { console.error(error); setLoading(false); });
    return () => unsubscribe();
  }, [user]);

  // 3. Preloader Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
      if (!heroLoaded) setHeroLoaded(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading, heroLoaded]);

  // 4. Hero Image Preload
  useEffect(() => {
    const img = new Image();
    img.src = config.heroImage;
    img.onload = () => setHeroLoaded(true);
    img.onerror = () => setHeroLoaded(true);
  }, [config.heroImage]);

  // 5. Dynamic Browser Styling (Title, Favicon, Theme Color from Admin)
  useEffect(() => {
    // A. Set Title
    document.title = config.websiteTitle || `${config.names} - Wedding`;

    // B. Set Favicon (Checks if you have a faviconUrl in config)
    if (config.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = config.faviconUrl;
    }

    // C. Set Mobile Browser Theme Color (Address bar color)
    if (config.themeColor) {
      let metaTheme = document.querySelector("meta[name='theme-color']");
      if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.name = 'theme-color';
        document.getElementsByTagName('head')[0].appendChild(metaTheme);
      }
      metaTheme.content = config.themeColor;
    }
  }, [config.websiteTitle, config.names, config.faviconUrl, config.themeColor]);


  // --- HANDLERS ---

  const handleConfigUpdate = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveToDb = async () => {
    if (!user) return;
    setIsSaving(true);
    return setDoc(doc(db, 'wedding', 'config'), config)
      .then(() => {
        setIsSaving(false);
      })
      .catch((e) => {
        console.error("Error saving config:", e);
        setIsSaving(false);
        throw e;
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const adminEmail = "admin@louie.com"; // Ensure this matches your Firebase Auth

    signInWithEmailAndPassword(auth, adminEmail, adminPass)
      .then(() => {
        setShowAdminLogin(false);
        setShowAdminPanel(true);
        setAdminPass("");
        setLoginError(false);
        toast.success("Welcome back!");
      })
      .catch((error) => {
        console.error("Login Failed", error);
        setLoginError(true);
        toast.error("Invalid credentials");
        setTimeout(() => setLoginError(false), 500);
      });
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      const newGuest = { ...rsvpForm, timestamp: new Date().toISOString() };

      // Optimistic UI update
      const updatedGuestList = [...(config.guestList || []), newGuest];
      const newConfig = { ...config, guestList: updatedGuestList };
      setConfig(newConfig);

      await updateDoc(doc(db, 'wedding', 'config'), { guestList: arrayUnion(newGuest) });

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("RSVP Sent Successfully!");
      // Reset sensitive fields
      setRsvpForm(prev => ({ ...prev, message: '' }));
    } catch (err) {
      try {
        const newGuest = { ...rsvpForm, timestamp: new Date().toISOString() };
        const updatedGuestList = [...(config.guestList || []), newGuest];
        const newConfig = { ...config, guestList: updatedGuestList };
        await setDoc(doc(db, 'wedding', 'config'), newConfig);
        setIsSubmitting(false);
        setIsSubmitted(true);
        toast.success("RSVP Sent Successfully!");
      } catch (retryErr) {
        toast.error("Connection error. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`${config.names} Wedding`);
    const details = encodeURIComponent(`Wedding celebration at ${config.location}`);
    const location = encodeURIComponent(config.location);
    const start = (config.dateIso || '').replace(/[-:]/g, '').split('.')[0];
    const endDateObj = new Date(new Date(config.dateIso).getTime() + 6 * 60 * 60 * 1000);
    const end = endDateObj.toISOString().replace(/[-:]/g, '').split('.')[0];
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  const handleScrollClick = (e) => {
    e.preventDefault();
    document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#43342E] font-sans selection:bg-[#C5A059] selection:text-white relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@200;300;400;500&family=Great+Vibes&display=swap');
        html { scroll-behavior: smooth; }
        body { font-family: 'Montserrat', sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4, .font-serif { font-family: 'Playfair Display', serif; }
        .font-script { font-family: 'Great Vibes', cursive; }
        
        /* Mobile Input Fix: Prevent iOS Zoom */
        @media screen and (max-width: 768px) {
          input, select, textarea { font-size: 16px !important; }
        }
        
        input[type="date"] {
            -webkit-appearance: none;
            min-height: 52px; /* Large touch target */
            background-color: transparent;
        }

        .admin-input { width: 100%; padding: 0.75rem; background: white; border: 1px solid #E6D2B5; color: #43342E; outline: none; transition: all 0.2s; }
        .admin-input:focus { border-color: #B08D55; ring: 2px solid #B08D55; }
        
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-slow-zoom { animation: slow-zoom 20s infinite alternate ease-in-out; }
        .animate-float { animation: float 3s infinite ease-in-out; }
        
        .confetti-piece { position: absolute; width: 8px; height: 16px; background: #ffd300; top: 0; opacity: 0; animation: confetti-fall 3s linear infinite; }
        @keyframes confetti-fall { 0% { top: -10%; transform: rotate(0deg) translateX(0); opacity: 1; } 100% { top: 100%; transform: rotate(360deg) translateX(50px); opacity: 0; } }
        
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Toaster position="top-right" toastOptions={{ style: { background: '#43342E', color: '#F9F4EF' } }} />

      <Preloader fadeOut={!loading && heroLoaded} />
      <NoiseOverlay />
      <AmbientGlow />
      <CircularScroll />
      <Lightbox src={lightboxImg} onClose={() => setLightboxImg(null)} />

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel
          config={config}
          updateConfig={handleConfigUpdate}
          onSave={handleSaveToDb}
          resetConfig={() => {
            if (confirm("Are you sure? This will overwrite the live database with defaults.")) {
              setConfig(defaultConfig);
              handleSaveToDb();
            }
          }}
          closePanel={() => setShowAdminPanel(false)}
          isSaving={isSaving}
        />
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[70] bg-[#1F1815]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white p-8 md:p-10 max-w-sm w-full text-center shadow-2xl border-t-4 border-[#B08D55] animate-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-4"><ShieldAlert size={48} className="text-[#B08D55]" strokeWidth={1} /></div>
            <h3 className="font-serif text-3xl mb-2 text-[#43342E]">Planner Access</h3>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Password"
                className={`w-full border-b p-3 text-center tracking-[0.2em] text-xl focus:outline-none mb-8 transition-colors ${loginError ? 'border-red-500 text-red-500 animate-shake placeholder-red-300' : 'border-[#E6D2B5] focus:border-[#43342E] text-[#43342E]'}`}
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                autoFocus
              />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-[#43342E] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[#5D4B42] active:scale-95 transition-all">Enter</button>
                <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 bg-transparent text-[#8C7C72] py-4 uppercase text-xs font-bold tracking-widest hover:text-[#43342E] transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pass Nav props clearly */}
      <Navigation coupleName={config.names} logoText={config.logoText} logoImage={config.logoImage} />

      {/* Hero Section */}
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
            <a href="#story" onClick={handleScrollClick} className="text-[#F9F4EF] hover:text-[#C5A059] transition-colors flex flex-col items-center gap-2 group p-4 min-w-[60px]">
              <span className="text-[10px] uppercase tracking-[0.3em] font-light group-hover:tracking-[0.4em] transition-all">Scroll</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#F9F4EF] to-transparent"></div>
            </a>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
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

      {/* Parallax Divider */}
      <div className="h-[60vh] relative bg-fixed bg-center bg-cover flex items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511285560982-1356c11d4606?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-[#43342E]/60 mix-blend-multiply"></div>
        <div className="relative z-10 text-center text-[#F9F4EF] px-6 max-w-5xl mx-auto py-16 backdrop-blur-[2px] border-y border-[#F9F4EF]/20">
          <ScrollReveal variant="zoom"><h2 className="font-serif text-3xl md:text-6xl italic font-light tracking-wide leading-tight">"And so the adventure begins"</h2></ScrollReveal>
        </div>
      </div>

      {/* Events Section */}
      <section id="events" className="py-20 md:py-32 px-4 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal><SectionHeading title={config.eventsTitle} subtitle={config.eventsSubtitle} /></ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {config.events?.map((event, idx) => (
              <ScrollReveal key={idx} delay={200 * (idx + 1)} variant="up" className="h-full">
                <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] text-center h-full group border-b-4 border-transparent hover:border-[#DBC1A7] transition-all duration-300 rounded-sm active:bg-[#F5F0E6]">
                  <div className="mb-8">
                    <span className="inline-block p-4 bg-[#F5F0E6] rounded-full text-[#B08D55] group-hover:bg-[#43342E] group-hover:text-[#F9F4EF] transition-colors duration-500 shadow-md">
                      {idx === 0 && <Music size={24} strokeWidth={1.5} />}
                      {idx === 1 && <Heart size={24} strokeWidth={1.5} />}
                      {idx === 2 && <Clock size={24} strokeWidth={1.5} />}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#43342E] mb-3">{event.title}</h3>
                  <p className="text-[#B08D55] font-bold text-[11px] tracking-[0.2em] mb-6 uppercase">{event.time}</p>
                  <p className="text-[#786C61] mb-10 font-light text-sm leading-relaxed">{event.description}</p>
                  <a href={event.mapLink || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center text-[#8C7C72] text-[10px] uppercase tracking-[0.2em] border border-[#E6D2B5] px-6 py-3 rounded-full hover:bg-[#E6D2B5] hover:text-white transition-all duration-300 gap-2 group/link min-h-[44px]">
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
        <ScrollReveal><SectionHeading title="Captured Moments" subtitle="Gallery" /></ScrollReveal>
        <div className="columns-2 md:columns-4 gap-4 px-4 max-w-[1600px] mx-auto space-y-4">
          {config.galleryImages?.map((src, i) => (
            <ScrollReveal key={i} delay={i * 50} variant="up">
              <div className="overflow-hidden group cursor-pointer relative bg-gray-100 rounded-sm break-inside-avoid shadow-sm active:opacity-90 transition-all duration-300" onClick={() => setLightboxImg(src)}>
                <img src={src} loading="lazy" alt={`Gallery ${i}`} className="w-full h-auto object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110 md:filter md:grayscale-[10%] group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-[#1F1815]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-white flex flex-col items-center"><ZoomIn size={32} strokeWidth={1} className="mb-2" /><span className="text-[10px] uppercase tracking-[0.3em]">View</span></div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 md:py-32 px-4 bg-[#F5F0E6] relative z-10">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in-up">
          <div className="hidden md:block w-5/12 relative bg-[#1F1815]">
            <img src={config.rsvpImage} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[20s]" alt="Flowers" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
              <div className="border border-[#DBC1A7]/30 p-8 w-full h-full flex flex-col items-center justify-center text-center backdrop-blur-md bg-black/20">
                <h3 className="text-[#DBC1A7] font-serif text-5xl mb-6 drop-shadow-md">R S V P</h3>
                <div className="w-8 h-[1px] bg-[#DBC1A7]/80 mb-6 mx-auto"></div>
                <p className="text-[#E6D2B5] text-[10px] uppercase tracking-[0.3em] leading-loose drop-shadow-sm">Kindly Respond By<br /><span className="text-white text-sm font-semibold mt-2 block">{config.rsvpDeadline}</span></p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-7/12 p-6 md:p-20 bg-[#FDFBF7] flex flex-col justify-center relative">
            <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#DBC1A7]"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#DBC1A7]"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#DBC1A7]"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#DBC1A7]"></div>

            {config.rsvpMode === 'link' ? (
              <div className="text-center animate-fade-in py-10">
                <div className="w-20 h-20 bg-[#F5F0E6] rounded-full flex items-center justify-center mx-auto mb-8 text-[#B08D55] shadow-inner"><Gift size={32} strokeWidth={1} /></div>
                <h2 className="font-serif text-4xl mb-6 text-[#43342E]">Will You Join Us?</h2>
                <p className="text-[#8C7C72] mb-12 font-light text-sm leading-relaxed px-8">We are managing our guest list through an external service. Please click the button below to confirm your attendance.</p>
                <a href={config.rsvpExternalLink} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 min-w-[200px] bg-[#43342E] text-[#F9F4EF] py-4 px-8 text-xs font-bold tracking-[0.25em] hover:bg-[#5D4B42] transition-all duration-300 shadow-lg hover:shadow-xl uppercase cursor-pointer decoration-0 justify-center min-h-[50px] active:scale-95"><span>RSVP Now</span><ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></a>
                <p className="text-[10px] text-[#B08D55] mt-8 uppercase tracking-widest opacity-60">Opens in a new tab</p>
              </div>
            ) : (
              !isSubmitted ? (
                <>
                  <h2 className="font-serif text-3xl md:text-4xl mb-3 text-[#43342E] text-center md:text-left">Will you join us?</h2>
                  <p className="text-[#8C7C72] mb-8 md:mb-12 font-light text-sm italic text-center md:text-left">We would be honored by your presence.</p>

                  <form onSubmit={handleRsvpSubmit} className="space-y-6 md:space-y-8">
                    {/* Input: text-base prevents iOS zoom. p-3 increases tap target */}
                    <div className="group relative">
                      <input required type="text" name="name" className="w-full border-b border-[#DBC1A7] py-3 text-base focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer rounded-none" placeholder="Full Name" value={rsvpForm.name} onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })} />
                      <label className="absolute left-0 -top-3 text-[10px] text-[#B08D55] uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#B08D55]">Full Name</label>
                    </div>

                    <div className={`transition-all duration-500 overflow-hidden ${rsvpForm.attending === 'undecided' ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="group relative mb-8">
                        <input type="email" name="email" className="w-full border-b border-[#DBC1A7] py-3 text-base focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer rounded-none" placeholder="Email Address" value={rsvpForm.email} required={rsvpForm.attending === 'undecided'} onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })} />
                        <label className="absolute left-0 -top-3 text-[10px] text-[#B08D55] uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#B08D55]">Email Address</label>
                      </div>
                      <div className="group relative">
                        <input type="date" name="followUpDate" className="w-full border-b border-[#DBC1A7] py-3 text-base focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer rounded-none" placeholder="Follow Up Date" value={rsvpForm.followUpDate} required={rsvpForm.attending === 'undecided'} onChange={(e) => setRsvpForm({ ...rsvpForm, followUpDate: e.target.value })} />
                        <label className="absolute left-0 -top-3 text-[10px] text-[#B08D55] uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#B08D55]">Follow-up Date</label>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 pt-2">
                      <div className="w-full md:w-1/2">
                        <label className="block text-[10px] font-bold text-[#B08D55] mb-2 uppercase tracking-widest">Guests</label>
                        <select name="guests" className="w-full border-b border-[#DBC1A7] py-3 text-base focus:outline-none focus:border-[#43342E] bg-transparent text-[#43342E] rounded-none" value={rsvpForm.guests} onChange={(e) => setRsvpForm({ ...rsvpForm, guests: e.target.value })}>
                          <option value="1">1 Person</option><option value="2">2 People</option><option value="3">3 People</option><option value="4">4 People</option>
                        </select>
                      </div>
                      <div className="w-full md:w-1/2">
                        <label className="block text-[10px] font-bold text-[#B08D55] mb-2 uppercase tracking-widest">Attending</label>
                        <select name="attending" className="w-full border-b border-[#DBC1A7] py-3 text-base focus:outline-none focus:border-[#43342E] bg-transparent text-[#43342E] rounded-none" value={rsvpForm.attending} onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}>
                          <option value="yes">Joyfully Accept</option><option value="undecided">Still Deciding</option><option value="no">Regretfully Decline</option>
                        </select>
                      </div>
                    </div>
                    <div className="group relative mt-6">
                      <textarea name="message" className="w-full border-b border-[#DBC1A7] py-3 text-base focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer resize-none rounded-none" placeholder="Message to the Couple" rows="2" value={rsvpForm.message} onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })} />
                      <label className="absolute left-0 -top-3 text-[10px] text-[#B08D55] uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#B08D55]">Message to the Couple</label>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#43342E] text-[#F9F4EF] py-4 mt-8 text-xs font-bold tracking-[0.25em] hover:bg-[#5D4B42] active:scale-95 touch-manipulation transition-all duration-300 shadow-md hover:shadow-lg uppercase disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group">
                      {isSubmitting ? <><Loader size={16} className="animate-spin mr-3" />Processing</> : <span className="flex items-center gap-2">Confirm Attendance <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>}
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-10 relative overflow-hidden">
                  <Confetti />
                  <div className="w-20 h-20 border border-[#B08D55] rounded-full flex items-center justify-center text-[#B08D55] mb-8 relative z-10 bg-white"><Check size={40} strokeWidth={1} /></div>
                  <h2 className="font-serif text-4xl mb-4 text-[#43342E] relative z-10">Thank You</h2>
                  <p className="text-[#8C7C72] mb-6 font-light italic relative z-10">Your response has been successfully recorded.</p>

                  {/* ADD TO CALENDAR (Only if Attending) */}
                  {rsvpForm.attending === 'yes' && (
                    <a href={getGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="relative z-10 flex items-center gap-2 text-[#43342E] border border-[#43342E] px-6 py-4 rounded-full uppercase text-[10px] font-bold tracking-widest hover:bg-[#43342E] hover:text-white transition-all mb-4 min-h-[44px]">
                      <CalendarPlus size={14} /> Add to Calendar
                    </a>
                  )}

                  <button onClick={() => setIsSubmitted(false)} className="mt-4 text-[#B08D55] text-[10px] uppercase tracking-[0.2em] border-b border-[#B08D55] pb-1 hover:text-[#43342E] hover:border-[#43342E] transition-colors relative z-10 p-2">Submit another response</button>
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
            <a href={config.instagram} className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors p-2">Instagram</a>
            <a href={config.facebook} className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors p-2">Facebook</a>
            <a href={config.contact} className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors p-2">Contact</a>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 border-t border-[#43342E]/50 pt-10 mt-6 max-w-xs mx-auto">
            <p className="text-[10px] font-light tracking-widest text-[#5D4B42]">EST. 2026 • CEBU PHILIPPINES</p>
            {/* Increased touch target for Admin Access */}
            <button onClick={() => setShowAdminLogin(true)} className="text-[9px] text-[#43342E] hover:text-[#B08D55] transition-colors uppercase tracking-widest font-bold flex items-center gap-2 opacity-50 hover:opacity-100 p-4">
              <Lock size={10} /> Admin Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}