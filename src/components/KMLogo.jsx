
import React from "react";

export default function KMLogo({ className = "w-12 h-12" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      className={`${className} text-black dark:text-white transition-colors duration-300`}
    >
      <g fill="currentColor">
        <text 
          x="42" 
          y="122" 
          fontStyle="normal" 
          fontFamily="Arial, sans-serif" 
          fontWeight="900" 
          fontSize="62" 
          letterSpacing="-2"
        >
          KM
        </text>
        <path d="M 68,145 C 115,145 138,105 116,68 C 103,46 76,55 76,55 C 76,55 106,38 126,65 C 152,100 120,158 68,145 Z" />
      </g>
    </svg>
  );
}