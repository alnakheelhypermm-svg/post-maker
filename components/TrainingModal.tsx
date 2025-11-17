import React, { useState, useEffect } from 'react';
import TextArea from './TextArea';
import Button from './Button';
import Icon from './Icon';

interface TrainingModalProps {
  isOpen: boolean;
  initialText: string;
  onClose: () => void;
  onSave: (trainingText: string) => void;
}

const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, initialText, onClose, onSave }) => {
    const [text, setText] = useState(initialText);

    useEffect(() => {
        if (isOpen) {
            setText(initialText);
        }
    }, [isOpen, initialText]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(text);
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
        >
            <div 
                className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-auto shadow-2xl relative border border-gray-700 transform transition-transform duration-300 animate-scaleIn"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                        <Icon name="brain" className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100">
                        تدريب النموذج
                    </h2>
                </div>

                <p className="text-gray-400 mb-4 text-base">
                    حط هنا أمثلة من بوستاتك أو أي نصوص مكتوبة بطريقتك. كل ما كانت الأمثلة أكتر وأوضح، كل ما النموذج هيقدر يقلد أسلوبك بشكل أفضل.
                </p>
                <TextArea
                    label="أمثلة على أسلوب كتابتك"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="مثال ١: صباح الفل يا جامدين...&#10;مثال ٢: النهاردة هنتكلم عن موضوع مهم جدا وهو..."
                    className="h-64 bg-gray-900"
                />
                <div className="mt-6 flex justify-end gap-4">
                    <Button variant="secondary" onClick={onClose}>إلغاء</Button>
                    <Button onClick={handleSave}>حفظ وتدريب</Button>
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

export default TrainingModal;