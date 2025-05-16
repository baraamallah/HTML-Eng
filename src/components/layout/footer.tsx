import { BrushStrokeDivider } from "@/components/icons/brush-stroke-divider";

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <BrushStrokeDivider className="mx-auto mb-4 h-6 w-32 text-muted-foreground" />
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Artful Aging. Celebrating creativity at every age.
        </p>
        <p className="text-xs mt-2 text-muted-foreground">
          Designed with love for senior artists.
        </p>
      </div>
    </footer>
  );
}
