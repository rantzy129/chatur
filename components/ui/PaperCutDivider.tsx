"use client";

import React from "react";

interface PaperCutDividerProps {
  position?: "top" | "bottom";
  fillColor?: string;
  className?: string;
}

export function PaperCutDivider({
  position = "top",
  fillColor = "#E2EAE2",
  className = "",
}: PaperCutDividerProps) {
  const isTop = position === "top";

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden leading-none select-none pointer-events-none ${
        isTop ? "-mb-[1px]" : "-mt-[1px]"
      } ${className}`}
    >
      <svg
        className={`w-full block h-10 sm:h-14 md:h-18 lg:h-22 ${
          !isTop ? "transform rotate-180" : ""
        }`}
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle soft paper ambient shadow */}
          <filter id="paper-drop-shadow" x="-5%" y="-15%" width="110%" height="150%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="4"
              floodColor="#000000"
              floodOpacity="0.07"
            />
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1.5"
              floodColor="#000000"
              floodOpacity="0.05"
            />
          </filter>
        </defs>

        {/* Ambient Under-shadow Layer (Simulates physically ripped cardstock depth) */}
        <path
          d="M 0,22 
             L 28,26 L 56,22 L 85,27 L 118,24 L 148,29 L 182,25 L 214,31 L 246,27 L 278,33 L 312,28 
             L 344,35 L 376,30 L 408,37 L 442,32 L 476,38 L 512,33 L 546,40 L 582,34 L 618,39 L 652,33 
             L 688,38 L 724,31 L 760,37 L 794,29 L 830,35 L 866,28 L 902,34 L 938,26 L 974,32 L 1010,25 
             L 1046,31 L 1082,26 L 1118,32 L 1154,27 L 1190,34 L 1226,29 L 1262,35 L 1298,28 L 1334,33 
             L 1370,26 L 1406,31 L 1440,26 
             L 1440,72 L 0,72 Z"
          fill="rgba(0, 0, 0, 0.05)"
          transform="translate(0, 3)"
        />

        {/* Subtle Ripped Fiber Highlight Rim (The white torn core of thick watercolor paper) */}
        <path
          d="M 0,18 
             L 22,23 L 48,19 L 76,25 L 108,21 L 138,27 L 170,22 L 202,28 L 234,24 L 268,30 L 302,25 
             L 334,32 L 368,27 L 402,34 L 436,29 L 470,35 L 506,30 L 540,37 L 574,31 L 610,36 L 644,30 
             L 680,35 L 716,28 L 752,34 L 786,26 L 822,32 L 858,25 L 894,31 L 930,23 L 966,29 L 1002,22 
             L 1038,28 L 1074,23 L 1110,29 L 1146,24 L 1182,31 L 1218,26 L 1254,32 L 1290,25 L 1326,30 
             L 1362,23 L 1398,28 L 1440,23 
             L 1440,72 L 0,72 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />

        {/* Primary Foreground Ripped Paper Silhouette (Fills with section's textured green background) */}
        <path
          d="M 0,20 
             L 14,24 L 28,21 L 44,26 L 62,22 L 78,27 L 96,23 L 114,28 L 132,24 L 152,29 L 170,25 
             L 188,31 L 206,26 L 226,32 L 244,27 L 264,33 L 284,28 L 304,35 L 324,29 L 344,36 L 366,31 
             L 388,38 L 410,32 L 432,39 L 454,34 L 478,41 L 500,35 L 522,42 L 546,36 L 570,41 L 594,35 
             L 618,40 L 642,34 L 666,39 L 690,32 L 714,37 L 738,30 L 762,36 L 786,28 L 810,34 L 834,27 
             L 858,33 L 882,25 L 906,31 L 930,23 L 954,29 L 978,22 L 1002,28 L 1026,23 L 1050,29 L 1074,24 
             L 1098,30 L 1122,25 L 1146,32 L 1170,27 L 1194,33 L 1218,28 L 1242,34 L 1266,27 L 1290,32 
             L 1314,26 L 1338,31 L 1362,25 L 1386,30 L 1412,24 L 1440,28 
             L 1440,72 L 0,72 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

