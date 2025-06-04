import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { PropertiesTable } from "@/components/dashboard/properties-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { executeQuery } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "My Properties | Dashboard",
  description: "Manage your real estate listings",
};

interface Property {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
  location: string;
  property_type: string;
}

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions);
  
  const properties = await executeQuery<Property[]>(
    `SELECT id, title, price, status, created_at, location, property_type 
     FROM properties 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [session?.user?.id]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Properties</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your real estate listings
          </p>
        </div>
        <Link href="/add-listing">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      <PropertiesTable properties={properties} />
    </div>
  );
}
