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
            <section className="pt-24 pb-12 bg-gradient-to-br from-primary to-primary/80">
                <div className="container mx-auto px-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-[var(--shadow-gold)]">
                            <BookOpen className="w-8 h-8 text-accent-foreground" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-primary-foreground">
                                About Talino-Ruiziano
                            </h1>
                            <p className="text-primary-foreground/80 text-lg">
                                Empowering learners since 2001
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <div className="card-elevated p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-accent" />
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-foreground">
                                    Our Mission
                                </h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                To provide quality education that develops holistic, competent, and values-driven
                                individuals who are prepared to meet the challenges of the 21st century. We are
                                committed to fostering a culture of excellence, innovation, and lifelong learning
                                through engaging and student-centered approaches.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="card-elevated p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-foreground">
                                    Our Vision
                                </h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                To be a leading educational institution recognized for academic excellence,
                                innovative teaching practices, and the development of globally competitive
                                graduates who are morally upright, socially responsible, and dedicated to
                                nation-building.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 bg-primary">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3 shadow-[var(--shadow-gold)]">
                                    <stat.icon className="w-7 h-7 text-accent-foreground" />
                                </div>
                                <p className="text-3xl font-bold text-primary-foreground">{stat.value}</p>
                                <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                            Our Core Values
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            The principles that guide everything we do at Talino-Ruiziano
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="card-elevated p-6 text-center hover:scale-[1.02] transition-transform"
                            >
                                <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="w-7 h-7 text-accent" />
                                </div>
                                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">{value.description}</p>
                            </div>
                        ))}
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
                                    123 Education Lane, Scholar City, Philippines
                                </p>
                            </div>

                            <div className="card-elevated p-6 text-center">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Phone className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                                <p className="text-muted-foreground text-sm">
                                    (02) 8123-4567
                                </p>
                            </div>

                            <div className="card-elevated p-6 text-center">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Mail className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                                <p className="text-muted-foreground text-sm">
                                    info@talinoruiziano.edu.ph
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
