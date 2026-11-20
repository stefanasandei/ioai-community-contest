const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

export default function BlogDate({ date }: { date: string }) {
  return <time dateTime={date} className="text-sm text-gray-500 dark:text-gray-400">
    {dateFormat.format(new Date(`${date}T00:00:00Z`))}
  </time>;
}
