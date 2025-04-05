"use client"
import SearchBar from '@/app/components/SearchBar';
import Slider from '@/app/components/Swipe';
import { getBookContentKeys, getBookContentValue } from '@/app/services/bookService';
import { DialogBackdrop, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import clsx from 'clsx'

interface StepData {
    step: string;
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

    const params = useParams<{ title?: string, category?: string }>();
    const [steps, setSteps] = useState<StepData[] | null>(null);
    const [categories, setCategories] = useState<Categories[] | []>([]);
    const [selectedCategory, setSelectedCategory] = useState<Categories>()
    const [mode, setMode] = useState<String>("List")
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)

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
                setSelectedCategory(fetchedCategories[0])
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [params?.title]);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!selectedCategory?.name || !params.title) return;

            try {
                const fetchedCategories = await getBookContentValue(params.title, selectedCategory.name);
                setSteps(fetchedCategories);
                console.log(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchInsights();
    }, [params?.title, selectedCategory]);
    // const [search, setSearch] = useState("");

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     console.log("Searching for:", search);
    // };

    return (
        <div className="flex flex-col ">
            {mode !== "Swipe" && <div className="sticky top-0  bg-gray-100 z-10 py-2 md:py-4">
                <div className={`flex justify-between items-center`} >
                    <div className='flex flex-col gap-1'>
                        <h4 className="lg:text-4xl font-black text-gray-700 text-2xl" > {selectedCategory?.name} </h4>
                        {/* <p className="text-sm md:text-base text-gray-500" > {selectedCategory?.description} </p> */}
                    </div>

                    <div className='flex gap-3'>
                        <SearchBar />
                        <button className=" bg-gray-200 p-2 px-3 cursor-pointer rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setIsOpen(true)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                            </svg>
                        </button>

                    </div>
                    <div className='gap-2 flex text-gray-600 md:hidden' >

                        <button className=" bg-gray-200 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        </button>
                    </div>
                </div> </div>}

            {mode == 'Swipe' ? steps && <Slider steps={steps} setMode={setMode} title={params.title} category={params.category} mode={mode} /> : <>
                {steps ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" >
                        {steps.map((step, index) => (
                            <div key={index} className="bg-gray-200 rounded-xl  col-span-1 p-3 flex-col flex gap-4" >
                                <Link href={`/step/${params.title}/${selectedCategory?.name}/${step.step}`} className='flex flex-col gap-2' >
                                    <h4 className='text-gray-700 font-semibold text-xl md:text-2xl line-clamp-1'>
                                        {step.step}
                                    </h4>

                                    <h6 className='text-xs md:text-sm text-gray-800 flex gap-1 items-center  w-min flex-nowrap'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 md:size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        Pending
                                    </h6>

                                    <h6 className='text-gray-600 mt-auto line-clamp-2'>
                                        {step.description}
                                    </h6>
                                </Link>
                                <div className="flex gap-2 justify-between">
                                    <span className='bg-gray-100 rounded-lg py-1 items-center flex text-gray-600'  >
                                        <h4 className='  px-3 md:text-lg' >0</h4>
                                        <span className='bg-gray-400 h-full w-[1px]' ></span>
                                        <button
                                            type="button"
                                            className="text-gray-600 px-3 focus:outline-none   w-min  font-semibold "
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>


                                        </button>
                                    </span>
                                    <div className='flex gap-2 '>

                                        <button
                                            type="button"
                                            className="text-gray-600 bg-gray-100  focus:outline-none rounded-lg p-2 w-min  font-semibold "
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                            </svg>

                                        </button>
                                        <button
                                            type="button"
                                            className="text-gray-600 bg-gray-100  focus:outline-none rounded-lg p-2 w-min  font-semibold "
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
                    <p>Loading...</p>
                )}
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />

                    <div className="fixed inset-0 w-screen  p-4 flex justify-center items-center">
                        <DialogPanel className="max-w-lg  space-y-4  shadow rounded-lg bg-gray-100 p-3">
                            <div className='justify-between flex items-center' >
                                <DialogTitle className="font-bold text-2xl text-gray-800"> Select Categories </DialogTitle>
                                <button
                                    type="button"
                                    className="text-gray-600 bg-gray-200  focus:outline-none rounded-full  p-2 w-min  font-semibold "
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>

                            </div>
                            <SearchBar />
                            <div className="overflow-y-scroll h-[40vh]  flex flex-col gap-3 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 ">
                                {categories.map((category) => (
                                    <div
                                        className=" flex flex-end gap-2 rounded-lg  select-none  hover:bg-gray-100 cursor-pointer text-gray-700"
                                    >

                                        <div className='flex gap-2 items-center' >
                                            <span className='text-3xl bg-gray-200 p-3 rounded-full'>
                                                {category.icon}
                                            </span>
                                            <span>
                                                <h4 className='font-semibold text-gray-800'>
                                                    {category.name}
                                                </h4>
                                                <h6 className="text-sm  rounded-lg  text-gray-500">
                                                    {category.description}
                                                </h6>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <Description>This will permanently deactivate your account</Description> */}
                            {/* <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                                <ListboxButton
                                    className={clsx(
                                        'relative  text-gray-700 cursor-pointer rounded-lg bg-gray-200 p-2 text-lg md:flex items-center justify-between hidden gap-2 '
                                    )}
                                >
                                    <div className='flex gap-3 items-center flex-nowrap text-nowrap line-clamp-1 w-48' >
                                        {selectedCategory?.icon}
                                        <span>
                                            <h4>
                                                {selectedCategory?.name}
                                            </h4>
                                           
                                        </span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>

                                </ListboxButton>
                                <ListboxOptions
                                    anchor="bottom"
                                    transition
                                    className={clsx(
                                        'bg-gray-200 p-2 rounded-md mt-2 z-30 '
                                    )}
                                >
                                    {categories.map((category) => (
                                        <ListboxOption
                                            value={category}
                                            className=" flex flex-end gap-2 rounded-lg py-1.5 px-3 select-none  hover:bg-gray-100 cursor-pointer text-gray-700"
                                        >
                                      
                                            <div className='flex gap-2 items-center' >
                                                <span className='text-xl bg-gray-100 p-2 rounded-full'>
                                                    {category.icon}
                                                </span>
                                                <span>
                                                    <h4>
                                                        {category.name}
                                                    </h4>
                                                    <h6 className="text-sm  rounded-lg  text-gray-500">
                                                        {category.steps_count} Insight Available
                                                    </h6>
                                                </span>
                                            </div>
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox> */}
                        </DialogPanel>
                    </div>
                </Dialog>
            </>}
        </div>

    );
}
