
import React, { useState } from 'react';
import Icon from './Icon';
import Loader from './Loader';

interface PostCardProps {
  text: string;
  title: string;
  isRefining: boolean;
  onRefine: (instruction: string) => void;
}

const refinementActions = [
  { label: 'خليه أبسط', instruction: 'Make it simpler and easier to understand' },
  { label: 'خليه جذاب أكتر', instruction: 'Make it more engaging, exciting, and professional' },
  { label: 'خليه أقصر', instruction: 'Make it shorter and more concise' },
];

const PostCard: React.FC<PostCardProps> = ({ text, title, isRefining, onRefine }) => {
  const [copied, setCopied] = useState(false);
  const [customInstruction, setCustomInstruction] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomRefine = () => {
    if (!customInstruction.trim()) return;
    onRefine(customInstruction);
    setCustomInstruction('');
  };


  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 relative h-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-400">{title}</h3>
        <button
          onClick={handleCopy}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Copy post text"
        >
          {copied ? (
            <span className="text-sm text-green-400">اتنسخ!</span>
          ) : (
            <Icon name="copy" className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="relative flex-grow">
        {isRefining && (
          <div className="absolute inset-0 bg-gray-800/80 rounded-lg flex items-center justify-center z-10">
            <Loader size="md" text="جاري التعديل..."/>
          </div>
        )}
        <p className="text-gray-300 whitespace-pre-wrap h-full">{text}</p>
      </div>
      <div className="border-t border-gray-700 pt-4 mt-auto">
          <p className="text-sm text-gray-400 mb-2 font-semibold">تعديلات سريعة:</p>
          <div className="flex flex-wrap gap-2">
            {refinementActions.map(action => (
                <button 
                    key={action.instruction}
                    onClick={() => onRefine(action.instruction)}
                    disabled={isRefining}
                    className="flex items-center gap-2 text-xs bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 disabled:cursor-not-allowed text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                >
                    <Icon name="sparkles" className="w-3 h-3 text-blue-400" />
                    {action.label}
                </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <label htmlFor={`custom-refine-${title}`} className="block text-sm text-gray-400 mb-2 font-semibold">أو، اطلب تعديل معين:</label>
            <div className="flex gap-2">
                <input
                    id={`custom-refine-${title}`}
                    type="text"
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                    placeholder="مثال: ضيف ايموجي، خليه رسمي أكتر..."
                    className="flex-grow bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
                    disabled={isRefining}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCustomRefine() }}
                />
                <button
                    onClick={handleCustomRefine}
                    disabled={isRefining || !customInstruction.trim()}
                    className="text-sm shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                    عدّل
                </button>
            </div>
          </div>

      </div>
    </div>
  );
};

export default PostCard;