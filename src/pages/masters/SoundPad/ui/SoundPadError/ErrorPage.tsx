import type { FC } from 'react';

interface DataErrorUIProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorPage: FC<DataErrorUIProps> = ({ onRetry }) => {
  return (
    <div className="h-[85vh] flex flex-col items-center justify-center">
      <div className="w-[40vw] text-center">
        <h2 className="text-[4vh] font-bold text-amber-200">
          Произошла ошибка при загрузке данных
        </h2>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center w-[12vw] h-[6vh] text-[1.8vh] font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-400/30 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
          >
            Повторить
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
