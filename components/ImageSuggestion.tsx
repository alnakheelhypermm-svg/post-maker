
import React, { useState, useEffect, useRef } from 'react';
import type { AspectRatio, ImageStyle, ImageModel } from '../types';
import Button from './Button';
import Loader from './Loader';
import Icon from './Icon';
import TextArea from './TextArea';

type LogoPosition = 'on_product' | 'corner';

export interface Logo {
  dataUrl: string;
  mimeType: string;
}

interface ImageSuggestionProps {
  imagePrompt: string;
  generatedImage: string;
  isLoading: boolean;
  onGenerate: (prompt: string, style: ImageStyle, aspectRatio: AspectRatio, model: ImageModel, logo: Logo & { position: LogoPosition } | null) => void;
}

const imageStyles: ImageStyle[] = ["Realistic Photo", "Vector Art", "3D Render", "Watercolor", "Minimalist"];
const aspectRatios: { label: string; value: AspectRatio }[] = [
  { label: 'مربع', value: '1:1' },
  { label: 'بورتريه', value: '9:16' },
  { label: 'عرضي', value: '16:9' },
];
const imageModels: { label: string; value: ImageModel; description: string; }[] = [
  { label: 'جودة عالية', value: 'imagen-4.0-generate-001', description: 'أفضل جودة وواقعية، مثالي للصور النهائية.' },
  { label: 'سريع وتعديل', value: 'gemini-2.5-flash-image', description: 'أسرع في الإنشاء ويدعم إضافة شعار.' },
];
const logoPositions: { label: string; value: LogoPosition }[] = [
  { label: 'على المنتج', value: 'on_product' },
  { label: 'في طرف الصورة', value: 'corner' },
];

const ImageSuggestion: React.FC<ImageSuggestionProps> = ({ imagePrompt, generatedImage, isLoading, onGenerate }) => {
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(imageStyles[0]);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(aspectRatios[0].value);
  const [selectedModel, setSelectedModel] = useState<ImageModel>(imageModels[0].value);
  const [editablePrompt, setEditablePrompt] = useState(imagePrompt);
  const [logo, setLogo] = useState<Logo | null>(null);
  const [logoPosition, setLogoPosition] = useState<LogoPosition>('on_product');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLogoEditingMode = !!logo;
  // Aspect ratio is disabled for the fast model OR if a logo is being used (which forces the fast model)
  const isAspectRatioDisabled = selectedModel === 'gemini-2.5-flash-image' || isLogoEditingMode;

  useEffect(() => {
    setEditablePrompt(imagePrompt);
  }, [imagePrompt]);

  useEffect(() => {
    // If logo editing is active, force the correct model
    if (isLogoEditingMode) {
      setSelectedModel('gemini-2.5-flash-image');
    }
  }, [isLogoEditingMode]);

  useEffect(() => {
    // If aspect ratio becomes disabled, reset to 1:1
    if (isAspectRatioDisabled) {
      setSelectedRatio('1:1');
    }
  }, [isAspectRatioDisabled]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogo({ dataUrl: reader.result as string, mimeType: file.type });
        };
        reader.readAsDataURL(file);
    }
    // Reset file input value to allow re-uploading the same file
    if(e.target) e.target.value = '';
  };

  const handleGenerateClick = () => {
    const logoDetails = logo ? { ...logo, position: logoPosition } : null;
    onGenerate(editablePrompt, selectedStyle, selectedRatio, selectedModel, logoDetails);
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

      <div className="space-y-6 mb-6">
        {/* Logo Upload Section */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">دمج الشعار (اختياري)</label>
          {logo ? (
            <div className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <img src={logo.dataUrl} alt="logo preview" className="w-16 h-16 object-contain rounded-md bg-white/10" />
              <div className="flex-grow">
                <p className="text-sm font-semibold text-gray-200">تم تحميل الشعار</p>
                <p className="text-xs text-gray-500 max-w-xs truncate">{logo.mimeType}</p>
              </div>
              <button onClick={() => setLogo(null)} className="text-sm text-red-400 hover:text-red-300 font-semibold">إزالة</button>
            </div>
          ) : (
             <>
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    className="hidden"
                />
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                    تحميل شعار المنتج
                </Button>
             </>
          )}
        </div>

        {isLogoEditingMode && (
           <div>
              <label className="block mb-2 text-sm font-medium text-gray-400">موقع الشعار</label>
              <div className="flex gap-2">
                {logoPositions.map(pos => (
                  <button
                    key={pos.value}
                    onClick={() => setLogoPosition(pos.value)}
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm ${logoPosition === pos.value ? 'bg-blue-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
        )}

        {/* Model and Aspect Ratio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={isLogoEditingMode ? 'opacity-50' : ''}>
            <label className="block mb-2 text-sm font-medium text-gray-400">موديل الصورة</label>
            <div className="flex gap-2">
              {imageModels.map(model => (
                <button
                  key={model.value}
                  onClick={() => setSelectedModel(model.value)}
                  disabled={isLogoEditingMode}
                  className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm ${
                    (selectedModel === model.value && !isLogoEditingMode) ? 'bg-blue-600 text-white font-bold' : 
                    (isLogoEditingMode && model.value === 'gemini-2.5-flash-image') ? 'bg-gray-600 text-white' : 'bg-gray-700'
                  } ${!isLogoEditingMode ? 'hover:bg-gray-600' : 'cursor-not-allowed'}`}
                >
                  {model.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 h-8">
              {isLogoEditingMode ? "يتم استخدام موديل التعديل تلقائيًا." : imageModels.find(m => m.value === selectedModel)?.description}
            </p>
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
            <div className="text-xs mt-2 h-8">
              {isAspectRatioDisabled && <p className="text-amber-400">مقاس الصورة غير متاح لهذا الموديل (يستخدم مربع فقط).</p>}
            </div>
          </div>
        </div>

        {/* Image Style */}
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">ستايل الصورة</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
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