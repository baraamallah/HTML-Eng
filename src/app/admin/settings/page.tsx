
// src/app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { MOCK_CREATORS, MOCK_PROJECTS } from '@/lib/constants'; // Still used for initial state before "fetching"
import type { Creator as CreatorType, Project as ProjectType } from '@/types';
import { Settings, UserPlus, Edit3, Save, ListChecks, Globe, LogOut, KeyRound, ServerOff, Server } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // State for data that would be fetched from a backend
  const [siteTitle, setSiteTitle] = useState('DevPortfolio Hub');
  const [navHomeLink, setNavHomeLink] = useState('Home');
  const [navHomeHref, setNavHomeHref] = useState('/');
  const [aboutPageContent, setAboutPageContent] = useState(
    MOCK_CREATORS[0]?.bio || `At DevPortfolio Hub, we believe in the power of code and design...`
  );
  const [creators, setCreators] = useState<CreatorType[]>(MOCK_CREATORS);
  const [projects, setProjects] = useState<ProjectType[]>(MOCK_PROJECTS.slice(0,3)); // Display a subset for brevity

  // Form state for adding a new creator
  const [newCreatorName, setNewCreatorName] = useState('');
  const [newCreatorPhotoUrl, setNewCreatorPhotoUrl] = useState('');
  const [newCreatorBio, setNewCreatorBio] = useState('');
  const [newCreatorGithub, setNewCreatorGithub] = useState('');
  const [newCreatorLinkedIn, setNewCreatorLinkedIn] = useState('');
  const [newCreatorWebsite, setNewCreatorWebsite] = useState('');

  // Simulate fetching initial data on mount if authenticated (conceptual)
  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, you'd fetch this data from your backend API
      // For now, we'll use mock data as initial state
      console.log('Conceptual: Fetching initial admin data...');
      setSiteTitle('DevPortfolio Hub'); // Example: fetched value
      setNavHomeLink('Home');
      setNavHomeHref('/');
      setAboutPageContent(MOCK_CREATORS[0]?.bio || 'Default about content from "server"');
      setCreators(MOCK_CREATORS);
      setProjects(MOCK_PROJECTS.slice(0,3));
      toast({ title: 'Admin Data Loaded', description: 'Content ready for editing (simulated fetch).' });
    }
  }, [isAuthenticated, toast]);

  const handleLogin = async () => {
    // TODO: Implement actual API call to your backend for authentication
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ password }),
    // });
    // if (response.ok) {
    //   const { token } = await response.json();
    //   localStorage.setItem('adminToken', token); // Store auth token
    //   setIsAuthenticated(true);
    //   setPassword('');
    //   toast({ title: 'Login Successful', description: 'Welcome, Admin!' });
    // } else {
    //   toast({ title: 'Login Failed', description: 'Invalid credentials.', variant: 'destructive' });
    // }

    // For now, let's simulate a successful login if any password is typed
    if (password) {
        setIsAuthenticated(true);
        setPassword('');
        toast({ title: 'Login Successful (Prototype)', description: 'Backend auth pending. Welcome, Admin!' });
    } else {
        toast({ title: 'Login Failed (Prototype)', description: 'Please enter a password.', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    // TODO: Implement actual API call to your backend for logout if needed
    // localStorage.removeItem('adminToken'); // Clear auth token
    setIsAuthenticated(false);
    toast({ title: 'Logged Out', description: 'You have been logged out.' });
  };

  const handleSaveChanges = async () => {
    const settingsPayload = {
      siteTitle,
      navHomeLink,
      navHomeHref,
      aboutPageContent,
      // ... other site-wide settings
    };
    console.log('Attempting to save changes:', settingsPayload);
    // TODO: Implement API call to save settings to backend
    // try {
    //   const response = await fetch('/api/admin/settings', {
    //     method: 'POST', // or PUT
    //     headers: { 
    //       'Content-Type': 'application/json',
    //       // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
    //     },
    //     body: JSON.stringify(settingsPayload),
    //   });
    //   if (response.ok) {
    //     toast({ title: 'Success', description: 'All changes saved to server.' });
    //   } else {
    //     toast({ title: 'Error Saving', description: 'Could not save changes to server.', variant: 'destructive' });
    //   }
    // } catch (error) {
    //   toast({ title: 'Network Error', description: 'Failed to connect to server.', variant: 'destructive' });
    // }
    toast({
      title: 'Save Action Triggered',
      description: 'Data prepared. Backend implementation needed to save.',
      className: 'bg-accent text-accent-foreground border-accent',
      icon: <Server className="h-5 w-5" />
    });
  };

  const handleAddCreator = async () => {
    const creatorData = { 
      name: newCreatorName, 
      photoUrl: newCreatorPhotoUrl,
      bio: newCreatorBio,
      githubUsername: newCreatorGithub,
      linkedInProfile: newCreatorLinkedIn,
      personalWebsite: newCreatorWebsite,
    };
    console.log('Attempting to add creator:', creatorData);
    // TODO: Implement API call to add creator to backend
    // try {
    //   const response = await fetch('/api/admin/creators', {
    //     method: 'POST',
    //     headers: { 
    //       'Content-Type': 'application/json',
    //       // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    //      },
    //     body: JSON.stringify(creatorData),
    //   });
    //   if (response.ok) {
    //     const newCreatorFromServer = await response.json();
    //     setCreators(prev => [...prev, newCreatorFromServer]); // Update local state with response from server
    //     toast({ title: 'Creator Added', description: `${newCreatorName || 'New creator'} added successfully.` });
    //     setNewCreatorName(''); setNewCreatorPhotoUrl(''); setNewCreatorBio(''); setNewCreatorGithub(''); setNewCreatorLinkedIn(''); setNewCreatorWebsite(''); // Clear form
    //   } else {
    //     toast({ title: 'Error Adding Creator', description: 'Could not add creator.', variant: 'destructive' });
    //   }
    // } catch (error) {
    //   toast({ title: 'Network Error', description: 'Failed to connect to server.', variant: 'destructive' });
    // }
     toast({
      title: 'Add Creator Action',
      description: `${newCreatorName || 'New creator'} data prepared. Backend needed.`,
      icon: <UserPlus className="h-5 w-5" />
    });
    // For prototype: clear form (actual state update would come from server response)
    setNewCreatorName(''); setNewCreatorPhotoUrl(''); setNewCreatorBio(''); setNewCreatorGithub(''); setNewCreatorLinkedIn(''); setNewCreatorWebsite('');
  }

  const handleEditCreator = (creatorName: string) => {
    // TODO: Implement logic to populate an edit form and then make an API call
    toast({
      title: 'Edit Creator Action',
      description: `Editing for ${creatorName} would send data to backend.`,
      icon: <Edit3 className="h-5 w-5" />
    });
  };

  const handleEditProject = (projectTitle: string) => {
    // TODO: Implement logic to populate an edit form and then make an API call
    toast({
      title: 'Edit Project Action',
      description: `Editing for ${projectTitle} would send data to backend.`,
      icon: <Edit3 className="h-5 w-5" />
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in-up">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <KeyRound className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>Enter your password to manage site settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input 
                id="admin-password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
              />
            </div>
             {/* Removed "Forgot Password" hint as it's tied to hardcoded prototype password */}
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin} className="w-full">Login</Button>
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
          Manage your DevPortfolio Hub content. (Backend integration pending for full functionality)
        </p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      <Accordion type="multiple" defaultValue={['site-config']} className="w-full space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        <AccordionItem value="site-config">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline text-left">
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
                  <p className="text-xs text-muted-foreground mt-1">This appears in the browser tab and navbar.</p>
                </div>
                <div>
                  <Label htmlFor="navHomeLink">Navbar "Home" Link Text</Label>
                  <Input id="navHomeLink" value={navHomeLink} onChange={(e) => setNavHomeLink(e.target.value)} />
                </div>
                 <div>
                  <Label htmlFor="navHomeHref">Navbar "Home" Link Href</Label>
                  <Input id="navHomeHref" value={navHomeHref} onChange={(e) => setNavHomeHref(e.target.value)} />
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="creator-management">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline text-left">
                <div className="flex items-center gap-3">
                    <UserPlus className="w-6 h-6 text-accent" />
                    <h3 className="text-2xl font-semibold text-foreground">Creator Management</h3>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Add New Creator</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="newCreatorName">Creator Name</Label>
                      <Input id="newCreatorName" value={newCreatorName} onChange={(e) => setNewCreatorName(e.target.value)} placeholder="e.g., Ada Lovelace" />
                    </div>
                    <div>
                      <Label htmlFor="newCreatorPhotoUrl">Photo URL Path</Label>
                      <Input id="newCreatorPhotoUrl" value={newCreatorPhotoUrl} onChange={(e) => setNewCreatorPhotoUrl(e.target.value)} placeholder="e.g., /img/creator-new.png (in public/img)" />
                    </div>
                    <div>
                      <Label htmlFor="newCreatorBio">Bio</Label>
                      <Textarea id="newCreatorBio" value={newCreatorBio} onChange={(e) => setNewCreatorBio(e.target.value)} placeholder="Brief bio about the creator..." />
                    </div>
                     <div>
                      <Label htmlFor="newCreatorGithub">GitHub Username</Label>
                      <Input id="newCreatorGithub" value={newCreatorGithub} onChange={(e) => setNewCreatorGithub(e.target.value)} placeholder="e.g., ada-dev" />
                    </div>
                    <div>
                      <Label htmlFor="newCreatorLinkedIn">LinkedIn Profile URL</Label>
                      <Input id="newCreatorLinkedIn" value={newCreatorLinkedIn} onChange={(e) => setNewCreatorLinkedIn(e.target.value)} placeholder="https://linkedin.com/in/ada-dev" />
                    </div>
                    <div>
                      <Label htmlFor="newCreatorWebsite">Personal Website URL</Label>
                      <Input id="newCreatorWebsite" value={newCreatorWebsite} onChange={(e) => setNewCreatorWebsite(e.target.value)} placeholder="https://ada.dev" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddCreator}><UserPlus className="mr-2"/>Add Creator</Button>
                  </CardFooter>
                </Card>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Creators (from initial load):</h3>
                  {creators.length > 0 ? (
                    <ul className="space-y-2">
                        {creators.map(creator => (
                        <li key={creator.id} className="flex justify-between items-center p-3 border rounded-md bg-card-foreground/5">
                            <span>{creator.name}</span>
                            <Button variant="outline" size="sm" onClick={() => handleEditCreator(creator.name)}>
                                <Edit3 className="mr-2"/>Edit
                            </Button>
                        </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No creators loaded or none exist in the database.</p>
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
                    <ListChecks className="w-6 h-6 text-accent" />
                    <h3 className="text-2xl font-semibold text-foreground">Project Management</h3>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
                <p className="text-sm text-muted-foreground mb-4">Edit existing project details. Adding new projects is done via the main "Share Project" page which would also save to the backend.</p>
                {projects.length > 0 ? (
                    <ul className="space-y-3">
                        {projects.map(project => ( 
                        <li key={project.id} className="p-3 border rounded-md bg-card-foreground/5 space-y-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{project.title}</p>
                                    <p className="text-xs text-muted-foreground">By {project.creatorName}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleEditProject(project.title)}>
                                    <Edit3 className="mr-2"/>Edit
                                </Button>
                            </div>
                            {project.projectUrl && <p className="text-xs text-muted-foreground truncate">URL: <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{project.projectUrl}</a></p>}
                            {project.techStack && project.techStack.length > 0 && <p className="text-xs text-muted-foreground truncate">Tech: {project.techStack.join(', ')}</p>}
                        </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">No projects loaded or none exist in the database.</p>
                )}
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="page-content">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline text-left">
                <div className="flex items-center gap-3">
                    <Edit3 className="w-6 h-6 text-accent" />
                    <h3 className="text-2xl font-semibold text-foreground">Page Content Editor</h3>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="aboutPageContent">"About Us" Page - Main Content</Label>
                  <Textarea id="aboutPageContent" value={aboutPageContent} onChange={(e) => setAboutPageContent(e.target.value)} rows={8} />
                   <p className="text-xs text-muted-foreground mt-1">This is the main mission statement text on the About page.</p>
                </div>
                {/* Add more fields for other editable page content as needed */}
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

      <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="space-x-4">
          <Button size="lg" onClick={handleSaveChanges} className="pulse-gentle">
            <Save className="mr-2"/> Save All Changes
          </Button>
          <Button size="lg" variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2"/> Logout
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
          <ServerOff className="h-4 w-4 text-destructive" /> Backend not connected. Changes are not saved live.
        </p>
      </div>
    </div>
  );
}

    