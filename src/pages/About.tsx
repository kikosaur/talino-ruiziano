import { Link } from "react-router-dom";
import {
    BookOpen,
    ArrowLeft,
    Target,
    Eye,
    Heart,
    Users,
    Award,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const stats = [
    { label: "Years of Excellence", value: "25+", icon: Award },
    { label: "Students Enrolled", value: "1,200+", icon: Users },
    { label: "Graduate Success Rate", value: "98%", icon: GraduationCap },
    { label: "Faculty Members", value: "80+", icon: BookOpen },
];

const values = [
    {
        icon: Target,
        title: "Excellence",
        description: "Striving for the highest standards in education and personal development.",
    },
    {
        icon: Heart,
        title: "Compassion",
        description: "Nurturing a caring community that supports every student's journey.",
    },
    {
        icon: Users,
        title: "Collaboration",
        description: "Fostering teamwork and partnerships for collective success.",
    },
    {
        icon: BookOpen,
        title: "Innovation",
        description: "Embracing new technologies and methods to enhance learning.",
    },
];

const About = () => {
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
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src="/bulb.png"
                            alt="Talino Ruiziano Logo"
                            className="w-16 h-16 object-contain"
                        />
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-white">
                                About Talino-Ruiziano
                            </h1>
                            <p className="text-white/80 text-lg">
                                Empowering learners since 2001
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore Now Section */}
            <section className="relative" style={{ backgroundColor: "#FFF9F0" }}>
                {/* Button overlapping the hero section */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                    <Link to="/login">
                        <button
                            className="px-12 py-3 text-lg font-semibold rounded-full border-2 shadow-lg hover:scale-105 transition-all"
                            style={{
                                backgroundColor: "#FFF9F0",
                                borderColor: "#801B1B",
                                color: "#801B1B",
                            }}
                        >
                            EXPLORE NOW!
                        </button>
                    </Link>
                </div>

                <div className="container mx-auto px-4 pt-12 pb-8">
                    <div className="max-w-4xl">
                        <h2
                            className="text-3xl font-serif font-bold mb-4"
                            style={{ color: "#801B1B" }}
                        >
                            Talino-Ruiziano
                        </h2>
                        <p
                            className="text-lg leading-relaxed"
                            style={{ color: "#4A0E0E" }}
                        >
                            Make completing your ILTs fun and stress-free! Earn points, listen to music, and customize your avatar while submitting your tasks on time. Teachers can easily track and check your work, so everyone wins. Stay motivated, enjoy learning, and celebrate your achievements!
                        </p>
                    </div>
                </div>
            </section>

            {/* Creators Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                            Meet the Creators
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            The team behind Talino-Ruiziano.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {/* Creator 1 - Kim Ciriaca */}
                        <div className="card-elevated p-6 text-center hover:scale-[1.02] transition-transform">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                                <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                                    <Users className="w-16 h-16 text-muted-foreground/40" />
                                </div>
                            </div>
                            <h3 className="font-serif font-bold text-xl text-foreground mb-1">
                                Kim Ciriaca
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2">Developer</p>
                            <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
                        </div>

                        {/* Creator 2 - To Be Added */}
                        <div className="card-elevated p-6 text-center hover:scale-[1.02] transition-transform">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                                <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                                    <Users className="w-16 h-16 text-muted-foreground/40" />
                                </div>
                            </div>
                            <h3 className="font-serif font-bold text-xl text-foreground mb-1">
                                To Be Added
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2">Team Member</p>
                            <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
                        </div>

                        {/* Creator 3 - To Be Added */}
                        <div className="card-elevated p-6 text-center hover:scale-[1.02] transition-transform">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-background shadow-lg">
                                <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                                    <Users className="w-16 h-16 text-muted-foreground/40" />
                                </div>
                            </div>
                            <h3 className="font-serif font-bold text-xl text-foreground mb-1">
                                To Be Added
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2">Team Member</p>
                            <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Contact Info */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                                Get in Touch
                            </h2>
                            <p className="text-muted-foreground">
                                We'd love to hear from you
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="card-elevated p-6 text-center">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <MapPin className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Address</h3>
                                <p className="text-muted-foreground text-sm">
                                    San Bartolome (POB.), 3102 San Leonardo, Nueva Ecija, Philippines
                                </p>
                            </div>

                            <div className="card-elevated p-6 text-center">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Phone className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                                <p className="text-muted-foreground text-sm">
                                    N/A
                                </p>
                            </div>

                            <div className="card-elevated p-6 text-center">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Mail className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                                <p className="text-muted-foreground text-sm">
                                    slrdaacademics@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
