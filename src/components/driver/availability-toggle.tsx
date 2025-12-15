'use client';

import { useState } from 'react';
import { Power, PowerOff, ShieldCheck, ShieldOff } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';

import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type AvailabilityToggleProps = {
  isSubscriptionActive: boolean;
};

export default function AvailabilityToggle({ isSubscriptionActive }: AvailabilityToggleProps) {
  const [isOnline, setIsOnline] = useState(false);
  const [showInactiveDialog, setShowInactiveDialog] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (isSubscriptionActive) {
      setIsOnline(checked);
    } else {
      setShowInactiveDialog(true);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          {isSubscriptionActive ? (
            <ShieldCheck className="size-5 text-green-500" />
          ) : (
            <ShieldOff className="size-5 text-red-500" />
          )}
          <span>
            Subscription is {isSubscriptionActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <Card
          className={cn(
            'w-fit transition-colors',
            isOnline && isSubscriptionActive
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary'
          )}
        >
          <CardContent className="flex items-center gap-4 p-3">
            <div className="flex items-center gap-2 font-medium">
              {isOnline && isSubscriptionActive ? (
                <Power className="size-5 text-green-500" />
              ) : (
                <PowerOff className="size-5" />
              )}
              <span>You are {isOnline && isSubscriptionActive ? 'Online' : 'Offline'}</span>
            </div>
            <Switch
              checked={isOnline && isSubscriptionActive}
              onCheckedChange={handleToggle}
              aria-label="Toggle availability"
            />
          </CardContent>
        </Card>
      </div>
      <Dialog open={showInactiveDialog} onOpenChange={setShowInactiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inactive Subscription</DialogTitle>
            <DialogDescription>
              Your driver subscription is inactive. Please renew your
              subscription to go online and accept rides.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInactiveDialog(false)}
            >
              Cancel
            </Button>
            <Button asChild>
              <Link href="/driver/profile#subscription">Renew Subscription</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
