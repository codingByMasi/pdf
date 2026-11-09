// Small line icons (inline pictures). Pass the name; unknown names show a file icon.
const paths = {
  merge: <><path d="M8 4v5a3 3 0 0 0 3 3h8" /><path d="m16 9 3 3-3 3" /><path d="M8 20v-3a3 3 0 0 1 3-3" /></>,
  split: <><path d="M12 3v18M5 8h3M5 16h3M16 8h3M16 16h3" /><path d="m6 6-2 2 2 2m12-4 2 2-2 2M6 14l-2 2 2 2m12-4 2 2-2 2" /></>,
  rotate: <><path d="M20 7v5h-5" /><path d="M18.5 16a8 8 0 1 1 .7-8.5L20 12" /></>,
  trash: <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6m4-6v6" />,
  extract: <><path d="M14 3H6v18h12V7z" /><path d="M14 3v4h4M9 14h6m-3-3 3 3-3 3" /></>,
  grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  number: <path d="M7 5h3v14M7 19h6M15 8a3 3 0 1 1 5 2l-5 6h5" />,
  crop: <path d="M7 3v14h14M3 7h14v14" />,
  water: <path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z" />,
  redact: <path d="M4 6h16M4 18h16M7 10h10v4H7z" />,
  reader: <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23zM20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5a3.5 3.5 0 0 1 3.5 3z" />,
  pen: <path d="m4 20 4.5-1 10-10-3.5-3.5-10 10zM13.5 7l3.5 3.5M4 20h16" />,
  form: <path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h3" />,
  edit: <path d="M4 20h4l11-11-4-4L4 16zM13.5 6.5l4 4" />,
  sign: <path d="M4 17c3-5 4-10 6-10 3 0-2 10 1 10 2 0 3-4 4-4s0 4 2 4c1 0 2-1 3-2M4 21h16" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 5-5 4 4 2-2 5 4" /></>,
  text: <path d="M5 4h14M12 4v16M8 20h8" />,
  table: <><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 10h18M9 4v16m6-16v16" /></>,
  code: <path d="m9 7-5 5 5 5m6-10 5 5-5 5M14 4l-4 16" />,
  zip: <path d="M7 3h7l4 4v14H7zM14 3v4h4M11 3v3h2V8h-2v2h2v2h-2v3h2" />,
  layers: <path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" />,
  compress: <><path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5" /><path d="m3 8 5-5m13 5-5-5M3 16l5 5m13-5-5 5" /></>,
  scan: <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M8 12h8M8 15h6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  shield: <><path d="M12 3 4.5 6v5c0 5 3.2 8.5 7.5 10 4.3-1.5 7.5-5 7.5-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  file: <path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <path d="m9 18 6-6-6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  reverse: <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  nup: <><rect x="3" y="5" width="8" height="14" rx="1" /><rect x="13" y="5" width="8" height="14" rx="1" /></>,
  resize: <path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.01" /></>,
  header: <path d="M4 4h16M4 9h8M4 20h16M4 15h8" />,
  bookmark: <path d="M7 3h10v18l-5-4-5 4z" />,
  compare: <><rect x="3" y="4" width="8" height="16" rx="1" /><rect x="13" y="4" width="8" height="16" rx="1" /><path d="M6 9h2M6 13h2M16 9h2M16 13h2" /></>,
  hash: <path d="M9 4 7 20M17 4l-2 16M4 9h16M3 15h16" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  gray: <><circle cx="12" cy="12" r="8" /><path d="M12 4v16" /><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" /></>,
  blank: <><path d="M6 3h8l4 4v14H6z" strokeDasharray="2 2" /></>,
  frame: <><rect x="3" y="3" width="18" height="18" rx="1" /><rect x="7" y="7" width="10" height="10" /></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2-.6-1.2.2-2.5 1.5-2.5H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3Z" /><path d="M7.5 11v.01M10 7.5v.01M14 7.5v.01" strokeWidth="3" /></>,
  stamp: <><path d="M9 3h6v7l3 3v2H6v-2l3-3z" /><path d="M5 19h14v2H5z" /></>,
  book: <><path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2Z" /><path d="M12 6v14" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  wrench: <path d="M14.5 6.5a4 4 0 0 0 4.9 4.9L20 12 12 20a2.1 2.1 0 0 1-3-3l8-8-.5-.5a4 4 0 0 1-2-2Z" />,
  highlight: <><path d="m4 20 4-1 10-10-3-3L5 16z" /><path d="M4 20h16" /></>,
  replace: <><path d="M4 8h12l-3-3m3 3-3 3" /><path d="M20 16H8l3-3m-3 3 3 3" /></>,
  qr: <><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18v2M18 14v2" /></>,
  clip: <path d="m20 11-8.5 8.5a5 5 0 0 1-7-7L13 4a3.3 3.3 0 0 1 4.7 4.7L9.3 17a1.7 1.7 0 0 1-2.4-2.4L14 7.5" />,
  person: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" /></>,
  doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 15h6M9 18h4" /></>,
  sheet: <><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M4 10h16M4 15h16M10 4v16" /></>,
  slides: <><rect x="3" y="5" width="18" height="12" rx="1" /><path d="M12 17v3M8 20h8" /></>,
  swap: <><path d="M4 8h13l-3-3m3 3-3 3" /><path d="M20 16H7l3-3m-3 3 3 3" /></>,
  star: <path d="m12 3 2.8 5.9 6.2.8-4.5 4.4 1.1 6.3L12 17.5 6.4 20.4l1.1-6.3L3 9.7l6.2-.8z" />,
  pipette: <><path d="m15 4 5 5-3 3-5-5z" /><path d="m12 7-8 8v5h5l8-8" /></>,
  grip: <path d="M9 5v.01M15 5v.01M9 12v.01M15 12v.01M9 19v.01M15 19v.01" strokeWidth="3.2" />,
  up: <path d="m6 14 6-6 6 6" />,
  down: <path d="m6 10 6 6 6-6" />,
};

export const iconNames = Object.keys(paths);

export function Icon({ name, size = 24 }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.file}
    </svg>
  );
}
