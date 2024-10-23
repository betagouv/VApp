import assert from 'node:assert';

export const NOTE_MIN = 1;
export const NOTE_MAX = 5;

export const assertValid = (note: number) => {
  assert(note >= NOTE_MIN && note <= NOTE_MAX, `${note} n'est pas une note valide.`);
};
