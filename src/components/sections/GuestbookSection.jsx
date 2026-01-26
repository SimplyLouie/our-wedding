import React, { useState } from 'react';
import { MessageSquare, Send, User, UserX } from 'lucide-react';
import { ScrollReveal, SectionHeading } from '../Shared';
import toast from 'react-hot-toast';

const GuestbookSection = ({ config, onAddMessage }) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return toast.error("Please enter a message");
        if (!isAnonymous && !name.trim()) return toast.error("Please enter your name or post anonymously");

        setIsSubmitting(true);
        const newMessage = {
            id: Date.now(),
            name: isAnonymous ? "Anonymous" : name,
            message: message.trim(),
            timestamp: new Date().toISOString(),
        };

        try {
            await onAddMessage(newMessage);
            setName('');
            setMessage('');
            setIsAnonymous(false);
            toast.success("Thank you for your message!");
        } catch (error) {
            console.error("Guestbook error:", error);
            toast.error("Failed to post message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const messages = config.guestbookMessages || [];

    return (
        <section id="guestbook" className="py-20 md:py-32 px-4 bg-[#FAF9F6] relative z-10 border-t border-[#E6D2B5]/30 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                <div className="absolute top-10 left-10 text-[#B08D55] rotate-12"><MessageSquare size={120} /></div>
                <div className="absolute bottom-10 right-10 text-[#B08D55] -rotate-12"><MessageSquare size={120} /></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <ScrollReveal>
                    <SectionHeading
                        title={config.guestbookTitle || "Guestbook"}
                        subtitle={config.guestbookSubtitle || "Wishes & Love"}
                    />
                </ScrollReveal>

                {/* Message Form */}
                <ScrollReveal variant="up" delay={100} className="mb-16">
                    <div className="bg-white p-6 md:p-10 rounded-2xl border border-[#E6D2B5]/30 shadow-sm max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Your Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            disabled={isAnonymous || isSubmitting}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={isAnonymous ? "Posting as Anonymous" : "Your Name"}
                                            className={`admin-input rounded-xl !pl-14 ${isAnonymous ? 'bg-gray-50 opacity-50' : ''}`}
                                        />
                                        <div className="absolute left-4 top-0 h-full flex items-center pointer-events-none text-[#B08D55]">
                                            <User size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div
                                            onClick={() => setIsAnonymous(!isAnonymous)}
                                            className={`w-10 h-6 rounded-full transition-all relative ${isAnonymous ? 'bg-[#B08D55]' : 'bg-gray-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAnonymous ? 'left-5' : 'left-1'}`} />
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest text-[#8C7C72] font-bold">Post Anonymously</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Your Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Leave a warm wish for the couple..."
                                    className="admin-input rounded-xl h-32 resize-none pt-3"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#43342E] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#5D4B42] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? "Posting..." : <>Post Message <Send size={16} /></>}
                            </button>
                        </form>
                    </div>
                </ScrollReveal>

                {/* Messages List */}
                <div className="space-y-6">
                    {messages.length === 0 ? (
                        <p className="text-center text-[#8C7C72] italic animate-pulse">Be the first to leave a message!</p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {[...messages].reverse().map((msg, idx) => (
                                <ScrollReveal key={msg.id || idx} variant="up" delay={idx * 50} className="h-full">
                                    <div className="bg-white p-6 rounded-2xl border border-[#E6D2B5]/20 shadow-sm hover:shadow-md transition-all h-full flex flex-col relative group">
                                        {/* Corner Accent */}
                                        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden rounded-tr-2xl">
                                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-r-[32px] border-t-transparent border-r-[#B08D55]/10 group-hover:border-r-[#B08D55]/20 transition-colors" />
                                        </div>

                                        <p className="text-[#43342E] leading-relaxed italic mb-6 flex-1 text-sm md:text-base">
                                            "{msg.message}"
                                        </p>

                                        {/* Admin Reply */}
                                        {msg.reply && (
                                            <div className="mb-6 pl-4 border-l-2 border-[#B08D55]/30 bg-[#FAF9F6]/50 p-3 rounded-r-xl">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[9px] uppercase tracking-widest font-bold text-[#B08D55]">The Couple's Reply</span>
                                                </div>
                                                <p className="text-xs text-[#5D4B42] leading-relaxed italic">
                                                    {msg.reply}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E6D2B5]/10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[#FAF9F6] rounded-full text-[#B08D55]">
                                                    {msg.name === "Anonymous" ? <UserX size={16} /> : <User size={16} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-serif text-[#43342E] text-sm">{msg.name}</h4>
                                                    <p className="text-[9px] uppercase tracking-widest text-[#8C7C72]">
                                                        {new Date(msg.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Guest Reactions */}
                                            <div className="flex items-center gap-1.5">
                                                {['❤️', '🎉', '👍', '✨'].map(emoji => {
                                                    const count = msg.reactions?.[emoji] || 0;
                                                    if (count === 0 && !msg.reply) return null; // Only show unused emojis if there's a reply (active thread) or just show all?
                                                    // Let's show all emojis but dimmed if 0
                                                    return (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => {
                                                                const newReactions = { ...(msg.reactions || {}) };
                                                                newReactions[emoji] = (newReactions[emoji] || 0) + 1;
                                                                onUpdateMessage({ ...msg, reactions: newReactions });
                                                                toast.success(`Sent a ${emoji}!`);
                                                            }}
                                                            className={`px-2 py-1 rounded-full transition-all text-xs flex items-center gap-1 border ${count > 0 ? 'bg-[#B08D55]/10 border-[#B08D55]/20 text-[#43342E]' : 'bg-transparent border-transparent text-gray-300 hover:border-[#E6D2B5]/30 hover:text-[#B08D55]'}`}
                                                        >
                                                            {emoji} {count > 0 && <span className="text-[9px] font-bold">{count}</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default GuestbookSection;
