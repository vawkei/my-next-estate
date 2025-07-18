"use client";

import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function MainNavigation() {
  return (
    <header className="bg-orange-300">
      <div className="p-3 flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="flex gap-2">
          <span>My</span>
          <span className="text-red-400 font-bold">Next</span>
          <span>Estate</span>
        </h1>
        <form className="bg-slate-50 rounded-2xl flex items-center p-3">
          <input
            type="text"
            placeholder="Search..."
            className="focus:outline-none w-24 sm:w-46"
          />
          <button>
            <FaSearch size={16} />
          </button>
        </form>
        <ul className="hidden sm:flex gap-3">
          <Link href={"/"}>
            <li className="hover:text-green-400 cursor-pointer">Home</li>
          </Link>
          <Link href={"/about"}>
            <li className="hover:text-green-400 cursor-pointer">About</li>
          </Link>

          <Link href={"/create-listing"}>
            <li className="hover:text-green-400 cursor-pointer">
              Create-listing
            </li>
          </Link>

          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href={"/sign-in"}>
              <li className="hidden md:inline text-slate-700 hover:underline">
                Sign In
              </li>
            </Link>
          </SignedOut>

        </ul>
      </div>
    </header>
  );
}
