"use client";
import React, { useEffect, useState } from "react";
import { getAllBooks } from "../services/bookService";
import Card from "../components/Cards";

const Page = () => {
    const [books, setBooks] = useState<any[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const books = await getAllBooks();
                setBooks(books);
                console.log(books)
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);

    return (
        <>
            <h4 className="" >Explore</h4>
            < div className="flex gap-2" >
                {books.map((book) => (
                    <Card key={book.id} book={book} />
                ))}
            </div>
        </>
    );
};

export default Page;
