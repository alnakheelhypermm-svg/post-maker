import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, className, ...props }) => {
  const baseClasses = "w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-y text-gray-200 placeholder-gray-500";
  
  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-400">{label}</label>
      <textarea
        className={`${baseClasses} ${className || ''}`}
        {...props}
      ></textarea>
    </div>
  );
};

export default TextArea;