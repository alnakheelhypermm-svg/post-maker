
import React from 'react';
import type { HistoryEntry } from '../types';
import Button from './Button';
import Icon from './Icon';

interface HistoryModalProps {
  isOpen: boolean;
  history: HistoryEntry[];
  onClose: () => void;
  onClear: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, history, onClose, onClear }) => {
    if (!isOpen) return null;

    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Maybe show a small notification, but for now this is fine.
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fadeIn"
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl mx-auto shadow-2xl relative border border-gray-700 transform transition-transform duration-300 animate-scaleIn flex flex-col h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500/10 p-2 rounded-lg">
                            <Icon name="history" className="w-6 h-6 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-100">
                            بوستات سابقة
                        </h2>
                    </div>
                    {history.length > 0 && (
                        <Button variant="secondary" onClick={onClear}>
                            مسح الكل
                        </Button>
                    )}
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Icon name="history" className="w-20 h-20 opacity-30 mb-4" />
                            <h3 className="text-xl font-semibold">لا يوجد بوستات محفوظة</h3>
                            <p>البوستات والصور اللي هتعملها هتتسجل هنا.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {history.map(entry => (
                                <div key={entry.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 flex flex-col md:flex-row gap-4">
                                    <div className="w-full md:w-1/3 xl:w-1/4">
                                        <img src={entry.generatedImage} alt="Generated visual" className="rounded-md w-full aspect-square object-contain bg-black" />
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            {new Date(entry.timestamp).toLocaleString('ar-EG')}
                                        </p>
                                    </div>
                                    <div className="w-full md:w-2/3 xl:w-3/4 space-y-4">
                                        {entry.posts.map((post, index) => (
                                            <div key={index} className="bg-gray-800 p-3 rounded-md relative">
                                                <button 
                                                    onClick={() => handleCopyToClipboard(post)} 
                                                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                                                    aria-label="Copy post text"
                                                >
                                                    <Icon name="copy" className="w-4 h-4" />
                                                </button>
                                                <p className="text-gray-300 whitespace-pre-wrap text-sm">{post}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
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

export default HistoryModal;