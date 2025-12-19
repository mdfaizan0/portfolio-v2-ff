import publicClient from './publicClient';

export const fetchBlogs = async () => {
    try {
        const response = await publicClient.get('/blogs');
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching Blogs data:', error);
        return [];
    }
};

export const fetchBlogBySlug = async (slug) => {
    try {
        const response = await publicClient.get(`/blogs/${slug}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
    }
};
