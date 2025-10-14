
import React from 'react';
import { PhotoIcon } from './Icon';

interface ImageViewerProps {
  title: string;
  imageSrc: string | null;
  children?: React.ReactNode;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ title, imageSrc, children }) => {
  return (
    <div className="w-full">
      <h2 className="text-center text-lg font-medium text-slate-300 mb-4">{title}</h2>
      <div className="relative aspect-square w-full bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="object-contain h-full w-full" />
        ) : (
          <div className="text-slate-600 flex flex-col items-center">
            <PhotoIcon className="w-24 h-24" />
            <p className="mt-2">Your result will appear here</p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ImageViewer;
