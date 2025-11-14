'use client';

import { useMassView } from '@/lib/contexts/MassViewContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ReadingModeWrapperProps {
  children: React.ReactNode;
}

export function ReadingModeWrapper({ children }: ReadingModeWrapperProps) {
  const { readingMode, setReadingMode } = useMassView();

  // Handle ESC key to exit reading mode
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && readingMode) {
        setReadingMode(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [readingMode, setReadingMode]);

  // Lock body scroll when in reading mode
  useEffect(() => {
    if (readingMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [readingMode]);

  if (!readingMode) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Exit button */}
      <div className="sticky top-4 right-4 flex justify-end px-4 pb-2 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReadingMode(false)}
          className="shadow-lg"
        >
          <X className="h-4 w-4 mr-2" />
          Sair do Modo Leitura (ESC)
        </Button>
      </div>

      {/* Content with optimized margins */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        {children}
      </div>

      {/* Mobile orientation hint */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-muted/90 backdrop-blur-sm rounded-lg text-xs text-center">
        💡 Dica: Gire o dispositivo para visualização em duas colunas
      </div>
    </div>
  );
}
