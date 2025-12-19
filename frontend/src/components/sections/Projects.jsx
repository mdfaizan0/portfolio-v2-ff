import { ArrowUpRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

function Projects({ projects = [] }) {
    if (!projects.length) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="projects" className="py-24 bg-(--surface-muted)">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <h2 className="text-4xl font-bold mb-4 text-(--text-primary)">Selected Work</h2>
                        <p className="text-(--text-secondary) max-w-xl">A collection of projects attempting to solve real-world problems.</p>
                    </div>
                    <Link
                        to="/projects"
                        className="hidden md:inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-btn-outline-bg text-btn-outline-fg border-2 border-btn-outline-border rounded-full transition-all duration-200 hover:bg-btn-outline-hover-bg hover:text-btn-outline-hover-fg hover:border-btn-outline-hover-border hover:-translate-y-0.5"
                    >
                        View All Projects <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project._id} className="group flex flex-col h-full bg-(--surface) border border-(--border) rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-(--accent)/50">

                            {/* Image Container */}
                            <div className="aspect-video w-full bg-(--surface-muted) relative overflow-hidden">
                                {project.thumbnail?.url ? (
                                    <img
                                        src={project.thumbnail.url}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-(--text-muted) text-sm font-medium">Coming Soon</div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                                    {project.liveURL && (
                                        <a href={project.liveURL} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform duration-200 shadow-lg" title="Live Demo">
                                            <ArrowUpRight size={20} />
                                        </a>
                                    )}
                                    {project.sourceURL && (
                                        <button className="p-3 bg-black text-white border border-white/20 rounded-full hover:scale-110 transition-transform duration-200 shadow-lg cursor-pointer">
                                            <a href={project.sourceURL} target="_blank" rel="noopener noreferrer" title="Source Code">
                                                <Github size={20} />
                                            </a>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold mb-2 text-(--text-primary) group-hover:text-(--accent) transition-colors duration-200">{project.title}</h3>
                                <p className="text-(--text-secondary) text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                    {project.description}
                                </p>

                                {/* Footer */}
                                <div className="mt-auto pt-4 border-t border-(--border-muted) flex items-center justify-between">
                                    <span className="text-xs font-mono text-(--text-tertiary)">{formatDate(project.createdAt || Date.now())}</span>
                                    <div className="flex gap-4 md:hidden">
                                        {project.liveURL && <a href={project.liveURL} className="text-xs font-bold text-btn-outline-fg hover:text-btn-outline-hover-fg transition-colors">Demo</a>}
                                        {project.sourceURL && <a href={project.sourceURL} className="text-xs font-bold text-btn-outline-fg hover:text-btn-outline-hover-fg transition-colors">Code</a>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-btn-outline-bg text-btn-outline-fg border-2 border-btn-outline-border rounded-full transition-all duration-200 hover:bg-btn-outline-hover-bg hover:text-btn-outline-hover-fg hover:border-btn-outline-hover-border"
                    >
                        View All Projects &rarr;
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Projects
