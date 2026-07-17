import { Font } from '@react-pdf/renderer';

let fontsRegistered = false;

export const PDF_FONT_FAMILY = 'CormorantSC';

function fontUrl(filename: string): string {
  return `${import.meta.env.BASE_URL}Fonts/${filename}`;
}

export function registerPdfFonts(): void {
  if (fontsRegistered) return;

  Font.register({
    family: PDF_FONT_FAMILY,
    fonts: [
      { src: fontUrl('CormorantSC-Regular.ttf'), fontWeight: 'normal' },
      { src: fontUrl('CormorantSC-Medium.ttf'), fontWeight: 'medium' },
      { src: fontUrl('CormorantSC-SemiBold.ttf'), fontWeight: 'semibold' },
      { src: fontUrl('CormorantSC-Bold.ttf'), fontWeight: 'bold' },
    ],
  });

  Font.registerHyphenationCallback((word) => [word]);

  fontsRegistered = true;
}
