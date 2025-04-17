import Navbar from "../components/Navbar";
import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="antialiased p-3 flex flex-col h-screen">
            <Navbar />
            <div className="w-full container mx-auto">
                {children}
            </div>
        </div>
    );
}
