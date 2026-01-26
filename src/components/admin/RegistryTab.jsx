import React, { useState } from 'react';
import { Plus, Trash2, CreditCard, Wallet, Link as LinkIcon, AlertCircle, Settings, QrCode, Edit2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import GenericItemModal from './GenericItemModal';

const RegistryTab = ({ config, updateConfig }) => {
    const registryItems = config.registryItems || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const openModal = (index = null) => {
        if (index !== null) {
            setEditingIndex(index);
            setCurrentData(registryItems[index]);
        } else {
            setEditingIndex(null);
            setCurrentData({
                type: 'bank',
                accountName: "",
                accountNumber: "",
                bankName: "New Option",
                qrCode: "",
                label: "Bank Transfer",
                url: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = (formData) => {
        let newItems;
        if (editingIndex !== null) {
            newItems = registryItems.map((item, i) => i === editingIndex ? formData : item);
        } else {
            newItems = [...registryItems, formData];
        }
        updateConfig('registryItems', newItems);
        setIsModalOpen(false);
        toast.success(editingIndex !== null ? "Registry item updated!" : "Registry item added!");
    };

    const removeItem = (index) => {
        if (confirm("Are you sure you want to remove this registry option? This cannot be undone.")) {
            const newItems = registryItems.filter((_, i) => i !== index);
            updateConfig('registryItems', newItems);
            toast.success("Item removed from registry.");
        }
    };

    const registryFields = [
        {
            name: 'type',
            label: 'Option Type',
            type: 'select',
            options: [
                { label: 'Bank Account', value: 'bank' },
                { label: 'E-Wallet', value: 'ewallet' },
                { label: 'External Link', value: 'link' }
            ]
        },
        { name: 'label', label: 'Display Label', type: 'text', placeholder: 'e.g. Amazon Wedding Registry' },
        {
            name: 'bankName',
            label: currentData?.type === 'link' ? 'Website Name' : 'Bank / Provider Name',
            type: 'text',
            placeholder: 'e.g. BDO, GCash, or Amazon'
        },
        {
            name: 'url',
            label: 'Registry Link',
            type: 'text',
            icon: <LinkIcon size={18} />,
            placeholder: 'https://...',
            helpText: 'Only used for External Link types'
        },
        { name: 'accountName', label: 'Account Name', type: 'text', placeholder: 'Full Name' },
        { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: '0000 0000 0000' },
        {
            name: 'qrCode',
            label: currentData?.type === 'link' ? 'Logo / Poster' : 'QR Code',
            type: 'image'
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="border-b border-[#E6D2B5]/30 pb-4 flex justify-between items-end">
                <div>
                    <h3 className="font-serif text-2xl text-[#43342E] mb-1">Gift Registry</h3>
                    <p className="text-xs text-[#8C7C72]">Setup bank details, e-wallets, or external links for your guests.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#43342E] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#5D4B42] transition-all shadow-md active:scale-95"
                >
                    <Plus size={16} /> Add Option
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Registry Summary Cards */}
                {registryItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E6D2B5]/30 shadow-sm hover:shadow-md transition-all group animate-fade-in">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-[#FAF9F6] rounded-xl text-[#B08D55] ring-1 ring-[#E6D2B5]/10">
                                {item.type === 'link' ? <ExternalLink size={20} /> : item.type === 'ewallet' ? <Wallet size={20} /> : <CreditCard size={20} />}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openModal(idx)}
                                    className="p-2 text-[#B08D55] hover:bg-[#F9F4EF] rounded-lg transition-colors"
                                    title="Edit Item"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => removeItem(idx)}
                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove Item"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h4 className="font-serif text-lg text-[#43342E] leading-tight truncate">{item.bankName}</h4>
                        <p className="text-[10px] uppercase tracking-widest text-[#B08D55] font-bold mb-4">{item.label}</p>

                        <div className="pt-4 border-t border-[#FAF9F6] flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {item.qrCode && (
                                    <img src={item.qrCode} alt="Preview" className="w-8 h-8 rounded-full border-2 border-white object-cover bg-white ring-1 ring-gray-100" />
                                )}
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-[#8C7C72]">{item.type}</span>
                        </div>
                    </div>
                ))}

                {registryItems.length === 0 && (
                    <div className="md:col-span-2 lg:col-span-3 py-16 text-center border-2 border-dashed border-[#E6D2B5]/30 rounded-2xl bg-[#FAF9F6]/50">
                        <div className="bg-white p-4 rounded-full w-fit mx-auto shadow-sm mb-4">
                            <AlertCircle className="text-[#E6D2B5]" size={32} />
                        </div>
                        <p className="text-[#8C7C72] text-sm italic">No registry items added yet. Click "Add Option" to get started.</p>
                    </div>
                )}
            </div>

            {/* Global Settings Section */}
            <div className="bg-[#FAF9F6] p-8 rounded-2xl border border-[#E6D2B5]/30 space-y-6">
                <h4 className="text-xs font-bold text-[#43342E] uppercase tracking-widest flex items-center gap-2">
                    <Settings className="text-[#B08D55]" size={16} /> Global Section Header
                </h4>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#B08D55] font-bold ml-1">Section Title</label>
                        <input
                            type="text"
                            value={config.registryTitle || ''}
                            onChange={(e) => updateConfig('registryTitle', e.target.value)}
                            className="admin-input rounded-xl"
                            placeholder="Gift Registry"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#B08D55] font-bold ml-1">Section Subtitle</label>
                        <input
                            type="text"
                            value={config.registrySubtitle || ''}
                            onChange={(e) => updateConfig('registrySubtitle', e.target.value)}
                            className="admin-input rounded-xl"
                            placeholder="Love & Support"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#B08D55] font-bold ml-1">Introduction Message</label>
                        <textarea
                            value={config.registryInstruction || ''}
                            onChange={(e) => updateConfig('registryInstruction', e.target.value)}
                            className="admin-input rounded-xl h-24 resize-none"
                            placeholder="A short message for your guests about your registry preferences..."
                        />
                    </div>
                </div>
            </div>

            {/* Reusable Modal */}
            <GenericItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={currentData}
                fields={registryFields}
                title={editingIndex !== null ? 'Edit Registry Option' : 'New Registry Option'}
                description={editingIndex !== null ? 'Update your banking or registry details' : 'Add a new way for guests to send gifts'}
            />

            <div className="bg-[#FFF9F2] p-4 rounded-lg border border-[#E6D2B5]/50 flex gap-3 text-xs text-[#8C7C72]">
                <AlertCircle className="text-[#B08D55] shrink-0" size={18} />
                <p><strong>Registry Tip:</strong> Most couples prefer showing Bank Details and E-Wallets primarily, but you can lead guests to external registries using the "External Link" option.</p>
            </div>
        </div>
    );
};

export default RegistryTab;
