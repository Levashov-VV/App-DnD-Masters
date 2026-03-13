import { useState, useEffect } from 'react';

export type ConfirmDialogType = 'confirm' | 'alert' | 'error' | 'prompt';

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  defaultValue?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  config: ConfirmDialogConfig;
  onClose: (confirmed: boolean) => void;
}

export function ConfirmDialog({ isOpen, config, onClose }: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      setInputValue(config.defaultValue ?? '');
    } else {
      setIsVisible(false);
    }
  }, [isOpen, config.defaultValue]);

  if (!isOpen) return null;

  const {
    title,
    message,
    type = 'confirm',
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    showCancel,
  } = config;

  const handleConfirm = () => {
    config.onConfirm?.(type === 'prompt' ? inputValue.trim() : undefined);
    onClose(true);
  };

  const handleCancel = () => {
    config.onCancel?.();
    onClose(false);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return { Bg: 'bg-red-600', border: 'border-red-600', confirmBg: 'bg-red-600 hover:bg-red-500' };
      case 'alert':
        return { Bg: 'bg-amber-600', border: 'border-amber-600', confirmBg: 'bg-amber-600 hover:bg-amber-500' };
      default:
        return { Bg: 'bg-amber-600', border: 'border-amber-600', confirmBg: 'bg-amber-600 hover:bg-amber-500' };
    }
  };

  const styles = getTypeStyles();
  const showCancelButton = showCancel !== undefined ? showCancel : type === 'confirm' || type === 'prompt';

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'bg-black/70' : 'bg-black/0'
      }`}
      onClick={type === 'alert' ? handleConfirm : undefined}
    >
      <div
        className={`relative w-[80vw] bg-stone-900 border-4 ${styles.border} rounded-2xl transition-all duration-300 transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className={`flex items-center justify-center ${styles.Bg} rounded-t-xl`}>
          <h2 className="text-[2.5vh] font-bold text-white uppercase">{title}</h2>
        </div>

        {/* Контент */}
        <div style={{ padding: '2vh 1vw' }} className="flex flex-col gap-[1vh]">
          <p className="text-[1.6vh] text-center text-amber-100 whitespace-pre-wrap leading-relaxed">
            {message}
          </p>

          {type === 'prompt' && (
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) handleConfirm();
                if (e.key === 'Escape') handleCancel();
              }}
              placeholder="Введите название..."
              className="w-full bg-neutral-800 border-2 border-amber-600/50 focus:border-amber-500 outline-none rounded-lg text-white text-[1.8vh] px-[0.8vw] py-[0.8vh] placeholder-neutral-500 transition-colors"
            />
          )}
        </div>

        {/* Кнопки */}
        <div
          style={{ marginBottom: '1vh' }}
          className={`flex ${showCancelButton ? 'justify-center gap-[1vw]' : 'justify-center'}`}
        >
          {showCancelButton && (
            <button
              type="button"
              onClick={handleCancel}
              className="w-[25vw] bg-gray-700 hover:bg-gray-600 text-white h-[4vh] rounded-lg font-bold transition-colors text-[1.6vh]"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={type === 'prompt' && !inputValue.trim()}
            className={`${styles.confirmBg} text-amber-100 w-[25vw] h-[4vh] rounded-lg font-bold transition-colors text-[1.6vh] disabled:opacity-40 disabled:cursor-not-allowed`}
            autoFocus={type !== 'prompt'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
