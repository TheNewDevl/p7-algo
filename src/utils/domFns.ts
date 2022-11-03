/** Return an HTML element, with the given classes and text content */
export const createEl = (
  tag: string,
  attributes: { [key: string]: string } = {},
  text?: string
): HTMLElement => {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, value);
  }

  if (text) {
    el.innerText = text;
  }

  return el;
};

/**
 * Return a clean string to make search easier
 * @param {string} string
 * @return {string}
 */
export const cleanString = (string: string) => {
  return string.toLowerCase().trim();
};
