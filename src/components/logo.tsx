import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center", className)}
    >
      <img
        src="/navs_logo.PNG"
        alt="NAVZ Logo"
        className="h-12 w-auto"
      />
    </Link>
  );
}
