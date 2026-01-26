import React, { useState, useEffect } from 'react';
import { Send, Facebook, MessageCircle, Copy, Check, X, Share2, Mail } from 'lucide-react';

const InvitationShare = ({ config }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!config.showFloatingShare) return null;

    const shareUrl = window.location.href;
    const shareTitle = config.shareTitle || `You're Invited to ${config.names}'s Wedding!`;
    const shareDescription = config.shareDescription || "Celebrate with us on our special day. View details and RSVP here.";

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareDescription,
                    url: shareUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setIsOpen(true);
                }
            }
        } else {
            setIsOpen(true);
        }
    };

    const messengerUrl = `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    return (
        <>
            {/* Wax Seal Floating Button */}
            <button
                onClick={handleShare}
                className={`fixed bottom-6 right-6 z-50 group flex items-center justify-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    }`}
                aria-label="Share Invitation"
            >
                {/* Wax Seal Outer Glow */}
                <div className="absolute inset-0 bg-[#C76D55]/30 rounded-full blur-md group-hover:bg-[#C76D55]/50 transition-all duration-500 animate-pulse" />

                {/* Seal Body */}
                <div className="relative w-14 h-14 bg-[#C76D55] text-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#B05D47] overflow-hidden">
                    {/* Seal Texture/Marbling */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]" />
                    <Mail size={24} className="group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Tooltip Label */}
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-[#43342E] text-[#FDFBF7] text-[10px] uppercase tracking-widest font-bold whitespace-nowrap rounded-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                    Share Invitation
                </span>
            </button>

            {/* Share Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1F1815]/90 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)}>
                    <div className="w-full max-w-sm bg-[#FAF9F6] border border-[#E6D2B5] shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Decorative Background for Modal */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#C76D55]" />

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-[#8C7C72] hover:text-[#43342E] transition-colors p-1"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <p className="text-[10px] text-[#B08D55] uppercase font-bold tracking-[0.3em] mb-2 text-center">Digital Invitation</p>
                                <h3 className="font-serif text-2xl text-[#43342E] mb-2">{config.names}</h3>
                                <div className="w-8 h-[1px] bg-[#E6D2B5] mx-auto mb-6" />

                                {/* Invitation Preview Card */}
                                <div className="bg-white border border-[#E6D2B5] p-6 mb-8 shadow-inner relative group">
                                    <div className="absolute inset-2 border border-[#E6D2B5]/30 pointer-events-none" />
                                    {config.heroImage && (
                                        <div className="aspect-[4/3] w-full mb-4 overflow-hidden">
                                            <img src={config.heroImage} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <h4 className="font-serif text-sm text-[#43342E] mb-1">{shareTitle}</h4>
                                    <p className="text-[10px] text-[#8C7C72] line-clamp-2">{shareDescription}</p>
                                </div>

                                <p className="text-[11px] text-[#43342E]/70 mb-6 italic">"Select a platform to send your invitation"</p>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <a href={messengerUrl} className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-full border border-[#E6D2B5] flex items-center justify-center bg-white group-hover:bg-[#E6D2B5]/10 group-hover:border-[#B08D55] transition-all duration-300">
                                        <MessageCircle size={22} className="text-[#0084FF]" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest text-[#8C7C72] group-hover:text-[#43342E]">Messenger</span>
                                </a>
                                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-full border border-[#E6D2B5] flex items-center justify-center bg-white group-hover:bg-[#E6D2B5]/10 group-hover:border-[#B08D55] transition-all duration-300">
                                        <Facebook size={22} className="text-[#1877F2]" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest text-[#8C7C72] group-hover:text-[#43342E]">Facebook</span>
                                </a>
                                <button onClick={handleCopy} className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-full border border-[#E6D2B5] flex items-center justify-center bg-white group-hover:bg-[#E6D2B5]/10 group-hover:border-[#B08D55] transition-all duration-300">
                                        {copied ? <Check size={22} className="text-green-500" /> : <Copy size={22} className="text-[#43342E]" />}
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest text-[#8C7C72] group-hover:text-[#43342E]">
                                        {copied ? 'Copied!' : 'Copy Link'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#43342E] p-3 text-center">
                            <p className="text-[9px] text-[#FDFBF7]/50 uppercase tracking-[0.2em]">Share the joy with friends and family</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InvitationShare;
