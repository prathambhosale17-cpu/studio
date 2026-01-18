'use client';

import { Globe, UserSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage, supportedLanguages } from '@/context/language-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-2">
        <UserSquare className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          ID Card Pro
        </h1>
      </div>
      <nav className="flex items-center gap-6 ml-auto">
        <Link
          href="/"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === '/' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {t('Manage IDs')}
        </Link>
        <Link
          href="/verify"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.startsWith('/verify') ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {t('Verify ID')}
        </Link>
        <Link
          href="/yojana-mitra"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.startsWith('/yojana-mitra') ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          Yojana Mitra
        </Link>
      </nav>
       <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
        <SelectTrigger className="w-auto gap-2 border-0 bg-transparent text-muted-foreground hover:text-primary focus:ring-0 focus:ring-offset-0">
          <Globe className="h-4 w-4" />
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </header>
  );
}
