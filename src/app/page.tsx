import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Car, ShieldCheck, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Logo from '@/components/logo';

const heroImage = PlaceHolderImages.find(image => image.id === 'hero-background');

export default function LandingPage() {
  const experiences = [
    {
      title: 'Passenger',
      description: 'Request a ride, track your driver, and reach your destination with ease.',
      href: '/passenger',
      icon: <User className="size-8 text-primary" />,
    },
    {
      title: 'Driver',
      description: 'Manage your schedule, accept rides, and view your earnings on our professional dashboard.',
      href: '/driver',
      icon: <Car className="size-8 text-primary" />,
    },
    {
      title: 'Admin',
      description: 'Oversee operations, manage users, and ensure compliance with our powerful tools.',
      href: '/admin',
      icon: <ShieldCheck className="size-8 text-primary" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Logo />
        </div>
      </header>
      <main className="flex-1">
        <section className="relative h-[60vh] min-h-[500px] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-end pb-16 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl">
              Your Next Ride, Reimagined
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              RydNow offers a seamless, modern, and reliable ride-hailing experience. Whether you're commuting or driving, we've got you covered.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/passenger">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="container">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
              {experiences.map((exp) => (
                <Card key={exp.title} className="group flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex-row items-center gap-4">
                    {exp.icon}
                    <CardTitle className="font-headline text-2xl">{exp.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription>{exp.description}</CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button variant="outline" asChild className="w-full">
                      <Link href={exp.href}>
                        Go to {exp.title} view <ArrowRight className="ml-auto" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex h-16 items-center justify-between">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} RydNow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
