
import React, { useState, useEffect } from 'react';
import TextArea from './components/TextArea';
import Button from './components/Button';
import PostCard from './components/PostCard';
import ImageSuggestion from './components/ImageSuggestion';
import type { Logo } from './components/ImageSuggestion';
import Loader from './components/Loader';
import Icon from './components/Icon';
import TrainingModal from './components/TrainingModal';
import IdeaBankModal from './components/IdeaBankModal';
import HistoryModal from './components/HistoryModal';
import { generatePosts, generateImage, refinePost } from './services/geminiService';
import type { GeneratedContent, AspectRatio, ImageStyle, ImageModel, HistoryEntry } from './types';

const POST_GOALS = ["تفاعلي", "بيعي", "تعليمي", "ترفيهي", "ثقافي"];

function App() {
  const [trainingText, setTrainingText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [postGoal, setPostGoal] = useState<string>(POST_GOALS[0]);
  const [activityField, setActivityField] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [refiningPostIndex, setRefiningPostIndex] = useState<number | null>(null);
  
  const [error, setError] = useState('');
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [generatedImage, setGeneratedImage] = useState('');
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [isIdeaBankModalOpen, setIsIdeaBankModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // History state with localStorage persistence
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const item = window.localStorage.getItem('postx-history');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('postx-history', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const handleGeneratePosts = async () => {
    if (!prompt.trim()) {
      setError('لازم تكتب فكرة البوست الأول.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setResult(null);
    setGeneratedImage('');

    try {
      const response = await generatePosts(prompt, trainingText, postGoal, activityField);
      setResult(response);
    } catch (e) {
      setError('حصل مشكلة واحنا بنعمل البوستات. ممكن تجرب تاني.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (
    imageGenPrompt: string, 
    style: ImageStyle, 
    aspectRatio: AspectRatio, 
    model: ImageModel,
    logo: (Logo & { position: 'on_product' | 'corner' }) | null
  ) => {
    if (!imageGenPrompt.trim() || !result) return;

    setIsImageLoading(true);
    setError('');
    setGeneratedImage('');

    try {
      const logoDetails = logo ? {
          data: logo.dataUrl.split(',')[1],
          mimeType: logo.mimeType,
          position: logo.position,
      } : undefined;

      const imageB64 = await generateImage(imageGenPrompt, style, aspectRatio, model, logoDetails);
      const fullImageUrl = `data:image/jpeg;base64,${imageB64}`;
      setGeneratedImage(fullImageUrl);

      // Save to history
      const newHistoryEntry: HistoryEntry = {
        id: new Date().toISOString(),
        timestamp: Date.now(),
        posts: result.posts,
        imagePrompt: imageGenPrompt,
        generatedImage: fullImageUrl,
      };
      setHistory(prevHistory => [newHistoryEntry, ...prevHistory]);

    } catch (e) {
      setError('الصورة معرفتش تطلع. جرب تاني أو غير الستايل.');
      console.error(e);
    } finally {
      setIsImageLoading(false);
    }
  };
  
  const handleRefinePost = async (index: number, instruction: string) => {
    if (!result?.posts[index]) return;

    setRefiningPostIndex(index);
    setError('');

    try {
      const refinedText = await refinePost(result.posts[index], instruction);
      setResult(prevResult => {
        if (!prevResult) return null;
        const newPosts = [...prevResult.posts];
        newPosts[index] = refinedText;
        return { ...prevResult, posts: newPosts };
      });
    } catch (e) {
      setError('مشكلة في تعديل البوست. حاول تاني.');
      console.error(e);
    } finally {
      setRefiningPostIndex(null);
    }
  };

  const handleSaveTraining = (text: string) => {
    setTrainingText(text);
    setIsTrainingModalOpen(false);
  };
  
  const handleIdeaSelect = (idea: string) => {
    setPrompt(idea);
    setIsIdeaBankModalOpen(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('متأكد إنك عايز تمسح كل البوستات السابقة؟')) {
        setHistory([]);
        setIsHistoryModalOpen(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              PostX
            </h1>
            <p className="mt-2 text-lg text-gray-400">صانع البوستات بالذكاء الاصطناعي</p>
          </div>
          <button 
              onClick={() => setIsHistoryModalOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 text-sm px-4 py-2 rounded-full font-semibold transition-all duration-300 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 ring-1 ring-gray-500/30"
          >
              <Icon name="history" className="w-5 h-5" />
              <span>بوستات سابقة</span>
          </button>
        </header>

        <main className="max-w-3xl mx-auto w-full flex flex-col gap-8">
          {/* Input Section */}
          <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 flex flex-col gap-6">
             <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-300">إعدادات البوست</h2>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsIdeaBankModalOpen(true)}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-full font-semibold transition-all duration-300 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 ring-1 ring-purple-500/30"
                    >
                        <Icon name="lightbulb" className="w-5 h-5" />
                        <span>بنك الأفكار</span>
                    </button>
                    <button 
                      onClick={() => setIsTrainingModalOpen(true)}
                      className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full font-semibold transition-all duration-300 ${trainingText.trim() ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30 ring-1 ring-green-500/30' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 ring-1 ring-blue-500/30'}`}
                    >
                      <Icon name="brain" className="w-5 h-5" />
                      <span>{trainingText.trim() ? 'تم التدريب' : 'تدريب على أسلوبي'}</span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-400">1. حدد هدف البوست</label>
                    <div className="flex flex-wrap gap-2">
                        {POST_GOALS.map(goal => (
                            <button 
                                key={goal}
                                onClick={() => setPostGoal(goal)}
                                className={`text-sm py-1.5 px-4 rounded-full transition-colors ${postGoal === goal ? 'bg-purple-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label htmlFor="activity-field" className="block mb-2 text-sm font-medium text-gray-400">2. اكتب مجال نشاطك (اختياري)</label>
                    <input
                        id="activity-field"
                        type="text"
                        value={activityField}
                        onChange={(e) => setActivityField(e.target.value)}
                        placeholder="مثال: محل ملابس، مطعم، مدرب شخصي..."
                        className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 text-gray-200 placeholder-gray-500"
                    />
                </div>
            </div>

            <TextArea
              label="3. اكتب فكرة البوست"
              placeholder="اكتب هنا فكرة بسيطة عن البوست اللي عايزه..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
            <Button
              onClick={handleGeneratePosts}
              isLoading={isLoading}
              disabled={!prompt.trim()}
              icon={<Icon name="sparkles" className="w-5 h-5" />}
            >
              اعملي بوست
            </Button>
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          </div>

          {/* Output Section */}
          <div className="flex flex-col gap-8">
            {isLoading ? (
                <div className="flex items-center justify-center h-96">
                    <Loader text="بنجهزلك البوستات..." size="lg" />
                </div>
            ) : result ? (
              <>
                <div className="flex flex-col gap-6">
                  {result.posts.map((post, index) => (
                    <PostCard
                      key={index}
                      text={post}
                      title={index === 0 ? "الاقتراح الأول" : "الاقتراح الثاني"}
                      isRefining={refiningPostIndex === index}
                      onRefine={(instruction) => handleRefinePost(index, instruction)}
                    />
                  ))}
                </div>
                <ImageSuggestion 
                  imagePrompt={result.imagePrompt}
                  generatedImage={generatedImage}
                  isLoading={isImageLoading}
                  onGenerate={handleGenerateImage}
                />
              </>
            ) : (
                <div className="flex items-center justify-center h-96 bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-700">
                    <div className="text-center text-gray-500">
                        <Icon name="sparkles" className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                        <p className="text-lg">النتيجة هتظهر هنا</p>
                    </div>
                </div>
            )}
          </div>
        </main>

        <footer className="text-center py-4 mt-12 text-gray-500 text-sm border-t border-gray-700/50">
         <p>MADE BY SONI DESIGNER</p>
         <a href="https://www.sonicourses.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
           www.sonicourses.com
         </a>
       </footer>
      </div>

       <TrainingModal 
            isOpen={isTrainingModalOpen}
            initialText={trainingText}
            onClose={() => setIsTrainingModalOpen(false)}
            onSave={handleSaveTraining}
        />
       <IdeaBankModal 
            isOpen={isIdeaBankModalOpen}
            onClose={() => setIsIdeaBankModalOpen(false)}
            onIdeaSelect={handleIdeaSelect}
       />
       <HistoryModal 
            isOpen={isHistoryModalOpen}
            history={history}
            onClose={() => setIsHistoryModalOpen(false)}
            onClear={handleClearHistory}
       />
    </div>
  );
}

export default App;