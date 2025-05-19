
'use client';

import { useState, useEffect, type FormEvent } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Code2, Smartphone, DraftingCompass, FileJson, GitFork, Loader2, CheckCircle, ExternalLink, LogIn, UserCheck, ImagePlus, UserCog } from 'lucide-react';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { cn } from '@/lib/utils';
import { auth, db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  tags: z.string().optional(),
  category: z.enum(CATEGORIES, { required_error: 'Please select a category' }),
  previewImageFile: z.instanceof(File, { message: "Please upload a preview image." })
    .refine(file => file.size <= MAX_FILE_SIZE_BYTES, `Max file size is ${MAX_FILE_SIZE_MB}MB.`)
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .png, .webp, .gif formats are supported."),
  projectUrl: z.string().url({ message: "Please enter a valid URL (e.g., GitHub, live demo)" }).optional().or(z.literal('')),
  techStack: z.string().optional(),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      projectUrl: '',
      techStack: '',
      previewImageFile: undefined,
    },
  });

  useEffect(() => {
    if (!loadingAuth && !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to share a project.',
        variant: 'destructive',
        duration: 5000,
      });
      router.push('/login?redirect=/upload');
    }
  }, [user, loadingAuth, router, toast]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        const { previewImageFile, ...restOfValue } = value;
        localStorage.setItem('uploadFormDraft', JSON.stringify(restOfValue));
      } catch (error) {
        console.warn("Could not save draft to localStorage:", error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (user) {
      try {
        const draft = localStorage.getItem('uploadFormDraft');
        if (draft) {
          const parsedDraft = JSON.parse(draft) as Omit<ProjectFormData, 'previewImageFile'>;
          if (Object.keys(parsedDraft).length > 0) {
            form.reset(parsedDraft);
          }
        }
      } catch (error) {
        console.warn("Could not load draft from localStorage:", error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('previewImageFile', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      form.setValue('previewImageFile', undefined); 
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please log in to share a project.', variant: 'destructive' });
      router.push('/login?redirect=/upload');
      return;
    }
    setIsSubmitting(true);

    let uploadedImageUrl = '';

    if (data.previewImageFile) {
      const file = data.previewImageFile;
      const storageRef = ref(storage, `project-previews/${user.uid}/${Date.now()}_${file.name}`);
      try {
        toast({ title: "Uploading Image...", description: "Please wait." });
        const snapshot = await uploadBytes(storageRef, file);
        uploadedImageUrl = await getDownloadURL(snapshot.ref);
        toast({ title: "Image Uploaded", description: "Preview image saved to Firebase Storage." });
      } catch (e: any) {
        console.error("Error uploading image: ", e);
        toast({ title: "Image Upload Failed", description: `Could not upload image: ${e.message}`, variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
    } else {
      toast({ title: "Missing Image", description: "Preview image is required.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const generateDataAiHint = (title: string): string => {
      return title.toLowerCase().split(' ').slice(0, 2).join(' ') || 'project image';
    };

    const projectDataToSave: Omit<Project, 'id'> & { createdAt: any } = {
      title: data.title,
      description: data.description || '',
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      category: data.category,
      previewImageUrl: uploadedImageUrl,
      projectUrl: data.projectUrl || '',
      techStack: data.techStack ? data.techStack.split(',').map(tech => tech.trim()).filter(tech => tech) : [],
      creatorId: user.uid,
      creatorName: user.displayName || user.email || 'Anonymous Creator',
      uploadDate: new Date().toISOString(),
      isFeatured: false,
      dataAiHint: generateDataAiHint(data.title),
      createdAt: serverTimestamp(),
      likeCount: 0, // Initialize like count
    };

    try {
      toast({ title: "Submitting Project...", description: "Saving details to database." });
      await addDoc(collection(db, 'projects'), projectDataToSave);
      toast({
        title: 'Project Submitted!',
        description: `"${data.title}" has been successfully shared.`,
        className: "bg-green-100 border-green-400 text-green-800"
      });
      form.reset();
      setImagePreview(null);
      localStorage.removeItem('uploadFormDraft');
      setStep(1);
      router.push('/dashboard/my-projects');
    } catch (error: any) {
      console.error("Error saving project to Firestore: ", error);
      toast({ title: 'Submission Error', description: `Could not save project: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentProgress = step === 1 ? 33 : step === 2 ? 66 : 100;

  if (loadingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="mx-auto h-12 w-12 text-primary mb-3 animate-spin" />
        <p>Loading User Authentication...</p>
      </div>
    );
  }

  if (!user) {
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
          </CardContent>
           <CardFooter>
             <Button className="w-full" asChild>
                <Link href="/login?redirect=/upload">Go to Login</Link>
             </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="text-center animate-fade-in-up">
        <UserCog className="mx-auto h-10 w-10 text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Logged in as: {user.displayName || user.email}</p>
        <h1 className="text-4xl font-bold text-primary mb-2 mt-2">Share Your Project</h1>
        <p className="text-lg text-foreground/80">Follow the steps to add your project to the showcase.</p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="w-full bg-muted rounded-full h-2.5 shadow-inner">
          <div className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${currentProgress}%` }}></div>
        </div>
        <p className="text-sm text-center text-muted-foreground mt-2">Step {step} of 3: {step === 1 ? "Project Info & Image Upload" : step === 2 ? "Details" : "Confirm & Submit"}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
           <Card className="shadow-xl animate-fade-in-up border-2 border-primary/20" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3"><ImagePlus className="text-primary w-8 h-8"/>Project Information & Preview Image</CardTitle>
              <CardDescription>Provide the main details for your project and upload its preview image directly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div>
                <Label htmlFor="title" className="text-base">Project Title</Label>
                <Input id="title" {...form.register('title')} className="h-11 text-base mt-1" />
                {form.formState.errors.title && <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="previewImageFile" className="text-base">Project Preview Image</Label>
                 <Controller
                    name="previewImageFile"
                    control={form.control}
                    render={({ field: { ref, name, onBlur } }) => ( 
                        <Input
                            id="previewImageFile"
                            type="file"
                            accept="image/png, image/jpeg, image/webp, image/gif"
                            onChange={handleFileChange} 
                            ref={ref}
                            name={name}
                            onBlur={onBlur}
                            className="mt-1 h-11 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                    )}
                />
                {imagePreview && (
                    <div className="mt-3 border-2 border-dashed border-primary/30 p-3 rounded-lg inline-block bg-card shadow-sm">
                        <Image src={imagePreview} alt="Preview" width={240} height={180} className="rounded-md object-contain max-h-48" />
                    </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">Upload an image (JPG, PNG, GIF, WEBP). Max size: {MAX_FILE_SIZE_MB}MB.</p>
                {form.formState.errors.previewImageFile && <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.previewImageFile.message}</p>}
              </div>
               <div>
                <Label htmlFor="category" className="text-base mb-2 block">Category</Label>
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value} 
                      className="grid grid-cols-2 md:grid-cols-3 gap-3"
                    >
                      {CATEGORIES.map(category => (
                        <Label
                          key={category}
                          htmlFor={`category-${category}`}
                          className={`flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/10 transition-colors cursor-pointer text-sm font-medium ${field.value === category ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-border'}`}
                        >
                          <RadioGroupItem value={category} id={`category-${category}`} />
                          <CategoryIcon category={category} className="w-6 h-6 text-primary/80" />
                          <span>{category}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />
                {form.formState.errors.category && <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.category.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-4">
                <Button type="button" size="lg" onClick={() => form.trigger(['title', 'previewImageFile', 'category']).then(isValid => isValid && setStep(2))}>Next: Add Details</Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-xl animate-fade-in-up border-2 border-primary/20" style={{ animationDelay: '0.2s' }}>
             <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3"><ExternalLink className="text-primary w-8 h-8"/>Additional Project Details</CardTitle>
              <CardDescription>Provide more information about your project: its URL, description, tech stack, and tags.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="projectUrl" className="text-base">Project URL (Optional)</Label>
                <div className="relative mt-1">
                  <Input id="projectUrl" {...form.register('projectUrl')} placeholder="e.g., https://github.com/yourname/project or https://your-live-demo.com" className="pl-10 h-11 text-base" />
                  <ExternalLink className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Link to your GitHub repository, live demo, Figma file, etc.</p>
                {form.formState.errors.projectUrl && <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.projectUrl.message}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="text-base">Description / README (Optional)</Label>
                <Textarea id="description" {...form.register('description')} rows={5} placeholder="Describe your project, its features, and purpose. Markdown is supported for formatting." className="mt-1 text-base" />
              </div>

              <div>
                <Label htmlFor="techStack" className="text-base">Tech Stack (Comma-separated, Optional)</Label>
                <Input id="techStack" {...form.register('techStack')} placeholder="E.g., React, Node.js, Python, Figma" className="mt-1 h-11 text-base"/>
              </div>

              <div>
                <Label htmlFor="tags" className="text-base">Tags (Comma-separated, Optional)</Label>
                <Input id="tags" {...form.register('tags')} placeholder="E.g., full-stack, ui-design, machine-learning, game-dev" className="mt-1 h-11 text-base"/>
              </div>
            </CardContent>
             <CardFooter className="flex justify-between pt-4">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>Back to Project Info</Button>
                <Button type="button" size="lg" onClick={() => form.trigger().then(isValid => { if(isValid) setStep(3); else toast({title: "Validation Error", description: "Please check for errors in the form.", variant: "destructive"}) })}>Next: Confirm & Submit</Button>
             </CardFooter>
          </Card>
        )}

        {step === 3 && (
            <Card className="shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5 animate-fade-in-up border-2 border-primary/30" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3"><CheckCircle className="text-green-500 w-8 h-8"/>Confirm & Submit Project</CardTitle>
                    <CardDescription>Review your project details before finalizing. This will upload your image and save the project to Firestore.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-base">
                    <h3 className="font-semibold text-xl text-primary">Summary:</h3>
                    <div className="p-4 border rounded-lg bg-card/70 space-y-2 shadow-sm">
                        <p><strong>Title:</strong> {form.getValues('title')}</p>
                        <p><strong>Category:</strong> {form.getValues('category')}</p>
                        {imagePreview &&
                            <div className='my-3'>
                                <p className="font-medium mb-1"><strong>Preview Image:</strong></p>
                                <Image
                                  src={imagePreview}
                                  alt="Project preview"
                                  width={240}
                                  height={180}
                                  className="rounded-lg shadow-md object-contain max-h-48 border"
                                />
                            </div>
                        }
                        {form.getValues('projectUrl') && <p><strong>Project URL:</strong> <Link href={form.getValues('projectUrl')!} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{form.getValues('projectUrl')}</Link></p>}
                        {form.getValues('techStack') && <p><strong>Tech Stack:</strong> {form.getValues('techStack')}</p>}
                        {form.getValues('tags') && <p><strong>Tags:</strong> {form.getValues('tags')}</p>}
                        {form.getValues('description') && <p className="mt-2"><strong>Description:</strong><br/><span className="text-muted-foreground whitespace-pre-line line-clamp-4">{form.getValues('description')}</span></p>}
                        <p className="pt-2"><strong>Creator:</strong> {user?.displayName || user?.email}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                    <Button type="button" variant="outline" size="lg" onClick={() => setStep(2)} disabled={isSubmitting}>Edit Details</Button>
                    <Button type="submit" size="lg" className="pulse-gentle" disabled={isSubmitting || !form.formState.isValid}>
                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UploadCloud className="mr-2 h-5 w-5" /> }
                        {isSubmitting ? 'Submitting...' : 'Submit Project to Showcase'}
                    </Button>
                </CardFooter>
            </Card>
        )}
      </form>
    </div>
  );
}
