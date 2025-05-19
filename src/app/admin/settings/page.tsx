
// src/app/admin/settings/page.tsx
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import type { Creator as CreatorType, Project as ProjectType, SiteSettings, Category } from '@/types';
import { Settings, UserCog, Edit3, Save, ListChecks, Globe, LogOut, KeyRound, Server, AlertTriangle, Info, XCircle, UserPlus, Trash2, ShieldCheck, Loader2, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, addDoc, getDocs, updateDoc, deleteDoc, writeBatch, query, where, serverTimestamp } from 'firebase/firestore';
import { MOCK_CREATORS, MOCK_PROJECTS, MOCK_SITE_SETTINGS, CATEGORIES } from '@/lib/constants';
import Link from 'next/link';

const ADMIN_UID = "Jiz18K1A6xewOuEnSGPb1ybZkUF3"; 

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [siteTitle, setSiteTitle] = useState(MOCK_SITE_SETTINGS.siteTitle);
  const [navHomeLink, setNavHomeLink] = useState(MOCK_SITE_SETTINGS.navHomeLink);
  const [navHomeHref, setNavHomeHref] = useState(MOCK_SITE_SETTINGS.navHomeHref);
  const [aboutPageContent, setAboutPageContent] = useState(MOCK_SITE_SETTINGS.aboutPageContent);
  
  const [creators, setCreators] = useState<CreatorType[]>(MOCK_CREATORS);
  const [projects, setProjects] = useState<ProjectType[]>(MOCK_PROJECTS);

  const [creatorForm, setCreatorForm] = useState<Partial<CreatorType>>({
    name: '', photoUrl: '', bio: '', githubUsername: '',
    linkedInProfile: '', personalWebsite: '', location: '',
  });
  const [isEditingCreator, setIsEditingCreator] = useState(false);
  const [editingCreatorId, setEditingCreatorId] = useState<string | null>(null);

  useEffect(() => {
    setIsLoadingAuth(true);
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        if (user) {
          if (user.uid === ADMIN_UID) {
            setIsAdmin(true);
            fetchAdminData(user);
          } else {
            setIsAdmin(false);
            toast({ title: 'Access Denied', description: 'This account is not authorized for admin access.', variant: 'destructive' });
          }
        } else {
          setIsAdmin(false);
          // Reset to mock values if user logs out or is not admin
          setSiteTitle(MOCK_SITE_SETTINGS.siteTitle);
          setNavHomeLink(MOCK_SITE_SETTINGS.navHomeLink);
          setNavHomeHref(MOCK_SITE_SETTINGS.navHomeHref);
          setAboutPageContent(MOCK_SITE_SETTINGS.aboutPageContent);
          setCreators(MOCK_CREATORS);
          setProjects(MOCK_PROJECTS);
          clearCreatorForm();
          setIsEditingCreator(false);
          setEditingCreatorId(null);
        }
        setIsLoadingAuth(false);
      });
      return () => unsubscribe();
    } else {
      console.error("Firebase Auth is not initialized properly. Admin page cannot function.");
      toast({
        title: "Authentication Service Error",
        description: "Firebase Authentication is not available. Please check your Firebase configuration and ensure environment variables are set correctly in your deployment.",
        variant: "destructive",
        duration: 10000, // Keep it longer
      });
      setIsLoadingAuth(false);
      // Keep isAdmin false, currentUser null. The page will render the "Not Logged In" state.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth || typeof auth.signInWithEmailAndPassword !== 'function') {
       toast({ title: 'Login Failed', description: 'Authentication service is not available.', variant: 'destructive' });
       return;
    }
    setIsLoadingAuth(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login Successful', description: 'Welcome, Admin!' });
      // onAuthStateChanged will handle fetching data and setting isAdmin
    } catch (error: any) {
      toast({ title: 'Login Failed', description: error.message || 'Invalid credentials or service error.', variant: 'destructive' });
      setIsAdmin(false); 
      setIsLoadingAuth(false);
    }
  };

  const fetchAdminData = async (loggedInUser: User) => {
    if (!loggedInUser || loggedInUser.uid !== ADMIN_UID) {
      toast({ title: 'Authentication Issue', description: 'Cannot fetch data, not authorized.', variant: 'destructive' });
      setSiteTitle(MOCK_SITE_SETTINGS.siteTitle);
      setNavHomeLink(MOCK_SITE_SETTINGS.navHomeLink);
      setNavHomeHref(MOCK_SITE_SETTINGS.navHomeHref);
      setAboutPageContent(MOCK_SITE_SETTINGS.aboutPageContent);
      setCreators(MOCK_CREATORS);
      setProjects(MOCK_PROJECTS);
      return;
    }

    let siteSettingsLoaded = false;
    let creatorsLoadedFromFirestore = false;
    let projectsLoadedFromFirestore = false;
    
    try {
      // Fetch Site Settings
      const settingsDocRef = doc(db, 'settings', 'siteConfig');
      const settingsDocSnap = await getDoc(settingsDocRef);
      if (settingsDocSnap.exists()) {
        const data = settingsDocSnap.data() as SiteSettings;
        setSiteTitle(data.siteTitle || MOCK_SITE_SETTINGS.siteTitle);
        setNavHomeLink(data.navHomeLink || MOCK_SITE_SETTINGS.navHomeLink);
        setNavHomeHref(data.navHomeHref || MOCK_SITE_SETTINGS.navHomeHref);
        setAboutPageContent(data.aboutPageContent || MOCK_SITE_SETTINGS.aboutPageContent);
        siteSettingsLoaded = true;
      } else {
         setSiteTitle(MOCK_SITE_SETTINGS.siteTitle);
         setNavHomeLink(MOCK_SITE_SETTINGS.navHomeLink);
         setNavHomeHref(MOCK_SITE_SETTINGS.navHomeHref);
         setAboutPageContent(MOCK_SITE_SETTINGS.aboutPageContent);
      }

      // Fetch Creators
      const creatorsSnapshot = await getDocs(collection(db, 'creators'));
      const firestoreCreators = creatorsSnapshot.docs.map(cDoc => ({ 
          id: cDoc.id, 
          name: cDoc.data().name || "Unnamed Creator",
          photoUrl: cDoc.data().photoUrl || `https://placehold.co/200x200.png?text=User`,
          dataAiHint: cDoc.data().dataAiHint || (cDoc.data().name ? cDoc.data().name.toLowerCase().split(' ').slice(0,2).join(' ') : "creator photo"),
          bio: cDoc.data().bio || "No bio provided.",
          location: cDoc.data().location || "Location not set.",
          githubUsername: cDoc.data().githubUsername || "",
          linkedInProfile: cDoc.data().linkedInProfile || "",
          personalWebsite: cDoc.data().personalWebsite || "",
          statement: cDoc.data().statement || "",
        } as CreatorType));
      if (firestoreCreators.length > 0) {
        setCreators(firestoreCreators);
        creatorsLoadedFromFirestore = true;
      } else {
         setCreators(MOCK_CREATORS); 
         if(MOCK_CREATORS.length === 0) {
            toast({ title: 'No Creators', description: 'No creators found in Firestore, and local mock data is empty.', duration: 4000 });
         }
      }

      // Fetch Projects
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const firestoreProjects = projectsSnapshot.docs.map(pDoc => {
        const data = pDoc.data();
        return { 
            id: pDoc.id, 
            title: data.title || "Untitled Project",
            description: data.description || "No description provided.",
            tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
            previewImageUrl: data.previewImageUrl || `https://placehold.co/300x200.png?text=No+Preview`,
            dataAiHint: data.dataAiHint || (data.title ? data.title.toLowerCase().split(' ').slice(0,2).join(' ') : "project preview"),
            category: (CATEGORIES.includes(data.category) ? data.category : 'Web App') as Category,
            creatorId: data.creatorId || "unknown_creator",
            creatorName: data.creatorName || "Unknown Creator",
            uploadDate: data.uploadDate || new Date().toISOString(),
            isFeatured: data.isFeatured || false,
            projectUrl: data.projectUrl || "",
            techStack: Array.isArray(data.techStack) ? data.techStack.filter(Boolean) : [],
            likeCount: typeof data.likeCount === 'number' ? data.likeCount : 0,
            createdAt: data.createdAt || null,
        } as ProjectType;
      });
      if (firestoreProjects.length > 0) {
        setProjects(firestoreProjects); 
        projectsLoadedFromFirestore = true;
      } else {
        setProjects(MOCK_PROJECTS); 
        if(MOCK_PROJECTS.length === 0) {
            toast({ title: 'No Projects', description: 'No projects found in Firestore, and local mock data is empty.', duration: 4000 });
         }
      }

      let statusMessages = [];
      statusMessages.push(siteSettingsLoaded ? "Site settings loaded from Firestore." : "Using default site settings; save to create in Firestore.");
      statusMessages.push(creatorsLoadedFromFirestore ? "Creators loaded from Firestore." : (MOCK_CREATORS.length > 0 ? "Using local mock creators (Firestore empty or no data)." : "No creators in Firestore or local mocks."));
      statusMessages.push(projectsLoadedFromFirestore ? "Projects loaded from Firestore." : (MOCK_PROJECTS.length > 0 ? "Using local mock projects (Firestore empty or no data)." : "No projects in Firestore or local mocks."));
      
      toast({ title: 'Admin Data Status', description: statusMessages.join(' '), duration: 7000 });

    } catch (error: any) {
      console.error("Error fetching admin data from Firestore: ", error);
      toast({ title: 'Firestore Error', description: `Could not load live data: ${error.message}. Displaying local mock data.`, variant: 'destructive' });
      setSiteTitle(MOCK_SITE_SETTINGS.siteTitle);
      setNavHomeLink(MOCK_SITE_SETTINGS.navHomeLink);
      setNavHomeHref(MOCK_SITE_SETTINGS.navHomeHref);
      setAboutPageContent(MOCK_SITE_SETTINGS.aboutPageContent);
      setCreators(MOCK_CREATORS);
      setProjects(MOCK_PROJECTS);
    }
  };
  
  const handleLogout = async () => {
    if (!auth || typeof auth.signOut !== 'function') {
       toast({ title: 'Logout Failed', description: 'Authentication service is not available.', variant: 'destructive' });
       return;
    }
    setIsLoadingAuth(true);
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      // onAuthStateChanged will reset isAdmin and other states
    } catch (error: any) {      
      toast({ title: 'Logout Failed', description: error.message, variant: 'destructive' });
    } finally {
        setIsLoadingAuth(false); 
    }
  };

  const handleSaveChanges = async () => {
    if (!currentUser || !isAdmin) {
      toast({ title: 'Not Authenticated or Authorized', description: 'Please login as admin to save changes.', variant: 'destructive' });
      return;
    }
    const settingsPayload: SiteSettings = {
      siteTitle,
      navHomeLink,
      navHomeHref,
      aboutPageContent,
    };
    try {
      await setDoc(doc(db, 'settings', 'siteConfig'), settingsPayload, { merge: true });
      toast({ title: 'Success!', description: 'Site settings saved to Firestore.', icon: <Server className="h-5 w-5" /> });
    } catch (error) {
      console.error("Error saving site settings: ", error);
      toast({ title: 'Error Saving Settings', description: 'Could not save site settings to Firestore.', variant: 'destructive' });
    }
  };

  const handleCreatorFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCreatorForm(prev => ({ ...prev, [id]: value }));
  };

  const clearCreatorForm = () => {
    setCreatorForm({
        name: '', photoUrl: '', bio: '', githubUsername: '',
        linkedInProfile: '', personalWebsite: '', location: '',
    });
  };

  const handleUpdateCreator = async () => {
     if (!currentUser || !isAdmin) {
      toast({ title: 'Not Authenticated or Authorized', description: 'Please login as admin.', variant: 'destructive' });
      return;
    }
    if (!isEditingCreator || !editingCreatorId) {
      toast({ title: 'Error', description: 'No creator selected for editing.', variant: 'destructive' });
      return;
    }
    
    const creatorDataToUpdate: Partial<CreatorType> = { 
      name: creatorForm.name || undefined, 
      photoUrl: creatorForm.photoUrl || undefined, 
      dataAiHint: creatorForm.name ? (creatorForm.name.toLowerCase().split(' ').slice(0,2).join(' ') || "creator photo") : undefined,
      bio: creatorForm.bio || undefined,
      githubUsername: creatorForm.githubUsername || undefined,
      linkedInProfile: creatorForm.linkedInProfile || undefined,
      personalWebsite: creatorForm.personalWebsite || undefined,
      location: creatorForm.location || undefined, 
    };

    // Remove undefined fields to avoid overwriting existing data with undefined
    Object.keys(creatorDataToUpdate).forEach(key => creatorDataToUpdate[key as keyof CreatorType] === undefined && delete creatorDataToUpdate[key as keyof CreatorType]);


    if (!creatorDataToUpdate.name && !creators.find(c => c.id === editingCreatorId)?.name) {
      toast({ title: 'Validation Error', description: 'Creator name is required.', variant: 'destructive' });
      return;
    }

    try {
      const creatorDocRef = doc(db, 'creators', editingCreatorId);
      await updateDoc(creatorDocRef, creatorDataToUpdate);
      toast({ title: 'Creator Updated!', description: `${creatorForm.name || 'Creator'} updated in Firestore. Refreshing list...`, icon: <Edit3 className="h-5 w-5" /> });
      
      clearCreatorForm();
      setIsEditingCreator(false);
      setEditingCreatorId(null);
      if (currentUser) await fetchAdminData(currentUser); 
    } catch (error) {
      console.error("Error updating creator: ", error);
      toast({ title: 'Error Updating Creator', description: 'Could not update creator in Firestore.', variant: 'destructive' });
    }
  };

  const handleEditCreator = (creatorIdToEdit: string) => {
    const creatorToEdit = creators.find(c => c.id === creatorIdToEdit);
    if (creatorToEdit) {
      setCreatorForm({
        name: creatorToEdit.name,
        photoUrl: creatorToEdit.photoUrl,
        bio: creatorToEdit.bio,
        githubUsername: creatorToEdit.githubUsername || '',
        linkedInProfile: creatorToEdit.linkedInProfile || '',
        personalWebsite: creatorToEdit.personalWebsite || '',
        location: creatorToEdit.location || '',
      });
      setIsEditingCreator(true);
      setEditingCreatorId(creatorIdToEdit);
      toast({ title: 'Editing Creator', description: `Editing ${creatorToEdit.name}. Form populated below.`});
    } else {
      toast({ title: 'Error', description: `Creator with ID ${creatorIdToEdit} not found. List may be out of sync.`, variant: 'destructive'});
    }
  };
  
  const handleCancelEditCreator = () => {
    clearCreatorForm();
    setIsEditingCreator(false);
    setEditingCreatorId(null);
    toast({ title: 'Edit Cancelled', description: 'Creator form has been reset.' });
  };

  const handleDeleteCreator = async (creatorId: string, creatorName: string) => {
    if (!currentUser || !isAdmin) {
      toast({ title: 'Not Authenticated or Authorized', description: 'Please login as admin.', variant: 'destructive' });
      return;
    }
    if (!window.confirm(`Are you sure you want to delete creator "${creatorName}" and all their projects? This cannot be undone.`)) {
      return;
    }

    try {
      const batch = writeBatch(db);
      const creatorDocRef = doc(db, "creators", creatorId);
      batch.delete(creatorDocRef);
      
      const projectsQuery = query(collection(db, "projects"), where("creatorId", "==", creatorId));
      const projectsSnapshot = await getDocs(projectsQuery);
      projectsSnapshot.forEach((projectDoc) => {
        batch.delete(projectDoc.ref);
      });
      
      await batch.commit();
      toast({ title: 'Creator Deleted', description: `${creatorName} and their projects have been removed from Firestore. Refreshing list...` });
      if (currentUser) await fetchAdminData(currentUser); 
    } catch (error) {
      console.error("Error deleting creator and their projects: ", error);
      toast({ title: 'Error Deleting Creator', description: 'Could not delete creator and projects from Firestore.', variant: 'destructive' });
    }
  };

  const handleEditProject = (projectId: string) => {
    const projectToEdit = projects.find(p => p.id === projectId);
    toast({
      title: 'Edit Project (Placeholder)',
      description: `Editing '${projectToEdit?.title || 'project'}' would require a dedicated form/modal. This functionality is not fully implemented. Manage projects via deletion or re-uploading.`,
      duration: 7000,
      icon: <Edit3 className="h-5 w-5" />
    });
  };

   const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (!currentUser || !isAdmin) {
      toast({ title: 'Not Authenticated or Authorized', description: 'Please login as admin.', variant: 'destructive' });
      return;
    }
    if (!window.confirm(`Are you sure you want to delete project "${projectTitle}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, "projects", projectId));
      toast({ title: 'Project Deleted', description: `"${projectTitle}" has been removed from Firestore. Refreshing list...` });
      if (currentUser) await fetchAdminData(currentUser); 
    } catch (error: any) {
      console.error("Error deleting project: ", error);
      toast({ title: 'Error Deleting Project', description: 'Could not delete project from Firestore.', variant: 'destructive' });
    }
  };

  if (isLoadingAuth && !currentUser) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="mx-auto h-12 w-12 text-primary mb-3 animate-spin" />
        <p>Authenticating Admin Access...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in-up">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <KeyRound className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Please login with your admin credentials via the site's main login page.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             <Button asChild className="w-full">
                <Link href={`/login?redirect=/admin/settings`}>Go to Login Page</Link>
             </Button>
          </CardContent>
          <CardFooter>
             <p className="text-xs text-muted-foreground text-center w-full">
                Admin access is restricted. Only designated admin UIDs can manage settings.
             </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in-up">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-destructive mb-3" />
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page. This area is for administrators only.</CardDescription>
          </CardHeader>
           <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Logged in as: {currentUser.email}. This account is not authorized for admin access.
            </p>
            <p className="text-xs text-muted-foreground mt-1">Required Admin UID: {ADMIN_UID.substring(0,10)}...</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut className="mr-2"/> Logout and Try Different Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if(ADMIN_UID === "YOUR_ADMIN_FIREBASE_UID_HERE" && isAdmin) {
    return (
         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in-up">
            <Card className="w-full max-w-lg shadow-2xl text-center">
                 <CardHeader>
                    <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-3" />
                    <CardTitle className="text-2xl">Admin Configuration Needed</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-lg text-foreground/80">
                        Please update the <code className="bg-muted px-1 py-0.5 rounded text-sm">ADMIN_UID</code> constant in <code className="bg-muted px-1 py-0.5 rounded text-sm">src/app/admin/settings/page.tsx</code> with your Firebase User ID to fully enable admin functionalities.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">Your current Admin UID (visible in Firebase Console &gt; Authentication): {currentUser.uid}</p>
                 </CardContent>
                 <CardFooter>
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                        <LogOut className="mr-2"/> Logout
                    </Button>
                 </CardFooter>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="text-center animate-fade-in-up">
        <Settings className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-4xl font-bold text-primary mb-2">Admin Control Panel</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Manage your DevPortfolio Hub content. Changes are saved to Firebase.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
            Admin: {currentUser.email} (UID: {currentUser.uid.substring(0,10)}...)
        </p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>
      
      <div className="flex items-start justify-center gap-3 p-4 mb-6 bg-accent/10 border-2 border-accent text-accent-foreground rounded-lg shadow-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <AlertTriangle className="h-8 w-8 md:h-6 md:w-6 text-accent flex-shrink-0 mt-1" />
        <p className="text-sm font-medium">
          Important: Ensure your Firestore Security Rules are properly configured for production to protect your data. Only the admin UID ({ADMIN_UID.substring(0,10)+'...'}) should have write access to these settings and management collections.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={['site-config', 'creator-management']} className="w-full space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        <AccordionItem value="site-config">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline text-left">
                <div className="flex items-center gap-3">
                    <Globe className="w-7 h-7 text-accent" />
                    <h3 className="text-2xl font-semibold text-foreground">Site Configuration</h3>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="siteTitle">Site Title</Label>
                  <Input id="siteTitle" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="navHomeLink">Navbar "Home" Link Text</Label>
                  <Input id="navHomeLink" value={navHomeLink} onChange={(e) => setNavHomeLink(e.target.value)} />
                </div>
                 <div>
                  <Label htmlFor="navHomeHref">Navbar "Home" Link Href</Label>
                  <Input id="navHomeHref" value={navHomeHref} onChange={(e) => setNavHomeHref(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="aboutPageContent">"About Us" Page - Main Content</Label>
                  <Textarea id="aboutPageContent" value={aboutPageContent} onChange={(e) => setAboutPageContent(e.target.value)} rows={8} />
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="creator-management">
          <Card className="shadow-lg">
             <AccordionTrigger className="p-6 hover:no-underline text-left">
              <div className="flex items-center gap-3">
                <UserCog className="w-7 h-7 text-accent" />
                <h3 className="text-2xl font-semibold text-foreground">Creator Management</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="space-y-6">
                {isEditingCreator && editingCreatorId ? (
                  <Card className="border-primary border-2">
                    <CardHeader>
                      <CardTitle className="text-xl">Edit Creator: {creatorForm.name || 'Selected Creator'}</CardTitle>
                      <CardDescription>Modify the details for this creator. Creators are automatically added upon site sign-up.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="name">Creator Name</Label>
                        <Input id="name" value={creatorForm.name || ''} onChange={handleCreatorFormChange} placeholder="e.g., Ada Lovelace" />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={creatorForm.location || ''} onChange={handleCreatorFormChange} placeholder="e.g., London, UK" />
                      </div>
                      <div>
                        <Label htmlFor="photoUrl">Photo URL Path</Label>
                        <Input id="photoUrl" value={creatorForm.photoUrl || ''} onChange={handleCreatorFormChange} placeholder="e.g., /img/creator-new.png or https://..." />
                        <p className="text-xs text-muted-foreground mt-1">If blank, a placeholder image will be used. Direct image uploads require Firebase Storage setup.</p>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" value={creatorForm.bio || ''} onChange={handleCreatorFormChange} placeholder="Brief bio..." />
                      </div>
                      <div>
                        <Label htmlFor="githubUsername">GitHub Username</Label>
                        <Input id="githubUsername" value={creatorForm.githubUsername || ''} onChange={handleCreatorFormChange} placeholder="e.g., ada-dev" />
                      </div>
                      <div>
                        <Label htmlFor="linkedInProfile">LinkedIn Profile URL</Label>
                        <Input id="linkedInProfile" value={creatorForm.linkedInProfile || ''} onChange={handleCreatorFormChange} placeholder="https://linkedin.com/in/ada-dev" />
                      </div>
                      <div>
                        <Label htmlFor="personalWebsite">Personal Website URL</Label>
                        <Input id="personalWebsite" value={creatorForm.personalWebsite || ''} onChange={handleCreatorFormChange} placeholder="https://ada.dev" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button onClick={handleUpdateCreator}>
                        <Edit3 className="mr-2 h-4 w-4"/> Update Creator Details
                      </Button>
                      <Button variant="outline" onClick={handleCancelEditCreator}>
                        <XCircle className="mr-2 h-4 w-4"/> Cancel Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-6 text-center">
                       <Info className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        Select a creator from the list below to edit their details. New creators are added automatically when they sign up on the site.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Creators ({creators.length}):</h3>
                  {creators.length > 0 ? (
                    <ul className="space-y-2 max-h-96 overflow-y-auto p-1 border rounded-md bg-background">
                        {creators.map(creator => (
                        <li key={creator.id} className="flex justify-between items-center p-3 border rounded-md bg-card hover:bg-accent/5 transition-shadow">
                            <div>
                                <span className="font-medium text-primary">{creator.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">(ID: {creator.id.substring(0,6)}...)</span>
                                <p className="text-sm text-muted-foreground">{creator.location || 'No location set'}</p>
                            </div>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditCreator(creator.id)}>
                                  <Edit3 className="mr-1 h-4 w-4"/>Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteCreator(creator.id, creator.name)}>
                                  <Trash2 className="mr-1 h-4 w-4"/>Delete
                              </Button>
                            </div>
                        </li>
                        ))}
                    </ul>
                  ) : (
                     <p className="text-muted-foreground p-4 text-center bg-muted/50 rounded-md">
                        No creators found in Firestore. Users can sign up to create their profiles.
                        {(MOCK_CREATORS.length === 0) && " Also, no local mock creators available."}
                     </p>
                  )}
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="project-management">
           <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline text-left">
              <div className="flex items-center gap-3">
                <ListChecks className="w-7 h-7 text-accent" />
                <h3 className="text-2xl font-semibold text-foreground">Project Management</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
                <div className="flex items-start gap-3 p-4 mb-4 bg-primary/10 border-2 border-primary/30 rounded-lg text-sm text-primary-foreground shadow"> 
                  <Info className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <p>Projects are added via the "Share Project" page by logged-in users. Below you can view and delete projects. Full project editing is a placeholder and would typically involve a dedicated editing form.</p>
                </div>
                {projects.length > 0 ? (
                    <ul className="space-y-3 max-h-96 overflow-y-auto p-1 border rounded-md bg-background">
                        {projects.map(project => ( 
                        <li key={project.id} className="p-3 border rounded-md bg-card space-y-1 hover:bg-accent/5 transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-primary">{project.title} <span className="text-xs text-muted-foreground">(ID: {project.id.substring(0,6)}...)</span></p>
                                    <p className="text-sm text-muted-foreground">By {project.creatorName} (CreatorID: {project.creatorId.substring(0,6)}...)</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Heart className="h-3 w-3 text-destructive/80"/> {project.likeCount.toLocaleString()} likes</p>
                                </div>
                                <div className="space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleEditProject(project.id)}>
                                      <Edit3 className="mr-1 h-4 w-4"/>Edit (Placeholder)
                                  </Button>
                                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id, project.title)}>
                                      <Trash2 className="mr-1 h-4 w-4"/>Delete
                                  </Button>
                                </div>
                            </div>
                            {project.projectUrl && <p className="text-xs text-muted-foreground truncate">URL: <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{project.projectUrl}</a></p>}
                            {project.techStack && project.techStack.length > 0 && <p className="text-xs text-muted-foreground truncate">Tech: {project.techStack.join(', ')}</p>}
                        </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground p-4 text-center bg-muted/50 rounded-md">
                        No projects found in Firestore. Users can add projects via the "Share Project" page.
                        {(MOCK_PROJECTS.length === 0) && " Also, no local mock projects available."}
                    </p>
                  )}
            </AccordionContent>
          </Card>
        </AccordionItem>

      </Accordion>

      <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="space-x-4">
          <Button size="lg" onClick={handleSaveChanges} className="pulse-gentle">
            <Save className="mr-2"/> Save Site Settings to Firestore
          </Button>
          <Button size="lg" variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2"/> Logout
          </Button>
        </div>
         <p className="text-sm text-muted-foreground mt-3">Logged in as: {currentUser.email}</p>
      </div>
    </div>
  );
}
