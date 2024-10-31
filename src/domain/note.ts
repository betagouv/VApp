import assert from 'node:assert';

export const NOTE_MIN = -5;
export const NOTE_MAX = 5;

export const assertValid = (note: number | null, customMessage?: string) => {
  assert(isNote(note) && note >= NOTE_MIN && note <= NOTE_MAX, customMessage || `${note} n'est pas une note valide.`);
};

export const isNote = <T>(input: T | false | undefined | null | ''): input is T => {
  if (input === 0) {
    return true;
  }

  return !!input;
};
