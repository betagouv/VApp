import assert from 'node:assert';

export const NOTE_MIN = -5;
export const NOTE_MAX = 5;

export const assertValid = (note: number, customMessage?: string) => {
  assert(note >= NOTE_MIN && note <= NOTE_MAX, customMessage || `${note} n'est pas une note valide.`);
};
