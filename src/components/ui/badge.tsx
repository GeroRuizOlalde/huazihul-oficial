import * as React from "react";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement>;

export function Badge({ className = "", ...props }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 ${className}`}
      {...props}
    />
  );
}
