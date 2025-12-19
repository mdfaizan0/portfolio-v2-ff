import ReactMarkdown from 'react-markdown';

function Experience({ experience = [] }) {
    if (!experience.length) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section className="py-24 bg-(--surface-muted)">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-16">
                    <h2 className="text-4xl font-bold text-(--text-primary) mb-4">Work Experience</h2>
                    <p className="text-(--text-secondary)">My professional journey and track record.</p>
                </div>

                <div className="relative border-l-2 border-(--border) ml-3 md:ml-6 space-y-12 pb-4">
                    {experience.map((exp) => (
                        <div key={exp._id} className="relative pl-8 md:pl-12">
                            {/* Timeline Dot - Centered on line */}
                            <div className="absolute -left-[9px] top-2 w-5 h-5 rounded-full bg-(--surface) border-4 border-(--text-primary) box-content z-10" />

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                <h3 className="text-2xl font-bold text-(--text-primary)">{exp.role}</h3>
                                <span className="text-sm font-medium px-3 py-1 rounded-full bg-(--surface) border border-(--border) text-(--text-secondary) mt-2 sm:mt-0 w-fit">
                                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                </span>
                            </div>

                            <div className="text-lg font-medium text-(--text-primary) mb-4">{exp.company}</div>

                            <div className="prose prose-sm dark:prose-invert max-w-none text-(--text-secondary)">
                                <ReactMarkdown>{exp.description}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Experience
