export interface SplitConfig {
  mode: 'token' | 'char';
  size: number;
  overlap: number;
}

export interface Chunk {
  id: string;
  index: number;
  content: string;
  charCount: number;
  estimatedTokens: number;
}

export const PRESETS = [
  { label: 'Gemini 3.0 (2M - 安全模式)', value: 1998000 }, // 2M - 2k
  { label: 'Gemini 1.5 Pro/Flash (1M)', value: 998000 },   // 1M - 2k
  { label: 'Claude 4.5 (500k - 预估)', value: 498000 },     // 500k - 2k (Hypothetical)
  { label: 'Claude 3.5 Sonnet (200k)', value: 198000 },    // 200k - 2k
  { label: 'GPT-5.2 / GPT-4o (128k)', value: 126000 },      // 128k - 2k
  { label: 'DeepSeek 3.2 (128k)', value: 126000 },          // 128k - 2k
  { label: 'DeepSeek V3 (64k)', value: 62000 },             // 64k - 2k
  { label: '标准 32k (通用)', value: 31000 },               // 32k - 1k
  { label: '标准 8k (通用)', value: 7000 },                 // 8k - 1k
];

export const TOKEN_TO_CHAR_RATIO = 4; // Approximate estimate