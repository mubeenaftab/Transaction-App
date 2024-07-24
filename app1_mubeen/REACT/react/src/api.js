// api connect library axios to connect react and fastapi
import axios from 'axios'


const api = axios.create({
    baseURL: 'http://localhost:8000',
    baseURL: 'https://transaction-app-x5xt.vercel.app/'

});

export default api;