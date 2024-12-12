import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Backend server URL

export const fetchTimelineData = async () => {
    const response = await axios.get(`${API_URL}/timeline`);
    return response.data;
};

export const fetchGraphData = async () => {
    const response = await axios.get(`${API_URL}/graph`);
    return response.data;
};
