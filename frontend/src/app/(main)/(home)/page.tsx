"use client";
import React, { useEffect, useState } from "react";
import Card from "../components/Cards";
import SearchBar from "../components/SearchBar";
import { getAllBooks } from "@/app/services/bookService";

const Page = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const books = await getAllBooks();
                setBooks(books);
                setFilteredBooks(books);
                console.log(books)
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);
    const [search, setSearch] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Searching for:", search);
    };
    return (
        <div className="flex flex-col w-full" >
            <div className={`flex justify-between items-center h-14 md:h-18 sticky top-0 bg-gray-100`} >
                <h4 className="justify-between flex lg:text-4xl font-bold text-gray-700 text-2xl text-center md:text-left  gap-2" >Explore</h4>
                <SearchBar responsive={true} data={books} propertyToSearch='title' setFilteredData={setFilteredBooks} />
            </div>
            < div className="columns-1 gap-3 lg:columns-3 space-y-3" >
                {filteredBooks.map((book) => (
                    <Card key={book.title} book={book} />
                ))}
            </div>
        </div>

    );
};

export default Page;
