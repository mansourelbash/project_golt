"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Building,
  DollarSign, 
  MapPin, 
  Home, 
  Info,
  CheckCircle2,
  ChevronRight,
  ImageIcon,
  Loader2
} from "lucide-react";
import { motion } from "@/lib/motion";
import { PhotoUpload } from "./photo-upload";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from 'next/dynamic';
const MapboxLocationPicker = dynamic(
  () => import('./mapbox-location-picker').then(mod => mod.MapboxLocationPicker),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PhotoType = {
  file: File;
  preview: string;
};

const FORM_STEPS = {
  BASIC_INFO: 1,
  LOCATION: 2,
  DETAILS: 3,
  PHOTOS_REVIEW: 4,
} as const;

const STEP_TITLES = {
  [FORM_STEPS.BASIC_INFO]: "Basic Information",
  [FORM_STEPS.LOCATION]: "Location",
  [FORM_STEPS.DETAILS]: "Property Details",
  [FORM_STEPS.PHOTOS_REVIEW]: "Photos & Review",
} as const;

const amenitiesList = [
  "Air Conditioning",
  "Swimming Pool",
  "Garden",
  "Balcony",
  "Garage",
  "Gym",
  "Elevator",
  "Security System",
  "Fireplace",
  "Central Heating",
  "Laundry Room",
  "Furnished",
  "Storage",
  "Parking",
  "Wheelchair Access",
  "High-Speed Internet",
];

const formSchema = z.object({
  // Basic Information
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  propertyType: z.string({
    required_error: "Please select a property type.",
  }),
  status: z.string({
    required_error: "Please select a listing status.",
  }),
  
  // Location
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code is required.",
  }),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  
  // Details
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  bedrooms: z.string(),
  bathrooms: z.string(),
  area: z.string().min(1, {
    message: "Area is required.",
  }),
  yearBuilt: z.string(),
  lotSize: z.string(),
  garage: z.string(),
  
  // Amenities
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  
  // Terms
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions to continue.",
  }),
});

export default function AddListingForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxSteps = 4;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "",
      status: "for-sale",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      price: "",
      bedrooms: "0",
      bathrooms: "1",
      area: "",
      yearBuilt: "",
      lotSize: "",
      garage: "0",
      amenities: [],
      terms: false,
    },
  });

  // Handle photo changes from the PhotoUpload component
  const handlePhotosChange = (newPhotos: PhotoType[]): void => {
    setPhotos(newPhotos);
  };

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log('Form submission started with values:', values);
      setIsSubmitting(true);

      // Validate photos
      if (photos.length === 0) {
        console.log('Validation failed: No photos uploaded');
        toast({
          title: "Photos required",
          description: "Please upload at least one photo of your property.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate coordinates
      if (!values.coordinates || !Array.isArray(values.coordinates) || values.coordinates.length !== 2) {
        console.log('Validation failed: Invalid coordinates', values.coordinates);
        toast({
          title: "Invalid location",
          description: "Please select a valid location on the map.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Uploading photos...');
      const formData = new FormData();
      photos.forEach(photo => {
        formData.append('files', photo.file);
      });

      const uploadResponse = await fetch('/api/properties/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('Photo upload failed:', errorData);
        throw new Error(errorData.message || 'Failed to upload photos');
      }

      const uploadData = await uploadResponse.json();
      const imageUrls = uploadData.urls || [];

      if (imageUrls.length === 0) {
        console.error('Photo upload returned no URLs');
        throw new Error('No image URLs returned from upload');
      }

      console.log('Photos uploaded successfully:', imageUrls);

      console.log('Preparing property data...');
      const propertyData = {
        ...values,
        bedrooms: parseInt(values.bedrooms) || 0,
        bathrooms: parseFloat(values.bathrooms) || 1,
        garage: parseInt(values.garage) || 0,
        price: parseFloat(values.price.replace(/[^0-9.]/g, '')) || 0,
        yearBuilt: values.yearBuilt ? parseInt(values.yearBuilt) : null,
        area: parseFloat(values.area) || 0,
        images: imageUrls,
        amenities: values.amenities || [],
        coordinates: values.coordinates || null,
      };

      console.log('Sending property data to API:', propertyData);
      const createResponse = await fetch('/api/properties', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error('Property creation failed:', errorData);
        throw new Error(errorData.message || 'Failed to create property listing');
      }

      const responseData = await createResponse.json();
      console.log('Property created successfully:', responseData);

      toast({
        title: "Success!",
        description: "Your property listing has been created.",
      });

      console.log('Redirecting to dashboard properties page...');
      router.push('/dashboard/properties');
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property listing",
        variant: "destructive",
      });
    } finally {
      console.log('Form submission process completed. Resetting isSubmitting state.');
      setIsSubmitting(false);
    }
  }

  // Move to the next step
  const nextStep = () => {
    const currentValues = form.getValues();
    let canProceed = true;

    // Validate fields based on current step
    if (currentStep === FORM_STEPS.BASIC_INFO) {
      if (!currentValues.title || !currentValues.description || !currentValues.propertyType || !currentValues.status) {
        form.trigger(["title", "description", "propertyType", "status"]);
        canProceed = false;
      }
    } else if (currentStep === FORM_STEPS.LOCATION) {
      if (!currentValues.address || !currentValues.city || !currentValues.state || !currentValues.zipCode) {
        form.trigger(["address", "city", "state", "zipCode"]);
        canProceed = false;
      }
    } else if (currentStep === FORM_STEPS.DETAILS) {
      if (!currentValues.price || !currentValues.area) {
        form.trigger(["price", "area"]);
        canProceed = false;
      }
    }

    if (canProceed && currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to the previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Get fields for current step
  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["title", "description", "propertyType", "status"];
      case 2:
        return ["address", "city", "state", "zipCode"];
      case 3:
        return ["price", "bedrooms", "bathrooms", "area", "yearBuilt", "lotSize", "garage"];
      case 4:
        return ["amenities"];
      default:
        return [];
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Page Header */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Add Your Property</h1>
          <p className="text-muted-foreground">List your property on EstateHub and reach thousands of potential buyers or renters</p>
        </div>
      </div>
      
      {/* Form Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={cn(currentStep >= 1 ? "text-primary" : "text-muted-foreground")}>Basic Info</span>
                  <span className={cn(currentStep >= 2 ? "text-primary" : "text-muted-foreground")}>Location</span>
                  <span className={cn(currentStep >= 3 ? "text-primary" : "text-muted-foreground")}>Details</span>
                  <span className={cn(currentStep >= 4 ? "text-primary" : "text-muted-foreground")}>Review</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(currentStep / maxSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Form Steps */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Info className="h-5 w-5 mr-2" />
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        Enter the basic details about your property
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Title*</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., Modern 3-Bedroom House with Garden" {...field} />
                            </FormControl>
                            <FormDescription>
                              A clear, attractive title for your property listing.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Description*</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your property in detail..."
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Highlight key features, recent upgrades, and neighborhood benefits.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="propertyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Type*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select property type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="house">House</SelectItem>
                                  <SelectItem value="apartment">Apartment</SelectItem>
                                  <SelectItem value="condo">Condo</SelectItem>
                                  <SelectItem value="townhouse">Townhouse</SelectItem>
                                  <SelectItem value="land">Land</SelectItem>
                                  <SelectItem value="commercial">Commercial</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Listing Status*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select listing status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="for-sale">For Sale</SelectItem>
                                  <SelectItem value="for-rent">For Rent</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Step 2: Location */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Location
                      </CardTitle>
                      <CardDescription>
                        Enter the location details of your property
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address*</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., 123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City*</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province*</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., NY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip/Postal Code*</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., 10001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-6">
                        <MapboxLocationPicker 
                          onLocationSelect={(location) => {
                            console.log("Location selected:", location);
                            form.setValue("address", location.address);
                            form.setValue("city", location.city);
                            form.setValue("state", location.state);
                            form.setValue("zipCode", location.zipCode);
                            form.setValue("coordinates", location.coordinates);
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Step 3: Property Details */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Home className="h-5 w-5 mr-2" />
                        Property Details
                      </CardTitle>
                      <CardDescription>
                        Enter the specific details about your property
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price*</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-10" placeholder="E.g., 450000" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              {form.watch("status") === "for-rent" ? "Monthly rent in USD" : "Price in USD"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="bedrooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bedrooms</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="0">Studio</SelectItem>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5">5</SelectItem>
                                  <SelectItem value="6+">6+</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bathrooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bathrooms</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="1.5">1.5</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="2.5">2.5</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="3.5">3.5</SelectItem>
                                  <SelectItem value="4+">4+</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="area"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Area (sq ft)*</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., 1500" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="yearBuilt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year Built</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., 2005" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lotSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lot Size</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., 0.25 acres" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="garage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Garage Spaces</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="0">None</SelectItem>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4+">4+</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {/* Step 4: Photos & Amenities */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <ImageIcon className="h-5 w-5 mr-2" />
                          Property Photos
                        </CardTitle>
                        <CardDescription>
                          Upload high-quality photos of your property (min: 1, max: 10)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PhotoUpload 
                          onPhotosChange={handlePhotosChange}
                          maxPhotos={10}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Property Amenities</CardTitle>
                        <CardDescription>
                          Select all the amenities that your property offers
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="amenities"
                          render={() => (
                            <FormItem>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {amenitiesList.map((amenity) => (
                                  <FormField
                                    key={amenity}
                                    control={form.control}
                                    name="amenities"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={amenity}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(amenity)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value || [], amenity])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== amenity
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal">
                                            {amenity}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Review & Submit</CardTitle>
                        <CardDescription>
                          Review your property listing before submitting
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            Please carefully review all the information you have provided. Once submitted, your listing will be reviewed by our team before being published on the platform.
                          </p>
                          
                          <FormField
                            control={form.control}
                            name="terms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Terms and Conditions
                                  </FormLabel>
                                  <FormDescription>
                                    I agree that my listing complies with all applicable laws and regulations, and I accept the terms and conditions of the platform.
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
              
              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="w-32"
                  >
                    Previous
                  </Button>
                )}
                <div className="flex-1" />
                {currentStep < maxSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="w-32"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-32 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}