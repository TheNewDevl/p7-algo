/**
 * Return a clean string to make search easier
 * @param {string} string
 * @return {string}
 */
export const cleanString = (string: string) => {
  return string.toLowerCase().trim();
};

/** Replace some characters in the given string */
export const escapeRegex = (string: string): string => {
  return string
    .replace(/[()]/g, "\\$&")
    .replace(/ /g, "('| |-)")
    .replace(/[aà]/g, "(a|à)")
    .replace(/[eéèê]/g, "(e|é|è|ê)");
};
