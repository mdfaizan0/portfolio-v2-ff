import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { fetchBlogs } from '../lib/api/blogs.api';

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const data = await fetchBlogs();
                setBlogs(data);
            } catch (error) {
                console.error("Failed to load blogs", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadBlogs();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const calculateReadTime = (content) => {
        if (!content) return '5 min read';
        const wordsPerMinute = 200;
        const text = Array.isArray(content) ? content.join(' ') : content;
        const wordCount = text.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
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
    console.log(blogs)

    return (
        <div className="min-h-screen bg-(--bg)">
            {/* Hero Section */}
            <section className="py-20 md:py-28 bg-(--surface-muted)">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-(--text-primary)">
                        Writing
                    </h1>
                    <p className="text-xl text-(--text-secondary) leading-relaxed">
                        Thoughts, tutorials, and insights on web development and technology.
                    </p>
                </div>
            </section>

            {/* Articles List */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {blogs.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-(--text-secondary)">No articles published yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog._id}
                                    to={`/blogs/${blog.slug}`}
                                    className="group block pb-12 border-b border-(--border-muted) last:border-0 transition-all duration-200"
                                >
                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-sm text-(--text-tertiary) mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>{formatDate(blog.createdAt)}</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>{calculateReadTime(blog.markdownContent)}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-3xl font-bold mb-4 text-(--text-primary) group-hover:text-(--accent) transition-colors duration-200">
                                        {blog.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-(--text-secondary) text-lg leading-relaxed mb-4">
                                        {blog.excerpt}
                                    </p>

                                    {/* Read More */}
                                    <span className="inline-flex items-center text-sm font-semibold text-(--accent) group-hover:underline underline-offset-4">
                                        Read Article →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Blogs;
