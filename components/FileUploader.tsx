import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, Trash2 } from './Icons';

interface FileUploaderProps {
  onContentLoad: (content: string, fileName: string) => void;
  currentFileName: string | null;
  onClear: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onContentLoad, currentFileName, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onContentLoad(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      readFile(files[0]);
    }
  }, [onContentLoad]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      readFile(e.target.files[0]);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onContentLoad(textInput, 'pasted-content.txt');
    }
  };

  if (currentFileName) {
    return (
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="bg-primary-50 p-3 rounded-full">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{currentFileName}</h3>
            <p className="text-sm text-slate-500">已就绪，等待分割</p>
          </div>
        </div>
        <button 
          onClick={() => {
            onClear();
            setTextInput('');
          }}
          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
          title="移除文件"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex gap-6 mb-4 px-1">
        <button
          onClick={() => setActiveTab('file')}
          className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'file' 
              ? 'border-primary-600 text-primary-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          上传文件
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'text' 
              ? 'border-primary-600 text-primary-700' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          粘贴文本
        </button>
      </div>

      {activeTab === 'file' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ease-in-out group
            ${isDragging 
              ? 'border-primary-500 bg-primary-50 scale-[1.01]' 
              : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50'
            }
          `}
        >
          <input
            type="file"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".txt,.csv,.md,.json,.js,.ts,.tsx,.html,.css,.py,.java,.c,.cpp"
          />
          <div className="flex flex-col items-center gap-4 pointer-events-none">
            <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-white text-primary-600' : 'bg-slate-100 text-slate-400 group-hover:text-primary-600'}`}>
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {isDragging ? '松开以上传' : '点击上传或拖拽文件到这里'}
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                支持 .txt, .csv, .json, .md 以及各种代码文件
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="在这里粘贴需要分割的长文本..."
            className="w-full h-48 bg-slate-50 text-slate-800 p-4 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none resize-none font-mono text-sm"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim()}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              载入文本
            </button>
          </div>
        </div>
      )}
    </div>
  );
};