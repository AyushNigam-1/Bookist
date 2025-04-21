"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");
    console.log(token)
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <nav className=" border-b border-gray-300 pb-2 lg:pb-3 z-20 top-0 start-0 ">
      <div className=" flex flex-wrap items-center justify-between container mx-auto  ">
        {/* <Link href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse"> */}
        <span className="self-center text-2xl text-gray-700  font-semibold whitespace-nowrap ">
          {/* <img src="logo.png" className="w-28" /> */}
          {/* <h2 className="font-sans "></h2> */}
          Bewise
        </span>
        {/* </Link> */}
        {isLoggedIn ? <>
          <Menu>
            <MenuButton className="inline-flex items-center gap-2 bg-gray-700 p-2 text-sm/6 font-semibold text-white  rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5  md:size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>


            </MenuButton>

            <MenuItems
              transition
              anchor="bottom end"
              className="w-38 md:w-56 flex flex-col gap-1 origin-top-right rounded-lg  z-30 bg-gray-700 p-2 my-2 text-sm/6 text-white transition duration-100 ease-out "
            >
              {/* <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 font-semibold ">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                  Profile

                </button>
              </MenuItem> */}
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 font-semibold md:font-medium md:text-xl">
                  {/* <PencilIcon className="size-4 fill-white/30" /> */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                  Bookmarks

                </button>
              </MenuItem>
              {/* <hr className=" border-gray-200" /> */}
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10 font-semibold md:font-medium md:text-xl">
                  {/* <PencilIcon className="size-4 fill-white/30" /> */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 md:size-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>

                  Logout

                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </> : <>
          <div className="flex gap-2  ">

            <Link
              href="/login"
              type="button"
              className="text-white hidden bg-gray-700 focus:outline-none rounded-lg px-4 py-2 font-semibold md:flex gap-2 items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>

              Login
            </Link>
            <Link
              href="/create-account"
              type="button"
              className="text-white hidden  bg-gray-700 focus:outline-none rounded-lg px-4 py-2 font-semibold md:flex  gap-2 items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>

              Signup
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center text-sm bg-gradient-to-r text-white from-gray-800 via-gray-500 to-gray-800 p-2 rounded-full md:hidden"
              aria-controls="navbar-sticky"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
              </svg>

            </button>
          </div>

          <div className={`items-center justify-between ${isOpen ? "flex" : "hidden"} w-full `} id="navbar-sticky">
            <ul className="flex flex-col justify-center items-center w-full py-2 gap-2">


              <Link
                href="/login"
                type="button"
                className="text-white  bg-gray-700w-full focus:outline-none rounded-lg px-4 py-2 font-semibold flex gap-2 items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>

                Login
              </Link>

              <Link
                href="/create-account"
                className="text-white  bg-gray-700w-full focus:outline-none rounded-lg px-4 py-2 font-semibold flex gap-2 items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>

                Signup
              </Link>
            </ul>
          </div>
        </>}

      </div>
    </nav>
  );
};

export default Navbar;
