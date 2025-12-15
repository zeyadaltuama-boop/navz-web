import Image from "next/image";
import RideRequestPanel from "@/components/passenger/ride-request-panel";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const mapBackground = PlaceHolderImages.find(img => img.id === 'map-background');

export default function PassengerPage() {
  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full">
      {mapBackground && (
        <Image
          src={mapBackground.imageUrl}
          alt={mapBackground.description}
          fill
          className="object-cover"
          data-ai-hint={mapBackground.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 h-full w-full p-4 md:p-6">
        <RideRequestPanel />
      </div>
    </div>
  );
}
