import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Clock, Users, ArrowLeft, Star } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";

const programs = [
    {
        id: 1,
        name: "Junior High School",
        description: "Comprehensive curriculum for grades 7-10, building strong academic foundations.",
        duration: "4 Years",
        students: "500+",
        icon: "📚",
        courses: ["Mathematics", "Science", "English", "Filipino", "Social Studies", "TLE", "MAPEH"],
    },
    {
        id: 2,
        name: "Senior High School - STEM",
        description: "Science, Technology, Engineering, and Mathematics track for future innovators.",
        duration: "2 Years",
        students: "200+",
        icon: "🔬",
        courses: ["General Physics", "General Chemistry", "Pre-Calculus", "Basic Calculus", "Research"],
    },
    {
        id: 3,
        name: "Senior High School - ABM",
        description: "Accountancy, Business, and Management track for future business leaders.",
        duration: "2 Years",
        students: "180+",
        icon: "💼",
        courses: ["Business Math", "Accounting", "Business Finance", "Marketing", "Entrepreneurship"],
    },
    {
        id: 4,
        name: "Senior High School - HUMSS",
        description: "Humanities and Social Sciences track for future educators and public servants.",
        duration: "2 Years",
        students: "150+",
        icon: "📖",
        courses: ["Creative Writing", "Philippine Politics", "Community Engagement", "Social Science"],
    },
    {
        id: 5,
        name: "Senior High School - GAS",
        description: "General Academic Strand for students exploring various career paths.",
        duration: "2 Years",
        students: "120+",
        icon: "🎯",
        courses: ["Humanities", "Social Sciences", "Applied Economics", "Organization & Management"],
    },
    {
        id: 6,
        name: "Senior High School - TVL",
        description: "Technical-Vocational-Livelihood track for hands-on career preparation.",
        duration: "2 Years",
        students: "100+",
        icon: "🛠️",
        courses: ["Computer Systems Servicing", "Cookery", "Electrical Installation", "Welding"],
    },
];

const Programs = () => {
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
                            <GraduationCap className="w-8 h-8 text-accent-foreground" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-primary-foreground">
                                Our Programs
                            </h1>
                            <p className="text-primary-foreground/80 text-lg">
                                Discover our comprehensive academic offerings
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program) => (
                            <div
                                key={program.id}
                                className="card-elevated p-6 hover:scale-[1.02] transition-transform group"
                            >
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                        {program.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-accent transition-colors">
                                            {program.name}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {program.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {program.students}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-muted-foreground text-sm mb-4">
                                    {program.description}
                                </p>

                                {/* Courses */}
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                        Key Subjects
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {program.courses.slice(0, 4).map((course, i) => (
                                            <span
                                                key={i}
                                                className="text-xs bg-muted px-2 py-1 rounded-lg text-muted-foreground"
                                            >
                                                {course}
                                            </span>
                                        ))}
                                        {program.courses.length > 4 && (
                                            <span className="text-xs bg-accent/20 px-2 py-1 rounded-lg text-accent">
                                                +{program.courses.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto shadow-[var(--shadow-gold)]">
                            <Star className="w-8 h-8 text-accent-foreground" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-foreground">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Join our community of learners and unlock your full potential with our gamified learning platform.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/register">
                                <Button className="btn-gold text-lg px-8 py-6">
                                    Enroll Now
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="outline" className="text-lg px-8 py-6">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Programs;
