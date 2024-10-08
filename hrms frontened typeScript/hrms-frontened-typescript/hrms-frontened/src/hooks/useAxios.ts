
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../types/types';
const useAxios = () => {
    const { accessToken } = useSelector((state : RootState) => state.auth);

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : null,
            'Content-Type': 'application/json',
        },
    });

    return instance;
};

export default useAxios;
