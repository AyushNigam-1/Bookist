"use client";

import Loader from "@/app/components/Loader";
import SearchBar from "@/app/components/SearchBar";
import { getBookContentKeys } from "@/app/services/bookService";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Categories = {
    name: String,
    icon: String,
    description: String,
}

const Page = () => {
    const params = useParams<{ title?: string }>();
    const [categories, setCategories] = useState<Categories[] | null>(null);
    useEffect(() => {
        const fetchCategories = async () => {
            if (!params?.title) return;
            try {
                const fetchedCategories = await getBookContentKeys(params.title);
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [params?.title]);

    if (!categories) return <Loader />

    return (
        <div className="flex flex-col ">
            <div className="sticky top-0  z-10 ">
                <div className="flex justify-between py-4 items-center bg-gray-100" >
                    <h4 className="lg:text-4xl font-black text-gray-700 text-2xl" >Categories</h4>
                    <SearchBar />
                    <button className="md:hidden"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    </button>
                </div>
            </div>
            {/* <hr className="border-gray-300" /> */}

            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 " >

                {
                    categories?.map((category, index) => (
                        <Link href={`/steps/${params.title}/${category.name}`} key={index} className="bg-gray-200 rounded-xl p-3 col-span-1 flex flex-col justify-center items-center gap-2" >
                            <span className="text-4xl bg-gray-100 p-4 py-5 rounded-full">
                                {category.icon}
                            </span>
                            <h6 className="text-center text-xl font-semibold text-gray-700">
                                {category.name}
                            </h6>
                            <h5 className="text-md text-center text-gray-500">
                                {category.description}
                            </h5>
                        </Link>
                    ))
                }

            </ul>
        </div>
    );
};

export default Page;
