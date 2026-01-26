import React, { useState, useEffect } from 'react';
import { X, Upload, QrCode, Link as LinkIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const GenericItemModal = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    fields,
    title,
    description
}) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e, field) => {
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
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                    if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/webp', 0.7);
                handleChange(field, dataUrl);
                toast.success("Image uploaded!");
            };
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-[#FAF9F6] px-8 py-6 border-b border-[#E6D2B5]/30 flex justify-between items-center">
                    <div>
                        <h3 className="font-serif text-2xl text-[#43342E]">{title}</h3>
                        {description && <p className="text-[10px] text-[#8C7C72] uppercase tracking-widest mt-1">{description}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 text-[#8C7C72] hover:text-[#43342E] hover:bg-[#E6D2B5]/10 rounded-full transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#B08D55] font-bold ml-1">
                                {field.label}
                            </label>

                            {field.type === 'textarea' ? (
                                <textarea
                                    value={formData[field.name] || ''}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="admin-input rounded-xl h-24 resize-none"
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    value={formData[field.name] || ''}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className="admin-input rounded-xl"
                                >
                                    {field.options.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : field.type === 'image' ? (
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, field.name)}
                                        />
                                        <div className="border-2 border-dashed border-[#E6D2B5] rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-[#FAF9F6] transition-colors bg-[#FAF9F6]/50">
                                            {formData[field.name] ? (
                                                <div className="relative group/img">
                                                    <img src={formData[field.name]} alt="Preview" className="h-32 w-32 object-contain rounded-lg shadow-sm" />
                                                    <div className="absolute inset-0 bg-[#43342E]/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                        <Upload className="text-white" size={20} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <QrCode className="text-[#B08D55]/30" size={40} />
                                                    <span className="text-[10px] text-[#8C7C72] uppercase font-bold tracking-widest">Upload {field.label}</span>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                    {formData[field.name] && (
                                        <button
                                            onClick={() => handleChange(field.name, '')}
                                            className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            ) : field.type === 'icon_grid' ? (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {field.options.map(opt => {
                                        const IconComp = opt.icon;
                                        return (
                                            <button
                                                key={opt.value}
                                                onClick={() => handleChange(field.name, opt.value)}
                                                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all flex-1 min-w-[70px] ${formData[field.name] === opt.value ? 'bg-[#B08D55] text-white border-[#B08D55]' : 'bg-[#FAF9F6] border-[#E6D2B5]/30 text-[#8C7C72] hover:border-[#B08D55]'}`}
                                            >
                                                <IconComp size={20} />
                                                <span className="text-[8px] uppercase font-bold tracking-tighter">{opt.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="relative">
                                    {field.icon && (
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B08D55]/50">
                                            {field.icon}
                                        </div>
                                    )}
                                    <input
                                        type={field.type || 'text'}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        className={`admin-input rounded-xl ${field.icon ? 'pl-11' : ''}`}
                                    />
                                </div>
                            )}
                            {field.helpText && <p className="text-[9px] text-[#8C7C72] italic ml-1">{field.helpText}</p>}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-8 bg-[#FAF9F6] border-t border-[#E6D2B5]/30 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 border border-[#E6D2B5] text-[#8C7C72] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="flex-1 py-4 bg-[#43342E] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#5D4B42] transition-all shadow-lg active:scale-95"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenericItemModal;
