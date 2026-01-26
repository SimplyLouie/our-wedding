import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Heart, Calendar, Gift, Settings, Upload, Link as LinkIcon, Image as ImageIcon, Edit2, Save, RefreshCw, Trash2, Users, ClipboardList, Search, AlertCircle, CheckCircle, Type, Download, MessageSquare, Plus, Check, X, Loader, Music, Clock, Smartphone, Globe, Star, Palette, Coffee, Camera, Utensils, Wine, Car, Gem, Eye, Slash } from 'lucide-react';

const ICON_OPTIONS = [
    { id: 'clock', icon: Clock, label: 'Clock' },
    { id: 'coffee', icon: Coffee, label: 'Coffee' },
    { id: 'heart', icon: Heart, label: 'Heart' },
    { id: 'camera', icon: Camera, label: 'Camera' },
    { id: 'music', icon: Music, label: 'Music' },
    { id: 'utensils', icon: Utensils, label: 'Food' },
    { id: 'wine', icon: Wine, label: 'Drinks' },
    { id: 'car', icon: Car, label: 'Travel' },
    { id: 'ring', icon: Gem, label: 'Ring' }
];

const AdminPanel = ({ config, updateConfig, resetConfig, closePanel, isSaving, onSave }) => {
    const [activeTab, setActiveTab] = useState('guests');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'yes', 'no', 'undecided'
    const [resetConfirm, setResetConfirm] = useState(false);

    // Disable body scroll when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Guest Editing State
    const [guestModalMode, setGuestModalMode] = useState('none'); // 'none', 'view', 'edit', 'add'
    const [currentGuest, setCurrentGuest] = useState(null);
    const [guestForm, setGuestForm] = useState({ name: '', guests: '1', attending: 'undecided', email: '', message: '', extraGuestNames: [] });

    // --- Guest Helpers ---
    const openGuestModal = (guest, mode = 'view') => {
        if (guest) {
            setCurrentGuest(guest);
            setGuestForm({ ...guest, extraGuestNames: guest.extraGuestNames || [] });
        } else {
            setCurrentGuest(null);
            setGuestForm({ name: '', guests: '1', attending: 'undecided', email: '', message: '', extraGuestNames: [] });
        }
        setGuestModalMode(mode);
    };

    const saveGuest = () => {
        if (!guestForm.name) return toast.error("Name is required");

        let newGuestList = [...(config.guestList || [])];

        if (currentGuest) {
            // Update existing
            newGuestList = newGuestList.map(g => g.timestamp === currentGuest.timestamp ? { ...g, ...guestForm } : g);
            toast.success("Guest updated");
        } else {
            // Add new
            const newGuest = { ...guestForm, timestamp: new Date().toISOString() };
            newGuestList.push(newGuest);
            toast.success("Guest added");
        }

        updateConfig('guestList', newGuestList);
        setGuestModalMode('none');
    };

    const updateGuestStatus = async (guest, newStatus) => {
        const isMatch = (g) => {
            if (g.timestamp && guest.timestamp) return g.timestamp === guest.timestamp;
            return g.name === guest.name && g.email === guest.email;
        };

        const newGuestList = config.guestList.map(g => {
            if (!isMatch(g)) return g;

            if (newStatus === 'undecided') {
                return { ...g, adminStatus: null };
            }
            const adminStatus = newStatus === 'yes' ? 'approved' : 'rejected';
            return { ...g, adminStatus };
        });

        // Update local state
        updateConfig('guestList', newGuestList);

        const actionName = newStatus === 'yes' ? 'Approved' : newStatus === 'no' ? 'Rejected' : 'Reset';

        // Save immediately to DB if requested
        if (onSave) {
            try {
                toast.promise(
                    onSave({ ...config, guestList: newGuestList }),
                    {
                        loading: `Recording ${actionName}...`,
                        success: <b>Guest {actionName}!</b>,
                        error: <b>Failed to record.</b>,
                    }
                );
            } catch (err) {
                console.error("Quick save failed:", err);
            }
        } else {
            toast.success(`Guest ${actionName} (Unsaved)`);
        }
    };

    const restoreIndividual = (guest, nameToRestore) => {
        const isMatch = (g) => {
            if (g.timestamp && guest.timestamp) return g.timestamp === guest.timestamp;
            return g.name === guest.name && g.email === guest.email;
        };

        const newGuestList = config.guestList.map(g => {
            if (!isMatch(g)) return g;

            const newRejected = (g.rejectedIndividuals || []).filter(n => n !== nameToRestore);
            const newExtra = [...(g.extraGuestNames || []), nameToRestore];
            return {
                ...g,
                guests: (parseInt(g.guests) + 1).toString(),
                extraGuestNames: newExtra,
                rejectedIndividuals: newRejected
            };
        });

        updateConfig('guestList', newGuestList);

        if (onSave) {
            onSave({ ...config, guestList: newGuestList });
        }
        toast.success(`${nameToRestore} restored!`);
    };

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

    // IMAGE PROCESSING HELPER
    const processImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1280;
                    const MAX_HEIGHT = 1280;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to WebP with 60% quality (aggressive compression for Firestore)
                    const dataUrl = canvas.toDataURL('image/webp', 0.6);
                    resolve(dataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = async (e, key, index = null) => {
        const file = e.target.files[0];
        if (file) {
            const toastId = toast.loading("Compressing image...");
            try {
                const processedImage = await processImage(file);

                // Check size AFTER compression (Target < 800KB for Firestore safety)
                if (processedImage.length > 1000000) {
                    toast.error("Image is still too large. We need to compress it more or try a simpler photo.", { id: toastId });
                    return;
                }

                if (index !== null) {
                    const newGallery = [...config.galleryImages];
                    newGallery[index] = processedImage;
                    updateConfig('galleryImages', newGallery);
                } else {
                    updateConfig(key, processedImage);
                }
                toast.success("Image optimized & added!", { id: toastId });
            } catch (error) {
                console.error("Image processing failed:", error);
                toast.error("Failed to process image.", { id: toastId });
            }
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

    const updateEntourageGroup = (groupIndex, field, value) => {
        const newGroups = [...(config.entourageGroups || [])];
        newGroups[groupIndex] = { ...newGroups[groupIndex], [field]: value };
        updateConfig('entourageGroups', newGroups);
    };

    const updateEntourageName = (groupIndex, nameIndex, value) => {
        const newGroups = [...(config.entourageGroups || [])];
        const newNames = [...newGroups[groupIndex].names];
        newNames[nameIndex] = value;
        newGroups[groupIndex] = { ...newGroups[groupIndex], names: newNames };
        updateConfig('entourageGroups', newGroups);
    };

    const addEntourageName = (groupIndex) => {
        const newGroups = [...(config.entourageGroups || [])];
        newGroups[groupIndex] = {
            ...newGroups[groupIndex],
            names: [...newGroups[groupIndex].names, "New Name"]
        };
        updateConfig('entourageGroups', newGroups);
    };

    const removeEntourageName = (groupIndex, nameIndex) => {
        const newGroups = [...(config.entourageGroups || [])];
        const newNames = newGroups[groupIndex].names.filter((_, i) => i !== nameIndex);
        newGroups[groupIndex] = { ...newGroups[groupIndex], names: newNames };
        updateConfig('entourageGroups', newGroups);
    };

    const addEntourageGroup = () => {
        const newGroups = [...(config.entourageGroups || []), { title: "New Group", names: ["Member 1"] }];
        updateConfig('entourageGroups', newGroups);
    };

    const removeEntourageGroup = (index) => {
        if (confirm("Remove this entire group?")) {
            const newGroups = config.entourageGroups.filter((_, i) => i !== index);
            updateConfig('entourageGroups', newGroups);
        }
    };

    // Generic list helpers for Groomsmen/Bridesmaids
    const updateListItem = (listKey, index, value) => {
        const newList = [...(config[listKey] || [])];
        newList[index] = value;
        updateConfig(listKey, newList);
    };

    const addListItem = (listKey) => {
        const newList = [...(config[listKey] || []), "New Name"];
        updateConfig(listKey, newList);
    };

    const removeListItem = (listKey, index) => {
        const newList = (config[listKey] || []).filter((_, i) => i !== index);
        updateConfig(listKey, newList);
    };

    // Principal Sponsors Helpers
    const updatePrincipalSponsor = (index, field, value) => {
        const newList = [...(config.principalSponsors || [])];
        newList[index] = { ...newList[index], [field]: value };
        updateConfig('principalSponsors', newList);
    };

    const addPrincipalSponsor = () => {
        const newList = [...(config.principalSponsors || []), { mr: "Mr. Name", mrs: "Mrs. Name" }];
        updateConfig('principalSponsors', newList);
    };

    const removePrincipalSponsor = (index) => {
        const newList = (config.principalSponsors || []).filter((_, i) => i !== index);
        updateConfig('principalSponsors', newList);
    };

    // Secondary Sponsors Helpers
    const updateSecondarySponsor = (index, field, value) => {
        const newList = [...(config.secondarySponsors || [])];
        newList[index] = { ...newList[index], [field]: value };
        updateConfig('secondarySponsors', newList);
    };

    const addSecondarySponsor = () => {
        const newList = [...(config.secondarySponsors || []), { role: "Role", names: "Names" }];
        updateConfig('secondarySponsors', newList);
    };

    const removeSecondarySponsor = (index) => {
        const newList = (config.secondarySponsors || []).filter((_, i) => i !== index);
        updateConfig('secondarySponsors', newList);
    };

    // Bearers Helpers
    const updateBearer = (index, field, value) => {
        const newList = [...(config.bearers || [])];
        newList[index] = { ...newList[index], [field]: value };
        updateConfig('bearers', newList);
    };

    const addBearer = () => {
        const newList = [...(config.bearers || []), { role: "Role", name: "Name" }];
        updateConfig('bearers', newList);
    };

    const removeBearer = (index) => {
        const newList = (config.bearers || []).filter((_, i) => i !== index);
        updateConfig('bearers', newList);
    };

    // Color Palette Helpers
    const updateColor = (index, field, value) => {
        const newPalette = [...(config.colorPalette || [])];
        newPalette[index] = { ...newPalette[index], [field]: value };
        updateConfig('colorPalette', newPalette);
    };

    const addColor = () => {
        const newPalette = [...(config.colorPalette || []), { name: "New Color", hex: "#000000" }];
        updateConfig('colorPalette', newPalette);
    };

    const removeColor = (index) => {
        const newPalette = (config.colorPalette || []).filter((_, i) => i !== index);
        updateConfig('colorPalette', newPalette);
    };

    const saveCurrentAsPreset = () => {
        const name = prompt("Enter a name for this preset:");
        if (name) {
            const newPreset = { name, colors: config.colorPalette };
            const newSaved = [...(config.savedPalettes || []), newPreset];
            updateConfig('savedPalettes', newSaved);
            toast.success("Preset Saved!");
        }
    };

    const deletePreset = (index) => {
        if (confirm("Delete this saved preset?")) {
            const newSaved = (config.savedPalettes || []).filter((_, i) => i !== index);
            updateConfig('savedPalettes', newSaved);
            toast.success("Preset Deleted");
        }
    };

    const downloadCSV = () => {
        if (!config.guestList || config.guestList.length === 0) {
            toast.error("No guests to export");
            return;
        }
        const headers = ['Name', 'Guest Choice', 'Admin Status', 'GuestsCount', 'Email', 'Message', 'Rejected Individuals', 'FollowUp Date', 'Timestamp'];
        const csvContent = [
            headers.join(','),
            ...config.guestList.map(guest => {
                const extraNames = guest.extraGuestNames ? ` (+ ${guest.extraGuestNames.filter(n => n).join(', ')})` : '';
                return [
                    `"${guest.name}${extraNames}"`,
                    guest.attending,
                    guest.adminStatus || 'pending',
                    guest.guests,
                    guest.email || '',
                    `"${(guest.message || '').replace(/"/g, '""')}"`,
                    `"${(guest.rejectedIndividuals || []).join(', ')}"`,
                    guest.followUpDate || '',
                    guest.timestamp
                ].join(',')
            })
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `guest_list_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const filteredGuests = config.guestList?.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (g.email && g.email.toLowerCase().includes(searchTerm.toLowerCase()));

        if (statusFilter === 'all') return matchesSearch;
        if (statusFilter === 'rejected') return matchesSearch && (g.adminStatus === 'rejected' || (g.rejectedIndividuals?.length > 0));
        if (statusFilter === 'undecided') return matchesSearch && !g.adminStatus && g.attending === 'yes';
        if (statusFilter === 'yes') return matchesSearch && g.adminStatus === 'approved' && g.attending === 'yes';

        return matchesSearch && g.attending === statusFilter;
    }) || [];

    const stats = {
        totalSubmissions: config.guestList?.length || 0,
        totalHeads: (config.guestList || []).reduce((acc, g) => acc + (parseInt(g.guests) || 1) + (g.rejectedIndividuals?.length || 0), 0),

        attendingHeads: config.guestList?.filter(g => g.attending === 'yes' && g.adminStatus === 'approved').reduce((acc, g) => acc + (parseInt(g.guests) || 1), 0) || 0,

        pendingReviewHeads: config.guestList?.filter(g => g.attending === 'yes' && !g.adminStatus).reduce((acc, g) => acc + (parseInt(g.guests) || 1), 0) || 0,

        declinedByGuestHeads: config.guestList?.filter(g => g.attending === 'no').reduce((acc, g) => acc + (parseInt(g.guests) || 1), 0) || 0,

        rejectedByAdminHeads: (config.guestList || []).reduce((acc, g) => {
            const adminRejectedFull = g.adminStatus === 'rejected' ? (parseInt(g.guests) || 1) : 0;
            const specificallyRejected = g.rejectedIndividuals?.length || 0;
            return acc + adminRejectedFull + specificallyRejected;
        }, 0),
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

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
                    {/* Sidebar / Top Nav Mobile */}
                    <div className="relative w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#E6D2B5]/30 flex shrink-0 z-20">
                        {/* Scroll indicator shades for mobile */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 md:hidden opacity-50" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden opacity-50" />

                        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto md:overflow-x-visible w-full no-scrollbar md:pb-20">
                            {[
                                { id: 'guests', label: 'Guest List', shortLabel: 'Guests', icon: Users },
                                { id: 'planner', label: 'Planner', shortLabel: 'Plan', icon: ClipboardList },
                                { id: 'general', label: 'General', shortLabel: 'Gen', icon: Settings },
                                { id: 'story', label: 'Our Story', shortLabel: 'Story', icon: Heart },
                                { id: 'timeline', label: 'Timeline', shortLabel: 'Time', icon: Clock },
                                { id: 'events', label: 'Events', shortLabel: 'Events', icon: Calendar },
                                { id: 'entourage', label: 'Entourage', shortLabel: 'Entourage', icon: Star },
                                { id: 'colors', label: 'Palette', shortLabel: 'Palette', icon: Palette },
                                { id: 'rsvp', label: 'RSVP Config', shortLabel: 'RSVP', icon: Gift },
                                { id: 'images', label: 'Images', shortLabel: 'Imgs', icon: ImageIcon },
                                { id: 'systems', label: 'Systems', shortLabel: 'Sys', icon: Globe }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex-1 md:flex-none
                                        flex flex-col md:flex-row items-center justify-center md:justify-start 
                                        gap-1 md:gap-3 
                                        px-3 md:px-8 
                                        py-2 md:py-4 
                                        min-w-[70px] md:min-w-0
                                        text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest 
                                        transition-all whitespace-nowrap 
                                        border-b-2 md:border-b-0 md:border-l-4 
                                        ${activeTab === tab.id
                                            ? 'border-[#B08D55] bg-[#F9F4EF]/50 text-[#43342E]'
                                            : 'border-transparent text-[#8C7C72] hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <tab.icon size={activeTab === tab.id ? 18 : 16} className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`} />
                                    <span className="text-[9px] md:text-xs">
                                        <span className="hidden md:inline">{tab.label}</span>
                                        <span className="md:hidden">{tab.shortLabel}</span>
                                    </span>
                                </button>
                            ))}

                            <div className="p-2 md:p-4 md:mt-auto md:px-8 md:pb-4 min-w-[100px] md:min-w-0 flex items-center shrink-0">
                                <button
                                    onClick={handleResetRequest}
                                    className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 text-[9px] md:text-xs uppercase tracking-wider transition-all duration-300 w-full justify-center py-2 md:py-3 rounded-md min-w-[60px] ${resetConfirm ? 'bg-red-50 text-red-600 font-bold border border-red-200' : 'text-red-300 hover:text-red-500 hover:bg-red-50/50'}`}
                                >
                                    {resetConfirm ? <Trash2 size={14} className="animate-bounce" /> : <RefreshCw size={14} />}
                                    <span className="text-[8px] md:text-xs">{resetConfirm ? "Sure?" : "Reset"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#FAF9F6]">

                        {/* --- GUEST LIST TAB --- */}
                        {activeTab === 'guests' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E6D2B5]/30 pb-6 gap-4">
                                    <div className="shrink-0">
                                        <h3 className="font-serif text-2xl text-[#43342E] mb-1">Guest Management</h3>
                                        <p className="text-xs text-[#8C7C72]">Track RSVPs and manage your guest list</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="bg-white p-4 rounded border border-[#E6D2B5]/30 text-center">
                                        <p className="text-[10px] uppercase font-bold text-[#8C7C72] mb-1">Total Heads</p>
                                        <p className="font-serif text-2xl text-[#43342E]">{stats.totalHeads}</p>
                                        <p className="text-[9px] text-gray-400 mt-1">{stats.totalSubmissions} groups</p>
                                    </div>
                                    <div className="bg-white p-4 rounded border border-green-100 text-center">
                                        <p className="text-[10px] uppercase font-bold text-green-600 mb-1">Attending</p>
                                        <p className="font-serif text-2xl text-green-700">{stats.attendingHeads}</p>
                                        <p className="text-[9px] text-green-500/60 mt-1">Confirmed</p>
                                    </div>
                                    <div className="bg-white p-4 rounded border border-amber-100 text-center">
                                        <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">Pending</p>
                                        <p className="font-serif text-2xl text-amber-700">{stats.pendingReviewHeads}</p>
                                        <p className="text-[9px] text-amber-500/60 mt-1">Reviewing</p>
                                    </div>
                                    <div className="bg-white p-4 rounded border border-red-50 text-center">
                                        <p className="text-[10px] uppercase font-bold text-red-400 mb-1">Declined</p>
                                        <p className="font-serif text-2xl text-red-500">{stats.declinedByGuestHeads}</p>
                                        <p className="text-[9px] text-red-400/60 mt-1">By Guest</p>
                                    </div>
                                    <div className="bg-[#1F1815] p-4 rounded border border-black text-center">
                                        <p className="text-[10px] uppercase font-bold text-[#DBC1A7] mb-1">Rejected</p>
                                        <p className="font-serif text-2xl text-[#F9F4EF]">{stats.rejectedByAdminHeads}</p>
                                        <p className="text-[9px] text-[#DBC1A7]/60 mt-1">By Admin</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded border border-[#E6D2B5]/30 shadow-sm">
                                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                        <button onClick={downloadCSV} className="w-10 h-10 bg-[#43342E] text-white p-2 rounded-full flex items-center justify-center hover:bg-[#5D4B42] transition-colors shadow-sm" title="Export CSV">
                                            <Download size={18} />
                                        </button>
                                        <button onClick={() => openGuestModal(null, 'add')} className="w-10 h-10 bg-[#B08D55] text-white p-2 rounded-full flex items-center justify-center hover:bg-[#8C6B3F] transition-colors shadow-sm" title="Add Guest">
                                            <Plus size={18} />
                                        </button>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="h-10 bg-white border border-[#E6D2B5] text-[10px] uppercase font-bold tracking-wider px-4 py-2 rounded-full outline-none focus:border-[#B08D55] text-[#43342E] cursor-pointer hover:bg-gray-100 transition-colors shadow-sm min-w-[130px]"
                                        >
                                            <option value="all">All RSVP</option>
                                            <option value="yes">Attending</option>
                                            <option value="undecided">Pending Review</option>
                                            <option value="no">Guest Declined</option>
                                            <option value="rejected">Admin Rejected</option>
                                        </select>
                                    </div>
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C7C72]" size={14} />
                                        <input
                                            type="text"
                                            placeholder="Search guests..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="h-10 pl-11 pr-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] text-xs focus:outline-none focus:border-[#B08D55] w-full rounded-full shadow-inner placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                <div className="bg-white rounded border border-[#E6D2B5]/30 overflow-x-auto">
                                    <table className="w-full text-left min-w-[600px]">
                                        <thead className="bg-[#F9F4EF] text-[#B08D55] text-[10px] uppercase tracking-wider font-bold">
                                            <tr>
                                                <th className="p-4">Name</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Guests</th>
                                                <th className="p-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E6D2B5]/20 text-sm text-[#43342E]">
                                            {filteredGuests.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="p-8 text-center text-[#8C7C72] italic">No guests found.</td>
                                                </tr>
                                            ) : (
                                                filteredGuests.map((guest, idx) => (
                                                    <tr key={idx} className="hover:bg-[#FAF9F6]">
                                                        <td className="p-4 font-medium">
                                                            <div className="flex flex-col gap-1">
                                                                <span>{guest.name}</span>
                                                                {guest.extraGuestNames?.length > 0 && guest.extraGuestNames.some(n => n) && (
                                                                    <div className="text-[10px] text-gray-500 pl-2 border-l border-[#E6D2B5]">
                                                                        + {guest.extraGuestNames.filter(n => n).join(', ')}
                                                                    </div>
                                                                )}
                                                                {guest.rejectedIndividuals?.length > 0 && (
                                                                    <div className="flex flex-col gap-1 mt-1 pl-2 border-l border-red-200">
                                                                        {guest.rejectedIndividuals.map((name, i) => (
                                                                            <div key={i} className="flex items-center gap-2 group/item">
                                                                                <span className="text-[10px] text-red-400 bg-red-50/50 px-1.5 py-0.5 rounded flex items-center gap-1 leading-none uppercase font-bold">
                                                                                    <Slash size={8} /> Rejected: {name}
                                                                                </span>
                                                                                <button
                                                                                    onClick={() => restoreIndividual(guest, name)}
                                                                                    className="hidden group-hover/item:flex items-center gap-1 text-[9px] text-green-600 bg-white border border-green-100 px-1 rounded hover:bg-green-50"
                                                                                    title={`Restore ${name}`}
                                                                                >
                                                                                    <Check size={10} /> Restore
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            {guest.attending === 'no' ? (
                                                                <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold uppercase"><X size={12} /> Declined</span>
                                                            ) : guest.adminStatus === 'rejected' ? (
                                                                <span className="inline-flex items-center gap-1 text-white bg-black px-2 py-1 rounded text-xs font-bold uppercase"><Slash size={12} /> Rejected</span>
                                                            ) : guest.adminStatus === 'approved' ? (
                                                                <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold uppercase"><CheckCircle size={12} /> Approved</span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold uppercase"><AlertCircle size={12} /> Pending Review</span>
                                                            )}
                                                        </td>
                                                        <td className="p-4">{guest.guests}</td>

                                                        <td className="p-4 text-right flex justify-end gap-2">
                                                            {(guest.attending === 'yes' || guest.adminStatus) && (
                                                                <>
                                                                    {guest.adminStatus !== 'approved' && (
                                                                        <button onClick={() => updateGuestStatus(guest, 'yes')} className="text-green-500 hover:text-green-700 p-1 bg-green-50 hover:bg-green-100 rounded" title="Approve"><Check size={16} /></button>
                                                                    )}
                                                                    {guest.adminStatus !== 'rejected' && (
                                                                        <button onClick={() => updateGuestStatus(guest, 'no')} className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded" title="Reject"><X size={16} /></button>
                                                                    )}
                                                                    {guest.adminStatus && (
                                                                        <button onClick={() => updateGuestStatus(guest, 'undecided')} className="text-amber-500 hover:text-amber-700 p-1 bg-amber-50 hover:bg-amber-100 rounded" title="Reset Status"><RefreshCw size={14} /></button>
                                                                    )}
                                                                    <div className="w-[1px] h-4 bg-gray-200 mx-1 self-center"></div>
                                                                </>
                                                            )}
                                                            <button onClick={() => openGuestModal(guest, 'view')} className="text-blue-400 hover:text-blue-600 p-1" title="View Details"><Eye size={16} /></button>
                                                            <button onClick={() => deleteGuest(guest)} className="text-gray-400 hover:text-red-600 p-1" title="Delete"><Trash2 size={16} /></button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        )}

                        {/* Guest Modal (View/Edit/Add) */}
                        {guestModalMode !== 'none' && (
                            <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                                <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                                    <div className="bg-[#F9F4EF] px-6 py-4 border-b border-[#E6D2B5] flex justify-between items-center">
                                        <h3 className="font-serif text-lg text-[#43342E]">
                                            {guestModalMode === 'add' ? 'Add New Guest' : guestModalMode === 'edit' ? 'Edit Guest' : 'Guest Details'}
                                        </h3>
                                        <div className="flex gap-2">
                                            {guestModalMode === 'view' && (
                                                <button onClick={() => setGuestModalMode('edit')} className="text-[#B08D55] hover:text-[#43342E] flex items-center gap-1 text-xs uppercase font-bold mr-2">
                                                    <Edit2 size={14} /> Edit
                                                </button>
                                            )}
                                            <button onClick={() => setGuestModalMode('none')} className="text-[#8C7C72] hover:text-[#43342E]"><X size={20} /></button>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {/* View Mode: Read Only Display */}
                                        {guestModalMode === 'view' ? (
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
                                                <div className="text-xs text-gray-400 text-right">Registered: {new Date(currentGuest?.timestamp).toLocaleString()}</div>
                                            </div>
                                        ) : (
                                            /* Edit/Add Mode: Form */
                                            <>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Full Name</label>
                                                    <input type="text" value={guestForm.name} onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })} className="admin-input" placeholder="Guest Name" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Attending?</label>
                                                        <select value={guestForm.attending} onChange={(e) => setGuestForm({ ...guestForm, attending: e.target.value })} className="admin-input">
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
                                                            className="admin-input"
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
                                                                    className="admin-input text-xs"
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
                                                    <input type="email" value={guestForm.email} onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })} className="admin-input" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Message / Notes</label>
                                                    <textarea value={guestForm.message} onChange={(e) => setGuestForm({ ...guestForm, message: e.target.value })} className="admin-input h-20" />
                                                </div>
                                                <button onClick={saveGuest} className="w-full bg-[#43342E] text-white py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#5D4B42] transition-colors">
                                                    {guestModalMode === 'edit' ? 'Update Guest' : 'Add Guest'}
                                                </button>
                                            </>
                                        )}
                                    </div>
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
                                                    <div className="flex gap-2">
                                                        <label className="cursor-pointer bg-white border border-[#E6D2B5] px-3 py-2 text-[10px] uppercase font-bold hover:bg-[#FAF9F6] flex items-center justify-center gap-2 w-full md:w-fit transition-colors">
                                                            <Upload size={12} /> Upload Icon
                                                            <input type="file" className="hidden" accept="image/png,image/x-icon,image/jpeg" onChange={(e) => handleImageChange(e, 'faviconUrl')} />
                                                        </label>
                                                        {config.faviconUrl && (
                                                            <button
                                                                onClick={() => updateConfig('faviconUrl', '')}
                                                                className="px-3 py-2 border border-red-200 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                                title="Remove Favicon"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        )}
                                                    </div>
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
                                                    <div className="flex gap-2">
                                                        <label className="cursor-pointer bg-white border border-[#E6D2B5] text-[#43342E] px-4 py-2 text-xs uppercase font-bold hover:bg-[#FAF9F6] flex items-center justify-center gap-2 w-fit">
                                                            <Upload size={14} /> Upload Logo Image
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'logoImage')} />
                                                        </label>
                                                        {config.logoImage && (
                                                            <button
                                                                onClick={() => updateConfig('logoImage', '')}
                                                                className="px-3 py-2 border border-red-200 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                                title="Remove Logo"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
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

                        {/* --- TIMELINE TAB --- */}
                        {activeTab === 'timeline' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center border-b border-[#E6D2B5]/30 pb-4">
                                    <div>
                                        <h3 className="font-serif text-2xl text-[#43342E] mb-2">Wedding Day Timeline</h3>
                                        <p className="text-xs text-[#8C7C72]">Manage the flow of your wedding day program</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newItem = { time: "00:00 AM", title: "New Event", description: "Event description" };
                                            updateConfig('timeline', [...(config.timeline || []), newItem]);
                                        }}
                                        className="bg-[#B08D55] text-white px-4 py-2 rounded-full text-xs uppercase font-bold flex items-center gap-2 hover:bg-[#8C6B3F] transition-colors"
                                    >
                                        <Plus size={14} /> Add Event
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {config.timeline?.map((item, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 shadow-sm relative group">
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        const newTimeline = config.timeline.filter((_, i) => i !== idx);
                                                        updateConfig('timeline', newTimeline);
                                                    }}
                                                    className="text-red-300 hover:text-red-500 p-1"
                                                    title="Remove Event"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="grid md:grid-cols-12 gap-4">
                                                <div className="md:col-span-3">
                                                    <label className="block text-[10px] uppercase font-bold text-[#B08D55] mb-1">Time</label>
                                                    <input
                                                        type="text"
                                                        value={item.time}
                                                        onChange={(e) => {
                                                            const newTimeline = [...config.timeline];
                                                            newTimeline[idx] = { ...item, time: e.target.value };
                                                            updateConfig('timeline', newTimeline);
                                                        }}
                                                        className="w-full bg-[#FAF9F6] border border-[#E6D2B5]/30 p-2 rounded text-[#43342E] font-medium"
                                                        placeholder="e.g. 3:00 PM"
                                                    />
                                                </div>
                                                <div className="md:col-span-4">
                                                    <label className="block text-[10px] uppercase font-bold text-[#B08D55] mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => {
                                                            const newTimeline = [...config.timeline];
                                                            newTimeline[idx] = { ...item, title: e.target.value };
                                                            updateConfig('timeline', newTimeline);
                                                        }}
                                                        className="w-full bg-[#FAF9F6] border border-[#E6D2B5]/30 p-2 rounded text-[#43342E] font-serif"
                                                        placeholder="Event Title"
                                                    />
                                                </div>
                                                <div className="md:col-span-12 mt-2">
                                                    <label className="block text-[10px] uppercase font-bold text-[#B08D55] mb-2">Event Icon</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ICON_OPTIONS.map((opt) => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => {
                                                                    const newTimeline = [...config.timeline];
                                                                    newTimeline[idx] = { ...item, icon: opt.id };
                                                                    updateConfig('timeline', newTimeline);
                                                                }}
                                                                className={`p-2 rounded border flex items-center gap-2 text-xs transition-all ${item.icon === opt.id ? 'bg-[#B08D55] text-white border-[#B08D55]' : 'bg-white border-[#E6D2B5]/50 text-[#8C7C72] hover:border-[#B08D55]'}`}
                                                                title={opt.label}
                                                            >
                                                                <opt.icon size={14} />
                                                                <span className="hidden sm:inline">{opt.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="md:col-span-5">
                                                    <label className="block text-[10px] uppercase font-bold text-[#B08D55] mb-1">Description</label>
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => {
                                                            const newTimeline = [...config.timeline];
                                                            newTimeline[idx] = { ...item, description: e.target.value };
                                                            updateConfig('timeline', newTimeline);
                                                        }}
                                                        className="w-full bg-[#FAF9F6] border border-[#E6D2B5]/30 p-2 rounded text-[#43342E] text-sm"
                                                        placeholder="Short description"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                                        <button
                                            onClick={() => {
                                                const newEvents = [...(config.events || []), {
                                                    title: "New Event",
                                                    time: "Date & Time",
                                                    description: "Event description.",
                                                    location: "Location Name",
                                                    mapLink: "https://maps.google.com"
                                                }];
                                                updateConfig('events', newEvents);
                                            }}
                                            className="bg-[#B08D55] text-white px-3 md:px-4 py-2 rounded-full text-[10px] md:text-xs uppercase font-bold flex items-center gap-2 hover:bg-[#8C6B3F] transition-colors"
                                        >
                                            <Plus size={14} /> <span className="hidden md:inline">Add Event</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    {config.events?.map((event, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative group">
                                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Delete this event?')) {
                                                            const newEvents = config.events.filter((_, i) => i !== idx);
                                                            updateConfig('events', newEvents);
                                                        }
                                                    }}
                                                    className="bg-white text-red-300 hover:text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                                                    title="Delete Event"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3 mb-4 text-[#B08D55] justify-between">
                                                <div className="flex items-center gap-3">
                                                    {idx === 0 && <Music size={20} />}
                                                    {idx === 1 && <Heart size={20} />}
                                                    {idx === 2 && <Clock size={20} />}
                                                    <span className="text-xs uppercase font-bold tracking-wider">Event {idx + 1}</span>
                                                </div>
                                                <label className="cursor-pointer text-xs text-[#8C7C72] hover:text-[#B08D55] flex items-center gap-2">
                                                    <ImageIcon size={14} /> Change Image
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const processed = await processImage(file);
                                                                // Check size logic is duplicated here or we rely on processImage?
                                                                // processImage handles compression but the size check TOAST was in handleImageChange.
                                                                // We should add the check here too.
                                                                if (processed.length > 1000000) {
                                                                    toast.error("Image is too large for the database.");
                                                                    return;
                                                                }
                                                                const newEvents = [...config.events];
                                                                newEvents[idx] = { ...event, image: processed };
                                                                updateConfig('events', newEvents);
                                                                toast.success("Event image updated!");
                                                            }
                                                        }}
                                                    />
                                                    {/* NOTE: handleImageChange needs to support (e, key, index) where key is 'events' not 'image' directly if specific index... wait. handleImageChange logic:
                                                        if (index !== null) { ... updates 'galleryImages' ... } 
                                                        I need to update handleImageChange or make a specific one for events? 
                                                        Actually, let's look at handleImageChange again. It's specific to Gallery.
                                                        I should inline the logic or create a helper or just use a new handler.
                                                        Let's inline a simple handler for now or update processImage usage.
                                                     */}
                                                </label>
                                            </div>

                                            {/* Image Preview */}
                                            <div className="w-full h-32 bg-[#FAF9F6] border border-[#E6D2B5]/30 rounded mb-4 overflow-hidden relative group/img">
                                                {event.image ? (
                                                    <img src={event.image} alt="Event Context" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#E6D2B5]">
                                                        <ImageIcon size={32} opacity={0.5} />
                                                    </div>
                                                )}
                                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold cursor-pointer uppercase tracking-widest gap-2">
                                                    <Upload size={14} /> Upload Details Photo
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const processed = await processImage(file);
                                                                const newEvents = [...config.events];
                                                                newEvents[idx] = { ...event, image: processed };
                                                                updateConfig('events', newEvents);
                                                            }
                                                        }}
                                                    />
                                                </label>
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

                        {activeTab === 'colors' && (
                            <div className="space-y-6 animate-fade-in">
                                <h3 className="font-serif text-lg text-[#43342E] border-b border-[#E6D2B5]/30 pb-2">Color Palette</h3>

                                {/* Presets Section */}
                                <div className="bg-[#F9F4EF] p-4 rounded-lg border border-[#E6D2B5]">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-[10px] font-bold text-[#B08D55] uppercase">Quick Presets (Group Palette)</label>
                                        <button onClick={saveCurrentAsPreset} className="text-[10px] font-bold text-[#43342E] uppercase hover:underline flex items-center gap-1">
                                            <Save size={10} /> Save Current as Preset
                                        </button>
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                        {/* Built-in Presets */}
                                        {[
                                            { name: "Rustic", colors: [{ name: "Dusty Rose", hex: "#E6D2B5" }, { name: "Sage", hex: "#8C9E8C" }, { name: "Terracotta", hex: "#C76D55" }, { name: "Cream", hex: "#FDFBF7" }, { name: "Charcoal", hex: "#43342E" }] },
                                            { name: "Elegant", colors: [{ name: "Navy", hex: "#1B263B" }, { name: "Gold", hex: "#D4AF37" }, { name: "Ivory", hex: "#FFFFF0" }, { name: "Slate", hex: "#778DA9" }, { name: "Silver", hex: "#C0C0C0" }] },
                                            { name: "Garden", colors: [{ name: "Lilac", hex: "#C8A2C8" }, { name: "Soft Pink", hex: "#FFB7B2" }, { name: "Mint", hex: "#98FF98" }, { name: "Peach", hex: "#FFE5B4" }, { name: "Cream", hex: "#FFFDD0" }] },
                                            { name: "Boho", colors: [{ name: "Burnt Orange", hex: "#CC5500" }, { name: "Mustard", hex: "#FFDB58" }, { name: "Brown", hex: "#964B00" }, { name: "Beige", hex: "#F5F5DC" }, { name: "Olive", hex: "#808000" }] },
                                            { name: "Minimal", colors: [{ name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" }, { name: "Grey", hex: "#808080" }, { name: "Gold", hex: "#FFD700" }, { name: "Tan", hex: "#D2B48C" }] }
                                        ].map((preset, i) => (
                                            <button
                                                key={`builtin-${i}`}
                                                onClick={() => {
                                                    if (confirm(`Apply "${preset.name}" preset?`)) {
                                                        updateConfig('colorPalette', preset.colors);
                                                    }
                                                }}
                                                className="shrink-0 bg-white border border-[#E6D2B5]/50 px-3 py-2 rounded shadow-sm hover:shadow-md hover:border-[#B08D55] transition-all text-left min-w-[120px]"
                                            >
                                                <div className="text-xs font-bold text-[#43342E] mb-2">{preset.name}</div>
                                                <div className="flex gap-1">
                                                    {preset.colors.map((c, ci) => (
                                                        <div key={ci} className="w-3 h-3 rounded-full border border-gray-100" style={{ backgroundColor: c.hex }}></div>
                                                    ))}
                                                </div>
                                            </button>
                                        ))}

                                        {/* User Saved Presets */}
                                        {config.savedPalettes?.map((preset, i) => (
                                            <div key={`saved-${i}`} className="relative group shrink-0">
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Apply "${preset.name}" preset?`)) {
                                                            updateConfig('colorPalette', preset.colors);
                                                        }
                                                    }}
                                                    className="bg-white border border-[#E6D2B5] px-3 py-2 rounded shadow-sm hover:shadow-md hover:border-[#B08D55] transition-all text-left min-w-[120px] h-full"
                                                >
                                                    <div className="text-xs font-bold text-[#43342E] mb-2 flex justify-between">
                                                        {preset.name}
                                                        <span className="text-[9px] text-gray-400 font-normal italic ml-1">(Custom)</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {preset.colors.map((c, ci) => (
                                                            <div key={ci} className="w-3 h-3 rounded-full border border-gray-100" style={{ backgroundColor: c.hex }}></div>
                                                        ))}
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => deletePreset(i)}
                                                    className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Delete Preset"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {config.colorPalette?.map((color, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-[#E6D2B5]/50 flex items-center gap-4 shadow-sm">
                                            <div className="relative group">
                                                <input
                                                    type="color"
                                                    value={color.hex}
                                                    onChange={(e) => updateColor(idx, 'hex', e.target.value)}
                                                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    type="text"
                                                    value={color.name}
                                                    onChange={(e) => updateColor(idx, 'name', e.target.value)}
                                                    className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm font-medium text-[#43342E]"
                                                    placeholder="Color Name (e.g. Sage)"
                                                />
                                                <input
                                                    type="text"
                                                    value={color.hex}
                                                    onChange={(e) => updateColor(idx, 'hex', e.target.value)}
                                                    className="w-full bg-[#FAF9F6] p-1 border border-[#E6D2B5]/30 text-xs text-gray-500 uppercase tracking-widest font-mono"
                                                    placeholder="#HEX"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeColor(idx)}
                                                className="text-gray-300 hover:text-red-400 p-2 transition-colors"
                                                title="Remove Color"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={addColor}
                                        className="bg-[#FAF9F6] border-2 border-dashed border-[#E6D2B5] rounded-lg flex flex-col items-center justify-center p-6 text-[#B08D55] hover:bg-[#E6D2B5]/10 transition-colors min-h-[100px]"
                                    >
                                        <Plus size={24} className="mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Add Color</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'entourage' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center border-b border-[#E6D2B5]/30 pb-2">
                                    <h3 className="font-serif text-lg text-[#43342E]">Wedding Entourage</h3>
                                    <div className="flex gap-4">
                                        <div className="group">
                                            <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Title</label>
                                            <input type="text" value={config.entourageTitle || ''} onChange={(e) => updateConfig('entourageTitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" placeholder="The Entourage" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Subtitle</label>
                                            <input type="text" value={config.entourageSubtitle || ''} onChange={(e) => updateConfig('entourageSubtitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" placeholder="Wedding Party" />
                                        </div>
                                    </div>
                                </div>



                                <div className="grid md:grid-cols-2 gap-8 p-6 bg-white rounded-lg border border-[#E6D2B5]">
                                    <div className="group">
                                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Parents of the Groom</label>
                                        <input
                                            type="text"
                                            value={config.groomParents || ''}
                                            onChange={(e) => updateConfig('groomParents', e.target.value)}
                                            className="admin-input font-serif text-lg text-center"
                                            placeholder="Mr. & Mrs. Name"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Parents of the Bride</label>
                                        <input
                                            type="text"
                                            value={config.brideParents || ''}
                                            onChange={(e) => updateConfig('brideParents', e.target.value)}
                                            className="admin-input font-serif text-lg text-center"
                                            placeholder="Mr. & Mrs. Name"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 p-6 bg-[#F9F4EF] rounded-lg border border-[#E6D2B5]">
                                    <div className="group">
                                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Maid of Honor</label>
                                        <input
                                            type="text"
                                            value={config.maidOfHonor || ''}
                                            onChange={(e) => updateConfig('maidOfHonor', e.target.value)}
                                            className="admin-input font-serif text-lg text-center"
                                            placeholder="Name Here"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Best Man</label>
                                        <input
                                            type="text"
                                            value={config.bestMan || ''}
                                            onChange={(e) => updateConfig('bestMan', e.target.value)}
                                            className="admin-input font-serif text-lg text-center"
                                            placeholder="Name Here"
                                        />
                                    </div>
                                </div>



                                {/* Bridesmaids & Groomsmen Editors */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Bridesmaids */}
                                    <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50">
                                        <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Bridesmaids</h4>
                                        <div className="space-y-2">
                                            {config.bridesmaids?.map((name, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => updateListItem('bridesmaids', i, e.target.value)}
                                                        className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                                                    />
                                                    <button onClick={() => removeListItem('bridesmaids', i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => addListItem('bridesmaids')} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Bridesmaid</button>
                                        </div>
                                    </div>

                                    {/* Groomsmen */}
                                    <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50">
                                        <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Groomsmen</h4>
                                        <div className="space-y-2">
                                            {config.groomsmen?.map((name, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => updateListItem('groomsmen', i, e.target.value)}
                                                        className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                                                    />
                                                    <button onClick={() => removeListItem('groomsmen', i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => addListItem('groomsmen')} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Groomsman</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Principal Sponsors Editor */}
                                <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative">
                                    <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Principal Sponsors</h4>
                                    <div className="space-y-3">
                                        <div className="flex gap-4 px-2 text-[10px] font-bold text-[#8C7C72] uppercase tracking-wider">
                                            <div className="flex-1 text-center">Mr.</div>
                                            <div className="flex-1 text-center">Mrs.</div>
                                            <div className="w-8"></div>
                                        </div>
                                        {config.principalSponsors?.map((pair, i) => (
                                            <div key={i} className="flex gap-4 items-center">
                                                <input
                                                    type="text"
                                                    value={pair.mr}
                                                    onChange={(e) => updatePrincipalSponsor(i, 'mr', e.target.value)}
                                                    className="flex-1 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm md:text-right"
                                                    placeholder="Mr. Name"
                                                />
                                                <span className="text-[#B08D55] font-bold">&</span>
                                                <input
                                                    type="text"
                                                    value={pair.mrs}
                                                    onChange={(e) => updatePrincipalSponsor(i, 'mrs', e.target.value)}
                                                    className="flex-1 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                                                    placeholder="Mrs. Name"
                                                />
                                                <button onClick={() => removePrincipalSponsor(i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                                            </div>
                                        ))}
                                        <button onClick={addPrincipalSponsor} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1 justify-center w-full py-2 border border-dashed border-[#E6D2B5]"><Plus size={12} /> Add Sponsor Pair</button>
                                    </div>
                                </div>

                                {/* Secondary Sponsors & Bearers */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative">
                                        <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Secondary Sponsors</h4>
                                        <div className="space-y-2">
                                            {config.secondarySponsors?.map((item, i) => (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <input type="text" value={item.role} onChange={(e) => updateSecondarySponsor(i, 'role', e.target.value)} className="w-1/3 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-xs font-bold text-[#8C7C72]" placeholder="Role" />
                                                    <input type="text" value={item.names} onChange={(e) => updateSecondarySponsor(i, 'names', e.target.value)} className="w-2/3 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm" placeholder="Names" />
                                                    <button onClick={() => removeSecondarySponsor(i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                                                </div>
                                            ))}
                                            <button onClick={addSecondarySponsor} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Secondary Sponsor</button>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative">
                                        <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Bearers</h4>
                                        <div className="space-y-2">
                                            {config.bearers?.map((item, i) => (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <input type="text" value={item.role} onChange={(e) => updateBearer(i, 'role', e.target.value)} className="w-1/3 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-xs font-bold text-[#8C7C72]" placeholder="Role" />
                                                    <input type="text" value={item.name} onChange={(e) => updateBearer(i, 'name', e.target.value)} className="w-2/3 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm" placeholder="Name" />
                                                    <button onClick={() => removeBearer(i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                                                </div>
                                            ))}
                                            <button onClick={addBearer} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Bearer</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Flower Girls & Offertory */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative">
                                        <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Flower Girls</h4>
                                        <div className="space-y-2">
                                            {config.flowerGirls?.map((name, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <input type="text" value={name} onChange={(e) => updateListItem('flowerGirls', i, e.target.value)} className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm" />
                                                    <button onClick={() => removeListItem('flowerGirls', i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => addListItem('flowerGirls')} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Flower Girl</button>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative">
                                        <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Offertory</h4>
                                        <div className="space-y-2">
                                            {config.offertory?.map((name, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <input type="text" value={name} onChange={(e) => updateListItem('offertory', i, e.target.value)} className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm" />
                                                    <button onClick={() => removeListItem('offertory', i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => addListItem('offertory')} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Offertory</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    {config.entourageGroups?.map((group, groupIdx) => (
                                        <div key={groupIdx} className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative group">
                                            <button
                                                onClick={() => removeEntourageGroup(groupIdx)}
                                                className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                                title="Remove Group"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <div className="mb-4 pr-8">
                                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Group Title (e.g. Bridesmaids)</label>
                                                <input
                                                    type="text"
                                                    value={group.title}
                                                    onChange={(e) => updateEntourageGroup(groupIdx, 'title', e.target.value)}
                                                    className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 font-serif text-lg"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Members</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {group.names.map((name, nameIdx) => (
                                                        <div key={nameIdx} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={name}
                                                                onChange={(e) => updateEntourageName(groupIdx, nameIdx, e.target.value)}
                                                                className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                                                            />
                                                            <button
                                                                onClick={() => removeEntourageName(groupIdx, nameIdx)}
                                                                className="text-gray-300 hover:text-red-400 p-2"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => addEntourageName(groupIdx)}
                                                    className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"
                                                >
                                                    <Plus size={12} /> Add Member
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addEntourageGroup} className="w-full py-4 border-2 border-dashed border-[#E6D2B5] text-[#B08D55] uppercase text-xs font-bold tracking-widest hover:bg-[#E6D2B5]/10 transition-colors flex items-center justify-center gap-2">
                                        <Plus size={16} /> Add New Group
                                    </button>
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

                        {/* --- SYSTEMS TAB --- */}
                        {activeTab === 'systems' && (
                            <div className="space-y-8 animate-fade-in max-w-2xl">
                                <div className="border-b border-[#E6D2B5]/30 pb-6">
                                    <h3 className="font-serif text-2xl text-[#43342E] mb-1">System Settings</h3>
                                    <p className="text-xs text-[#8C7C72]">Manage global website features and system behavior</p>
                                </div>

                                <div className="bg-white rounded border border-[#E6D2B5]/30 overflow-hidden shadow-sm">
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-[#43342E] mb-1">Opening Screen</h4>
                                                <p className="text-xs text-[#8C7C72]">Show a landing screen before the main website content</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newValue = !config.showOpeningScreen;
                                                    updateConfig('showOpeningScreen', newValue);
                                                    if (onSave) onSave({ ...config, showOpeningScreen: newValue });
                                                    toast.success(`Opening Screen ${newValue ? 'Enabled' : 'Disabled'}`);
                                                }}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${config.showOpeningScreen ? 'bg-[#C5A059]' : 'bg-gray-200'}`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.showOpeningScreen ? 'translate-x-6' : 'translate-x-1'}`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-[#FAF9F6]">
                                        <div className="flex items-start gap-4 text-[#8C7C72]">
                                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                            <div className="text-xs space-y-2">
                                                <p>Disabling the <strong>Opening Screen</strong> will skip the initial invitation animation and take guests directly to the Home page.</p>
                                                <p>This is useful if you want a faster loading experience for returning visitors.</p>
                                            </div>
                                        </div>
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