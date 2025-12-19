import ReactMarkdown from 'react-markdown';

function About({ bio }) {
    if (!bio) return null;

    return (
        <section className="py-24 md:py-32 bg-(--bg)">
            <div className="container mx-auto px-4 max-w-5xl">
                <span className="inline-block mb-6 text-sm font-bold tracking-widest text-(--accent) uppercase">
                    About Me
                </span>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight text-(--text-primary) mb-12">
                    Passionate about creating digital experiences that bridge the gap between complexity and usability.
                </h2>
                <div className="prose prose-lg dark:prose-invert text-(--text-secondary) leading-relaxed max-w-none text-xl md:text-2xl font-light">
                    <ReactMarkdown>
                        {bio}
                    </ReactMarkdown>
                </div>
            </div>
        </section>
    )
}

export default About
