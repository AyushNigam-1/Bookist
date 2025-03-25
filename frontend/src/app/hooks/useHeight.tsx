import { useState, useEffect } from "react";

const useHeight = (elementId: string) => {
    const [remainingHeight, setRemainingHeight] = useState<number>(0);

    useEffect(() => {
        const updateHeight = () => {
            const element = document.getElementById(elementId);
            if (element) {
                const elementTop = element.getBoundingClientRect().top;
                setRemainingHeight(window.innerHeight - elementTop - 8);
            }
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, [elementId]);

    return remainingHeight;
};

export default useHeight;
