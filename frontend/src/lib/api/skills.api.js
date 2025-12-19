import publicClient from './publicClient';

export const fetchSkills = async () => {
    try {
        const response = await publicClient.get('/skills');
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching Skills data:', error);
        return [];
    }
};
