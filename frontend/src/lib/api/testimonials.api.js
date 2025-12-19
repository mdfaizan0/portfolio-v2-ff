import publicClient from './publicClient';

export const fetchTestimonials = async () => {
    try {
        const response = await publicClient.get('/testimonials');
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching Testimonials data:', error);
        return [];
    }
};
