import { Link } from "react-router-dom";
import {
    BookOpen,
    ArrowLeft,
    Target,
    Globe,
    Trophy,
    Phone,
    MapPin,
    Mail,
    Loader2
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { usePublicContent } from "@/hooks/usePublicContent";

const IconMap: { [key: string]: any } = {
    BookOpen, Target, Globe, Trophy, Phone, MapPin, Mail
};

const About = () => {
    const { data: statsData, isLoading: isLoadingStats } = usePublicContent("about_stat");
    const { data: valuesData, isLoading: isLoadingValues } = usePublicContent("about_value");
    const { data: contactData, isLoading: isLoadingContact } = usePublicContent("about_contact");

    const isLoading = isLoadingStats || isLoadingValues || isLoadingContact;

    // Helper to render icons dynamically
    const renderIcon = (iconName: string | undefined, fallbackIcon: any, className: string) => {
        if (!iconName) return fallbackIcon({ className });
        const IconComponent = IconMap[iconName] || fallbackIcon;
        return <IconComponent className={className} />;
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section
                className="pt-24 pb-12 relative overflow-hidden"
                style={{
                    backgroundImage: "url('/School_bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/50" />

                <div className="container mx-auto px-4 relative z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-3 md:gap-4 mb-4">
                        <img
                            src="/bulb.png"
                            alt="Talino Ruiziano Logo"
                            className="w-12 h-12 md:w-16 md:h-16 object-contain"
                        />
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white">
                                About Talino-Ruiziano
                            </h1>
                            <p className="text-white/80 text-sm md:text-base lg:text-lg">
                                Empowering learners since 2001
                            </p>
                        </div>
                    </div>
                    <p className="text-primary-foreground/80 text-lg">
                        Nurturing minds, building character since 1995
                    </p>
                </div>
            </section>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-accent" />
                    <p>Loading school information...</p>
                </div>
            ) : (
                <>
                    {/* Mission & Vision (Static for now, could be made dynamic later) */}
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="card-elevated p-8">
                                    <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                                        <Target className="w-6 h-6 text-accent" />
                                        Our Mission
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        To provide quality education that develops students' intellectual, moral, and social capabilities. We strive to create an engaging learning environment that empowers our students to become responsible members of society and leaders of tomorrow.
                                    </p>
                                </div>
                                <div className="card-elevated p-8">
                                    <h2 className="text-2xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                                        <Globe className="w-6 h-6 text-accent" />
                                        Our Vision
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        To be a premier educational institution recognized for academic excellence, character formation, and innovative teaching methodologies that prepare students for the challenges of a rapidly changing world.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    {statsData && statsData.length > 0 && (
                        <section className="py-12 bg-muted/30">
                            <div className="container mx-auto px-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {statsData.map((stat) => (
                                        <div key={stat.id} className="text-center p-6 bg-background rounded-2xl shadow-sm border border-border">
                                            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                {renderIcon(stat.metadata?.icon, Trophy, "w-6 h-6 text-accent")}
                                            </div>
                                            <div className="text-3xl font-bold text-primary mb-1">{stat.title}</div>
                                            <div className="text-sm text-muted-foreground">{stat.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Core Values Section */}
                    {valuesData && valuesData.length > 0 && (
                        <section className="py-16">
                            <div className="container mx-auto px-4">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-serif font-bold text-primary mb-4">Core Values</h2>
                                    <p className="text-muted-foreground max-w-2xl mx-auto">
                                        The principles that guide our institution and shape our students' character.
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                    {valuesData.map((val) => (
                                        <div key={val.id} className="text-center group">
                                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                {renderIcon(val.metadata?.icon, Trophy, "w-8 h-8 text-primary")}
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">{val.title}</h3>
                                            <p className="text-muted-foreground">{val.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Contact Section */}
                    {contactData && contactData.length > 0 && (
                        <section className="py-16 bg-primary text-primary-foreground">
                            <div className="container mx-auto px-4">
                                <div className="max-w-4xl mx-auto text-center">
                                    <h2 className="text-3xl font-serif font-bold mb-8">Get in Touch</h2>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {contactData.map((contact) => (
                                            <div key={contact.id} className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center mb-4">
                                                    {renderIcon(contact.metadata?.icon, Phone, "w-6 h-6 text-accent")}
                                                </div>
                                                <h3 className="font-bold mb-2">{contact.title}</h3>
                                                <p className="text-primary-foreground/80">{contact.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            <Footer />
        </div>
    );
};

export default About;
