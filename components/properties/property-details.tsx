"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Trash2,
  Home,
  Car,
  Wifi,
  Tv,
  Utensils,
  Wind,
  Snowflake,
  Phone,
  Mail,
  User,
  ChevronRight,
  Building,
  ArrowLeft,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { motion } from "@/lib/motion";

// Mock property data
const properties = [
  {
    id: "1",
    title: "Modern Villa with Pool",
    address: "123 Luxury Lane, Beverly Hills, CA",
    price: 1250000,
    description: "Experience luxury living in this modern villa with a stunning pool. This beautiful property features 4 spacious bedrooms, 3 luxurious bathrooms, and a large open-concept living area perfect for entertaining. The gourmet kitchen is equipped with high-end appliances and custom cabinetry. Outside, you'll find a meticulously landscaped garden with a private pool and covered patio area. Located in a prestigious neighborhood with excellent schools and close to shopping and dining.",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    yearBuilt: 2018,
    lotSize: "0.5 acres",
    garage: 2,
    images: [
      "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    ],
    featured: true,
    type: "House",
    status: "For Sale",
    agent: {
      name: "Michael Scott",
      phone: "(123) 456-7890",
      email: "michael@estatehub.com",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    },
    amenities: [
      "Swimming Pool",
      "Air Conditioning",
      "Central Heating",
      "Fireplace",
      "High-Speed Internet",
      "Security System",
      "Garage",
      "Garden",
      "Balcony",
      "Smart Home Features",
    ],
    location: {
      lat: 34.0736,
      lng: -118.4004,
    }
  },
  {
    id: "2",
    title: "Downtown Penthouse",
    address: "456 Urban Ave, New York, NY",
    price: 890000,
    description: "Luxury penthouse in the heart of downtown with breathtaking city views. This exquisite penthouse offers 3 bedrooms, 2 bathrooms, and a spacious open floor plan with floor-to-ceiling windows providing panoramic views of the city skyline. The designer kitchen features premium appliances and elegant finishes. Additional highlights include a private terrace, custom built-ins, and smart home technology throughout. The building amenities include 24-hour concierge, fitness center, and rooftop lounge. Prime location near restaurants, shopping, and transportation.",
    bedrooms: 3,
    bathrooms: 2,
    area: 1900,
    yearBuilt: 2015,
    lotSize: "N/A",
    garage: 1,
    images: [
      "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    ],
    featured: true,
    type: "Apartment",
    status: "For Sale",
    agent: {
      name: "Jessica Williams",
      phone: "(123) 456-7891",
      email: "jessica@estatehub.com",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    },
    amenities: [
      "Elevator",
      "Air Conditioning",
      "Central Heating",
      "High-Speed Internet",
      "Security System",
      "Concierge Service",
      "Fitness Center",
      "Balcony/Terrace",
      "Smart Home Features",
      "City Views",
    ],
    location: {
      lat: 40.7128,
      lng: -74.0060,
    }
  },
];

export default function PropertyDetails({ id }: { id: string }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Find the property with the matching ID
  const property = properties.find((p) => p.id === id) || properties[0];
  
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
  
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };
  
  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Property Header */}
      <div className="bg-muted/30 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-muted-foreground mb-4">
            <Link href="/properties" className="flex items-center hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to properties
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>{property.status}</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>{property.type}</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.address}</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
              <p className="text-2xl font-bold">{formatPrice(property.price, property.status)}</p>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className={isFavorite ? "text-red-500" : ""}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <div 
              className="aspect-[16/9] bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${property.images[activeImageIndex]})` }}
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
              onClick={nextImage}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
            
            <Badge 
              className="absolute top-4 left-4" 
              variant={property.status === "For Rent" ? "secondary" : "default"}
            >
              {property.status}
            </Badge>
          </div>
          
          <div className="hidden md:grid grid-cols-2 gap-4">
            {property.images.slice(0, 4).map((image, index) => (
              <div 
                key={index}
                className={`aspect-[4/3] bg-cover bg-center rounded-lg cursor-pointer ${
                  index === activeImageIndex ? "ring-2 ring-primary" : ""
                }`}
                style={{ backgroundImage: `url(${image})` }}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        </div>
        
        {/* Small screen image selector */}
        <div className="flex md:hidden gap-2 mt-4 overflow-x-auto pb-2">
          {property.images.map((image, index) => (
            <div 
              key={index}
              className={`w-20 flex-shrink-0 aspect-[4/3] bg-cover bg-center rounded-lg cursor-pointer ${
                index === activeImageIndex ? "ring-2 ring-primary" : ""
              }`}
              style={{ backgroundImage: `url(${image})` }}
              onClick={() => setActiveImageIndex(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Property Details */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features & Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
                    <p className="text-muted-foreground mb-6">
                      {property.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Type</span>
                        <span className="font-medium flex items-center">
                          <Home className="h-4 w-4 mr-1" />
                          {property.type}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Bedrooms</span>
                        <span className="font-medium flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.bedrooms}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Bathrooms</span>
                        <span className="font-medium flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.bathrooms}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Area</span>
                        <span className="font-medium flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          {property.area} sqft
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Year Built</span>
                        <span className="font-medium flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {property.yearBuilt}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Lot Size</span>
                        <span className="font-medium flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          {property.lotSize}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Garage</span>
                        <span className="font-medium flex items-center">
                          <Car className="h-4 w-4 mr-1" />
                          {property.garage} Cars
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Status</span>
                        <span className="font-medium flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {property.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Property Video</h2>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Video tour coming soon</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-0">
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Features & Amenities</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Interior Features</h3>
                      <ul className="space-y-3">
                        {[
                          { icon: Wifi, text: "High-Speed Internet" },
                          { icon: Tv, text: "Smart Home Features" },
                          { icon: Utensils, text: "Modern Kitchen" },
                          { icon: Wind, text: "Central Heating" },
                          { icon: Snowflake, text: "Air Conditioning" },
                        ].map((item, index) => (
                          <li key={index} className="flex items-center">
                            <item.icon className="h-5 w-5 text-primary mr-3" />
                            <span>{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Exterior Features</h3>
                      <ul className="space-y-3">
                        {property.amenities.slice(0, 5).map((amenity, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-primary mr-3" />
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">All Amenities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div 
                          key={index}
                          className="bg-muted/50 rounded-md px-4 py-3 flex items-center"
                        >
                          <div className="h-2 w-2 rounded-full bg-primary mr-3" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="mt-0">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Location</h2>
                  <p className="text-muted-foreground mb-6">
                    {property.address}
                  </p>
                  
                  <div className="aspect-[16/9] bg-muted rounded-lg mb-8">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(property.address)}`}
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Neighborhood</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { name: "Schools", distance: "0.5 miles" },
                        { name: "Restaurants", distance: "0.3 miles" },
                        { name: "Shopping", distance: "1.2 miles" },
                        { name: "Parks", distance: "0.8 miles" },
                        { name: "Public Transit", distance: "0.4 miles" },
                        { name: "Healthcare", distance: "1.5 miles" },
                      ].map((item, index) => (
                        <div 
                          key={index}
                          className="bg-muted/50 rounded-md px-4 py-3"
                        >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.distance}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="space-y-6">
              {/* Agent Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Listed By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={property.agent.image} alt={property.agent.name} />
                      <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{property.agent.name}</h3>
                      <p className="text-sm text-muted-foreground">Real Estate Agent</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span>{property.agent.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span>{property.agent.email}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link href={`/agents/${property.agent.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      View Agent Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Information</CardTitle>
                  <CardDescription>
                    Interested in this property? Send a message to the agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Input placeholder="Your Name" />
                      </div>
                      <div>
                        <Input type="email" placeholder="Your Email" />
                      </div>
                      <div>
                        <Input type="tel" placeholder="Your Phone" />
                      </div>
                      <div>
                        <Textarea 
                          placeholder="I am interested in this property and would like to schedule a viewing."
                          rows={4}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Similar Properties */}
              <Card>
                <CardHeader>
                  <CardTitle>Similar Properties</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {properties
                    .filter(p => p.id !== property.id)
                    .slice(0, 2)
                    .map((similarProperty) => (
                      <Link 
                        key={similarProperty.id}
                        href={`/properties/${similarProperty.id}`}
                        className="block p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex gap-3">
                          <div 
                            className="w-24 h-16 bg-cover bg-center rounded"
                            style={{ backgroundImage: `url(${similarProperty.images[0]})` }}
                          />
                          <div>
                            <h4 className="font-medium line-clamp-1">{similarProperty.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">{similarProperty.address}</p>
                            <p className="text-sm font-bold mt-1">
                              {formatPrice(similarProperty.price, similarProperty.status)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}