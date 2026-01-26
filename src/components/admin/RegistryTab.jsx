import React, { useState } from 'react';
import { Plus, Trash2, CreditCard, Wallet, Upload, Link as LinkIcon, AlertCircle, Settings, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const RegistryTab = ({ config, updateConfig }) => {
    const registryItems = config.registryItems || [];

    const updateItem = (index, field, value) => {
        const newItems = registryItems.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        updateConfig('registryItems', newItems);
    };

    const addItem = () => {
        const newItem = {
            type: 'bank',
            accountName: "",
            accountNumber: "",
            bankName: "New Bank/Wallet",
            qrCode: "",
            label: "Bank Transfer"
        };
        updateConfig('registryItems', [...registryItems, newItem]);
    };

    const removeItem = (index) => {
        if (confirm("Remove this registry item?")) {
            const newItems = registryItems.filter((_, i) => i !== index);
            updateConfig('registryItems', newItems);
        }
    };

    const handleImageChange = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
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
                const dataUrl = canvas.toDataURL('image/webp', 0.7);
                updateItem(index, 'qrCode', dataUrl);
                toast.success("QR Code uploaded!");
            };
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="border-b border-[#E6D2B5]/30 pb-4 flex justify-between items-end">
                <div>
                    <h3 className="font-serif text-2xl text-[#43342E] mb-1">Gift Registry</h3>
                    <p className="text-xs text-[#8C7C72]">Setup bank details or e-wallets with QR codes for guests.</p>
                </div>
                <button
                    onClick={addItem}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#43342E] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#5D4B42] transition-all shadow-md active:scale-95"
                >
                    <Plus size={16} /> Add Option
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Global Settings */}
                <div className="md:col-span-2 bg-[#FAF9F6] p-6 rounded-xl border border-[#E6D2B5]/30 space-y-4">
                    <h4 className="text-sm font-bold text-[#43342E] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Settings className="text-[#B08D55]" size={18} /> Section Header
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Title</label>
                            <input
                                type="text"
                                value={config.registryTitle || ''}
                                onChange={(e) => updateConfig('registryTitle', e.target.value)}
                                className="admin-input rounded-lg"
                                placeholder="Gift Registry"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Subtitle</label>
                            <input
                                type="text"
                                value={config.registrySubtitle || ''}
                                onChange={(e) => updateConfig('registrySubtitle', e.target.value)}
                                className="admin-input rounded-lg"
                                placeholder="Love & Support"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Instruction / Message</label>
                            <textarea
                                value={config.registryInstruction || ''}
                                onChange={(e) => updateConfig('registryInstruction', e.target.value)}
                                className="admin-input rounded-lg h-20 resize-none"
                                placeholder="A short message for your guests..."
                            />
                        </div>
                    </div>
                </div>

                {/* Registry Items */}
                {registryItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-[#E6D2B5]/30 shadow-sm relative group animate-fade-in">
                        <button
                            onClick={() => removeItem(idx)}
                            className="absolute -top-3 -right-3 p-2 bg-red-50 text-red-500 rounded-full border border-red-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Mode</label>
                                    <select
                                        value={item.type}
                                        onChange={(e) => updateItem(idx, 'type', e.target.value)}
                                        className="admin-input rounded-lg"
                                    >
                                        <option value="bank">Bank Account</option>
                                        <option value="ewallet">E-Wallet</option>
                                    </select>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Label</label>
                                    <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => updateItem(idx, 'label', e.target.value)}
                                        className="admin-input rounded-lg"
                                        placeholder="e.g. Bank Transfer"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Bank Name / Provider</label>
                                <input
                                    type="text"
                                    value={item.bankName}
                                    onChange={(e) => updateItem(idx, 'bankName', e.target.value)}
                                    className="admin-input rounded-lg font-bold"
                                    placeholder="e.g. BDO, GCash, Maya"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Account Name</label>
                                <input
                                    type="text"
                                    value={item.accountName}
                                    onChange={(e) => updateItem(idx, 'accountName', e.target.value)}
                                    className="admin-input rounded-lg"
                                    placeholder="Full Name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">Account Number</label>
                                <input
                                    type="text"
                                    value={item.accountNumber}
                                    onChange={(e) => updateItem(idx, 'accountNumber', e.target.value)}
                                    className="admin-input rounded-lg"
                                    placeholder="0000 0000 0000"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#8C7C72] ml-1">QR Code</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, idx)}
                                        />
                                        <div className="border-2 border-dashed border-[#E6D2B5] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-[#FAF9F6] transition-colors">
                                            {item.qrCode ? (
                                                <div className="relative group/img">
                                                    <img src={item.qrCode} alt="QR Preview" className="h-24 w-24 object-contain rounded-lg" />
                                                    <div className="absolute inset-0 bg-[#43342E]/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                        <Upload className="text-white" size={18} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <QrCode className="text-[#B08D55]/50" size={32} />
                                                    <span className="text-[10px] text-[#8C7C72] uppercase font-bold">Upload QR Code</span>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                    {item.qrCode && (
                                        <button
                                            onClick={() => updateItem(idx, 'qrCode', '')}
                                            className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            title="Remove QR Code"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {registryItems.length === 0 && (
                    <div className="md:col-span-2 py-12 text-center border-2 border-dashed border-[#E6D2B5]/30 rounded-2xl bg-[#FAF9F6]">
                        <div className="bg-white p-4 rounded-full w-fit mx-auto shadow-sm mb-4">
                            <AlertCircle className="text-[#E6D2B5]" size={32} />
                        </div>
                        <p className="text-[#8C7C72] text-sm italic">No registry items added yet. Click "Add Option" to get started.</p>
                    </div>
                )}
            </div>

            <div className="bg-[#FFF9F2] p-4 rounded-lg border border-[#E6D2B5]/50 flex gap-3 text-xs text-[#8C7C72]">
                <AlertCircle className="text-[#B08D55] shrink-0" size={18} />
                <p><strong>Note:</strong> QR codes are compressed for faster loading. Ensure the QR remains scannable after upload.</p>
            </div>
        </div>
    );
};

export default RegistryTab;
