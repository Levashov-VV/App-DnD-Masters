export type RollMode = 'single' | 'sum';
export type DiceCounts = Record<string, number>;

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
export type DiceSetColor = 'blue' | 'red' | 'black' | 'green' | 'purple' | 'darkBlue' | 'orange';

export type DiceSet = Record<DiceType, string>;
