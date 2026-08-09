// ========== Shared line-icon set (one stroke weight, one visual family) ==========
// Every icon shares viewBox/stroke settings so theme toggle, transport controls and status
// marks read as one system instead of a mix of emoji and unrelated unicode glyphs.
const ICON_ATTRS = 'viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

export const ICON_MOON = `<svg ${ICON_ATTRS}><path d="M16 11.5A6.5 6.5 0 0 1 8.5 4 6.5 6.5 0 1 0 16 11.5Z"/></svg>`;
export const ICON_SUN = `<svg ${ICON_ATTRS}><circle cx="10" cy="10" r="3.5"/><path d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1 4.7 4.7"/></svg>`;
export const ICON_PLAY = `<svg ${ICON_ATTRS}><path d="M6 4.2v11.6c0 .7.8 1.1 1.4.7l9-5.8c.5-.4.5-1.1 0-1.5l-9-5.8c-.6-.4-1.4 0-1.4.7Z"/></svg>`;
export const ICON_STOP = `<svg ${ICON_ATTRS}><rect x="5" y="5" width="10" height="10" rx="1.5"/></svg>`;
