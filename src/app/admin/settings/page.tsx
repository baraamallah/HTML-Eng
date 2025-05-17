
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
import type { Creator as CreatorType, Project as ProjectType, SiteSettings } from '@/types';
import { Settings, UserCog, Edit3, Save, ListChecks, Globe, LogOut, KeyRound, Server, AlertTriangle, Info, XCircle, UserPlus, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, addDoc, getDocs, updateDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';
import { MOCK_CREATORS, MOCK_PROJECTS, MOCK_SITE_SETTINGS } from '@/lib/constants';
import Link from 'next/link';

// !!! IMPORTANT: This is the Admin Firebase User ID !!!
const ADMIN_UID = "Jiz18K1A6xewOuEnSGPb1ybZkUF3"; 

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [siteTitle, setSiteTitle] = useState(MOCK_SITE_SETTINGS.siteTitle);
  const [navHomeLink, setNavHomeLink] = useState(MOCK_SITE_SETTINGS.navHomeLink);
  const [navHomeHref, setNavHomeHref] = useState(MOCK_SITE_SETTINGS.navHomeHref);
  const [aboutPageContent, setAboutPageContent] = useState(MOCK_SITE_SETTINGS.aboutPageContent);
  
  const [creators, setCreators] = useState<CreatorType[]>(MOCK_CREATORS);
  const [projects, setProjects] = useState<ProjectType[]>(MOCK_PROJECTS.slice(0,10));

  const [creatorForm, setCreatorForm] = useState({
    name: '',
    photoUrl: '',
    bio: '',
    githubUsername: '',
    linkedInProfile: '',
    personalWebsite: '',
    location: '',
  });

  const [isEditingCreator, setIsEditingCreator] = useState(false);
  const [editingCreatorId, setEditingCreatorId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.uid === ADMIN_UID) {
          setIsAdmin(true);
          fetchAdminData(user);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
        // Reset to default/mock values if user logs out or is not admin
        setSiteTitle(MOCK_SITE_SETTINGS.siteTitle);
        setNavHomeLink(MOCK_SITE_SETTINGS.navHomeLink);
        setNavHomeHref(MOCK_SITE_SETTINGS.navHomeHref);
        setAboutPageContent(MOCK_SITE_SETTINGS.aboutPageContent);
        setCreators(MOCK_CREATORS);
        setProjects(MOCK_PROJECTS.slice(0,10));
        clearCreatorForm();
        setIsEditingCreator(false);
        setEditingCreatorId(null);
      }
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchAdminData = async (loggedInUser: User) => {
    if (!loggedInUser || loggedInUser.uid !== ADMIN_UID) {
      toast({ title: 'Authentication Issue', description: 'Cannot fetch data, not authorized.', variant: 'destructive' });
      setSiteTitle(MOCK_SITE_SETTINGS.siteTitle);
      setNavHomeLink(MOCK_SITE_SETTINGS.navHomeLink);
      setNavHomeHref(MOCK_SITE_SETTINGS.navHomeHref);
      setAboutPageContent(MOCK_SITE_SETTINGS.aboutPageContent);
      setCreators(MOCK_CREATORS);
      setProjects(MOCK_PROJECTS.slice(0,10));
      return;
    }

    toast({ title: 'Loading Admin Data...', description: 'Attempting to fetch from Firestore.' });
    let siteSettingsLoaded = false;
    let creatorsLoadedFromFirestore = false;
    let projectsLoadedFromFirestore = false;
    let fetchedCreatorsList: CreatorType[] = MOCK_CREATORS; // Initialize with mock as fallback
    let fetchedProjectsList: ProjectType[] = MOCK_PROJECTS.slice(0,10); // Initialize with mock

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
         toast({ title: 'Site Settings Info', description: 'No settings found in Firestore. Displaying local defaults. Save to create.', variant: 'default' });
         setSiteTitle(MOCK_SITE_SETTINGS.siteTitle);
         setNavHomeLink(MOCK_SITE_SETTINGS.navHomeLink);
         setNavHomeHref(MOCK_SITE_SETTINGS.navHomeHref);
         setAboutPageContent(MOCK_SITE_SETTINGS.aboutPageContent);
      }

      // Fetch Creators
      const creatorsSnapshot = await getDocs(collection(db, 'creators'));
      const firestoreCreators = creatorsSnapshot.docs.map(cDoc => ({ id: cDoc.id, ...cDoc.data() } as CreatorType));
      if (firestoreCreators.length > 0) {
        setCreators(firestoreCreators);
        fetchedCreatorsList = firestoreCreators;
        creatorsLoadedFromFirestore = true;
      } else {
         setCreators(MOCK_CREATORS); // Fallback to mock if Firestore is empty
         if (MOCK_CREATORS.length > 0) {
            toast({ title: 'Creators Info', description: 'No creators found in Firestore. Displaying local mock creators.', variant: 'default' });
         } else {
            toast({ title: 'Creators Info', description: 'No creators found in Firestore and no local mock creators available.', variant: 'default' });
         }
      }

      // Fetch Projects
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const firestoreProjects = projectsSnapshot.docs.map(pDoc => ({ id: pDoc.id, ...pDoc.data() } as ProjectType));
      if (firestoreProjects.length > 0) {
        setProjects(firestoreProjects.slice(0,10)); 
        fetchedProjectsList = firestoreProjects.slice(0,10);
        projectsLoadedFromFirestore = true;
      } else {
        setProjects(MOCK_PROJECTS.slice(0,10)); // Fallback to mock
        if (MOCK_PROJECTS.length > 0) {
          toast({ title: 'Projects Info', description: 'No projects found in Firestore. Displaying local mock projects.', variant: 'default' });
        } else {
          toast({ title: 'Projects Info', description: 'No projects found in Firestore and no local mock projects available.', variant: 'default' });
        }
      }

      let loadedItems: string[] = [];
      if (siteSettingsLoaded) loadedItems.push("site settings");
      if (creatorsLoadedFromFirestore) loadedItems.push("creators");
      if (projectsLoadedFromFirestore) loadedItems.push("projects");
      
      let fallbackItems: string[] = [];
      if (!creatorsLoadedFromFirestore && MOCK_CREATORS.length > 0) fallbackItems.push("creators");
      if (!projectsLoadedFromFirestore && MOCK_PROJECTS.length > 0) fallbackItems.push("projects");

      let description = `Data loaded.`;
      if (loadedItems.length > 0) {
        description += ` Fetched ${loadedItems.join(', ')} from Firestore.`;
      }
      if (fallbackItems.length > 0) {
        description += ` Using local mocks for ${fallbackItems.join(', ')}.`;
      }
      if (loadedItems.length === 0 && fallbackItems.length === 0 && !siteSettingsLoaded){
        description = 'Displaying default values as Firestore and local mocks are empty for some items.';
      }
       toast({ title: 'Admin Data Status', description: description.trim() });


    } catch (error: any) {
      console.error("Error fetching admin data from Firestore: ", error);
      toast({ title: 'Firestore Error', description: `Could not load data: ${error.message}. Displaying local mock data.`, variant: 'destructive' });
      setSiteTitle(MOCK_SITE_SETTINGS.siteTitle);
      setNavHomeLink(MOCK_SITE_SETTINGS.navHomeLink);
      setNavHomeHref(MOCK_SITE_SETTINGS.navHomeHref);
      setAboutPageContent(MOCK_SITE_SETTINGS.aboutPageContent);
      setCreators(MOCK_CREATORS);
      setProjects(MOCK_PROJECTS.slice(0,10));
    }
  };
  
  const handleLogout = async () => {
    setIsLoadingAuth(true);
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      // onAuthStateChanged will handle resetting state and isAdmin flag
    } catch (error: any) {      
      toast({ title: 'Logout Failed', description: error.message, variant: 'destructive' });
      setIsLoadingAuth(false); // Ensure loading state is reset on error
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
    
    const creatorData = { 
      name: creatorForm.name, 
      photoUrl: creatorForm.photoUrl || `https://placehold.co/200x200.png?text=${encodeURIComponent(creatorForm.name.split(' ')[0] || 'Creator')}`, 
      dataAiHint: 'creator photo',
      bio: creatorForm.bio,
      githubUsername: creatorForm.githubUsername,
      linkedInProfile: creatorForm.linkedInProfile,
      personalWebsite: creatorForm.personalWebsite,
      location: creatorForm.location, 
    };

    if (!creatorData.name) {
      toast({ title: 'Validation Error', description: 'Creator name is required.', variant: 'destructive' });
      return;
    }

    try {
      const creatorDocRef = doc(db, 'creators', editingCreatorId);
      await updateDoc(creatorDocRef, creatorData);
      toast({ title: 'Creator Updated!', description: `${creatorForm.name} updated in Firestore. Refreshing list...`, icon: <Edit3 className="h-5 w-5" /> });
      
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
      toast({ title: 'Error', description: `Creator with ID ${creatorIdToEdit} not found. List may be out of sync or creator doesn't exist.`, variant: 'destructive'});
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

  if (isLoadingAuth) {
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
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>Please log in with an admin account to manage site settings.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/login?redirect=/admin/settings">Go to Login</Link>
            </Button>
             <p className="text-xs text-muted-foreground mt-4">
              Ensure you are logged in with the Firebase user account designated as admin (UID: {ADMIN_UID === "YOUR_ADMIN_FIREBASE_UID_HERE" ? "Please set in code" : ADMIN_UID.substring(0,10)+'...'})
            </p>
          </CardContent>
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

  // Logged-in Admin View
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
            {ADMIN_UID === "YOUR_ADMIN_FIREBASE_UID_HERE" && <span className="text-destructive font-bold ml-2"> (Warning: Default ADMIN_UID is set in code!)</span>}
        </p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>
      
      <div className="flex items-start justify-center gap-3 p-4 mb-6 bg-yellow-100 border-2 border-yellow-400 text-yellow-700 rounded-lg shadow-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <AlertTriangle className="h-8 w-8 md:h-6 md:w-6 text-yellow-600 flex-shrink-0 mt-1" />
        <p className="text-sm font-medium">
          Important: Ensure your Firestore Security Rules are properly configured for production to protect your data. Only the admin UID ({ADMIN_UID === "YOUR_ADMIN_FIREBASE_UID_HERE" ? "Not Set!" : ADMIN_UID.substring(0,10)+'...'}) should have write access to these settings.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={['site-config', 'creator-management']} className="w-full space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        <AccordionItem value="site-config">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline">
                <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-accent" />
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
             <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <UserCog className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-semibold text-foreground">Creator Management</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="space-y-6">
                {isEditingCreator && editingCreatorId ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Edit Creator Details</CardTitle>
                      <CardDescription>Modify the details for {creatorForm.name || 'the selected creator'}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="name">Creator Name</Label>
                        <Input id="name" value={creatorForm.name} onChange={handleCreatorFormChange} placeholder="e.g., Ada Lovelace" />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={creatorForm.location} onChange={handleCreatorFormChange} placeholder="e.g., London, UK" />
                      </div>
                      <div>
                        <Label htmlFor="photoUrl">Photo URL Path (Optional)</Label>
                        <Input id="photoUrl" value={creatorForm.photoUrl} onChange={handleCreatorFormChange} placeholder="e.g., /img/creator-new.png or https://..." />
                        <p className="text-xs text-muted-foreground mt-1">If blank, a placeholder image will be used. Actual image uploads require Firebase Storage setup.</p>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" value={creatorForm.bio} onChange={handleCreatorFormChange} placeholder="Brief bio..." />
                      </div>
                      <div>
                        <Label htmlFor="githubUsername">GitHub Username</Label>
                        <Input id="githubUsername" value={creatorForm.githubUsername} onChange={handleCreatorFormChange} placeholder="e.g., ada-dev" />
                      </div>
                      <div>
                        <Label htmlFor="linkedInProfile">LinkedIn Profile URL</Label>
                        <Input id="linkedInProfile" value={creatorForm.linkedInProfile} onChange={handleCreatorFormChange} placeholder="https://linkedin.com/in/ada-dev" />
                      </div>
                      <div>
                        <Label htmlFor="personalWebsite">Personal Website URL</Label>
                        <Input id="personalWebsite" value={creatorForm.personalWebsite} onChange={handleCreatorFormChange} placeholder="https://ada.dev" />
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
                    <ul className="space-y-2 max-h-96 overflow-y-auto p-1 border rounded-md">
                        {creators.map(creator => (
                        <li key={creator.id} className="flex justify-between items-center p-3 border rounded-md bg-card-foreground/5 hover:bg-card-foreground/10">
                            <div>
                                <span className="font-medium">{creator.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">(ID: {creator.id.substring(0,6)}...)</span>
                                <p className="text-xs text-muted-foreground">{creator.location}</p>
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
                     <p className="text-muted-foreground">No creators found in Firestore. Users can sign up to create their profiles, or check mock data if Firestore is empty.</p>
                  )}
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="project-management">
           <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline">
              <div className="flex items-center gap-3">
                <ListChecks className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-semibold text-foreground">Project Management</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
                <div className="flex items-start gap-2 p-3 mb-4 bg-blue-50 border border-blue-300 rounded-md text-sm text-blue-700">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p>Projects are added via the "Share Project" page by logged-in users. Below you can view and delete projects. Full project editing is a placeholder.</p>
                </div>
                {projects.length > 0 ? (
                    <ul className="space-y-3 max-h-96 overflow-y-auto p-1 border rounded-md">
                        {projects.map(project => ( 
                        <li key={project.id} className="p-3 border rounded-md bg-card-foreground/5 space-y-1 hover:bg-card-foreground/10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{project.title} <span className="text-xs text-muted-foreground">(ID: {project.id.substring(0,6)}...)</span></p>
                                    <p className="text-xs text-muted-foreground">By {project.creatorName} (CreatorID: {project.creatorId.substring(0,6)}...)</p>
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
                            {project.projectUrl && <p className="text-xs text-muted-foreground truncate">URL: <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{project.projectUrl}</a></p>}
                            {project.techStack && project.techStack.length > 0 && <p className="text-xs text-muted-foreground truncate">Tech: {project.techStack.join(', ')}</p>}
                        </li>
                        ))}
                    </ul>
                ) : (
                     <p className="text-muted-foreground">No projects found in Firestore. Users can add projects via the "Share Project" page, or check mock data if Firestore is empty.</p>
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
    

    
