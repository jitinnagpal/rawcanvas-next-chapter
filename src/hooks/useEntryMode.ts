import { useState, useEffect, useCallback } from 'react';

type EntryMode = 'estimate' | 'consult' | null;

// Simple state management using a module-level variable
let currentEntryMode: EntryMode = null;
const listeners: Set<() => void> = new Set();

export const setGlobalEntryMode = (mode: EntryMode) => {
  currentEntryMode = mode;
  listeners.forEach(listener => listener());
};

export const getGlobalEntryMode = (): EntryMode => currentEntryMode;

// React hook for entry mode
export const useEntryMode = () => {
  const [entryMode, setLocalEntryMode] = useState<EntryMode>(currentEntryMode);
  
  useEffect(() => {
    const listener = () => {
      setLocalEntryMode(currentEntryMode);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  
  const setEntryMode = useCallback((mode: EntryMode) => {
    setGlobalEntryMode(mode);
  }, []);
  
  return { entryMode, setEntryMode };
};
