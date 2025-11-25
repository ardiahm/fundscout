"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { motion } from "framer-motion";
import React from "react";
import { useState, useEffect } from "react";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export default function UnivNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NEW: Track active tab via URL hash
  const [activeSection, setActiveSection] = useState("");

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const topBarMessages = [
    "Trusted by Innovative Companies",
    "Data-driven Investor Discovery",
    "Smart Startup → Smart Capital",
    "Find the Perfect Investor for your Product",
  ];

  return (
    <>
      {/* Top Bar Marquee — fixed, centered cutoff */}
      <div className="fixed top-0 left-0 w-full bg-blue-600 text-white text-xs sm:text-sm py-1.5 sm:py-1 z-50">
        {/* 80% width container to create the 10% cutoff on each side */}
        <div className="mx-auto w-[80%] overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* First pass */}
            <div className="flex">
              {topBarMessages.map((msg, i) => (
                <span key={i} className="mx-8 font-medium tracking-wide">
                  {msg}
                </span>
              ))}
            </div>

            {/* Duplicate for seamless loop */}
            <div className="flex">
              {topBarMessages.map((msg, i) => (
                <span
                  key={`dup-${i}`}
                  className="mx-8 font-medium tracking-wide"
                >
                  {msg}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Navbar — sits under the purple bar */}
      <nav className="fixed top-[28px] left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 lg:py-2">
          {/* Left side - Logo */}
          <NavigationMenu className="list-none">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`navigationMenuTriggerStyle() text-2xl inline`}
              >
                <Link
                  href=""
                  className="inline font-semibold text-xl sm:text-2xl"
                >
                  Fund <span className="text-blue-600">Scout</span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>

          {/* Desktop Links */}
          <NavigationMenu className="hidden lg:flex gap-6 list-none">
            {[
              { id: "search", label: "Search" },
              { id: "favorites", label: "Favorites" },
          
              { id: "pricing", label: "Pricing" },
            ].map((item) => (
              <NavigationMenuItem key={item.id} className="relative">
                <NavigationMenuLink asChild className="text-xl inline">
                  <Link href={`#${item.id}`}>{item.label}</Link>
                </NavigationMenuLink>

                {/* UNDERLINE INDICATOR */}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-6 h-[2px] bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </NavigationMenuItem>
            ))}
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
              <Link
                href="#quote"
                onClick={closeMobileMenu}
                className="text-xl font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-200 py-2"
              >
                FREE <span className="text-blue-600">QUOTE</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
