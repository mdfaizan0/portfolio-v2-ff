import { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { sendMessage } from '../lib/api/contact.api';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (status === 'error') {
            setStatus('idle');
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            await sendMessage(formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => {
                setStatus('idle');
            }, 5000);
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-(--bg)">
            {/* Hero Section */}
            <section className="py-20 md:py-28 bg-(--surface-muted)">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-(--text-primary)">
                        Get In Touch
                    </h1>
                    <p className="text-xl text-(--text-secondary) leading-relaxed">
                        Have a project in mind or just want to say hello? I'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-6 text-(--text-primary)">
                                    Let's Connect
                                </h2>
                                <p className="text-(--text-secondary) text-lg leading-relaxed mb-8">
                                    Whether you have a question, want to collaborate, or just want to connect, feel free to reach out. I'll get back to you as soon as possible.
                                </p>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 bg-(--surface) border border-(--border) rounded-xl hover:border-(--accent) transition-colors">
                                    <div className="p-3 bg-(--accent-soft) rounded-lg">
                                        <Mail className="text-(--accent)" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-(--text-primary) mb-1">Email</h3>
                                        <a
                                            href="mailto:faizanm78692@gmail.com"
                                            className="text-(--text-secondary) hover:text-(--accent) transition-colors"
                                        >
                                            faizanm78692@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-(--surface) border border-(--border) rounded-xl hover:border-(--accent) transition-colors">
                                    <div className="p-3 bg-(--accent-soft) rounded-lg">
                                        <MapPin className="text-(--accent)" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-(--text-primary) mb-1">Location</h3>
                                        <p className="text-(--text-secondary)">
                                            Kolkata, India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Optional: Social Links */}
                            <div className="pt-6 border-t border-(--border-muted)">
                                <h3 className="font-semibold text-(--text-primary) mb-4">Follow Me</h3>
                                <div className="flex gap-4">
                                    <a
                                        href="https://www.github.com/mdfaizan0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-(--surface) border border-(--border) rounded-lg text-(--text-secondary) hover:text-(--accent) hover:border-(--accent) transition-all"
                                    >
                                        GitHub
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/mdfaizan16"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-(--surface) border border-(--border) rounded-lg text-(--text-secondary) hover:text-(--accent) hover:border-(--accent) transition-all"
                                    >
                                        LinkedIn
                                    </a>
                                    <a
                                        href="https://www.x.com/_aryanism"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-(--surface) border border-(--border) rounded-lg text-(--text-secondary) hover:text-(--accent) hover:border-(--accent) transition-all"
                                    >
                                        Twitter
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            {status === 'success' ? (
                                // Success Message
                                <div className="h-full flex items-center justify-center p-8 bg-(--surface) border border-(--border) rounded-2xl">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-full mb-6">
                                            <CheckCircle className="text-emerald-500" size={48} />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4 text-(--text-primary)">
                                            Thank You!
                                        </h3>
                                        <p className="text-lg text-(--text-secondary) mb-6 leading-relaxed">
                                            Your message has been sent successfully. I'll get back to you as soon as possible.
                                        </p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="px-6 py-3 bg-btn-outline-bg text-btn-outline-fg border-2 border-btn-outline-border rounded-full font-semibold transition-all duration-200 hover:bg-btn-outline-hover-bg hover:text-btn-outline-hover-fg hover:border-btn-outline-hover-border"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Contact Form
                                <div className="p-8 bg-(--surface) border border-(--border) rounded-2xl">
                                    <h3 className="text-2xl font-bold mb-6 text-(--text-primary)">
                                        Send a Message
                                    </h3>

                                    {status === 'error' && (
                                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                                            <div>
                                                <p className="text-red-500 font-medium">Error</p>
                                                <p className="text-red-500/80 text-sm">{errorMessage}</p>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold mb-2 text-(--text-primary)">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-(--border) bg-(--bg) text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-(--text-primary)">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-(--border) bg-(--bg) text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-semibold mb-2 text-(--text-primary)">
                                                Message *
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={6}
                                                className="w-full px-4 py-3 rounded-lg border border-(--border) bg-(--bg) text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent transition-all resize-none"
                                                placeholder="Tell me about your project..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-btn-primary-bg text-btn-primary-fg rounded-full font-semibold shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-btn-primary-hover-bg hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={20} />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
