import { createElement, useCallback, useState } from 'react';
import type { HeroFormData } from '../../../../../features/heroes/schemas/heroSchema';
import { mapHeroToPdfData } from './PdfCharacterData';

async function loadPdfRuntime() {
  const [{ pdf }, { registerPdfFonts }, { CharacterSheetDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./pdfFonts'),
    import('./CharacterSheetdocument'),
  ]);
  registerPdfFonts();
  return { pdf, CharacterSheetDocument };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function openBlobInNewTab(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    console.warn('Не удалось открыть вкладку с PDF — проверьте блокировщик всплывающих окон.');
  }
}

export function useGenerateCharacterPdf() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (hero: HeroFormData | null, action: (blob: Blob) => void) => {
    setIsGenerating(true);
    setError(null);
    try {
      const { pdf, CharacterSheetDocument } = await loadPdfRuntime();
      const data = mapHeroToPdfData(hero);
      const element = createElement(CharacterSheetDocument, { data });
      const blob = await pdf(element as Parameters<typeof pdf>[0]).toBlob();
      action(blob);
    } catch (e) {
      console.error('Ошибка генерации PDF:', e);
      setError('Не удалось сгенерировать PDF. Попробуйте ещё раз.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateFilled = useCallback(
    (hero: HeroFormData) =>
      run(hero, (blob) => downloadBlob(blob, `${hero.name || 'персонаж'}.pdf`)),
    [run]
  );

  const generateBlank = useCallback(
    () => run(null, (blob) => downloadBlob(blob, 'пустой-лист-персонажа.pdf')),
    [run]
  );

  const previewFilled = useCallback((hero: HeroFormData) => run(hero, openBlobInNewTab), [run]);

  const previewBlank = useCallback(() => run(null, openBlobInNewTab), [run]);

  return {
    generateFilled,
    generateBlank,
    previewFilled,
    previewBlank,
    isGenerating,
    error,
  };
}
