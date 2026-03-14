import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ClipboardList, Users } from "lucide-react";

export default function ArchitectDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold">Architect Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage design projects, tasks and client requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard icon={FolderKanban} label="Active Projects" value="12" />
        <MetricCard icon={ClipboardList} label="Pending Tasks" value="28" />
        <MetricCard icon={Users} label="Clients" value="17" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This is the architect panel root route at <code>/architect/</code>.
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-display font-semibold">{value}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
