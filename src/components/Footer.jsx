import { Lock, Instagram, Facebook, MessageCircle, Mail } from 'lucide-react';

const Footer = ({ config, onAdminClick }) => {
    return (
        <footer className="bg-[#1F1815] text-[#8C7C72] py-24 text-center border-t-8 border-[#2E2622]">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="font-serif text-5xl text-[#DBC1A7] mb-12 tracking-wide">{config.names}</h2>

                <div className="flex justify-center flex-wrap gap-8 mb-12">
                    {config.instagram && config.instagram !== '#' && (
                        <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors p-2">Instagram</a>
                    )}
                    {config.facebook && config.facebook !== '#' && (
                        <a href={config.facebook} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors p-2">Facebook</a>
                    )}
                    {config.messenger && config.messenger !== '#' && (
                        <a href={config.messenger} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors p-2">Messenger</a>
                    )}
                    {config.contact && config.contact !== '#' && (
                        <a href={config.contact.startsWith('mailto:') ? config.contact : `mailto:${config.contact}`} className="text-[10px] uppercase tracking-[0.25em] hover:text-[#DBC1A7] transition-colors p-2">Contact</a>
                    )}
                </div>
                <div className="flex flex-col items-center justify-center gap-6 border-t border-[#43342E]/50 pt-10 mt-6 max-w-xs mx-auto">
                    <p className="text-[10px] font-light tracking-widest text-[#5D4B42]">EST. 2026 • CEBU PHILIPPINES</p>
                    {/* Increased touch target for Admin Access */}
                    <button onClick={onAdminClick} className="text-[9px] text-[#43342E] hover:text-[#B08D55] transition-colors uppercase tracking-widest font-bold flex items-center gap-2 opacity-50 hover:opacity-100 p-4">
                        <Lock size={10} /> Admin Access
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
