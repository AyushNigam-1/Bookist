'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Slider({ steps, title }) {
    const wrapperRef = useRef(null)
    const [remainingHeight, setRemainingHeight] = useState('100vh')

    useEffect(() => {
        const updateHeight = () => {
            const top = wrapperRef.current?.getBoundingClientRect().top || 0
            setRemainingHeight(`${window.innerHeight - top - 12}px`)
        }

        updateHeight()
        window.addEventListener('resize', updateHeight)
        return () => window.removeEventListener('resize', updateHeight)
    }, [])

    return (
        <div ref={wrapperRef} className='overflow-hidden absolute md:relative top-2 md:top-0
         w-full'>
            <div
                className="overflow-y-scroll snap-y snap-mandatory rounded-2xl "
                style={{ height: remainingHeight, scrollbarWidth: "none", }}
            >
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="snap-start flex justify-center items-center px-4 bg-white  relative"
                        style={{ height: remainingHeight }}
                    >
                        <p className="text-gray-600 text-sm absolute top-3">
                            {index + 1} / {steps?.length}
                        </p>
                        <div
                            className=" flex flex-col justify-center"
                        >
                            <div key={index} className={`rounded-2xl h-full col-span-1 flex-col flex gap-4 `}  >
                                <Link href={`/step/${title}/${step.category?.name}/${step.step}`} className='flex flex-col gap-2' >
                                    <div className='flex justify-between items-center'>

                                        <span className=' text-gray-600 font-medium  text-sm flex gap-1 items-center w-min text-nowrap flex-nowrap rounded-lg' ><span>
                                            {step.icon}   </span> <span>
                                                {step.category}  </span> </span>

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

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
