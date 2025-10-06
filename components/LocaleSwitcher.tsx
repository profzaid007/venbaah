'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
// import styles from './LocaleSwticher.module.css';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    }
  };

  return (
    <select className="menu menu-horizontal px-1"
      value={locale}
      onChange={e => switchLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="ta">தமிழ்</option>
    </select>
  );
}