/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */

const getEmptyValue = (string, size) => {
  if (string.length === 0 || size === 0) {
    return "";
  }

  if (typeof size === "undefined") {
    return string;
  }
};

export function trimSymbols(string, size) {
  const empty = getEmptyValue(string, size);

  if (typeof empty === "string") {
    return empty;
  }

  const result = [];
  const map = {};

  for (let index = 0; index < string.length; index++) {
    const current = string[index];
    const occurrences = map[current];

    if (typeof occurrences === "undefined") {
      if (index !== 0) {
        const prevCurrent = string[index - 1];
        delete map[prevCurrent];
      }

      map[current] = 1;
      result.push(current);
    } else if (map[current] < size) {
      map[current] += 1;
      result.push(current);
    }
  }

  return result.join("");
}
