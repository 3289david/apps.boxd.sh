import { getApps } from '@/lib/data';
import { LibraryClient } from './LibraryClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'My Library — apps.boxd.sh' };

export default function LibraryPage() {
  const allApps = getApps();
  return <LibraryClient allApps={allApps} />;
}
