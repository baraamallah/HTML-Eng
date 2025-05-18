
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ProjectCard } from '@/components/project-card';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import type { Project } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, LayoutGrid, Edit3, Trash2, Info } from 'lucide-react';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';

export default function MyProjectsPage() {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/login?redirect=/dashboard/my-projects');
    } else if (user) {
      fetchUserProjects(user.uid);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loadingAuth, router]);

  const fetchUserProjects = async (uid: string) => {
    setIsLoadingProjects(true);
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where('creatorId', '==', uid), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(userProjects);
    } catch (error: any) {
      console.error("Error fetching user projects: ", error);
      toast({ title: 'Error', description: `Could not fetch your projects: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (!user) {
      toast({ title: 'Not Authenticated', description: 'Please login.', variant: 'destructive' });
      return;
    }
    if (!window.confirm(`Are you sure you want to delete project "${projectTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, "projects", projectId));
      toast({ title: 'Project Deleted', description: `"${projectTitle}" has been removed from Firestore.` });
      fetchUserProjects(user.uid); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting project: ", error);
      toast({ title: 'Error Deleting Project', description: `Could not delete project: ${error.message}`, variant: 'destructive' });
    }
  };

  const handleEditProject = (projectId: string) => {
    // For now, this is a placeholder. In a full app, you'd navigate to an edit page:
    // router.push(`/dashboard/edit-project/${projectId}`);
    toast({
      title: 'Edit Project (Prototype)',
      description: `Editing project ID: ${projectId}. Full editing UI is a future enhancement.`,
      duration: 5000,
      icon: <Edit3 className="h-5 w-5" />
    });
  };

  // Dummy onLike function for ProjectCard prop on this page
  const handleLikeProject = (projectId: string) => {
    toast({
      title: "Like Action (My Projects)",
      description: `Project ${projectId} like action triggered. (UI only on this page)`,
      duration: 3000,
    });
    // In a real app, this might not be a feature here, or would update state differently
    // For consistency with ProjectCard, we provide a handler.
    setProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === projectId ? { ...p, likeCount: (p.likeCount || 0) + 1 } : p
      )
    );
  };
  
  // Dummy onViewDetails function if ProjectCard expects it but it's not used here
  // Or implement modal if needed on this page too
  const handleViewProjectDetails = (project: Project) => {
    // For this page, we might redirect or show a different kind of detail view
    // For now, let's just log or show a simple toast
    toast({
      title: "View Details (My Projects)",
      description: `Viewing details for ${project.title}. (Not fully implemented on this page)`,
      duration: 3000,
    });
    // router.push(`/gallery?project=${project.id}`); // Option: redirect to gallery detail view
  };


  if (loadingAuth || isLoadingProjects && user) { // Show loading if auth is loading OR if projects are loading AND user is determined
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="mx-auto h-12 w-12 text-primary mb-3 animate-spin" />
        <p>{loadingAuth ? "Loading Authentication..." : "Loading Your Projects..."}</p>
      </div>
    );
  }

  if (!user) {
    // This state should be brief due to the useEffect redirect
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <p className="text-lg text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <header className="text-center animate-fade-in-up">
        <LayoutGrid className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-4xl font-bold text-primary mb-2">My Projects</h1>
        <p className="text-lg text-foreground/80">Manage your shared projects on DevPortfolio Hub.</p>
        <p className="text-sm text-muted-foreground mt-1">Logged in as: {user.displayName || user.email}</p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      {projects.length === 0 && !isLoadingProjects && (
        <Card className="text-center p-8 bg-muted/50 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">No Projects Yet!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground/80 mb-6">
              You haven't shared any projects. Let's change that!
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button size="lg" asChild className="pulse-gentle">
              <Link href="/upload"><PlusCircle className="mr-2" /> Share Your First Project</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          {projects.map((project, index) => (
            <div key={project.id} className="flex flex-col">
              <ProjectCard
                project={project}
                animationDelay={`${0.4 + index * 0.05}s`}
                onLike={handleLikeProject} // Pass the handler here
                onViewDetails={handleViewProjectDetails} // Pass a handler for onViewDetails as well
              />
              <div className="mt-2 flex gap-2 p-2 border border-t-0 rounded-b-md bg-card">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditProject(project.id)}>
                  <Edit3 className="mr-1 h-4 w-4"/>Edit
                </Button>
                <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDeleteProject(project.id, project.title)}>
                  <Trash2 className="mr-1 h-4 w-4"/>Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
       <div className="flex items-start gap-2 p-3 mt-8 bg-blue-50 border border-blue-300 rounded-md text-sm text-blue-700 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Note on Image Uploads:</strong> Project preview images are uploaded directly. Ensure your Firebase Storage rules are set up to allow writes to the 'project-previews/' path for authenticated users.
          </p>
      </div>
    </div>
  );
}
