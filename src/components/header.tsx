'use client';

import { UserSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

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
          Manage IDs
        </Link>
        <Link
          href="/verify"
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.startsWith('/verify') ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          Verify ID
        </Link>
      </nav>
    </header>
  );
}
