import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProjectById } from '../lib/api/projects.api';

function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const loadProject = async () => {
            try {
                const data = await fetchProjectById(id);
                if (data) {
                    setProject(data);
                } else {
                    navigate('/projects');
                }
            } catch (error) {
                console.error('Failed to load project', error);
                navigate('/projects');
            } finally {
                setIsLoading(false);
            }
        };

        loadProject();
    }, [id, navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const nextImage = () => {
        if (project?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
        }
    };

    const prevImage = () => {
        if (project?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
        }
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

    if (!project) {
        return null;
    }

    const allImages = project.images && project.images.length > 0 ? project.images : [];

    return (
        <div className="min-h-screen bg-(--bg)">
            {/* Back Button */}
            <div className="border-b border-(--border-muted) bg-(--surface-muted)">
                <div className="container mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/projects')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Projects
                    </button>
                </div>
            </div>

            {/* Project Header */}
            <section className="py-12 md:py-16 bg-(--surface-muted)">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            {project.featured && (
                                <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30 animate-pulse">
                                    ⭐ Featured Project
                                </span>
                            )}
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--text-primary)">
                                {project.title}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-(--text-tertiary)">
                                <Calendar size={16} />
                                <span>{formatDate(project.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-8">
                        {project.liveURL && (
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-btn-primary-bg text-btn-primary-fg rounded-full font-semibold shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-btn-primary-hover-bg hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5">
                                <a
                                    href={project.liveURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='inline-flex items-center gap-2'
                                >
                                    <ExternalLink size={18} />
                                    View Live Demo
                                </a>
                            </button>
                        )}
                        {project.sourceURL && (
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-btn-secondary-bg text-btn-secondary-fg border-2 border-btn-secondary-border rounded-full font-semibold transition-all duration-200 hover:bg-btn-secondary-hover-bg hover:border-btn-secondary-hover-border hover:-translate-y-0.5">
                                <a
                                    href={project.sourceURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='inline-flex items-center gap-2'
                                >
                                    <Github size={18} />
                                    View Source Code
                                </a>
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Image Gallery */}
            {allImages.length > 0 && (
                <section className="py-12 bg-(--bg)">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <h2 className="text-2xl font-bold mb-6 text-(--text-primary)">Project Gallery</h2>

                        {/* Main Image Slider */}
                        <div className="relative bg-(--surface) rounded-2xl overflow-hidden border border-(--border) shadow-lg">
                            <div className="aspect-video w-full bg-(--surface-muted) relative overflow-hidden">
                                {/* Image Container with Slide Transition */}
                                <div
                                    className="flex transition-transform duration-500 ease-in-out h-full"
                                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                >
                                    {allImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.url}
                                            alt={`${project.title} - Image ${index + 1}`}
                                            className="w-full h-full object-cover shrink-0"
                                        />
                                    ))}
                                </div>

                                {/* Navigation Arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}

                                {/* Image Counter */}
                                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                                    {currentImageIndex + 1} / {allImages.length}
                                </div>
                            </div>
                        </div>
                        {/* Thumbnail Navigation */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentImageIndex
                                            ? 'border-(--accent) scale-105 shadow-lg'
                                            : 'border-(--border) hover:border-(--border-strong) opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Project Details */}
            <section className="py-12 bg-(--surface-muted)">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Description */}
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold mb-4 text-(--text-primary)">About This Project</h2>
                            <p className="text-(--text-secondary) text-lg leading-relaxed whitespace-pre-line">
                                {project.description}
                            </p>
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-(--text-primary)">Technologies Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies?.map((tech, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 text-sm font-medium bg-(--surface) text-(--text-primary) rounded-full border border-(--border) hover:border-(--accent) transition-colors"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back to Projects CTA */}
            <section className="py-16 bg-(--bg)">
                <div className="container mx-auto px-4 text-center">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-btn-outline-bg text-btn-outline-fg border-2 border-btn-outline-border rounded-full font-semibold transition-all duration-200 hover:bg-btn-outline-hover-bg hover:text-btn-outline-hover-fg hover:border-btn-outline-hover-border hover:-translate-y-0.5"
                    >
                        <ArrowLeft size={18} />
                        View All Projects
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default ProjectDetail;
