import { useNavigate } from 'react-router-dom';

function ContactCTA() {
    const navigate = useNavigate();

    return (
        <section className="py-32 bg-(--surface-muted)">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-(--text-primary)">
                    Let's Work Together
                </h2>
                <p className="text-xl text-(--text-secondary) mb-10 leading-relaxed">
                    Have a project in mind? I'd love to hear about it. Let's create something amazing together.
                </p>
                <button
                    onClick={() => navigate('/contact')}
                    className="px-10 py-5 bg-btn-primary-bg text-btn-primary-fg rounded-full font-semibold text-lg shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-btn-primary-hover-bg hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                    Get In Touch
                </button>
            </div>
        </section>
    )
}

export default ContactCTA
