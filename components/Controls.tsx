import React from 'react';
import { SplitConfig, PRESETS } from '../types';
import { Settings } from './Icons';

interface ControlsProps {
  config: SplitConfig;
  setConfig: React.Dispatch<React.SetStateAction<SplitConfig>>;
}

export const Controls: React.FC<ControlsProps> = ({ config, setConfig }) => {
  
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    if (val > 0) {
      setConfig(prev => ({ ...prev, size: val, mode: 'token' }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b border-slate-100 pb-3">
        <Settings className="w-5 h-5 text-primary-600" />
        <h2>分割配置</h2>
      </div>

      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">计算单位</label>
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setConfig(prev => ({ ...prev, mode: 'token' }))}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                config.mode === 'token' 
                  ? 'bg-white text-primary-700 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Tokens (预估)
            </button>
            <button
              onClick={() => setConfig(prev => ({ ...prev, mode: 'char' }))}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                config.mode === 'char' 
                  ? 'bg-white text-primary-700 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              字符数
            </button>
          </div>
        </div>

        {/* Input Size */}
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">
            每个文件最大 {config.mode === 'token' ? 'Token' : '字符'} 数
          </label>
          <input
            type="number"
            value={config.size}
            onChange={(e) => setConfig(prev => ({ ...prev, size: parseInt(e.target.value) || 0 }))}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="例如：128000"
          />
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">快速预设 (已自动预留空间)</label>
          <select
            onChange={handlePresetChange}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>选择模型限制 (自动预留 1k-2k Token)...</option>
            {PRESETS.map((preset) => (
              <option key={preset.label} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 mt-6 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
        <span className="font-semibold text-primary-600">* 说明：</span> Token 数量为估算值（1 Token ≈ 4 字符）。<br/>
        <span className="font-semibold text-primary-600">* 安全预留：</span> 上述预设值已自动扣除 1000-2000 Token，以便为 System Prompt（系统提示词）和上下文开销预留空间，确保内容不会因正好达到上限而被截断。
      </p>
    </div>
  );
};