import { Car, MapPin, Star, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const driverAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar-2');

const rideOptions = [
  { type: 'Standard', price: '€8.50', eta: '5 min', icon: <Car className="size-6" /> },
  { type: 'Premium', price: '€15.00', eta: '8 min', icon: <Car className="size-6" /> },
  { type: 'XL', price: '€12.75', eta: '7 min', icon: <Car className="size-6" /> },
];

export default function RideRequestPanel() {
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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickup">Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="pickup" placeholder="Enter pickup location" className="pl-9" defaultValue="123 Main St, Anytown" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoff">Dropoff Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="dropoff" placeholder="Enter dropoff location" className="pl-9" />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Choose a ride:</h3>
              {rideOptions.map((option) => (
                <div key={option.type} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    {option.icon}
                    <div>
                      <p className="font-semibold">{option.type}</p>
                      <p className="text-sm text-muted-foreground">{option.eta}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{option.price}</p>
                </div>
              ))}
            </div>
            <Button className="w-full" size="lg">Request Ride</Button>
          </CardContent>
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
