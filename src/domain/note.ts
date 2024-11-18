export const NOTE_MIN = -5;
export const NOTE_MAX = 5;

export const assertValid = (note: number | null, customMessage?: string) => {
  console.assert(
    isNote(note) && note >= NOTE_MIN && note <= NOTE_MAX,
    customMessage || `${note} n'est pas une note valide.`
  );
};

export const isNote = <T>(input: T | false | undefined | null | ''): input is T => {
  if (input === 0) {
    return true;
  }

  return !!input;
};

export const noteToPercent = (note: number) => (note - NOTE_MIN) / (NOTE_MAX - NOTE_MIN);
export const formatNote = (note: number) => `${Math.floor(noteToPercent(note) * 100)}%`;
