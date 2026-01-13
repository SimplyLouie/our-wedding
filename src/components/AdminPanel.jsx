import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Heart, Calendar, Gift, Settings, Upload, Link as LinkIcon, Image as ImageIcon, Edit2, Save, RefreshCw, Trash2, Users, ClipboardList, Search, AlertCircle, CheckCircle, Type, Download, MessageSquare, Plus, Check, X, Loader, Music, Clock, Smartphone, Globe } from 'lucide-react';

const AdminPanel = ({ config, updateConfig, resetConfig, closePanel, isSaving, onSave }) => {
    const [activeTab, setActiveTab] = useState('guests');
    const [searchTerm, setSearchTerm] = useState('');
    const [resetConfirm, setResetConfirm] = useState(false);

    // 1. Toast Notification Wrapper
    const handleSaveClick = () => {
        if (onSave) {
            toast.promise(
                onSave(),
                {
                    loading: 'Saving changes...',
                    success: <b>Settings Saved!</b>,
                    error: <b>Could not save.</b>,
                }
            );
        }
    };

    const handleImageChange = (e, key, index = null) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = reader.result;
                if (res.length > 900000) {
                    toast.error("Image too large (Max ~1MB). Please compress it.");
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

    // --- Helpers ---
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

    const updateEvent = (index, field, value) => {
        const newEvents = [...config.events];
        newEvents[index][field] = value;
        updateConfig('events', newEvents);
    };

    const deleteGuest = (guestToDelete) => {
        if (confirm('Remove this guest?')) {
            const newGuests = config.guestList.filter(g => g.timestamp !== guestToDelete.timestamp);
            updateConfig('guestList', newGuests);
        }
    };

    const downloadCSV = () => {
        if (!config.guestList || config.guestList.length === 0) {
            toast.error("No guests to export");
            return;
        }
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
        link.download = `guest_list_${new Date().toISOString().split('T')[0]}.csv`;
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
            setTimeout(() => setResetConfirm(false), 3000);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-[#1F1815]/90 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 animate-fade-in">
            <div className="bg-[#FAF9F6] w-full max-w-6xl h-full md:h-[90vh] rounded-none md:rounded-lg shadow-2xl flex flex-col overflow-hidden border border-[#E6D2B5]/20 animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="bg-white px-4 md:px-8 py-3 md:py-6 border-b border-[#E6D2B5]/30 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <Settings size={20} className="text-[#B08D55]" />
                        <h2 className="font-serif text-lg md:text-2xl text-[#43342E]">Configuration</h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={handleSaveClick}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all shadow-md ${isSaving ? 'bg-[#E6D2B5] text-white cursor-wait' : 'bg-[#43342E] text-[#F9F4EF] hover:bg-[#5D4B42]'}`}
                        >
                            {isSaving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                            <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save Changes'}</span>
                            <span className="md:hidden">{isSaving ? '...' : 'Save'}</span>
                        </button>

                        <button onClick={closePanel} className="text-[#8C7C72] hover:text-[#43342E] transition-colors p-2 hover:bg-gray-100 rounded-full bg-gray-50 md:bg-transparent">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    {/* Sidebar */}
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
                                className={`px-4 md:px-8 py-3 md:py-4 text-left text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 md:gap-3 border-b-4 md:border-b-0 md:border-l-4 ${activeTab === tab.id ? 'border-[#B08D55] bg-[#F9F4EF] text-[#43342E]' : 'border-transparent text-[#8C7C72] hover:bg-gray-50'}`}
                            >
                                <tab.icon size={14} />
                                <span className="hidden md:inline">{tab.label}</span>
                                <span className="md:hidden">{tab.shortLabel}</span>
                            </button>
                        ))}

                        <div className="p-4 md:mt-auto md:px-8 md:pb-4 min-w-[150px] md:min-w-0 flex items-center">
                            <button
                                onClick={handleResetRequest}
                                className={`flex items-center gap-2 text-xs uppercase tracking-wider transition-all duration-300 w-full justify-center py-2 md:py-3 rounded-md ${resetConfirm ? 'bg-red-50 text-red-600 font-bold border border-red-200' : 'text-red-300 hover:text-red-500 hover:bg-red-50/50'}`}
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
                                </div>

                                {/* Browser & Device Styling Section (NEW) */}
                                <div className="border-t border-[#E6D2B5]/30 pt-8 mt-4">
                                    <h3 className="font-serif text-lg text-[#43342E] mb-6 flex items-center gap-2"><Globe size={18} /> Browser & Device Styling</h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Favicon Input */}
                                        <div className="group">
                                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Favicon Icon (Tab Icon)</label>
                                            <div className="flex gap-4 items-center">
                                                <div className="w-10 h-10 border border-[#E6D2B5] p-1 flex items-center justify-center bg-gray-50 shrink-0">
                                                    {config.faviconUrl ? <img src={config.faviconUrl} className="max-w-full max-h-full" alt="Favicon" /> : <span className="text-[8px] text-gray-400">None</span>}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <label className="cursor-pointer bg-white border border-[#E6D2B5] px-3 py-2 text-[10px] uppercase font-bold hover:bg-[#FAF9F6] flex items-center justify-center gap-2 w-full md:w-fit transition-colors">
                                                        <Upload size={12} /> Upload Icon
                                                        <input type="file" className="hidden" accept="image/png,image/x-icon,image/jpeg" onChange={(e) => handleImageChange(e, 'faviconUrl')} />
                                                    </label>
                                                </div>
                                            </div>
                                            <input type="text" value={config.faviconUrl || ''} onChange={(e) => updateConfig('faviconUrl', e.target.value)} className="admin-input mt-2 text-xs" placeholder="Or paste image URL..." />
                                        </div>

                                        {/* Theme Color Input */}
                                        <div className="group">
                                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2 flex items-center gap-2"><Smartphone size={12} /> Mobile Theme Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={config.themeColor || '#FAF9F6'}
                                                    onChange={(e) => updateConfig('themeColor', e.target.value)}
                                                    className="w-10 h-10 p-1 bg-white border border-[#E6D2B5] cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={config.themeColor || '#FAF9F6'}
                                                    onChange={(e) => updateConfig('themeColor', e.target.value)}
                                                    className="admin-input uppercase font-mono"
                                                    maxLength={7}
                                                />
                                            </div>
                                            <p className="text-[9px] text-[#8C7C72] mt-2 leading-tight">Controls the color of the browser address bar on mobile devices.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Branding Section */}
                                <div className="border-t border-[#E6D2B5]/30 pt-8 mt-4">
                                    <h3 className="font-serif text-lg text-[#43342E] mb-6 flex items-center gap-2"><Type size={18} /> Branding & Logo</h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="group">
                                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Website Title</label>
                                            <input type="text" value={config.websiteTitle || ''} onChange={(e) => updateConfig('websiteTitle', e.target.value)} className="admin-input" placeholder="e.g. Louie & Florie's Wedding" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Logo Text</label>
                                            <input type="text" value={config.logoText || ''} onChange={(e) => updateConfig('logoText', e.target.value)} className="admin-input" placeholder="Auto-generated if empty" />
                                        </div>
                                        <div className="group md:col-span-2">
                                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Logo Image (Optional)</label>
                                            <div className="flex gap-4 items-center">
                                                {config.logoImage && <img src={config.logoImage} alt="Logo Preview" className="h-10 w-auto border border-[#E6D2B5] p-1" />}
                                                <div className="flex-1">
                                                    <label className="cursor-pointer bg-white border border-[#E6D2B5] text-[#43342E] px-4 py-2 text-xs uppercase font-bold hover:bg-[#FAF9F6] flex items-center justify-center gap-2 w-fit">
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
                                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Contact URL</label>
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
                                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Or Paste URL</label>
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
            </div>
        </div>
    );
};

export default AdminPanel;