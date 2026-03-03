import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Clock, Users, ArrowLeft, Star, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { usePublicContent } from "@/hooks/usePublicContent";

const Programs = () => {
    const { data: programs, isLoading, error } = usePublicContent("program");

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
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Loader2 className="w-12 h-12 animate-spin mb-4 text-accent" />
                            <p>Loading programs...</p>
                        </div>
                    ) : error || !programs || programs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/30 rounded-2xl">
                            <AlertCircle className="w-12 h-12 mb-4 text-muted-foreground/50" />
                            <p className="text-lg">No programs found.</p>
                            <p className="text-sm">Please check back later or contact administration.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {programs.map((program) => (
                                <div
                                    key={program.id}
                                    className="card-elevated p-6 hover:scale-[1.02] transition-transform group flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                            {program.metadata?.icon || '📚'}
                                        </div>
                                        <div>
                                            <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-accent transition-colors">
                                                {program.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {program.metadata?.duration || 'Unknown duration'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {program.metadata?.students || '0'} students
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-muted-foreground text-sm mb-4">
                                        {program.description}
                                    </p>

                                    {/* Courses */}
                                    <div className="space-y-2 mt-auto pt-4">
                                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                                            Key Subjects
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {(program.metadata?.courses || []).slice(0, 4).map((course: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="text-xs bg-muted px-2 py-1 rounded-lg text-muted-foreground"
                                                >
                                                    {course}
                                                </span>
                                            ))}
                                            {(program.metadata?.courses?.length || 0) > 4 && (
                                                <span className="text-xs bg-accent/20 px-2 py-1 rounded-lg text-accent">
                                                    +{(program.metadata.courses.length) - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
