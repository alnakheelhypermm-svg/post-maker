import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from './Icon';
import Loader from './Loader';
import { generatePostIdeas } from '../services/geminiService';

interface IdeaBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdeaSelect: (idea: string) => void;
}

const interests = [
  "تسويق", "تكنولوجيا", "أكل و طبخ", "رياضة و لياقة", "موضة و جمال", "سفر و سياحة", 
  "تنمية بشرية", "كوميديا", "فن و موسيقى", "صحة و طب", "عقارات", "سيارات", "تعليم", 
  "ألعاب فيديو", "أفلام و مسلسلات", "استثمار و أعمال", "تصوير", "تصميم جرافيك"
];

const IdeaBankModal: React.FC<IdeaBankModalProps> = ({ isOpen, onClose, onIdeaSelect }) => {
    const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
    const [customInterest, setCustomInterest] = useState('');
    const [ideas, setIdeas] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setSelectedInterest(null);
            setCustomInterest('');
            setIdeas([]);
            setError('');
            setIsLoading(false);
        }
    }, [isOpen]);
    
    if (!isOpen) return null;

    const handleGenerateIdeas = async () => {
        const finalInterest = customInterest.trim() || selectedInterest;
        if (!finalInterest) {
            setError('لازم تختار مجال اهتمام أو تكتب تخصصك الأول.');
            return;
        }
        setIsLoading(true);
        setError('');
        setIdeas([]);
        try {
            const generatedIdeas = await generatePostIdeas([finalInterest]);
            setIdeas(generatedIdeas);
        } catch (e) {
            setError('حصلت مشكلة. حاول تاني.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleIdeaClick = (idea: string) => {
        onIdeaSelect(idea);
        onClose();
    };
    
    const handleInterestClick = (interest: string) => {
        setSelectedInterest(interest);
        setCustomInterest('');
    };

    const handleCustomInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomInterest(e.target.value);
        setSelectedInterest(null);
    };

    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fadeIn"
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-auto shadow-2xl relative border border-gray-700 transform transition-transform duration-300 animate-scaleIn flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-500/10 p-2 rounded-lg">
                        <Icon name="lightbulb" className="w-6 h-6 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100">
                        بنك الأفكار
                    </h2>
                </div>
                <p className="text-gray-400 mb-4 text-base">
                    اختار مجال اهتمامك، أو اكتبه بنفسك، وهنقترح عليك أفكار لبوستات جديدة.
                </p>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-400">1. اختار مجال اهتمامك</label>
                    <div className="flex flex-wrap gap-2">
                        {interests.map(interest => (
                            <button 
                                key={interest}
                                onClick={() => handleInterestClick(interest)}
                                className={`text-sm py-1.5 px-4 rounded-full transition-colors ${selectedInterest === interest ? 'bg-purple-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="custom-interest" className="block mb-2 text-sm font-medium text-gray-400">أو اكتب تخصصك لو مش موجود:</label>
                        <input
                            id="custom-interest"
                            type="text"
                            value={customInterest}
                            onChange={handleCustomInterestChange}
                            placeholder="مثال: تربية الحيوانات الأليفة"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-gray-200 placeholder-gray-500"
                        />
                    </div>
                </div>

                <Button 
                    onClick={handleGenerateIdeas}
                    isLoading={isLoading}
                    disabled={!selectedInterest && !customInterest.trim()}
                    className="w-full my-4"
                >
                    <Icon name="sparkles" className="w-5 h-5" />
                    اديني أفكار
                </Button>

                {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
                
                <div className="flex-grow min-h-[200px] bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-gray-400 font-semibold mb-3">2. اختار فكرة عشان تبدأ بيها</h3>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader text="بنفكرلك في أفكار..." />
                        </div>
                    ) : ideas.length > 0 ? (
                        <ul className="space-y-2">
                            {ideas.map((idea, index) => (
                                <li key={index}>
                                    <button 
                                        onClick={() => handleIdeaClick(idea)}
                                        className="w-full text-right bg-gray-800 p-3 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300"
                                    >
                                        {idea}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-center">
                            <p>الأفكار المقترحة هتظهر هنا.</p>
                        </div>
                    )}
                </div>

            </div>
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default IdeaBankModal;