import axios from "axios";

const API = "http://192.168.235.43:8000" // Update based on your FastAPI server

export interface Insight {
    id: number;
    title: string;
    content: string;
    category: string;
    // add other fields here based on your DB structure
}

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
    insight: { id: number; category: string, description: string }
) => {
    console.log("called")
    const res = await axios.post(`${API}/favourite/insight/add`, {
        user_id,
        insight,
    });
    return res.data;
};


export async function getFavouriteCategories(userId: number) {
    // console.log(userId)
    const response = await axios.get(`${API}/favourite/insight/categories/${userId}`);
    return response.data.categories;
}

export async function getFavouriteIds(userId: number) {
    const response = await axios.get(`${API}/favourite/insights/ids/${userId}`);
    return response.data.favourite_ids;
}

export async function getFavouriteInsights(userId: number, category?: string[]) {
    console.log(userId, category)
    const response = await axios.post(`${API}/favourite/insight/list/${userId}`, category);

    return response.data.insights;
}