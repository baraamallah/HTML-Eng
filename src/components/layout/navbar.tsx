
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code2, Settings, User, LogOut, LayoutDashboard, UploadCloud, UserPlus } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/'); // Redirect to homepage after logout
    } catch (e: any) {
      toast({ title: 'Logout Failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <nav className="bg-card text-card-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">DevPortfolio Hub</h1>
        </Link>
        <div className="space-x-1 md:space-x-2 flex items-center">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/gallery">Showcase</Link>
          </Button>
          {/* Removed Creators link */}
          <Button variant="ghost" asChild>
            <Link href="/about">About</Link>
          </Button>

          {loading && <Button variant="ghost" disabled>Loading...</Button>}
          
          {!loading && user && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/upload"><UploadCloud className="mr-2 h-4 w-4" /> Share Project</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/dashboard/my-projects"><LayoutDashboard className="mr-2 h-4 w-4" /> My Projects</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          )}

          {!loading && !user && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login"><User className="mr-2 h-4 w-4" /> Login</Link>
              </Button>
              <Button variant="default" asChild className="pulse-gentle">
                <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" /> Sign Up</Link>
              </Button>
            </>
          )}
          
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/settings" aria-label="Admin Settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
