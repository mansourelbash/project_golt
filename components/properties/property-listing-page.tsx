"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart, 
  Search,
  SlidersHorizontal,
  X,
  Home,
  DollarSign,
  Building2,
  Filter,
  LayoutGrid,
  List,
  ArrowUpDown,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { motion } from "@/lib/motion";

// Combined property data from featured and latest
const allProperties = [
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

export default function PropertyListingPage() {
  const [properties] = useState(allProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    minPrice: 0,
    maxPrice: 2000000,
    bedrooms: 0,
    bathrooms: 0,
  });
  
  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    // Search term filter
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === "all" || 
                         (filters.status === "sale" && property.status === "For Sale") ||
                         (filters.status === "rent" && property.status === "For Rent");
    
    // Type filter
    const matchesType = filters.type === "all" || property.type.toLowerCase() === filters.type;
    
    // Price filter
    const matchesPrice = property.price >= filters.minPrice && property.price <= filters.maxPrice;
    
    // Bedroom filter
    const matchesBedrooms = filters.bedrooms === 0 || property.bedrooms >= filters.bedrooms;
    
    // Bathroom filter
    const matchesBathrooms = filters.bathrooms === 0 || property.bathrooms >= filters.bathrooms;
    
    return matchesSearch && matchesStatus && matchesType && matchesPrice && matchesBedrooms && matchesBathrooms;
  });
  
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
    <div className="min-h-screen pt-24">
      {/* Page Header */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Find Your Perfect Property</h1>
          <p className="text-muted-foreground">Browse our curated selection of properties for sale and rent</p>
          
          {/* Search and Filters Bar */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Search by location, property name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="md:hidden"
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </Button>
              
              <div className="hidden md:flex gap-2">
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => setFilters({...filters, status: value})}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Property Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={filters.type} 
                  onValueChange={(value) => setFilters({...filters, type: value})}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="hidden md:flex"
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="hidden md:flex"
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Filters */}
      {filtersVisible && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:hidden">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setFiltersVisible(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Status</label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters({...filters, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Property Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Type</label>
                  <Select 
                    value={filters.type} 
                    onValueChange={(value) => setFilters({...filters, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="loft">Loft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[filters.minPrice, filters.maxPrice]}
                      min={0}
                      max={2000000}
                      step={50000}
                      onValueChange={(value) => setFilters({
                        ...filters, 
                        minPrice: value[0], 
                        maxPrice: value[1]
                      })}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>${filters.minPrice.toLocaleString()}</span>
                    <span>${filters.maxPrice.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                    <Select 
                      value={filters.bedrooms.toString()} 
                      onValueChange={(value) => setFilters({...filters, bedrooms: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Bathrooms</label>
                    <Select 
                      value={filters.bathrooms.toString()} 
                      onValueChange={(value) => setFilters({...filters, bathrooms: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">Apply Filters</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filter Properties
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Property Status</h4>
                    <div className="space-y-2">
                      {["All", "For Sale", "For Rent"].map((status) => (
                        <div key={status} className="flex items-center">
                          <input 
                            type="radio" 
                            id={status.replace(/\s+/g, '-').toLowerCase()} 
                            name="status" 
                            className="mr-2"
                            checked={
                              (status === "All" && filters.status === "all") ||
                              (status === "For Sale" && filters.status === "sale") ||
                              (status === "For Rent" && filters.status === "rent")
                            }
                            onChange={() => setFilters({
                              ...filters, 
                              status: status === "All" 
                                ? "all" 
                                : status === "For Sale" 
                                  ? "sale" 
                                  : "rent"
                            })}
                          />
                          <label htmlFor={status.replace(/\s+/g, '-').toLowerCase()}>
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Property Type</h4>
                    <div className="space-y-2">
                      {["All", "House", "Apartment", "Condo", "Townhouse", "Loft"].map((type) => (
                        <div key={type} className="flex items-center">
                          <input 
                            type="radio" 
                            id={type.toLowerCase()} 
                            name="type" 
                            className="mr-2"
                            checked={
                              (type === "All" && filters.type === "all") ||
                              (filters.type === type.toLowerCase())
                            }
                            onChange={() => setFilters({
                              ...filters, 
                              type: type === "All" ? "all" : type.toLowerCase()
                            })}
                          />
                          <label htmlFor={type.toLowerCase()}>
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Price Range</h4>
                    <div className="pt-2 px-2">
                      <Slider
                        defaultValue={[filters.minPrice, filters.maxPrice]}
                        min={0}
                        max={2000000}
                        step={50000}
                        onValueChange={(value) => setFilters({
                          ...filters, 
                          minPrice: value[0], 
                          maxPrice: value[1]
                        })}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>${filters.minPrice.toLocaleString()}</span>
                      <span>${filters.maxPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Bedrooms</h4>
                    <Select 
                      value={filters.bedrooms.toString()} 
                      onValueChange={(value) => setFilters({...filters, bedrooms: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Bathrooms</h4>
                    <Select 
                      value={filters.bathrooms.toString()} 
                      onValueChange={(value) => setFilters({...filters, bathrooms: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Contact our real estate experts for personalized assistance
                </p>
                <Button className="w-full">Contact Us</Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Properties Listing */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {filteredProperties.length} properties found
              </p>
              
              <div className="hidden md:block">
                <Select defaultValue="featured">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                    <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      status: "all",
                      type: "all",
                      minPrice: 0,
                      maxPrice: 2000000,
                      bedrooms: 0,
                      bathrooms: 0,
                    });
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className={cn(
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-6"
              )}>
                {filteredProperties.map((property, index) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    index={index} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type PropertyCardProps = {
  property: any;
  index: number;
  viewMode: "grid" | "list";
};

function PropertyCard({ property, index, viewMode }: PropertyCardProps) {
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
  
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 relative">
              <div 
                className="aspect-[4/3] md:h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${property.image || property.images?.[0]})` }}
              />
              <Badge 
                className="absolute top-4 left-4 z-10" 
                variant={property.status === "For Rent" ? "secondary" : "default"}
              >
                {property.status}
              </Badge>
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
            </div>
            
            <div className="md:w-2/3 p-5">
              <Link 
                href={`/properties/${property.id}`}
                className="block hover:text-primary transition-colors"
              >
                <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
              </Link>
              
              <div className="flex items-center text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm">{property.address}</span>
              </div>
              
              <p className="text-xl font-bold mb-4">{formatPrice(property.price, property.status)}</p>
              
              <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4">
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
                <div className="flex items-center text-muted-foreground">
                  <Home className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.type}</span>
                </div>
              </div>
              
              <Button size="sm" asChild>
                <Link href={`/properties/${property.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out hover:scale-110"
            style={{ backgroundImage: `url(${property.image || property.images?.[0]})` }}
          />
          
          <Badge 
            className="absolute top-4 left-4 z-10" 
            variant={property.status === "For Rent" ? "secondary" : "default"}
          >
            {property.status}
          </Badge>
          
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
          
          <Badge variant="outline" className="absolute bottom-4 left-4 z-10 bg-white/80">
            {property.type}
          </Badge>
        </div>
        
        <CardContent className="p-5">
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