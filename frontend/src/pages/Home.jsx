import { useState, useEffect } from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import Services from '../components/sections/Services';
import Testimonials from '../components/sections/Testimonials';
import Blogs from '../components/sections/Blogs';
import ContactCTA from '../components/sections/ContactCTA';
import { fetchAbout } from '../lib/api/about.api';
import { fetchProjects } from '../lib/api/projects.api';
import { fetchSkills } from '../lib/api/skills.api';
import { fetchExperience } from '../lib/api/experience.api';
import { fetchServices } from '../lib/api/services.api';
import { fetchTestimonials } from '../lib/api/testimonials.api';
import { fetchBlogs } from '../lib/api/blogs.api';

function Home() {
    const [heroData, setHeroData] = useState({});
    const [aboutData, setAboutData] = useState({});
    const [projectsData, setProjectsData] = useState([]);
    const [skillsData, setSkillsData] = useState([]);
    const [experienceData, setExperienceData] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [testimonialsData, setTestimonialsData] = useState([]);
    const [blogsData, setBlogsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [about, projects, skills, experience, services, testimonials, blogs] = await Promise.all([
                    fetchAbout(),
                    fetchProjects(),
                    fetchSkills(),
                    fetchExperience(),
                    fetchServices(),
                    fetchTestimonials(),
                    fetchBlogs()
                ]);

                if (about) {
                    setHeroData({
                        name: about.name,
                        role: about.role,
                        image: about.profileImage?.url
                    });
                    setAboutData({
                        bio: about.bio,
                        profileImage: about.profileImage
                    });
                }
                if (projects) setProjectsData(projects);
                if (skills) setSkillsData(skills);
                if (experience) setExperienceData(experience);
                if (services) setServicesData(services);
                if (testimonials) setTestimonialsData(testimonials);
                if (blogs) setBlogsData(blogs);

            } catch (error) {
                console.error("Failed to load home data", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-gray-600 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <Hero {...heroData} />
            <About {...aboutData} />
            <Skills skills={skillsData} />
            <Experience experience={experienceData} />
            <Projects projects={projectsData} />
            <Services services={servicesData} />
            <Testimonials testimonials={testimonialsData} />
            <Blogs blogs={blogsData} />
            <ContactCTA />
        </div>
    )
}

export default Home
