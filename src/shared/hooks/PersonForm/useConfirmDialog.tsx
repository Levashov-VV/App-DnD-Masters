import { useState, useCallback, useRef } from 'react';
import type { ConfirmDialogConfig } from '../../../pages/players/Heroes Library/components/Desktop/HeroForm/ui/FormStep5/ConfirmDialog';

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfirmDialogConfig>({
    title: '',
    message: '',
  });

  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((config: ConfirmDialogConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig({ ...config, type: 'confirm' });
      setIsOpen(true);
      resolveRef.current = resolve;
    });
  }, []);

  const alert = useCallback((title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig({
        title,
        message,
        type: 'alert',
        confirmText: 'ОК',
      });
      setIsOpen(true);
      resolveRef.current = resolve;
    });
  }, []);

  const error = useCallback((title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig({
        title,
        message,
        type: 'error',
        confirmText: 'Понятно',
      });
      setIsOpen(true);
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback((confirmed: boolean) => {
    setIsOpen(false);
    if (resolveRef.current) {
      resolveRef.current(confirmed);
      resolveRef.current = null;
    }
  }, []);

  return {
    confirm,
    alert,
    error,
    isOpen,
    config,
    handleClose,
  };
}
