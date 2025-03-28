"use client";

import { getBookContentKeys } from "@/app/services/bookService";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
    const params = useParams<{ title?: string }>();
    const [categories, setCategories] = useState<string[] | null>(null);
    useEffect(() => {
        const fetchCategories = async () => {
            if (!params?.title) return;
            try {
                const fetchedCategories = await getBookContentKeys(params.title);
                setCategories(fetchedCategories);
                console.log(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [params?.title]);
    const [search, setSearch] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Searching for:", search);
    };
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between " >
                <h4 className="text-4xl font-black text-gray-600" >Categories</h4>

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
            <ul className="grid grid-cols-3 gap-4" >

                {categories ? (
                    categories.map((category, index) => (
                        <Link href={`/steps/${params.title}/${category}`} key={index} className="bg-white rounded-xl p-3 col-span-1 flex flex-col justify-center items-center gap-2" >
                            <span className="text-4xl bg-gray-100 p-4 py-5 rounded-full">
                                {category.split(" ")[0]}
                            </span>
                            <h6 className="text-center text-xl font-semibold text-gray-700">
                                {category.substring(category.indexOf(" ") + 1)}
                            </h6>
                            <h5 className="text-md text-center text-gray-500">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod quaerat ullam porro nulla harum eligendi quia numquam cupiditate fugit consequatur?
                            </h5>
                        </Link>
                    ))
                ) : (
                    <p>Loading categories...</p>
                )}

            </ul>
        </div>
    );
};

export default Page;
