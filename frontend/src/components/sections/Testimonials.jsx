import { Quote } from 'lucide-react';

function Testimonials({ testimonials = [] }) {
    if (!testimonials.length) return null;

    return (
        <section className="py-24 bg-(--surface-muted)">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-12 text-center text-(--text-primary)">Client Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {testimonials.map((testi) => (
                        <div key={testi._id} className="relative p-8 bg-(--surface) rounded-2xl border border-(--border) shadow-sm hover:shadow-md transition-shadow">
                            <div className="absolute top-8 right-8 text-(--accent)/10">
                                <Quote size={48} />
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                {testi.avatar?.url ? (
                                    <img src={testi.avatar.url} alt={testi.name} className="w-14 h-14 rounded-full object-cover border-2 border-(--bg)" />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-(--surface-muted) flex items-center justify-center font-bold text-xl text-(--text-secondary) border-2 border-(--bg)">
                                        {testi.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-lg text-(--text-primary)">{testi.name}</div>
                                    {testi.designation && <div className="text-sm text-(--text-tertiary)">{testi.designation}</div>}
                                </div>
                            </div>

                            <blockquote className="text-lg text-(--text-secondary) leading-relaxed italic relative z-10">
                                "{testi.quote}"
                            </blockquote>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
