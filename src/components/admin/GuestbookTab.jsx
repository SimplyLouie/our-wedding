import React from 'react';
import { MessageSquare, Trash2, User, UserX, AlertCircle, MessageSquareQuote } from 'lucide-react';
import toast from 'react-hot-toast';

const GuestbookTab = ({ config, updateConfig }) => {
    const messages = config.guestbookMessages || [];

    const deleteMessage = (id) => {
        if (confirm("Are you sure you want to delete this message?")) {
            const newMessages = messages.filter(msg => msg.id !== id);
            updateConfig('guestbookMessages', newMessages);
            toast.success("Message deleted");
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="border-b border-[#E6D2B5]/30 pb-4">
                <h3 className="font-serif text-2xl text-[#43342E] mb-1">Guestbook Management</h3>
                <p className="text-xs text-[#8C7C72]">View and manage messages from your guests.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Section Settings */}
                <div className="md:col-span-2 bg-[#FAF9F6] p-6 rounded-xl border border-[#E6D2B5]/30 space-y-4">
                    <h4 className="text-sm font-bold text-[#43342E] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MessageSquare className="text-[#B08D55]" size={18} /> Header Content
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Title</label>
                            <input
                                type="text"
                                value={config.guestbookTitle || ''}
                                onChange={(e) => updateConfig('guestbookTitle', e.target.value)}
                                className="admin-input rounded-lg"
                                placeholder="Guestbook"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Subtitle</label>
                            <input
                                type="text"
                                value={config.guestbookSubtitle || ''}
                                onChange={(e) => updateConfig('guestbookSubtitle', e.target.value)}
                                className="admin-input rounded-lg"
                                placeholder="Wishes & Love"
                            />
                        </div>
                    </div>
                </div>

                {/* Messages List */}
                <div className="md:col-span-2 space-y-4">
                    <h4 className="text-sm font-bold text-[#43342E] uppercase tracking-widest flex items-center gap-2 mb-2">
                        <MessageSquareQuote className="text-[#B08D55]" size={18} /> Recent Messages ({messages.length})
                    </h4>

                    {messages.length === 0 ? (
                        <div className="bg-[#FAF9F6] border-2 border-dashed border-[#E6D2B5]/30 rounded-2xl py-12 text-center">
                            <MessageSquare className="mx-auto text-[#E6D2B5] mb-4 opacity-50" size={48} />
                            <p className="text-[#8C7C72] text-sm italic">No messages in the guestbook yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {[...messages].reverse().map((msg) => (
                                <div key={msg.id} className="bg-white p-5 rounded-xl border border-[#E6D2B5]/30 shadow-sm space-y-4 group">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4 items-start">
                                            <div className="p-2 bg-[#FAF9F6] rounded-full text-[#B08D55] mt-1">
                                                {msg.name === "Anonymous" ? <UserX size={18} /> : <User size={18} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="font-serif text-[#43342E]">{msg.name}</h5>
                                                    <span className="text-[10px] text-[#8C7C72]">
                                                        • {new Date(msg.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[#5D4B42] leading-relaxed italic">"{msg.message}"</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteMessage(msg.id)}
                                            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete Message"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Admin Interaction Area */}
                                    <div className="pl-12 space-y-3">
                                        {/* Reactions */}
                                        <div className="flex items-center gap-2">
                                            {['❤️', '🎉', '👍', '✨'].map(emoji => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => {
                                                        const newReactions = { ...(msg.reactions || {}) };
                                                        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
                                                        const updatedMsgs = messages.map(m => m.id === msg.id ? { ...m, reactions: newReactions } : m);
                                                        updateConfig('guestbookMessages', updatedMsgs);
                                                    }}
                                                    className={`px-2 py-1 rounded-full border transition-all text-xs flex items-center gap-1 ${msg.reactions?.[emoji] ? 'bg-[#B08D55]/10 border-[#B08D55]/30' : 'bg-gray-50 border-gray-100 hover:border-[#B08D55]/30'}`}
                                                >
                                                    {emoji} <span className="text-[10px] font-bold">{msg.reactions?.[emoji] || 0}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Reply */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">
                                                <MessageSquareQuote size={12} /> Your Reply
                                            </div>
                                            {msg.reply ? (
                                                <div className="bg-[#FAF9F6] p-3 rounded-lg border border-[#E6D2B5]/20 relative group/reply">
                                                    <p className="text-xs text-[#43342E] leading-relaxed italic">{msg.reply}</p>
                                                    <button
                                                        onClick={() => {
                                                            const updatedMsgs = messages.map(m => m.id === msg.id ? { ...m, reply: null } : m);
                                                            updateConfig('guestbookMessages', updatedMsgs);
                                                        }}
                                                        className="absolute top-2 right-2 opacity-0 group-hover/reply:opacity-100 p-1 text-red-300 hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Write a reply..."
                                                        className="admin-input rounded-lg h-9 text-xs"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                                const updatedMsgs = messages.map(m => m.id === msg.id ? { ...m, reply: e.target.value.trim() } : m);
                                                                updateConfig('guestbookMessages', updatedMsgs);
                                                                e.target.value = '';
                                                                toast.success("Reply added");
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#FFF9F2] p-4 rounded-lg border border-[#E6D2B5]/50 flex gap-3 text-xs text-[#8C7C72]">
                <AlertCircle className="text-[#B08D55] shrink-0" size={18} />
                <div>
                    <p className="font-bold text-[#43342E] mb-1">Interactive Guestbook:</p>
                    <ul className="list-disc ml-4 space-y-1">
                        <li><strong>React</strong> to messages with emojis to show your appreciation.</li>
                        <li><strong>Reply</strong> to guest wishes to welcome them or say thank you.</li>
                        <li>All interactions are visible to guests on the main page.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GuestbookTab;
