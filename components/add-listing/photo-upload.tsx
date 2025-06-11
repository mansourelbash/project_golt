"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface PhotoUploadProps {
  onPhotosChange: (photos: PhotoType[]) => void;
  maxPhotos?: number;
}

interface PhotoType {
  file: File;
  preview: string;
}

interface ProgressType {
  [key: string]: number;
}

export function PhotoUpload({ onPhotosChange, maxPhotos = 10 }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<ProgressType>({});
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload only JPG, PNG, or WEBP images.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image size should not exceed 5MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = async (files: File[]): Promise<void> => {
    const currentPhotos = photos;
    if (currentPhotos.length + files.length > maxPhotos) {
      toast({
        title: "Maximum photos reached",
        description: `You can only upload up to ${maxPhotos} photos`,
        variant: "destructive",
      });
      return;
    }

    const validFiles = files.filter(file => validateFile(file));
    
    for (const file of validFiles) {
      try {
        // Create a unique identifier for the file
        const fileId = `${Date.now()}-${file.name}`;
        
        // Initialize progress
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: 0
        }));

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress >= 100) {
              clearInterval(interval);
              return prev;
            }
            return {
              ...prev,
              [fileId]: Math.min(currentProgress + 10, 100)
            };
          });
        }, 100);

        // Create preview
        const preview = URL.createObjectURL(file);
        
        // Add to photos array
        setPhotos(prev => {
          const newPhotos = [...prev, { file, preview }];
          onPhotosChange(newPhotos); // Notify parent of change
          return newPhotos;
        });
        
        // Clear interval after "upload"
        setTimeout(() => {
          clearInterval(interval);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 1000);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        toast({
          title: "Upload failed",
          description: `Failed to process ${file.name}: ${errorMessage}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles).catch(error => {
      console.error("Error processing dropped files:", error);
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      processFiles(uploadedFiles).catch(error => {
        console.error("Error processing uploaded files:", error);
      });
    }
  };

  const removePhoto = (index: number): void => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);

    // Clean up the object URL
    URL.revokeObjectURL(photos[index].preview);
  };

  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-all cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/10" 
            : "border-border bg-muted/50 hover:bg-muted",
          photos.length > 0 && "h-32"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">Drag and drop your photos here</p>
        <p className="text-sm text-muted-foreground mb-4">or</p>
        <Button type="button" variant="outline" size="sm">
          Browse Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
        />
        <p className="text-xs text-muted-foreground mt-4">
          Supported formats: JPG, PNG, WEBP. Max size: 5MB per image.
        </p>
      </div>

      {/* Upload Progress Indicators */}
      {Object.entries(uploadProgress).map(([fileId, progress]) => (
        <div key={fileId} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      ))}

      {photos.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Uploaded Photos ({photos.length}/{maxPhotos})</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group aspect-square rounded-md overflow-hidden">
                <img
                  src={photo.preview}
                  alt={`Uploaded photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
