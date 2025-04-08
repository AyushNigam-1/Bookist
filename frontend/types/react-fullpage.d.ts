declare module '@ap.cx/react-fullpage' {
    import * as React from 'react';

    export interface FullpageSectionProps {
        children: React.ReactNode;
        className?: string;
    }

    export interface FullpageProps {
        children: React.ReactNode;
        animationTime?: number;
        scrollSensitivity?: number;
        touchSensitivity?: number;
        enableArrowKeys?: boolean;
    }

    export const Fullpage: React.FC<FullpageProps>;
    export const FullPageSections: React.FC<{ children: React.ReactNode }>;
    export const FullpageSection: React.FC<FullpageSectionProps>;
    export const FullpageNavigation: React.FC;
}
