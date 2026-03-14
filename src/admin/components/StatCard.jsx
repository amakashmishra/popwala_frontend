import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ label, value, icon: Icon, trend, trendUp }) {
  return (
    <Card className="shadow-[var(--shadow-sm)]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold font-display">{value}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        {trend ? (
          <p className={`mt-2 text-xs font-medium ${trendUp ? "text-primary" : "text-destructive"}`}>
            {trend}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
