
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
import { MOCK_CREATORS, MOCK_PROJECTS } from '@/lib/constants';
import { Settings, UserPlus, Edit3, Save, ListChecks, Globe, LogOut, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Default password for prototype
const ADMIN_PASSWORD = 'admin123'; 

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  // Example state for form fields - in a real app, this would come from a data store
  const [siteTitle, setSiteTitle] = useState('DevPortfolio Hub');
  const [aboutPageContent, setAboutPageContent] = useState(
    MOCK_CREATORS[0]?.bio || `At DevPortfolio Hub, we believe in the power of code and design...` // Example
  );
  const [newCreatorName, setNewCreatorName] = useState('');
  const [newCreatorBio, setNewCreatorBio] = useState('');
  const [newCreatorGithub, setNewCreatorGithub] = useState('');
  const [newCreatorLinkedIn, setNewCreatorLinkedIn] = useState('');
  const [newCreatorWebsite, setNewCreatorWebsite] = useState('');


  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      setShowPasswordHint(false);
      toast({ title: 'Login Successful', description: 'Welcome, Admin!' });
    } else {
      toast({ title: 'Login Failed', description: 'Incorrect password.', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({ title: 'Logged Out', description: 'You have been logged out.' });
  };

  const handleSaveChanges = () => {
    console.log('Attempting to save changes (prototype):', { siteTitle, aboutPageContent /* ... other states */ });
    toast({
      title: 'Prototype Save',
      description: 'Changes noted! In a real app, this would save to a database.',
      className: 'bg-accent text-accent-foreground border-accent',
    });
  };

  const handleAddCreator = () => {
    console.log('Attempting to add creator (prototype):', { 
      name: newCreatorName, 
      bio: newCreatorBio,
      github: newCreatorGithub,
      linkedin: newCreatorLinkedIn,
      website: newCreatorWebsite,
    });
     toast({
      title: 'Prototype Add Creator',
      description: `${newCreatorName} would be added in a real app.`,
    });
    setNewCreatorName('');
    setNewCreatorBio('');
    setNewCreatorGithub('');
    setNewCreatorLinkedIn('');
    setNewCreatorWebsite('');
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in-up">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <KeyRound className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>Enter password to manage site settings.</CardDescription>
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
              />
            </div>
             <Button onClick={() => setShowPasswordHint(!showPasswordHint)} variant="link" size="sm" className="text-xs text-muted-foreground p-0 h-auto">
              {showPasswordHint ? <EyeOff className="mr-1" /> : <Eye className="mr-1" />}
              {showPasswordHint ? 'Hide' : 'Forgot Password? (Hint)'}
            </Button>
            {showPasswordHint && (
              <p className="text-xs text-primary bg-primary/10 p-2 rounded-md">
                Prototype password is: <strong>{ADMIN_PASSWORD}</strong>
              </p>
            )}
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
        <h1 className="text-4xl font-bold text-primary mb-2">Admin Settings</h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Manage your DevPortfolio Hub content. (This is a prototype page)
        </p>
        <BrushStrokeDivider className="mx-auto mt-4 h-6 w-32 text-primary/50" />
      </header>

      <Accordion type="multiple" defaultValue={['site-config', 'creator-management']} className="w-full space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        <AccordionItem value="site-config">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline">
              <CardHeader className="p-0 flex-row items-center gap-3 w-full"> {/* Added w-full for proper trigger behavior */}
                <Globe className="w-6 h-6 text-accent" />
                <CardTitle className="text-2xl">Site Configuration</CardTitle>
              </CardHeader>
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
                  <Input id="navHomeLink" defaultValue="Home" />
                </div>
                 <div>
                  <Label htmlFor="navHomeHref">Navbar "Home" Link Href</Label>
                  <Input id="navHomeHref" defaultValue="/" />
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="creator-management">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline">
              <CardHeader className="p-0 flex-row items-center gap-3 w-full">
                 <UserPlus className="w-6 h-6 text-accent" />
                <CardTitle className="text-2xl">Creator Management</CardTitle>
              </CardHeader>
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
                      <Label htmlFor="newCreatorPhoto">Photo URL</Label>
                      <Input id="newCreatorPhoto" placeholder="/img/creator-new.png (will be stored in /public/img)" />
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
                    <Button onClick={handleAddCreator}><UserPlus className="mr-2"/>Add Creator (Prototype)</Button>
                  </CardFooter>
                </Card>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Creators:</h3>
                  <ul className="space-y-2">
                    {MOCK_CREATORS.map(creator => (
                      <li key={creator.id} className="flex justify-between items-center p-3 border rounded-md bg-card-foreground/5">
                        <span>{creator.name}</span>
                        <Button variant="outline" size="sm"><Edit3 className="mr-2"/>Edit (Prototype)</Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="project-management">
           <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline">
                <CardHeader className="p-0 flex-row items-center gap-3 w-full">
                    <ListChecks className="w-6 h-6 text-accent" />
                    <CardTitle className="text-2xl">Project Management</CardTitle>
                </CardHeader>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
                <p className="text-sm text-muted-foreground mb-4">Edit existing project details. Adding new projects is done via the main "Share Project" page.</p>
                <ul className="space-y-2">
                    {MOCK_PROJECTS.slice(0,3).map(project => ( 
                      <li key={project.id} className="flex justify-between items-center p-3 border rounded-md bg-card-foreground/5">
                        <div>
                            <p className="font-semibold">{project.title}</p>
                            <p className="text-xs text-muted-foreground">By {project.creatorName}</p>
                             {project.projectUrl && <p className="text-xs text-muted-foreground truncate">URL: {project.projectUrl}</p>}
                             {project.techStack && project.techStack.length > 0 && <p className="text-xs text-muted-foreground truncate">Tech: {project.techStack.join(', ')}</p>}
                        </div>
                        <Button variant="outline" size="sm"><Edit3 className="mr-2"/>Edit Project (Prototype)</Button>
                      </li>
                    ))}
                  </ul>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="page-content">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-6 hover:no-underline">
                <CardHeader className="p-0 flex-row items-center gap-3 w-full">
                    <Edit3 className="w-6 h-6 text-accent" />
                    <CardTitle className="text-2xl">Page Content Editor</CardTitle>
                </CardHeader>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="aboutPageContent">"About Us" Page - Main Content</Label>
                  <Textarea id="aboutPageContent" value={aboutPageContent} onChange={(e) => setAboutPageContent(e.target.value)} rows={8} />
                   <p className="text-xs text-muted-foreground mt-1">This is the main mission statement text on the About page.</p>
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

      <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="space-x-4">
          <Button size="lg" onClick={handleSaveChanges} className="pulse-gentle">
            <Save className="mr-2"/> Save All Changes (Prototype)
          </Button>
          <Button size="lg" variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2"/> Logout
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Remember: This is a prototype. Changes made here are not saved to the live site.
        </p>
      </div>
    </div>
  );
}

