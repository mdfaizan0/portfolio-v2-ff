import { ArrowRight } from 'lucide-react';

function Services({ services = [] }) {
    if (!services.length) return null;

    return (
        <section className="py-24 bg-(--bg)">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-(--text-primary)">Services</h2>
                    <p className="text-(--text-secondary)">How I can help you build your next big thing.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service._id} className="group p-8 bg-(--surface) border border-(--border) rounded-2xl transition-all duration-300 hover:border-(--accent) hover:shadow-xl hover:-translate-y-1 cursor-default">
                            <div className="w-12 h-12 mb-6 rounded-lg bg-(--surface-muted) flex items-center justify-center text-(--text-primary) group-hover:bg-(--accent) group-hover:text-white transition-colors">
                                {/* Icon placeholder - using first char */}
                                <span className="text-xl font-bold">{service.title.charAt(0)}</span>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 text-(--text-primary)">{service.title}</h3>
                            <p className="text-(--text-secondary) leading-relaxed mb-6 min-h-12">
                                {service.description}
                            </p>

                            <div className="pt-6 border-t border-(--border-muted) flex items-center justify-between">
                                {service.price && (
                                    <div className="text-sm font-semibold text-(--text-primary)">
                                        Starting at ₹{service.price}
                                    </div>
                                )}
                                <div className="w-8 h-8 rounded-full border border-(--border) flex items-center justify-center text-(--text-secondary) group-hover:border-(--accent) group-hover:text-(--accent) transition-colors">
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Services
