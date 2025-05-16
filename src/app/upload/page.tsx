
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES } from '@/lib/constants';
import type { Category } from '@/types';
import { generateArtDescriptionAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Palette, Camera, PenTool, Laptop, Blend, Loader2, Sparkles, Edit3, CheckCircle } from 'lucide-react';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { cn } from '@/lib/utils'; // Import cn utility

const artworkSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  tags: z.string().optional(), // Comma-separated string
  category: z.enum(CATEGORIES, { required_error: 'Please select a category' }),
  image: z.any().refine(fileList => fileList && fileList.length === 1, 'Image is required.'),
});

type ArtworkFormData = z.infer<typeof artworkSchema>;

const CategoryIcon = ({ category, className }: { category: Category, className?: string }) => {
  const props = { className: cn("w-5 h-5", className) };
  switch (category) {
    case 'Painting': return <Palette {...props} />;
    case 'Drawing': return <PenTool {...props} />;
    case 'Photography': return <Camera {...props} />;
    case 'Digital Art': return <Laptop {...props} />;
    case 'Mixed Media': return <Blend {...props} />;
    default: return null;
  }
};

export default function UploadPage() {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Details, 3: Confirm
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
    },
  });

  useEffect(() => {
    // Auto-save to localStorage (simplified version)
    const subscription = form.watch((value) => {
      try {
        localStorage.setItem('uploadFormDraft', JSON.stringify(value));
      } catch (error) {
        console.warn("Could not save draft to localStorage:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    // Load from localStorage
    try {
      const draft = localStorage.getItem('uploadFormDraft');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        // Don't load file input from draft
        const { image, ...restOfDraft } = parsedDraft;
        form.reset(restOfDraft);
      }
    } catch (error) {
      console.warn("Could not load draft from localStorage:", error);
    }
  }, [form]);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', event.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setStep(2); // Move to details step
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIDescription = async () => {
    if (!previewUrl) {
      toast({ title: 'Error', description: 'Please upload an image first.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateArtDescriptionAction(previewUrl);
      if (result.description) form.setValue('description', result.description);
      if (result.tags) form.setValue('tags', result.tags.join(', '));
      toast({ title: 'AI Assistance', description: 'Description and tags generated!' });
    } catch (error) {
      toast({ title: 'AI Error', description: 'Could not generate description. Please try again or write your own.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const onSubmit = (data: ArtworkFormData) => {
    console.log('Artwork Data:', data);
    // Here you would typically send data to your backend
    toast({ 
      title: 'Upload Successful!', 
      description: `"${data.title}" has been added to the gallery.`,
      className: "bg-accent text-accent-foreground border-accent" // High-contrast success
    });
    form.reset();
    setPreviewUrl(null);
    localStorage.removeItem('uploadFormDraft');
    setStep(1);
  };

  const currentProgress = step === 1 ? 25 : step === 2 ? 66 : 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold text-primary mb-2">Share Your Art</h1>
        <p className="text-lg text-foreground/80">Follow the steps to upload your masterpiece.</p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>
      
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${currentProgress}%` }}></div>
        </div>
        <p className="text-sm text-center text-muted-foreground mt-2">Step {step} of 3: {step === 1 ? "Upload Image" : step === 2 ? "Add Details" : "Confirm & Submit"}</p>
      </div>


      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
           <Card className="shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2"><UploadCloud className="text-primary w-7 h-7"/>Select Image</CardTitle>
              <CardDescription>Choose a high-quality image of your artwork. JPG, PNG, or GIF accepted.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    fileInputRef.current!.files = e.dataTransfer.files;
                    // Create a new change event and dispatch it
                    const changeEvent = new Event('change', { bubbles: true });
                    fileInputRef.current!.dispatchEvent(changeEvent);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="flex text-sm text-muted-foreground">
                    <Label htmlFor="image-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring">
                      <span>Upload a file</span>
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              <Input
                id="image-upload"
                name="image"
                type="file"
                ref={fileInputRef}
                className="sr-only"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleFileChange}
              />
              {form.formState.errors.image && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.image.message as string}</p>}
            </CardContent>
          </Card>
        )}

        {(step === 2 || step === 3) && previewUrl && (
          <Card className="shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2"><Edit3 className="text-primary w-7 h-7"/>Add Details</CardTitle>
              <CardDescription>Provide information about your artwork. Use the AI assistant for help!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-center mb-4">
                  <Image src={previewUrl} alt="Artwork preview" width={200} height={200} className="rounded-md shadow-md object-contain max-h-64" />
                </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register('title')} disabled={step === 3} />
                {form.formState.errors.title && <p className="text-sm font-medium text-destructive">{form.formState.errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2"
                      disabled={step === 3}
                    >
                      {CATEGORIES.map(category => (
                        <Label
                          key={category}
                          htmlFor={category}
                          className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-accent/20 transition-colors cursor-pointer ${field.value === category ? 'border-primary ring-2 ring-primary bg-primary/10' : 'border-border'}`}
                        >
                          <RadioGroupItem value={category} id={category} />
                          <CategoryIcon category={category} />
                          <span>{category}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />
                {form.formState.errors.category && <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.category.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Button type="button" size="sm" variant="outline" onClick={handleAIDescription} disabled={isGenerating || step === 3} className="flex items-center gap-1 text-xs">
                    {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    AI Assist
                  </Button>
                </div>
                <Textarea id="description" {...form.register('description')} rows={4} disabled={step === 3 || isGenerating} placeholder="E.g., A vibrant watercolor painting capturing..." />
              </div>

              <div>
                <Label htmlFor="tags">Tags (Optional, comma-separated)</Label>
                <Input id="tags" {...form.register('tags')} disabled={step === 3 || isGenerating} placeholder="E.g., sunset, landscape, watercolor" />
              </div>
            </CardContent>
             <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={step === 3}>Back to Upload</Button>
                {step === 2 && <Button type="button" onClick={() => form.trigger().then(isValid => isValid && setStep(3))}>Preview & Confirm</Button>}
             </CardFooter>
          </Card>
        )}
        
        {step === 3 && previewUrl && (
            <Card className="shadow-xl bg-gradient-to-br from-primary/5 to-accent/5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2"><CheckCircle className="text-green-500 w-7 h-7"/>Confirm & Submit</CardTitle>
                    <CardDescription>Review your artwork details before finalizing the upload.</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>Edit Details</Button>
                    <Button type="submit" size="lg" className="pulse-gentle">Finalize Upload</Button>
                </CardFooter>
            </Card>
        )}
      </form>
    </div>
  );
}
