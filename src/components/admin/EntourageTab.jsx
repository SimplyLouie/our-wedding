import React from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

const EntourageTab = ({
    config,
    updateConfig,
    updateListItem,
    addListItem,
    removeListItem,
    updatePrincipalSponsor,
    addPrincipalSponsor,
    removePrincipalSponsor,
    updateSecondarySponsor,
    addSecondarySponsor,
    removeSecondarySponsor,
    updateBearer,
    addBearer,
    removeBearer,
    updateEntourageGroup,
    updateEntourageName,
    addEntourageName,
    removeEntourageName,
    addEntourageGroup,
    removeEntourageGroup
}) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#E6D2B5]/30 pb-2">
                <h3 className="font-serif text-lg text-[#43342E]">Wedding Entourage</h3>
                <div className="flex gap-4">
                    <div className="group">
                        <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Title</label>
                        <input type="text" value={config.entourageTitle || ''} onChange={(e) => updateConfig('entourageTitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" placeholder="The Entourage" />
                    </div>
                    <div className="group">
                        <label className="block text-[8px] font-bold text-[#B08D55] uppercase">Subtitle</label>
                        <input type="text" value={config.entourageSubtitle || ''} onChange={(e) => updateConfig('entourageSubtitle', e.target.value)} className="border-none bg-transparent font-serif text-lg focus:outline-none text-right w-24 md:w-32" placeholder="Wedding Party" />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-6 bg-white rounded-lg border border-[#E6D2B5]">
                <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Parents of the Groom</label>
                    <input
                        type="text"
                        value={config.groomParents || ''}
                        onChange={(e) => updateConfig('groomParents', e.target.value)}
                        className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner font-serif text-lg text-center"
                        placeholder="Mr. & Mrs. Name"
                    />
                </div>
                <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Parents of the Bride</label>
                    <input
                        type="text"
                        value={config.brideParents || ''}
                        onChange={(e) => updateConfig('brideParents', e.target.value)}
                        className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner font-serif text-lg text-center"
                        placeholder="Mr. & Mrs. Name"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-6 bg-[#F9F4EF] rounded-lg border border-[#E6D2B5]">
                <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Maid of Honor</label>
                    <input
                        type="text"
                        value={config.maidOfHonor || ''}
                        onChange={(e) => updateConfig('maidOfHonor', e.target.value)}
                        className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner font-serif text-lg text-center"
                        placeholder="Name Here"
                    />
                </div>
                <div className="group">
                    <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-2">Best Man</label>
                    <input
                        type="text"
                        value={config.bestMan || ''}
                        onChange={(e) => updateConfig('bestMan', e.target.value)}
                        className="w-full h-10 px-4 py-2 bg-[#FAF9F6] border border-[#E6D2B5] focus:outline-none focus:border-[#B08D55] rounded-md shadow-inner font-serif text-lg text-center"
                        placeholder="Name Here"
                    />
                </div>
            </div>

            {/* Bridesmaids & Groomsmen Editors */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Bridesmaids */}
                <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50">
                    <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Bridesmaids</h4>
                    <div className="space-y-2">
                        {config.bridesmaids?.map((name, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => updateListItem('bridesmaids', i, e.target.value)}
                                    className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                                />
                                <button onClick={() => removeListItem('bridesmaids', i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                            </div>
                        ))}
                        <button onClick={() => addListItem('bridesmaids')} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Bridesmaid</button>
                    </div>
                </div>

                {/* Groomsmen */}
                <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50">
                    <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Groomsmen</h4>
                    <div className="space-y-2">
                        {config.groomsmen?.map((name, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => updateListItem('groomsmen', i, e.target.value)}
                                    className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                                />
                                <button onClick={() => removeListItem('groomsmen', i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                            </div>
                        ))}
                        <button onClick={() => addListItem('groomsmen')} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Groomsman</button>
                    </div>
                </div>
            </div>

            {/* Principal Sponsors Editor */}
            <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative">
                <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Principal Sponsors</h4>
                <div className="space-y-3">
                    <div className="flex gap-4 px-2 text-[10px] font-bold text-[#8C7C72] uppercase tracking-wider">
                        <div className="flex-1 text-center">Mr.</div>
                        <div className="flex-1 text-center">Mrs.</div>
                        <div className="w-8"></div>
                    </div>
                    {config.principalSponsors?.map((pair, i) => (
                        <div key={i} className="flex gap-4 items-center">
                            <input
                                type="text"
                                value={pair.mr}
                                onChange={(e) => updatePrincipalSponsor(i, 'mr', e.target.value)}
                                className="flex-1 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm md:text-right"
                                placeholder="Mr. Name"
                            />
                            <span className="text-[#B08D55] font-bold">&</span>
                            <input
                                type="text"
                                value={pair.mrs}
                                onChange={(e) => updatePrincipalSponsor(i, 'mrs', e.target.value)}
                                className="flex-1 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                                placeholder="Mrs. Name"
                            />
                            <button onClick={() => removePrincipalSponsor(i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                        </div>
                    ))}
                    <button onClick={addPrincipalSponsor} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1 justify-center w-full py-2 border border-dashed border-[#E6D2B5]"><Plus size={12} /> Add Sponsor Pair</button>
                </div>
            </div>

            {/* Secondary Sponsors & Bearers */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative">
                    <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Secondary Sponsors</h4>
                    <div className="space-y-2">
                        {config.secondarySponsors?.map((item, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input type="text" value={item.role} onChange={(e) => updateSecondarySponsor(i, 'role', e.target.value)} className="w-1/3 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-xs font-bold text-[#8C7C72]" placeholder="Role" />
                                <input type="text" value={item.names} onChange={(e) => updateSecondarySponsor(i, 'names', e.target.value)} className="w-2/3 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm" placeholder="Names" />
                                <button onClick={() => removeSecondarySponsor(i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                            </div>
                        ))}
                        <button onClick={addSecondarySponsor} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Secondary Sponsor</button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative">
                    <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Bearers</h4>
                    <div className="space-y-2">
                        {config.bearers?.map((item, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input type="text" value={item.role} onChange={(e) => updateBearer(i, 'role', e.target.value)} className="w-1/3 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-xs font-bold text-[#8C7C72]" placeholder="Role" />
                                <input type="text" value={item.name} onChange={(e) => updateBearer(i, 'name', e.target.value)} className="w-2/3 bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm" placeholder="Name" />
                                <button onClick={() => removeBearer(i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                            </div>
                        ))}
                        <button onClick={addBearer} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Bearer</button>
                    </div>
                </div>
            </div>

            {/* Flower Girls & Offertory */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative">
                    <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Flower Girls</h4>
                    <div className="space-y-2">
                        {config.flowerGirls?.map((name, i) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" value={name} onChange={(e) => updateListItem('flowerGirls', i, e.target.value)} className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm" />
                                <button onClick={() => removeListItem('flowerGirls', i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                            </div>
                        ))}
                        <button onClick={() => addListItem('flowerGirls')} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Flower Girl</button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative">
                    <h4 className="text-xs font-bold text-[#B08D55] uppercase mb-4">Offertory</h4>
                    <div className="space-y-2">
                        {config.offertory?.map((name, i) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" value={name} onChange={(e) => updateListItem('offertory', i, e.target.value)} className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm" />
                                <button onClick={() => removeListItem('offertory', i)} className="text-gray-300 hover:text-red-400 p-2"><X size={14} /></button>
                            </div>
                        ))}
                        <button onClick={() => addListItem('offertory')} className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"><Plus size={12} /> Add Offertory</button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {config.entourageGroups?.map((group, groupIdx) => (
                    <div key={groupIdx} className="bg-white p-6 rounded-lg border border-[#E6D2B5]/50 relative group">
                        <button
                            onClick={() => removeEntourageGroup(groupIdx)}
                            className="absolute top-4 right-4 text-red-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                            title="Remove Group"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="mb-4 pr-8">
                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Group Title (e.g. Bridesmaids)</label>
                            <input
                                type="text"
                                value={group.title}
                                onChange={(e) => updateEntourageGroup(groupIdx, 'title', e.target.value)}
                                className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 font-serif text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-[#B08D55] uppercase mb-1">Members</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {group.names.map((name, nameIdx) => (
                                    <div key={nameIdx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => updateEntourageName(groupIdx, nameIdx, e.target.value)}
                                            className="w-full bg-[#FAF9F6] p-2 border border-[#E6D2B5]/30 text-sm"
                                        />
                                        <button
                                            onClick={() => removeEntourageName(groupIdx, nameIdx)}
                                            className="text-gray-300 hover:text-red-400 p-2"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => addEntourageName(groupIdx)}
                                className="mt-2 text-[10px] uppercase font-bold text-[#B08D55] hover:text-[#43342E] flex items-center gap-1"
                            >
                                <Plus size={12} /> Add Member
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={addEntourageGroup} className="w-full py-4 border-2 border-dashed border-[#E6D2B5] text-[#B08D55] uppercase text-xs font-bold tracking-widest hover:bg-[#E6D2B5]/10 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Add New Group
                </button>
            </div>
        </div>
    );
};

export default EntourageTab;
