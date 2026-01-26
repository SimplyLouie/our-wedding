import React, { useState, useEffect, useRef } from 'react';
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
import RegistrySection from './components/sections/RegistrySection';
import MapSection from './components/sections/MapSection';
import GuestbookSection from './components/sections/GuestbookSection';
import WeatherSection from './components/sections/WeatherSection';
import FaqSection from './components/sections/FaqSection';

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

  const [hasSynced, setHasSynced] = useState(false);
  const showAdminPanelRef = useRef(showAdminPanel);

  useEffect(() => {
    showAdminPanelRef.current = showAdminPanel;
  }, [showAdminPanel]);

  // 2. Data Sync
  useEffect(() => {
    console.log("[Sync] Initializing Firestore Listener...");

    const unsubscribe = onSnapshot(doc(db, 'wedding', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        setConfig(prev => {
          // If this is the FIRST time we get data, or if the Admin Panel is CLOSED,
          // we do a full merge from the database.
          if (!hasSynced || !showAdminPanelRef.current) {
            console.log("[Sync] Performing FULL merge from Firestore.");
            return { ...defaultConfig, ...data };
          }

          // If the Admin Panel is OPEN and we've already synced once,
          // we only sync the guest list to protect any unsaved local edits
          // the admin might be currently typing (like Story or Timeline changes).
          console.log("[Sync] Admin Panel Open: Merging Guest List only.");
          return {
            ...prev,
            guestList: data.guestList || prev.guestList,
          };
        });

        setHasSynced(true);
      } else {
        console.warn("[Sync] Document not found. Using defaults.");
        if (!hasSynced) setConfig(defaultConfig);
      }
      setLoading(false);
    }, (error) => {
      console.error("[Sync] Error:", error);
      if (error.code === 'permission-denied') {
        toast.error("Database access denied for guests.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [hasSynced]); // showAdminPanel removed from dependencies, using ref instead

  // 3. Global Sync / Cache Refresh
  useEffect(() => {
    if (config.syncId) {
      const localSyncId = localStorage.getItem('wedding_sync_id');

      // If we see a new sync ID and we are NOT in the admin panel
      if (localSyncId !== config.syncId && !showAdminPanel) {
        console.log("[Sync] New Global Refresh Signal detected. Reloading...");
        localStorage.setItem('wedding_sync_id', config.syncId);

        // Brief delay to allow the save toast to finish if visible
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (localSyncId !== config.syncId && showAdminPanel) {
        // If admin, just update the local ID so we don't refresh later
        localStorage.setItem('wedding_sync_id', config.syncId);
      }
    }
  }, [config.syncId, showAdminPanel]);

  // 4. Preloader Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
      if (!heroLoaded) setHeroLoaded(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading, heroLoaded]);

  // 4. Hero Image Preload
  useEffect(() => {
    if (!config.heroImage) return;
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

  const handleSaveToDb = async (explicitConfig) => {
    if (!auth.currentUser) {
      toast.error("Auth session expired. Please log in again.");
      return;
    }

    // Capture the exact moment of saving
    const timestamp = new Date().toISOString();

    // Add timestamp to the config so we can verify the sync on reload
    const currentConfig = explicitConfig || config;
    const configToSave = {
      ...currentConfig,
      lastSaved: timestamp
    };

    setIsSaving(true);
    console.log(`[Firestore Write] Initiating save at ${timestamp}`, configToSave);

    try {
      await setDoc(doc(db, 'wedding', 'config'), configToSave);
      console.log(`[Firestore Write] SUCCESS: Data persisted to 'wedding/config' at ${timestamp}`);
      toast.success(`Changes saved successfully at ${new Date().toLocaleTimeString()}`);
      setIsSaving(false);
      return true;
    } catch (e) {
      console.error("[Firestore Write] ERROR:", e);
      toast.error(`Save failed: ${e.message}`);
      setIsSaving(false);
      throw e;
    }
  };

  const handleResetToLocal = () => {
    if (confirm("This will overwrite the LIVE database with the local defaultConfig.js settings. Continue?")) {
      setConfig(defaultConfig);
      handleSaveToDb(defaultConfig); // Explicitly pass to ensure it saves correct data
    }
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

      // Try updateDoc (safest for concurrent writes)
      await updateDoc(doc(db, 'wedding', 'config'), { guestList: arrayUnion(newGuest) });

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("RSVP Sent Successfully!");
      setRsvpForm(prev => ({ ...prev, message: '' }));
    } catch (err) {
      console.error("RSVP Submission Error:", err);
      toast.error(`Error: ${err.code === 'permission-denied' ? "Submission restricted" : "Connection failed"}`);
      setIsSubmitting(false);
    }
  };

  const handleAddGuestbookMessage = async (message) => {
    try {
      // Optimistic update
      const updatedMessages = [...(config.guestbookMessages || []), message];
      setConfig(prev => ({ ...prev, guestbookMessages: updatedMessages }));

      // Save to Firebase
      await updateDoc(doc(db, 'wedding', 'config'), {
        guestbookMessages: arrayUnion(message)
      });
    } catch (err) {
      console.error("Guestbook submission error:", err);
      throw err;
    }
  };

  const handleUpdateGuestbookMessage = async (updatedMsg) => {
    try {
      const newMessages = (config.guestbookMessages || []).map(msg =>
        msg.id === updatedMsg.id ? updatedMsg : msg
      );

      // Update local state
      setConfig(prev => ({ ...prev, guestbookMessages: newMessages }));

      // Save full list to Firebase (since updating nested arrays is complex in Firestore)
      await updateDoc(doc(db, 'wedding', 'config'), {
        guestbookMessages: newMessages
      });
    } catch (err) {
      console.error("Guestbook update error:", err);
      throw err;
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
          resetConfig={handleResetToLocal}
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
        <Navigation
          config={config}
          sectionOrder={config.sectionOrder || defaultConfig.sectionOrder}
        />

        <HeroSection config={config} onScrollClick={handleScrollClick} />

        {/* Sections based on Dynamic Order */}
        {(config.sectionOrder || defaultConfig.sectionOrder).map((section) => {
          if (section.visible === false) return null;

          switch (section.id) {
            case 'story':
              return <StorySection key="story" config={config} />;
            case 'timeline':
              return <TimelineSection key="timeline" config={config} />;
            case 'weather':
              return <WeatherSection key="weather" config={config} />;
            case 'faq':
              return <FaqSection key="faq" config={config} />;
            case 'palette':
              return <ColorPaletteSection key="palette" config={config} />;
            case 'entourage':
              return <EntourageSection key="entourage" config={config} />;
            case 'gallery':
              return <GallerySection key="gallery" config={config} onImageClick={setLightboxImg} />;
            case 'rsvp':
              return (
                <RsvpSection
                  key="rsvp"
                  config={config}
                  rsvpForm={rsvpForm}
                  setRsvpForm={setRsvpForm}
                  isSubmitting={isSubmitting}
                  isSubmitted={isSubmitted}
                  setIsSubmitted={setIsSubmitted}
                  onSubmit={handleRsvpSubmit}
                />
              );
            case 'events':
              return <EventsSection key="events" config={config} />;
            case 'registry':
              return <RegistrySection key="registry" config={config} />;
            case 'map':
              return <MapSection key="map" config={config} />;
            case 'guestbook':
              return (
                <GuestbookSection
                  key="guestbook"
                  config={config}
                  onAddMessage={handleAddGuestbookMessage}
                  onUpdateMessage={handleUpdateGuestbookMessage}
                />
              );
            default:
              return null;
          }
        })}

        <Footer config={config} onAdminClick={() => setShowAdminLogin(true)} />
      </div>

    </div>
  );
}