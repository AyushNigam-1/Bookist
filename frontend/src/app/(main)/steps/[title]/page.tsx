"use client"
import SearchBar from '@/app/(main)/components/SearchBar';
import { getBookContentKeys, getBookContentValue } from '@/app/services/bookService';
import { DialogBackdrop, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import clsx from 'clsx'
import Loader from '@/app/(main)/components/Loader';
import Slider from "@/app/(main)/components/Slider"
interface StepData {
    step: string;
    category: string;
    icon: string;
    step_id: number;
    // example: string;
    description: string;
    // recommended_response: string;
    // hypothetical_situation: string;
}
type Categories = {
    name: string,
    icon: String,
    description: String,
    steps_count: String
}
export default function Page() {

    const params = useParams<{ title?: string }>();
    const [steps, setSteps] = useState<StepData[] | []>([]);
    const [categories, setCategories] = useState<Categories[] | []>([]);
    const [selectedCategory, setSelectedCategory] = useState<Categories[]>()
    const [mode, setMode] = useState<String>("List")
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [filteredBooks, setFilteredBooks] = useState<StepData[] | []>([]);
    const [filteredCategories, setFilteredCategories] = useState<Categories[] | []>([]);

    const filteredCategory =
        query === ''
            ? categories
            : categories.filter((category) => {
                return category.name.toLowerCase().includes(query.toLowerCase())
            })


    useEffect(() => {
        const fetchCategories = async () => {
            if (!params?.title) return;
            try {
                const fetchedCategories = await getBookContentKeys(params.title);
                setCategories(fetchedCategories);
                setFilteredCategories(fetchedCategories)
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [params?.title]);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!params.title) return
            try {
                const fetchedCategories = await getBookContentValue(params.title, selectedCategory?.length ? selectedCategory.map(category => category.name) : []);
                setSteps(fetchedCategories);
                setFilteredBooks(fetchedCategories)
                console.log(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchInsights();
    }, [params?.title, selectedCategory]);

    const colorPairs = [
        "bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200",
        "bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-100",
        "bg-gradient-to-tr from-rose-100 via-pink-200 to-fuchsia-100",
        "bg-gradient-to-r from-teal-100 via-green-200 to-lime-100",
        "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300",
        "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500",
        "bg-gradient-to-br from-blue-500 via-green-400 to-yellow-300",
        "bg-gradient-to-r from-rose-500 via-red-400 to-orange-300",
        "bg-gradient-to-tl from-amber-400 via-orange-500 to-red-600",
        "bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600",
        "bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-700",
        "bg-gradient-to-r from-blue-900 via-blue-600 to-indigo-700",
        "bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900",
        "bg-gradient-to-tr from-teal-600 via-cyan-500 to-blue-500",
        "bg-gradient-to-bl from-indigo-600 via-violet-500 to-purple-400",
        "bg-gradient-to-br from-yellow-200 via-pink-300 to-rose-400",
        "bg-gradient-to-tr from-rose-200 via-violet-200 to-indigo-200",
        "bg-gradient-to-r from-amber-300 via-orange-200 to-yellow-300",
        "bg-gradient-to-r from-zinc-100 via-gray-100 to-neutral-100",
        "bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500",
        "bg-gradient-to-t from-black/60 via-black/30 to-transparent",
        "bg-gradient-to-t from-black/70 via-black/40 to-transparent",
        "bg-gradient-to-t from-white/70 via-white/40 to-transparent",
        "bg-gradient-to-t from-gray-900/60 via-gray-700/30 to-transparent"

    ];
    const toggleCategory = (categoryToToggle: Categories) => {
        setSelectedCategory((prevCat = []) => {
            const isSelected = prevCat.some(c => c.name === categoryToToggle.name);
            if (isSelected) {
                return prevCat.filter(c => c.name !== categoryToToggle.name);
            } else {
                return [...prevCat, categoryToToggle];
            }
        });
        setIsOpen(false);
    };
    const [maximize, setMaximize] = useState(false);

    function getRandomColorPair() {
        const randomIndex = Math.floor(Math.random() * colorPairs.length);
        return colorPairs[randomIndex];
    }
    return (
        <div className="flex flex-col relative">
            {mode !== "Swipe" && <div className="sticky top-0 w-full bg-gray-100 z-10 h-14 md:h-20">
                <div className={`flex justify-between items-center h-full`} >
                    <div className='flex flex-col gap-1'>
                        <div className='justify-between flex lg:text-4xl font-bold text-gray-700 text-2xl text-center md:text-left  gap-2' >
                            <p>
                                Insights
                            </p>
                        </div>

                    </div>

                    <div className=''>
                        <div className='md:flex gap-3' >
                            <SearchBar responsive={true} data={steps} propertyToSearch='step' setFilteredData={setFilteredBooks} />
                            {/* <button onClick={() => setIsOpen(true)} className=" p-3 font-semibold  bg-gradient-to-r text-white bg-gray-700  shadow cursor-pointer rounded-md flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                </svg>
                            </button> */}
                        </div>
                        <div className='fixed right-0 m-4 md:m-0 bottom-0 flex gap-2 flex-col  md:hidden z-50' >
                            <button className=" p-3  bg-gradient-to-r text-white bg-gray-700  shadow cursor-pointer rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setIsOpen(true)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                </svg>
                            </button>
                            <button onClick={() => setMode("Swipe")} className="p-3 bg-gradient-to-r text-white bg-gray-700  shadow cursor-pointer rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
                                </svg>
                            </button>
                            {/* <button className=" bg-gradient-to-r text-white bg-gray-700 p-3  shadow rounded-full md:hidden"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            </button> */}
                        </div>
                    </div>

                </div> </div>
            }

            {
                mode == 'Swipe' ? steps.length && <Slider title={params?.title} steps={steps} /> : <>
                    {steps ? (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4" >
                            {filteredBooks.map((step, index) => (
                                <div className='relative rounded-2xl   ' >
                                    <div key={index} className={`rounded-2xl h-full col-span-1 p-3 flex-col flex gap-4 break-inside-avoid bg-gray-200 `}  >
                                        <Link href={`/step/${params.title}/${step?.category}/${step.step_id}`} className='flex flex-col gap-2' >
                                            <div className='flex justify-between items-center'>
                                                <span className=' text-gray-600 font-medium  text-sm flex gap-1 items-center w-min text-nowrap flex-nowrap rounded-lg' >
                                                    <span>
                                                        {step?.icon}   </span>
                                                    <span>
                                                        {step?.category}
                                                    </span>
                                                </span>
                                            </div>
                                            <h4 className='text-gray-700 font-semibold text-xl md:text-2xl '>
                                                {step.step}
                                            </h4>
                                            <h6 className='text-gray-800 mt-auto '>
                                                {step.description}
                                            </h6>

                                        </Link>
                                        <div className="flex gap-2 justify-between mt-auto">

                                            <button
                                                type="button"
                                                className="text-gray-600 bg-gray-100  focus:outline-none rounded-full p-2 w-min  font-semibold "
                                            >
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Loader />
                    )}
                    <Dialog open={isOpen} onClose={() => { setIsOpen(false); setFilteredCategories(categories) }} className="relative z-50">
                        <DialogBackdrop className="fixed inset-0 bg-black/30" />

                        <div className="fixed inset-0 w-screen  p-4 flex justify-center gap-4 items-center">
                            <DialogPanel className="max-w-lg shadow rounded-lg bg-gray-100 p-3 flex flex-col gap-3 ">
                                <div className='justify-between flex items-center' >
                                    <DialogTitle className="font-bold text-lg md:text-2xl text-gray-800"> Select Categories </DialogTitle>
                                    <button
                                        onClick={() => { setIsOpen(false); setFilteredCategories(categories) }}
                                        type="button"
                                        className="text-gray-600 cursor-pointer bg-gray-200  focus:outline-none rounded-full  p-2 w-min  font-semibold "
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                </div>
                                <SearchBar responsive={false} data={categories} propertyToSearch='name' setFilteredData={setFilteredCategories} />
                                <div className="overflow-y-scroll h-[50vh] gap-3 flex flex-col rounded-lg   scrollbar-thumb-gray-300 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                                    {filteredCategories.map((category) => (
                                        <div className="relative overflow-visible inline-block">

                                            <button
                                                key={category.name}
                                                onClick={() => {
                                                    toggleCategory(category)
                                                    setIsOpen(false);
                                                }}
                                                className={`relative flex flex-col gap-2 rounded-lg select-none hover:bg-gray-200 cursor-pointer text-gray-700 p-2 bg-gray-200 w-full 
            ${selectedCategory?.map(c => c.name).includes(category.name) ? ' border-2 border-gray-400' : ''}`}
                                            >


                                                <div className='flex flex-col gap-1'>
                                                    <div className='flex gap-2  justify-between'>
                                                        <div className='flex gap-2 text-base md:text-xl'>
                                                            <span >{category.icon}</span>
                                                            <h4 className='font-semibold text-gray-800  flex items-center gap-2'>
                                                                {category.name}
                                                            </h4>
                                                        </div>
                                                        {selectedCategory?.map(c => c.name).includes(category.name) && (
                                                            <span className=' z-10 rounded-full font-medium  text-xs flex gap-1 items-center text-gray-600'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                </svg>

                                                            </span>
                                                        )}
                                                    </div>
                                                    <h6 className="text-sm md:text-base text-left rounded-lg text-gray-500">
                                                        {category.description}
                                                    </h6>
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </DialogPanel>
                        </div>
                    </Dialog>
                </>
            }
        </div >

    );
}