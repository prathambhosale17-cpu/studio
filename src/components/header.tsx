import { ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          AadhaarVerify AI
        </h1>
      </div>
    </header>
  );
}
