import React from 'react';
import { CreditCard, Wallet, Copy, Check, QrCode, ExternalLink } from 'lucide-react';
import { ScrollReveal, SectionHeading } from '../Shared';
import toast from 'react-hot-toast';

const RegistrySection = ({ config }) => {
    const [copiedId, setCopiedId] = React.useState(null);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!config.registryItems || config.registryItems.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'ewallet': return <Wallet size={32} strokeWidth={1.5} />;
            case 'link': return <ExternalLink size={32} strokeWidth={1.5} />;
            default: return <CreditCard size={32} strokeWidth={1.5} />;
        }
    };

    return (
        <section id="registry" className="py-20 md:py-32 px-4 bg-[#FAF9F6] relative z-10 border-t border-[#E6D2B5]/30">
            <div className="max-w-4xl mx-auto">
                <ScrollReveal>
                    <SectionHeading
                        title={config.registryTitle || "Gift Registry"}
                        subtitle={config.registrySubtitle || "Love & Support"}
                    />
                </ScrollReveal>

                {config.registryInstruction && (
                    <ScrollReveal variant="up" delay={100}>
                        <p className="text-center text-[#8C7C72] mb-12 max-w-2xl mx-auto leading-relaxed italic">
                            {config.registryInstruction}
                        </p>
                    </ScrollReveal>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {config.registryItems.map((item, idx) => (
                        <ScrollReveal key={idx} variant="up" delay={idx * 100 + 200}>
                            <div className="bg-white p-8 rounded-2xl border border-[#E6D2B5]/30 shadow-sm hover:shadow-md transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
                                {/* Aesthetic Background Blur */}
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#B08D55]/5 rounded-full blur-xl group-hover:bg-[#B08D55]/10 transition-colors" />

                                <div className="flex flex-col items-center text-center relative z-10 flex-grow">
                                    <div className="bg-[#FAF9F6] p-4 rounded-full mb-6 text-[#B08D55] ring-1 ring-[#E6D2B5]/20">
                                        {getIcon(item.type)}
                                    </div>

                                    <h4 className="font-serif text-2xl text-[#43342E] mb-1">{item.bankName}</h4>
                                    <p className="text-[10px] uppercase tracking-widest text-[#B08D55] font-bold mb-6">{item.label}</p>

                                    {item.type === 'link' ? (
                                        <div className="w-full flex-grow flex flex-col items-center justify-center space-y-8">
                                            {item.qrCode ? (
                                                <img src={item.qrCode} alt="Logo" className="h-20 w-auto object-contain transition-transform group-hover:scale-110" />
                                            ) : (
                                                <div className="py-4">
                                                    <ExternalLink size={60} className="text-[#E6D2B5]/20" />
                                                </div>
                                            )}

                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-[#43342E] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#5D4B42] transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                Visit Registry <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    ) : (
                                        <>
                                            {item.qrCode && (
                                                <div className="mb-8 p-3 bg-white border border-[#E6D2B5]/40 rounded-xl shadow-inner relative group/qr">
                                                    <img
                                                        src={item.qrCode}
                                                        alt={`${item.bankName} QR Code`}
                                                        className="w-48 h-48 md:w-56 md:h-56 object-contain rounded-lg"
                                                    />
                                                    <div className="absolute inset-0 bg-[#43342E]/5 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                                                        <QrCode size={40} className="text-[#43342E]/20" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="w-full space-y-4 pt-4 border-t border-[#E6D2B5]/10 mt-auto">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] uppercase tracking-widest text-[#8C7C72] mb-1">Account Name</span>
                                                    <p className="font-serif text-[#43342E] text-lg">{item.accountName}</p>
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] uppercase tracking-widest text-[#8C7C72] mb-1">Account Number</span>
                                                    <div className="flex items-center gap-2 group/copy cursor-pointer" onClick={() => handleCopy(item.accountNumber, `acct-${idx}`)}>
                                                        <p className="font-serif text-xl text-[#B08D55] tracking-tight">{item.accountNumber}</p>
                                                        <div className="p-1.5 rounded-full bg-[#FAF9F6] text-[#B08D55] group-hover/copy:bg-[#B08D55] group-hover/copy:text-white transition-all">
                                                            {copiedId === `acct-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal delay={600}>
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#FFF9F2] border border-[#E6D2B5]/40 rounded-full text-[#8C7C72] text-xs">
                            <span className="w-2 h-2 rounded-full bg-[#B08D55] animate-pulse"></span>
                            Thank you for your warm celebration and kindness.
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};

export default RegistrySection;
