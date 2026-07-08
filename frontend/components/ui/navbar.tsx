"use client";

import React from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  nav: {
    name: string;
    items: {
      label: string;
      href: string;
    }[];
  }[];
  className?: string;
};

export function MobileNav({ nav, className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger
        className={cn(
          "extend-touch-target block size-8 touch-manipulation items-center justify-start gap-2.5 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent md:hidden dark:hover:bg-transparent",
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          <div className="relative size-4">
            <span
              className={cn(
                "bg-current absolute left-0 block h-0.5 w-4 transition-all duration-100",
                open ? "top-[0.4rem] -rotate-45" : "top-1"
              )}
            />
            <span
              className={cn(
                "bg-current absolute left-0 block h-0.5 w-4 transition-all duration-100",
                open ? "top-[0.4rem] rotate-45" : "top-2.5"
              )}
            />
          </div>
          <span className="sr-only">Toggle Menu</span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background/95 no-scrollbar h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-content-available-width)] overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur-md duration-100 z-50"
        align="start"
        side="bottom"
        alignOffset={-16}
        sideOffset={4}
      >
        <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
          {nav.map((category, index) => (
            <div className="flex flex-col gap-4" key={index}>
              <p className="text-muted-foreground text-sm font-medium">
                {category.name}
              </p>
              <div className="flex flex-col gap-3">
                {category.items.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
