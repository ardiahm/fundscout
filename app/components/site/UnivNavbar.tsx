"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from "../ui/navigation-menu";
import { motion } from "framer-motion";
import { CircleUserRound } from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";
import { navigationMenuTriggerStyle } from "../ui/navigation-menu";
import {UserButton} from "@clerk/nextjs"

export default function UnivNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NEW: Track active tab via URL hash
  const [activeSection, setActiveSection] = useState("");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

 

  return (
    <>


      {/* Main Navbar — sits under the purple bar */}
      <nav className="fixed top-[0] left-0 w-full  backdrop-blur-md shadow-sm z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 lg:py-4">
          {/* Left side - Logo */}
          <NavigationMenu className="list-none">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`navigationMenuTriggerStyle() text-2xl inline`}
              >
                <Link
                  href="/"
                  className="inline font-semibold text-xl sm:text-2xl"
                >
                  <span className="text-3xl">
                    Fund <span className="text-blue-600">Scout</span>
                  </span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>

          {/* Desktop Links */}
          <NavigationMenu className="hidden lg:flex gap-6 list-none">
            {[
              { id: "dashboard", label: "Search" },
              { id: "favorites", label: "Favorites" },
              { id: "pricing", label: "Pricing" },
            ].map((item) => (
              <NavigationMenuItem key={item.id} className="relative">
                <NavigationMenuLink asChild className="text-xl inline">
                  <Link href={`/${item.id}`}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem key="account" className="relative">
              <NavigationMenuLink
                asChild
                className="text-xl inline-flex items-center"
              >
                  <UserButton />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>

          {/* Hamburger Menu Button (visible only on mobile) */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu Panel */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex flex-col space-y-3 sm:space-y-4">
              <Link
                href="#search"
                onClick={closeMobileMenu}
                className="text-xl text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
              >
                Search
              </Link>
              <Link
                href="#favorites"
                onClick={closeMobileMenu}
                className="text-xl text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
              >
                Favorites
              </Link>
              <Link
                href="#pricing"
                onClick={closeMobileMenu}
                className="text-xl text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
              >
                Pricing
              </Link>
              
                <Link href="/account" className="text-xl flex gap-2">
                  <CircleUserRound className="size-8 pt-1 text-black/80" /> <span className="pt-1">Account</span>
                </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
