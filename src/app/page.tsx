import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Car, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <div className="min-h-screen w-full bg-background">

      {/* ANNOUNCEMENT BANNER */}
      <div className="w-full border-b bg-muted/40">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-center px-6 text-sm">
          <span className="text-muted-foreground">
            🚀 RydNow is launching soon in Lisbon — access opening early 2026.
          </span>
        </div>
      </div>

      {/* MAIN */}
      <main className="w-full">
        {/* HERO */}
        <section className="relative h-[65vh] min-h-[520px] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              priority
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

          {/* HERO CONTENT */}
          <div className="relative z-10 flex h-full w-full items-center justify-center px-12 text-center">
            <div className="w-full max-w-5xl">
              <h1 className="font-headline text-5xl font-bold tracking-tight xl:text-6xl">
                Your Next Ride, Reimagined
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                RydNow connects passengers and drivers through a seamless, modern, and reliable ride-hailing experience.
              </p>

              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/passenger">
                    Get Started <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CARDS */}
        <section className="w-full py-20">
          <div className="flex w-full justify-center px-12">
            <div className="flex w-full max-w-[1400px] justify-center gap-16">

              {/* Passenger */}
              <Card className="w-full max-w-md">
                <CardHeader className="flex-row items-center gap-4">
                  <User className="size-8 text-primary" />
                  <CardTitle className="text-2xl">Passenger</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Request a ride, track your driver, and reach your destination with ease.
                  </CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/passenger">
                      Go to Passenger view <ArrowRight className="ml-auto" />
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Driver */}
              <Card className="w-full max-w-md">
                <CardHeader className="flex-row items-center gap-4">
                  <Car className="size-8 text-primary" />
                  <CardTitle className="text-2xl">Driver</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Manage your schedule, accept rides, and view your earnings on your dashboard.
                  </CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/driver">
                      Go to Driver view <ArrowRight className="ml-auto" />
                    </Link>
                  </Button>
                </div>
              </Card>

            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t">
        <div className="flex w-full items-center justify-between px-12 py-6 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RydNow. All rights reserved.</p>

          <div className="flex gap-6">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
