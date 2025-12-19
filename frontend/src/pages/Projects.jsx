import { useState, useEffect } from 'react';
import { Search, ExternalLink, Github, Calendar } from 'lucide-react';
import { fetchProjects } from '../lib/api/projects.api';
import { Link } from 'react-router-dom';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTech, setSelectedTech] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [allTechnologies, setAllTechnologies] = useState([]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchProjects();
                if (data) {
                    setProjects(data);
                    setFilteredProjects(data);

                    // Extract unique technologies
                    const techSet = new Set();
                    data.forEach(project => {
                        project.technologies?.forEach(tech => techSet.add(tech));
                    });
                    setAllTechnologies(['all', ...Array.from(techSet).sort()]);
                }
            } catch (error) {
                console.error('Failed to load projects', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProjects();
    }, []);

    useEffect(() => {
        let filtered = projects;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by technology
        if (selectedTech !== 'all') {
            filtered = filtered.filter(project =>
                project.technologies?.includes(selectedTech)
            );
        }

        setFilteredProjects(filtered);
    }, [searchQuery, selectedTech, projects]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-(--text-tertiary)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-(--bg)">
            {/* Hero Section */}
            <section className="py-20 md:py-28 bg-(--surface-muted)">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-(--text-primary)">
                        My Projects
                    </h1>
                    <p className="text-xl text-(--text-secondary) mb-4 leading-relaxed">
                        A collection of work showcasing my skills and passion for building great software.
                    </p>
                    <p className="text-sm text-(--text-tertiary)">
                        {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
                    </p>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 border-b border-(--border-muted) sticky top-[72px] bg-(--bg) z-40">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-6xl mx-auto">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-(--text-muted)" size={20} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-(--surface) border border-(--border) rounded-full text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--focus-ring) transition-all"
                            />
                        </div>

                        {/* Technology Filter */}
                        <div className="flex gap-2 flex-wrap justify-center">
                            {allTechnologies.slice(0, 8).map(tech => (
                                <button
                                    key={tech}
                                    onClick={() => setSelectedTech(tech)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedTech === tech
                                        ? 'bg-btn-primary-bg text-btn-primary-fg shadow-md'
                                        : 'bg-(--surface) text-(--text-secondary) border border-(--border) hover:bg-(--surface-hover) hover:border-(--border-strong)'
                                        }`}
                                >
                                    {tech === 'all' ? 'All' : tech}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-(--text-secondary)">No projects found matching your criteria.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedTech('all');
                                }}
                                className="mt-6 px-6 py-3 bg-btn-outline-bg text-btn-outline-fg border-2 border-btn-outline-border rounded-full font-semibold transition-all duration-200 hover:bg-btn-outline-hover-bg hover:text-btn-outline-hover-fg hover:border-btn-outline-hover-border"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project._id}
                                    className="group flex flex-col h-full bg-(--surface) border border-(--border) rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-(--accent)/50"
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video w-full bg-(--surface-muted) relative overflow-hidden">
                                        {project.thumbnail?.url ? (
                                            <img
                                                src={project.thumbnail.url}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-(--text-muted) text-sm font-medium">
                                                No Preview
                                            </div>
                                        )}

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                                            {project.liveURL && (
                                                <a
                                                    href={project.liveURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform duration-200 shadow-lg"
                                                    title="Live Demo"
                                                >
                                                    <ExternalLink size={20} />
                                                </a>
                                            )}
                                            {project.sourceURL && (
                                                <a
                                                    href={project.sourceURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-black text-white border border-white/20 rounded-full hover:scale-110 transition-transform duration-200 shadow-lg"
                                                    title="Source Code"
                                                >
                                                    <Github size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold mb-3 text-(--text-primary) group-hover:text-(--accent) transition-colors duration-200">
                                            {project.title}
                                        </h3>
                                        <p className="text-(--text-secondary) text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                                            {project.description}
                                        </p>

                                        {/* Tech Stack */}
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.technologies.slice(0, 4).map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 text-xs font-medium bg-(--surface-muted) text-(--text-secondary) rounded-full border border-(--border-muted)"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.technologies.length > 4 && (
                                                    <span className="px-3 py-1 text-xs font-medium text-(--text-tertiary)">
                                                        +{project.technologies.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="mt-auto pt-4 border-t border-(--border-muted)">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2 text-xs text-(--text-tertiary)">
                                                    <Calendar size={14} />
                                                    <span>{formatDate(project.createdAt)}</span>
                                                </div>
                                                {project.featured && (
                                                    <span className="px-3 py-1 text-xs font-bold bg-emerald-500 text-white rounded-full shadow-md shadow-emerald-500/30">
                                                        ⭐ Featured
                                                    </span>
                                                )}
                                            </div>
                                            <Link
                                                to={`/projects/${project._id}`}
                                                className="block w-full text-center px-4 py-2 bg-btn-outline-bg text-btn-outline-fg border-2 border-btn-outline-border rounded-full text-sm font-semibold transition-all duration-200 hover:bg-btn-outline-hover-bg hover:text-btn-outline-hover-fg hover:border-btn-outline-hover-border"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Projects;
