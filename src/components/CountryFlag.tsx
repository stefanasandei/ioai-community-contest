const countries = {
  GR: 'Greece', RO: 'Romania', SG: 'Singapore', GE: 'Georgia', AU: 'Australia',
  KZ: 'Kazakhstan', ID: 'Indonesia', HK: 'Hong Kong', FR: 'France', PH: 'Philippines',
  MY: 'Malaysia', LK: 'Sri Lanka', SE: 'Sweden', GB: 'United Kingdom',
};

export type CountryCode = keyof typeof countries;

// Embed these tiny local assets so a cold page visit needs no flag requests.
const flagSources = import.meta.glob<string>('/public/assets/flags/4x3/*.svg', { eager: true, query: '?raw', import: 'default' });
const flagUrls = Object.fromEntries(Object.entries(flagSources).map(([path, svg]) => [
  path.split('/').pop()!.replace('.svg', '').toUpperCase(),
  `data:image/svg+xml,${encodeURIComponent(svg)}`,
]));

// Apple platforms include native flag emoji; Windows needs the SVG fallback.
const useNativeFlags = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);

export default function CountryFlag({ country }: { country: CountryCode }) {
  if (useNativeFlags) {
    const emoji = String.fromCodePoint(...Array.from(country, letter => 0x1f1e6 + letter.charCodeAt(0) - 65));
    return <span role="img" aria-label={countries[country]} title={countries[country]} className="ml-1 inline-block text-sm leading-none" style={{ fontFamily: 'Apple Color Emoji' }}>{emoji}</span>;
  }
  return <img
    src={flagUrls[country]}
    alt={countries[country]}
    title={countries[country]}
    width={16}
    height={12}
    className="ml-1 inline-block h-3 w-4 align-[-2px] rounded-[2px] ring-1 ring-black/10 dark:ring-white/15"
  />;
}
