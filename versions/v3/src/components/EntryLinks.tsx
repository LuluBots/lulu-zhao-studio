import type { Entry } from '../content/profile';

export default function EntryLinks({entry}:{entry:Entry}) {
  if (!entry.url && !entry.paper) return null;
  return <div className="entry-links">
    {entry.url && <a href={entry.url} target="_blank" rel="noreferrer">{entry.side==='humanities'?'Essay':entry.url.startsWith('https://github.com/')?'Code':'Project'}</a>}
    {entry.paper && <a href={entry.paper} target="_blank" rel="noreferrer">Paper</a>}
  </div>;
}
