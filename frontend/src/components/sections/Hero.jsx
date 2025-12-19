import { ArrowDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Hero({ name = "John Doe", role = "Full Stack Developer", description = "Building scalable web applications.", image }) {
    const navigate = useNavigate();

    const scrollToProjects = (e) => {
        e.preventDefault();
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden bg-(--bg)">
            <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="text-center lg:text-left order-2 lg:order-1">
                    <div className="inline-block px-3 py-1 mb-6 rounded-full bg-(--surface-muted) border border-(--border) text-xs font-medium text-(--text-secondary) tracking-wider uppercase">
                        Available for hire
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 text-(--text-primary) leading-[0.9]">
                        {name}
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-(--text-secondary) mb-8 font-light italic">
                        {role}
                    </h2>
                    <p className="text-lg text-(--text-tertiary) max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
                        {description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <button
                            onClick={scrollToProjects}
                            className="px-8 py-4 bg-btn-primary-bg text-btn-primary-fg rounded-full font-semibold shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-btn-primary-hover-bg hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            View Work
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="px-8 py-4 bg-btn-secondary-bg text-btn-secondary-fg border-2 border-btn-secondary-border rounded-full font-semibold shadow-md transition-all duration-200 hover:bg-btn-secondary-hover-bg hover:border-btn-secondary-hover-border hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Contact Me
                        </button>
                    </div>
                </div>

                {/* Image Content */}
                <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[500px] lg:h-[600px]">
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 bg-(--accent-soft) rounded-4xl transform rotate-3 scale-105 z-0"></div>

                        {/* Main Image */}
                        <div className="absolute inset-0 bg-(--surface-muted) rounded-4xl overflow-hidden border border-(--border-muted) shadow-2xl z-10">
                            {image ? (
                                <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-(--text-muted)">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-(--text-muted)">
                <ArrowDown size={24} />
            </div>
        </section>
    )
}

export default Hero
