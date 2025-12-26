export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
export type DiceSetColor = 'blue' | 'red' | 'black' | 'green' | 'purple' | 'darkBlue' | 'orange';

export type DiceSet = Record<DiceType, string>;

// Синие
export const blueSet: DiceSet = {
  d4: 'LP020_Material001_0',
  d6: 'LP009_Material001_0',
  d8: 'LP024_Material001_0',
  d10: 'LP017_Material001_0',
  d12: 'LP019_Material001_0',
  d20: 'LP_Material001_0',
  d100: 'LP017_Material001_0',
};

// Красные
export const redSet: DiceSet = {
  d4: 'LP038_Material010_0',
  d6: 'LP035_Material010_0',
  d8: 'LP039_Material010_0',
  d10: 'LP036_Material010_0',
  d12: 'LP037_Material010_0',
  d20: 'LP034_Material010_0',
  d100: 'LP036_Material010_0',
};

// Черные
export const blackSet: DiceSet = {
  d4: 'LP046_Material009_0',
  d6: 'LP050_Material009_0',
  d8: 'LP051_Material009_0',
  d10: 'LP049_Material009_0',
  d12: 'LP048_Material009_0',
  d20: 'LP047_Material009_0',
  d100: 'LP049_Material009_0',
};

// Зеленые
export const greenSet: DiceSet = {
  d4: 'LP002_Material004_0',
  d6: 'LP025_Material004_0',
  d8: 'LP026_Material004_0',
  d10: 'LP011_Material004_0',
  d12: 'LP008_Material004_0',
  d20: 'LP007_Material004_0',
  d100: 'LP011_Material004_0',
};

// Фиолетовые
export const purpleSet: DiceSet = {
  d4: 'LP028_Material008_0',
  d6: 'LP032_Material008_0',
  d8: 'LP033_Material008_0',
  d10: 'LP031_Material008_0',
  d12: 'LP030_Material008_0',
  d20: 'LP029_Material008_0',
  d100: 'LP031_Material008_0',
};

// Темно-синие
export const darkBlueSet: DiceSet = {
  d4: 'LP052_Material011_0',
  d6: 'LP056_Material011_0',
  d8: 'LP057_Material011_0',
  d10: 'LP055_Material011_0',
  d12: 'LP054_Material011_0',
  d20: 'LP053_Material011_0',
  d100: 'LP055_Material011_0',
};

// Оранжевые
export const orangeSet: DiceSet = {
  d4: 'LP023_Material003_0',
  d6: 'LP060_Material003_0',
  d8: 'LP061_Material003_0',
  d10: 'LP059_Material003_0',
  d12: 'LP058_Material003_0',
  d20: 'LP027_Material003_0',
  d100: 'LP059_Material003_0',
};

export const diceSets: Record<DiceSetColor, DiceSet> = {
  blue: blueSet,
  red: redSet,
  black: blackSet,
  green: greenSet,
  purple: purpleSet,
  darkBlue: darkBlueSet,
  orange: orangeSet,
};
