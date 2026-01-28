import React from 'react';
import { Camera, Shirt } from 'lucide-react';
import { SuitIcon, DressIcon, ScrollReveal, SectionHeading } from '../Shared';




const ColorPaletteSection = ({ config }) => {
    const [selectedColor, setSelectedColor] = React.useState(null);

    // Auto-select first color on load
    React.useEffect(() => {
        if (config.colorPalette && config.colorPalette.length > 0 && !selectedColor) {
            setSelectedColor(config.colorPalette[0].hex);
        }
    }, [config.colorPalette]);

    if (!config.colorPalette || config.colorPalette.length === 0) return null;

    return (
        <section id="color-palette" className="py-20 md:py-32 px-4 bg-[#FDFBF7] relative z-10 border-t border-[#E6D2B5]/20">
            <div className="max-w-4xl mx-auto text-center">
                <ScrollReveal>
                    <SectionHeading
                        title="Wedding Colors"
                        subtitle="Our Palette"
                    />
                </ScrollReveal>

                <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-6 md:gap-16">
                    {config.colorPalette.map((color, idx) => (
                        <ScrollReveal key={idx} variant="up" delay={idx * 100}>
                            <div className="group flex flex-col items-center gap-2 md:gap-4 cursor-pointer" onClick={() => setSelectedColor(color.hex)}>
                                <div
                                    className={`w-16 h-16 md:w-32 md:h-32 rounded-full shadow-lg transition-transform duration-500 hover:scale-110 border-4 ${selectedColor === color.hex ? 'border-[#B08D55] scale-110' : 'border-white'}`}
                                    style={{ backgroundColor: color.hex }}
                                ></div>
                                <div className="text-center">
                                    <div className={`font-serif text-sm md:text-lg ${selectedColor === color.hex ? 'text-[#B08D55] font-bold' : 'text-[#43342E]'}`}>{color.name}</div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Interactive Dress Code Preview */}
                <ScrollReveal variant="up" delay={500}>
                    <div className="mt-8 md:mt-20 pt-8 md:pt-16 border-t border-[#E6D2B5]/30">
                        <h4 className="font-serif text-xl md:text-2xl text-[#43342E] mb-2">Visualize the Look</h4>
                        <p className="text-xs md:text-sm text-[#8C7C72] mb-6 md:mb-12">Tap a color above to see it on the attire.</p>

                        <div className="flex justify-center gap-8 md:gap-32 h-40 md:h-64 mb-16">
                            <div className="w-32 md:w-48 flex flex-col items-center gap-4">
                                <SuitIcon color={selectedColor || '#E6D2B5'} />
                                <span className="font-serif text-[#43342E]">Gentlemen</span>
                            </div>
                            <div className="w-32 md:w-48 flex flex-col items-center gap-4">
                                <DressIcon color={selectedColor || '#E6D2B5'} />
                                <span className="font-serif text-[#43342E]">Ladies</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-4xl mx-auto text-left">
                            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-[#E6D2B5]/30 flex flex-col items-center text-center">
                                <div className="bg-[#FAF9F6] p-3 rounded-full mb-4 text-[#B08D55]">
                                    <Shirt size={24} />
                                </div>
                                <h5 className="font-serif text-lg text-[#43342E] mb-2">{config.dressCode || "Formal Attire"}</h5>
                                <p className="text-sm text-[#8C7C72] leading-relaxed">
                                    {config.dressCodeDescription || "We kindly request that our guests dress in formal attire."}
                                </p>
                            </div>

                            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-[#E6D2B5]/30 flex flex-col items-center text-center">
                                <div className="bg-[#FAF9F6] p-3 rounded-full mb-4 text-[#B08D55]">
                                    <Camera size={24} />
                                </div>
                                <h5 className="font-serif text-lg text-[#43342E] mb-2">Photo Ready</h5>
                                <p className="text-sm text-[#8C7C72] leading-relaxed">
                                    We'll have a professional photographer capturing every moment. Dress to feel your most confident and beautiful!
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default ColorPaletteSection;
