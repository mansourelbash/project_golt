"use client";

import Link from "next/link";
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart, 
  ExternalLink,
  Clock,
  Tag
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock data
const latestProperties = [
  {
    id: 5,
    title: "Family Home with Garden",
    address: "567 Suburban St, Austin, TX",
    price: 450000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    type: "House",
    status: "For Sale",
    createdAt: "2 days ago",
    isNew: true
  },
  {
    id: 6,
    title: "City Center Studio",
    address: "789 Metro Ave, Chicago, IL",
    price: 1800,
    bedrooms: 0,
    bathrooms: 1,
    area: 600,
    image: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    type: "Apartment",
    status: "For Rent",
    createdAt: "3 days ago",
    isNew: true
  },
  {
    id: 7,
    title: "Mountain View Cabin",
    address: "123 Evergreen Rd, Denver, CO",
    price: 375000,
    bedrooms: 2,
    bathrooms: 1,
    area: 1200,
    image: "https://images.pexels.com/photos/2351649/pexels-photo-2351649.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    type: "House",
    status: "For Sale",
    createdAt: "1 week ago",
    isNew: false
  },
  {
    id: 8,
    title: "Renovated Townhouse",
    address: "456 Urban Way, Portland, OR",
    price: 2200,
    bedrooms: 3,
    bathrooms: 2.5,
    area: 1800,
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    type: "Townhouse",
    status: "For Rent",
    createdAt: "5 days ago",
    isNew: true
  },
  {
    id: 9,
    title: "Lakefront Property",
    address: "789 Lake Shore Dr, Minneapolis, MN",
    price: 695000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    image: "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    type: "House",
    status: "For Sale",
    createdAt: "2 weeks ago",
    isNew: false
  },
  {
    id: 10,
    title: "Modern Loft",
    address: "101 Downtown Blvd, San Francisco, CA",
    price: 3500,
    bedrooms: 1,
    bathrooms: 1,
    area: 950,
    image: "https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    type: "Loft",
    status: "For Rent",
    createdAt: "1 day ago",
    isNew: true
  },
];

export default function LatestProperties() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Latest Properties</h2>
            <p className="mt-2 text-muted-foreground">
              Newly listed properties on our platform
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link href="/properties">
              View All Properties
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <PropertyTabs properties={latestProperties} />
      </div>
    </section>
  );
}

type PropertyTabsProps = {
  properties: any[];
};

function PropertyTabs({ properties }: PropertyTabsProps) {
  const forSale = properties.filter((p) => p.status === "For Sale");
  const forRent = properties.filter((p) => p.status === "For Rent");

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="sale">For Sale</TabsTrigger>
        <TabsTrigger value="rent">For Rent</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <PropertyListItem key={property.id} property={property} index={index} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="sale" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forSale.map((property, index) => (
            <PropertyListItem key={property.id} property={property} index={index} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="rent" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forRent.map((property, index) => (
            <PropertyListItem key={property.id} property={property} index={index} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

type PropertyListItemProps = {
  property: any;
  index: number;
};

function PropertyListItem({ property, index }: PropertyListItemProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number, status: string) => {
    if (status === "For Rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <div 
            className="aspect-[16/10] bg-cover bg-center"
            style={{ backgroundImage: `url(${property.image})` }}
          />
          
          {/* Status Badge */}
          <Badge 
            className="absolute top-4 left-4 z-10" 
            variant={property.status === "For Rent" ? "secondary" : "default"}
          >
            {property.status}
          </Badge>
          
          {/* New Badge */}
          {property.isNew && (
            <Badge 
              className="absolute top-4 left-[90px] z-10 bg-green-500 text-white" 
            >
              New
            </Badge>
          )}
          
          {/* Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute top-4 right-4 z-10 bg-white/80 hover:bg-white",
              isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground"
            )}
            onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
          >
            <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
          
          {/* Property Type */}
          <Badge variant="outline" className="absolute bottom-4 right-4 z-10 bg-white/80">
            {property.type}
          </Badge>
        </div>
        
        <CardContent className="p-5">
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <Clock className="h-4 w-4 mr-1" />
            <span>{property.createdAt}</span>
            
            {property.status === "For Sale" && (
              <div className="flex items-center ml-4">
                <Tag className="h-4 w-4 mr-1" />
                <span>For Sale</span>
              </div>
            )}
          </div>
          
          <Link 
            href={`/properties/${property.id}`}
            className="block hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
          </Link>
          
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.address}</span>
          </div>
          
          <p className="text-xl font-bold mb-4">{formatPrice(property.price, property.status)}</p>
          
          <div className="flex justify-between items-center border-t pt-4">
            <div className="flex items-center text-muted-foreground">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Square className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.area} sqft</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}