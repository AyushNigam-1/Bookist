"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from 'react-markdown';

const Overview = () => {
    const [book, setBook] = useState<any>(null);

    useEffect(() => {
        const storedBook = sessionStorage.getItem("bookData");
        if (storedBook) {
            console.log(storedBook)
            setBook(JSON.parse(storedBook));
        }
    }, []);
    return (
        <div className="flex flex-col gap-4  w-full ">
            {/* <div className="absolute w-full h-48 bg-amber-600 bg-gradient-to-r rounded-2xl from-gray-400 to-gray-100" ></div> */}
            <div className="flex flex-col md:flex-row relative gap-4 w-full"  >
                <img src={book?.thumbnail} className="z-30 rounded-xl  mx-auto h-72 shadow-md  md:h-56 md:w-auto" alt={book?.title} />
                <img src={book?.thumbnail} className=" absolute blur-md md:hidden -p-2 rounded-xl mx-auto shadow-md h-72 w-full object-cover  md:h-56 md:w-auto" alt={book?.title} />
                <div className="flex flex-col gap-3 md:gap-4 w-full">
                    <div className="flex flex-col gap-1 md:items-start" >
                        <h1 className="text-gray-600 font-bold text-3xl md:text-4xl">{book?.title}</h1>
                        <p className=" text-gray-600 text-sm md:text-lg">  {book?.author}  </p>
                    </div>

                    <div className="flex gap-2  md:flex-nowrap flex-wrap  md:justify-normal" >
                        {book?.category.split(/[,&]/).map((category: any, index: Number) => <h4 className="border border-gray-300 p-1 px-3 rounded-xl w-min text-nowrap text-sm flex gap-1  text-gray-800"
                            key={String(index)} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                            </svg>{category}
                        </h4>)}
                    </div>
                    {/* <span className="flex items-center text-gray-800 gap-1 px-3 border border-gray-300 w-min text-nowrap p-1 rounded-full text-sm" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                        4.5 / 5
                    </span> */}
                    <div className="flex gap-2 justify-between w-full">
                        <div className="flex gap-2 justify-between md:justify-normal w-full">
                            <button
                                type="button"
                                className="text-white bg-gray-600 w-full  flex gap-2 items-center justify-center focus:outline-none rounded-lg p-2 md:w-min  font-semibold "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>
                                Like
                            </button>
                            <button
                                type="button"
                                className="text-white bg-gray-600 w-full justify-center  flex gap-2 items-center  focus:outline-none rounded-lg p-2 md:w-min  font-semibold "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                Favourite
                            </button>

                            <Link
                                href={`/categories/${book?.title} `}
                                type="button"
                                className="text-white bg-gray-600  focus:outline-none  py-3 md:py-2 px-4 rounded-lg md:w-min w-[96vw] font-semibold flex md:relative bottom-4 md:bottom-0  gap-2 items-center justify-center fixed ">

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                                </svg>

                                Visit
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
            {/* <p className="text-md text-center text-gray-600" >
                About Book
            </p> */}
            <div className="text-lg md:text-xl text-gray-600 font-medium">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}

                // components={{
                //     h1: ({ children }) => <h1 className="text-6xl font-bold mt-6 mb-4">{children}</h1>,
                //     h2: ({ children }) => <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>,
                //     h3: ({ children }) => <h3 className="text-xl font-bold text-gray-700 mt-5 mb-2">{children}</h3>,
                //     ul: ({ children }) => <ul className="list-disc ml-6 text-lg">{children}</ul>,
                //     li: ({ children }) => <li className="text-gray-600">{children}</li>,
                //     p: ({ children }) => <p className="text-lg leading-relaxed">{children}</p>,
                // }}
                >{book?.description}</ReactMarkdown>
            </div>
            {/* <p className="text-md text-gray-600" >
                About Author
            </p>
            <p className="text-xl text-gray-600 font-medium">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque sunt quidem nostrum inventore neque, molestiae eligendi officiis earum! Ipsa laudantium iste accusamus? Similique molestiae dolore aut alias! Dolorum molestiae voluptatibus dolorem quo deserunt et. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel repellendus aspernatur reprehenderit iusto, voluptatibus tempora eum aperiam, hic laboriosam ab, enim eveniet! Aliquam libero illo nisi unde laboriosam placeat ducimus voluptate incidunt dignissimos ipsum error dolorum in necessitatibus praesentium eveniet, doloremque eos atque quasi cumque.</p> */}
        </div>
    );
};

export default Overview;
