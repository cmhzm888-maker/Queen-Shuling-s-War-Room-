import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Extract base64 data and mime type
      // result is like "data:image/jpeg;base64,/9j/4AAQ..."
      const matches = result.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        onImageSelected(matches[2], matches[1]);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={!isLoading ? triggerUpload : undefined}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer group
          ${isLoading
            ? 'border-indigo-200 bg-indigo-50 cursor-wait'
            : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/50 bg-white'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-indigo-100 rounded-full text-indigo-600 group-hover:scale-110 transition-transform duration-300">
            <Camera size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 font-serif-sc">
              {isLoading ? '正在侦查敌情...' : '上传战地情报'}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {isLoading ? '参谋部正在分析局势...' : '点击拍照或选择题目图片'}
            </p>
          </div>
          <div className="flex gap-2 text-xs text-slate-400">
            <span className="flex items-center"><ImageIcon size={12} className="mr-1"/> 支持 JPG/PNG</span>
          </div>
        </div>
      </div>
    </div>
  );
};
