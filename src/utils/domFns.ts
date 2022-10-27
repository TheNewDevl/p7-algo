/** Return an HTML element, with the given classes and text content */
export const createEl = (
  tag: string,
  className?: string[] | string,
  textContent?: string
): HTMLElement => {
  const el = document.createElement(`${tag}`);

  if (className) {
    typeof className === "string" ? el.classList.add(className) : el.classList.add(...className);
  }

  if (textContent) {
    el.textContent = textContent;
  }

  return el;
};
