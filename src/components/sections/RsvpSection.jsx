import React from 'react';
import { Gift, ArrowRight, Loader, Check, CalendarPlus } from 'lucide-react';
import { Confetti } from '../Shared';

const RsvpSection = ({ config, rsvpForm, setRsvpForm, isSubmitting, isSubmitted, setIsSubmitted, onSubmit }) => {

    const getGoogleCalendarUrl = () => {
        const title = encodeURIComponent(`${config.names} Wedding`);
        const details = encodeURIComponent(`Wedding celebration at ${config.location}`);
        const location = encodeURIComponent(config.location);
        const start = (config.dateIso || '').replace(/[-:]/g, '').split('.')[0];
        const endDateObj = new Date(new Date(config.dateIso).getTime() + 6 * 60 * 60 * 1000);
        const end = endDateObj.toISOString().replace(/[-:]/g, '').split('.')[0];
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
    };

    return (
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

                                <form onSubmit={onSubmit} className="space-y-6 md:space-y-8">
                                    {/* Input: text-base prevents iOS zoom. p-3 increases tap target */}
                                    <div className="group relative">
                                        <input required type="text" name="name" className="w-full border-b border-[#DBC1A7] py-3 text-base focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer rounded-none" placeholder="Enter Your Name" value={rsvpForm.name} onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })} />
                                        <label className="absolute left-0 -top-3 text-[10px] text-[#B08D55] uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#B08D55]">Enter Your Name</label>
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
                                            <select
                                                name="guests"
                                                className="w-full border-b border-[#DBC1A7] py-3 text-base focus:outline-none focus:border-[#43342E] bg-transparent text-[#43342E] rounded-none"
                                                value={rsvpForm.guests}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    // Initialize or resize extra names array
                                                    const currentNames = rsvpForm.extraGuestNames || [];
                                                    const newNames = Array(Math.max(0, val - 1)).fill('').map((_, i) => currentNames[i] || '');
                                                    setRsvpForm({ ...rsvpForm, guests: e.target.value, extraGuestNames: newNames });
                                                }}
                                            >
                                                <option value="1">1 Person</option><option value="2">2 People</option><option value="3">3 People</option><option value="4">4 People</option><option value="5">5 People</option>
                                            </select>
                                        </div>
                                        <div className="w-full md:w-1/2">
                                            <label className="block text-[10px] font-bold text-[#B08D55] mb-2 uppercase tracking-widest">Attending</label>
                                            <select name="attending" className="w-full border-b border-[#DBC1A7] py-3 text-base focus:outline-none focus:border-[#43342E] bg-transparent text-[#43342E] rounded-none" value={rsvpForm.attending} onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value })}>
                                                <option value="yes">Joyfully Accept</option><option value="undecided">Still Deciding</option><option value="no">Regretfully Decline</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Extra Guest Inputs */}
                                    {parseInt(rsvpForm.guests) > 1 && (
                                        <div className="space-y-4 animate-fade-in">
                                            <p className="text-[10px] text-[#B08D55] uppercase tracking-widest font-bold">Additional Guests</p>
                                            {rsvpForm.extraGuestNames.map((name, idx) => (
                                                <div key={idx} className="group relative">
                                                    <input
                                                        required
                                                        type="text"
                                                        name={`guest_${idx}`}
                                                        className="w-full border-b border-[#DBC1A7] py-3 text-sm focus:outline-none focus:border-[#43342E] transition-colors bg-transparent text-[#43342E] placeholder-transparent peer rounded-none"
                                                        placeholder={`Guest ${idx + 2} Name`}
                                                        value={name}
                                                        onChange={(e) => {
                                                            const newNames = [...rsvpForm.extraGuestNames];
                                                            newNames[idx] = e.target.value;
                                                            setRsvpForm({ ...rsvpForm, extraGuestNames: newNames });
                                                        }}
                                                    />
                                                    <label className="absolute left-0 -top-3 text-[9px] text-[#8C7C72] uppercase tracking-widest transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-[#B08D55]">
                                                        Guest {idx + 2} Name
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-12 px-4 relative overflow-hidden min-h-[500px]">
                                <Confetti />

                                <div className="relative z-10 mb-10">
                                    <div className="w-24 h-24 border border-[#B08D55] rounded-full flex items-center justify-center text-[#B08D55] mx-auto bg-white shadow-xl animate-slow-zoom">
                                        <Check size={48} strokeWidth={1} />
                                    </div>
                                    <div className="absolute -inset-4 border border-[#B08D55]/20 rounded-full animate-ping opacity-20" />
                                </div>

                                <h2 className="font-serif text-4xl md:text-5xl mb-6 text-[#43342E] relative z-10 tracking-tight">Our Deepest Thanks</h2>
                                <p className="text-[#8C7C72] mb-10 font-light italic relative z-10 text-sm md:text-base max-w-sm leading-relaxed">
                                    Your response has been successfully recorded. We are overjoyed to share this special day with you.
                                </p>

                                {/* Event Details Summary */}
                                <div className="relative z-10 w-full max-w-xs bg-[#F9F4EF]/50 backdrop-blur-sm border border-[#E6D2B5]/30 rounded-lg p-6 mb-10 shadow-sm">
                                    <p className="text-[10px] text-[#B08D55] uppercase tracking-[0.3em] mb-4 font-bold">Mark Your Calendar</p>
                                    <h4 className="text-[#43342E] font-serif text-xl mb-1">{config.dateString}</h4>
                                    <p className="text-[#8C7C72] text-xs">{config.location}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full justify-center px-4 max-w-md">
                                    {/* ADD TO CALENDAR (Only if Attending) */}
                                    {rsvpForm.attending === 'yes' && (
                                        <a
                                            href={getGoogleCalendarUrl()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-3 bg-[#43342E] text-white px-8 py-4 rounded-full uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-[#5D4B42] hover:-translate-y-0.5 transition-all shadow-lg active:scale-95"
                                        >
                                            <CalendarPlus size={16} /> Add to Calendar
                                        </a>
                                    )}

                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="flex-1 text-[#8C7C72] text-[10px] uppercase tracking-[0.2em] font-bold border border-[#E6D2B5] px-8 py-4 rounded-full hover:bg-[#FAF9F6] transition-all hover:text-[#43342E] active:scale-95 bg-white sm:bg-transparent"
                                    >
                                        Edit Response
                                    </button>
                                </div>

                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Gift size={200} strokeWidth={0.5} />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default RsvpSection;
