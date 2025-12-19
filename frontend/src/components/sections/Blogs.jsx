import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

function Blogs({ blogs = [] }) {
    if (!blogs.length) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const calculateReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    };

    return (
        <section className="py-24 bg-(--bg)">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <h2 className="text-4xl font-bold mb-4 text-(--text-primary)">Latest Writing</h2>
                        <p className="text-(--text-secondary) max-w-xl">Thoughts, tutorials, and insights on web development.</p>
                    </div>
                    <Link
                        to="/blogs"
                        className="hidden md:inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-btn-ghost-bg text-btn-ghost-fg rounded-full transition-all duration-200 hover:bg-btn-ghost-hover-bg hover:text-btn-ghost-hover-fg"
                    >
                        View All Posts
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.slice(0, 3).map((blog) => (
                        <Link
                            key={blog._id}
                            to={`/blogs/${blog._id}`}
                            className="group flex flex-col h-full bg-(--surface) border border-(--border) rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-(--accent)/50"
                        >
                            {/* Cover Image */}
                            <div className="aspect-video w-full bg-(--surface-muted) relative overflow-hidden">
                                {blog.coverImage?.url ? (
                                    <img
                                        src={blog.coverImage.url}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-(--text-muted) text-sm font-medium">
                                        No Cover
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold mb-3 text-(--text-primary) group-hover:text-(--accent) transition-colors duration-200 line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-(--text-secondary) text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                    {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                                </p>

                                {/* Footer */}
                                <div className="mt-auto pt-4 border-t border-(--border-muted) flex items-center justify-between text-xs text-(--text-tertiary)">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{calculateReadTime(blog.content || '')}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-btn-ghost-bg text-btn-ghost-fg rounded-full transition-all duration-200 hover:bg-btn-ghost-hover-bg hover:text-btn-ghost-hover-fg"
                    >
                        View All Posts &rarr;
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Blogs
