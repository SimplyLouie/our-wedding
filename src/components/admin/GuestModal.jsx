import React from 'react';
import { X, Edit2, Loader } from 'lucide-react';

const GuestModal = ({
    mode,
    guestForm,
    setGuestForm,
    onClose,
    onSave,
    onEdit,
    currentGuest
}) => {
    if (mode === 'none') return null;

    return (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                <div className="bg-[#F9F4EF] px-6 py-4 border-b border-[#E6D2B5] flex justify-between items-center">
                    <h3 className="font-serif text-lg text-[#43342E]">
                        {mode === 'add' ? 'Add New Guest' : mode === 'edit' ? 'Edit Guest' : 'Guest Details'}
                    </h3>
                    <div className="flex gap-2">
                        {mode === 'view' && (
                            <button onClick={onEdit} className="text-[#B08D55] hover:text-[#43342E] flex items-center gap-1 text-xs uppercase font-bold mr-2">
                                <Edit2 size={14} /> Edit
                            </button>
                        )}
                        <button onClick={onClose} className="text-[#8C7C72] hover:text-[#43342E]"><X size={20} /></button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    {/* View Mode: Read Only Display */}
                    {mode === 'view' ? (
                        <div className="space-y-4 text-sm text-[#43342E]">
                            <div>
                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Full Name</label>
                                <div className="p-2 bg-[#FAF9F6] border border-[#E6D2B5]/30 rounded">{guestForm.name}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Status</label>
                                    <div className="p-2 bg-[#FAF9F6] border border-[#E6D2B5]/30 rounded capitalize">{guestForm.attending === 'undecided' ? 'Pending' : guestForm.attending}</div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Guests</label>
                                    <div className="p-2 bg-[#FAF9F6] border border-[#E6D2B5]/30 rounded">{guestForm.guests}</div>
                                </div>
                            </div>
                            {parseInt(guestForm.guests) > 1 && guestForm.extraGuestNames?.some(n => n) && (
                                <div>
                                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Additional Guests</label>
                                    <div className="p-2 bg-[#FAF9F6] border border-[#E6D2B5]/30 rounded space-y-1">
                                        {guestForm.extraGuestNames.map((name, i) => name && <div key={i}>• {name}</div>)}
                                    </div>
                                </div>
                            )}
                            {guestForm.rejectedIndividuals?.length > 0 && (
                                <div>
                                    <label className="block text-[10px] font-bold text-red-500 uppercase mb-1">Rejected Individuals</label>
                                    <div className="p-2 bg-red-50/30 border border-red-100 rounded space-y-2">
                                        {guestForm.rejectedIndividuals.map((name, i) => (
                                            <div key={i} className="flex justify-between items-center text-xs">
                                                <span className="text-red-700 strike-through opacity-70">• {name}</span>
                                                <button
                                                    onClick={() => {
                                                        const newRejected = guestForm.rejectedIndividuals.filter((_, idx) => idx !== i);
                                                        const newExtra = [...(guestForm.extraGuestNames || []), name];
                                                        setGuestForm({
                                                            ...guestForm,
                                                            guests: (parseInt(guestForm.guests) + 1).toString(),
                                                            extraGuestNames: newExtra,
                                                            rejectedIndividuals: newRejected
                                                        });
                                                    }}
                                                    className="text-green-600 bg-white border border-green-100 px-2 py-0.5 rounded-full hover:bg-green-50"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Email</label>
                                <div className="p-2 bg-[#FAF9F6] border border-[#E6D2B5]/30 rounded">{guestForm.email || '-'}</div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Message</label>
                                <div className="p-2 bg-[#FAF9F6] border border-[#E6D2B5]/30 rounded min-h-[3rem] whitespace-pre-wrap">{guestForm.message || '-'}</div>
                            </div>
                            {currentGuest?.timestamp && (
                                <div className="text-xs text-gray-400 text-right">Registered: {new Date(currentGuest.timestamp).toLocaleString()}</div>
                            )}
                        </div>
                    ) : (
                        /* Edit/Add Mode: Form */
                        <>
                            <div>
                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Full Name</label>
                                <input type="text" value={guestForm.name} onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" placeholder="Guest Name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Attending?</label>
                                    <select value={guestForm.attending} onChange={(e) => setGuestForm({ ...guestForm, attending: e.target.value })} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner">
                                        <option value="yes">Attending</option>
                                        <option value="undecided">Pending</option>
                                        <option value="no">Declined</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Guests Count</label>
                                    <select
                                        value={guestForm.guests}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            const currentNames = guestForm.extraGuestNames || [];
                                            const newNames = Array(Math.max(0, val - 1)).fill('').map((_, i) => currentNames[i] || '');
                                            setGuestForm({ ...guestForm, guests: e.target.value, extraGuestNames: newNames });
                                        }}
                                        className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner"
                                    >
                                        <option value="1">1 Person</option><option value="2">2 People</option><option value="3">3 People</option><option value="4">4 People</option><option value="5">5 People</option>
                                    </select>
                                </div>
                            </div>

                            {/* Extra Names Input in Modal */}
                            {parseInt(guestForm.guests) > 1 && (
                                <div className="space-y-2 bg-gray-50 p-3 rounded border border-gray-100">
                                    <p className="text-[10px] text-[#B08D55] uppercase font-bold">Extra Guest Names</p>
                                    {guestForm.extraGuestNames.map((name, idx) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                placeholder={`Guest ${idx + 2} Name`}
                                                value={name}
                                                onChange={(e) => {
                                                    const newNames = [...guestForm.extraGuestNames];
                                                    newNames[idx] = e.target.value;
                                                    setGuestForm({ ...guestForm, extraGuestNames: newNames });
                                                }}
                                                className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner text-xs"
                                            />
                                            <button
                                                onClick={() => {
                                                    const removedName = guestForm.extraGuestNames[idx];
                                                    const newNames = guestForm.extraGuestNames.filter((_, i) => i !== idx);
                                                    const newRejected = [...(guestForm.rejectedIndividuals || []), removedName];

                                                    setGuestForm({
                                                        ...guestForm,
                                                        guests: (parseInt(guestForm.guests) - 1).toString(),
                                                        extraGuestNames: newNames,
                                                        rejectedIndividuals: newRejected
                                                    });
                                                }}
                                                className="text-red-400 hover:text-red-600 p-1 bg-red-50 rounded"
                                                title="Reject this person"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Email (Optional)</label>
                                <input type="email" value={guestForm.email} onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })} className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Message / Notes</label>
                                <textarea value={guestForm.message} onChange={(e) => setGuestForm({ ...guestForm, message: e.target.value })} className="w-full px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner h-20" />
                            </div>
                            <button onClick={onSave} className="w-full bg-[#43342E] text-white py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#5D4B42] transition-colors">
                                {mode === 'edit' ? 'Update Guest' : 'Add Guest'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuestModal;
