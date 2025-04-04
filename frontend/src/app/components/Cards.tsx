"use client"
import Link from "next/link";
import { useRouter } from "next/navigation"
import React from "react";

interface Book {
    title: string;
    author: string;
    thumbnail: string;
    description: string;
    category: string
}

interface CardProps {
    book: Book;
}

const Card: React.FC<CardProps> = ({ book }) => {
    const router = useRouter();

    return (
        <div className=" rounded-lg cursor-pointer" onClick={() => {
            sessionStorage.setItem("bookData", JSON.stringify(book));
            router.push(`/overview/${book.title}`);
        }}>
            <img className="rounded-lg " src={book.thumbnail} alt={book.title} />
            <div className="md:py-2 py-1 flex flex-col gap-1">
                <h5 className="text-xl font-semibold text-gray-600">
                    {book.title}
                </h5>
                <p className="text-sm text-gray-500 "> {book.author}</p>
                {/* <p className="font-normal text-gray-700 line-clamp-4"> */}
                {/* {book.description.length > 150 ? `${book.description.substring(0, 150)}...` : book.description} */}
                {/* </p> */}
                {/* <div className="flex gap-3  flex-wrap  md:justify-normal max-w-[600px] " >
                    {book?.category.split(/[,&]/).map((category: any, index: Number) => <h4 className=" bg-gray-100 p-1 px-3 rounded-lg w-min text-nowrap text-sm flex gap-1  text-gray-800 items-center "
                        key={String(index)} >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                        </svg>

                        {category}
                    </h4>)}
                </div> */}
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
