import axios from 'axios';

export const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    params:{
        api_key: "ec1507892e1b410e81909efeb84a9c8d",
        language: "pt-BR",
        include_adult: false,
    }
});