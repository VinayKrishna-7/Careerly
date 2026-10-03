/**
 * Updates the browser tab favicon to reflect the current theme (Noir & Crème).
 * @param {'light' | 'dark'} theme 
 */
export const updateFavicon = (theme) => {
  if (typeof document === 'undefined') return;

  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  const isDark = theme === 'dark';
  const bg = isDark ? '%23faf5eb' : '%23000000';
  const star = isDark ? '%23000000' : '%23faf5eb';
  const stroke = isDark ? '%23d5ccba' : '%23333333';

  link.type = 'image/svg+xml';
  link.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect x='1' y='1' width='30' height='30' rx='8' fill='${bg}' stroke='${stroke}' stroke-width='1.5'/><g transform='translate(4,4)' fill='${star}'><path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z'/></g></svg>`;
};
