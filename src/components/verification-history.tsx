'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { VerificationResult, VerificationStatus } from '@/lib/types';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import Image from 'next/image';

interface VerificationHistoryProps {
  history: VerificationResult[];
  onSelectHistoryItem: (item: VerificationResult) => void;
  selectedId?: string | null;
}

const statusIcons: Record<VerificationStatus, React.ElementType> = {
  verified: CheckCircle2,
  failed: XCircle,
  error: AlertCircle,
  pending: Loader2,
  idle: CheckCircle2,
};

const statusColors: Record<VerificationStatus, string> = {
  verified: 'text-accent',
  failed: 'text-destructive',
  error: 'text-destructive',
  pending: 'text-primary animate-spin',
  idle: 'text-muted-foreground',
};

const statusBadges: Record<VerificationStatus, React.ReactNode> = {
    verified: <Badge variant="default" className="bg-accent hover:bg-accent">Verified</Badge>,
    failed: <Badge variant="destructive">Failed</Badge>,
    error: <Badge variant="destructive">Error</Badge>,
    pending: <Badge variant="outline">Pending</Badge>,
    idle: <Badge variant="secondary">Idle</Badge>,
}

export function VerificationHistory({
  history,
  onSelectHistoryItem,
  selectedId,
}: VerificationHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification History</CardTitle>
        <CardDescription>Review past verification attempts.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[550px]">
          <div className="p-4 pt-0">
            {history.length === 0 ? (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No verification history yet.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {history.map((item) => {
                  const Icon = statusIcons[item.status];
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onSelectHistoryItem(item)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border transition-colors',
                          selectedId === item.id
                            ? 'bg-primary/10 border-primary/50'
                            : 'bg-transparent hover:bg-muted'
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {item.imageDataUri ? (
                                <div className="relative w-12 h-8 rounded-md overflow-hidden border bg-muted shrink-0">
                                    <Image src={item.imageDataUri} alt="History item thumbnail" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-12 h-8 flex items-center justify-center rounded-md border bg-muted shrink-0">
                                    <Icon className={cn('h-5 w-5', statusColors[item.status])} />
                                </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-foreground">
                                {format(item.timestamp, 'MMM d, yyyy')}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(item.timestamp, 'p')}
                              </span>
                            </div>
                          </div>
                          {statusBadges[item.status]}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
