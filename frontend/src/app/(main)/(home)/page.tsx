"use client";
import React, { useEffect, useState } from "react";
import { getAllBooks } from "../services/bookService";
import Card from "../components/Cards";
import Categories from "../components/Categories";
import SearchBar from "../components/SearchBar";

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
            <div className={`flex justify-between items-center pt-2`} >
                <h4 className="lg:text-4xl font-black text-gray-700 text-2xl" >Explore</h4>
                <SearchBar responsive={true} />

                <button className="md:hidden"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                </button>
                {/* <Link href="/swipelayout" >
                    Swipe Layout
                </Link> */}
            </div>
            < div className="grid lg:grid-cols-5 grid-cols-2" >
                {books.map((book) => (
                    <Card key={book.title} book={book} />
                ))}
            </div>
        </div>

    );
};

export default Page;
