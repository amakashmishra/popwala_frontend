import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clearPortalSession } from "@/lib/portalAuth";

export default function ArchitectHeader() {
  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 md:px-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search projects, clients..." className="pl-9 h-9 text-sm bg-muted/30" />
      </div>
      <div className="ml-4 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearPortalSession();
            window.location.href = "/architect/login";
          }}
        >
          Logout
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
    </header>
  );
}
