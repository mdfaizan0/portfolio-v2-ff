import * as SimpleIcons from 'simple-icons';

function Skills({ skills = [] }) {
    if (!skills.length) return null;

    return (
        <section className="py-24 bg-(--bg)">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-(--text-primary)">Technical Skills</h2>
                    <p className="text-(--text-secondary)">Technologies and tools I work with.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {skills.map((skill) => {
                        const iconKey = 'si' + skill.icon.charAt(0).toUpperCase() + skill.icon.slice(1);
                        const iconObj = SimpleIcons[iconKey] || SimpleIcons['si' + skill.name];
                        let iconData = iconObj;
                        if (!iconData) {
                            const found = Object.values(SimpleIcons).find(i => i.slug === skill.icon || i.title.toLowerCase() === skill.name.toLowerCase());
                            if (found) iconData = found;
                        }

                        return (
                            <div key={skill._id} className="group flex flex-col items-center justify-center p-8 bg-(--surface) border border-(--border) rounded-2xl transition-all duration-300 hover:border-(--accent) hover:shadow-lg hover:-translate-y-1">
                                {iconData ? (
                                    <svg
                                        role="img"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-12 h-12 mb-4 transition-transform duration-300 group-hover:scale-110"
                                        fill={`#${iconData.hex}`}
                                    >
                                        <title>{iconData.title}</title>
                                        <path d={iconData.path} />
                                    </svg>
                                ) : (
                                    <div className="w-12 h-12 mb-4 bg-(--surface-muted) rounded-full flex items-center justify-center text-sm font-bold text-(--text-secondary)">
                                        {skill.name.charAt(0)}
                                    </div>
                                )}
                                <span className="font-semibold text-base text-(--text-primary) text-center mb-3">{skill.name}</span>
                                {skill.level && (
                                    <div className="w-full h-1.5 bg-(--surface-muted) rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-(--text-primary) rounded-full opacity-50"
                                            style={{
                                                width: skill.level === 'expert' ? '90%' : skill.level === 'advanced' ? '60%' : '30%'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Skills
