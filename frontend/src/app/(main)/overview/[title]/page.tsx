"use client"
import { useEffect, useState } from "react";
import { getBookInfoByTitle } from "@/app/services/bookService";
import { useParams } from "next/navigation";
import Link from "next/link";

const Overview = () => {
    const [book, setBook] = useState<any>(null);
    const params = useParams<{ title?: string }>();
    useEffect(() => {
        const getBook = async () => {
            if (!params.title) return
            const bookInfo = await getBookInfoByTitle(params?.title)
            if (bookInfo) {
                console.log(bookInfo)
                setBook(bookInfo);
            }
        }
        getBook()
    }, []);
    return (
        <div className="flex flex-col gap-4  w-full py-4">
            {/* <div className="absolute  h-64 bg-gray-100 rounded-2xl " ></div> */}

            <div className="flex flex-col md:flex-row relative gap-4 w-full "  >
                <img src={book?.thumbnail} className="z-30 rounded-xl  mx-auto h-68 shadow-md  md:w-auto " alt={book?.title} />
                <img src={book?.thumbnail} className=" absolute blur-md md:hidden -p-2 rounded-xl mx-auto shadow-md h-64 w-full object-cover  md:h-56 md:w-auto" alt={book?.title} />

                {/* <span></span> */}
                <div className="flex flex-col justify-between w-full">
                    <div className="flex flex-col  md:items-start" >
                        <h1 className="text-gray-600 font-bold text-3xl md:text-4xl ">{book?.title}</h1>
                        <span className=" text-gray-600 text-sm md:text-lg flex items-center justify-between"> &bull; {book?.author} &nbsp; &bull;  {book?.sub_categories_count} Categories &nbsp; &bull;  {book?.total_insights} Insights  </span>
                    </div>

                    <div className="flex gap-3  flex-wrap  md:justify-normal max-w-[600px]" >
                        {book?.categories.split(/[,&]/).map((category: any, index: Number) => <h4 className=" bg-gray-200 p-1 px-3 rounded-lg w-min text-nowrap text-sm flex gap-1  text-gray-800 items-center "
                            key={String(index)} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                            </svg>

                            {category}
                        </h4>)}
                    </div>
                    {/* <div className="flex justify-content gap-3">

                        <span className="flex items-center bg-gray-200 px-2 py-1 text-gray-800 gap-1  w-min text-nowrap  rounded-full text-sm" >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-4 fill-gray-200">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                            4.5
                        </span>
                        <span className="flex items-center bg-gray-200 px-2 py-1 text-gray-800 gap-1  w-min text-nowrap  rounded-full text-sm" >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>

                            10
                        </span>
                    </div> */}

                    {/* <div className="flex gap-2 justify-between w-full"> */}
                    <div className="flex gap-2 justify-between md:justify-normal w-full">
                        {/* <button
                            type="button"
                            className="text-gray-200  bg-gray-700  w-full  flex gap-2 items-center justify-center focus:outline-none rounded-lg py-2 px-4 md:w-min  font-semibold "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>

                            Like
                        </button> */}
                        <button
                            type="button"
                            className="text-gray-200  bg-gray-700   w-full justify-center  flex gap-2 items-center  focus:outline-none rounded-lg py-2 px-4  md:w-min  font-semibold "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>

                            Bookmark
                        </button>
                        <Link
                            href={`/steps/${book?.title} `}
                            type="button"
                            // className="text-white    focus:outline-none  py-3 md:py-2 px-4 rounded-lg md:w-min w-[96vw] font-semibold flex md:relative bottom-4 md:bottom-0  gap-2 items-center justify-center fixed "
                            className="text-gray-200  bg-gray-700   w-full justify-center  flex gap-2 items-center  focus:outline-none rounded-lg py-2 px-4  md:w-min  font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>

                            Open
                        </Link>
                        {/* <Link
                            href={`/steps/${book?.title} `}
                            type="button"
                            // className="text-white    focus:outline-none  py-3 md:py-2 px-4 rounded-lg md:w-min w-[96vw] font-semibold flex md:relative bottom-4 md:bottom-0  gap-2 items-center justify-center fixed "
                            className="text-white bg-gray-700 focus:outline-none  py-3 md:py-2 px-4 rounded-lg md:w-min w-[94vw] font-semibold flex md:relative bottom-4 md:bottom-0  gap-2 items-center justify-center fixed ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>

                            Open
                        </Link> */}
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
            <p className="text-md text-gray-500 flex gap-2 items-center" >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                About Book
            </p>
            <p className=" text-xl text-gray-500 font-medium">
                {/* <ReactMarkdown
                    remarkPlugins={[remarkGfm]}

                    components={{
                        h1: ({ children }) => <h1 className="text-6xl font-bold mt-6 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold text-gray-700 mt-5 mb-2">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc ml-6 text-lg">{children}</ul>,
                        li: ({ children }) => <li className="text-gray-600">{children}</li>,
                        p: ({ children }) => <p className="text-lg leading-relaxed">{children}</p>,
                    }}
                > */}
                {book?.description}
                {/* ### **Summary of *Meditations* by Marcus Aurelius**

                *Meditations* is a collection of personal reflections written by Roman Emperor **Marcus Aurelius** as a guide for self-improvement and inner peace. It is deeply rooted in **Stoic philosophy**, emphasizing discipline, virtue, and acceptance of life’s challenges.

                The book is divided into **12 sections**, each containing personal thoughts rather than structured arguments. Marcus repeatedly reminds himself to focus on **what he can control**, accept external events as part of nature, and act with **wisdom, justice, courage, and self-discipline**.

                #### **Key themes of the book include:**
                - **Control vs. Acceptance** – We should not waste energy on things outside our control but focus on our actions and mindset.
                - **Death & Impermanence** – Life is short, and everything is temporary, so we should live virtuously without attachment to status or materialism.
                - **Dealing with Others** – People may act irrationally, but we should remain calm and respond with reason rather than anger.
                - **Inner Peace & Simplicity** – Happiness comes from within, not from external success or wealth.

                Throughout *Meditations*, Marcus Aurelius reminds himself to **stay rational, avoid unnecessary suffering, and act according to nature’s order**. The book serves as a timeless **manual for self-discipline, resilience, and mental clarity**, making it one of the most influential works of Stoic philosophy. */}


                {/* </ReactMarkdown> */}
            </p>
            <p className="text-md text-gray-600 flex gap-2 items-center" >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                About Author
            </p>
            <p className="text-xl text-gray-500 font-medium">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque sunt quidem nostrum inventore neque, molestiae eligendi officiis earum! Ipsa laudantium iste accusamus? Similique molestiae dolore aut alias! Dolorum molestiae voluptatibus dolorem quo deserunt et. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel repellendus aspernatur reprehenderit iusto, voluptatibus tempora eum aperiam, hic laboriosam ab, enim eveniet! Aliquam libero illo nisi unde laboriosam placeat ducimus voluptate incidunt dignissimos ipsum error dolorum in necessitatibus praesentium eveniet, doloremque eos atque quasi cumque.</p>
        </div>
    );
};

export default Overview;


