"use client"
import { getBookContentValue } from '@/app/services/bookService';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StepData {
    step: string;
    // example: string;
    description: string;
    // recommended_response: string;
    // hypothetical_situation: string;
}

export default function Page() {
    const params = useParams<{ title?: string, category?: string }>();
    const [steps, setSteps] = useState<StepData[] | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            if (!params?.title || !params?.category) return;

            try {
                const fetchedCategories = await getBookContentValue(params.title, params.category);
                setSteps(fetchedCategories);
                console.log(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [params?.title, params?.category]);

    return (
        <div className="flex flex-col gap-2" >
            {steps ? (
                steps.map((step, index) => (
                    <Link href={`/step/${params.title}/${params.category}/${step.step}`} key={index} className="bg-white rounded-xl p-3 text-xl text-gray-600" >{step.step}</Link>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
