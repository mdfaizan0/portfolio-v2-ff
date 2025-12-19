import publicClient from './publicClient';

export const fetchExperience = async () => {
    try {
        const response = await publicClient.get('/experience');
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching Experience data:', error);
        return [];
    }
};
