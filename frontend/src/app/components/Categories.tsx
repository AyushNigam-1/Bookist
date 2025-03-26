import React, { useEffect, useState } from 'react'
import { getAllCategories } from '../services/bookService';

const Categories = () => {
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategories, setSelectCategories] = useState<string[]>([])
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const categories = await getAllCategories();
                // setBooks(books);
                setCategories(categories)
                console.log(categories)
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);
    const handleSelection = (category: string) => {
        const updatedGenres = selectedCategories.includes(category)
            ? selectedCategories.filter(g => g !== category)
            : [...selectedCategories, category];

        // onGenreChange(updatedGenres);
    };
    return (
        <div>
            <div className='flex flex-col gap-4 overflow-visible' >
                {/* <button className='bg-white border border-gray-200 text-gray-800  px-2 rounded-full' >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5" onClick={scrollBackward} >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button> */}
                {/* <h3 className='text-xl font-bold text-gray-600'>Tags   </h3> */}
                <div
                    //   ref={genresRef}
                    className='flex gap-4 flex-wrap items-center justify-center'
                >
                    {
                        categories.map((e) => {
                            return (
                                <button onClick={() => handleSelection(e)} key={e} className={`  text-gray-600 border-2 border-gray-300/50 px-3  flex gap-2 items-center  p-2 font-bold text-nowrap rounded-xl  my-0.5 ${selectedCategories.includes(e) ?
                                    "border-indigo-200 border-2 bg-indigo-50" : ''
                                    }`} >
                                    {selectedCategories.includes(e) ?
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg> :

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                                        </svg>}
                                    {e} </button>
                            )
                        })
                    }
                </div>
                {/* <button
                    className="bg-white border border-gray-200 text-gray-800  px-2 rounded-full"
                    onClick={scrollForward}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 19.5L15.75 12 8.25 4.5" />
                    </svg>
                </button> */}
            </div >
        </div>
    )
}

export default Categories