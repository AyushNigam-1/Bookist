"use client"
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
            <div className="flex justify-between " >
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
                            className="bg-white text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search branch name..."
                            required
                        />
                    </div>
                </form>

            </div>
            <div className="flex flex-col gap-2" >
                {steps ? (
                    steps.map((step, index) => (
                        <Link href={`/step/${params.title}/${params.category}/${step.step}`} key={index} className="bg-white rounded-xl p-3 text-xl text-gray-600" >{step.step}</Link>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>

    );
}
