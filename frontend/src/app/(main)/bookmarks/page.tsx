"use client"
import { addFavouriteInsight, getFavouriteCategories, getFavouriteInsights } from '@/app/services/userService';
import React, { use, useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Link from 'next/link';

type Categories = {
    name: string,
    // icon: string,
    description: string,
}
interface StepData {
    step: string;
    category: string;
    icon: string;
    id: number;
    title: string;
    // example: string;
    description: string;
    // recommended_response: string;
    // hypothetical_situation: string;
}
const page = () => {
    const [filteredCategories, setFilteredCategories] = useState<Categories[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Categories[]>([])
    const [filteredInsights, setFilteredInsights] = useState<StepData[]>([])

    const [insights, setInsights] = React.useState<any[]>([]);
    const [categories, setCategories] = useState<Categories[]>([])
    const user = JSON.parse(localStorage.getItem("user") || "")
    const [isOpen, setIsOpen] = useState(false)
    // const [user, setUser] = useState<any>({})

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getFavouriteCategories(user.user_id)
            setCategories(categories)
            setFilteredCategories(categories)
            console.log(categories)
        }
        fetchCategories()
    }, [])
    const toggleCategory = (category: Categories) => {
        setSelectedCategory(prev =>
            prev.some(c => c.name === category.name)
                ? prev.filter(c => c.name !== category.name)
                : [...prev, category]
        )
        setIsOpen(false)
    }
    useEffect(() => {
        const fetchInsights = async () => {
            // if (!params.title) return
            try {
                const data = await getFavouriteInsights(
                    user.user_id,
                    selectedCategory.length ? selectedCategory.map(cat => cat.name) : []
                )
                setInsights(data)
                setFilteredInsights(data)
                console.log(data)
            } catch (error) {
                console.error("Error fetching steps:", error)
            }
        }

        fetchInsights()
    }, [selectedCategory])
    const handleAdd = async (id: number, category: string) => {
        console.log(id, category)
        try {
            let desc = categories.find((cate) => cate.name === category)?.description
            await addFavouriteInsight(user.user_id, { id, category, description: desc ? desc : "" })
            const updatedUser = { ...user }

            const index = updatedUser.favourite_insights[category].indexOf(id)

            updatedUser.favourite_insights[category].splice(index, 1)
            if (updatedUser.favourite_insights[category].length === 0) {
                delete updatedUser.favourite_insights[category]
            }
            setFilteredInsights(filteredInsights.filter((insight) => insight.id !== id))
            setInsights(insights.filter((insight) => insight.id !== id))
            localStorage.setItem("user", JSON.stringify(updatedUser))
            const updatedBookmarked = Object.values(updatedUser.favourite_insights).flat()

        } catch (err: any) {
            console.error("Bookmarking failed:", err.message)
        }
    }
    return (
        <div>
            <div className="sticky top-0 w-full bg-gray-100 z-10 h-14 md:h-20">
                <div className={`flex justify-between items-center h-full`} >
                    <div className='flex flex-col gap-1'>
                        <div className='justify-between flex lg:text-4xl font-bold text-gray-700 text-2xl text-center md:text-left  gap-2' >
                            <p>
                                Bookmarks
                            </p>
                        </div>
                    </div>
                    <div className=''>
                        <div className='md:flex gap-3' >
                            <SearchBar responsive={true} data={insights} propertyToSearch='title' setFilteredData={setFilteredInsights} />
                            <div className='flex flex-col gap-3 md:relative fixed right-0 m-4 md:m-0 bottom-0' >
                                <button onClick={() => setIsOpen(true)} className=" p-3 font-semibold  bg-gradient-to-r text-white bg-gray-700  shadow cursor-pointer rounded-full  flex gap-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                    </svg>
                                </button>
                                {/* <button onClick={() => setMode("Swipe")} className="md:hidden p-3 bg-gradient-to-r text-white bg-gray-700  shadow cursor-pointer rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
                                    </svg>
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4" >
                {filteredInsights.map((step, index) => (
                    <div className='relative rounded-2xl' key={step.id} >
                        <div className={`rounded-2xl h-full col-span-1 p-3 flex-col flex gap-4 break-inside-avoid bg-gray-200 `}  >
                            <Link href={`/insight/${step?.title}/${step?.category}/${step.id}`} className='flex flex-col gap-2' >
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
                                    {step.title}
                                </h4>
                                <h6 className='text-gray-800 mt-auto '>
                                    {step.description}
                                </h6>

                            </Link>
                            <div className="flex gap-2 justify-between mt-auto">

                                <button onClick={() => handleAdd(step.id, step.category)}
                                    type="button"
                                    className={`text-gray-600 bg-gray-100  focus:outline-none rounded-full p-2 w-min  font-semibold  outline-gray-800 outline-1`}
                                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5" />
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
                                                    {/* <span >{category.icon}</span> */}
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
        </div>
    )
}

export default page