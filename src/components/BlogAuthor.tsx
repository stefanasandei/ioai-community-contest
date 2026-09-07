export default function BlogAuthor({ author, handle, flag }: { author: string; handle: string; flag: string }) {
  return <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
    <span className="font-medium">{author}</span>
    {flag === '🇸🇬' ? <img src="/assets/flags/sg.svg" alt="Singapore" title="Singapore" width="24" height="16" className="inline-block h-4 w-6 rounded-[2px] ring-1 ring-black/10" /> : flag && <span>{flag}</span>}
    {handle && <span className="text-gray-500 dark:text-gray-400">({handle})</span>}
  </span>;
}
