import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Local Imports
import { auth, db } from './config/firebase';
import { defaultConfig } from './config/defaultConfig';
import AdminPanel from './components/AdminPanel';
import AdminLoginModal from './components/AdminLoginModal';
import OpeningScreen from './components/OpeningScreen';
import Footer from './components/Footer';

// Sections
import HeroSection from './components/sections/HeroSection';
import StorySection from './components/sections/StorySection';
import TimelineSection from './components/sections/TimelineSection';
import EventsSection from './components/sections/EventsSection';
import EntourageSection from './components/sections/EntourageSection';
import ColorPaletteSection from './components/sections/ColorPaletteSection';
import GallerySection from './components/sections/GallerySection';
import RsvpSection from './components/sections/RsvpSection';

import {
  NoiseOverlay, AmbientGlow, CircularScroll,
  Lightbox, Navigation
} from './components/Shared';

export default function App() {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [appStarted, setAppStarted] = useState(false);

  // RSVP State
  const [rsvpForm, setRsvpForm] = useState({ name: '', email: '', guests: '1', attending: 'yes', followUpDate: '', message: '', extraGuestNames: [] });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI State
  const [lightboxImg, setLightboxImg] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // --- EFFECTS ---

  // 1. Auth Init
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Data Sync
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'wedding', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        setConfig(prev => {
          // If the admin panel is open, we avoid overwriting the entire config
          // to protect unsaved local edits (like Story or Timeline changes).
          // We still sync the guest list in real-time for convenience.
          if (showAdminPanel) {
            return {
              ...prev,
              guestList: data.guestList || prev.guestList,
              // Preserve local edits for the rest of the configuration
            };
          }

          // Full sync when panel is closed or on initial load
          return { ...defaultConfig, ...data };
        });
      } else {
        // Fallback to defaults if no document exists in Firestore
        setConfig(prev => showAdminPanel ? prev : defaultConfig);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [showAdminPanel]);

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

  // 5. Dynamic Browser Styling
  useEffect(() => {
    document.title = config.websiteTitle || `${config.names} - Wedding`;

    if (config.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = config.faviconUrl;
    }

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

  const handleSaveToDb = async (newConfig) => {
    if (!user) return;
    const configToSave = newConfig || config;
    setIsSaving(true);
    return setDoc(doc(db, 'wedding', 'config'), configToSave)
      .then(() => {
        setIsSaving(false);
      })
      .catch((e) => {
        console.error("Error saving config:", e);
        setIsSaving(false);
        throw e;
      });
  };

  const handleLogin = (password) => {
    const adminEmail = "admin@louie.com";

    signInWithEmailAndPassword(auth, adminEmail, password)
      .then(() => {
        setShowAdminLogin(false);
        setShowAdminPanel(true);
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
    setIsSubmitting(true);

    try {
      const newGuest = { ...rsvpForm, timestamp: new Date().toISOString() };

      // Optimistic UI update
      const updatedGuestList = [...(config.guestList || []), newGuest];
      const newConfig = { ...config, guestList: updatedGuestList };
      setConfig(newConfig);

      // Try updateDoc first (safer for concurrent writes)
      await updateDoc(doc(db, 'wedding', 'config'), { guestList: arrayUnion(newGuest) });

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("RSVP Sent Successfully!");
      // Reset sensitive fields
      setRsvpForm(prev => ({ ...prev, message: '' }));
    } catch (err) {
      console.error("Primary RSVP save failed:", err);

      // Fallback: If document doesn't exist, create it with setDoc
      if (err.code === 'not-found' || err.message.includes('No document to update')) {
        try {
          const newGuest = { ...rsvpForm, timestamp: new Date().toISOString() };
          const updatedGuestList = [...(config.guestList || []), newGuest];
          const newConfig = { ...config, guestList: updatedGuestList };

          await setDoc(doc(db, 'wedding', 'config'), newConfig);

          setIsSubmitting(false);
          setIsSubmitted(true);
          toast.success("RSVP Sent Successfully!");
          return;
        } catch (createErr) {
          console.error("Secondary RSVP save failed:", createErr);
        }
      }

      toast.error(`Error: ${err.code || "Connection failed"}`);
      setIsSubmitting(false);
    }
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

      <OpeningScreen
        config={config}
        loading={loading || !heroLoaded}
        show={config.showOpeningScreen}
        onEnter={() => setAppStarted(true)}
      />

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
        <AdminLoginModal
          onClose={() => setShowAdminLogin(false)}
          onLogin={handleLogin}
          error={loginError}
        />
      )}

      <div className={`transition-all duration-1000 ${appStarted ? 'opacity-100' : 'opacity-0 scale-95 origin-center'}`}>
        <Navigation coupleName={config.names} logoText={config.logoText} logoImage={config.logoImage} />

        <HeroSection config={config} onScrollClick={handleScrollClick} />

        <StorySection config={config} />
        <TimelineSection config={config} />
        <ColorPaletteSection config={config} />

        <EntourageSection config={config} />

        <GallerySection config={config} onImageClick={setLightboxImg} />

        <RsvpSection
          config={config}
          rsvpForm={rsvpForm}
          setRsvpForm={setRsvpForm}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          onSubmit={handleRsvpSubmit}
        />

        <EventsSection config={config} />

        <Footer config={config} onAdminClick={() => setShowAdminLogin(true)} />
      </div>

    </div>
  );
}