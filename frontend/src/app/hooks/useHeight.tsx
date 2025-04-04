import { useEffect, useState } from "react";

const useElementHeight = (elementId: string): number | null => {
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        const updateHeight = () => {
            const element = document.getElementById(elementId);
            if (element) {
                setHeight(window.innerHeight - element.getBoundingClientRect().top - 8);
            }
        };

        updateHeight(); // Run once on mount

        window.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }, [elementId]);

    return height;
};

export default useElementHeight;
