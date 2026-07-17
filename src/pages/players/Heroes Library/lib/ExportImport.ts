import { z } from 'zod';
import { heroSchema } from '../../../../features/heroes/schemas/heroSchema';
import type { Hero } from '../types/hero';

export const storedHeroSchema = heroSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CURRENT_EXPORT_VERSION = 1;
const APP_SIGNATURE = 'dnd-hero-builder' as const;

export const heroExportFileSchema = z.object({
  version: z.number(),
  exportedAt: z.string(),
  appId: z.literal(APP_SIGNATURE),
  characters: z.array(storedHeroSchema),
});

export type HeroExportFile = z.infer<typeof heroExportFileSchema>;

// ЭКСПОРТ

export function exportHeroesToFile(heroes: Hero[]) {
  const payload: HeroExportFile = {
    version: CURRENT_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    appId: APP_SIGNATURE,
    characters: heroes,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `dnd-heroes-backup-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// ВАЛИДАЦИЯ ИМПОРТИРУЕМОГО ФАЙЛА

export type ImportParseResult = { ok: true; data: HeroExportFile } | { ok: false; error: string };

export async function parseImportFile(file: File): Promise<ImportParseResult> {
  const looksLikeJson =
    file.name.toLowerCase().endsWith('.json') || file.type === 'application/json';
  if (!looksLikeJson) {
    return { ok: false, error: 'Файл должен быть в формате .json' };
  }

  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, error: 'Не удалось прочитать файл' };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'Файл повреждён или не является корректным JSON' };
  }

  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, error: 'Некорректная структура файла' };
  }

  if ('appId' in raw && (raw as Record<string, unknown>).appId !== APP_SIGNATURE) {
    return { ok: false, error: 'Это не файл экспорта персонажей из этого приложения' };
  }

  const parsed = heroExportFileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Структура файла не соответствует ожидаемому формату персонажей',
    };
  }

  if (parsed.data.version > CURRENT_EXPORT_VERSION) {
    return {
      ok: false,
      error: 'Файл создан более новой версией приложения. Обновите приложение и повторите попытку.',
    };
  }

  return { ok: true, data: parsed.data };
}

//  ПОИСК КОНФЛИКТОВ

export interface ImportDiff {
  newHeroes: Hero[];
  conflicts: Array<{ incoming: Hero; existing: Hero }>;
}

export function diffImport(existingHeroes: Hero[], incomingHeroes: Hero[]): ImportDiff {
  const existingById = new Map(existingHeroes.map((h) => [h.id, h]));
  const newHeroes: Hero[] = [];
  const conflicts: Array<{ incoming: Hero; existing: Hero }> = [];

  for (const hero of incomingHeroes) {
    const existing = existingById.get(hero.id);
    if (existing) {
      conflicts.push({ incoming: hero, existing });
    } else {
      newHeroes.push(hero);
    }
  }

  return { newHeroes, conflicts };
}

export type ConflictAction = 'use-incoming' | 'keep-existing' | 'skip';
