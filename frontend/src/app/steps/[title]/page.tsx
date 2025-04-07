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
import Loader from '@/app/components/Loader';

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

    const params = useParams<{ title?: string }>();
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


    function getRandomColorPair() {
        const randomIndex = Math.floor(Math.random() * colorPairs.length);
        return colorPairs[randomIndex];
    }
    return (
        <div className="flex flex-col relative">
            {mode !== "Swipe" && <div className="md:sticky top-0  bg-gray-100 z-10 py-2 md:py-4">
                <div className={`flex justify-between items-center`} >
                    <div className='flex flex-col gap-1'>
                        <span className="lg:text-4xl font-bold text-gray-700 text-2xl text-center md:text-left flex gap-2 " >
                            {/* <p>
                                {selectedCategory?.icon}
                            </p> */}
                            <div className='justify-between flex' >

                                <p>
                                    {selectedCategory?.name}
                                </p>

                            </div>
                        </span>
                        {/* <p className="text-sm  text-gray-500" >  {selectedCategory?.description} </p> */}
                    </div>

                    <div className='flex gap-3 '>
                        <SearchBar responsive={true} />
                        <button onClick={() => setMode("Swipe")} className="p-2 md:p-3  bg-gradient-to-r text-white from-gray-800 via-gray-500 to-gray-800  shadow cursor-pointer rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
                            </svg>
                        </button>
                        <div className='fixed right-0 m-4 md:m-0 bottom-0 flex gap-2 flex-col md:relative ' >
                            <button className=" p-3  bg-gradient-to-r text-white from-gray-800 via-gray-500 to-gray-800  shadow cursor-pointer rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setIsOpen(true)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                </svg>
                            </button>
                            <button className=" bg-gradient-to-r text-white from-gray-800 via-gray-500 to-gray-800 p-3  shadow rounded-full md:hidden"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            </button>
                        </div>
                    </div>

                </div> </div>}
            {/* <hr /> */}

            {
                mode == 'Swipe' ? steps && <Slider steps={steps} setMode={setMode} icon={selectedCategory?.icon} title={selectedCategory?.name} mode={mode} /> : <>
                    {steps ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" >
                            {steps.map((step, index) => (
                                <div className='relative rounded-2xl   ' >
                                    <div key={index} className={`rounded-2xl h-full col-span-1 p-3 flex-col flex gap-4 bg-gray-200 `}  >
                                        <Link href={`/step/${params.title}/${selectedCategory?.name}/${step.step}`} className='flex flex-col gap-2' >
                                            <div className='flex justify-between items-center'>

                                                <span className=' text-gray-600 font-medium  text-sm flex gap-1 items-center w-min text-nowrap flex-nowrap rounded-lg' ><span>
                                                    {selectedCategory?.icon}   </span> <span>
                                                        {selectedCategory?.name}  </span> </span>

                                            </div>
                                            <h4 className='text-gray-700 font-semibold text-xl md:text-2xl line-clamp-1'>
                                                {step.step}
                                            </h4>


                                            <h6 className='text-gray-800 mt-auto '>
                                                {step.description}
                                            </h6>

                                        </Link>
                                        <div className="flex gap-2 justify-between mt-auto">
                                            <span className='bg-gray-100 rounded-full p-2 items-center gap-2 flex text-gray-600'  >
                                                <h4 className=' md:text-lg' >0</h4>
                                                {/* <span className='bg-gray-400 h-full w-[1px]' ></span> */}
                                                <button
                                                    type="button"
                                                    className="text-gray-600  focus:outline-none   w-min  font-semibold "
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                                    </svg>

                                                </button>
                                            </span>
                                            <div className='flex gap-2 '>

                                                <button
                                                    type="button"
                                                    className="text-gray-600 bg-gray-100  focus:outline-none rounded-full p-2 px-2.5 w-min  font-semibold "
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                                    </svg>


                                                </button>
                                                {/* <button
                                                    type="button"
                                                    className="text-gray-600 bg-gray-100  focus:outline-none rounded-lg p-2 w-min  font-semibold "
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                                    </svg>

                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Loader />
                    )}
                    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                        <DialogBackdrop className="fixed inset-0 bg-black/30" />

                        <div className="fixed inset-0 w-screen  p-4 flex justify-center gap-4 items-center">
                            <DialogPanel className="max-w-lg shadow rounded-lg bg-gray-100 p-3 flex flex-col gap-3 ">
                                <div className='justify-between flex items-center' >
                                    <DialogTitle className="font-bold text-lg md:text-2xl text-gray-800"> Select Categories </DialogTitle>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        type="button"
                                        className="text-gray-600 bg-gray-200  focus:outline-none rounded-full  p-2 w-min  font-semibold "
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                </div>
                                <SearchBar responsive={false} />
                                <div className="overflow-y-scroll h-[50vh]  flex flex-col gap-2 scrollbar-thumb-rounded-full scrollbar-track-gray-100 scrollbar scrollbar-thumb-gray-200 ">
                                    {categories.map((category) => (
                                        <div key={category.name} onClick={() => { setSelectedCategory(category); setIsOpen(false) }}
                                            className={` flex flex-col gap-2  rounded-lg  select-none  hover:bg-gray-200 cursor-pointer text-gray-700 p-2 ${category.name == selectedCategory?.name ? 'bg-gray-200' : ''} `}
                                        >
                                            {/* {category.name == selectedCategory?.name ? <span className='bg-gray-100 rounded font-medium p-1 text-xs flex gap-1 items-center w-min flex-nowrap' > <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                            Selected </span> : ''} */}
                                            <div className='flex flex-col gap-1 ' >
                                                <div className='flex gap-2 items-center justify-between'>
                                                    <div className='flex gap-2'>
                                                        <span className='text-lg'>
                                                            {category.icon}
                                                        </span>
                                                        <h4 className='font-semibold text-gray-800 text-base md:text-xl flex items-center gap-2'>
                                                            {category.name}
                                                        </h4>
                                                    </div>
                                                    {category.name == selectedCategory?.name ? <span className='bg-gray-100  font-medium p-1 text-xs flex gap-1 items-center w-min flex-nowrap rounded' > <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                    </svg>
                                                        Selected </span> : ''}
                                                </div>
                                                <span>

                                                    <h6 className="text-xs md:text-sm  rounded-lg  text-gray-500">
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
                </>
            }
        </div >

    );
}
