import React from 'react';
import { ScrollReveal, SectionHeading, SuitIcon, DressIcon } from '../Shared';



const EntourageSection = ({ config }) => {
    return (
        <section id="entourage" className="py-20 md:py-32 px-4 bg-[#FDFBF7] relative z-10">
            <div className="max-w-4xl mx-auto text-center">
                <ScrollReveal><SectionHeading title={config.entourageTitle || "The Entourage"} subtitle={config.entourageSubtitle || "Wedding Party"} /></ScrollReveal>

                {/* Visual Entourage Palette */}
                <ScrollReveal variant="up" delay={200}>
                    <div className="mb-20 md:mb-32">
                        <div className="flex flex-wrap justify-center gap-6 md:gap-12 lg:gap-16">
                            {[
                                { label: "Best Man", type: 'suit', color: config.entouragePalette?.bestMan || "#43342E", isBestMan: true },
                                { label: "Groomsmen", type: 'suit', color: config.entouragePalette?.groomsmen || "#43342E" },
                                { label: "Maid of Honor", type: 'dress', color: config.entouragePalette?.maidOfHonor || "#E6D2B5", hasBouquet: true },
                                { label: "Bridesmaid", type: 'dress', color: config.entouragePalette?.bridesmaid || "#E6D2B5", hasBouquet: true },
                                { label: "Parents of Bride & Groom", type: 'both', color: config.entouragePalette?.parents || "#8C9E8C" },
                                { label: "Bearers (Coin & Ring)", type: 'kids', color: config.entouragePalette?.bearers || "#43342E" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-3 w-28 md:w-32 lg:w-40 group">
                                    <div className="h-40 md:h-52 w-full flex justify-center items-end relative">
                                        {/* Background Glow */}
                                        <div
                                            className="absolute inset-0 bg-white shadow-sm rounded-2xl -z-10 group-hover:shadow-md transition-shadow duration-500"
                                            style={{ backgroundColor: `${item.color}05` }}
                                        ></div>

                                        {item.type === 'suit' && <SuitIcon color={item.color} className="h-[85%] w-auto" isBestMan={item.isBestMan} />}
                                        {item.type === 'dress' && <DressIcon color={item.color} className="h-[85%] w-auto" hasBouquet={item.hasBouquet} />}
                                        {item.type === 'both' && (
                                            <div className="flex -space-x-8 items-end h-full">
                                                <SuitIcon color={item.color} className="h-[75%] w-auto drop-shadow-md" />
                                                <DressIcon color={item.color} className="h-[75%] w-auto drop-shadow-md" hasBouquet={true} />
                                            </div>
                                        )}
                                        {item.type === 'kids' && (
                                            <div className="flex -space-x-4 items-end h-full pb-4">
                                                <SuitIcon color={item.color} className="h-[60%] w-auto" />
                                                <SuitIcon color={item.color} className="h-[60%] w-auto" />
                                            </div>
                                        )}

                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[10px] md:text-xs font-bold text-[#B08D55] uppercase tracking-widest">{item.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-xs md:text-sm text-[#8C7C72] italic">Fixed color palette for our beloved Entourage</p>
                    </div>
                </ScrollReveal>


                {/* Parents of the Couple */}
                <div className="mb-12">
                    <ScrollReveal variant="up">
                        <h3 className="font-serif text-2xl text-[#43342E] mb-12 relative inline-block">
                            <span className="relative z-10 px-4 bg-[#FDFBF7]">Our Parents</span>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-[#E6D2B5] -z-0"></div>
                        </h3>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 gap-12 md:gap-24 relative text-center">
                        {/* Vertical Divider (Desktop) */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#E6D2B5] to-transparent"></div>

                        {/* Bride's Parents */}
                        <div>
                            <span className="block text-xs font-bold text-[#B08D55] uppercase tracking-widest mb-4">Parents of the Bride</span>
                            <ScrollReveal variant="up" delay={100}>
                                <div className="text-[#786C61] font-serif text-xl md:text-2xl">{config.brideParents || "Mr. & Mrs. Parents"}</div>
                            </ScrollReveal>
                        </div>

                        {/* Groom's Parents */}
                        <div>
                            <span className="block text-xs font-bold text-[#B08D55] uppercase tracking-widest mb-4">Parents of the Groom</span>
                            <ScrollReveal variant="up" delay={200}>
                                <div className="text-[#786C61] font-serif text-xl md:text-2xl">{config.groomParents || "Mr. & Mrs. Parents"}</div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>

                <div className="mt-12 space-y-16">

                    {/* Main Wedding Party (MOH/BestMan + Bridesmaids/Groomsmen) */}
                    <div className="grid md:grid-cols-2 gap-12 md:gap-24 relative text-center">
                        {/* Vertical Divider (Desktop) */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#E6D2B5] to-transparent"></div>

                        {/* Team Bride */}
                        <div>
                            <ScrollReveal variant="up">
                                <h3 className="font-serif text-2xl text-[#43342E] mb-8 relative inline-block">
                                    <span className="relative z-10 px-4 bg-[#FDFBF7]">Team Bride</span>
                                </h3>
                            </ScrollReveal>

                            {/* Layout: 1 (MOH) */}
                            <div className="mb-8">
                                <span className="block text-xs font-bold text-[#B08D55] uppercase tracking-widest mb-2">Maid of Honor</span>
                                <ScrollReveal variant="up" delay={100}>
                                    <div className="text-[#786C61] font-light italic text-lg tracking-wide">{config.maidOfHonor}</div>
                                </ScrollReveal>
                            </div>

                            {/* Layout: 2, 2 (Bridesmaids) */}
                            {config.bridesmaids?.length > 0 && (
                                <div>
                                    <span className="block text-xs font-bold text-[#B08D55] uppercase tracking-widest mb-4">Bridesmaids</span>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                        {config.bridesmaids.map((name, i) => (
                                            <ScrollReveal key={i} variant="up" delay={200 + (i * 50)}>
                                                <div className="text-[#786C61] font-light italic text-lg tracking-wide">{name}</div>
                                            </ScrollReveal>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Team Groom */}
                        <div>
                            <ScrollReveal variant="up" delay={200}>
                                <h3 className="font-serif text-2xl text-[#43342E] mb-8 relative inline-block">
                                    <span className="relative z-10 px-4 bg-[#FDFBF7]">Team Groom</span>
                                </h3>
                            </ScrollReveal>

                            {/* Layout: 1 (Best Man) */}
                            <div className="mb-8">
                                <span className="block text-xs font-bold text-[#B08D55] uppercase tracking-widest mb-2">Best Man</span>
                                <ScrollReveal variant="up" delay={300}>
                                    <div className="text-[#786C61] font-light italic text-lg tracking-wide">{config.bestMan}</div>
                                </ScrollReveal>
                            </div>

                            {/* Layout: 2, 2 (Groomsmen) */}
                            {config.groomsmen?.length > 0 && (
                                <div>
                                    <span className="block text-xs font-bold text-[#B08D55] uppercase tracking-widest mb-4">Groomsmen</span>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                        {config.groomsmen.map((name, i) => (
                                            <ScrollReveal key={i} variant="up" delay={400 + (i * 50)}>
                                                <div className="text-[#786C61] font-light italic text-lg tracking-wide">{name}</div>
                                            </ScrollReveal>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>


                {/* Principal Sponsors */}
                {config.principalSponsors?.length > 0 && (
                    <div className="pt-12 border-t border-[#E6D2B5]/30">
                        <ScrollReveal variant="up">
                            <h3 className="font-serif text-2xl text-[#43342E] mb-12 relative inline-block">
                                <span className="relative z-10 px-4 bg-[#FDFBF7]">Principal Sponsors</span>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-[#E6D2B5] -z-0"></div>
                            </h3>
                        </ScrollReveal>

                        <div className="space-y-4 max-w-2xl mx-auto">
                            {config.principalSponsors.map((pair, idx) => (
                                <ScrollReveal key={idx} variant="up" delay={50 * idx}>
                                    <div className="grid grid-cols-2 gap-8 items-center group relative">
                                        <div className="text-right text-[#786C61] font-light italic text-lg tracking-wide">{pair.mr}</div>
                                        <div className="text-left text-[#786C61] font-light italic text-lg tracking-wide">{pair.mrs}</div>
                                        {/* Center Line/Marker for separation */}
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[#B08D55] rounded-full opacity-50"></div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                )}

                {/* Secondary Sponsors */}
                {config.secondarySponsors?.length > 0 && (
                    <div className="pt-12 border-t border-[#E6D2B5]/30">
                        <ScrollReveal variant="up">
                            <h3 className="font-serif text-2xl text-[#43342E] mb-12 relative inline-block">
                                <span className="relative z-10 px-4 bg-[#FDFBF7]">Secondary Sponsors</span>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-[#E6D2B5] -z-0"></div>
                            </h3>
                        </ScrollReveal>
                        <div className="grid md:grid-cols-3 gap-8">
                            {config.secondarySponsors.map((item, idx) => (
                                <ScrollReveal key={idx} variant="up" delay={idx * 50}>
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-[#B08D55] uppercase tracking-widest mb-2">{item.role}</div>
                                        <div className="text-[#786C61] font-light italic text-lg tracking-wide">{item.names}</div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bearers */}
                {config.bearers?.length > 0 && (
                    <div className="pt-12 border-t border-[#E6D2B5]/30">
                        <ScrollReveal variant="up">
                            <h3 className="font-serif text-2xl text-[#43342E] mb-12 relative inline-block">
                                <span className="relative z-10 px-4 bg-[#FDFBF7]">Bearers</span>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-[#E6D2B5] -z-0"></div>
                            </h3>
                        </ScrollReveal>
                        <div className="grid md:grid-cols-3 gap-8">
                            {config.bearers.map((item, idx) => (
                                <ScrollReveal key={idx} variant="up" delay={idx * 50}>
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-[#B08D55] uppercase tracking-widest mb-2">{item.role}</div>
                                        <div className="text-[#786C61] font-light italic text-lg tracking-wide">{item.name}</div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                )}

                {/* Flower Girls */}
                {config.flowerGirls?.length > 0 && (
                    <div className="pt-12 border-t border-[#E6D2B5]/30">
                        <ScrollReveal variant="up">
                            <h3 className="font-serif text-2xl text-[#43342E] mb-12 relative inline-block">
                                <span className="relative z-10 px-4 bg-[#FDFBF7]">Flower Girls</span>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-[#E6D2B5] -z-0"></div>
                            </h3>
                        </ScrollReveal>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                            {config.flowerGirls.map((name, idx) => (
                                <ScrollReveal key={idx} variant="up" delay={idx * 50}>
                                    <span className="text-[#786C61] font-light italic text-lg tracking-wide">{name}</span>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                )}

                {/* Offertory */}
                {config.offertory?.length > 0 && (
                    <div className="pt-12 border-t border-[#E6D2B5]/30">
                        <ScrollReveal variant="up">
                            <h3 className="font-serif text-2xl text-[#43342E] mb-12 relative inline-block">
                                <span className="relative z-10 px-4 bg-[#FDFBF7]">Offertory</span>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-[#E6D2B5] -z-0"></div>
                            </h3>
                        </ScrollReveal>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                            {config.offertory.map((name, idx) => (
                                <ScrollReveal key={idx} variant="up" delay={idx * 50}>
                                    <span className="text-[#786C61] font-light italic text-lg tracking-wide">{name}</span>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                )}

                {config.entourageGroups?.map((group, idx) => (
                    <ScrollReveal key={idx} variant="up" delay={idx * 100}>
                        <div className="relative">
                            <h3 className="font-serif text-2xl text-[#43342E] mb-6 relative inline-block">
                                <span className="relative z-10 px-4 bg-[#FDFBF7]">{group.title}</span>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-[#E6D2B5] -z-0"></div>
                            </h3>
                            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                                {group.names.map((name, i) => (
                                    <span key={i} className="text-[#786C61] font-light italic text-lg tracking-wide">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
};

export default EntourageSection;
