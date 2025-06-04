"use client";

import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  BedDouble, 
  Bath, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "@/lib/motion";

export default function PropertySearch() {
  const [searchType, setSearchType] = useState("buy");

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-background rounded-xl shadow-lg p-6"
      >
        <Tabs defaultValue="buy" onValueChange={setSearchType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="rent">Rent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="mt-0">
            <SearchForm type="buy" />
          </TabsContent>
          
          <TabsContent value="rent" className="mt-0">
            <SearchForm type="rent" />
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
}

type SearchFormProps = {
  type: "buy" | "rent";
};

function SearchForm({ type }: SearchFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="lg:col-span-2">
        <div className="flex items-center space-x-2 bg-muted/50 rounded-md p-3 h-full">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Location"
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          />
        </div>
      </div>
      
      <div>
        <div className="bg-muted/50 rounded-md p-3 h-full">
          <Select>
            <SelectTrigger className="border-0 bg-transparent focus:ring-0 p-0 h-6">
              <div className="flex items-center">
                <Home className="h-5 w-5 text-muted-foreground mr-2" />
                <SelectValue placeholder="Property Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <div className="bg-muted/50 rounded-md p-3 h-full">
          <Select>
            <SelectTrigger className="border-0 bg-transparent focus:ring-0 p-0 h-6">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                <SelectValue placeholder="Price Range" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100000-200000">$100k - $200k</SelectItem>
              <SelectItem value="200000-300000">$200k - $300k</SelectItem>
              <SelectItem value="300000-500000">$300k - $500k</SelectItem>
              <SelectItem value="500000-750000">$500k - $750k</SelectItem>
              <SelectItem value="750000-1000000">$750k - $1M</SelectItem>
              <SelectItem value="1000000+">$1M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="hidden sm:block">
        <div className="bg-muted/50 rounded-md p-3 h-full">
          <Select>
            <SelectTrigger className="border-0 bg-transparent focus:ring-0 p-0 h-6">
              <div className="flex items-center">
                <BedDouble className="h-5 w-5 text-muted-foreground mr-2" />
                <SelectValue placeholder="Bedrooms" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Button className="w-full h-full" size="lg">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}