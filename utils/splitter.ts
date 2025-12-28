import { Chunk, SplitConfig, TOKEN_TO_CHAR_RATIO } from '../types';

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / TOKEN_TO_CHAR_RATIO);
};

export const splitContent = (content: string, config: SplitConfig): Chunk[] => {
  const chunks: Chunk[] = [];
  
  // Calculate the effective character limit
  const limit = config.mode === 'token' 
    ? config.size * TOKEN_TO_CHAR_RATIO 
    : config.size;

  // Safety check to avoid infinite loops with 0 size
  if (limit <= 0) return [];

  const length = content.length;
  let start = 0;
  let chunkIndex = 1;

  while (start < length) {
    let end = start + limit;
    
    // If this isn't the last chunk, try to find a safe break point (newline)
    // to avoid cutting lines in half, especially for CSVs or Code.
    if (end < length) {
      // Look for the last newline within the last 10% of the chunk to break safely
      const lookback = Math.floor(limit * 0.1); 
      const lastNewLine = content.lastIndexOf('\n', end);
      
      if (lastNewLine > start + (limit - lookback)) {
        end = lastNewLine + 1; // Include the newline
      }
    } else {
      end = length;
    }

    const chunkText = content.slice(start, end);
    
    chunks.push({
      id: generateId(),
      index: chunkIndex,
      content: chunkText,
      charCount: chunkText.length,
      estimatedTokens: estimateTokens(chunkText)
    });

    // Move start pointer, accounting for overlap if we added that feature (currently simple split)
    start = end;
    chunkIndex++;
  }

  return chunks;
};