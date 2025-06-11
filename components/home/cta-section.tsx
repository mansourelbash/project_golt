"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "@/lib/motion";

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url(https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1920)",
          filter: "brightness(0.3)" 
        }}
      />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Join thousands of satisfied customers who found their perfect property on EstateHub.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/add-listing">List Your Property</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}