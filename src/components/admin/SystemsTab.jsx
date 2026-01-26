import React from 'react';
import { RefreshCw, AlertCircle, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const SystemsTab = ({ config, updateConfig, onSave, handleResetRequest, resetConfirm }) => {
    return (
        <div className="space-y-8 animate-fade-in max-w-2xl">
            <div className="border-b border-[#E6D2B5]/30 pb-6">
                <h3 className="font-serif text-2xl text-[#43342E] mb-1">System Settings</h3>
                <p className="text-xs text-[#8C7C72]">Manage global website features and system behavior</p>
            </div>

            {/* Opening Screen Toggle */}
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

            {/* Global Cache Refresh */}
            <div className="bg-white rounded border border-[#E6D2B5]/30 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-[#43342E] mb-1">Global Guest Refresh</h4>
                        <p className="text-xs text-[#8C7C72]">Force all guest browsers to reload the latest data</p>
                    </div>
                </div>

                <div className="p-6 bg-[#FAF9F6] space-y-4">
                    <div className="flex items-start gap-4 text-[#8C7C72]">
                        <RefreshCw size={18} className="shrink-0 mt-0.5" />
                        <div className="text-xs space-y-2">
                            <p>If you made changes and some guests still see "old" information, you can trigger a <strong>Global Refresh</strong>.</p>
                            <p>This will force every guest's website to automatically refresh exactly once to fetch the latest database updates.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const syncId = Date.now().toString();
                            updateConfig('syncId', syncId);
                            if (onSave) {
                                toast.promise(
                                    onSave({ ...config, syncId }),
                                    {
                                        loading: 'Broadcasting Refresh signal...',
                                        success: <b>Broadcast Sent Successfully!</b>,
                                        error: <b>Failed to broadcast.</b>,
                                    }
                                );
                            }
                        }}
                        className="w-full py-4 rounded font-bold uppercase tracking-widest text-xs bg-[#43342E] text-white hover:bg-[#5D4B42] transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                        <RefreshCw size={14} />
                        Trigger Global Refresh
                    </button>
                    <p className="text-[10px] text-center text-[#8C7C72]">Last Synchronized: {config.syncId ? new Date(parseInt(config.syncId)).toLocaleString() : 'Never'}</p>
                </div>
            </div>

            {/* Debug & Diagnostics */}
            <div className="bg-white rounded border border-[#E6D2B5]/30 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-[#43342E] mb-1">Debug & Diagnostics</h4>
                        <p className="text-xs text-[#8C7C72]">Verify database synchronization status</p>
                    </div>
                </div>

                <div className="p-6 bg-[#FAF9F6] space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 border border-[#E6D2B5]/30 rounded">
                            <label className="block text-[8px] font-bold text-[#B08D55] uppercase mb-1">Sync Version (Timestamp)</label>
                            <p className="text-[10px] font-mono text-[#43342E] truncate" title={config.lastSaved}>
                                {config.lastSaved ? new Date(config.lastSaved).toLocaleString() : 'Never Saved'}
                            </p>
                        </div>
                        <div className="bg-white p-3 border border-[#E6D2B5]/30 rounded">
                            <label className="block text-[8px] font-bold text-[#B08D55] uppercase mb-1">Status</label>
                            <p className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Live Connection
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Raw Configuration Data (JSON)</label>
                        <div className="relative group">
                            <pre className="text-[9px] bg-[#1F1815] text-[#A8D8B9] p-4 rounded h-40 overflow-auto no-scrollbar font-mono leading-relaxed ring-1 ring-inset ring-white/10">
                                {JSON.stringify(config, null, 2)}
                            </pre>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                                        toast.success("JSON copied to clipboard");
                                    }}
                                    className="bg-white/10 hover:bg-white/20 text-white p-1 rounded backdrop-blur-sm"
                                    title="Copy JSON"
                                >
                                    <Database size={12} />
                                </button>
                            </div>
                        </div>
                        <p className="text-[8px] text-[#8C7C72]">This shows the exact data currently held in the app's memory. When you click "Save Changes", this is what is sent to Firestore.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemsTab;
