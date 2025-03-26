"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStepDetails } from "@/app/services/bookService";

export default function StepPage() {
    const { title, category, step } = useParams();
    const [stepDetails, setStepDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!title || !category || !step) return;

        const fetchStepDetails = async () => {
            try {
                const data = await getStepDetails(title, category, step);
                setStepDetails(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchStepDetails();
    }, [title, category, step]);

    if (error) return <p>Error: {error}</p>;
    if (!stepDetails) return <p>Loading...</p>;

    return (
        <div className="p-2">
            <h1 className="text-3xl font-bold text-gray-700">{stepDetails.step}</h1>
            <p className="mt-2 text-lg text-gray-600">{stepDetails.description}</p>
            <div className="mt-4">
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
            </div>

        </div>
    );
}
