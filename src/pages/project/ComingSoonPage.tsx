import { LucideIcon, Clock } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  features?: string[];
}

export function ComingSoonPage({ title, description, icon: Icon, features }: ComingSoonPageProps) {
  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[500px] text-center">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        {Icon ? <Icon className="h-8 w-8 text-primary" /> : <Clock className="h-8 w-8 text-primary" />}
      </div>
      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider mb-4">
        Coming Soon
      </span>
      <h1 className="text-3xl font-bold mb-3">{title}</h1>
      <p className="text-muted-foreground text-base leading-relaxed mb-8">{description}</p>
      {features && features.length > 0 && (
        <div className="w-full bg-muted/30 border rounded-xl p-6 text-left space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Planned Features</p>
          {features.map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
              {f}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
