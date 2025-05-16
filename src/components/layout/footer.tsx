
import { BrushStrokeDivider } from "@/components/icons/brush-stroke-divider"; // Keep for thematic flair or replace later

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <BrushStrokeDivider className="mx-auto mb-4 h-6 w-32 text-muted-foreground" />
        <p className="text-sm">
          &copy; {new Date().getFullYear()} DevPortfolio Hub. Empowering developers and designers.
        </p>
        <p className="text-xs mt-2 text-muted-foreground">
          Built for the creative tech community.
        </p>
      </div>
    </footer>
  );
}
