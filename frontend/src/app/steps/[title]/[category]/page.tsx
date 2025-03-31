"use client"
import Slider from '@/app/components/Swipe';
import { getBookContentValue } from '@/app/services/bookService';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StepData {
    step: string;
    // example: string;
    description: string;
    // recommended_response: string;
    // hypothetical_situation: string;
}

export default function Page() {
    const params = useParams<{ title?: string, category?: string }>();
    const [steps, setSteps] = useState<StepData[] | null>(null);
    const [mode, setMode] = useState<String>("Swipe")
    useEffect(() => {
        const fetchCategories = async () => {
            if (!params?.title || !params?.category) return;

            try {
                const fetchedCategories = await getBookContentValue(params.title, params.category);
                setSteps(fetchedCategories);
                console.log(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [params?.title, params?.category]);
    const [search, setSearch] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Searching for:", search);
    };
    return (
        <div className="flex flex-col gap-4">
            {mode !== "Swipe" && <div className={`flex justify-between `} >
                <h4 className="text-4xl font-black text-gray-600" >Insights</h4>
                <form onSubmit={handleSubmit} className="flex items-center ">
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
                            className="bg-white text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                            placeholder="Search branch name..."
                            required
                        />
                    </div>
                </form>
                {/* <Link href="/swipelayout" >
                    Swipe Layout
                </Link> */}
            </div>}

            <hr className={`border-gray-300 ${mode == 'Swipe' ? "hidden" : ""}`} />

            {/* <div className="grid-cols-3 grid gap-4" > */}
            {mode == 'Swipe' ? steps && <Slider steps={steps} title={params.title} category={params.category} mode={mode} /> : <>
                {steps ? (
                    steps.map((step, index) => (
                        <Link href={`/step/${params.title}/${params.category}/${step.step}`} key={index} className="bg-white rounded-xl  col-span-1 p-3 flex-col flex gap-4" >
                            <div className='flex flex-col gap-2' >
                                <h4 className='text-gray-700 font-semibold text-xl line-clamp-1'>
                                    {index + 1}. {step.step}
                                </h4>
                                <h6 className='text-gray-600 mt-auto line-clamp-2'>
                                    {step.description}
                                </h6>
                            </div>
                            <div className="flex gap-2 justify-between">
                                <div className='flex gap-2 '>
                                    <button
                                        type="button"
                                        className="text-gray-800 bg-gray-100   focus:outline-none rounded-full p-2 w-min  font-semibold "
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>

                                    </button>
                                    <button
                                        type="button"
                                        className="text-gray-800 bg-gray-100   focus:outline-none rounded-full p-2 w-min  font-semibold "
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                        </svg>

                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="text-gray-800 bg-gray-100   focus:outline-none rounded-full p-2 w-min  font-semibold "
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                    </svg>

                                </button>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </>}


            {/* </div> */}
        </div>

    );
}
