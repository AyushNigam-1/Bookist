"use client";
import React, { useEffect, useState } from "react";
import { getAllBooks } from "../services/bookService";
import Card from "../components/Cards";
import Categories from "../components/Categories";

const Page = () => {
    const [books, setBooks] = useState<any[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                console.log("called")
                const books = await getAllBooks();
                setBooks(books);
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
        <div className="flex flex-col gap-4 w-full" >
            <div className="flex justify-between" >
                <h4 className="lg:text-4xl font-black text-gray-700 text-2xl" >Explore</h4>

                <form onSubmit={handleSubmit} className="md:flex items-center hidden">
                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="simple-search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
                            placeholder="Search branch name..."
                            required
                        />
                    </div>

                </form>
                <button className="md:hidden"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                </button>
            </div>
            {/* <Categories /> */}
            < div className="grid lg:grid-cols-4 grid-cols-2" >
                {books.map((book) => (
                    <Card key={book.title} book={book} />
                ))}
            </div>
        </div>
    );
};

export default Page;
