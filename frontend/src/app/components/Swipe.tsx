"use client"

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// const steps = [
//     { title: "Step 1", description: "This is step 1." },
//     { title: "Step 2", description: "This is step 2." },
//     { title: "Step 3", description: "This is step 3." },
// ];

interface StepData {
    step: string;
    // example: string;
    description: string;
    // recommended_response: string;
    // hypothetical_situation: string;
}

export default function Slider({ steps }: any) {
    const [index, setIndex] = useState(0);
    // const [steps, setSteps] = useState<StepData[]>([])
    // console.log(steps)
    const swipe = (direction: any) => {
        if (direction === "up" && index < steps.length - 1) setIndex(index + 1);
        if (direction === "down" && index > 0) setIndex(index - 1);
    };
    useEffect(() => {
        const steps = sessionStorage.getItem("steps")
        console.log(steps)
        // setSteps(steps)
    }, [])
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
        <div className=" flex justify-center items-center  bg-gray-100 overflow-hidden">
            <div ref={elementRef} style={{ height: distance! - 10 }} className="relative w-96  flex justify-center items-center">
                <AnimatePresence>
                    <motion.div
                        key={index}
                        className="absolute h-full bg-white  shadow-lg rounded-2xl p-6 flex flex-col gap-3 justify-center"
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
                        <h2 className="text-2xl font-bold">{steps[index].step}</h2>
                        <p className="text-gray-600 ">{steps[index].description}</p>
                        <div className="flex gap-2 justify-between">
                            <div className='flex gap-2 '>
                                <button
                                    type="button"
                                    className="text-gray-800 bg-gray-100   focus:outline-none rounded-full p-2 w-min  font-semibold "
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>

                                </button>
                                <button
                                    type="button"
                                    className="text-gray-800 bg-gray-100   focus:outline-none rounded-full p-2 w-min  font-semibold "
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                    </svg>

                                </button>
                            </div>
                            <button
                                type="button"
                                className="text-gray-800 bg-gray-100   focus:outline-none rounded-full p-2 w-min  font-semibold "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                </svg>

                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
