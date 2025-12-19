import publicClient from './publicClient';

export const fetchAbout = async () => {
    try {
        const response = await publicClient.get('/about');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching About data:', error);
        return null;
    }
};
