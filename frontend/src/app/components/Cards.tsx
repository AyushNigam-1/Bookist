"use client"
import Link from "next/link";
import { useRouter } from "next/navigation"
import React from "react";

interface Book {
    title: string;
    author: string;
    thumbnail: string;
    description: string;
}

interface CardProps {
    book: Book;
}

const Card: React.FC<CardProps> = ({ book }) => {
    const router = useRouter();

    return (
        <div className=" rounded-lg ">
            <a href="#">
                <img className="rounded-lg h-80" src={book.thumbnail} alt={book.title} />
            </a>
            <div className="py-2">
                <button onClick={() => {
                    sessionStorage.setItem("bookData", JSON.stringify(book));
                    router.push(`/overview/${book.title}`);
                }}>
                    <h5 className="text-xl font-semibold text-gray-600">
                        {book.title}
                    </h5>
                </button>
                <p className="text-sm text-gray-500 "> {book.author}</p>
                <p className="font-normal text-gray-700 line-clamp-4">
                    {/* {book.description.length > 150 ? `${book.description.substring(0, 150)}...` : book.description} */}
                </p>
                {/* <a
                    href="#"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Read more
                    <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </a> */}
            </div>
        </div>
    );
};

export default Card;
