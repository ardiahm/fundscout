"use client";

import { motion } from "framer-motion";

export default function BottomNewsletter() {
  const topBarMessages = [
    "Google teams with Accel to hunt for India's AI breakouts",
    "Kaaj raises $3.8M seed from Kindred Ventures",
        "Curastory founder resigns, hires replacement",
    "Emm raises $9M seed to create menstrual cups",

  ];

  return (
    <>
      {/* Bottom Bar Marquee — fixed, always visible */}
      <div className="fixed bottom-0 left-0 w-full bg-blue-600 text-white text-xs sm:text-sm py-1.5 sm:py-1 z-50">
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
    </>
  );
}
