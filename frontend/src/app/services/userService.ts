import axios from "axios";

const API = "http://192.168.129.43:8000" // Update based on your FastAPI server

export const registerUser = async (user: {
    name: string;
    email: string;
    password: string;
}) => {
    const res = await axios.post(`${API}/register`, user, {
        withCredentials: true
    });
    return res.data;
};

export const loginUser = async (user: {
    email: string;
    password: string;
}) => {
    const res = await axios.post(`${API}/login`, user, {
        withCredentials: true
    });
    return res.data;
};

export const getProfile = async (email: string) => {
    const res = await axios.get(`${API}/profile/${email}`);
    return res.data;
};

export const addFavouriteBook = async (email: string, book_id: number) => {
    const res = await axios.post(`${API}/favourite/book/add`, {
        email,
        book_id,
    });
    return res.data;
};

export const removeFavouriteBook = async (email: string, book_id: number) => {
    const res = await axios.post(`${API}/favourite/book/remove`, {
        email,
        book_id,
    });
    return res.data;
};

export const addFavouriteInsight = async (
    user_id: number,
    insight: { id: string; category: string }
) => {
    console.log("called")
    const res = await axios.post(`${API}/favourite/insight/add`, {
        user_id,
        insight,
    });
    return res.data;
};

export const removeFavouriteInsight = async (
    email: string,
    insight: { id: string; category: string }
) => {
    const res = await axios.post(`${API}/favourite/insight/remove`, {
        email,
        insight,
    });
    return res.data;
};
