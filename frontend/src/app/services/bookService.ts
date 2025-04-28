import axios from "axios";

const API_BASE_URL = "http://192.168.235.43:8000" // Update based on your FastAPI server

export const getAllBooks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/books`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-categories`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const findBooksByCategories = async (categories: string[]) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/books/find-by-categories`, categories);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
export const getBookContentKeys = async (title: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/book/${title}/content_keys`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBookContentValue = async (title: string, category: string[]) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/book/${title}`, category);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export async function getStepDetails(stepId: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/insights/${stepId}`);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const createBook = async (bookData: {
    Title: string;
    Author: string;
    Description: string;
    Thumbnail: string;
    Content: object;
}) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/books/`, bookData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const processBook = async (file: File, bookDetails: Record<string, string>) => {
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(bookDetails).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {
        const response = await axios.post(`${API_BASE_URL}/process-book`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getBookInfoByTitle = async (title: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/book/${title}/info`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addFavouriteInsight = async (userId: number, insight: {
    id: number;
    category: string;
    description: string
}) => {
    try {
        console.log(userId, insight)
        const response = await axios.post(`${API_BASE_URL}/favourite/insight/add`, {
            user_id: userId,
            insight: insight
        });
        console.log(response)
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Failed to add favourite insight');
    }
};

export const removeFavouriteInsight = async (
    email: string,
    insight: {
        id: string;
        category: string;
    }
): Promise<{ message: string }> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/favourite/insight/remove`, {
            email: email,
            insight: insight
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'Failed to remove favourite insight');
    }
};