'use client';

import { Car, MapPin, Star, Wallet, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { PlaceAutocompleteInput } from "./place-autocomplete-input";

const driverAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-2');
const passengerAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-1');

const availableDrivers = [
  {
    name: 'John D.',
    avatarId: 'user-avatar-2',
    vehicle: 'Toyota Prius',
    rating: 4.9,
    eta: '5 min',
    price: '€8.50',
    isFavorite: true,
  },
  {
    name: 'Maria S.',
    avatarId: 'user-avatar-3',
    vehicle: 'Honda Civic',
    rating: 4.8,
    eta: '8 min',
    price: '€7.90',
    isFavorite: false,
  },
   {
    name: 'Carlos F.',
    avatarId: 'user-avatar-4',
    vehicle: 'Tesla Model 3',
    rating: 5.0,
    eta: '6 min',
    price: '€12.00',
    isFavorite: false,
  },
];

const getAvatar = (id: string) => PlaceHolderImages.find(img => img.id === id);

type RideRequestPanelProps = {
    onPickupSelect: (place: google.maps.places.PlaceResult | null) => void;
    onDropoffSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export default function RideRequestPanel({ onPickupSelect, onDropoffSelect }: RideRequestPanelProps) {
    const [step, setStep] = React.useState('locations'); // 'locations', 'drivers', 'requesting'
    const [selectedDriver, setSelectedDriver] = React.useState<typeof availableDrivers[0] | null>(null);

    const handleFindDrivers = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('drivers');
    }

  return (
    <Card className="w-full max-w-sm rounded-xl shadow-2xl">
      <Tabs defaultValue="book">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="book">Book a Ride</TabsTrigger>
            <TabsTrigger value="status">Ride Status</TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent value="book">
          {step === 'locations' && (
             <form onSubmit={handleFindDrivers}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup">Pickup Location</Label>
                      <PlaceAutocompleteInput id="pickup" placeholder="Enter pickup location" onPlaceSelect={onPickupSelect} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dropoff">Dropoff Location</Label>
                      <PlaceAutocompleteInput id="dropoff" placeholder="Enter dropoff location" onPlaceSelect={onDropoffSelect} />
                    </div>
                    <Button className="w-full" size="lg" type="submit">Find Drivers</Button>
                </CardContent>
            </form>
          )}

          {step === 'drivers' && (
             <CardContent className="space-y-4">
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-center">Choose a driver:</h3>
                    <ScrollArea className="h-72">
                        <div className="space-y-3 pr-4">
                        {availableDrivers.map((driver) => (
                            <div 
                                key={driver.name} 
                                className={cn("flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer", selectedDriver?.name === driver.name && "bg-accent/80 border-primary")}
                                onClick={() => setSelectedDriver(driver)}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-10">
                                        <AvatarImage src={getAvatar(driver.avatarId)?.imageUrl} alt={driver.name} />
                                        <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{driver.name}</p>
                                        <p className="text-sm text-muted-foreground">{driver.vehicle}</p>
                                        <div className="flex items-center gap-1 text-xs">
                                            <Star className="size-3 text-yellow-400 fill-yellow-400"/>
                                            <span>{driver.rating}</span>
                                            <span className="text-muted-foreground">({driver.eta})</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <p className="font-semibold text-lg">{driver.price}</p>
                                    {driver.isFavorite && <Heart className="size-4 text-red-500 fill-red-500"/>}
                                </div>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </div>
                 <Button className="w-full" size="lg" disabled={!selectedDriver}>
                    Request {selectedDriver ? selectedDriver.name.split(' ')[0] : 'This Driver'}
                </Button>
                <Button variant="link" className="w-full" onClick={() => setStep('locations')}>Back</Button>
             </CardContent>
          )}
        </TabsContent>
        <TabsContent value="status">
            <CardContent className="space-y-4">
                <div className="text-center">
                    <p className="text-muted-foreground">On your way to</p>
                    <p className="font-semibold text-lg">456 Park Ave, Anytown</p>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="text-center">
                        <p className="font-bold text-lg text-foreground">12</p>
                        <p>min</p>
                    </div>
                    <Separator orientation="vertical" className="h-8"/>
                    <div className="text-center">
                        <p className="font-bold text-lg text-foreground">€14.50</p>
                        <p>fare</p>
                    </div>
                </div>
                <Separator/>
                <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                        {driverAvatar && <AvatarImage src={driverAvatar.imageUrl} alt="Driver" />}
                        <AvatarFallback>DR</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg">John D.</p>
                        <p className="text-muted-foreground">Toyota Prius - ABC-123</p>
                        <div className="flex items-center gap-1">
                            <Star className="size-4 text-yellow-400 fill-yellow-400"/>
                            <span className="font-medium">4.9</span>
                        </div>
                    </div>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline" className="w-full">Contact Driver</Button>
                    <Button variant="destructive" className="w-full">Cancel Ride</Button>
                </div>
            </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
