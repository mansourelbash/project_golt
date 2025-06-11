import PropertyDetails from '@/components/properties/property-details';

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  return (
    <PropertyDetails id={params.id} />
  );
}