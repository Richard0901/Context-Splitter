import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { FileUploader } from './components/FileUploader';
import { Controls } from './components/Controls';
import { ChunkResult } from './components/ChunkResult';
import { splitContent } from './utils/splitter';
import { SplitConfig, Chunk } from './types';
import { Scissors, AlertCircle, Archive } from './components/Icons';

function App() {
  const [content, setContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [config, setConfig] = useState<SplitConfig>({
    mode: 'token',
    size: 128000,
    overlap: 0
  });

  const handleContentLoad = (newContent: string, name: string) => {
    setContent(newContent);
    setFileName(name);
  };

  const handleClear = () => {
    setContent(null);
    setFileName(null);
    setChunks([]);
  };

  const handleDownloadAll = async () => {
    if (chunks.length === 0) return;

    try {
      const zip = new JSZip();
      
      const originalName = fileName || 'split_file.txt';
      const nameParts = originalName.split('.');
      const ext = nameParts.length > 1 ? nameParts.pop() : 'txt';
      const baseName = nameParts.join('.');
      
      chunks.forEach((chunk) => {
        const chunkFileName = `${baseName}_part_${chunk.index}.${ext}`;
        zip.file(chunkFileName, chunk.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_split.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating zip:", error);
      alert("创建压缩包时出错，请重试。");
    }
  };

  useEffect(() => {
    if (content) {
      setIsProcessing(true);
      // Small timeout to allow UI to update before heavy calculation
      const timer = setTimeout(() => {
        const result = splitContent(content, config);
        setChunks(result);
        setIsProcessing(false);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setChunks([]);
    }
  }, [content, config]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="bg-primary-600 p-2.5 rounded-xl shadow-lg shadow-primary-600/20">
                <Scissors className="w-8 h-8 text-white" />
              </span>
              Context Splitter AI
            </h1>
            <p className="text-slate-500 mt-3 text-lg max-w-2xl">
              为大语言模型准备数据。智能分割长文本与CSV文件，轻松适配上下文窗口。
            </p>
          </div>
          <div className="text-sm text-slate-500 font-medium bg-white py-1.5 px-4 rounded-full border border-slate-200 shadow-sm">
             v1.0.0
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-4 space-y-8 sticky top-8">
             <section>
                <FileUploader 
                  onContentLoad={handleContentLoad} 
                  currentFileName={fileName}
                  onClear={handleClear}
                />
             </section>

             <section>
               <Controls config={config} setConfig={setConfig} />
             </section>

             {content && (
               <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-sm text-blue-800 flex items-start gap-3 animate-fade-in shadow-sm">
                 <AlertCircle className="w-5 h-5 shrink-0 text-blue-500 mt-0.5" />
                 <p className="leading-relaxed">
                   正在将 <strong>{fileName}</strong> 分割为 {chunks.length} 个部分。 <br/>
                   设定标准：{config.mode === 'token' ? 'Token' : '字符'} 限制 {config.size.toLocaleString()}。
                 </p>
               </div>
             )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">分割结果</h2>
                {chunks.length > 0 && (
                  <span className="bg-white text-slate-600 px-3 py-1 rounded-full text-sm font-semibold border border-slate-200 shadow-sm">
                    {chunks.length} 项
                  </span>
                )}
              </div>
              
              {chunks.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all shadow-sm active:scale-95"
                  title="将所有片段打包为ZIP下载"
                >
                  <Archive className="w-4 h-4" />
                  打包下载全部
                </button>
              )}
            </div>

            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
                 <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="font-medium">正在分析并分割内容...</p>
              </div>
            ) : chunks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chunks.map((chunk) => (
                  <ChunkResult 
                    key={chunk.id} 
                    chunk={chunk} 
                    totalChunks={chunks.length}
                    originalFileName={fileName || 'split_file'}
                  />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-16 text-center bg-slate-50/50">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                   <Scissors className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-slate-800 font-bold text-xl mb-2">暂无分割内容</h3>
                <p className="text-slate-500">请先在左侧上传文件或粘贴文本。</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;