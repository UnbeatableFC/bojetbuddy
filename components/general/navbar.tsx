"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-full px-4 sm:px-6 md:px-8 flex items-center justify-between gap-2">
        <Link href={"/"} className="flex-shrink-0">
          <Image
            src={"/bud-logo.png"}
            alt="Logo"
            width={120}
            height={54}
            className=""
          />
        </Link>

        <div className="hidden lg:flex space-x-6 flex-1 justify-center">
          <Link
            className="text-primary font-medium transition-all duration-300 hover:text-accent-foreground cursor-pointer"
            href={"#features"}
          >
            Features
          </Link>
          <Link
            className="text-primary font-medium transition-all duration-300 hover:text-accent-foreground cursor-pointer"
            href={"#about"}
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <SignInButton>
            <Button variant={"ghost"} size={"sm"}>
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button
              variant={"default"}
              size={"sm"}
              className={"whitespace-nowrap"}
            >
              Get Started
            </Button>
          </SignUpButton>
        </div>
        {/* 
        {isLoading && (
          <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
            <BarLoader width={"95%"} color="#D8B4FE" />
          </div>
        )} */}
      </div>
    </header>
  );
};

export default Header;
