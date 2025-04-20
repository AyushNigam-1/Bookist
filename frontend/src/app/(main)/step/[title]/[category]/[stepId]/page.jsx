"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStepDetails } from "@/app/services/bookService";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

export default function StepPage() {
    const { stepId } = useParams();
    const [stepDetails, setStepDetails] = useState(null);
    const [error, setError] = useState(null);


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
