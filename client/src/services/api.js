import axios from 'axios';

const baseURL = 'https://mydatatalk.onrender.com/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});



export { api };