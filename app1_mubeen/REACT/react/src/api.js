// api connect library axios to connect react and fastapi
import axios from 'axios'


const api = axios.create({
    baseURL: 'http://localhost:8000',
});

export default api;