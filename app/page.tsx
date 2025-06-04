import Hero from '@/components/home/hero';
import FeaturedProperties from '@/components/home/featured-properties';
import HowItWorks from '@/components/home/how-it-works';
import PropertySearch from '@/components/home/property-search';
import TestimonialsSection from '@/components/home/testimonials';
import LatestProperties from '@/components/home/latest-properties';
import CTASection from '@/components/home/cta-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <PropertySearch />
      <FeaturedProperties />
      <HowItWorks />
      <LatestProperties />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}