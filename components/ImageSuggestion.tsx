
import React, { useState, useEffect } from 'react';
import type { AspectRatio, ImageStyle, ImageModel } from '../types';
import Button from './Button';
import Loader from './Loader';
import Icon from './Icon';
import TextArea from './TextArea';

interface ImageSuggestionProps {
  imagePrompt: string;
  generatedImage: string;
  isLoading: boolean;
  onGenerate: (prompt: string, style: ImageStyle, aspectRatio: AspectRatio, model: ImageModel) => void;
}

const imageStyles: ImageStyle[] = ["Realistic Photo", "Vector Art", "3D Render", "Watercolor", "Minimalist"];
const aspectRatios: { label: string; value: AspectRatio }[] = [
  { label: 'مربع', value: '1:1' },
  { label: 'بورتريه', value: '9:16' },
  { label: 'عرضي', value: '16:9' },
];
const imageModels: { label: string; value: ImageModel; description: string; }[] = [
  { label: 'جودة عالية', value: 'imagen-4.0-generate-001', description: 'أفضل جودة وواقعية، مثالي للصور النهائية.' },
  { label: 'سريع', value: 'gemini-2.5-flash-image', description: 'أسرع في الإنشاء، مناسب للأفكار الأولية.' },
];

const ImageSuggestion: React.FC<ImageSuggestionProps> = ({ imagePrompt, generatedImage, isLoading, onGenerate }) => {
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(imageStyles[0]);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(aspectRatios[0].value);
  const [selectedModel, setSelectedModel] = useState<ImageModel>(imageModels[0].value);
  const [editablePrompt, setEditablePrompt] = useState(imagePrompt);

  const isAspectRatioDisabled = selectedModel === 'gemini-2.5-flash-image';

  useEffect(() => {
    setEditablePrompt(imagePrompt);
  }, [imagePrompt]);

  useEffect(() => {
    if (isAspectRatioDisabled) {
      setSelectedRatio('1:1');
    }
  }, [isAspectRatioDisabled]);


  const handleGenerateClick = () => {
    onGenerate(editablePrompt, selectedStyle, selectedRatio, selectedModel);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mt-6">
      <h3 className="text-xl font-bold text-blue-400 mb-4">اقتراح صورة</h3>
      
      <TextArea
        label="اكتب اقتراحك للتصميم (بالإنجليزي):"
        value={editablePrompt}
        onChange={(e) => setEditablePrompt(e.target.value)}
        rows={4}
        className="h-auto mb-4 font-mono text-sm resize-none bg-gray-900"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">موديل الصورة</label>
          <div className="flex gap-2">
            {imageModels.map(model => (
              <button
                key={model.value}
                onClick={() => setSelectedModel(model.value)}
                className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm ${selectedModel === model.value ? 'bg-blue-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {model.label}
              </button>
            ))}
          </div>
           <p className="text-xs text-gray-500 mt-2 h-8">{imageModels.find(m => m.value === selectedModel)?.description}</p>
        </div>
        <div className={isAspectRatioDisabled ? 'opacity-50' : ''}>
          <label className="block mb-2 text-sm font-medium text-gray-400">مقاس الصورة</label>
          <div className="flex gap-2">
            {aspectRatios.map(ratio => (
              <button
                key={ratio.value}
                onClick={() => setSelectedRatio(ratio.value)}
                disabled={isAspectRatioDisabled}
                className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                    (selectedRatio === ratio.value && !isAspectRatioDisabled)
                        ? 'bg-blue-600 text-white font-bold' 
                        : (isAspectRatioDisabled && ratio.value === '1:1') 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-gray-700'
                } ${!isAspectRatioDisabled ? 'hover:bg-gray-600' : 'cursor-not-allowed'}`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
          {isAspectRatioDisabled && <p className="text-xs text-amber-400 mt-2 h-8">مقاس الصورة غير متاح للموديل السريع (يستخدم مربع فقط).</p>}
        </div>
      </div>

       <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">ستايل الصورة</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {imageStyles.map(style => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`text-sm py-2 px-3 rounded-lg transition-colors ${selectedStyle === style ? 'bg-blue-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      
      <Button 
        onClick={handleGenerateClick} 
        isLoading={isLoading} 
        className="w-full mt-6"
        disabled={!editablePrompt.trim()}
      >
        <Icon name="image" className="w-5 h-5" />
        اعملي الصورة
      </Button>

      <div className="mt-6 w-full aspect-square bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-700">
        {isLoading ? (
          <Loader text="الصورة بتتعمل..." />
        ) : generatedImage ? (
          <img src={generatedImage} alt="Generated content" className="w-full h-full object-contain" />
        ) : (
          <div className="text-center text-gray-500">
            <Icon name="image" className="w-16 h-16 mx-auto mb-2" />
            <p>الصورة هتظهر هنا</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSuggestion;