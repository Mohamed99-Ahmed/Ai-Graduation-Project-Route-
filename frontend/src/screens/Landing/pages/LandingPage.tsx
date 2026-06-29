import { Sparkles } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            <span>Lumio</span>
          </div>
        </div>
      </header>

    </div>
  );
}
