
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
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
import type { Category, Project } from '@/types';
import { generateProjectDetailsAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Code2, Smartphone, DraftingCompass, FileJson, GitFork, Loader2, Sparkles, Edit3, CheckCircle, ExternalLink, LogIn, AlertCircle, UserCheck, ImagePlus } from 'lucide-react';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { cn } from '@/lib/utils';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  tags: z.string().optional(), // Comma-separated string
  category: z.enum(CATEGORIES, { required_error: 'Please select a category' }),
  previewImageUrl: z.string().url({ message: "Please enter a valid URL for the preview image." }),
  projectUrl: z.string().url({ message: "Please enter a valid URL (e.g., GitHub, live demo)" }).optional().or(z.literal('')),
  techStack: z.string().optional(), // Comma-separated string for tech stack
  aiPreviewImage: z.any().optional(), // FileList for AI generation, now optional
});

type ProjectFormData = z.infer<typeof projectSchema>;

const CategoryIcon = ({ category, className }: { category: Category, className?: string }) => {
  const props = { className: cn("w-5 h-5", className) };
  switch (category) {
    case 'Web App': return <Code2 {...props} />;
    case 'Mobile App': return <Smartphone {...props} />;
    case 'UI/UX Design': return <DraftingCompass {...props} />;
    case 'Code Snippet': return <FileJson {...props} />;
    case 'Open Source Project': return <GitFork {...props} />;
    default: return null;
  }
};

export default function UploadPage() {
  const { toast } = useToast();
  const [aiGeneratedPreviewUrl, setAiGeneratedPreviewUrl] = useState<string | null>(null); // For the image used by AI
  const [isGeneratingAIDetails, setIsGeneratingAIDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      previewImageUrl: '',
      projectUrl: '',
      techStack: '',
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        const { aiPreviewImage, ...restOfDraft } = value; // Exclude FileList from localStorage
        localStorage.setItem('uploadFormDraft', JSON.stringify(restOfDraft));
      } catch (error) {
        console.warn("Could not save draft to localStorage:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    try {
      const draft = localStorage.getItem('uploadFormDraft');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        form.reset(parsedDraft); 
      }
    } catch (error) {
      console.warn("Could not load draft from localStorage:", error);
    }
  }, [form]);

  const handleAIFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('aiPreviewImage', event.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAiGeneratedPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAiGeneratedPreviewUrl(null);
      form.setValue('aiPreviewImage', undefined);
    }
  };

  const handleAIDescription = async () => {
    if (!aiGeneratedPreviewUrl) {
      toast({ title: 'Error', description: 'Please upload an image for AI assistance first.', variant: 'destructive' });
      return;
    }
    setIsGeneratingAIDetails(true);
    try {
      const result = await generateProjectDetailsAction(aiGeneratedPreviewUrl); 
      if (result.description) form.setValue('description', result.description);
      if (result.tags && result.tags.length > 0) form.setValue('tags', result.tags.join(', '));
      toast({ title: 'AI Assistance', description: 'Description and tags generated!' });
    } catch (error) {
      toast({ title: 'AI Error', description: 'Could not generate details. Please try again or write your own.', variant: 'destructive' });
    } finally {
      setIsGeneratingAIDetails(false);
    }
  };
  
  const onSubmit = async (data: ProjectFormData) => {
    if (!currentUser) {
      toast({ title: 'Authentication Required', description: 'Please log in to share a project.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    const generateDataAiHint = (title: string): string => {
      return title.toLowerCase().split(' ').slice(0, 2).join(' ') || 'project image';
    };

    const projectData: Omit<Project, 'id'> = {
      title: data.title,
      description: data.description || '',
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      category: data.category,
      previewImageUrl: data.previewImageUrl, // This is now a URL string from input
      projectUrl: data.projectUrl || '',
      techStack: data.techStack ? data.techStack.split(',').map(tech => tech.trim()).filter(tech => tech) : [],
      creatorId: currentUser.uid,
      creatorName: currentUser.displayName || currentUser.email || 'Anonymous Creator',
      uploadDate: new Date().toISOString(),
      isFeatured: false, // Default, can be changed in admin
      dataAiHint: generateDataAiHint(data.title),
    };
    
    try {
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      toast({ 
        title: 'Project Submitted!', 
        description: `"${data.title}" has been saved to Firestore with ID: ${docRef.id}.`,
        className: "bg-green-100 border-green-400 text-green-800"
      });
      form.reset();
      setAiGeneratedPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      localStorage.removeItem('uploadFormDraft');
      setStep(1); // Reset to first step
    } catch (error: any) {
      console.error("Error saving project to Firestore: ", error);
      toast({ title: 'Submission Error', description: `Could not save project: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentProgress = step === 1 ? 33 : step === 2 ? 66 : 100;

  if (isLoadingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="mx-auto h-12 w-12 text-primary mb-3 animate-spin" />
        <p>Loading User Authentication...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center animate-fade-in-up">
        <Card className="w-full max-w-md shadow-xl p-8">
          <CardHeader>
            <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-2xl">Login Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              You need to be logged in to share a project.
            </p>
            <p className="text-sm mt-2">
              (Typically, you would log in via the Admin panel or a dedicated Creator login if available.)
            </p>
          </CardContent>
          <CardFooter>
             <Button className="w-full" onClick={() => { /* Potentially redirect to a login page or open login modal */ toast({title: "Redirecting to login...", description: "Please implement login flow."}) }}>
                Go to Login (Placeholder)
             </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }


  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="text-center animate-fade-in-up">
        <UserCheck className="mx-auto h-10 w-10 text-green-500 mb-2" />
        <p className="text-sm text-muted-foreground">Logged in as: {currentUser.email}</p>
        <h1 className="text-4xl font-bold text-primary mb-2 mt-2">Share Your Project</h1>
        <p className="text-lg text-foreground/80">Follow the steps to add your project to the showcase.</p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>
      
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${currentProgress}%` }}></div>
        </div>
        <p className="text-sm text-center text-muted-foreground mt-2">Step {step} of 3: {step === 1 ? "Project Info & Image URL" : step === 2 ? "Details & AI Assist" : "Confirm & Submit"}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
           <Card className="shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2"><ImagePlus className="text-primary w-7 h-7"/>Project Information & Preview Image URL</CardTitle>
              <CardDescription>Provide the main details for your project and a direct URL to its preview image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" {...form.register('title')} />
                {form.formState.errors.title && <p className="text-sm font-medium text-destructive">{form.formState.errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="previewImageUrl">Project Preview Image URL</Label>
                <Input id="previewImageUrl" {...form.register('previewImageUrl')} placeholder="https://example.com/your-image.png" />
                {form.formState.errors.previewImageUrl && <p className="text-sm font-medium text-destructive">{form.formState.errors.previewImageUrl.message}</p>}
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
                    >
                      {CATEGORIES.map(category => (
                        <Label
                          key={category}
                          htmlFor={`category-${category}`} // Ensure unique id
                          className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-accent/20 transition-colors cursor-pointer ${field.value === category ? 'border-primary ring-2 ring-primary bg-primary/10' : 'border-border'}`}
                        >
                          <RadioGroupItem value={category} id={`category-${category}`} />
                          <CategoryIcon category={category} />
                          <span>{category}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />
                {form.formState.errors.category && <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.category.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button type="button" onClick={() => form.trigger(['title', 'previewImageUrl', 'category']).then(isValid => isValid && setStep(2))}>Next: Add Details</Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2"><Edit3 className="text-primary w-7 h-7"/>Additional Project Details</CardTitle>
              <CardDescription>Provide more information about your project. Use the AI assistant for help with description and tags from an optional image upload!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectUrl">Project URL (e.g., GitHub, Live Demo)</Label>
                <div className="relative">
                  <Input id="projectUrl" {...form.register('projectUrl')} placeholder="https://github.com/yourname/project" className="pl-8" />
                  <ExternalLink className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {form.formState.errors.projectUrl && <p className="text-sm font-medium text-destructive">{form.formState.errors.projectUrl.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="description">Description / README (Optional)</Label>
                </div>
                <Textarea id="description" {...form.register('description')} rows={4} disabled={isGeneratingAIDetails} placeholder="Describe your project, its features, and purpose. Markdown is supported for READMEs." />
              </div>

              <div>
                <Label htmlFor="techStack">Tech Stack (Comma-separated)</Label>
                <Input id="techStack" {...form.register('techStack')} placeholder="E.g., React, Node.js, Python, Figma" />
              </div>

              <div>
                <Label htmlFor="tags">Tags (Comma-separated)</Label>
                <Input id="tags" {...form.register('tags')} disabled={isGeneratingAIDetails} placeholder="E.g., full-stack, ui-design, machine-learning, game-dev" />
              </div>
              
              <Card className="bg-muted/50 p-4">
                <Label htmlFor="aiPreviewImage" className="flex items-center gap-2 mb-2 font-semibold text-primary">
                    <Sparkles className="h-5 w-5" /> AI Assist: Generate Description & Tags (Optional)
                </Label>
                <p className="text-xs text-muted-foreground mb-2">Upload a preview image (screenshot, mockup) if you want AI to help generate a description and tags.</p>
                <Input
                    id="aiPreviewImage"
                    type="file"
                    ref={fileInputRef}
                    className="mb-2"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleAIFileChange}
                />
                {aiGeneratedPreviewUrl && <Image src={aiGeneratedPreviewUrl} alt="AI preview" width={150} height={100} className="rounded-md shadow-md object-contain max-h-32 my-2" />}
                <Button type="button" size="sm" variant="outline" onClick={handleAIDescription} disabled={isGeneratingAIDetails || !aiGeneratedPreviewUrl} className="flex items-center gap-1 text-xs">
                    {isGeneratingAIDetails ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    Generate with AI
                </Button>
              </Card>
            </CardContent>
             <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back to Project Info</Button>
                <Button type="button" onClick={() => form.trigger().then(isValid => isValid && setStep(3))}>Next: Confirm & Submit</Button>
             </CardFooter>
          </Card>
        )}
        
        {step === 3 && (
            <Card className="shadow-xl bg-gradient-to-br from-primary/5 to-accent/5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2"><CheckCircle className="text-green-500 w-7 h-7"/>Confirm & Submit Project</CardTitle>
                    <CardDescription>Review your project details before finalizing. This will save the project to Firestore.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <h3 className="font-semibold text-lg">Summary:</h3>
                    <div className="p-3 border rounded-md bg-background/50 space-y-1">
                        <p><strong>Title:</strong> {form.getValues('title')}</p>
                        <p><strong>Category:</strong> {form.getValues('category')}</p>
                        {form.getValues('previewImageUrl') && 
                            <div className='my-2'>
                                <p><strong>Preview Image URL:</strong> <Link href={form.getValues('previewImageUrl')!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{form.getValues('previewImageUrl')}</Link></p>
                                <Image src={form.getValues('previewImageUrl')!} alt="Project preview" width={200} height={150} className="rounded-md shadow-md object-contain max-h-40 mt-1" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            </div>
                        }
                        {form.getValues('projectUrl') && <p><strong>Project URL:</strong> <Link href={form.getValues('projectUrl')!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{form.getValues('projectUrl')}</Link></p>}
                        {form.getValues('techStack') && <p><strong>Tech Stack:</strong> {form.getValues('techStack')}</p>}
                        {form.getValues('tags') && <p><strong>Tags:</strong> {form.getValues('tags')}</p>}
                        {form.getValues('description') && <p className="mt-2"><strong>Description:</strong><br/><span className="text-muted-foreground whitespace-pre-line line-clamp-4">{form.getValues('description')}</span></p>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} disabled={isSubmitting}>Edit Details</Button>
                    <Button type="submit" size="lg" className="pulse-gentle" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UploadCloud className="mr-2 h-5 w-5" /> }
                        {isSubmitting ? 'Submitting...' : 'Submit Project to Firestore'}
                    </Button>
                </CardFooter>
            </Card>
        )}
      </form>
    </div>
  );
}
