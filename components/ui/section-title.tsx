import { cn } from "@/lib/utils";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("space-y-3 text-center sm:text-left", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-accent]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto max-w-2xl text-sm text-zinc-400 sm:mx-0 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

