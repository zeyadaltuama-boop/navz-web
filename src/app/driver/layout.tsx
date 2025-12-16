'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CircleUser,
  CreditCard,
  Home,
  LineChart,
  Menu,
  Settings,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-2');

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = [
    { href: '/driver', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '/driver/earnings', icon: <Wallet className="h-5 w-5" />, label: 'Earnings' },
    { href: '/driver/subscription', icon: <CreditCard className="h-5 w-5" />, label: 'Subscription' },
    { href: '/driver/profile', icon: <CircleUser className="h-5 w-5" />, label: 'Profile' },
    { href: '/driver/ride-history', icon: <LineChart className="h-5 w-5" />, label: 'Ride History' },
  ];
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", { "bg-muted text-primary": pathname === item.href })}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Logo />
                {navItems.map(item => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", { "bg-muted text-foreground": pathname === item.href })}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                   {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Driver Avatar" />}
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/driver/profile" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
