"use client"

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";


interface StepData {
    step: string;
    description: string;
}

export default function Slider({ steps, title, icon, setMode }: any) {
    const [index, setIndex] = useState(0);
    // console.log(steps, title, category, setMode)
    const swipe = (direction: any) => {
        if (direction === "up" && index < steps.length - 1) setIndex(index + 1);
        if (direction === "down" && index > 0) setIndex(index - 1);
    };

    const elementRef = useRef<HTMLDivElement>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const getDistanceFromBottom = (element: HTMLElement | null) => {
        return element ? window.innerHeight - element.getBoundingClientRect().top : null;
    };
    useEffect(() => {
        const updateDistance = () => setDistance(getDistanceFromBottom(elementRef.current));

        updateDistance();
        window.addEventListener("scroll", updateDistance);
        window.addEventListener("resize", updateDistance);

        return () => {
            window.removeEventListener("scroll", updateDistance);
            window.removeEventListener("resize", updateDistance);
        };
    }, []);
    return (
        // <></>
        <div className=" flex justify-center items-center  bg-gray-100 overflow-hidden">

            <div ref={elementRef} style={{ height: distance! - 40 }} className="relative w-96  flex justify-center items-center">

                <AnimatePresence>
                    <motion.div
                        key={index}

                        className="absolute h-full bg-white  shadow-lg rounded-2xl  flex  items-center"
                        initial={{ y: 300, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -300, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        onDragEnd={(e, info) => {
                            if (info.offset.y < -100) swipe("up");
                            if (info.offset.y > 100) swipe("down");
                        }}
                    >
                        <div className="flex justify-between absolute  top-0 w-full p-3" >
                            <h6 className="text-2xl font-black text-gray-600   z-40" >{title}</h6>
                            <button onClick={() => setMode('List')} className="text-2xl top-0  font-black text-gray-600   z-40" ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                            </svg>
                            </button>
                        </div>
                        <Link href="/steps" className="flex flex-col gap-3 p-3">
                            {/* <div className='relative rounded-2xl   ' > */}
                            <div key={index} className={`rounded-2xl h-full col-span-1 p-3 flex-col flex gap-4 `}  >
                                {/* <Link href={`/step/${params.title}/${selectedCategory?.name}/${step.step}`} className='flex flex-col gap-2' > */}
                                <div className='flex justify-between items-center'>

                                    <span className=' text-gray-600 font-medium  text-sm flex gap-1 items-center w-min text-nowrap flex-nowrap rounded-lg' ><span>
                                        {icon}   </span> <span>
                                            {title}  </span> </span>

                                </div>
                                <h4 className='text-gray-700 font-semibold text-xl md:text-2xl line-clamp-1'>
                                    {steps[index]?.step}
                                </h4>


                                <h6 className='text-gray-800 mt-auto '>
                                    {steps[index]?.description}
                                </h6>

                                {/* </Link> */}
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


                        </Link>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
