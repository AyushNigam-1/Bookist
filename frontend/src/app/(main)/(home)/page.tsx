"use client";
import React, { Fragment, useEffect, useState } from "react";
import Card from "../components/Cards";
import SearchBar from "../components/SearchBar";
import { findBooksByCategories, getAllBooks, getAllCategories } from "@/app/services/bookService";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import ShareModal from "../components/ShareModal";
import CategoryDialog from "../components/CategoryDialog";

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
    const [shareModal, setShareModal] = useState(false)
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

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const data = await findBooksByCategories(
                    selectedCategory.length ? selectedCategory.map(cat => cat.name) : []
                )
                setFilteredBooks(data)
            } catch (error) {
                console.error("Error fetching steps:", error)
            }
        }

        fetchInsights()
    }, [selectedCategory])

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
            <div className={`flex justify-between items-center h-14 md:h-18 sticky top-0 bg-gray-100 z-30 `} >
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
            <CategoryDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                categories={categories}
                filteredCategories={filteredCategories}
                setFilteredCategories={setFilteredCategories}
                selectedCategory={selectedCategory}
                toggleCategory={toggleCategory} />

        </div>

    );
};

export default Page;
