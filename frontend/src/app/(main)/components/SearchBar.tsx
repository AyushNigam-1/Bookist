import React, { useState } from 'react';

const filterArrayBySearch = <T,>(data: T[], property: keyof T, search: string): T[] => {
    if (!search.trim()) return data;
    return data.filter(item =>
        String(item[property]).toLowerCase().includes(search.toLowerCase())
    );
};

const SearchBar = ({
    responsive,
    data,
    propertyToSearch,
    setFilteredData,
}: {
    responsive: boolean;
    data: any[];
    propertyToSearch: keyof any;
    setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
    const [search, setSearch] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        const filtered = filterArrayBySearch(data, propertyToSearch, val);
        setFilteredData(filtered);
    };

    return (
        <form className={`${responsive ? 'md:flex hidden' : 'flex'} items-center`}>
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    id="simple-search"
                    value={search}
                    onChange={handleChange}
                    className="bg-gray-200 text-gray-900 md:text-lg outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                    placeholder="Search"
                />
            </div>
        </form>
    );
};

export default SearchBar;
