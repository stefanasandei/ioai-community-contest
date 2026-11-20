import CountryFlag, { type CountryCode } from '@/components/CountryFlag';

const authorCountries: Record<string, CountryCode> = { '🇸🇬': 'SG', '🇱🇰': 'LK' };

export default function BlogAuthor({ author, handle, flag }: { author: string; handle: string; flag: string }) {
  const country = authorCountries[flag];
  return <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
    <span className="font-medium">{author}</span>
    {country ? <CountryFlag country={country} /> : flag && <span>{flag}</span>}
    {handle && <span className="text-gray-500 dark:text-gray-400">({handle})</span>}
  </span>;
}
