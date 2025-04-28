"use client"
import Link from "next/link";
import { useRouter } from "next/navigation"
import React, { useState } from "react";
import ShareModal from "./ShareModal";

interface Book {
    title: string;
    author: string;
    thumbnail: string;
    description: string;
    category: string[];
    sub_categories_count: number;
    total_insights: number;
}

interface CardProps {
    book: Book;
}

const Card: React.FC<CardProps> = ({ book }) => {
    const router = useRouter();
    console.log(book)
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className=" rounded-2xl cursor-pointer overflow-clip bg-gray-200  gap-2 p-2 break-inside-avoid flex flex-col" onClick={() => {
            // sessionStorage.setItem("bookData", JSON.stringify(book));
            router.push(`/overview/${book.title}`);
        }}>
            <div className="flex flex-col gap-4 w-full">
                <div className="relative w-full flex justify-center items-center overflow-clip rounded-xl  ">
                    {/* <div className="flex gap-2 justify-between mt-auto w-full absolute bottom-0 p-2">
                        <button
                            type="button"
                            className="text-gray-600 bg-gray-200  focus:outline-none rounded-full p-2 w-min  font-semibold "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>

                        </button>
                        <button
                            className="text-gray-600 bg-gray-200  focus:outline-none rounded-full p-2 w-min  font-semibold "
                            // onClick={() => handleAdd(step.step_id, step.category)}
                            type="button"
                        // className={`text-gray-600 bg-gray-100  focus:outline-none rounded-full p-2 w-min  font-semibold ${bookmarked.includes(step.step_id) ? 'outline-gray-800 outline-1 text-gray-500' : ''} `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </button>


                    </div> */}


                    <img
                        src={book.thumbnail}
                        className="relative z-10  shadow-lg rounded-2xl  object-contain"
                        alt={book.title}
                    />
                </div>
                <div className="flex flex-col gap-3 w-full justify-center">
                    {/* <h5 className="text-gray-600 font-semibold text-xl md:text-2xl ">
                        {book.title}
                    </h5> */}
                    {/* <p className=" text-gray-500 "> &bull; {book.author}</p> */}
                    <div className="flex gap-3  flex-wrap " >
                        {book?.category.map((category: any, index: number) => {
                            const mainCategory = category.trim().split("&")[0].trim(); // Split by "&" and take first part

                            return (
                                <h4
                                    key={index}
                                    className="bg-gray-100 py-1 px-2  rounded-lg w-min text-nowrap text-xs md:text-sm flex gap-1 text-gray-600  items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                                    </svg>
                                    {mainCategory}
                                </h4>
                            );
                        })}
                    </div>
                    <div className="flex gap-2 justify-between mt-auto w-full  p-2">
                        <button
                            type="button"
                            className="text-gray-600 bg-gray-100  focus:outline-none rounded-full p-2 w-min  font-semibold cursor-pointer"
                            onClick={() => setIsOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>

                        </button>
                        <button
                            className="text-gray-600 bg-gray-100  focus:outline-none rounded-full p-2 w-min  font-semibold cursor-pointer"
                            // onClick={() => handleAdd(step.step_id, step.category)}
                            type="button"
                        // className={`text-gray-600 bg-gray-100  focus:outline-none rounded-full p-2 w-min  font-semibold ${bookmarked.includes(step.step_id) ? 'outline-gray-800 outline-1 text-gray-500' : ''} `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                        </button>
                        <ShareModal isOpen={isOpen} setIsOpen={setIsOpen} shareUrl="https://www.example.com" />

                    </div>
                    {/* <p className="font-normal text-sm text-gray-700 line-clamp-5 md:line-clamp-4 md:mt-auto">
                        {book.description}
                    </p> */}
                    {/* <div className="flex gap-1.5  flex-wrap  md:justify-normal max-w-[600px] " >
                        {book?.category.split(/[,&]/).map((category: any, index: Number) => <h4 className=" bg-gray-100 p-0.5 px-1.5 rounded-lg w-min text-nowrap text-xs flex gap-1  text-gray-800 items-center "
                            key={String(index)} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                            </svg>

                            {category}
                        </h4>)}
                    </div> */}
                </div>

            </div>
            {/* <p className="font-normal text-sm text-gray-700 line-clamp-4 mt-auto">
                {book.description}
            </p> */}

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
        </div >
    );
};

export default Card;
