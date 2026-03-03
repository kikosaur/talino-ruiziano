import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Loader2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { usePublicContent } from "@/hooks/usePublicContent";

const fallbackCreators = [
    { name: "Kim Ramos Ciriaca", image: "/creators/Ciriaca Kim, Ramos.jpg", role: "Researcher" },
    { name: "RJel Santiago Atraje", image: "/creators/Atraje, RJel Santiago.jpg", role: "Researcher" },
    { name: "Kim P. Del Rosario", image: "/creators/Del Rosario, Kim P.jpg", role: "Researcher" },
    { name: "Eddrian Santos Gaboy", image: "/creators/Gaboy, Eddrian Santos.jpg", role: "Researcher" },
    { name: "Keizel B. Quinones", image: "/creators/Quinones, Keizel B.jpg", role: "Researcher" },
    { name: "Robby Rian A. Yacat", image: "/creators/Yacat, Robby Rian A.jpg", role: "Researcher" },
    { name: "Crissa Jane Catacutan", image: "/creators/Crissa Jane Catacutan.jfif", role: "Researcher" },
];

const fallbackIntro = {
    title: "Talino-Ruiziano",
    description: "Make completing your ILTs fun and stress-free! Earn points, listen to music, and customize your avatar while submitting your tasks on time. Teachers can easily track and check your work, so everyone wins. Stay motivated, enjoy learning, and celebrate your achievements!"
};

const fallbackContact = [
    { title: "Address", description: "San Bartolome (POB.), 3102 San Leonardo, Nueva Ecija, Philippines", icon: "MapPin" },
    { title: "Phone", description: "N/A", icon: "Phone" },
    { title: "Email", description: "slrdaacademics@gmail.com", icon: "Mail" }
];

const IconMap: { [key: string]: any } = {
    MapPin, Phone, Mail
};

const About = () => {
    const { data: introData, isLoading: isLoadingIntro } = usePublicContent("about_intro");
    const { data: creatorsData, isLoading: isLoadingCreators } = usePublicContent("about_creator");
    const { data: contactData, isLoading: isLoadingContact } = usePublicContent("about_contact");

    const isLoading = isLoadingIntro || isLoadingCreators || isLoadingContact;

    // Use dynamic data if available, otherwise fall back to classic hardcoded
    const intro = introData && introData.length > 0 ? introData[0] : fallbackIntro;
    const creators = creatorsData && creatorsData.length > 0 ? creatorsData.map(c => ({
        name: c.title,
        image: c.metadata?.icon || "/placeholder.svg",
        role: c.description || "Researcher"
    })) : fallbackCreators;
    const contacts = contactData && contactData.length > 0 ? contactData.map(c => ({
        title: c.title,
        description: c.description,
        icon: c.metadata?.icon || "MapPin"
    })) : fallbackContact;

    // Helper to render icons dynamically
    const renderIcon = (iconName: string | undefined, fallbackIcon: any, className: string) => {
        if (!iconName) return fallbackIcon({ className });
        const IconComponent = IconMap[iconName] || fallbackIcon;
        return <IconComponent className={className} />;
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section
                className="relative pt-32 pb-24 overflow-visible"
                style={{
                    backgroundImage: "url('/School_bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/60" />

                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
                    <div className="w-full max-w-5xl">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-medium text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src="/bulb.png"
                                alt="Talino Ruiziano Logo"
                                className="w-16 h-16 object-contain"
                            />
                            <div>
                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-white drop-shadow-md">
                                    About Talino-Ruiziano
                                </h1>
                                <p className="text-white/90 text-lg mt-1 font-light">
                                    Empowering learners since 2001
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlapping Explore Now Button */}
                <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 z-20">
                    <button className="bg-white text-primary border border-primary/20 hover:bg-muted font-medium w-[220px] py-4 rounded-full shadow-lg tracking-wider text-sm transition-all hover:scale-105">
                        EXPLORE NOW!
                    </button>
                </div>
            </section>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-accent" />
                    <p>Loading school information...</p>
                </div>
            ) : (
                <>
                    {/* Intro Content Section */}
                    <section className="bg-white pt-24 pb-20 relative z-10">
                        <div className="container mx-auto px-4 max-w-4xl">
                            <h2 className="text-3xl font-serif font-bold text-primary mb-6">
                                {intro.title}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg font-light whitespace-pre-wrap">
                                {intro.description}
                            </p>
                        </div>
                    </section>

                    {/* Beige Background Wrapper for Creators & Contact */}
                    <div className="bg-[#EEDBBE] pt-24 pb-24">

                        {/* Meet the Creators Section */}
                        <section className="container mx-auto px-4 mb-24">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-serif font-bold text-primary mb-2">Meet the Creators</h2>
                                <p className="text-primary/70 font-medium">The team behind Talino-Ruiziano</p>
                            </div>

                            <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
                                {/* Top row (4 cards max) */}
                                <div className="flex flex-wrap justify-center gap-6 w-full">
                                    {creators.slice(0, 4).map((creator, idx) => (
                                        <div key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center w-[260px]">
                                            <div className="w-28 h-28 rounded-full bg-blue-50/50 p-1 mb-4 flex-shrink-0 border border-blue-100/30 overflow-hidden shadow-inner">
                                                <img
                                                    src={creator.image}
                                                    alt={creator.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=822A2B&color=fff&size=150`;
                                                    }}
                                                />
                                            </div>
                                            <h3 className="font-serif font-bold text-primary text-center text-[15px] mb-1 leading-tight min-h-[40px] flex items-center">{creator.name}</h3>
                                            <p className="text-[#822A2B]/70 text-xs font-medium uppercase tracking-widest mb-3">{creator.role}</p>
                                            <div className="w-10 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-primary"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom row (remaining cards) */}
                                {creators.length > 4 && (
                                    <div className="flex flex-wrap justify-center gap-6 w-full">
                                        {creators.slice(4).map((creator, idx) => (
                                            <div key={idx} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center w-[260px]">
                                                <div className="w-28 h-28 rounded-full bg-blue-50/50 p-1 mb-4 flex-shrink-0 border border-blue-100/30 overflow-hidden shadow-inner">
                                                    <img
                                                        src={creator.image}
                                                        alt={creator.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=822A2B&color=fff&size=150`;
                                                        }}
                                                    />
                                                </div>
                                                <h3 className="font-serif font-bold text-primary text-center text-[15px] mb-1 leading-tight min-h-[40px] flex items-center">{creator.name}</h3>
                                                <p className="text-[#822A2B]/70 text-xs font-medium uppercase tracking-widest mb-3">{creator.role}</p>
                                                <div className="w-10 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-primary"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Get in Touch Section */}
                        <section className="container mx-auto px-4 max-w-5xl">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-serif font-bold text-primary mb-2">Get in Touch</h2>
                                <p className="text-primary/70 font-medium">We'd love to hear from you</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {contacts.map((contact, idx) => (
                                    <div key={idx} className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center text-center">
                                        <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                                            {renderIcon(contact.icon, MapPin, "w-6 h-6 text-accent")}
                                        </div>
                                        <h3 className="font-serif font-bold text-primary text-lg mb-4">{contact.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed font-light whitespace-pre-wrap">
                                            {contact.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </>
            )}

            <Footer />
        </div>
    );
};

export default About;
