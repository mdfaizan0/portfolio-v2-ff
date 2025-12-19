import publicClient from './publicClient';

export const fetchProjects = async () => {
    try {
        const response = await publicClient.get('/projects');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
};

export const fetchProjectById = async (id) => {
    try {
        const response = await publicClient.get(`/projects/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
};
