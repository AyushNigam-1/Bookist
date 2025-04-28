"use client";
import React, { useEffect, useState } from "react";
import Card from "../components/Cards";
import SearchBar from "../components/SearchBar";
import { getAllBooks, getAllCategories } from "@/app/services/bookService";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

type Categories = {
    name: string,
    icon: string,
    description: string,
}

const Page = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Categories[]>([])
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Categories[]>([])
    const [categories, setCategories] = useState<Categories[]>([])
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const books = await getAllBooks();
                const categories = await getAllCategories()
                setBooks(books);
                setFilteredBooks(books);
                setCategories(categories)
                setFilteredCategories(categories)
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);
    const [search, setSearch] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Searching for:", search);
    };

    const toggleCategory = (category: Categories) => {
        setSelectedCategory(prev =>
            prev.some(c => c.name === category.name)
                ? prev.filter(c => c.name !== category.name)
                : [...prev, category]
        )
        setIsOpen(false)
    }
    return (
        <div className="flex flex-col w-full " >
            <div className={`flex justify-between items-center h-14 md:h-18 sticky top-0 bg-gray-100 z-30`} >
                <h4 className="justify-between flex lg:text-4xl font-bold text-gray-700 text-2xl text-center md:text-left  gap-2" >Explore</h4>
                <div className="flex gap-2 items-center">

                    <SearchBar responsive={true} data={books} propertyToSearch='title' setFilteredData={setFilteredBooks} />
                    <button onClick={() => setIsOpen(true)} className=" p-3 font-semibold  bg-gradient-to-r text-white bg-gray-700  shadow cursor-pointer rounded-full  flex gap-2 items-center md:relative fixed right-0 m-4 md:m-0 bottom-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>
                    </button>
                </div>
            </div>
            < div className="columns-1 gap-3 lg:columns-4 space-y-4" >
                {filteredBooks.map((book) => (
                    <Card key={book.title} book={book} />
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
                                className="text-gray-600 cursor-pointer bg-gray-200  focus:outline-none rounded-full   p-2 w-min  font-semibold "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>
                        <SearchBar responsive={false} data={categories} propertyToSearch='name' setFilteredData={setFilteredCategories} />
                        <div className="overflow-y-scroll h-[50vh] gap-3 flex flex-col rounded-lg   scrollbar-thumb-gray-300 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                            {filteredCategories?.map((category) => (
                                <div className="relative overflow-visible inline-block" key={category.name}>

                                    <button

                                        onClick={() => {
                                            toggleCategory(category)
                                            setIsOpen(false);
                                        }}
                                        className={`relative flex flex-col gap-2 rounded-lg select-none hover:bg-gray-200 cursor-pointer text-gray-400 p-2 bg-gray-200 w-full 
                        ${selectedCategory?.map(c => c).includes(category) ? ' border-2 border-gray-400' : ''}`}
                                    >


                                        <div className='flex flex-col gap-1'>
                                            <div className='flex gap-2  justify-between'>
                                                <div className='flex gap-2 text-base md:text-xl'>
                                                    <span >{category.icon}</span>
                                                    <h4 className='font-semibold text-gray-600  flex gap-2'>
                                                        {category.name}
                                                    </h4>
                                                </div>
                                                {selectedCategory?.map(c => c).includes(category) && (
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

    );
};

export default Page;
