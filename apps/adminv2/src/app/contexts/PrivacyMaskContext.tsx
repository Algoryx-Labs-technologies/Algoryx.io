import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

const STORAGE_KEY = 'adminv2-privacy-masked';

interface PrivacyMaskContextType {
  isMasked: boolean;
  toggleMask: () => void;
}

const PrivacyMaskContext = createContext<PrivacyMaskContextType | undefined>(undefined);

function readStoredMask(): boolean {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return true;
    }
    return stored === 'true';
  } catch {
    return true;
  }
}

export function PrivacyMaskProvider({ children }: { children: ReactNode }) {
  const [isMasked, setIsMasked] = useState(readStoredMask);

  const toggleMask = useCallback(() => {
    setIsMasked((previous) => {
      const next = !previous;
      try {
        sessionStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore storage errors in private browsing.
      }
      return next;
    });
  }, []);

  return (
    <PrivacyMaskContext.Provider value={{ isMasked, toggleMask }}>
      {children}
    </PrivacyMaskContext.Provider>
  );
}

export function usePrivacyMask() {
  const context = useContext(PrivacyMaskContext);
  if (context === undefined) {
    throw new Error('usePrivacyMask must be used within a PrivacyMaskProvider');
  }
  return context;
}
