"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart, 
  ExternalLink,
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Mock data
const featuredProperties = [
  {
    id: 1,
    title: "Modern Villa with Pool",
    address: "123 Luxury Lane, Beverly Hills, CA",
    price: 1250000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    images: [
      "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    ],
    featured: true,
    type: "House",
    status: "For Sale",
  },
  {
    id: 2,
    title: "Downtown Penthouse",
    address: "456 Urban Ave, New York, NY",
    price: 890000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1900,
    images: [
      "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    ],
    featured: true,
    type: "Apartment",
    status: "For Sale",
  },
  {
    id: 3,
    title: "Seaside Cottage",
    address: "789 Ocean Dr, Malibu, CA",
    price: 760000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    images: [
      "https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    ],
    featured: true,
    type: "House",
    status: "For Sale",
  },
  {
    id: 4,
    title: "Luxury Condo with City View",
    address: "1010 Skyline Blvd, Seattle, WA",
    price: 550000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [
      "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    ],
    featured: true,
    type: "Condo",
    status: "For Sale",
  },
];

export default function FeaturedProperties() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Properties</h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked properties by our experts
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link href="/properties">
              View All Properties
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

type PropertyCardProps = {
  property: any;
  index: number;
};

function PropertyCard({ property, index }: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const formatPrice = (price: number) => {
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
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
        <div 
          className="relative aspect-[4/3] overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110"
            style={{ backgroundImage: `url(${property.images[currentImage]})` }}
          />
          
          {/* Image Navigation */}
          {property.images.length > 1 && isHovered && (
            <>
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white h-8 w-8"
                onClick={(e) => { e.preventDefault(); prevImage(); }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white h-8 w-8"
                onClick={(e) => { e.preventDefault(); nextImage(); }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
          
          {/* Status Badge */}
          <Badge 
            className="absolute top-4 left-4 z-10" 
            variant={property.status === "For Rent" ? "secondary" : "default"}
          >
            {property.status}
          </Badge>
          
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
          <Badge variant="outline" className="absolute bottom-4 left-4 z-10 bg-white/80">
            {property.type}
          </Badge>
        </div>
        
        <CardContent className="p-5">
          <Link 
            href={`/properties/${property.id}`}
            className="block group-hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
          </Link>
          
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.address}</span>
          </div>
          
          <p className="text-xl font-bold mb-4">{formatPrice(property.price)}</p>
          
          <div className="flex justify-between items-center border-t pt-4">
            <div className="flex items-center text-muted-foreground">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms} Baths</span>
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