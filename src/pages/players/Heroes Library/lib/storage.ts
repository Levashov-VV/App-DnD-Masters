import { createTypedStorage } from '../../../../shared/hooks/auth/typedStorage';
import type { AppStorage } from '../types/storage';

export const appStorage = createTypedStorage<AppStorage>('localStorage');
