import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

export default function ArchitectPlaceholderPage() {
  const location = useLocation();
  const pageName = location.pathname.split("/").pop()?.replace(/-/g, " ") || "page";

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center py-20">
      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-4">
        <Construction className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-semibold capitalize">{pageName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">This architect module is coming soon.</p>
    </div>
  );
}
