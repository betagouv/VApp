export function toggleValueInStateArray<T>(value: T) {
  return (prevState: T[]) => {
    return prevState.includes(value) ? prevState.filter((item) => item !== value) : prevState.concat(value);
  };
}
