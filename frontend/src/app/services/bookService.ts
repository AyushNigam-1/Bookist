import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Update based on your FastAPI server

export const getAllBooks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/books`);
        return response.data;
    } catch (error) {
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

export const getBookContentValue = async (title: string, key: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/book/${title}/${key}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

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
