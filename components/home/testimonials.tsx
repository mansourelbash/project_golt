"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion } from "@/lib/motion";

const testimonials = [
  {
    id: 1,
    name: "Emma Thompson",
    role: "First-time Homebuyer",
    image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    quote: "EstateHub made finding my first home a breeze. The interface is intuitive, and I loved being able to filter properties based on my exact needs. The virtual tours saved me so much time!"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Property Investor",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    quote: "As an investor, I need a platform that shows me opportunities quickly. EstateHub delivers with its comprehensive search tools and detailed property analytics. I've found several great investments here."
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Real Estate Agent",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    quote: "EstateHub has transformed how I connect with clients. The listing process is streamlined, and I get quality leads consistently. My business has grown 30% since joining the platform."
  },
  {
    id: 4,
    name: "David Williams",
    role: "Property Seller",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    quote: "I sold my house in under two weeks using EstateHub! The professional photography service they recommended made my listing stand out, and the process was smooth from start to finish."
  }
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied buyers, sellers, and agents who love using EstateHub
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 hidden md:flex"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 hidden md:flex"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}

type TestimonialCardProps = {
  testimonial: {
    id: number;
    name: string;
    role: string;
    image: string;
    quote: string;
  };
};

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="w-full flex-shrink-0 px-4">
      <Card className="bg-background shadow-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <Quote className="h-10 w-10 text-primary/20 mb-6" />
            
            <p className="text-lg italic mb-8">
              "{testimonial.quote}"
            </p>
            
            <Avatar className="h-16 w-16 mb-4">
              <AvatarImage src={testimonial.image} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div>
              <h4 className="font-semibold">{testimonial.name}</h4>
              <p className="text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}