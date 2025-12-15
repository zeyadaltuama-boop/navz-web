import { cn } from "@/lib/utils";
import { Truck } from "lucide-react";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-lg font-bold font-headline", className)}>
        <Truck className="size-6 text-primary" />
        <span>RideShift</span>
    </Link>
  );
}
