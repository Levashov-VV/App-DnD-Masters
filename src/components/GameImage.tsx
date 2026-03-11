import { assetUrl } from '@/shared/utils/assetUrl';

interface GameImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string;
}

export function GameImage({ src, fallback, ...props }: GameImageProps) {
  const resolvedSrc =
    !src || src === ''
      ? (fallback ?? '')
      : src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http')
        ? src
        : assetUrl(src);

  return (
    <img
      src={resolvedSrc}
      onError={(e) => {
        if (fallback) (e.currentTarget as HTMLImageElement).src = fallback;
      }}
      {...props}
    />
  );
}
