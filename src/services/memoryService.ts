import { MemoryItem } from '../types';
import { logger } from './loggerService';

const STORAGE_KEY = 'nexus_persistent_memory';

export const memoryService = {
  /**
   * Load all memories from persistent storage
   */
  load: (): MemoryItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      // Sort by timestamp desc
      return parsed.sort((a: MemoryItem, b: MemoryItem) => b.timestamp - a.timestamp);
    } catch (e) {
      logger.error("Failed to load memory", "MemoryService", e);
      return [];
    }
  },

  /**
   * Save memories to persistent storage
   */
  save: (memories: MemoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    } catch (e) {
      logger.error("Failed to save memory", "MemoryService", e);
    }
  },

  /**
   * Add a new memory item
   */
  add: (category: 'FACT' | 'PREF' | 'TASK', content: string): MemoryItem => {
    const memory: MemoryItem = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      category,
      content,
      timestamp: Date.now()
    };
    
    const current = memoryService.load();
    
    // Deduplication check (simple)
    const exists = current.some(m => m.content.toLowerCase() === content.toLowerCase() && m.category === category);
    if (!exists) {
        const updated = [memory, ...current];
        memoryService.save(updated);
        logger.info(`Memory stored: [${category}] ${content}`, "MemoryService");
        return memory;
    } else {
        return current.find(m => m.content.toLowerCase() === content.toLowerCase())!;
    }
  },

  /**
   * Delete a memory item by ID
   */
  delete: (id: string): MemoryItem[] => {
    const current = memoryService.load();
    const updated = current.filter(m => m.id !== id);
    memoryService.save(updated);
    return updated;
  },

  /**
   * Clear all memories (Factory Reset)
   */
  clear: (): MemoryItem[] => {
    localStorage.removeItem(STORAGE_KEY);
    logger.warn("Memory systems purged", "MemoryService");
    return [];
  },

  /**
   * Get formatted context string for LLM injection
   * Limits to top N recent memories to save tokens
   */
  getContextString: (limit: number = 15): string => {
      const memories = memoryService.load().slice(0, limit);
      if (memories.length === 0) return "No prior context available.";
      
      return memories
        .map(m => `[${m.category}] ${m.content} (Time: ${new Date(m.timestamp).toLocaleDateString()})`)
        .join('\n');
  }
};