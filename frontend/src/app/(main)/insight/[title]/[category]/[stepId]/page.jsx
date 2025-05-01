"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getStepDetails } from "@/app/services/bookService";
import { addCompletedInsight } from "@/app/services/userService";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

export default function StepPage() {
    const { title, stepId } = useParams();
    const searchParams = useSearchParams(); // not destructured
    const isCompleted = searchParams.get('isCompleted') === 'true';
    const userId = searchParams.get('user_id');
    const [stepDetails, setStepDetails] = useState(null);
    const [error, setError] = useState(null);

    const handleAddInsight = async () => {
        try {
            const res = await addCompletedInsight(userId, title, stepId);
            console.log(res.message); // "Insight added to completed list"
        } catch (err) {
            alert("Failed to mark insight as completed");
        }
    };

    useEffect(() => {
        if (!stepId) return;

        const fetchStepDetails = async () => {
            try {
                const data = await getStepDetails(stepId);
                console.log(data)
                setStepDetails(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchStepDetails();
    }, [stepId]);

    if (error) return <p>Error: {error}</p>;
    if (!stepDetails) return <p>Loading...</p>;

    return (
        <div className="prose prose-lg text-gray-700 mt-2">
            <h1 className="text-3xl font-bold text-gray-700 ">{stepDetails.title}</h1>
            <p className=" text-lg text-gray-600">{stepDetails.description}</p>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}

                components={{
                    h1: ({ children }) => <h1 className="text-6xl font-bold mt-6 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold text-gray-700 mt-5 mb-2">{children}</h3>,
                    ul: ({ children }) => <ul className="list-disc ml-6 text-lg">{children}</ul>,
                    li: ({ children }) => <li className="text-gray-600">{children}</li>,
                    p: ({ children }) => <p className="text-lg leading-relaxed">{children}</p>,
                }}
            >
                {JSON.parse(stepDetails?.detailed_breakdown)}
            </ReactMarkdown >
            <label class="inline-flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" class="peer hidden" onClick={() => handleAddInsight()} />
                <div class="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition duration-300 flex items-center justify-center">
                    <svg class="w-3 h-3 text-white hidden peer-checked:block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <span class="text-gray-700">Mark as completed</span>
            </label>
            {/* <div className="mt-4">
                <h2 className=" text-gray-600 ">Example</h2>
                <p className="mt-1  text-xl text-gray-800">{stepDetails.example}</p>
            </div>
            <div className="mt-4">
                <h2 className=" text-gray-600">Hypothetical Situation</h2>
                <p className="mt-1  text-xl text-gray-800">{stepDetails.hypothetical_situation}</p>
            </div>
            <div className="mt-4">
                <h2 className=" text-gray-600">Recommended Response</h2>
                <p className="mt-1  text-xl text-gray-800">{stepDetails.recommended_response}</p>
            </div> */}

        </div >
    );
}
