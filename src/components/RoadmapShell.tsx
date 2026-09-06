import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";

export function RoadmapShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader />
      <main className="flex-1 pt-[8.5rem] sm:pt-[9rem]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
      </main>
      <PageFooter />
    </div>
  );
}
