import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Save, Settings } from 'lucide-react';

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-2');

export default function DriverProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Driver Profile"
        description="Manage your account settings, pricing, and subscription."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24">
                {userAvatar && (
                  <AvatarImage src={userAvatar.imageUrl} alt="Driver Avatar" />
                )}
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">John D.</CardTitle>
              <CardDescription>Toyota Prius - ABC-123</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Change Profile Picture
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Settings</CardTitle>
              <CardDescription>
                Set your custom fares for rides. These will be shown to
                passengers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base-price">Base Price (€)</Label>
                  <Input id="base-price" defaultValue="2.50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="per-km">Price per km (€)</Label>
                  <Input id="per-km" defaultValue="1.20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-fare">Minimum Fare (€)</Label>
                <Input id="min-fare" defaultValue="5.00" />
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button><Save className='mr-2' /> Save Pricing</Button>
            </CardFooter>
          </Card>
           <Card id="subscription">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Manage your driver subscription to stay online and receive ride
                requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                    <div>
                        <p className="font-medium">Current Plan: Pro</p>
                        <p className="text-sm text-muted-foreground">Your subscription is active until December 31, 2024.</p>
                    </div>
                    <Badge variant="default" className="bg-green-500/80">Active</Badge>
                </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button asChild>
                <Link href="/driver/subscription">
                  <Settings className="mr-2" /> Manage Subscription
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
