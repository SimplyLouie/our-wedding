import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

const AdminLoginModal = ({ onClose, onLogin, error }) => {
    const [adminPass, setAdminPass] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(adminPass);
        setAdminPass("");
    };

    return (
        <div className="fixed inset-0 z-[70] bg-[#1F1815]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white p-8 md:p-10 max-w-sm w-full text-center shadow-2xl border-t-4 border-[#B08D55] animate-in zoom-in-95 duration-300">
                <div className="flex justify-center mb-4"><ShieldAlert size={48} className="text-[#B08D55]" strokeWidth={1} /></div>
                <h3 className="font-serif text-3xl mb-2 text-[#43342E]">Planner Access</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Password"
                        className={`w-full border-b p-3 text-center tracking-[0.2em] text-xl focus:outline-none mb-8 transition-colors ${error ? 'border-red-500 text-red-500 animate-shake placeholder-red-300' : 'border-[#E6D2B5] focus:border-[#43342E] text-[#43342E]'}`}
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        autoFocus
                    />
                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 bg-[#43342E] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[#5D4B42] active:scale-95 transition-all">Enter</button>
                        <button type="button" onClick={onClose} className="flex-1 bg-transparent text-[#8C7C72] py-4 uppercase text-xs font-bold tracking-widest hover:text-[#43342E] transition-colors">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginModal;
