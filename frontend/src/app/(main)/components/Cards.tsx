"use client"
import Link from "next/link";
import { useRouter } from "next/navigation"
import React from "react";

interface Book {
    title: string;
    author: string;
    thumbnail: string;
    description: string;
    category: string;
    sub_categories_count: number;
    total_insights: number;
}

interface CardProps {
    book: Book;
}

const Card: React.FC<CardProps> = ({ book }) => {
    const router = useRouter();
    console.log(book)
    return (
        <div className=" rounded-lg cursor-pointer  bg-gray-200  gap-2 p-2 break-inside-avoid flex flex-col" onClick={() => {
            sessionStorage.setItem("bookData", JSON.stringify(book));
            router.push(`/overview/${book.title}`);
        }}>
            <div className="flex gap-3 w-full">

                <img className="rounded-lg h-20" src={book.thumbnail} alt={book.title} />
                <div className="flex flex-col gap-3 w-full">
                    <h5 className="text-lg  md:text-2xl font-semibold text-gray-600">
                        {book.title}
                    </h5>
                    <p className=" text-gray-500 text-sm md:text-base"> {book.author}</p>

                </div>

            </div>
            <p className="font-normal text-sm text-gray-700 line-clamp-4 mt-auto">
                {book.description}
            </p>
            <div className="flex gap-2 justify-between mt-auto w-full">

                <button
                    className="text-gray-600 bg-gray-100  focus:outline-none rounded-full p-2 w-min  font-semibold "
                    // onClick={() => handleAdd(step.step_id, step.category)}
                    type="button"
                // className={`text-gray-600 bg-gray-100  focus:outline-none rounded-full p-2 w-min  font-semibold ${bookmarked.includes(step.step_id) ? 'outline-gray-800 outline-1 text-gray-500' : ''} `}
                >
                    {/* {bookmarked.includes(step.step_id) ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" />
                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>} */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                </button>
                <button
                    type="button"
                    className="text-gray-600 bg-gray-100  focus:outline-none rounded-full p-2 w-min  font-semibold "
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                    </svg>

                </button>

            </div>
            {/* <img className="rounded-lg " src={book.thumbnail} alt={book.title} />
            <div className="md:py-2 py-1 flex flex-col gap-1">
                <h5 className="text-xl font-semibold text-gray-600">
                    {book.title}
                </h5>
                <p className="text-sm text-gray-500 "> {book.author}</p> */}
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
            {/* </div> */}
        </div >
    );
};

export default Card;
