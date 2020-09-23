import Page from "../models/page";

export function convertToPageObject({ number = '1', size = '1' } : Page) {
  const newNumber = parseInt(number);
  const newSize = parseInt(size);

  const offset: number = newSize * newNumber - 1;
  return {
    offset,
    size: newSize,
  };
};