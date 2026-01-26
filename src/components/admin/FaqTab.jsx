import React, { useState } from 'react';
import { Plus, Trash2, HelpCircle, Edit2, MessageCircleQuestion } from 'lucide-react';
import toast from 'react-hot-toast';
import GenericItemModal from './GenericItemModal';

const FaqTab = ({ config, updateConfig }) => {
    const faqs = config.faqs || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [currentData, setCurrentData] = useState(null);

    const openModal = (index = null) => {
        if (index !== null) {
            setEditingIndex(index);
            setCurrentData(faqs[index]);
        } else {
            setEditingIndex(null);
            setCurrentData({ question: "", answer: "" });
        }
        setIsModalOpen(true);
    };

    const handleSave = (formData) => {
        let newFaqs;
        if (editingIndex !== null) {
            newFaqs = faqs.map((faq, i) => i === editingIndex ? formData : faq);
        } else {
            newFaqs = [...faqs, formData];
        }
        updateConfig('faqs', newFaqs);
        setIsModalOpen(false);
        toast.success(editingIndex !== null ? "FAQ updated successfully!" : "New FAQ added!");
    };

    const handleRemoveFaq = (index) => {
        if (confirm("Delete this FAQ? This action cannot be undone.")) {
            const newFaqs = faqs.filter((_, i) => i !== index);
            updateConfig('faqs', newFaqs);
            toast.success("FAQ removed.");
        }
    };

    const faqFields = [
        { name: 'question', label: 'Question', type: 'text', placeholder: 'e.g. What is the dress code?' },
        { name: 'answer', label: 'Answer', type: 'textarea', placeholder: 'e.g. The dress code is Semi-Formal...' }
    ];

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="border-b border-[#E6D2B5]/30 pb-4 flex justify-between items-end">
                <div>
                    <h3 className="font-serif text-2xl text-[#43342E] mb-1">FAQ Manager</h3>
                    <p className="text-xs text-[#8C7C72]">Answers you want your guests to know ahead of time</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#43342E] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#5D4B42] transition-all shadow-md active:scale-95"
                >
                    <Plus size={16} /> Add Question
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FAF9F6] p-6 rounded-xl border border-[#E6D2B5]/30 space-y-4">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase tracking-widest ml-1">Section Header</label>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={config.faqsTitle || ''}
                            onChange={(e) => updateConfig('faqsTitle', e.target.value)}
                            className="admin-input rounded-lg"
                            placeholder="e.g. Frequently Asked Questions"
                        />
                        <input
                            type="text"
                            value={config.faqsSubtitle || ''}
                            onChange={(e) => updateConfig('faqsSubtitle', e.target.value)}
                            className="admin-input rounded-lg"
                            placeholder="e.g. Everything You Need to Know"
                        />
                    </div>
                </div>

                <div className="bg-[#FFF9F2] p-6 rounded-xl border border-[#E6D2B5]/30 flex flex-col justify-center text-center">
                    <div className="bg-white p-3 rounded-full w-fit mx-auto shadow-sm mb-3">
                        <MessageCircleQuestion className="text-[#B08D55]" size={24} />
                    </div>
                    <p className="text-xs text-[#8C7C72] italic leading-relaxed">
                        Tip: Clear FAQs help reduce direct messages from guests. Keep answers concise and helpful.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white px-6 py-5 rounded-xl border border-[#E6D2B5]/30 shadow-sm hover:shadow-md transition-all group flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#B08D55] ring-1 ring-[#E6D2B5]/10 shrink-0 font-serif">
                                {idx + 1}
                            </div>
                            <div className="truncate">
                                <h4 className="text-sm font-bold text-[#43342E] truncate mb-0.5">{faq.question || 'Untitled Question'}</h4>
                                <p className="text-[10px] text-[#8C7C72] italic truncate pr-4">{faq.answer || 'No answer provided yet...'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => openModal(idx)}
                                className="p-2 text-[#B08D55] hover:bg-[#F9F4EF] rounded-lg transition-colors"
                                title="Edit FAQ"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleRemoveFaq(idx)}
                                className="p-2 text-red-300 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete FAQ"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {faqs.length === 0 && (
                    <div className="py-16 text-center border-2 border-dashed border-[#E6D2B5]/30 rounded-2xl bg-[#FAF9F6]/50">
                        <HelpCircle className="mx-auto text-[#E6D2B5] mb-4" size={40} />
                        <p className="text-[#8C7C72] text-sm italic">No FAQ items yet. Click "Add Question" to get started.</p>
                    </div>
                )}
            </div>

            <GenericItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={currentData}
                fields={faqFields}
                title={editingIndex !== null ? 'Edit FAQ' : 'New FAQ'}
                description={editingIndex !== null ? 'Update this question and answer' : 'Add a new frequently asked question'}
            />
        </div>
    );
};

export default FaqTab;
