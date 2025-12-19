import publicClient from './publicClient';

export const sendMessage = async (data) => {
    try {
        const response = await publicClient.post('/messages', data);
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};
