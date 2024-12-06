export function toggleValueInStateArray<T>(value: T) {
  return (prevState: T[]) => {
    return prevState.includes(value) ? prevState.filter((item) => item !== value) : prevState.concat(value);
  };
}

export function unique<T>(value: T, index: number, array: T[]) {
  return array.indexOf(value) === index;
}
