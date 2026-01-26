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

            {/* Database Initialization */}
            <div className="bg-white rounded border border-[#E6D2B5]/30 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-[#43342E] mb-1">Database Initialization</h4>
                        <p className="text-xs text-[#8C7C72]">Overwrite live database with local code defaults</p>
                    </div>
                </div>

                <div className="p-6 bg-[#FAF9F6] space-y-4">
                    <div className="flex items-start gap-4 text-[#8C7C72]">
                        <Database size={18} className="shrink-0 mt-0.5" />
                        <div className="text-xs space-y-2">
                            <p>This will <strong>overwrite</strong> all wedding details in the live database with the values currently defined in <code>defaultConfig.js</code>.</p>
                            <p className="font-bold text-red-600">Warning: This will not affect the guest list, but will reset all other sections like Story, Timeline, and Entourage.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleResetRequest}
                        className={`w-full py-4 rounded font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${resetConfirm
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-white border border-[#E6D2B5] text-[#43342E] hover:bg-[#F9F4EF]'
                            }`}
                    >
                        <RefreshCw size={14} className={resetConfirm ? 'animate-spin' : ''} />
                        {resetConfirm ? 'Confirm: Overwrite Live DB?' : 'Import from Local Code'}
                    </button>
                    {resetConfirm && (
                        <p className="text-[10px] text-center text-red-400 font-bold animate-fade-in">Click again to confirm. Reverts names, timeline, and story to code defaults.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemsTab;
