
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import { removeBackground } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { DownloadIcon, SparklesIcon } from './components/Icon';
import Loader from './components/Loader';

interface ImageData {
  base64: string;
  mimeType: string;
  fileName: string;
}

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    resetState();
    try {
      const base64String = await fileToBase64(file);
      setOriginalImage({
        base64: base64String,
        mimeType: file.type,
        fileName: file.name
      });
    } catch (err) {
      setError('Failed to load image. Please try another file.');
      console.error(err);
    }
  };
  
  const resetState = () => {
      setOriginalImage(null);
      setProcessedImage(null);
      setIsLoading(false);
      setError(null);
  };

  const handleRemoveBackground = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      const resultBase64 = await removeBackground(originalImage.base64, originalImage.mimeType);
      setProcessedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err) {
      console.error(err);
      setError('An error occurred while removing the background. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);
  
  const handleDownload = () => {
    if (!processedImage || !originalImage) return;
    const link = document.createElement('a');
    const originalName = originalImage.fileName.substring(0, originalImage.fileName.lastIndexOf('.'));
    link.download = `${originalName}-no-bg.png`;
    link.href = processedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto flex flex-col items-center">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-8">
              <ImageViewer title="Original Image" imageSrc={originalImage.base64} />
              <ImageViewer title="Background Removed" imageSrc={processedImage}>
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-800 bg-opacity-70 flex flex-col justify-center items-center rounded-lg">
                    <Loader />
                    <p className="text-slate-300 mt-4 text-center">Removing background...</p>
                  </div>
                )}
              </ImageViewer>
            </div>

            {error && (
              <div className="mt-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center" role="alert">
                <p>{error}</p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button onClick={handleRemoveBackground} disabled={isLoading}>
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isLoading ? 'Processing...' : 'Remove Background'}
              </Button>
              {processedImage && (
                 <Button onClick={handleDownload} variant="secondary" disabled={isLoading}>
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download Image
                </Button>
              )}
            </div>
            <button onClick={resetState} className="mt-6 text-slate-400 hover:text-slate-200 transition-colors duration-200">
                Upload another image
            </button>
          </div>
        )}
      </main>
      <footer className="w-full text-center p-4 mt-8 text-slate-500">
        <p>Powered by React, Tailwind CSS, and Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
