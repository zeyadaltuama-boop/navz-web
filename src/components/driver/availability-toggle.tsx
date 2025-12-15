'use client';

import { useState } from 'react';
import { Power } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function AvailabilityToggle() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <Card
      className={cn(
        'w-fit transition-colors',
        isOnline ? 'bg-accent text-accent-foreground' : 'bg-secondary'
      )}
    >
      <CardContent className="flex items-center gap-4 p-3">
        <div className="flex items-center gap-2 font-medium">
          <Power className={cn('size-5', isOnline && 'text-accent')} />
          <span>You are {isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <Switch
          checked={isOnline}
          onCheckedChange={setIsOnline}
          aria-label="Toggle availability"
        />
      </CardContent>
    </Card>
  );
}
