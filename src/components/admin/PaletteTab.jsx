import React from 'react';
import { Save, X, Plus } from 'lucide-react';

const PaletteTab = ({
    config,
    updateConfig,
    saveCurrentAsPreset,
    deletePreset,
    updateColor,
    addColor,
    removeColor
}) => {
    const builtinPresets = [
        { name: "Rustic", colors: [{ name: "Dusty Rose", hex: "#E6D2B5" }, { name: "Sage", hex: "#8C9E8C" }, { name: "Terracotta", hex: "#C76D55" }, { name: "Cream", hex: "#FDFBF7" }, { name: "Charcoal", hex: "#43342E" }] },
        { name: "Elegant", colors: [{ name: "Navy", hex: "#1B263B" }, { name: "Gold", hex: "#D4AF37" }, { name: "Ivory", hex: "#FFFFF0" }, { name: "Slate", hex: "#778DA9" }, { name: "Silver", hex: "#C0C0C0" }] },
        { name: "Garden", colors: [{ name: "Lilac", hex: "#C8A2C8" }, { name: "Soft Pink", hex: "#FFB7B2" }, { name: "Mint", hex: "#98FF98" }, { name: "Peach", hex: "#FFE5B4" }, { name: "Cream", hex: "#FFFDD0" }] },
        { name: "Boho", colors: [{ name: "Burnt Orange", hex: "#CC5500" }, { name: "Mustard", hex: "#FFDB58" }, { name: "Brown", hex: "#964B00" }, { name: "Beige", hex: "#F5F5DC" }, { name: "Olive", hex: "#808000" }] },
        { name: "Minimal", colors: [{ name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" }, { name: "Grey", hex: "#808080" }, { name: "Gold", hex: "#FFD700" }, { name: "Tan", hex: "#D2B48C" }] }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="font-serif text-lg text-[#43342E] border-b border-[#E6D2B5]/30 pb-2">Color Palette</h3>

            {/* Presets Section */}
            <div className="bg-[#F9F4EF] p-4 rounded-lg border border-[#E6D2B5]">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold text-[#B08D55] uppercase">Quick Presets (Group Palette)</label>
                    <button onClick={saveCurrentAsPreset} className="text-[10px] font-bold text-[#43342E] uppercase hover:underline flex items-center gap-1">
                        <Save size={10} /> Save Current as Preset
                    </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {/* Built-in Presets */}
                    {builtinPresets.map((preset, i) => (
                        <button
                            key={`builtin-${i}`}
                            onClick={() => {
                                if (confirm(`Apply "${preset.name}" preset?`)) {
                                    updateConfig('colorPalette', preset.colors);
                                }
                            }}
                            className="shrink-0 bg-white border border-[#E6D2B5]/50 px-3 py-2 rounded shadow-sm hover:shadow-md hover:border-[#B08D55] transition-all text-left min-w-[120px]"
                        >
                            <div className="text-xs font-bold text-[#43342E] mb-2">{preset.name}</div>
                            <div className="flex gap-1">
                                {preset.colors.map((c, ci) => (
                                    <div key={ci} className="w-3 h-3 rounded-full border border-gray-100" style={{ backgroundColor: c.hex }}></div>
                                ))}
                            </div>
                        </button>
                    ))}

                    {/* User Saved Presets */}
                    {config.savedPalettes?.map((preset, i) => (
                        <div key={`saved-${i}`} className="relative group shrink-0">
                            <button
                                onClick={() => {
                                    if (confirm(`Apply "${preset.name}" preset?`)) {
                                        updateConfig('colorPalette', preset.colors);
                                    }
                                }}
                                className="bg-white border border-[#E6D2B5] px-3 py-2 rounded shadow-sm hover:shadow-md hover:border-[#B08D55] transition-all text-left min-w-[120px] h-full"
                            >
                                <div className="text-xs font-bold text-[#43342E] mb-2 flex justify-between">
                                    {preset.name}
                                    <span className="text-[9px] text-gray-400 font-normal italic ml-1">(Custom)</span>
                                </div>
                                <div className="flex gap-1">
                                    {preset.colors.map((c, ci) => (
                                        <div key={ci} className="w-3 h-3 rounded-full border border-gray-100" style={{ backgroundColor: c.hex }}></div>
                                    ))}
                                </div>
                            </button>
                            <button
                                onClick={() => deletePreset(i)}
                                className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Preset"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.colorPalette?.map((color, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-[#E6D2B5]/50 flex items-center gap-4 shadow-sm">
                        <div className="relative group">
                            <input
                                type="color"
                                value={color.hex}
                                onChange={(e) => updateColor(idx, 'hex', e.target.value)}
                                className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                value={color.name}
                                onChange={(e) => updateColor(idx, 'name', e.target.value)}
                                className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm font-medium text-[#43342E]"
                                placeholder="Color Name (e.g. Sage)"
                            />
                            <input
                                type="text"
                                value={color.hex}
                                onChange={(e) => updateColor(idx, 'hex', e.target.value)}
                                className="w-full bg-[#FAF9F6] p-1 border border-[#E6D2B5]/30 text-xs text-gray-500 uppercase tracking-widest font-mono"
                                placeholder="#HEX"
                            />
                        </div>
                        <button
                            onClick={() => removeColor(idx)}
                            className="text-gray-300 hover:text-red-400 p-2 transition-colors"
                            title="Remove Color"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={addColor}
                    className="bg-[#FAF9F6] border-2 border-dashed border-[#E6D2B5] rounded-lg flex flex-col items-center justify-center p-6 text-[#B08D55] hover:bg-[#E6D2B5]/10 transition-colors min-h-[100px]"
                >
                    <Plus size={24} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest">Add Color</span>
                </button>
            </div>

            {/* Dress Code Management */}
            <div className="bg-[#FAF9F6] p-6 rounded-lg border border-[#E6D2B5] space-y-4">
                <h4 className="font-serif text-lg text-[#43342E] mb-2">Attire Details</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#B08D55] uppercase">Dress Code Title</label>
                        <input
                            type="text"
                            value={config.dressCode || ''}
                            onChange={(e) => updateConfig('dressCode', e.target.value)}
                            className="w-full bg-white p-2 border border-[#E6D2B5]/30 text-sm"
                            placeholder="e.g. Semi-Formal Attire"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#B08D55] uppercase">Description</label>
                        <textarea
                            value={config.dressCodeDescription || ''}
                            onChange={(e) => updateConfig('dressCodeDescription', e.target.value)}
                            className="w-full bg-white p-2 border border-[#E6D2B5]/30 text-sm min-h-[80px]"
                            placeholder="Brief instruction for your guests"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaletteTab;
