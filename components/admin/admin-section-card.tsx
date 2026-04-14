import { cn } from "@/lib/utils";

type AdminSectionCardProps = {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function AdminSectionCard({
  title,
  description,
  className,
  children,
}: AdminSectionCardProps) {
  return (
    <section className={cn("panel-surface rounded-2xl p-5 sm:p-6", className)}>
      <header className="mb-4 space-y-1">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description ? <p className="text-sm text-zinc-400">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}

