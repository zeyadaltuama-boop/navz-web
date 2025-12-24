"use client";

import Logo from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Globe, Sun, Moon, Laptop, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useTheme } from "next-themes";
import Link from "next/link"; // ✅ ADDED

const userAvatar = PlaceHolderImages.find(
  (img) => img.id === "user-avatar-1"
);

export default function PassengerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { setTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative flex h-14 w-full items-center px-4">

          {/* RIGHT: Language | Theme | Avatar */}
          <div className="ml-auto flex items-center gap-2">

            {/* Avatar → Profile */}
            <Link href="/passenger/profile" className="rounded-full">
              <Avatar className="h-9 w-9 cursor-pointer">
                {userAvatar && (
                  <AvatarImage
                    src={userAvatar.imageUrl}
                    alt="User Avatar"
                    data-ai-hint={userAvatar.imageHint}
                  />
                )}
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
