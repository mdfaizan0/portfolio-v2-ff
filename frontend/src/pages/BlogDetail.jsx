import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { fetchBlogBySlug } from '../lib/api/blogs.api';

function BlogDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadBlog = async () => {
            try {
                const data = await fetchBlogBySlug(slug);
                if (data) {
                    setBlog(data);
                } else {
                    navigate('/blogs');
                }
            } catch (error) {
                console.error('Failed to load blog', error);
                navigate('/blogs');
            } finally {
                setIsLoading(false);
            }
        };

        loadBlog();
    }, [slug, navigate]);

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

    if (!blog) {
        return null;
    }

    // Handle markdownContent (could be array or string)
    const content = Array.isArray(blog.markdownContent)
        ? blog.markdownContent.join('\n')
        : blog.markdownContent;

    return (
        <div className="min-h-screen bg-(--bg)">
            {/* Back Button */}
            <div className="border-b border-(--border-muted) bg-(--surface-muted)">
                <div className="container mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate('/blogs')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Articles
                    </button>
                </div>
            </div>

            {/* Cover Image */}
            {blog.coverImage?.url && (
                <div className="w-full max-w-5xl mx-auto px-4 pt-8">
                    <div className="aspect-video w-full bg-(--surface-muted) overflow-hidden rounded-2xl shadow-xl border border-(--border)">
                        <img
                            src={blog.coverImage.url}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Article Header */}
            <article className="py-12 md:py-16">
                <div className="container mx-auto px-4 max-w-3xl">

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-(--text-primary) leading-tight">
                        {blog.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-(--text-tertiary) mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{calculateReadTime(content)}</span>
                        </div>
                    </div>

                    {/* Markdown Content */}
                    <div className="prose">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>
            </article>

            {/* Back to Articles CTA */}
            <section className="py-16 bg-(--surface-muted) border-t border-(--border-muted)">
                <div className="container mx-auto px-4 text-center">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-btn-outline-bg text-btn-outline-fg border-2 border-btn-outline-border rounded-full font-semibold transition-all duration-200 hover:bg-btn-outline-hover-bg hover:text-btn-outline-hover-fg hover:border-btn-outline-hover-border hover:-translate-y-0.5"
                    >
                        <ArrowLeft size={18} />
                        View All Articles
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default BlogDetail;