import React, { useState } from 'react';
import { Chunk } from '../types';
import { Copy, Download, Check, FileText } from './Icons';

interface ChunkResultProps {
  chunk: Chunk;
  totalChunks: number;
  originalFileName: string;
}

export const ChunkResult: React.FC<ChunkResultProps> = ({ chunk, totalChunks, originalFileName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chunk.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([chunk.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Construct new filename: name_part_1.txt
    const nameParts = originalFileName.split('.');
    const ext = nameParts.length > 1 ? nameParts.pop() : 'txt';
    const name = nameParts.join('.');
    
    a.href = url;
    a.download = `${name}_part_${chunk.index}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 hover:border-primary-300 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-500 group-hover:text-primary-600 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">第 {chunk.index} 部分 <span className="text-slate-400 text-sm font-normal">/ 共 {totalChunks} 部分</span></h4>
            <div className="flex gap-3 text-xs text-slate-500 mt-1">
              <span>约 {chunk.estimatedTokens.toLocaleString()} tokens</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
              <span>{chunk.charCount.toLocaleString()} 字符</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-all border ${
              copied 
                ? 'bg-green-50 text-green-600 border-green-200' 
                : 'bg-white text-slate-500 border-slate-200 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50'
            }`}
            title="复制内容"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-white text-slate-500 border border-slate-200 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 rounded-lg transition-all"
            title="下载文件"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <pre className="w-full h-24 bg-slate-50 rounded-lg p-3 text-xs font-mono text-slate-600 overflow-hidden border border-slate-200 select-none pointer-events-none">
          {chunk.content.slice(0, 300)}...
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/50 to-transparent"></div>
        </pre>
      </div>
    </div>
  );
};