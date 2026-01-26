import React from 'react';
import {
    Download, Plus, Search, Slash, Check,
    CheckCircle, AlertCircle, X, RefreshCw, Eye, Trash2
} from 'lucide-react';

const GuestsTab = ({
    stats,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    filteredGuests,
    openGuestModal,
    updateGuestStatus,
    restoreIndividual,
    downloadCSV,
    deleteGuest
}) => {
    return (
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
    );
};

export default GuestsTab;
