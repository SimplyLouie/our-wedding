import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    Settings, Save, X, Loader
} from 'lucide-react';

// Modular Components
import AdminSidebar from './admin/AdminSidebar';
import GuestModal from './admin/GuestModal';
import GuestsTab from './admin/GuestsTab';
import PlannerTab from './admin/PlannerTab';
import DetailsTab from './admin/DetailsTab';
import StoryTab from './admin/StoryTab';
import TimelineTab from './admin/TimelineTab';
import EventsTab from './admin/EventsTab';
import EntourageTab from './admin/EntourageTab';
import PaletteTab from './admin/PaletteTab';
import RsvpConfigTab from './admin/RsvpConfigTab';
import ImagesTab from './admin/ImagesTab';
import SystemsTab from './admin/SystemsTab';
import OrganizerTab from './admin/OrganizerTab';
import RegistryTab from './admin/RegistryTab';
import MapTab from './admin/MapTab';
import GuestbookTab from './admin/GuestbookTab';
import WeatherTab from './admin/WeatherTab';
import FaqTab from './admin/FaqTab';

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
                onSave(config),
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
                    toast.error("Image is too large. We need to compress it more or try a simpler photo.", { id: toastId });
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
        const newStory = config.story.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        updateConfig('story', newStory);
    };

    const addStoryItem = () => {
        const newItem = { date: "New Date", title: "New Milestone", description: "Description here..." };
        const newStory = [...(config.story || []), newItem];
        updateConfig('story', newStory);
    };

    const removeStoryItem = (index) => {
        const newStory = (config.story || []).filter((_, i) => i !== index);
        updateConfig('story', newStory);
    };

    const updateEvent = (index, field, value) => {
        const newEvents = config.events.map((event, i) =>
            i === index ? { ...event, [field]: value } : event
        );
        updateConfig('events', newEvents);
    };

    const deleteGuest = (guestToDelete) => {
        if (confirm('Remove this guest?')) {
            const newGuests = (config.guestList || []).filter(g => g.timestamp !== guestToDelete.timestamp);
            updateConfig('guestList', newGuests);
        }
    };

    const updateEntourageGroup = (groupIndex, field, value) => {
        const newGroups = (config.entourageGroups || []).map((group, i) =>
            i === groupIndex ? { ...group, [field]: value } : group
        );
        updateConfig('entourageGroups', newGroups);
    };

    const updateEntourageName = (groupIndex, nameIndex, value) => {
        const newGroups = (config.entourageGroups || []).map((group, i) => {
            if (i !== groupIndex) return group;
            const newNames = group.names.map((name, j) => j === nameIndex ? value : name);
            return { ...group, names: newNames };
        });
        updateConfig('entourageGroups', newGroups);
    };

    const addEntourageName = (groupIndex) => {
        const newGroups = (config.entourageGroups || []).map((group, i) => {
            if (i !== groupIndex) return group;
            return { ...group, names: [...group.names, "New Name"] };
        });
        updateConfig('entourageGroups', newGroups);
    };

    const removeEntourageName = (groupIndex, nameIndex) => {
        const newGroups = (config.entourageGroups || []).map((group, i) => {
            if (i !== groupIndex) return group;
            const newNames = group.names.filter((_, j) => j !== nameIndex);
            return { ...group, names: newNames };
        });
        updateConfig('entourageGroups', newGroups);
    };

    const addEntourageGroup = () => {
        const newGroups = [...(config.entourageGroups || []), { title: "New Group", names: ["Member 1"] }];
        updateConfig('entourageGroups', newGroups);
    };

    const removeEntourageGroup = (index) => {
        if (confirm("Remove this entire group?")) {
            const newGroups = (config.entourageGroups || []).filter((_, i) => i !== index);
            updateConfig('entourageGroups', newGroups);
        }
    };

    // Generic list helpers for Groomsmen/Bridesmaids
    const updateListItem = (listKey, index, value) => {
        const newList = (config[listKey] || []).map((item, i) => i === index ? value : item);
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
        const newList = (config.principalSponsors || []).map((sponsor, i) =>
            i === index ? { ...sponsor, [field]: value } : sponsor
        );
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
        const newList = (config.secondarySponsors || []).map((sponsor, i) =>
            i === index ? { ...sponsor, [field]: value } : sponsor
        );
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
        const newList = (config.bearers || []).map((bearer, i) =>
            i === index ? { ...bearer, [field]: value } : bearer
        );
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
        const newPalette = (config.colorPalette || []).map((color, i) =>
            i === index ? { ...color, [field]: value } : color
        );
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

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    <AdminSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        handleResetRequest={handleResetRequest}
                        resetConfirm={resetConfirm}
                    />

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                        {activeTab === 'guests' && (
                            <GuestsTab
                                stats={stats}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                filteredGuests={filteredGuests}
                                openGuestModal={openGuestModal}
                                updateGuestStatus={updateGuestStatus}
                                restoreIndividual={restoreIndividual}
                                downloadCSV={downloadCSV}
                                deleteGuest={deleteGuest}
                            />
                        )}
                        {activeTab === 'planner' && <PlannerTab config={config} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} />}
                        {activeTab === 'general' && <DetailsTab config={config} updateConfig={updateConfig} handleImageChange={handleImageChange} />}
                        {activeTab === 'story' && <StoryTab config={config} updateConfig={updateConfig} updateStory={updateStory} addStoryItem={addStoryItem} removeStoryItem={removeStoryItem} />}
                        {activeTab === 'timeline' && <TimelineTab config={config} updateConfig={updateConfig} />}
                        {activeTab === 'events' && <EventsTab config={config} updateConfig={updateConfig} updateEvent={updateEvent} processImage={processImage} />}
                        {activeTab === 'entourage' && (
                            <EntourageTab
                                config={config}
                                updateConfig={updateConfig}
                                updateListItem={updateListItem}
                                addListItem={addListItem}
                                removeListItem={removeListItem}
                                updatePrincipalSponsor={updatePrincipalSponsor}
                                addPrincipalSponsor={addPrincipalSponsor}
                                removePrincipalSponsor={removePrincipalSponsor}
                                updateSecondarySponsor={updateSecondarySponsor}
                                addSecondarySponsor={addSecondarySponsor}
                                removeSecondarySponsor={removeSecondarySponsor}
                                updateBearer={updateBearer}
                                addBearer={addBearer}
                                removeBearer={removeBearer}
                                updateEntourageGroup={updateEntourageGroup}
                                updateEntourageName={updateEntourageName}
                                addEntourageName={addEntourageName}
                                removeEntourageName={removeEntourageName}
                                addEntourageGroup={addEntourageGroup}
                                removeEntourageGroup={removeEntourageGroup}
                            />
                        )}
                        {activeTab === 'colors' && (
                            <PaletteTab
                                config={config}
                                updateConfig={updateConfig}
                                saveCurrentAsPreset={saveCurrentAsPreset}
                                deletePreset={deletePreset}
                                updateColor={updateColor}
                                addColor={addColor}
                                removeColor={removeColor}
                            />
                        )}
                        {activeTab === 'rsvp' && <RsvpConfigTab config={config} updateConfig={updateConfig} />}
                        {activeTab === 'images' && <ImagesTab config={config} handleImageChange={handleImageChange} handleUrlChange={handleUrlChange} />}
                        {activeTab === 'organizer' && <OrganizerTab config={config} updateConfig={updateConfig} />}
                        {activeTab === 'registry' && <RegistryTab config={config} updateConfig={updateConfig} />}
                        {activeTab === 'map' && <MapTab config={config} updateConfig={updateConfig} />}
                        {activeTab === 'weather' && <WeatherTab config={config} updateConfig={updateConfig} />}
                        {activeTab === 'faq' && <FaqTab config={config} updateConfig={updateConfig} />}
                        {activeTab === 'guestbook' && <GuestbookTab config={config} updateConfig={updateConfig} />}
                        {activeTab === 'systems' && (
                            <SystemsTab
                                config={config}
                                updateConfig={updateConfig}
                                onSave={onSave}
                                handleResetRequest={handleResetRequest}
                                resetConfirm={resetConfirm}
                            />
                        )}
                    </div>
                </div>

                <GuestModal
                    mode={guestModalMode}
                    guestForm={guestForm}
                    setGuestForm={setGuestForm}
                    onClose={() => setGuestModalMode('none')}
                    onSave={saveGuest}
                    onEdit={() => setGuestModalMode('edit')}
                    currentGuest={currentGuest}
                />
            </div>
        </div>
    );
};

export default AdminPanel;