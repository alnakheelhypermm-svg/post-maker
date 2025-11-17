
import React from 'react';

type IconName = 'sparkles' | 'copy' | 'image' | 'brain' | 'lightbulb' | 'history';

interface IconProps {
  name: IconName;
  className?: string;
}

// Fix: Use React.ReactElement instead of JSX.Element to resolve namespace issue.
const ICONS: Record<IconName, React.ReactElement> = {
  sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18l-1.813-2.096a4.5 4.5 0 00-6.364-6.364L1 8l2.096-1.813a4.5 4.5 0 006.364 6.364zM14.187 8.096L15 6l1.813 2.096a4.5 4.5 0 006.364 6.364L23 16l-2.096 1.813a4.5 4.5 0 00-6.364-6.364z" />,
  copy: <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
  image: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  brain: <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L12 7.25l5.571 2.5M6.429 9.75L12 14.25l5.571-4.5m-11.142 0L6.429 7.5M12 7.25L17.571 5.25l4.179 2.25M12 14.25l5.571 2.5 4.179-2.25M17.571 16.75l4.179 2.25L2.25 12l4.179-2.25" />,
  lightbulb: <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
  history: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    {ICONS[name]}
  </svg>
);

export default Icon;