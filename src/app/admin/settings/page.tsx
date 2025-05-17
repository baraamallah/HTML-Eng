
// src/app/admin/settings/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BrushStrokeDivider } from '@/components/icons/brush-stroke-divider';
import { MOCK_CREATORS, MOCK_PROJECTS } from '@/lib/constants'; // To display current data as example
import { Settings, UserPlus, Edit3, Save, ListChecks, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// TODO: This is a prototype page. For full functionality, you'll need:
// 1. Authentication to restrict access.
// 2. A backend/database (e.g., Firebase Firestore) to store and manage this data.
// 3. API endpoints to save and fetch data.
// 4. Logic to update the main site with data from the database instead of mock constants.

export default function AdminSettingsPage() {
  const { toast } = useToast();
  // Example state for form fields - in a real app, this would come from a data store
  const [siteTitle, setSiteTitle] = useState('DevPortfolio Hub');
  const [aboutPageContent, setAboutPageContent] = useState(
    `At DevPortfolio Hub, we believe in the power of code and design to shape the future. Our mission is to provide a dynamic and supportive digital space where developers and designers can showcase their projects, connect with peers, and continuously innovate.

We aim to foster a vibrant community by celebrating the diverse talents and groundbreaking work of tech creators. Whether you're building the next big app, designing stunning UIs, or crafting elegant code, DevPortfolio Hub is your platform to shine.`
  );
  const [newCreatorName, setNewCreatorName] = useState('');
  const [newCreatorBio, setNewCreatorBio] = useState('');


  const handleSaveChanges = () => {
    // In a real application, this would send data to a backend API
    console.log('Attempting to save changes (prototype):', { siteTitle, aboutPageContent });
    toast({
      title: 'Prototype Save',
      description: 'Changes noted! In a real app, this would save to a database.',
      className: 'bg-accent text-accent-foreground border-accent',
    });
  };

  const handleAddCreator = () => {
    console.log('Attempting to add creator (prototype):', { name: newCreatorName, bio: newCreatorBio });
     toast({
      title: 'Prototype Add Creator',
      description: `${newCreatorName} would be added in a real app.`,
    });
    setNewCreatorName('');
    setNewCreatorBio('');
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
              <CardHeader className="p-0 flex-row items-center gap-3">
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
              <CardHeader className="p-0 flex-row items-center gap-3">
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
                      <Input id="newCreatorPhoto" placeholder="/img/creator-ada-lovelace.png" />
                    </div>
                    <div>
                      <Label htmlFor="newCreatorBio">Bio</Label>
                      <Textarea id="newCreatorBio" value={newCreatorBio} onChange={(e) => setNewCreatorBio(e.target.value)} placeholder="Brief bio about the creator..." />
                    </div>
                     <div>
                      <Label htmlFor="newCreatorGithub">GitHub Username (Optional)</Label>
                      <Input id="newCreatorGithub" placeholder="e.g., ada-dev" />
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
                <CardHeader className="p-0 flex-row items-center gap-3">
                    <ListChecks className="w-6 h-6 text-accent" />
                    <CardTitle className="text-2xl">Project Management</CardTitle>
                </CardHeader>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
                <p className="text-sm text-muted-foreground mb-4">Edit existing project details. Adding new projects is done via the main "Share Project" page.</p>
                <ul className="space-y-2">
                    {MOCK_PROJECTS.slice(0,3).map(project => ( // Show a few examples
                      <li key={project.id} className="flex justify-between items-center p-3 border rounded-md bg-card-foreground/5">
                        <div>
                            <p className="font-semibold">{project.title}</p>
                            <p className="text-xs text-muted-foreground">By {project.creatorName}</p>
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
                <CardHeader className="p-0 flex-row items-center gap-3">
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
                {/* Add more fields for other editable text sections here */}
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

      <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <Button size="lg" onClick={handleSaveChanges} className="pulse-gentle">
          <Save className="mr-2"/> Save All Changes (Prototype)
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Remember: This is a prototype. Changes made here are not saved to the live site.
        </p>
      </div>
    </div>
  );
}
