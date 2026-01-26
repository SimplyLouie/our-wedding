import React from 'react';
import { Plus, Check, X } from 'lucide-react';

const PlannerTab = ({ config, addNote, updateNote, deleteNote }) => {
    return (
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
                {(!config.notes || config.notes.length === 0) && (
                    <div className="text-center py-12 bg-white rounded border border-dashed border-[#E6D2B5]/50">
                        <p className="text-[#8C7C72] italic text-sm">No notes yet. Start planning by adding your first note!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlannerTab;
