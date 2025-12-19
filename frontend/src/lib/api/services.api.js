import publicClient from './publicClient';

export const fetchServices = async () => {
    try {
        const response = await publicClient.get('/services');
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching Services data:', error);
        return [];
    }
};
