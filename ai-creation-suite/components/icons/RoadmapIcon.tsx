import React from 'react';

export const RoadmapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 2a5 5 0 0 0-5 5c0 4.42 5 13 5 13s5-8.58 5-13a5 5 0 0 0-5-5z"/>
    <path d="M12 22v-6"/>
    <path d="M5 22h14"/>
  </svg>
);
