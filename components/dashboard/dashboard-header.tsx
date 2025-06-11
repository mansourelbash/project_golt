"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "./dashboard-nav";

export function DashboardHeader() {
  return (
    <div className="flex h-14 lg:hidden items-center border-b px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Dashboard</h2>
              </div>
            </div>
            <div className="flex-1 px-4 py-2">
              <DashboardNav />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 ml-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
    </div>
  );
}
