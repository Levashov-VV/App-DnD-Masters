import type { HeroFormData } from '@/features/heroes/schemas/heroSchema';

const HERO_FORM_STORAGE_KEY = 'dnd_hero_form_draft';
const MAX_STORAGE_SIZE = 5 * 1024 * 1024;

export interface StoredHeroData {
  formData: HeroFormData;
  timestamp: number;
  heroName?: string;
}

export const saveHeroFormDraft = (formData: HeroFormData): boolean => {
  try {
    const dataToStore: StoredHeroData = {
      formData,
      timestamp: Date.now(),
      heroName: formData.name || 'Без имени',
    };

    const jsonString = JSON.stringify(dataToStore);

    if (jsonString.length > MAX_STORAGE_SIZE) {
      console.warn('Данные формы слишком большие (>5MB)');
      return false;
    }

    localStorage.setItem(HERO_FORM_STORAGE_KEY, jsonString);
    return true;
  } catch (error) {
    console.error('Ошибка сохранения:', error);

    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage переполнен! Освободите место или удалите старые черновики.');
      alert(
        'Недостаточно места для сохранения черновика!\n\n' +
          'Возможные причины:\n' +
          '• Слишком много фотографий высокого разрешения\n' +
          '• localStorage браузера переполнен\n\n' +
          'Рекомендации:\n' +
          '• Используйте изображения меньшего размера\n' +
          '• Очистите кэш браузера\n' +
          '• Удалите старые черновики'
      );
    }
    return false;
  }
};

export const loadHeroFormDraft = (): HeroFormData | null => {
  try {
    const stored = localStorage.getItem(HERO_FORM_STORAGE_KEY);
    if (!stored) return null;

    const parsed: StoredHeroData = JSON.parse(stored);
    return parsed.formData;
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return null;
  }
};

export const clearHeroFormDraft = (): void => {
  try {
    localStorage.removeItem(HERO_FORM_STORAGE_KEY);
  } catch (error) {
    console.error('Ошибка удаления:', error);
  }
};

export const hasHeroFormDraft = (): boolean => {
  return localStorage.getItem(HERO_FORM_STORAGE_KEY) !== null;
};

export const getDraftInfo = (): {
  heroName: string;
  lastSaved: string;
  size: number;
  sizeInMB: number;
  teamMembersCount: number;
} | null => {
  try {
    const stored = localStorage.getItem(HERO_FORM_STORAGE_KEY);
    if (!stored) return null;

    const parsed: StoredHeroData = JSON.parse(stored);
    const size = new Blob([stored]).size;
    const lastSaved = new Date(parsed.timestamp).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      heroName: parsed.heroName || 'Без имени',
      lastSaved,
      size,
      sizeInMB: parseFloat((size / (1024 * 1024)).toFixed(2)),
      teamMembersCount: parsed.formData?.teamMembers?.length || 0,
    };
  } catch (error) {
    console.error('Ошибка получения информации:', error);
    return null;
  }
};

export const exportHeroFormDraft = (): void => {
  try {
    const stored = localStorage.getItem(HERO_FORM_STORAGE_KEY);
    if (!stored) {
      alert('Нет черновика для экспорта');
      return;
    }

    const parsed: StoredHeroData = JSON.parse(stored);
    const blob = new Blob([stored], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hero_draft_${parsed.heroName}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка экспорта:', error);
  }
};

export const importHeroFormDraft = (file: File): Promise<HeroFormData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed: StoredHeroData = JSON.parse(content);

        localStorage.setItem(HERO_FORM_STORAGE_KEY, content);
        resolve(parsed.formData);
      } catch (error) {
        console.error('Ошибка импорта:', error);
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};
